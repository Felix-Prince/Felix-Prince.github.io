export interface HistogramData {
  r: Uint32Array;
  g: Uint32Array;
  b: Uint32Array;
  luminance: Uint32Array;
  totalPixels: number;
}

export interface ExposureWarning {
  overexposed: number;
  underexposed: number;
  overMask: ImageData | null;
  underMask: ImageData | null;
}

const OVER_THRESHOLD = 250;
const UNDER_THRESHOLD = 5;
const MAX_DIMENSION = 2000;
const SCALE_DOWN_SIZE = 200;

function createCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
} {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    return { canvas, ctx };
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

function imageToScaledCanvas(
  image: HTMLImageElement,
  maxWidth: number,
): { canvas: HTMLCanvasElement | OffscreenCanvas; width: number; height: number } {
  const { naturalWidth: width, naturalHeight: height } = image;

  if (width <= maxWidth) {
    const { canvas, ctx } = createCanvas(width, height);
    ctx.drawImage(image, 0, 0, width, height);
    return { canvas, width, height };
  }

  const scale = maxWidth / width;
  const scaledWidth = maxWidth;
  const scaledHeight = Math.round(height * scale);

  const { canvas, ctx } = createCanvas(scaledWidth, scaledHeight);
  ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
  return { canvas, width: scaledWidth, height: scaledHeight };
}

export function computeHistogram(imageData: ImageData): HistogramData {
  const r = new Uint32Array(256);
  const g = new Uint32Array(256);
  const b = new Uint32Array(256);
  const luminance = new Uint32Array(256);
  const { data } = imageData;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const rv = data[i];
    const gv = data[i + 1];
    const bv = data[i + 2];
    r[rv]++;
    g[gv]++;
    b[bv]++;
    const y = Math.round(rv * 0.299 + gv * 0.587 + bv * 0.114);
    luminance[y]++;
  }

  return { r, g, b, luminance, totalPixels };
}

export function computeHistogramFromImage(
  image: HTMLImageElement,
): HistogramData {
  const { canvas, width, height } = imageToScaledCanvas(image, MAX_DIMENSION);

  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  if (canvas instanceof HTMLCanvasElement) {
    ctx = canvas.getContext('2d')!;
  } else {
    ctx = canvas.getContext('2d')!;
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  return computeHistogram(imageData);
}

export function detectExposureWarnings(
  image: HTMLImageElement,
): ExposureWarning {
  const { canvas, width, height } = imageToScaledCanvas(image, MAX_DIMENSION);

  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  if (canvas instanceof HTMLCanvasElement) {
    ctx = canvas.getContext('2d')!;
  } else {
    ctx = canvas.getContext('2d')!;
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  const overMask = new Uint8ClampedArray(data.length);
  const underMask = new Uint8ClampedArray(data.length);
  let overPixels = 0;
  let underPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const rv = data[i];
    const gv = data[i + 1];
    const bv = data[i + 2];

    if (rv >= OVER_THRESHOLD && gv >= OVER_THRESHOLD && bv >= OVER_THRESHOLD) {
      overMask[i] = 255;
      overMask[i + 1] = 0;
      overMask[i + 2] = 0;
      overMask[i + 3] = 80;
      overPixels++;
    }

    if (rv <= UNDER_THRESHOLD && gv <= UNDER_THRESHOLD && bv <= UNDER_THRESHOLD) {
      underMask[i] = 0;
      underMask[i + 1] = 0;
      underMask[i + 2] = 255;
      underMask[i + 3] = 80;
      underPixels++;
    }
  }

  const totalPixels = data.length / 4;

  const overResult = new ImageData(overMask, width, height);
  const underResult = new ImageData(underMask, width, height);

  return {
    overexposed: Math.round((overPixels / totalPixels) * 100),
    underexposed: Math.round((underPixels / totalPixels) * 100),
    overMask: overPixels > 0 ? overResult : null,
    underMask: underPixels > 0 ? underResult : null,
  };
}

export function scaleImageForKMeans(
  image: HTMLImageElement,
): ImageData {
  const { canvas, width, height } = imageToScaledCanvas(image, SCALE_DOWN_SIZE);

  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  if (canvas instanceof HTMLCanvasElement) {
    ctx = canvas.getContext('2d')!;
  } else {
    ctx = canvas.getContext('2d')!;
  }

  return ctx.getImageData(0, 0, width, height);
}
