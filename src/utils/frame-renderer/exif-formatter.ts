export interface ExifData {
  focalLength?: number;
  fNumber?: number;
  exposureTime?: number;
  isoSpeed?: number;
}

function formatShutterSpeed(seconds: number): string {
  if (seconds < 1) {
    const fraction = Math.round(1 / seconds);
    return `1/${fraction}`;
  }
  return String(Math.round(seconds));
}

export function formatExif(data: ExifData): string {
  const focal = data.focalLength
    ? `${Number.isInteger(data.focalLength) ? data.focalLength : data.focalLength.toFixed(1)}mm`
    : '--mm';
  const aperture = data.fNumber != null ? `f/${data.fNumber}` : 'f/--';
  const shutter = data.exposureTime != null
    ? formatShutterSpeed(data.exposureTime)
    : '--';
  const iso = data.isoSpeed != null ? `ISO${data.isoSpeed}` : 'ISO--';
  return `${focal} ${aperture} 1/${shutter} ${iso}`;
}
