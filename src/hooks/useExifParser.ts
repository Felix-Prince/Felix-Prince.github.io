import { useState, useCallback } from 'react';
import { parseExif as sharedParseExif } from '../utils/exif-parser';

export interface GroupedExifData {
  camera: { label: string; value: string }[];
  exposure: { label: string; value: string }[];
  lens: { label: string; value: string }[];
  gps: { label: string; value: string }[];
  time: { label: string; value: string }[];
  other: { label: string; value: string }[];
}

export interface ExifParseResult {
  raw: Record<string, unknown>;
  grouped: GroupedExifData;
  summary: {
    make?: string;
    model?: string;
    focalLength?: number;
    fNumber?: number;
    exposureTime?: number;
    iso?: number;
    dateTimeOriginal?: string;
  };
}

interface UseExifParserReturn {
  parseExif: (file: File) => Promise<ExifParseResult>;
  isParsing: boolean;
  error: string | null;
}

const EXIF_FIELD_LABELS: Record<string, string> = {
  Make: '相机品牌',
  Model: '相机型号',
  Software: '软件',
  Artist: '作者',
  FNumber: '光圈',
  ExposureTime: '快门速度',
  ISOSpeedRatings: 'ISO 感光度',
  ExposureBiasValue: '曝光补偿',
  MeteringMode: '测光模式',
  ExposureProgram: '曝光程序',
  Flash: '闪光灯',
  FocalLength: '焦距',
  FocalLengthIn35mmFilm: '等效 35mm 焦距',
  LensModel: '镜头型号',
  LensSpecification: '镜头规格',
  GPSLatitude: 'GPS 纬度',
  GPSLongitude: 'GPS 经度',
  GPSAltitude: 'GPS 海拔',
  DateTimeOriginal: '拍摄时间',
  DateTimeDigitized: '数字化时间',
  OffsetTimeOriginal: '时区偏移',
  WhiteBalance: '白平衡',
  ColorSpace: '色彩空间',
  FileSource: '文件来源',
  SceneType: '场景类型',
  Contrast: '对比度',
  Saturation: '饱和度',
  Sharpness: '锐度',
};

const METERING_MODE_MAP: Record<number, string> = {
  1: '平均测光',
  2: '中央重点测光',
  3: '点测光',
  4: '多区域测光',
  5: '评价测光',
  6: '部分测光',
  255: '其他',
};

const EXPOSURE_PROGRAM_MAP: Record<number, string> = {
  1: '手动',
  2: '程序自动',
  3: '光圈优先',
  4: '快门优先',
  5: '创意程序',
  6: '运动模式',
  7: '肖像模式',
  8: '风景模式',
};

const FLASH_MAP: Record<number, string> = {
  0: '无闪光',
  1: '闪光',
  5: '防红眼',
  9: '闪光',
  13: '防红眼',
  16: '无闪光',
  24: '无闪光',
};

function formatFlash(val: unknown): string {
  if (typeof val !== 'number') return String(val ?? '--');
  return FLASH_MAP[val] ?? `闪光模式 ${val}`;
}

function formatMeteringMode(val: unknown): string {
  if (typeof val !== 'number') return String(val ?? '--');
  return METERING_MODE_MAP[val] ?? `模式 ${val}`;
}

function formatExposureProgram(val: unknown): string {
  if (typeof val !== 'number') return String(val ?? '--');
  return EXPOSURE_PROGRAM_MAP[val] ?? `程序 ${val}`;
}

function formatExposureTime(val: unknown): string {
  if (typeof val !== 'number') return '--';
  return val >= 1 ? `${val}s` : `1/${Math.round(1 / val)}s`;
}

function formatGps(val: unknown): string {
  if (Array.isArray(val)) {
    return val
      .map((v) => {
        if (typeof v === 'number') return v.toFixed(4);
        if (Array.isArray(v)) {
          // [degrees, minutes, seconds] format
          return v.reduce((acc, n, i) => {
            const div = i === 0 ? 1 : 60;
            return acc + (typeof n === 'number' ? n / div : 0);
          }, 0).toFixed(4);
        }
        return String(v);
      })
      .join(', ');
  }
  return val != null ? String(val) : '--';
}

function formatValue(key: string, val: unknown): string {
  if (val == null || val === undefined) return '--';

  switch (key) {
    case 'ExposureTime':
      return formatExposureTime(val);
    case 'FNumber':
      return typeof val === 'number' ? `f/${val}` : String(val);
    case 'ISOSpeedRatings':
      return `ISO ${val}`;
    case 'FocalLength':
      return typeof val === 'number' ? `${val}mm` : String(val);
    case 'FocalLengthIn35mmFilm':
      return typeof val === 'number' ? `${val}mm` : String(val);
    case 'MeteringMode':
      return formatMeteringMode(val);
    case 'ExposureProgram':
      return formatExposureProgram(val);
    case 'Flash':
      return formatFlash(val);
    case 'GPSLatitude':
    case 'GPSLongitude':
    case 'GPSAltitude':
      return formatGps(val);
    case 'WhiteBalance':
      return val === 1 || val === '1' ? '自动' : String(val);
    default:
      return String(val);
  }
}

function groupExifFields(raw: Record<string, unknown>): GroupedExifData {
  const camera: { label: string; value: string }[] = [];
  const exposure: { label: string; value: string }[] = [];
  const lens: { label: string; value: string }[] = [];
  const gps: { label: string; value: string }[] = [];
  const time: { label: string; value: string }[] = [];
  const other: { label: string; value: string }[] = [];

  const cameraKeys = ['Make', 'Model', 'Software', 'Artist'];
  const exposureKeys = [
    'FNumber', 'ExposureTime', 'ISOSpeedRatings', 'ExposureBiasValue',
    'MeteringMode', 'ExposureProgram', 'Flash',
  ];
  const lensKeys = ['FocalLength', 'FocalLengthIn35mmFilm', 'LensModel', 'LensSpecification'];
  const gpsKeys = ['GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSLatitudeRef', 'GPSLongitudeRef', 'GPSAltitudeRef'];
  const timeKeys = ['DateTimeOriginal', 'DateTimeDigitized', 'OffsetTimeOriginal'];

  for (const [key, val] of Object.entries(raw)) {
    if (val == null || val === '') continue;
    const label = EXIF_FIELD_LABELS[key] || key;
    const value = formatValue(key, val);
    const entry = { label, value };

    if (cameraKeys.includes(key)) camera.push(entry);
    else if (exposureKeys.includes(key)) exposure.push(entry);
    else if (lensKeys.includes(key)) lens.push(entry);
    else if (gpsKeys.includes(key)) gps.push(entry);
    else if (timeKeys.includes(key)) time.push(entry);
    else other.push(entry);
  }

  return { camera, exposure, lens, gps, time, other };
}

function extractSummary(raw: Record<string, unknown>) {
  return {
    make: raw.Make as string | undefined,
    model: raw.Model as string | undefined,
    focalLength: raw.FocalLength as number | undefined,
    fNumber: raw.FNumber as number | undefined,
    exposureTime: raw.ExposureTime as number | undefined,
    iso: raw.ISOSpeedRatings as number | undefined,
    dateTimeOriginal: raw.DateTimeOriginal as string | undefined,
  };
}

export function useExifParser(): UseExifParserReturn {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseExif = useCallback(async (file: File): Promise<ExifParseResult> => {
    setIsParsing(true);
    setError(null);

    try {
      const raw = await sharedParseExif(file);

      const result: ExifParseResult = {
        raw,
        grouped: groupExifFields(raw),
        summary: extractSummary(raw),
      };

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'EXIF 解析失败';
      setError(msg);
      return {
        raw: {},
        grouped: { camera: [], exposure: [], lens: [], gps: [], time: [], other: [] },
        summary: {},
      };
    } finally {
      setIsParsing(false);
    }
  }, []);

  return { parseExif, isParsing, error };
}
