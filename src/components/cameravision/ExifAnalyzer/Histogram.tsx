import { useRef, useEffect, useState, useCallback } from 'react';
import type { HistogramData, ExposureWarning } from '../../../utils/histogram';

interface HistogramProps {
  data: HistogramData | null;
  exposureWarning: ExposureWarning | null;
  imageUrl: string | null;
  imageWidth: number;
  imageHeight: number;
}

const HIST_WIDTH = 360;
const HIST_HEIGHT = 140;
const PADDING = { top: 10, right: 10, bottom: 22, left: 10 };
const PLOT_W = HIST_WIDTH - PADDING.left - PADDING.right;
const PLOT_H = HIST_HEIGHT - PADDING.top - PADDING.bottom;

function drawHistogram(
  ctx: CanvasRenderingContext2D,
  data: Uint32Array,
  color: string,
  maxVal: number,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 256; i++) {
    const x = PADDING.left + (i / 255) * PLOT_W;
    const h = maxVal > 0 ? (data[i] / maxVal) * PLOT_H : 0;
    const y = PADDING.top + PLOT_H - h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(210,255,254,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const x = PADDING.left + (i / 4) * PLOT_W;
    ctx.beginPath();
    ctx.moveTo(x, PADDING.top);
    ctx.lineTo(x, PADDING.top + PLOT_H);
    ctx.stroke();
  }
  for (let i = 0; i <= 3; i++) {
    const y = PADDING.top + (i / 3) * PLOT_H;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, y);
    ctx.lineTo(PADDING.left + PLOT_W, y);
    ctx.stroke();
  }
}

export function Histogram({ data, exposureWarning, imageUrl, imageWidth, imageHeight }: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warnCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [showWarn, setShowWarn] = useState(false);

  // Flash overlay every 2s
  useEffect(() => {
    const hasWarn = exposureWarning &&
      (exposureWarning.overMask !== null || exposureWarning.underMask !== null);
    if (!hasWarn) {
      setShowWarn(false);
      return;
    }
    const id = setInterval(() => setShowWarn((v) => !v), 2000);
    return () => clearInterval(id);
  }, [exposureWarning]);

  // Draw histogram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = HIST_WIDTH * dpr;
    canvas.height = HIST_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, HIST_WIDTH, HIST_HEIGHT);

    // Background
    ctx.fillStyle = 'rgba(5,8,16,0.6)';
    ctx.fillRect(0, 0, HIST_WIDTH, HIST_HEIGHT);

    drawGrid(ctx);

    // Find global max for normalization
    let maxVal = 1;
    const all = [data.r, data.g, data.b, data.luminance];
    for (const arr of all) {
      for (const v of arr) if (v > maxVal) maxVal = v;
    }

    drawHistogram(ctx, data.luminance, 'rgba(255,255,255,0.5)', maxVal);
    drawHistogram(ctx, data.r, 'rgba(255,80,80,0.7)', maxVal);
    drawHistogram(ctx, data.g, 'rgba(80,200,80,0.7)', maxVal);
    drawHistogram(ctx, data.b, 'rgba(80,80,255,0.7)', maxVal);

    // Axis labels
    ctx.fillStyle = 'rgba(210,255,254,0.4)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0', PADDING.left, HIST_HEIGHT - 4);
    ctx.fillText('255', PADDING.left + PLOT_W, HIST_HEIGHT - 4);

    // Legend
    const legendY = 2;
    const legendItems = [
      { label: 'R', color: 'rgba(255,80,80,0.8)' },
      { label: 'G', color: 'rgba(80,200,80,0.8)' },
      { label: 'B', color: 'rgba(80,80,255,0.8)' },
      { label: 'Y', color: 'rgba(255,255,255,0.5)' },
    ];
    let lx = PADDING.left + 4;
    for (const item of legendItems) {
      ctx.fillStyle = item.color;
      ctx.fillRect(lx, legendY + 4, 8, 8);
      ctx.fillStyle = 'rgba(210,255,254,0.6)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 10, legendY + 12);
      lx += 26;
    }
  }, [data]);

  // Draw exposure preview
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !imageUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxW = 120;
    const scale = Math.min(1, maxW / imageWidth);
    const w = Math.round(imageWidth * scale);
    const h = Math.round(imageHeight * scale);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
    };
    img.src = imageUrl;
  }, [imageUrl, imageWidth, imageHeight]);

  // Draw warning overlays on the preview
  useEffect(() => {
    const canvas = warnCanvasRef.current;
    if (!canvas || !exposureWarning || !imageUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxW = 120;
    const scale = Math.min(1, maxW / imageWidth);
    const w = Math.round(imageWidth * scale);
    const h = Math.round(imageHeight * scale);

    canvas.width = w;
    canvas.height = h;

    if (showWarn && exposureWarning.overMask) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = exposureWarning.overMask.width;
      tempCanvas.height = exposureWarning.overMask.height;
      const tCtx = tempCanvas.getContext('2d')!;
      tCtx.putImageData(exposureWarning.overMask, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, w, h);
    }
    if (showWarn && exposureWarning.underMask) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = exposureWarning.underMask.width;
      tempCanvas.height = exposureWarning.underMask.height;
      const tCtx = tempCanvas.getContext('2d')!;
      tCtx.putImageData(exposureWarning.underMask, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, w, h);
    }
  }, [exposureWarning, imageUrl, imageWidth, imageHeight, showWarn]);

  const handleExportHistogram = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'histogram.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  const hasExposureWarn = exposureWarning &&
    (exposureWarning.overMask !== null || exposureWarning.underMask !== null);

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '8px',
      }}>
        <div>
          <div style={{
            position: 'relative',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <canvas
              ref={previewRef}
              style={{ display: 'block' }}
            />
            <canvas
              ref={warnCanvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            />
          </div>
          <div style={{
            marginTop: '6px',
            fontSize: '11px',
            fontFamily: "'Noto Sans SC', sans-serif",
            display: 'flex',
            gap: '12px',
            minHeight: '16px',
          }}>
            {hasExposureWarn ? (
              <>
                {exposureWarning!.overMask !== null && (
                  <span style={{ color: '#ff4444' }}>
                    过曝 {exposureWarning!.overexposed}%
                  </span>
                )}
                {exposureWarning!.underMask !== null && (
                  <span style={{ color: '#4444ff' }}>
                    欠曝 {exposureWarning!.underexposed}%
                  </span>
                )}
              </>
            ) : (
              <span style={{ color: 'var(--color-text-secondary)' }}>
                {exposureWarning !== null ? '无过曝/欠曝区域' : ''}
              </span>
            )}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <canvas
            ref={canvasRef}
            style={{
              width: `${HIST_WIDTH}px`,
              height: `${HIST_HEIGHT}px`,
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
            }}
          />
          <button
            onClick={handleExportHistogram}
            style={{
              marginTop: '4px',
              padding: '2px 8px',
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              color: 'var(--color-text-secondary)',
              fontSize: '11px',
              fontFamily: "'Noto Sans SC', sans-serif",
              cursor: 'pointer',
            }}
          >
            导出直方图
          </button>
        </div>
      </div>
    </div>
  );
}
