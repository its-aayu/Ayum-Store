import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GARMENT = '#161616';
const OUTLINE = 'rgba(242,241,237,0.10)';
const PRINT_GUIDE = 'rgba(242,241,237,0.18)';

// Print-area rects (fraction of canvas) — MockupPreview positions uploaded artwork
// using these same fractions (mirrored in src/utils/garmentTemplate.ts) so template
// and overlay always line up. Garments share one rect; the mug needs its own since
// its printable area is a low, wide band instead of a tall chest rectangle.
const TSHIRT_PRINT_AREA = { xPct: 0.33, yPct: 0.27, wPct: 0.34, hPct: 0.34 };
const MUG_PRINT_AREA = { xPct: 0.3, yPct: 0.44, wPct: 0.4, hPct: 0.2 };

function printGuideRect(width, height, printArea) {
  const x = width * printArea.xPct;
  const y = height * printArea.yPct;
  const w = width * printArea.wPct;
  const h = height * printArea.hPct;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${PRINT_GUIDE}" stroke-width="2" stroke-dasharray="8 8" rx="6"/>`;
}

function teeFront() {
  return `<path d="M280 150 L280 78 Q400 16 520 78 L520 150 L682 232 L616 344 L520 292 L520 902 L280 902 L280 292 L184 344 L118 232 Z"
    fill="${GARMENT}" stroke="${OUTLINE}" stroke-width="3"/>
    <path d="M330 82 Q400 130 470 82" fill="none" stroke="${OUTLINE}" stroke-width="4"/>`;
}

function teeBack() {
  return `<path d="M280 140 L280 90 Q400 60 520 90 L520 140 L682 232 L616 344 L520 292 L520 902 L280 902 L280 292 L184 344 L118 232 Z"
    fill="${GARMENT}" stroke="${OUTLINE}" stroke-width="3"/>
    <path d="M340 96 Q400 118 460 96" fill="none" stroke="${OUTLINE}" stroke-width="4"/>`;
}

function hoodieFront() {
  return `
    <path d="M300 210 Q400 130 500 210 L500 150 Q400 96 300 150 Z" fill="${GARMENT}" stroke="${OUTLINE}" stroke-width="3"/>
    <path d="M260 220 L260 130 Q400 60 540 130 L540 220 L700 260 L636 372 L540 322 L540 910 L260 910 L260 322 L164 372 L100 260 Z"
      fill="${GARMENT}" stroke="${OUTLINE}" stroke-width="3"/>
    <rect x="330" y="620" width="140" height="110" rx="14" fill="none" stroke="${OUTLINE}" stroke-width="3"/>
    <path d="M370 232 L360 300" stroke="${OUTLINE}" stroke-width="4" stroke-linecap="round"/>
    <path d="M430 232 L440 300" stroke="${OUTLINE}" stroke-width="4" stroke-linecap="round"/>
  `;
}

function mugFront() {
  return `
    <path d="M220 330 L220 690 Q220 730 400 730 Q580 730 580 690 L580 330"
      fill="${GARMENT}" stroke="${OUTLINE}" stroke-width="3"/>
    <ellipse cx="400" cy="330" rx="180" ry="26" fill="${GARMENT}" stroke="${OUTLINE}" stroke-width="3"/>
    <path d="M580 400 Q680 400 680 500 Q680 600 580 600" fill="none" stroke="${GARMENT}" stroke-width="34" stroke-linecap="round"/>
    <path d="M580 400 Q680 400 680 500 Q680 600 580 600" fill="none" stroke="${OUTLINE}" stroke-width="3"/>
  `;
}

function canvas(width, height, garmentSvg, printArea) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${garmentSvg}
    ${printGuideRect(width, height, printArea)}
  </svg>`;
}

async function render(page, { body, width, height, outPath }) {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;}html,body{width:${width}px;height:${height}px;}</style></head><body>${body}</body></html>`,
    { waitUntil: 'networkidle' },
  );
  mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, type: 'png', omitBackground: true });
  console.log('wrote', path.relative(ROOT, outPath));
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const width = 800;
  const height = 1000;

  await render(page, { body: canvas(width, height, teeFront(), TSHIRT_PRINT_AREA), width, height, outPath: path.join(ROOT, 'public/assets/custom/tshirt-front.png') });
  await render(page, { body: canvas(width, height, teeBack(), TSHIRT_PRINT_AREA), width, height, outPath: path.join(ROOT, 'public/assets/custom/tshirt-back.png') });
  await render(page, { body: canvas(width, height, hoodieFront(), TSHIRT_PRINT_AREA), width, height, outPath: path.join(ROOT, 'public/assets/custom/hoodie-front.png') });
  await render(page, { body: canvas(width, height, mugFront(), MUG_PRINT_AREA), width, height, outPath: path.join(ROOT, 'public/assets/custom/mug-front.png') });

  await browser.close();
}

main();
