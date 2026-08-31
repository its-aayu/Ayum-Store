import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { products } from '../src/data/products.ts';
import { categories } from '../src/data/categories.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Manrope:wght@600;700&display=swap" rel="stylesheet">`;

// Lucide stroke-icon path data (ISC licensed, from lucide-react) — reused as static art, not React components.
const ICONS = {
  shirt: `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>`,
  coffee: `<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>`,
  // Hand-drawn to match the lucide stroke style — no baseball-cap icon ships in this set.
  cap: `<path d="M4 13c0-4.4 3.6-8 8-8s8 3.6 8 8"/><path d="M2 14c2-1.4 5-2 10-2s8 .6 10 2"/><circle cx="12" cy="5" r="0.6" fill="currentColor" stroke="none"/>`,
};

const CATEGORY_ICON = {
  tshirt: 'shirt',
  oversized: 'shirt',
  hoodie: 'shirt',
  sweatshirt: 'shirt',
  cap: 'cap',
  mug: 'coffee',
};

function luminance(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function cardSvg({ bg, iconKey, iconColor, mirror, label }) {
  const width = 480;
  const height = 600;
  const iconSize = 220;
  const iconX = (width - iconSize) / 2;
  const iconY = (height - iconSize) / 2 - 20;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    <rect width="${width}" height="${height}" fill="none" stroke="${iconColor}" stroke-opacity="0.08" stroke-width="1"/>
    <g transform="translate(${iconX},${iconY}) ${mirror ? `translate(${iconSize},0) scale(-1,1)` : ''}">
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" style="color:${iconColor}">
        ${ICONS[iconKey]}
      </svg>
    </g>
    <text x="${width / 2}" y="${height - 96}" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="15" letter-spacing="4" fill="${iconColor}" opacity="0.8">AYUM</text>
    <text x="${width / 2}" y="${height - 60}" text-anchor="middle" font-family="Manrope, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5" fill="${iconColor}" opacity="0.6">${label.toUpperCase()}</text>
  </svg>`;
}

function baseHtml(width, height, body) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}<style>
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:${width}px;height:${height}px;}
  </style></head><body>${body}</body></html>`;
}

async function render(page, { body, width, height, outPath }) {
  await page.setViewportSize({ width, height });
  await page.setContent(baseHtml(width, height, body), { waitUntil: 'networkidle' });
  await page.waitForTimeout(120);
  mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, type: 'png' });
  console.log('wrote', path.relative(ROOT, outPath));
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const product of products) {
    const category = categories.find((c) => c.id === product.category);
    const folder = category ? category.slug : product.category;
    const iconKey = CATEGORY_ICON[product.category] ?? 'shirt';
    const primaryColor = product.colors?.[0]?.hex ?? '#F2F1ED';
    const secondaryColor = product.colors?.[1]?.hex ?? primaryColor;

    for (const [variant, bg, mirror] of [
      ['1', primaryColor, false],
      ['2', secondaryColor, true],
    ]) {
      const iconColor = luminance(bg) > 0.5 ? '#161616' : '#F2F1ED';
      const svg = cardSvg({
        bg,
        iconKey,
        iconColor,
        mirror,
        label: product.name,
      });
      const outPath = path.join(ROOT, 'public', 'assets', 'products', folder, `${product.slug}-${variant}.png`);
      await render(page, { body: svg, width: 480, height: 600, outPath });
    }
  }

  await browser.close();
}

main();
