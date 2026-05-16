const colorCache = new Map<string, HTMLCanvasElement>();

function createOffscreenCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function recolorLogo(
  logoSrc: string,
  targetColor: string,
): Promise<HTMLCanvasElement> {
  const cacheKey = `${logoSrc}_${targetColor}`;
  if (colorCache.has(cacheKey)) {
    return colorCache.get(cacheKey)!.cloneNode() as HTMLCanvasElement;
  }

  const img = await loadImage(logoSrc);
  const { canvas, ctx } = createOffscreenCanvas(img.width, img.height);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Parse target color from hex to RGB
  const hex = targetColor.replace('#', '');
  const tr = parseInt(hex.substring(0, 2), 16);
  const tg = parseInt(hex.substring(2, 4), 16);
  const tb = parseInt(hex.substring(4, 6), 16);

  // Replace non-transparent pixels with target color (preserve alpha)
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  colorCache.set(cacheKey, canvas);
  return canvas.cloneNode() as HTMLCanvasElement;
}

export function clearLogoColorCache(): void {
  colorCache.clear();
}
