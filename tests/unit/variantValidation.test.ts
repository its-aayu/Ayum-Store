import { describe, expect, it } from 'vitest';
import { validateVariantSelection } from '@/utils/variantValidation';

describe('validateVariantSelection', () => {
  it('requires a size when the product has sizes', () => {
    const result = validateVariantSelection({ sizes: ['S', 'M'], selectedSize: null, selectedColor: null });
    expect(result.valid).toBe(false);
    expect(result.sizeError).toBe('Please select a size.');
  });

  it('requires a colour when the product has colours', () => {
    const result = validateVariantSelection({
      colors: [{ name: 'Black' }],
      selectedSize: null,
      selectedColor: null,
    });
    expect(result.valid).toBe(false);
    expect(result.colorError).toBe('Please select a colour.');
  });

  it('passes when the product has no variants at all', () => {
    const result = validateVariantSelection({ selectedSize: null, selectedColor: null });
    expect(result.valid).toBe(true);
  });

  it('passes once both required variants are selected', () => {
    const result = validateVariantSelection({
      sizes: ['S', 'M'],
      colors: [{ name: 'Black' }],
      selectedSize: 'M',
      selectedColor: 'Black',
    });
    expect(result.valid).toBe(true);
    expect(result.sizeError).toBeUndefined();
    expect(result.colorError).toBeUndefined();
  });
});
