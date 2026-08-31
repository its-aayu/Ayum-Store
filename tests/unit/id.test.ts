import { describe, expect, it } from 'vitest';
import { generateOrderRequestId, generateCustomDesignId } from '@/utils/id';

describe('generateOrderRequestId', () => {
  it('matches the AY-REQ-XXXXXX format', () => {
    expect(generateOrderRequestId()).toMatch(/^AY-REQ-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  });

  it('is unlikely to collide across repeated calls', () => {
    const ids = new Set(Array.from({ length: 200 }, () => generateOrderRequestId()));
    expect(ids.size).toBe(200);
  });
});

describe('generateCustomDesignId', () => {
  it('matches the AY-CUSTOM-XXXXXX format', () => {
    expect(generateCustomDesignId()).toMatch(/^AY-CUSTOM-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  });
});
