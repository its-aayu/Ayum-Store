import type { ProductCategory } from '@/types';

export type CategoryDefinition = {
  id: ProductCategory;
  slug: string;
  label: string;
  description: string;
};

export const categories: CategoryDefinition[] = [
  { id: 'tshirt', slug: 'tshirts', label: 'T-Shirts', description: 'Everyday essentials, elevated.' },
  { id: 'oversized', slug: 'oversized', label: 'Oversized Tees', description: 'Relaxed fit, statement graphics.' },
  { id: 'hoodie', slug: 'hoodies', label: 'Hoodies', description: 'Heavyweight comfort for cooler days.' },
  { id: 'sweatshirt', slug: 'sweatshirts', label: 'Sweatshirts', description: 'Classic crewneck layering pieces.' },
  { id: 'cap', slug: 'caps', label: 'Caps', description: 'Structured and unstructured headwear.' },
  { id: 'mug', slug: 'mugs', label: 'Mugs', description: 'Custom prints for your everyday brew.' },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return categories.find((c) => c.slug === slug);
}
