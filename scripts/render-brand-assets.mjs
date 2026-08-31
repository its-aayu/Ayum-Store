import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const out = (p) => path.join(ROOT, 'public', p);

// NOTE: assets/hero/*, assets/services/services-banner.jpg, assets/custom/custom-design-banner.jpg,
// and assets/brand/{favicon,logo-full,mark}* are all real AI-generated brand assets now (see
// src/assets/ + scripts/process-real-assets.mjs + scripts/process-brand-v2.mjs). This script only
// still owns assets/seo/og-image.jpg, which is a pure code composition with no "real" replacement —
// do not add a job here for anything that has since become a real asset, or you'll clobber it.

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@500;700&display=swap" rel="stylesheet">`;

function baseHtml({ width, height, body, background = '#0b0d0d' }) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { width:${width}px; height:${height}px; overflow:hidden; }
    .canvas { width:${width}px; height:${height}px; position:relative; background:${background}; }
  </style></head>
  <body><div class="canvas">${body}</div></body></html>`;
}

function textureDefs(id) {
  return `
    <defs>
      <pattern id="grain-${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#B38F6F" stroke-width="0.6" opacity="0.05"/>
      </pattern>
      <radialGradient id="glow-${id}" cx="78%" cy="28%" r="60%">
        <stop offset="0%" stop-color="#B38F6F" stop-opacity="0.16"/>
        <stop offset="55%" stop-color="#B38F6F" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#B38F6F" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vignette-${id}" cx="50%" cy="50%" r="75%">
        <stop offset="55%" stop-color="#0b0d0d" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
      </radialGradient>
    </defs>`;
}

function markDataUri() {
  const buf = readFileSync(path.join(ROOT, 'public', 'assets', 'brand', 'mark.png'));
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function ogSvg() {
  const width = 1200;
  const height = 630;
  const markSrc = markDataUri();
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${textureDefs('og')}
    <rect width="${width}" height="${height}" fill="#0b0d0d"/>
    <rect width="${width}" height="${height}" fill="url(#glow-og)"/>
    <rect width="${width}" height="${height}" fill="url(#grain-og)"/>
    <image href="${markSrc}" x="${width / 2 - 90}" y="70" height="130" preserveAspectRatio="xMidYMid meet"/>
    <text x="${width / 2}" y="300" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="88" font-weight="600" letter-spacing="10" fill="#B38F6F">AYUM</text>
    <line x1="${width / 2 - 180}" y1="352" x2="${width / 2 - 90}" y2="352" stroke="#710014" stroke-width="2"/>
    <text x="${width / 2}" y="359" text-anchor="middle" font-family="Manrope, sans-serif" font-size="20" font-weight="700" letter-spacing="5" fill="#F2F1ED">WEAR WHAT YOU IMAGINE</text>
    <line x1="${width / 2 + 90}" y1="352" x2="${width / 2 + 180}" y2="352" stroke="#710014" stroke-width="2"/>
    <rect width="${width}" height="${height}" fill="url(#vignette-og)"/>
  </svg>`;
}

async function render(page, { html, width, height, outPath, format }) {
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(150); // let web fonts settle
  mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, type: format, quality: format === 'jpeg' ? 92 : undefined });
  console.log('wrote', path.relative(ROOT, outPath));
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await render(page, {
    html: baseHtml({ width: 1200, height: 630, body: ogSvg() }),
    width: 1200,
    height: 630,
    outPath: out('assets/seo/og-image.jpg'),
    format: 'jpeg',
  });

  await browser.close();
}

main();
