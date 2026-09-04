import { Link } from 'react-router-dom';
import { Upload, MessageCircle, Package, Sparkles, ShieldCheck } from 'lucide-react';
import { InstagramIcon } from '@/components/common/icons';
import { Container } from '@/components/common/Container';
import { Image } from '@/components/common/Image';
import { buttonClasses } from '@/components/common/Button';
import { SeoHead } from '@/components/common/SeoHead';
import { StructuredData } from '@/components/common/StructuredData';
import { ProductCard } from '@/components/product/ProductCard';
import { ComingSoonOverlay } from '@/components/product/ComingSoonOverlay';
import { TrustBadge } from '@/components/trust/TrustBadge';
import { FAQAccordion } from '@/components/trust/FAQAccordion';
import { getFeaturedProducts, getProductsByCategory } from '@/data/products';
import { categories } from '@/data/categories';
import { faqs } from '@/data/faq';
import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

export function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <SeoHead title="Premium Streetwear & Custom Design" description={siteConfig.brand.description} />
      <StructuredData
        id="organization-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteConfig.brand.name,
          url: siteConfig.siteUrl,
          description: siteConfig.brand.description,
        }}
      />

      {/* Hero */}
      <section className="relative isolate min-h-[560px] overflow-hidden bg-ink text-white sm:min-h-[640px] lg:min-h-[720px]">
        <div
          className="absolute inset-0 hidden bg-cover bg-top sm:block"
          style={{ backgroundImage: "url('/assets/hero/hero-desktop.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-cover bg-top sm:hidden"
          style={{ backgroundImage: "url('/assets/hero/hero-mobile.jpg')" }}
          aria-hidden="true"
        />
        {/* Legibility gradient — dark where the text sits, fading toward the subject */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/55 to-ink/10 sm:bg-gradient-to-r sm:from-ink/95 sm:via-ink/60 sm:to-transparent" />

        <Container className="relative flex min-h-[560px] flex-col items-start justify-center gap-6 py-20 text-left sm:min-h-[640px] sm:py-28 lg:min-h-[720px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">AYUM</p>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.05] sm:max-w-lg sm:text-6xl">
            Wear What You Imagine.
          </h1>
          <p className="max-w-sm text-sm text-white/70 sm:text-base">{siteConfig.brand.subTagline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link to="/shop" className={buttonClasses('primary', 'lg')}>
              Explore Designs
            </Link>
            <Link
              to="/custom"
              className="inline-flex h-13 items-center justify-center rounded-button border border-white/30 px-8 text-base font-medium text-white hover:border-white/60"
            >
              Create Your Own
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured designs */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">Featured Designs</h2>
                <p className="mt-1 text-sm text-muted">Limited edition — only 50 pieces of each design.</p>
              </div>
              <Link to="/shop" className="text-sm font-medium text-brand-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Shop categories */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const categoryProducts = getProductsByCategory(category.id);
              const representative = categoryProducts.find((p) => p.available) ?? categoryProducts[0];
              return (
                <Link key={category.id} to={`/shop/${category.slug}`} className="group block text-center">
                  {representative && (
                    <div className="relative overflow-hidden rounded-card">
                      <Image
                        src={representative.images[0]}
                        alt={category.label}
                        aspectRatio="1 / 1"
                        className={cn(
                          'transition-transform duration-[var(--duration-slow)]',
                          representative.comingSoon ? 'scale-110 blur-md' : 'group-hover:scale-[1.03]',
                        )}
                      />
                      {representative.comingSoon && <ComingSoonOverlay />}
                    </div>
                  )}
                  <p className="mt-2 text-sm font-medium text-ink">{category.label}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Custom design CTA */}
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 rounded-feature bg-brand-primary px-6 py-14 text-center text-white sm:py-20">
          <h2 className="max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            Have a design in mind? Bring it to life.
          </h2>
          <p className="max-w-md text-sm text-white/80">
            Upload your own artwork, preview it instantly, and show interest in AYUM apparel and products.
          </p>
          <Link to="/custom" className="inline-flex h-13 items-center justify-center rounded-button bg-white px-8 text-base font-medium text-brand-primary hover:bg-white/90">
            Create Your Own
          </Link>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <h2 className="mb-10 text-2xl font-semibold sm:text-3xl">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: Upload, title: 'Browse Designs', body: 'Pick from our limited-edition AYUM designs — only 50 pieces of each.' },
              { icon: MessageCircle, title: 'Show Interest on WhatsApp', body: "Tell us what you like — we'll confirm price, availability and delivery with you directly." },
              { icon: Package, title: 'Printed & Shipped', body: 'Once confirmed, your order is printed, quality-checked and shipped to you.' },
            ].map((step) => (
              <div key={step.title}>
                <step.icon className="h-6 w-6 text-brand-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why AYUM */}
      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="mb-10 text-2xl font-semibold sm:text-3xl">Why AYUM</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <TrustBadge icon={Sparkles} label="Original designs" description="Created in-house, not templated." />
            <TrustBadge icon={ShieldCheck} label="Manual quality review" description="Every order is checked before it prints." />
            <TrustBadge icon={MessageCircle} label="Real conversations" description="Talk to a person on WhatsApp, not a bot." />
          </div>
        </Container>
      </section>

      {/* Social media services */}
      <section className="bg-ink py-16 text-white sm:py-20">
        <Container className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Beyond apparel — creative services</h2>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Social media management, graphic design and content creation for brands and creators.
            </p>
          </div>
          <Link to="/services" className={buttonClasses('secondary', 'md', 'bg-white text-ink hover:bg-white/90')}>
            Explore Services
          </Link>
        </Container>
      </section>

      {/* FAQ preview */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Frequently Asked</h2>
          <FAQAccordion items={faqs.slice(0, 3)} />
          <Link to="/faq" className="mt-6 inline-block text-sm font-medium text-brand-primary hover:underline">
            View all FAQs
          </Link>
        </Container>
      </section>

      {/* Social/community */}
      {siteConfig.contact.instagramUrl && (
        <section className="bg-white py-14">
          <Container className="flex flex-col items-center gap-3 text-center">
            <InstagramIcon className="h-6 w-6 text-brand-primary" />
            <p className="text-sm text-muted">Join the AYUM community</p>
            <a
              href={siteConfig.contact.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-medium text-ink hover:underline"
            >
              Follow us on Instagram
            </a>
          </Container>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to wear what you imagine?</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop" className={buttonClasses('primary', 'lg')}>
              Explore Designs
            </Link>
            <Link to="/custom" className={buttonClasses('outline', 'lg')}>
              Create Your Own
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
