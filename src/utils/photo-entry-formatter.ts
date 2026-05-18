import { getCameraAlias } from '../data/camera-aliases';

export interface PhotoEntry {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  tags: string[];
  date: string;
  camera: string;
  settings: string;
  description: string;
  collection: string;
}

export interface ExifSummary {
  make?: string;
  model?: string;
  focalLength?: number;
  fNumber?: number;
  exposureTime?: number;
  iso?: number;
  dateTimeOriginal?: string;
}

export function formatExifSettings(
  focalLength?: number,
  fNumber?: number,
  exposureTime?: number,
  iso?: number,
): string {
  const fl = focalLength ? `${focalLength}mm` : '--';
  const ap = fNumber ? `f/${fNumber}` : 'f/--';
  const ss =
    exposureTime != null
      ? exposureTime >= 1
        ? `${exposureTime}s`
        : `1/${Math.round(1 / exposureTime)}s`
      : '--';
  const is = iso ? `ISO${iso}` : 'ISO--';
  return `${fl} ${ap} ${ss} ${is}`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export function exifToPhotoEntry(
  exif: ExifSummary,
  fileName: string,
  dataUrl: string,
  thumbnailUrl: string,
  manualOverrides?: Partial<PhotoEntry>,
): PhotoEntry {
  const camera = exif.make || exif.model
    ? getCameraAlias(exif.make || '', exif.model || '')
    : '--';

  const settings = formatExifSettings(
    exif.focalLength,
    exif.fNumber,
    exif.exposureTime,
    exif.iso,
  );

  const title = fileName.replace(/\.[^.]+$/, '');

  return {
    id: `photo-${Date.now()}`,
    title: manualOverrides?.title ?? title,
    url: dataUrl,
    thumbnail: thumbnailUrl,
    tags: manualOverrides?.tags ?? [],
    date: formatDate(exif.dateTimeOriginal),
    camera,
    settings,
    description: manualOverrides?.description ?? '',
    collection: manualOverrides?.collection ?? 'Uncategorized',
  };
}

export function generateThumbnail(
  image: HTMLImageElement,
  maxWidth: number = 600,
): string {
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const w = Math.round(image.naturalWidth * scale);
  const h = Math.round(image.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.85);
}
