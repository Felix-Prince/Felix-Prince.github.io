export interface WatermarkConfig {
  logo: string | null;
  model: string;
  exifText: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
}

export interface FrameConfig {
  blurRadius: number;
  cornerRadius: number;
  shadowOffset: number;
  watermark: WatermarkConfig;
}

export interface RenderConfig {
  frame: FrameConfig;
  maxDimension: number;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface LayoutResult {
  blurRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  photoRect: {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRadius: number;
  };
  shadowOffset: {
    x: number;
    y: number;
  };
  watermarkPosition: {
    x: number;
    y: number;
  };
}

export interface ImageTier {
  thumbnail: string;
  preview: string;
  original: string;
  size: ImageSize;
}
