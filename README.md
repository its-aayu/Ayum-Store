# AYUM Store

A premium Print-on-Demand (POD) + custom-design storefront for the AYUM brand. Customers browse original streetwear, or upload their own artwork and preview it on a product, then continue their order through WhatsApp — where AYUM confirms price, availability, and delivery before payment and fulfillment through Qikink.

This is a V1 build: **no accounts, no database, no online payment.** The "backend" is a static product catalog, a client-side cart, one small serverless function for signed Cloudinary uploads, and WhatsApp as the human order-confirmation channel. See [`../AYUM-IMPLEMENTATION.md`](../AYUM-IMPLEMENTATION.md) for the full specification this project implements, and its §89 for phase-by-phase build notes.

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Folder structure](#folder-structure)
- [Assets](#assets)
- [Routes](#routes)
- [Design system](#design-system)
- [How ordering actually works](#how-ordering-actually-works)
- [Testing](#testing)
- [Deployment (Vercel)](#deployment-vercel)
- [Known limitations (by design, for V1)](#known-limitations-by-design-for-v1)
- [Architecture notes for whoever builds V2](#architecture-notes-for-whoever-builds-v2)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 + TypeScript |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`, CSS `@theme` tokens — no `tailwind.config.js`) |
| Icons | lucide-react (+ two hand-rolled inline SVGs for Instagram, since lucide ships no brand logos) |
| Forms/validation | Native React state + a hand-rolled file-signature validator (no form library needed yet) |
| Image uploads | Cloudinary, via a signed-upload flow through a Vercel serverless function |
| Error monitoring | Sentry (`@sentry/react`) — installed and wired, but inert unless `VITE_SENTRY_DSN` is set |
| Unit/integration tests | Vitest + Testing Library |
| E2E tests | Playwright |
| Hosting target | Vercel (static build + one serverless function) |

## Getting started

Requires Node 20+.

```bash
npm install
cp .env.example .env.local   # fill in what you have — the app runs fine with every value empty
npm run dev
```

The dev server runs at `http://localhost:5173`. Without Cloudinary credentials configured, every page works except the actual custom-design upload network call — file selection, drag-and-drop, and all client-side validation states work regardless; only the final "send it to Cloudinary" step needs real credentials (see [Environment variables](#environment-variables)).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Generate `public/sitemap.xml`, typecheck, then build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |
| `npm run typecheck` | Run `tsc -b` (no emit) |
| `npm run test` | Run unit/integration tests (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E flows (auto-starts the dev server) |
| `npm run generate:sitemap` | Regenerate `public/sitemap.xml` from live product/category data |

Before shipping any change, run: `npm run lint && npm run typecheck && npm run test && npm run build` (and `npm run test:e2e` if you touched a user flow).

## Environment variables

See `.env.example` for the authoritative list — every variable there is actually read somewhere in the code; nothing is aspirational.

| Variable | Exposed to browser? | Used by | Notes |
| --- | --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` | Yes | `src/config/site.ts` | Digits only (country code + number, no `+` or spaces needed — it's stripped anyway) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Yes | `src/config/site.ts`, upload flow | Cloud names aren't secret |
| `VITE_SITE_URL` | Yes | SEO tags, sitemap generator | Canonical URL base, e.g. `https://ayum.com` |
| `VITE_ANALYTICS_ID` | Yes | `src/config/site.ts` | Not wired to a specific provider yet — see [Known limitations](#known-limitations-by-design-for-v1) |
| `VITE_INSTAGRAM_URL` | Yes | Footer, homepage | Omit and the Instagram links simply don't render (no invented links) |
| `VITE_SUPPORT_EMAIL` | Yes | Footer, Contact page | Omit and the email link simply doesn't render |
| `VITE_SENTRY_DSN` | Yes | `src/services/monitoring/sentry.ts` | DSNs aren't secret. Omit and Sentry never initializes |
| `CLOUDINARY_API_KEY` | **No** | `api/upload-signature.ts` | Server-only |
| `CLOUDINARY_API_SECRET` | **No** | `api/upload-signature.ts` | Server-only — signs uploads, never leaves the function |
| `SITE_ORIGIN` | **No** | `api/upload-signature.ts` | Your production origin, for the CORS allowlist |

**Rule of thumb:** anything prefixed `VITE_` ends up in the browser bundle — never put a real secret there. The two Cloudinary variables *without* the prefix are the only ones the upload-signing function reads server-side.

## Folder structure

```
ayum-store/
├── api/
│   └── upload-signature.ts       # Vercel serverless fn — signs Cloudinary uploads, secret never leaves here
├── public/
│   ├── robots.txt
│   ├── sitemap.xml               # generated by scripts/generate-sitemap.ts on every build
│   └── assets/                   # see "Assets" section below
├── scripts/
│   ├── generate-sitemap.ts       # reads live product/category data, writes public/sitemap.xml
│   ├── process-real-assets.mjs   # optimizes the real photos/logo/favicon from src/assets into public/assets
│   ├── render-brand-assets.mjs   # generates seo/og-image.jpg from code (the one asset with no "real" version)
│   ├── render-product-cards.mjs  # generates product-card art from live product data
│   └── render-custom-mockups.mjs # generates the garment mockup templates
├── src/
│   ├── assets/                   # raw, full-resolution originals behind public/assets/ (tracked in git —
│   │                              # see process-real-assets.mjs for how they're optimized)
│   ├── App.tsx                   # route table
│   ├── main.tsx                  # app entry: providers, error boundary, Sentry init
│   ├── index.css                 # Tailwind import + base layer (fonts, focus states)
│   ├── styles/tokens.css         # design tokens as CSS vars, mapped into Tailwind's @theme
│   │
│   ├── components/
│   │   ├── common/                # Button, Container, Image, Modal, Skeleton, SeoHead, StructuredData, ErrorBoundary
│   │   ├── layout/                # Navbar, MobileMenu, Footer, SiteLayout, Logo
│   │   ├── product/                # ProductCard, ImageGallery, VariantSelector, QuantitySelector
│   │   ├── cart/                   # WhatsAppFallbackModal
│   │   ├── custom-design/          # FileUploader, CopyrightConfirmation
│   │   ├── mockup/                 # MockupPreview (template-based design-on-product preview)
│   │   └── trust/                  # TrustBadge, FAQAccordion, ProductTrustInfo, SupportCTA
│   │
│   ├── pages/                     # one folder per route — Home, Shop, Product, CustomDesign, Cart,
│   │                               # About, Services, Contact, FAQ, Policies (7 policy pages), NotFound
│   │
│   ├── data/                      # static "database": products.ts, categories.ts, faq.ts, policies.ts
│   ├── services/
│   │   ├── whatsapp/              # generateWhatsAppOrderUrl.ts — the ONLY place that builds wa.me URLs
│   │   ├── cloudinary/            # upload.ts — client side of the signed-upload flow
│   │   ├── analytics/             # track.ts — single typed event dispatcher
│   │   └── monitoring/            # sentry.ts — no-op unless VITE_SENTRY_DSN is set
│   │
│   ├── context/CartContext.tsx    # cart state + localStorage persistence
│   ├── hooks/                     # useFileUpload, useWhatsAppOrder, usePageViewTracking
│   ├── utils/                     # cn, money, id, fileValidation, variantValidation
│   ├── types/                     # Product, CartItem, CustomDesign, OrderDraft
│   ├── config/site.ts             # all env-var reads happen here, nowhere else
│   └── vite-env.d.ts              # typed import.meta.env
│
├── tests/
│   ├── unit/                      # cart math, id generation, file validation, variant validation, WhatsApp URL, product data
│   ├── integration/                # cart localStorage persistence across remounts
│   └── e2e/                        # Playwright: main purchase flow, custom-design flow, invalid-file rejection
│
├── .env.example
├── vercel.json                    # security headers, CSP, SPA rewrites, asset caching
├── playwright.config.ts
└── vite.config.ts
```

## Assets

```
public/assets/
├── brand/        # logo-full.png, mark.png, favicon-{32,180,512}.png — real, from src/assets/Logo.png + Favicon.png
├── hero/         # hero-desktop.jpg, hero-mobile.jpg — real photography
├── about/        # about-ayum.jpg, quality-check.jpg, shipping.jpg — real photography
├── services/     # services-banner.jpg + one image per service card — real photography
├── packaging/    # 3 packaging/fulfillment shots — real photography
├── products/     # tshirts/ oversized/ hoodies/ sweatshirts/ caps/ mugs/ — code-generated card art (placeholder)
├── custom/       # tshirt-front.png, tshirt-back.png, hoodie-front.png (code-generated garment mockup
│                 # templates) + custom-design-banner.jpg (real photography)
├── seo/          # og-image.jpg — code-generated, composites the real logo mark
└── portfolio/    # empty — see note below
```

Two different pipelines feed this folder:

1. **Real photography/logo/favicon** — AI-generated externally, saved into `src/assets/` (tracked in git — full-resolution originals), then optimized into `public/assets/` by `scripts/process-real-assets.mjs` (resize, compress, and for the logo: crop the standalone mark from the full lockup). Re-run it any time you add or replace a file in `src/assets/`:

   ```bash
   node scripts/process-real-assets.mjs
   ```

2. **Code-generated placeholders** — `products/`, `custom/{tshirt,hoodie}-front.png`, and `seo/og-image.jpg` are composed from SVG/HTML using the site's real design tokens and rendered with Playwright, since product photography and garment mockup templates haven't been shot yet:

   ```bash
   node scripts/render-brand-assets.mjs     # seo/og-image.jpg only
   node scripts/render-product-cards.mjs    # one card image per product variant
   node scripts/render-custom-mockups.mjs   # garment mockup templates
   ```

**Important:** none of the scripts in pipeline 2 touch a file that pipeline 1 has since made real (hero, about, services, packaging, brand, or the custom-design banner) — each has an explicit comment marking that boundary. If you replace another placeholder with a real photo, add its filename to `JOBS` in `process-real-assets.mjs` and remove the matching job from whichever `render-*.mjs` script used to generate it, or a future re-run will silently overwrite the real file.

`portfolio/` is scaffolded but intentionally empty — it needs actual completed client work, which can't be generated. Nothing in the app currently reads from it.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/shop`, `/shop/:category` | Product grid, optionally filtered |
| `/product/:slug` | Product detail |
| `/custom` | Upload your own design → preview → order |
| `/cart` | Review cart → continue to WhatsApp |
| `/about`, `/services`, `/contact`, `/faq` | Trust/marketing pages |
| `/privacy`, `/terms`, `/shipping`, `/returns`, `/refunds`, `/cancellation`, `/custom-design-policy` | Policy pages (real content in `src/data/policies.ts`) |
| `*` | 404 |

`/cart` isn't in the original spec's route list but is needed for the order-review step before WhatsApp — added pragmatically.

## Design system

Tokens live in `src/styles/tokens.css` as CSS variables, then get mapped into Tailwind's `@theme` block so components use them as ordinary utility classes (`bg-brand-primary`, `text-muted`, `rounded-card`, `shadow-modal`, …) instead of hard-coded hex values. **Never hard-code a hex color or one-off font-family in a component** — add/adjust a token instead.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-brand-primary` (Crimson Depth) | `#710014` | Primary CTA, brand accent |
| `--color-brand-secondary` (Warm Sand) | `#B38F6F` | Secondary accent |
| `--color-surface` (Soft Pearl) | `#F2F1ED` | Main light background |
| `--color-ink` (Obsidian Black) | `#161616` | Main text, dark sections |

Typography: **Playfair Display** for headings/display (`font-display`), **Manrope** for everything else (UI default). Spacing, radius, shadow, and motion scales are all tokenized the same way — see the file for the full list.

## How ordering actually works

There is no payment gateway and no order database in V1. The flow is:

1. Customer picks a product (or uploads a custom design), selects variants, and either adds to cart or orders directly.
2. `src/services/whatsapp/generateWhatsAppOrderUrl.ts` builds a human-readable order message (product, variant, quantity, price, custom-design ID if any) behind one non-sensitive reference like `AY-REQ-8F29A` — no name/phone/address is ever embedded in it.
3. That opens a `wa.me` deep link. If the browser blocks the popup, `WhatsAppFallbackModal` shows the same message with a copy-to-clipboard button, plus a direct "Contact AYUM" link — the customer is never left stuck.
4. AYUM confirms availability, final price, and delivery **on WhatsApp**, then collects payment and forwards the order to Qikink for printing/shipping — all manually, by design, for V1.

The website intentionally never says "Order confirmed" — only "order request" — because no confirmed order exists until a human at AYUM says so.

## Testing

- **Unit** (`tests/unit/`): cart math, order/design ID generation, WhatsApp message building, file-upload validation (including magic-byte checks so a renamed `.exe` can't pass as a `.png`), variant-selection validation, product-data integrity.
- **Integration** (`tests/integration/`): cart survives a full provider unmount/remount via `localStorage`, and recovers gracefully from corrupted storage.
- **E2E** (`tests/e2e/`, Playwright): the full main purchase flow (home → shop → product → variant → cart → WhatsApp popup, asserting the message contents) and the full custom-design flow (upload → mocked Cloudinary round-trip → product/variant → copyright confirmation → WhatsApp), plus an invalid-file-type rejection test. Network calls to `/api/upload-signature` and Cloudinary are mocked with `page.route` so the suite runs fully offline and deterministically.

Run `npm run test` for unit/integration, `npm run test:e2e` for E2E (it starts its own dev server).

## Deployment (Vercel)

1. Push this repo to GitHub, import it into Vercel.
2. Set the environment variables from `.env.example` in the Vercel project settings (production + preview as needed).
3. `vercel.json` already configures: SPA rewrites (so client-side routes don't 404 on refresh), security headers (HSTS, CSP, X-Frame-Options, Permissions-Policy, X-Content-Type-Options), and long-lived caching for hashed `/assets/*` files.
4. `api/upload-signature.ts` deploys automatically as a serverless function — no extra config needed.
5. Point your domain at the Vercel project once DNS is ready.

Nothing here has been deployed by this session — it needs a real Cloudinary account, WhatsApp Business number, and domain, none of which an agent can create on your behalf.

## Known limitations (by design, for V1)

- No customer accounts, authentication, or online payment gateway.
- No production database — the catalog is `src/data/products.ts`; an "order" is a WhatsApp message.
- Product photography is code-generated card art (`public/assets/products/`), not real photos — see [Assets](#assets). Swap for real photography/Cloudinary URLs before launch.
- `services/`, `portfolio/`, `about/`, and `packaging/` under `public/assets/` are empty on purpose — they need real photography or completed work, not something that can be fabricated.
- Analytics events (`src/services/analytics/track.ts`) are real and wired into every user action, but only `console.info` in dev — no provider (GA4, Plausible, etc.) has been chosen yet.
- Upload rate limiting (`api/upload-signature.ts`) is a best-effort in-memory counter per serverless instance. It resets on cold start and doesn't coordinate across instances — a first deterrent, not a hard guarantee. Move to Vercel KV/Upstash if abuse becomes real.
- `npm audit` reports vulnerabilities only inside `@vercel/node`'s dev-only transitive tooling (used solely to type the serverless function locally, never shipped). `npm audit --omit=dev` is clean.

## Architecture notes for whoever builds V2

Service boundaries were kept deliberately clean so a real backend can slot in without a frontend rewrite:

- Swap `src/data/products.ts`'s exports for API calls — nothing else should need to change.
- The WhatsApp message builder, cart context, and upload service are all single-purpose modules with one job each; replace what's inside, keep the function signatures.
- The planned V2 shape (FastAPI + PostgreSQL + Razorpay + automated Qikink fulfillment) is documented in `AYUM-IMPLEMENTATION.md` §71–77 and §93 — read that before starting V2 work.
