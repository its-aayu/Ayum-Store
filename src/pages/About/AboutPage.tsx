import { Link } from 'react-router-dom';
import { Palette, Layers, ShieldCheck, MessageCircle } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Image } from '@/components/common/Image';
import { SeoHead } from '@/components/common/SeoHead';
import { buttonClasses } from '@/components/common/Button';

const process = [
  { image: '/assets/about/quality-check.jpg', caption: 'Every order is checked before it prints' },
  { image: '/assets/packaging/ayum-packaging.jpg', caption: 'Packed with care' },
  { image: '/assets/packaging/ayum-package-open.jpg', caption: 'Wrapped, tagged, ready to open' },
  { image: '/assets/packaging/ayum-order-ready.jpg', caption: 'Boxed for the courier' },
  { image: '/assets/about/shipping.jpg', caption: 'On its way to you' },
];

const sections = [
  {
    icon: Palette,
    title: 'What AYUM is',
    body: 'AYUM is a premium print-on-demand and custom design studio. We design original apparel and products, and we help customers bring their own designs to life on the same pieces.',
  },
  {
    icon: Layers,
    title: 'Original + custom, side by side',
    body: 'Every product on AYUM can be worn as-is, or used as a canvas for your own artwork. Custom uploads go through the same care as our in-house designs.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality philosophy',
    body: 'We review every order — original or custom — before it goes to print, so what you receive matches what you approved.',
  },
  {
    icon: MessageCircle,
    title: 'Customer-first, always',
    body: "We confirm every order on WhatsApp before anything is charged or printed, so there are no surprises. If something isn't right, we're a message away.",
  },
];

export function AboutPage() {
  return (
    <>
      <SeoHead title="About AYUM" description="AYUM is a premium print-on-demand and custom design studio." />

      {/* Intro — studio photo behind the text */}
      <section className="relative isolate min-h-[480px] overflow-hidden bg-ink text-white sm:min-h-[560px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/about/about-ayum.jpg')" }}
          aria-hidden="true"
        />
        {/* The studio photo is busy edge-to-edge, so the whole frame gets tinted, not just a corner. */}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/20 to-ink/75" />

        <Container className="relative flex min-h-[480px] flex-col items-center justify-center gap-5 py-20 text-center sm:min-h-[560px] sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">About</p>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            A studio for original design and your own imagination.
          </h1>
          <p className="max-w-lg text-sm text-white/80 sm:text-base">
            AYUM makes premium print-on-demand apparel and products — some designed in-house, some brought to life
            from a customer's own artwork.
          </p>
        </Container>
      </section>

      {/* Principles */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-x-10 gap-y-10 sm:grid-cols-2">
            {sections.map((section) => (
              <div key={section.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                  <section.icon className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-ink">{section.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{section.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* From our hands to yours */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-semibold sm:text-3xl">From Our Hands to Yours</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            What happens between "order confirmed" and your doorbell ringing.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {process.map((step) => (
              <div key={step.caption}>
                <Image src={step.image} alt={step.caption} aspectRatio="4 / 5" className="rounded-card" />
                <p className="mt-2 text-xs text-muted">{step.caption}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="pb-16 sm:pb-20">
        <Container className="flex flex-col items-center gap-6 rounded-feature bg-brand-primary px-6 py-14 text-center text-white sm:py-16">
          <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">
            See it for yourself — browse the collection or start your own.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop" className={buttonClasses('secondary', 'md', 'bg-white text-brand-primary hover:bg-white/90')}>
              Explore Designs
            </Link>
            <Link
              to="/custom"
              className="inline-flex h-11 items-center justify-center rounded-button border border-white/40 px-6 text-sm font-medium text-white hover:border-white/70"
            >
              Create Your Own
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
