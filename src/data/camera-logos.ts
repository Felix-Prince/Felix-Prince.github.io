export interface CameraLogoMeta {
  name: string;
  file: string;
  hasFull: boolean;
}

export const CAMERA_LOGOS: CameraLogoMeta[] = [
  { name: 'Nikon', file: 'nikon.png', hasFull: true },
  { name: 'Nikon Full', file: 'nikon_full.png', hasFull: true },
  { name: 'Canon', file: 'canon.png', hasFull: false },
  { name: 'Sony', file: 'sony.png', hasFull: false },
  { name: 'Fujifilm', file: 'fujifilm.png', hasFull: false },
  { name: 'Hasselblad', file: 'hasselblad.png', hasFull: true },
  { name: 'Hasselblad-T', file: 'hasselblad-t.png', hasFull: false },
  { name: 'Leica', file: 'leica.png', hasFull: true },
  { name: 'Leica Full', file: 'leica_full.png', hasFull: true },
  { name: 'Leica Red Full', file: 'leica_red_full.png', hasFull: true },
  { name: 'RED', file: 'red.png', hasFull: true },
  { name: 'RED Full', file: 'red_full.png', hasFull: true },
  { name: 'DJI', file: 'dji.png', hasFull: false },
  { name: 'Insta360', file: 'insta360.png', hasFull: false },
  { name: 'Kodak', file: 'kodak.png', hasFull: false },
  { name: 'Lumix', file: 'lumix.png', hasFull: false },
  { name: 'Mamiya', file: 'mamiya.png', hasFull: false },
  { name: 'Olympus', file: 'olympus.png', hasFull: false },
  { name: 'Panasonic', file: 'panasonic.png', hasFull: false },
  { name: 'Pentax', file: 'pentax.png', hasFull: false },
  { name: 'Phase One', file: 'phase_one.png', hasFull: false },
  { name: 'Ricoh', file: 'ricoh.png', hasFull: false },
  { name: 'Rolleiflex', file: 'rolleiflex.png', hasFull: false },
  { name: 'Sigma', file: 'sigma.png', hasFull: false },
  { name: 'Tamron', file: 'tamron.png', hasFull: false },
  { name: 'Zeiss Full', file: 'zeiss_full.png', hasFull: true },
];

export function getLogoPath(name: string): string {
  const meta = CAMERA_LOGOS.find((l) => l.name === name);
  if (!meta) return '';
  return `/assets/logos/${meta.file}`;
}
