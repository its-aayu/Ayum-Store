import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/common/icons';
import { Container } from '@/components/common/Container';
import { Logo } from './Logo';
import { siteConfig } from '@/config/site';
import { generateGeneralContactUrl } from '@/services/whatsapp/generateWhatsAppOrderUrl';

const footerColumns = [
  {
    heading: 'AYUM',
    links: [
      { label: 'Shop', to: '/shop' },
      { label: 'Create Your Own', to: '/custom' },
      { label: 'Services', to: '/services' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
      { label: 'Refunds', to: '/refunds' },
      { label: 'Cancellation', to: '/cancellation' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ink text-white/90">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo variant="light" />
          <p className="mt-3 max-w-sm text-sm text-white/60">{siteConfig.brand.description}</p>
          <div className="mt-6 flex items-center gap-3">
            {siteConfig.contact.instagramUrl && (
              <a
                href={siteConfig.contact.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="AYUM on Instagram"
                className="rounded-full border border-white/15 p-2 hover:border-white/40"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            <a
              href={generateGeneralContactUrl()}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Chat with AYUM on WhatsApp"
              className="rounded-full border border-white/15 p-2 hover:border-white/40"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white/50">{column.heading}</h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <Container className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © AYUM {year}
          {siteConfig.contact.supportEmail ? ` · ${siteConfig.contact.supportEmail}` : ''}
        </span>
        <Link to="/custom-design-policy" className="hover:text-white">
          Custom Design & Copyright Policy
        </Link>
      </Container>
    </footer>
  );
}
