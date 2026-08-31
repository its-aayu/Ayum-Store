import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

const DEFAULT_OG_IMAGE = `${siteConfig.siteUrl}/assets/seo/og-image.jpg`;

type SeoHeadProps = {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

/** Sets document title + meta tags per page. No SSR in V1, so this runs client-side on mount. */
export function SeoHead({ title, description, image, noIndex }: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${siteConfig.brand.name}`;
    document.title = fullTitle;

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('property', 'og:image', image ?? DEFAULT_OG_IMAGE);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    setCanonical(`${siteConfig.siteUrl}${window.location.pathname}`);
  }, [title, description, image, noIndex]);

  return null;
}
