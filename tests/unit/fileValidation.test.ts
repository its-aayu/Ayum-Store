import { describe, expect, it } from 'vitest';
import { validateUploadFile } from '@/utils/fileValidation';

// Minimal valid PNG signature + IHDR-ish bytes so createImageBitmap has something to decode.
// jsdom doesn't implement createImageBitmap, so these tests focus on the checks that run before it.

function makeFile(bytes: number[], name: string, type: string): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

describe('validateUploadFile', () => {
  it('rejects files larger than 10 MB', async () => {
    const bigFile = new File([new Uint8Array(11 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    const result = await validateUploadFile(bigFile);
    expect(result).toEqual({ valid: false, error: 'File is larger than 10 MB.' });
  });

  it('rejects unsupported MIME types', async () => {
    const file = makeFile([0, 1, 2, 3], 'malware.exe', 'application/x-msdownload');
    const result = await validateUploadFile(file);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toBe("This file type isn't supported.");
  });

  it('rejects a mismatched extension for an otherwise allowed MIME type', async () => {
    const file = makeFile(PNG_HEADER, 'design.txt', 'image/png');
    const result = await validateUploadFile(file);
    expect(result.valid).toBe(false);
  });

  it('rejects a file whose content does not match its declared type (renamed file attack)', async () => {
    const fakePng = makeFile([0x4d, 0x5a, 0x90, 0x00], 'fake.png', 'image/png');
    const result = await validateUploadFile(fakePng);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toBe("We couldn't read this file. Please try another file.");
  });

  it('rejects empty files', async () => {
    const empty = makeFile([], 'empty.png', 'image/png');
    const result = await validateUploadFile(empty);
    expect(result.valid).toBe(false);
  });
});
