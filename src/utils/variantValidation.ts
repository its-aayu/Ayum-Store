export type VariantValidationInput = {
  sizes?: string[];
  colors?: { name: string }[];
  selectedSize: string | null;
  selectedColor: string | null;
};

export type VariantValidationResult = {
  valid: boolean;
  sizeError?: string;
  colorError?: string;
};

/** Centralizes the "size must be selected if the product has sizes" rule from AYUM-IMPLEMENTATION.md §18. */
export function validateVariantSelection(input: VariantValidationInput): VariantValidationResult {
  const result: VariantValidationResult = { valid: true };

  if (input.sizes && input.sizes.length > 0 && !input.selectedSize) {
    result.sizeError = 'Please select a size.';
    result.valid = false;
  }

  if (input.colors && input.colors.length > 0 && !input.selectedColor) {
    result.colorError = 'Please select a colour.';
    result.valid = false;
  }

  return result;
}
