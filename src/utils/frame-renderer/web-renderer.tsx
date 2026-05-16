import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import { calcLayout } from './layout';
import { logoToDataUrl } from './logo-renderer';
import type { RenderConfig, ImageSize, ImageTier } from './types';

interface WebRendererProps {
  config: RenderConfig;
  imageTier: ImageTier | null;
  containerWidth: number;
  containerHeight: number;
}

export function WebRenderer({ config, imageTier, containerWidth, containerHeight }: WebRendererProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [previewImg, setPreviewImg] = useState<HTMLImageElement | null>(null);
  const [blurImg, setBlurImg] = useState<HTMLImageElement | null>(null);
  const [logoKonvaImg, setLogoKonvaImg] = useState<HTMLImageElement | null>(null);

  // Load logo image when brand changes
  useEffect(() => {
    if (!config.frame.watermark.logo) {
      setLogoKonvaImg(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLogoKonvaImg(img);
    img.src = logoToDataUrl(config.frame.watermark.logo);
  }, [config.frame.watermark.logo]);
  const blurCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevBlurKeyRef = useRef<string>('');
  const prevSrcRef = useRef<string>('');

  const viewportSize: ImageSize = {
    width: containerWidth,
    height: containerHeight,
  };

  // Load preview image when image tier changes
  useEffect(() => {
    if (!imageTier) {
      setPreviewImg(null);
      setBlurImg(null);
      return;
    }
    const src = imageTier.preview;
    if (src === prevSrcRef.current) return;
    prevSrcRef.current = src;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setPreviewImg(img);
    };
    img.src = src;
  }, [imageTier]);

  // Generate blur background via offscreen canvas
  useEffect(() => {
    if (!imageTier || !previewImg || config.frame.blurRadius === 0) {
      setBlurImg(null);
      blurCanvasRef.current = null;
      return;
    }

    const blurKey = `${imageTier.original}_${config.frame.blurRadius}`;
    if (blurKey === prevBlurKeyRef.current && blurCanvasRef.current) {
      return;
    }
    prevBlurKeyRef.current = blurKey;

    const offscreen = document.createElement('canvas');
    offscreen.width = containerWidth;
    offscreen.height = containerHeight;
    const ctx = offscreen.getContext('2d')!;

    // Scale image to cover canvas for blur
    const scale = Math.max(
      containerWidth / previewImg.width,
      containerHeight / previewImg.height,
    );
    const drawW = Math.round(previewImg.width * scale);
    const drawH = Math.round(previewImg.height * scale);
    const drawX = Math.round((containerWidth - drawW) / 2);
    const drawY = Math.round((containerHeight - drawH) / 2);

    ctx.filter = `blur(${config.frame.blurRadius}px)`;
    ctx.drawImage(previewImg, drawX, drawY, drawW, drawH);

    const blurred = new window.Image();
    blurred.onload = () => {
      setBlurImg(blurred);
      blurCanvasRef.current = offscreen;
    };
    blurred.src = offscreen.toDataURL();
  }, [imageTier, previewImg, config.frame.blurRadius, containerWidth, containerHeight]);

  if (!imageTier || !previewImg) {
    return (
      <Stage width={containerWidth} height={containerHeight}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={containerWidth}
            height={containerHeight}
            fill="#050810"
          />
          <Text
            x={containerWidth / 2 - 80}
            y={containerHeight / 2 - 10}
            text="请导入照片"
            fontSize={16}
            fill="rgba(210,255,254,0.4)"
            fontFamily="'Noto Sans SC', sans-serif"
          />
        </Layer>
      </Stage>
    );
  }

  const layout = calcLayout(config, { width: previewImg.width, height: previewImg.height }, viewportSize);

  return (
    <Stage ref={stageRef} width={containerWidth} height={containerHeight}>
      {/* Blur background layer */}
      <Layer>
        {blurImg ? (
          <KonvaImage
            image={blurImg}
            x={0}
            y={0}
            width={containerWidth}
            height={containerHeight}
          />
        ) : (
          <Rect
            x={0}
            y={0}
            width={containerWidth}
            height={containerHeight}
            fill="#050810"
          />
        )}
      </Layer>

      {/* Photo layer with shadow and rounded corners */}
      <Layer>
        <Group
          x={layout.photoRect.x}
          y={layout.photoRect.y}
          clipFunc={(ctx) => {
            ctx.beginPath();
            ctx.roundRect(0, 0, layout.photoRect.width, layout.photoRect.height, layout.photoRect.cornerRadius);
            ctx.closePath();
          }}
        >
          {/* Shadow */}
          <Rect
            x={layout.shadowOffset.x}
            y={layout.shadowOffset.y}
            width={layout.photoRect.width}
            height={layout.photoRect.height}
            fill="rgba(0,0,0,0.3)"
            cornerRadius={layout.photoRect.cornerRadius}
          />
          {/* Photo */}
          <KonvaImage
            image={previewImg}
            x={0}
            y={0}
            width={layout.photoRect.width}
            height={layout.photoRect.height}
          />
        </Group>
      </Layer>

      {/* Watermark layer */}
      <Layer>
        <Group x={0} y={0}>
          {renderWatermark(config, layout, logoKonvaImg)}
        </Group>
      </Layer>
    </Stage>
  );
}

function renderWatermark(config: RenderConfig, layout: import('./types').LayoutResult, logoKonvaImg: HTMLImageElement | null) {
  const { watermark } = config.frame;
  const { x: watermarkX } = layout.watermarkPosition;
  const { width: viewportW, height: viewportH } = layout.blurRegion;
  const hasLogo = !!watermark.logo;
  const hasModel = watermark.model.trim().length > 0;
  const hasExif = watermark.exifText.trim().length > 0;
  if (!hasLogo && !hasModel && !hasExif) return null;

  const fontSize = Math.max(watermark.fontSize, 12);
  const gap = 10;
  const padX = 20;
  const padY = 10;
  const barHeight = fontSize + padY * 2;
  const watermarkZoneCenter = viewportH - 30;
  const barY = watermarkZoneCenter - barHeight / 2;

  // Calculate total content width
  let contentW = 0;
  const items: { type: 'logo' | 'text'; width: number; text?: string }[] = [];

  if (hasLogo) {
    const w = fontSize;
    items.push({ type: 'logo', width: w });
    contentW += w + gap;
  }
  if (hasModel) {
    const w = estimateTextWidth(watermark.model, fontSize, watermark.fontFamily);
    items.push({ type: 'text', width: w, text: watermark.model });
    contentW += w + gap;
  }
  if (hasModel && hasExif) {
    items.push({ type: 'text', width: 12, text: '|' });
    contentW += 12 + gap;
  }
  if (hasExif) {
    const w = estimateTextWidth(watermark.exifText, fontSize, watermark.fontFamily);
    items.push({ type: 'text', width: w, text: watermark.exifText });
    contentW += w + gap;
  }
  contentW = Math.max(contentW - gap, 0);

  // Content bar: centered at bottom of viewport
  const barW = Math.min(contentW + padX * 2, viewportW - 40);
  const barX = watermarkX - barW / 2;
  const contentStartX = barX + padX;

  let offsetX = 0;
  const children: React.ReactNode[] = [];
  let key = 0;

  for (const item of items) {
    const x = contentStartX + offsetX;
    if (item.type === 'logo' && logoKonvaImg) {
      children.push(
        <KonvaImage key={key++} image={logoKonvaImg} x={x} y={barY + padY - fontSize * 0.1} width={fontSize} height={fontSize} />,
      );
    } else if (item.type === 'logo') {
      children.push(
        <Text key={key++} x={x} y={barY + padY} text={watermark.logo || ''} fontSize={fontSize * 0.5} fill={watermark.fontColor} fontFamily={watermark.fontFamily} />,
      );
    } else if (item.text === '|') {
      children.push(
        <Text key={key++} x={x} y={barY + padY} text="|" fontSize={fontSize} fill={watermark.fontColor} fontFamily={watermark.fontFamily} opacity={0.5} />,
      );
    } else if (item.text) {
      children.push(
        <Text key={key++} x={x} y={barY + padY} text={item.text} fontSize={fontSize} fill={watermark.fontColor} fontFamily={watermark.fontFamily} />,
      );
    }
    offsetX += item.width + gap;
  }

  return (
    <Group x={0} y={0}>
      <Rect x={barX} y={barY} width={barW} height={barHeight} fill="rgba(0,0,0,0.55)" cornerRadius={6} />
      {children}
    </Group>
  );
}

function estimateTextWidth(text: string, fontSize: number, _fontFamily: string): number {
  return text.length * fontSize * 0.6;
}
