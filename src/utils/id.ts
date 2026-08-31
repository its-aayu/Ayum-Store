const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function randomCode(length: number): string {
  let out = '';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    out += ALPHABET[byte % ALPHABET.length];
  }
  return out;
}

/** Short, non-sensitive, human-readable order reference: AY-REQ-XXXXXX */
export function generateOrderRequestId(): string {
  return `AY-REQ-${randomCode(6)}`;
}

/** Reference attached to a custom design so it can be cited in the WhatsApp message. */
export function generateCustomDesignId(): string {
  return `AY-CUSTOM-${randomCode(6)}`;
}

export function generateCartItemId(): string {
  return `ci_${randomCode(8)}`;
}
