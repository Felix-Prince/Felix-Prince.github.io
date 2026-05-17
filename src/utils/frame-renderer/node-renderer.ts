// @ts-nocheck — Node.js only module, excluded from Vite build
// Node-canvas renderer for CLI batch processing

import type { RenderConfig, ImageSize } from './types';

export interface NodeRendererOptions {
  config: RenderConfig;
  inputPath: string;
  outputPath: string;
  maxDimension: number;
}

export async function renderWatermarkNode(options: NodeRendererOptions): Promise<void> {
  const { Canvas, Image } = await import('canvas');
  const fs = await import('fs/promises');

  const { config, inputPath, outputPath, maxDimension } = options;

  // Read and decode input image
  const inputBuffer = await fs.readFile(inputPath);
  const img = new Image();
  img.src = inputBuffer;

  // @ts-ignore - Node modules loaded dynamically

  const imageSize: ImageSize = { width: img.width, height: img.height };

  // Apply max dimension constraint
  let renderW = imageSize.width;
  let renderH = imageSize.height;
  if (Math.max(renderW, renderH) > maxDimension) {
    const scale = maxDimension / Math.max(renderW, renderH);
    renderW = Math.round(renderW * scale);
    renderH = Math.round(renderH * scale);
  }

  // Create canvas at original resolution for export
  const canvas = new Canvas(renderW, renderH);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#050810';
  ctx.fillRect(0, 0, renderW, renderH);

  // --- Blur background ---
  if (config.frame.blurRadius > 0) {
    // Scale image to cover canvas
    const coverScale = Math.max(renderW / imageSize.width, renderH / imageSize.height);
    const blurW = Math.round(imageSize.width * coverScale);
    const blurH = Math.round(imageSize.height * coverScale);
    const blurX = Math.round((renderW - blurW) / 2);
    const blurY = Math.round((renderH - blurH) / 2);

    // Create temp canvas for blur
    const tempCanvas = new Canvas(renderW, renderH);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, blurX, blurY, blurW, blurH);
    tempCtx.filter = `blur(${config.frame.blurRadius}px)`;
    tempCtx.drawImage(img, blurX, blurY, blurW, blurH);
    ctx.drawImage(tempCanvas, 0, 0);
  }

  // --- Photo with rounded corners and shadow ---
  // Foreground: 80 % of canvas, centered horizontally, offset up (matches layout.ts)
  const photoW = Math.round(renderW * 0.8);
  const photoH = Math.round(renderH * 0.8);
  const photoX = Math.round((renderW - photoW) / 2);
  const photoY = Math.round((renderH - photoH) * 0.25);

  // Shadow
  if (config.frame.shadowOffset > 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.roundRect(photoX, photoY + config.frame.shadowOffset, photoW, photoH, config.frame.cornerRadius);
    ctx.fill();
  }

  // Clip to rounded rect
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, config.frame.cornerRadius);
  ctx.clip();

  // Draw photo
  ctx.drawImage(img, photoX, photoY, photoW, photoH);
  ctx.restore();

  // --- Watermark ---
  const { watermark } = config.frame;
  const hasWatermark = watermark.logo || watermark.model || watermark.exifText;
  if (hasWatermark) {
    const fontSize = Math.max(watermark.fontSize, 12);
    ctx.font = `${fontSize}px ${watermark.fontFamily}`;
    ctx.fillStyle = watermark.fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const watermarkY = renderH * 0.925;
    let parts: string[] = [];
    if (watermark.logo) parts.push('[LOGO]');
    if (watermark.model) parts.push(watermark.model);
    if (watermark.exifText) parts.push(watermark.exifText);
    const watermarkText = parts.join(' | ');

    if (watermarkText) {
      ctx.fillText(watermarkText, renderW / 2, watermarkY);
    }
  }

  // Write output
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
  await fs.writeFile(outputPath, buffer);
}
