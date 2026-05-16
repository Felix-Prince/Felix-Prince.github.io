// EXIF Make → 品牌名称映射
const EXIF_BRAND_MAP: Record<string, string> = {
  NIKON: 'Nikon',
  NIKON_CORPORATION: 'Nikon',
  CANON: 'Canon',
  SONY: 'Sony',
  FUJIFILM: 'Fujifilm',
  HASSELBLAD: 'Hasselblad',
  LEICA: 'Leica',
  'PHASE ONE': 'Phase One',
  PENTAX: 'Pentax',
  OLYMPUS: 'Olympus',
  OLYMPUS_IMAGING_CORP: 'Olympus',
  PANASONIC: 'Panasonic',
  RICOH: 'Ricoh',
  SIGMA: 'Sigma',
  TAMRON: 'Tamron',
  DJI: 'DJI',
};

export function detectBrandFromExif(make: string | undefined): string | null {
  if (!make) return null;
  const key = make.trim().toUpperCase().replace(/\s+/g, '_');
  // 精确匹配
  if (EXIF_BRAND_MAP[key]) return EXIF_BRAND_MAP[key];
  // 模糊匹配：检查品牌名是否包含在 EXIF Make 中
  for (const [, brand] of Object.entries(EXIF_BRAND_MAP)) {
    const brandKey = brand.toUpperCase().replace(/\s+/g, '_');
    if (key.includes(brandKey) || brandKey.includes(key)) {
      return brand;
    }
  }
  return null;
}
