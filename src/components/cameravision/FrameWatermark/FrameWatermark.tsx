import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasPreview } from './CanvasPreview';
import { SettingPanel } from './SettingPanel';
import type { RenderConfig, ImageTier } from '../../../utils/frame-renderer/types';
import type { WebRendererHandle } from '../../../utils/frame-renderer/web-renderer';
import { formatExif } from '../../../utils/frame-renderer/exif-formatter';
import { detectBrandFromExif } from '../../../utils/frame-renderer/exif-brand';
import { parseExif } from '../../../utils/exif-parser';

const DEFAULT_CONFIG: RenderConfig = {
  frame: {
    blurRadius: 150,
    cornerRadius: 40,
    shadowOffset: 100,
    watermark: {
      logo: null,
      model: '',
      exifText: '',
      fontFamily: 'Arial',
      fontSize: 100,
      fontColor: '#ffffff',
    },
  },
  maxDimension: 6000,
};

function createImageTier(file: File): Promise<ImageTier> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const original = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        const { width, height } = img;
        // Generate thumbnail (max 200px)
        const thumbScale = Math.min(200 / width, 200 / height, 1);
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = Math.round(width * thumbScale);
        thumbCanvas.height = Math.round(height * thumbScale);
        const thumbCtx = thumbCanvas.getContext('2d')!;
        thumbCtx.drawImage(img, 0, 0, thumbCanvas.width, thumbCanvas.height);
        const thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.7);

        // Generate preview (max 1200px)
        const previewScale = Math.min(1200 / width, 1200 / height, 1);
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = Math.round(width * previewScale);
        previewCanvas.height = Math.round(height * previewScale);
        const previewCtx = previewCanvas.getContext('2d')!;
        previewCtx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
        const preview = previewCanvas.toDataURL('image/jpeg', 0.85);

        resolve({ thumbnail, preview, original, size: { width, height } });
      };
      img.src = original;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface PhotoEntry {
  id: string;
  tier: ImageTier;
  file: File;
  exif?: Record<string, unknown>;
}

export function FrameWatermark() {
  const [config, setConfig] = useState<RenderConfig>(DEFAULT_CONFIG);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const webRendererRef = useRef<WebRendererHandle>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  const [exifText, setExifText] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await webRendererRef.current?.exportImage();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `cameravision-${Date.now()}.jpg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, []);

  // ResizeObserver for container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: Math.round(entry.contentRect.width),
          height: Math.round(entry.contentRect.height),
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files).filter((f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f.name),
    );
    if (imageFiles.length === 0) return;

    const entries: PhotoEntry[] = [];
    for (const file of imageFiles) {
      try {
        const tier = await createImageTier(file);
        const exif = await parseExif(file, { pick: ['Make', 'Model', 'FocalLength', 'FNumber', 'ExposureTime', 'ISOSpeedRatings'] });
        entries.push({ id: crypto.randomUUID(), tier, file, exif });
        // Auto-detect brand & model from EXIF
        const wmUpdate: Record<string, string | null> = {};
        if (exif.Make) {
          const detectedBrand = detectBrandFromExif(exif.Make as string);
          if (detectedBrand) wmUpdate.logo = detectedBrand;
        }
        if (exif.Model) {
          wmUpdate.model = String(exif.Model);
        }
        if (Object.keys(wmUpdate).length > 0) {
          setConfig((prev) => ({
            ...prev,
            frame: {
              ...prev.frame,
              watermark: { ...prev.frame.watermark, ...wmUpdate },
            },
          }));
        }
      } catch {
        entries.push({ id: crypto.randomUUID(), tier: await createImageTier(file), file });
      }
    }
    if (entries.length === 0) return;

    setPhotos((prev) => [...prev, ...entries]);
    if (activeIndex < 0) {
      setActiveIndex(0);
    }
  }, [config.maxDimension, activeIndex]);

  const handleSelectPhoto = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-fill EXIF text when active photo changes
  useEffect(() => {
    if (activeIndex < 0) {
      setExifText('');
      return;
    }
    const photo = photos[activeIndex];
    if (photo?.exif) {
      const formatted = formatExif({
        focalLength: photo.exif.FocalLength as number | undefined,
        fNumber: photo.exif.FNumber as number | undefined,
        exposureTime: photo.exif.ExposureTime as number | undefined,
        isoSpeed: photo.exif.ISOSpeedRatings as number | undefined,
      });
      setExifText(formatted);
    } else {
      setExifText('');
    }
  }, [activeIndex, photos]);

  // Sync exifText state into config so WebRenderer renders it on canvas
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        watermark: { ...prev.frame.watermark, exifText },
      },
    }));
  }, [exifText]);

  const configRafRef = useRef<number>(0);

  const updateConfig = useCallback((partial: Partial<RenderConfig>) => {
    cancelAnimationFrame(configRafRef.current);
    configRafRef.current = requestAnimationFrame(() => {
      setConfig((prev) => ({ ...prev, ...partial }));
    });
  }, []);

  const activePhoto = activeIndex >= 0 ? photos[activeIndex] : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '16px',
      height: '100%',
      minHeight: '500px',
      fontFamily: "'Noto Sans SC', sans-serif",
    }}>
      {/* Canvas preview area — centered with capped size */}
      <div style={{
        flex: isMobile ? 'none' : 1,
        height: isMobile ? '50%' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isMobile ? '200px' : '400px',
      }}>
        <div ref={containerRef} style={{
          width: '100%',
          height: '100%',
          background: 'var(--color-bg)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {!activePhoto && (
            <span style={{
              fontSize: '16px',
              color: 'rgba(210,255,254,0.4)',
              fontFamily: "'Noto Sans SC', sans-serif",
            }}>请导入照片</span>
          )}
          <CanvasPreview
            ref={webRendererRef}
            config={config}
            imageTier={activePhoto?.tier ?? null}
            containerWidth={containerSize.width}
            containerHeight={containerSize.height}
          />
        </div>
      </div>

      {/* Right panel */}
      <SettingPanel
        config={config}
        photos={photos}
        activeIndex={activeIndex}
        exifText={exifText}
        isMobile={isMobile}
        onFiles={handleFiles}
        onSelectPhoto={handleSelectPhoto}
        onUpdateConfig={updateConfig}
        onExifTextChange={setExifText}
        onExport={handleExport}
        exporting={exporting}
      />
    </div>
  );
}
