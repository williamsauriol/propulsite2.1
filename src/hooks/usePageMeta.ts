import { useEffect } from 'react';

/**
 * Sets document <title> and <meta name="description"> dynamically per page.
 * Falls back cleanly if no description is provided.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Set or update meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    if (description) {
      metaDesc.setAttribute('content', description);
    }

    // Cleanup: restore default title when component unmounts
    return () => {
      document.title = 'Propulsite – Agence marketing pour la construction';
    };
  }, [title, description]);
}
