/**
 * prerender.ts — Génération SEO post-build
 *
 * Exécuté après `vite build` (voir le script "build" de package.json).
 * Pour chaque route du site, ce script copie dist/index.html et y injecte :
 *   - le <title> et la meta description propres à la page
 *   - le canonical et les balises Open Graph / Twitter avec la bonne URL
 *   - les données structurées (Service, FAQPage, BlogPosting, BreadcrumbList)
 *
 * Résultat : les moteurs de recherche et les robots sociaux (Facebook,
 * LinkedIn — qui n'exécutent pas le JavaScript) reçoivent les bonnes
 * métadonnées pour chaque URL, au lieu de toujours celles de l'accueil.
 *
 * Le script régénère aussi dist/sitemap.xml à partir des mêmes routes,
 * ce qui inclut automatiquement les articles ajoutés par le bot de blog.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { SERVICES } from '../src/constants/services';
import { PAIN_POINTS_ARTICLES } from '../src/constants/painPointsData';
import { AppContent } from '../src/App';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://propulsite.ca';
const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
// Date de dernière mise à jour des pages statiques (à ajuster lors de refontes majeures)
const PAGES_LASTMOD = '2026-06-11';
const DEFAULT_ARTICLE_DATE = '2026-03-10';

interface RouteMeta {
  path: string;
  title: string;
  description: string;
  jsonLd?: object[];
  priority: string;
  changefreq: string;
  lastmod: string;
}

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function breadcrumb(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Définition des routes ────────────────────────────────────────────────────

const routes: RouteMeta[] = [
  {
    path: '/',
    title: 'Agence marketing construction au Québec | Propulsite',
    description:
      'Propulsite aide les entrepreneurs en construction au Québec à dominer leur marché local grâce au marketing numérique : Google Ads, SEO local, conception web et réseaux sociaux.',
    priority: '1.0',
    changefreq: 'monthly',
    lastmod: PAGES_LASTMOD,
  },
  {
    path: '/services',
    title: 'Services marketing pour entrepreneurs en construction | Propulsite',
    description:
      'Découvrez tous les services de Propulsite : conception web, Google Ads, SEO local, réseaux sociaux et chatbot IA, spécialisés pour les entrepreneurs en construction au Québec.',
    jsonLd: [
      breadcrumb([
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Services', url: `${SITE_URL}/services` },
      ]),
    ],
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: PAGES_LASTMOD,
  },
  ...SERVICES.map((service) => ({
    path: `/services/${service.slug}`,
    title: `${service.title} pour entrepreneurs en construction | Propulsite`,
    description: `${service.shortDesc} Service ${service.title} spécialisé pour les entrepreneurs en construction au Québec.`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        serviceType: service.title,
        description: service.fullDesc.replace(/\*\*/g, ''),
        url: `${SITE_URL}/services/${service.slug}`,
        areaServed: { '@type': 'AdministrativeArea', name: 'Québec' },
        inLanguage: 'fr-CA',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Propulsite',
          url: SITE_URL,
          telephone: '+15146496862',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      breadcrumb([
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Services', url: `${SITE_URL}/services` },
        { name: service.title, url: `${SITE_URL}/services/${service.slug}` },
      ]),
    ],
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: PAGES_LASTMOD,
  })),
  {
    path: '/blog',
    title: 'Blog marketing pour compagnies de construction | Propulsite',
    description:
      'Conseils marketing numérique pour entrepreneurs en construction au Québec : SEO local, Google Ads, image de marque, réseaux sociaux et génération de leads.',
    jsonLd: [
      breadcrumb([
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Blog', url: `${SITE_URL}/blog` },
      ]),
    ],
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: PAGES_LASTMOD,
  },
  ...PAIN_POINTS_ARTICLES.map((article) => {
    const fullTitle = `${article.titlePart1}${article.titleHighlight}${article.titlePart3 || ''}`;
    const date = article.datePublished || DEFAULT_ARTICLE_DATE;
    return {
      path: `/blog/${article.slug}`,
      title: `${fullTitle} | Propulsite`,
      description: article.intro,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: fullTitle,
          description: article.intro,
          datePublished: date,
          dateModified: article.dateModified || date,
          inLanguage: 'fr-CA',
          image: OG_IMAGE,
          author: { '@type': 'Person', name: 'William Sauriol' },
          publisher: {
            '@type': 'Organization',
            name: 'Propulsite',
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/images/logo-fuser-sans-backk.png`,
            },
          },
          mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
        },
        breadcrumb([
          { name: 'Accueil', url: `${SITE_URL}/` },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: fullTitle, url: `${SITE_URL}/blog/${article.slug}` },
        ]),
      ],
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: date,
    };
  }),
  {
    path: '/a-propos',
    title: 'À Propos – Propulsite | Agence marketing construction Québec',
    description:
      'Découvrez l’histoire de Propulsite, agence fondée par William Sauriol, expert en marketing numérique pour les entrepreneurs en construction au Québec.',
    jsonLd: [
      breadcrumb([
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'À Propos', url: `${SITE_URL}/a-propos` },
      ]),
    ],
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: PAGES_LASTMOD,
  },
  {
    path: '/contact',
    title: 'Contactez-nous – Propulsite | Obtenir une soumission gratuite',
    description:
      'Contactez Propulsite pour obtenir une soumission gratuite. Nous aidons les entrepreneurs en construction à générer plus de leads grâce au marketing numérique.',
    jsonLd: [
      breadcrumb([
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Contact', url: `${SITE_URL}/contact` },
      ]),
    ],
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: PAGES_LASTMOD,
  },
  {
    path: '/legal',
    title: 'Politique de confidentialité – Propulsite',
    description:
      'Consultez la politique de confidentialité et les conditions d’utilisation de Propulsite, agence marketing pour les entrepreneurs en construction au Québec.',
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: PAGES_LASTMOD,
  },
];

// ─── Injection des métadonnées dans le HTML ───────────────────────────────────

// Rend le contenu React de la route en HTML statique (pour les robots/IA qui
// n'exécutent pas le JavaScript). En cas d'échec, on retourne '' : la page
// reste alors en rendu côté client, comme avant.
function renderAppHtml(routePath: string): string {
  try {
    return renderToString(
      createElement(StaticRouter, { location: routePath }, createElement(AppContent))
    );
  } catch (err) {
    console.warn(`⚠️  Pré-rendu du contenu échoué pour ${routePath} : ${(err as Error).message}`);
    return '';
  }
}

function renderPage(template: string, route: RouteMeta): string {
  const url = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
  const title = esc(route.title);
  const description = esc(route.description);

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      () => `<meta name="description" content="${description}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      () => `<link rel="canonical" href="${url}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      () => `<meta property="og:url" content="${url}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      () => `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      () => `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      () => `<meta name="twitter:title" content="${title}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      () => `<meta name="twitter:description" content="${description}" />`
    );

  if (route.jsonLd && route.jsonLd.length > 0) {
    const scripts = route.jsonLd
      .map(
        (schema) =>
          // « </ » échappé pour éviter de fermer le <script> prématurément
          `    <script type="application/ld+json">${JSON.stringify(schema).replace(/<\//g, '<\\/')}</script>`
      )
      .join('\n');
    html = html.replace('</head>', () => `${scripts}\n  </head>`);
  }

  // Injecte le contenu rendu dans la racine pour les robots/IA sans JavaScript.
  const appHtml = renderAppHtml(route.path);
  if (appHtml) {
    html = html.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);
  }

  return html;
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

function renderSitemap(): string {
  const entries = routes
    .map((route) => {
      const url = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
      return [
        '  <url>',
        `    <loc>${url}</loc>`,
        `    <lastmod>${route.lastmod}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const templatePath = path.join(DIST, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html introuvable — lancer `vite build` d’abord.');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');

  let count = 0;
  for (const route of routes) {
    const html = renderPage(template, route);
    const outDir = route.path === '/' ? DIST : path.join(DIST, ...route.path.split('/').filter(Boolean));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    count++;
  }

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), renderSitemap(), 'utf8');

  console.log(`✅ Pré-rendu SEO : ${count} pages générées + sitemap.xml (${routes.length} URLs)`);
}

main();
