import { MessageCircle, Mail } from 'lucide-react';
import { InstagramIcon } from '@/components/common/icons';
import { Container } from '@/components/common/Container';
import { SeoHead } from '@/components/common/SeoHead';
import { buttonClasses } from '@/components/common/Button';
import { generateGeneralContactUrl } from '@/services/whatsapp/generateWhatsAppOrderUrl';
import { siteConfig } from '@/config/site';

export function ContactPage() {
  return (
    <>
      <SeoHead title="Contact AYUM" description="Get in touch with AYUM over WhatsApp or email." />
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Contact AYUM</h1>
          <p className="mt-3 text-sm text-muted">
            The fastest way to reach us is WhatsApp — that's also where we confirm every order.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={generateGeneralContactUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonClasses('primary', 'lg')}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
            {siteConfig.contact.supportEmail && (
              <a href={`mailto:${siteConfig.contact.supportEmail}`} className={buttonClasses('outline', 'lg')}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {siteConfig.contact.supportEmail}
              </a>
            )}
            {siteConfig.contact.instagramUrl && (
              <a
                href={siteConfig.contact.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={buttonClasses('ghost', 'lg')}
              >
                <InstagramIcon className="h-4 w-4" />
                Instagram
              </a>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
