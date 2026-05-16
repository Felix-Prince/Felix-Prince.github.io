import type { RenderConfig, ImageSize, LayoutResult } from './types';

export function calcLayout(
  config: RenderConfig,
  imageSize: ImageSize,
  viewportSize: ImageSize,
): LayoutResult {
  const { frame } = config;

  // Fixed padding: 20px top/left/right, 60px bottom reserved for watermark
  const paddingTop = 20;
  const paddingBottom = 60;
  const paddingLeft = 20;
  const paddingRight = 20;
  const usableW = viewportSize.width - paddingLeft - paddingRight;
  const usableH = viewportSize.height - paddingTop - paddingBottom;

  // Scale image to fit within the usable area while maintaining aspect ratio
  const scale = Math.min(
    usableW / imageSize.width,
    usableH / imageSize.height,
  );
  const photoWidth = Math.round(imageSize.width * scale);
  const photoHeight = Math.round(imageSize.height * scale);

  // Center photo within the usable area (not the full viewport)
  const photoX = Math.round(paddingLeft + (usableW - photoWidth) / 2);
  const photoY = Math.round(paddingTop + (usableH - photoHeight) / 2);

  // Blur background covers entire viewport
  const blurRegion = {
    x: 0,
    y: 0,
    width: viewportSize.width,
    height: viewportSize.height,
  };

  // Photo with rounded corners
  const photoRect = {
    x: photoX,
    y: photoY,
    width: photoWidth,
    height: photoHeight,
    cornerRadius: frame.cornerRadius,
  };

  // Shadow offset (downward direction)
  const shadowOffset = {
    x: 0,
    y: frame.shadowOffset,
  };

  // Watermark centered in the bottom 60px zone
  const watermarkPosition = {
    x: viewportSize.width / 2,
    y: viewportSize.height - 30,
  };

  return {
    blurRegion,
    photoRect,
    shadowOffset,
    watermarkPosition,
  };
}
