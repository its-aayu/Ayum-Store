export type ProductCategory = 'tshirt' | 'oversized' | 'hoodie' | 'sweatshirt' | 'cap' | 'mug';

export type ProductColor = {
  name: string;
  hex?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  currency: 'INR';
  images: string[];
  sizes?: string[];
  colors?: ProductColor[];
  material?: string;
  printMethod?: string;
  careInstructions?: string[];
  deliveryEstimate?: string;
  available: boolean;
  /** No photography ready yet — shown blurred with a "Coming Soon" state, no variant selection or interest CTA. */
  comingSoon?: boolean;
  featured?: boolean;
  tags?: string[];
  allowCustomDesign?: boolean;
};
