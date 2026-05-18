export type ExifResult = Record<string, unknown>;

let exifrModule: Promise<typeof import('exifr')> | null = null;

function getExifr(): Promise<typeof import('exifr')> {
  if (!exifrModule) {
    exifrModule = import('exifr');
  }
  return exifrModule;
}

export async function parseExif(
  file: File,
  options?: { pick?: string[]; multiSegment?: boolean },
): Promise<ExifResult> {
  try {
    const exifr = await getExifr();
    const parseFn = exifr.default?.parse ?? exifr.parse;
    const result = await parseFn(file, options ?? { multiSegment: true });
    return (result as ExifResult) ?? {};
  } catch {
    return {};
  }
}
