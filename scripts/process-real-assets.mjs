import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src', 'assets');
const PUB = path.join(ROOT, 'public', 'assets');

const JOBS = [
  { src: 'Hero & Homepage.png', out: 'hero/hero-desktop.jpg', quality: 82 },
  { src: 'Homepage Hero — Mobile.png', out: 'hero/hero-mobile.jpg', quality: 82 },
  { src: 'About.png', out: 'about/about-ayum.jpg', quality: 85 },
  { src: 'Creative & Social Services.png', out: 'services/services-banner.jpg', quality: 85 },
  { src: 'Quality Check.png', out: 'about/quality-check.jpg', quality: 85 },
  { src: 'Shipping.png', out: 'about/shipping.jpg', quality: 85 },
  { src: 'Social Media Management.png', out: 'services/social-media.jpg', quality: 82 },
  { src: 'Graphic Design.png', out: 'services/graphic-design.jpg', quality: 82 },
  { src: 'Video & Reels Editing.png', out: 'services/video-editing.jpg', quality: 82 },
  { src: 'Content Creation.png', out: 'services/content.jpg', quality: 82 },
  { src: 'Content Strategy.png', out: 'services/strategy.jpg', quality: 82 },
  { src: 'Branding.png', out: 'services/branding.jpg', quality: 82 },
  { src: 'Packaging — Unopened.jpeg', out: 'packaging/ayum-packaging.jpg', quality: 85 },
  { src: 'Packaging — Opened.jpeg', out: 'packaging/ayum-package-open.jpg', quality: 85 },
  { src: 'Order Ready for Courier.jpeg', out: 'packaging/ayum-order-ready.jpg', quality: 85 },
  { src: 'Create you own banner.png', out: 'custom/custom-design-banner.jpg', quality: 85 },
];

const MAX_DIMENSION = 1920;

// Product photography — cropped to a fixed 4:5 (matches how every product image renders
// across the site: ProductCard, ImageGallery, cart thumbnails). Only products with usable,
// non-infringing photos are listed here — see README/AYUM-IMPLEMENTATION.md notes on the
// products still marked `comingSoon` in src/data/products.ts.
const PRODUCT_JOBS = [
  // Classic Crest Tee is deliberately NOT listed here — the original source photos provided for
  // it (src/assets/Classic Crest Tee*.jpeg) are real photos of unlicensed anime merchandise
  // (Jujutsu Kaisen / One Piece / Bleach), not AYUM designs. It stays on `comingSoon: true` in
  // src/data/products.ts until real, rights-cleared photography exists.
  // Heavyweight Pullover Hoodie — Back.jpeg is also excluded: it shows unlicensed Demon Slayer
  // merchandise, not an AYUM design. The product ships with only its front photo.
  // Note: the old "Oversized Graphic Tee*.jpeg" files (also unlicensed anime merch) are still on
  // disk and still excluded — the new 'oversized tee.jpeg' job below is a different, original
  // AYUM graphic that replaces them.
  { src: 'Heavyweight Pullover Hoodie — Front.jpeg', out: 'products/hoodies/heavyweight-pullover-hoodie-1.jpg' },
  { src: 'crewneck sweatshirt.png', out: 'products/sweatshirts/crewneck-sweatshirt-1.jpg' },
  { src: 'Structured Cap.jpeg', out: 'products/caps/structured-cap-1.jpg' },
  { src: 'Dad Cap.jpeg', out: 'products/caps/dad-cap-1.jpg' },
  { src: 'Ceramic Mug — Front.jpeg', out: 'products/mugs/ceramic-mug-1.jpg' },
  { src: 'Ceramic Mug — another angle Angle.jpeg', out: 'products/mugs/ceramic-mug-2.jpg' },
  { src: 'Matte Black Mug — Front.jpeg', out: 'products/mugs/matte-black-mug-1.jpg' },
  { src: 'Matte Black Mug — another angel.jpeg', out: 'products/mugs/matte-black-mug-2.jpg' },
  { src: 'tee.jpeg', out: 'products/tshirts/monochrome-logo-tee-1.jpg' },
  { src: 'crimision tee back.jpeg', out: 'products/tshirts/monochrome-logo-tee-2.jpg' },
  { src: 'oversized tee.jpeg', out: 'products/oversized/oversized-graphic-tee-1.jpg' },
];

async function processProductPhotos() {
  for (const job of PRODUCT_JOBS) {
    const srcPath = path.join(SRC, job.src);
    const outPath = path.join(PUB, job.out);
    mkdirSync(path.dirname(outPath), { recursive: true });

    await sharp(srcPath)
      .resize({ width: 1200, height: 1500, fit: 'cover', position: 'attention' })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(outPath);

    console.log(`${job.src} -> ${job.out}`);
  }
}

async function processPhotos() {
  for (const job of JOBS) {
    const srcPath = path.join(SRC, job.src);
    const outPath = path.join(PUB, job.out);
    mkdirSync(path.dirname(outPath), { recursive: true });

    await sharp(srcPath)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: job.quality, mozjpeg: true })
      .toFile(outPath);

    console.log(`${job.src} -> ${job.out}`);
  }
}

/** Logo + favicon need their own treatment: transparent PNG output, an icon crop, and multiple sizes. */
async function processBrandMark() {
  const out = (p) => {
    const full = path.join(PUB, 'brand', p);
    mkdirSync(path.dirname(full), { recursive: true });
    return full;
  };

  // Full lockup (mark + wordmark) — light backgrounds (navbar, mobile menu).
  await sharp(path.join(SRC, 'Logo.png'))
    .trim()
    .resize({ width: 1200, withoutEnlargement: true })
    .png({ quality: 90 })
    .toFile(out('logo-full.png'));

  // Icon-only crop — left portion, before the "|" divider — for pairing with a plain white
  // wordmark on dark backgrounds (footer). extract + trim are split into two sharp() calls;
  // chaining .extract().trim() directly hits a "bad extract area" error in this sharp version.
  const iconBuffer = await sharp(path.join(SRC, 'Logo.png'))
    .extract({ left: 60, top: 0, width: 630, height: 793 })
    .toBuffer();
  await sharp(iconBuffer)
    .trim()
    .resize({ height: 600, withoutEnlargement: true })
    .png({ quality: 90 })
    .toFile(out('mark.png'));

  // Favicon — already a square rounded obsidian icon, just needs resizing.
  for (const size of [32, 180, 512]) {
    await sharp(path.join(SRC, 'Favicon.png'))
      .resize(size, size)
      .png({ quality: 90 })
      .toFile(out(`favicon-${size}.png`));
  }

  console.log('Logo.png -> brand/logo-full.png, brand/mark.png');
  console.log('Favicon.png -> brand/favicon-{32,180,512}.png');
}

async function main() {
  await processPhotos();
  await processProductPhotos();
  await processBrandMark();
}

main();
