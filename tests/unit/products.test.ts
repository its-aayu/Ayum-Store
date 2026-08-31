import { describe, expect, it } from 'vitest';
import { products, getProductBySlug, getProductsByCategory } from '@/data/products';

describe('product data', () => {
  it('has stable, non-index-based ids for every product', () => {
    for (const product of products) {
      expect(product.id).toMatch(/^AY-[A-Z]{2}\d{3}$/);
    }
  });

  it('has unique slugs and ids', () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });
});

describe('getProductBySlug', () => {
  it('finds an existing product', () => {
    expect(getProductBySlug('classic-crest-tee')?.id).toBe('AY-TS001');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getProductBySlug('does-not-exist')).toBeUndefined();
  });
});

describe('getProductsByCategory', () => {
  it('only returns products in the requested category', () => {
    const mugs = getProductsByCategory('mug');
    expect(mugs.length).toBeGreaterThan(0);
    expect(mugs.every((p) => p.category === 'mug')).toBe(true);
  });
});
