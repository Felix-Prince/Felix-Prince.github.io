export interface DominantColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  count: number;
}

function euclideanDistance(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

export function extractDominantColors(
  imageData: ImageData,
  k: number = 5,
  maxIterations: number = 20,
): DominantColor[] {
  const { data } = imageData;
  const pixels: { r: number; g: number; b: number }[] = [];

  for (let i = 0; i < data.length; i += 4) {
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  if (pixels.length === 0) return [];

  // k-means++ initialization
  const centroids: { r: number; g: number; b: number }[] = [];
  centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);

  for (let c = 1; c < k; c++) {
    const distances = pixels.map((p) => {
      const minDist = Math.min(
        ...centroids.map((cent) =>
          euclideanDistance(p.r, p.g, p.b, cent.r, cent.g, cent.b),
        ),
      );
      return minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let threshold = Math.random() * totalDist;
    for (let i = 0; i < distances.length; i++) {
      threshold -= distances[i];
      if (threshold <= 0) {
        centroids.push(pixels[i]);
        break;
      }
    }
    if (centroids.length <= c) {
      centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
    }
  }

  const assignments = new Uint16Array(pixels.length);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign pixels to nearest centroid
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i];
      let minDist = Infinity;
      let bestIdx = 0;
      for (let c = 0; c < k; c++) {
        const dist = euclideanDistance(p.r, p.g, p.b, centroids[c].r, centroids[c].g, centroids[c].b);
        if (dist < minDist) {
          minDist = dist;
          bestIdx = c;
        }
      }
      if (assignments[i] !== bestIdx) {
        assignments[i] = bestIdx;
        changed = true;
      }
    }
    if (!changed) break;

    // Update centroids
    const sums = new Array(k).fill(null).map(() => ({ r: 0, g: 0, b: 0, count: 0 }));
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c].r += pixels[i].r;
      sums[c].g += pixels[i].g;
      sums[c].b += pixels[i].b;
      sums[c].count++;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c].count > 0) {
        centroids[c] = {
          r: sums[c].r / sums[c].count,
          g: sums[c].g / sums[c].count,
          b: sums[c].b / sums[c].count,
        };
      }
    }
  }

  // Count final assignments
  const counts = new Array(k).fill(0);
  for (let i = 0; i < pixels.length; i++) {
    counts[assignments[i]]++;
  }

  // Build result sorted by count descending
  const result: DominantColor[] = centroids.map((c, i) => ({
    r: Math.round(c.r),
    g: Math.round(c.g),
    b: Math.round(c.b),
    hex: rgbToHex(c.r, c.g, c.b),
    count: counts[i],
  }));

  result.sort((a, b) => b.count - a.count);
  return result;
}

export function exportColorsAsCSSVariables(colors: DominantColor[]): string {
  return colors
    .map((c, i) => `  --color-palette-${i + 1}: ${c.hex};`)
    .join('\n');
}

export function exportColorsAsTailwindConfig(colors: DominantColor[]): string {
  const palette = colors
    .map((c, i) => `        '${i + 1}': '${c.hex}'`)
    .join(',\n');
  return `  extend: {\n    colors: {\n      palette: {\n${palette},\n      },\n    },\n  }`;
}
