import { useRef, useEffect, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Group, Text } from 'react-konva';
import Konva from 'konva';
import { calcLayout } from './layout';
import { getLogoPath } from '../../data/camera-logos';
import type { RenderConfig, ImageTier, LayoutResult } from './types';

interface WebRendererProps {
  config: RenderConfig;
  imageTier: ImageTier | null;
  containerWidth: number;
  containerHeight: number;
}

// Module-level logo cache — persists across re-renders
const logoCache = new Map<string, HTMLImageElement>();

function loadLogo(brand: string): Promise<HTMLImageElement | null> {
  const cached = logoCache.get(brand);
  if (cached) return Promise.resolve(cached);

  const src = getLogoPath(brand);
  if (!src) return Promise.resolve(null);

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoCache.set(brand, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export interface WebRendererHandle {
  exportImage: (pixelRatio?: number) => Promise<Blob | null>;
}

export const WebRenderer = forwardRef<WebRendererHandle, WebRendererProps>(
  ({ config, imageTier, containerWidth, containerHeight }, ref) => {
  const stageRef = useRef<Konva.Stage>(null);
  const bgImgRef = useRef<Konva.Image>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [logoKonvaImg, setLogoKonvaImg] = useState<HTMLImageElement | null>(null);
  const prevSrcRef = useRef<string>('');

  // Load original image
  useEffect(() => {
    if (!imageTier) {
      setOriginalImg(null);
      return;
    }
    const src = imageTier.original;
    if (src === prevSrcRef.current && originalImg) return;
    prevSrcRef.current = src;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setOriginalImg(img);
    img.src = src;
  }, [imageTier]);

  // Load logo image from cache/assets/SVG
  useEffect(() => {
    if (!config.frame.watermark.logo) {
      setLogoKonvaImg(null);
      return;
    }

    const brand = config.frame.watermark.logo;

    // Check cache first
    const cached = logoCache.get(brand);
    if (cached) {
      setLogoKonvaImg(cached);
      return;
    }

    loadLogo(brand).then((img) => {
      if (img) setLogoKonvaImg(img);
    });
  }, [config.frame.watermark.logo]);

  // Cache blur background when image changes or blur is enabled/disabled
  useEffect(() => {
    const node = bgImgRef.current;
    if (node && originalImg) {
      node.cache();
    }
  }, [originalImg, config.frame.blurRadius ? 1 : 0]);

  // Stage scale: fit image within 90 % of container
  const stageScale = useMemo(() => {
    if (!imageTier || containerWidth === 0 || containerHeight === 0) return 1;
    const { width, height } = imageTier.size;
    if (width <= containerWidth * 0.9 && height <= containerHeight * 0.9) return 1;
    const sx = (containerWidth / width) * 0.9;
    const sy = (containerHeight / height) * 0.9;
    return Math.min(sx, sy);
  }, [imageTier, containerWidth, containerHeight]);

  const imgW = imageTier?.size.width ?? 0;
  const imgH = imageTier?.size.height ?? 0;
  const contentW = Math.round(imgW * stageScale);
  const contentH = Math.round(imgH * stageScale);

  // Store image dimensions in refs so exportImage can read them at call time
  const imgSizeRef = useRef({ imgW, imgH, stageScale, contentW, contentH });
  imgSizeRef.current = { imgW, imgH, stageScale, contentW, contentH };

  useImperativeHandle(ref, () => ({
    exportImage: async (pixelRatio?: number) => {
      bgImgRef.current?.cache();
      await new Promise((r) => requestAnimationFrame(r));
      const stage = stageRef.current;
      if (!stage) return null;
      const { imgW: w, imgH: h, contentW: cw, contentH: ch } = imgSizeRef.current;
      if (cw <= 0 || ch <= 0) return null;
      // Auto-calculate pixelRatio for near-native resolution (capped at 4x)
      const pr = pixelRatio ?? Math.min(Math.ceil(Math.max(w / cw, h / ch)), 4);
      const dataUrl = stage.toDataURL({
        pixelRatio: pr,
        mimeType: 'image/jpeg',
        quality: 0.92,
      } as unknown as Record<string, unknown>);
      const res = await fetch(dataUrl);
      return res.blob();
    },
  }), []);

  if (!imageTier || !originalImg) return null;

  const layout = calcLayout(config, imageTier.size);

  return (
    <Stage ref={stageRef} width={contentW} height={contentH}>
      <Layer>
        <Group scaleX={stageScale} scaleY={stageScale}>
          {/* Blur background — full image with Konva Blur filter */}
          <KonvaImage
            ref={bgImgRef}
            image={originalImg}
            x={0} y={0}
            width={imgW} height={imgH}
            blurRadius={config.frame.blurRadius}
            filters={config.frame.blurRadius > 0 ? [Konva.Filters.Blur] : undefined}
          />

          {/* Foreground photo — 80 % size, rounded corners + shadow */}
          <KonvaImage
            image={originalImg}
            x={layout.photoRect.x}
            y={layout.photoRect.y}
            width={layout.photoRect.width}
            height={layout.photoRect.height}
            cornerRadius={layout.photoRect.cornerRadius}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={config.frame.shadowOffset}
            shadowOffset={{ x: 0, y: Math.max(config.frame.shadowOffset, 1) }}
          />

          {/* Watermark — overlaid on blur background, no bar */}
          {renderWatermark(config, layout, logoKonvaImg)}
        </Group>
      </Layer>
    </Stage>
  );
});

function renderWatermark(
  config: RenderConfig,
  layout: LayoutResult,
  logoKonvaImg: HTMLImageElement | null,
) {
  const { watermark } = config.frame;
  const { x: centerX, y: centerY } = layout.watermarkPosition;
  const hasLogo = !!watermark.logo && !!logoKonvaImg;
  const hasModel = watermark.model.trim().length > 0;
  const hasExif = watermark.exifText.trim().length > 0;
  if (!hasLogo && !hasModel && !hasExif) return null;

  const fontSize = Math.max(watermark.fontSize, 12);
  const children: React.ReactNode[] = [];
  let key = 0;

  // Per-brand logo size multiplier
  const brandScale: Record<string, number> = { Leica: 1.8, DJI: 1.8 };
  const logoHeight = fontSize * (brandScale[watermark.logo ?? ''] ?? 1.4);
  const logoWidth = logoKonvaImg
    ? logoHeight * (logoKonvaImg.naturalWidth / logoKonvaImg.naturalHeight)
    : 0;

  const logoToParamsGap = fontSize * 0.8;
  const paramsGap = fontSize * 1.2;
  const paramsY = centerY - fontSize / 2;

  // Logo — centered, above params if params exist
  if (hasLogo) {
    const logoY = (hasModel || hasExif)
      ? paramsY - logoToParamsGap - logoHeight
      : centerY - logoHeight / 2;
    children.push(
      <KonvaImage
        key={key++}
        image={logoKonvaImg!}
        x={centerX - logoWidth / 2}
        y={logoY}
        width={logoWidth}
        height={logoHeight}
      />,
    );
  }

  // Params — Model + EXIF on the same line
  if (hasModel || hasExif) {
    const modelW = hasModel ? estimateTextWidth(watermark.model, fontSize) : 0;
    const exifW = hasExif ? estimateTextWidth(watermark.exifText, fontSize) : 0;
    const lineW = modelW + exifW + (hasModel && hasExif ? paramsGap : 0);
    const lineX = centerX - lineW / 2;

    if (hasModel) {
      children.push(
        <Text
          key={key++}
          x={lineX} y={paramsY}
          text={watermark.model}
          fontSize={fontSize}
          fill={watermark.fontColor}
          fontFamily={watermark.fontFamily}
        />,
      );
    }
    if (hasExif) {
      children.push(
        <Text
          key={key++}
          x={lineX + modelW + (hasModel ? paramsGap : 0)} y={paramsY}
          text={watermark.exifText}
          fontSize={fontSize}
          fill={watermark.fontColor}
          fontFamily={watermark.fontFamily}
          opacity={0.8}
        />,
      );
    }
  }

  return <>{children}</>;
}

function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}
