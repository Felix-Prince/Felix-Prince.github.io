// 品牌色映射
const BRAND_COLORS: Record<string, string> = {
  Nikon: '#FFE100',
  'Nikon Full': '#FFE100',
  Canon: '#FF0000',
  Sony: '#000000',
  Fujifilm: '#00A650',
  Hasselblad: '#000000',
  'Hasselblad-T': '#000000',
  Leica: '#000000',
  'Leica Full': '#000000',
  'Leica Red Full': '#CE0E2D',
  RED: '#FF0000',
  'RED Full': '#FF0000',
  DJI: '#000000',
  Insta360: '#00A1FF',
  Kodak: '#FFCC00',
  Lumix: '#003DA5',
  Mamiya: '#000000',
  Olympus: '#0066CC',
  Panasonic: '#003DA5',
  Pentax: '#000000',
  'Phase One': '#000000',
  Ricoh: '#000000',
  Rolleiflex: '#000000',
  Sigma: '#000000',
  Tamron: '#000000',
  'Zeiss Full': '#003D7A',
};

// 品牌缩写
const BRAND_INITIALS: Record<string, string> = {
  Nikon: 'NK',
  'Nikon Full': 'NIKON',
  Canon: 'CN',
  Sony: 'SY',
  Fujifilm: 'FJ',
  Hasselblad: 'HB',
  'Hasselblad-T': 'HBT',
  Leica: 'L',
  'Leica Full': 'LEICA',
  'Leica Red Full': 'LEICA',
  RED: 'R',
  'RED Full': 'RED',
  DJI: 'DJI',
  Insta360: 'I360',
  Kodak: 'K',
  Lumix: 'LX',
  Mamiya: 'MY',
  Olympus: 'OLY',
  Panasonic: 'PANA',
  Pentax: 'PX',
  'Phase One': 'P1',
  Ricoh: 'RIC',
  Rolleiflex: 'RF',
  Sigma: 'SG',
  Tamron: 'TM',
  'Zeiss Full': 'ZEISS',
};

export function generateLogoSvg(brandName: string, size = 80): string {
  const color = BRAND_COLORS[brandName] || '#333333';
  const initials = BRAND_INITIALS[brandName] || brandName.substring(0, 2).toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 80 80">
    <rect width="80" height="80" rx="8" fill="${color}" opacity="0.9"/>
    <text x="40" y="44" text-anchor="middle" fill="#fff" font-size="${initials.length > 3 ? 18 : 24}" font-weight="bold" font-family="Arial,sans-serif" dominant-baseline="middle">${initials}</text>
    <text x="40" y="68" text-anchor="middle" fill="#fff" font-size="9" font-family="Arial,sans-serif" opacity="0.8">${brandName.replace(' Full', '')}</text>
  </svg>`;
}

export function logoToDataUrl(brandName: string): string {
  const svg = generateLogoSvg(brandName);
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
