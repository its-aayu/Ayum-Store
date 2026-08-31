/**
 * Central site configuration.
 * All values that could change per-environment (numbers, links, IDs)
 * are read from env vars here rather than scattered through components.
 */

const digitsOnly = (value: string) => value.replace(/[^\d]/g, '');

export const siteConfig = {
  brand: {
    name: 'AYUM',
    tagline: 'Wear What You Imagine.',
    subTagline: 'Premium designs and custom pieces made for your expression.',
    description:
      'AYUM is a premium print-on-demand and custom design studio for original streetwear and customer-uploaded designs.',
  },
  contact: {
    whatsappNumber: digitsOnly(import.meta.env.VITE_WHATSAPP_NUMBER ?? ''),
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || '',
    instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || '',
  },
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://ayum.com',
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  },
  analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
  currency: 'INR' as const,
  currencySymbol: '₹',
  upload: {
    maxSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'] as const,
  },
  quantity: {
    min: 1,
    max: 20,
  },
} as const;
