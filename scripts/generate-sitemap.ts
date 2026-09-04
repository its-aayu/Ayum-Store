import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { products } from '../src/data/products.ts';
import { categories } from '../src/data/categories.ts';

const siteUrl = (process.env.VITE_SITE_URL || 'https://ayum.com').replace(/\/+$/, '');

const staticRoutes = [
  '/',
  '/shop',
  '/custom',
  '/about',
  '/services',
  '/contact',
  '/faq',
  '/shipping',
  '/returns',
  '/refunds',
  '/cancellation',
  '/privacy',
  '/terms',
  '/custom-design-policy',
];

const categoryRoutes = categories.map((c) => `/shop/${c.slug}`);
const productRoutes = products.filter((p) => p.available).map((p) => `/product/${p.slug}`);

const urls = [...staticRoutes, ...categoryRoutes, ...productRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`).join('\n')}
</urlset>
`;

const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf-8');
console.log(`Sitemap written to ${outPath} (${urls.length} URLs)`);
