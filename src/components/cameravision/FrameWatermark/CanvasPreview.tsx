import { forwardRef } from 'react';
import { WebRenderer } from '../../../utils/frame-renderer/web-renderer';
import type { RenderConfig, ImageTier } from '../../../utils/frame-renderer/types';
import type { WebRendererHandle } from '../../../utils/frame-renderer/web-renderer';

interface CanvasPreviewProps {
  config: RenderConfig;
  imageTier: ImageTier | null;
  containerWidth: number;
  containerHeight: number;
}

export const CanvasPreview = forwardRef<WebRendererHandle, CanvasPreviewProps>(
  ({ config, imageTier, containerWidth, containerHeight }, ref) => {
    return (
      <WebRenderer
        ref={ref}
        config={config}
        imageTier={imageTier}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
    );
  }
);
