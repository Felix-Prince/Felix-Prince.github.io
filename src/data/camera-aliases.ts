const CAMERA_ALIASES: Record<string, string> = {
  'ILCE-7M4': 'Sony A7M4',
  'ILCE-7M3': 'Sony A7M3',
  'ILCE-7M2': 'Sony A7M2',
  'ILCE-7RM5': 'Sony A7RV',
  'ILCE-7RM4': 'Sony A7RIV',
  'ILCE-7RM3': 'Sony A7RIII',
  'ILCE-7SM3': 'Sony A7SIII',
  'ILCE-7C': 'Sony A7C',
  'ILCE-9': 'Sony A9',
  'ILCE-9M2': 'Sony A9 II',
  'ILCE-1': 'Sony A1',
  'ILCE-6700': 'Sony A6700',
  'ILCE-6400': 'Sony A6400',
  'ILCE-6600': 'Sony A6600',
  'ILCE-': 'Sony ',
  'NIKON Z 9': 'Nikon Z9',
  'NIKON Z 8': 'Nikon Z8',
  'NIKON Z 7_2': 'Nikon Z7 II',
  'NIKON Z 6_2': 'Nikon Z6 II',
  'NIKON Z 5': 'Nikon Z5',
  'NIKON Z 50': 'Nikon Z50',
  'NIKON Z 30': 'Nikon Z30',
  'NIKON Z f': 'Nikon Zf',
  'NIKON D850': 'Nikon D850',
  'NIKON D780': 'Nikon D780',
  'NIKON ': 'Nikon ',
  'Canon EOS R5': 'Canon EOS R5',
  'Canon EOS R6': 'Canon EOS R6',
  'Canon EOS R6 Mark II': 'Canon EOS R6 II',
  'Canon EOS R8': 'Canon EOS R8',
  'Canon EOS R': 'Canon EOS R',
  'Canon EOS RP': 'Canon EOS RP',
  'Canon EOS R3': 'Canon EOS R3',
  'Canon EOS R100': 'Canon EOS R100',
  'Canon EOS 5D Mark IV': 'Canon 5D IV',
  'Canon EOS 90D': 'Canon 90D',
  'Canon ': 'Canon ',
  'FUJIFILM X-T5': 'Fujifilm X-T5',
  'FUJIFILM X-T4': 'Fujifilm X-T4',
  'FUJIFILM X-T3': 'Fujifilm X-T3',
  'FUJIFILM X-T30': 'Fujifilm X-T30',
  'FUJIFILM X-T50': 'Fujifilm X-T50',
  'FUJIFILM X-S10': 'Fujifilm X-S10',
  'FUJIFILM X-S20': 'Fujifilm X-S20',
  'FUJIFILM X100V': 'Fujifilm X100V',
  'FUJIFILM X100VI': 'Fujifilm X100VI',
  'FUJIFILM GFX 100S': 'Fujifilm GFX 100S',
  'FUJIFILM GFX 50S II': 'Fujifilm GFX 50S II',
  'FUJIFILM ': 'Fujifilm ',
  'RICOH GR III': 'Ricoh GR III',
  'RICOH GR IIIx': 'Ricoh GR IIIx',
  'RICOH ': 'Ricoh ',
  'LEICA Q3': 'Leica Q3',
  'LEICA M11': 'Leica M11',
  'LEICA SL2': 'Leica SL2',
  'LEICA ': 'Leica ',
  'Panasonic DC-S5M2': 'Panasonic S5 II',
  'Panasonic DC-S5': 'Panasonic S5',
  'Panasonic ': 'Panasonic ',
};

export function getCameraAlias(make: string, model: string): string {
  const fullKey = `${make} ${model}`.trim();
  // Try exact match first
  if (CAMERA_ALIASES[fullKey]) return CAMERA_ALIASES[fullKey];

  // Try prefix match (longest first)
  const sortedKeys = Object.keys(CAMERA_ALIASES).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (fullKey.startsWith(key)) {
      const suffix = fullKey.slice(key.length).trim();
      return suffix ? `${CAMERA_ALIASES[key]}${suffix}` : CAMERA_ALIASES[key];
    }
  }

  // Return formatted raw
  return `${make} ${model}`.trim() || 'Unknown Camera';
}
