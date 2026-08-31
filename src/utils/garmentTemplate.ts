import type { ProductCategory } from '@/types';
import type { PrintArea } from '@/components/mockup/MockupPreview';

const TSHIRT_PRINT_AREA: PrintArea = { xPct: 0.33, yPct: 0.27, wPct: 0.34, hPct: 0.34 };

/**
 * Flat garment mockup templates live in public/assets/custom/ and share one print-area
 * rect with the renderer that generated them (scripts/render-custom-mockups.mjs).
 * Categories without a dedicated template fall back to the product's own card image.
 */
export function getGarmentTemplate(category: ProductCategory): { image: string; printArea: PrintArea } | null {
  switch (category) {
    case 'tshirt':
    case 'oversized':
    case 'sweatshirt':
      return { image: '/assets/custom/tshirt-front.png', printArea: TSHIRT_PRINT_AREA };
    case 'hoodie':
      return { image: '/assets/custom/hoodie-front.png', printArea: TSHIRT_PRINT_AREA };
    default:
      return null;
  }
}
