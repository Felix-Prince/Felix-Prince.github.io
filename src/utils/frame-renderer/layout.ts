import type { RenderConfig, ImageSize, LayoutResult } from './types';

export function calcLayout(
  config: RenderConfig,
  imageSize: ImageSize,
): LayoutResult {
  const { frame } = config;
  const { width, height } = imageSize;

  // Blur background covers entire image
  const blurRegion = { x: 0, y: 0, width, height };

  // Foreground photo: 80% of original, centered horizontally, offset up
  const pw = Math.round(width * 0.8);
  const ph = Math.round(height * 0.8);
  const px = Math.round((width - pw) / 2);
  const py = Math.round((height - ph) * 0.25);

  const photoRect = {
    x: px, y: py, width: pw, height: ph,
    cornerRadius: frame.cornerRadius,
  };

  const shadowOffset = { x: 0, y: frame.shadowOffset };

  // Watermark at 92.5 % of total image height (on blur background, below photo)
  const watermarkPosition = {
    x: width / 2,
    y: height * 0.925,
  };

  return { blurRegion, photoRect, shadowOffset, watermarkPosition };
}
