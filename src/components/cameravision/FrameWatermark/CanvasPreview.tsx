import { WebRenderer } from '../../../utils/frame-renderer/web-renderer';
import type { RenderConfig, ImageTier } from '../../../utils/frame-renderer/types';

interface CanvasPreviewProps {
  config: RenderConfig;
  imageTier: ImageTier | null;
  containerWidth: number;
  containerHeight: number;
}

export function CanvasPreview({ config, imageTier, containerWidth, containerHeight }: CanvasPreviewProps) {
  return (
    <WebRenderer
      config={config}
      imageTier={imageTier}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
    />
  );
}
