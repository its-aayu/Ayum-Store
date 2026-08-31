import { siteConfig } from '@/config/site';

export type FileValidationResult = { valid: true } | { valid: false; error: string };

const EXTENSION_BY_MIME: Record<string, string[]> = {
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/webp': ['webp'],
  'application/pdf': ['pdf'],
};

/** Magic-byte signatures so a renamed .exe can't pass as a .png. */
const SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  // WEBP: 'RIFF'....'WEBP' — checked separately below.
];

async function readHeader(file: File, length = 16): Promise<Uint8Array> {
  const buffer = await file.slice(0, length).arrayBuffer();
  return new Uint8Array(buffer);
}

function matchesSignature(header: Uint8Array, mime: string): boolean {
  if (mime === 'image/webp') {
    const riff = String.fromCharCode(...header.slice(0, 4));
    const webp = String.fromCharCode(...header.slice(8, 12));
    return riff === 'RIFF' && webp === 'WEBP';
  }
  const signature = SIGNATURES.find((s) => s.mime === mime);
  if (!signature) return false;
  return signature.bytes.every((byte, index) => header[index] === byte);
}

function getExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? (parts.pop() ?? '').toLowerCase() : '';
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return null;
  }
}

const MIN_IMAGE_DIMENSION = 300;

export async function validateUploadFile(file: File): Promise<FileValidationResult> {
  if (file.size > siteConfig.upload.maxSizeBytes) {
    return { valid: false, error: 'File is larger than 10 MB.' };
  }

  if (file.size === 0) {
    return { valid: false, error: "We couldn't read this file. Please try another file." };
  }

  const allowedMimes: readonly string[] = siteConfig.upload.allowedMimeTypes;
  if (!allowedMimes.includes(file.type)) {
    return { valid: false, error: "This file type isn't supported." };
  }

  const extension = getExtension(file.name);
  const allowedExtensions = EXTENSION_BY_MIME[file.type] ?? [];
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: "This file type isn't supported." };
  }

  let header: Uint8Array;
  try {
    header = await readHeader(file);
  } catch {
    return { valid: false, error: "We couldn't read this file. Please try another file." };
  }

  if (!matchesSignature(header, file.type)) {
    return { valid: false, error: "We couldn't read this file. Please try another file." };
  }

  if (file.type !== 'application/pdf') {
    const dimensions = await getImageDimensions(file);
    if (!dimensions) {
      return { valid: false, error: "We couldn't read this file. Please try another file." };
    }
    if (dimensions.width < MIN_IMAGE_DIMENSION || dimensions.height < MIN_IMAGE_DIMENSION) {
      return {
        valid: false,
        error: `Image is too small for print. Please use at least ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}px.`,
      };
    }
  }

  return { valid: true };
}
