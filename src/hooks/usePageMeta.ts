import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://propulsite.ca';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets document <title>, <meta name="description">, canonical URL and
 * Open Graph / Twitter tags dynamically per page.
 */
export function usePageMeta(title: string, description?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;

    // Canonical : l'accueil garde le slash final, les pages internes non
    const url = pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname.replace(/\/$/, '')}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:title', title);
    setMetaTag('name', 'twitter:title', title);

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }
  }, [title, description, pathname]);
}
