import { Camera, PenTool, Film, Sparkles, Compass, Palette, MessageCircle } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Image } from '@/components/common/Image';
import { SeoHead } from '@/components/common/SeoHead';
import { Button } from '@/components/common/Button';
import { generateServiceInquiryUrl } from '@/services/whatsapp/generateWhatsAppOrderUrl';
import { track } from '@/services/analytics/track';

const services = [
  { icon: Camera, title: 'Social Media Management', body: 'Consistent, on-brand presence across your social channels.', image: '/assets/services/social-media.jpg' },
  { icon: PenTool, title: 'Graphic Design', body: 'Original visuals for campaigns, packaging and digital content.', image: '/assets/services/graphic-design.jpg' },
  { icon: Film, title: 'Video & Reels Editing', body: 'Short-form video edited for retention and reach.', image: '/assets/services/video-editing.jpg' },
  { icon: Sparkles, title: 'Content Creation', body: 'Photo and video content built around your brand.', image: '/assets/services/content.jpg' },
  { icon: Compass, title: 'Content Strategy', body: 'A plan for what to post, when, and why.', image: '/assets/services/strategy.jpg' },
  { icon: Palette, title: 'Branding', body: 'Visual identity that holds together across every touchpoint.', image: '/assets/services/branding.jpg' },
];

export function ServicesPage() {
  function handleInquiry(service?: string) {
    track({ name: 'service_inquiry_clicked', service });
    window.open(generateServiceInquiryUrl(service), '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <SeoHead
        title="Creative & Social Media Services"
        description="Social media management, graphic design, video editing and branding from AYUM's creative studio."
      />

      {/* Intro — banner photo behind the text */}
      <section className="relative isolate min-h-[480px] overflow-hidden bg-ink text-white sm:min-h-[560px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/services/services-banner.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/20 to-ink/75" />

        <Container className="relative flex min-h-[480px] flex-col items-center justify-center gap-5 py-20 text-center sm:min-h-[560px] sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Services</p>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Creative & Social Services
          </h1>
          <p className="max-w-lg text-sm text-white/80 sm:text-base">
            Beyond apparel — AYUM's studio helps brands and creators show up consistently.
          </p>
        </Container>
      </section>

      {/* Service grid */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <button
                key={service.title}
                type="button"
                onClick={() => handleInquiry(service.title)}
                className="group flex flex-col items-start overflow-hidden rounded-feature border border-border bg-white text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-modal"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  aspectRatio="4 / 3"
                  className="transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col items-start p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary/10">
                    <service.icon className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-ink">{service.title}</h2>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{service.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-primary group-hover:underline">
                    Discuss Your Project →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="pb-16 sm:pb-20">
        <Container className="flex flex-col items-center gap-6 rounded-feature bg-brand-primary px-6 py-14 text-center text-white sm:py-16">
          <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">
            Have something bigger in mind? Let's talk.
          </h2>
          <p className="max-w-md text-sm text-white/80">
            Tell us about your brand and what you're trying to build — we'll get back to you on WhatsApp.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-brand-primary hover:bg-white/90"
            onClick={() => handleInquiry()}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Discuss Your Project
          </Button>
        </Container>
      </section>
    </>
  );
}
