import { useReducer, useCallback, useEffect, useState } from 'react';
import { ImageImporter } from '../shared/ImageImporter';
import { useExifParser } from '../../../hooks/useExifParser';
import { computeHistogramFromImage, detectExposureWarnings } from '../../../utils/histogram';
import { extractDominantColors } from '../../../utils/color-extract';
import { scaleImageForKMeans } from '../../../utils/histogram';
import { exifToPhotoEntry, generateThumbnail } from '../../../utils/photo-entry-formatter';
import type { PhotoEntry } from '../../../utils/photo-entry-formatter';
import type { HistogramData, ExposureWarning } from '../../../utils/histogram';
import type { DominantColor } from '../../../utils/color-extract';
import type { ExifParseResult } from '../../../hooks/useExifParser';
import { ExifPanel } from './ExifPanel';
import { Histogram } from './Histogram';
import { ColorExtractor } from './ColorExtractor';
import { PhotoEntryEditor } from './PhotoEntryEditor';

type AnalysisState =
  | { phase: 'idle' }
  | { phase: 'loading'; file: File }
  | { phase: 'parsed'; file: File; imageUrl: string; thumbnailUrl: string; image: HTMLImageElement }
  | { phase: 'analyzing'; file: File; imageUrl: string; thumbnailUrl: string; image: HTMLImageElement; exif: ExifParseResult }
  | { phase: 'ready'; file: File; imageUrl: string; thumbnailUrl: string; image: HTMLImageElement; exif: ExifParseResult; histogram: HistogramData; exposureWarning: ExposureWarning; colors: DominantColor[]; photoEntry: PhotoEntry };

type Action =
  | { type: 'START_LOADING'; file: File }
  | { type: 'LOADED'; file: File; imageUrl: string; thumbnailUrl: string; image: HTMLImageElement }
  | { type: 'EXIF_PARSED'; exif: ExifParseResult }
  | { type: 'ANALYSIS_COMPLETE'; histogram: HistogramData; exposureWarning: ExposureWarning; colors: DominantColor[]; photoEntry: PhotoEntry }
  | { type: 'UPDATE_PHOTO_ENTRY'; entry: PhotoEntry }
  | { type: 'RESET' };

function reducer(state: AnalysisState, action: Action): AnalysisState {
  switch (action.type) {
    case 'START_LOADING':
      return { phase: 'loading', file: action.file };
    case 'LOADED':
      return { phase: 'parsed', file: action.file, imageUrl: action.imageUrl, thumbnailUrl: action.thumbnailUrl, image: action.image };
    case 'EXIF_PARSED':
      if (state.phase !== 'parsed') return state;
      return { ...state, phase: 'analyzing', exif: action.exif };
    case 'ANALYSIS_COMPLETE':
      if (state.phase !== 'analyzing') return state;
      return { ...state, phase: 'ready', ...action };
    case 'UPDATE_PHOTO_ENTRY':
      if (state.phase !== 'ready') return state;
      return { ...state, photoEntry: action.entry };
    case 'RESET':
      return { phase: 'idle' };
    default:
      return state;
  }
}

export function ExifAnalyzer() {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle' });
  const [exporting, setExporting] = useState(false);
  const { parseExif, isParsing } = useExifParser();

  const handleFiles = useCallback(async (fileList: FileList) => {
    const file = fileList[0];
    if (!file) return;

    dispatch({ type: 'START_LOADING', file });

    const imageUrl = URL.createObjectURL(file);

    const img = new Image();
    img.onload = async () => {
      const thumbnailUrl = generateThumbnail(img);
      dispatch({ type: 'LOADED', file, imageUrl, thumbnailUrl, image: img });
    };
    img.src = imageUrl;
  }, []);

  // When image is loaded, parse EXIF and start analysis
  useEffect(() => {
    if (state.phase !== 'parsed') return;

    const { file, image, imageUrl, thumbnailUrl } = state;

    const run = async () => {
      const exifResult = await parseExif(file);
      dispatch({ type: 'EXIF_PARSED', exif: exifResult });

      // Run analysis (histogram, colors, photoEntry) after EXIF parsing
      // Use requestAnimationFrame to avoid blocking UI
      requestAnimationFrame(() => {
        const histogram = computeHistogramFromImage(image);
        const exposureWarning = detectExposureWarnings(image);
        const imageData = scaleImageForKMeans(image);
        const colors = extractDominantColors(imageData, 5, 20);

        const photoEntry = exifToPhotoEntry(
          exifResult.summary,
          file.name,
          imageUrl,
          thumbnailUrl,
        );

        dispatch({
          type: 'ANALYSIS_COMPLETE',
          histogram,
          exposureWarning,
          colors,
          photoEntry,
        });
      });
    };

    run();
  }, [state.phase, parseExif]);

  const handleUpdateEntry = useCallback((entry: PhotoEntry) => {
    dispatch({ type: 'UPDATE_PHOTO_ENTRY', entry });
  }, []);

  const handleReset = useCallback(() => {
    if (state.phase !== 'idle' && 'imageUrl' in state) {
      URL.revokeObjectURL(state.imageUrl);
    }
    dispatch({ type: 'RESET' });
  }, [state]);

  const handlePrivacyErase = useCallback(async () => {
    if (state.phase !== 'ready') return;
    setExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = state.image.naturalWidth;
      canvas.height = state.image.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(state.image, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.92),
      );
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cameravision-noexif-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [state]);

  const isReady = state.phase === 'ready';

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      {/* Left: Upload / Preview */}
      <div style={{
        flex: '0 0 300px',
        minWidth: '250px',
      }}>
        {state.phase === 'idle' ? (
          <ImageImporter onFiles={handleFiles} />
        ) : (
          <div>
            <div style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-elevated)',
            }}>
              {'imageUrl' in state ? (
                <img
                  src={state.imageUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    display: 'block',
                  }}
                />
              ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontFamily: "'Noto Sans SC', sans-serif" }}>
                    正在加载...
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              style={{
                marginTop: '8px',
                padding: '6px 16px',
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                fontFamily: "'Noto Sans SC', sans-serif)",
                cursor: 'pointer',
                width: '100%',
              }}
            >
              重新选择
            </button>
          </div>
        )}
      </div>

      {/* Right: Info panels */}
      <div style={{
        flex: 1,
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {state.phase === 'loading' || state.phase === 'parsed' || state.phase === 'analyzing' ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '14px',
          }}>
            {isParsing ? '正在解析 EXIF...' : '正在分析照片...'}
          </div>
        ) : isReady ? (
          <>
            {/* Section: EXIF Panel */}
            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <h3 style={{
                margin: '0 0 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: "'Noto Sans SC', sans-serif",
              }}>
                EXIF 完整信息
              </h3>
              <ExifPanel data={state.exif.grouped} isEmpty={Object.keys(state.exif.raw).length === 0} />

              {/* Privacy Erase */}
              <div style={{ marginTop: '12px' }}>
                <button
                  onClick={handlePrivacyErase}
                  disabled={exporting}
                  style={{
                    padding: '6px 14px',
                    background: exporting ? 'var(--color-bg-elevated)' : 'var(--color-accent)',
                    border: 'none',
                    borderRadius: '6px',
                    color: exporting ? 'var(--color-text-secondary)' : '#fff',
                    fontSize: '12px',
                    fontFamily: "'Noto Sans SC', sans-serif",
                    cursor: exporting ? 'not-allowed' : 'pointer',
                    opacity: exporting ? 0.6 : 1,
                  }}
                >
                  {exporting ? '导出中...' : '擦除 EXIF 导出'}
                </button>
              </div>
            </div>

            {/* Section: Histogram */}
            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <h3 style={{
                margin: '0 0 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: "'Noto Sans SC', sans-serif",
              }}>
                RGB 直方图
              </h3>
              <Histogram
                data={state.histogram}
                exposureWarning={state.exposureWarning}
                imageUrl={state.imageUrl}
                imageWidth={state.image.naturalWidth}
                imageHeight={state.image.naturalHeight}
              />
            </div>

            {/* Section: Colors */}
            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <h3 style={{
                margin: '0 0 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: "'Noto Sans SC', sans-serif",
              }}>
                色彩提取
              </h3>
              <ColorExtractor colors={state.colors} />
            </div>

            {/* Section: PhotoEntry */}
            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <PhotoEntryEditor entry={state.photoEntry} onChange={handleUpdateEntry} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
