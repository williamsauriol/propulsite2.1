/**
 * generate-blog.mjs
 * Automated blog article generator for Propulsite
 * Runs weekly via GitHub Actions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set');
  process.exit(1);
}

// ─── Topics pool ─────────────────────────────────────────────────────────────
// New topics are added regularly. Already-published slugs are skipped.
const TOPIC_POOL = [
  {
    slug: 'facebook-ads-construction',
    topic: 'Facebook Ads et Instagram Ads pour entrepreneurs en construction au Québec',
    keyword: 'Facebook Ads construction Québec',
  },
  {
    slug: 'seo-local-entrepreneur-general',
    topic: 'SEO local pour entrepreneur général : comment dominer Google Maps dans ta ville',
    keyword: 'SEO local entrepreneur général',
  },
  {
    slug: 'site-web-entreprise-construction',
    topic: 'Pourquoi un bon site web est essentiel pour une entreprise de construction en 2025',
    keyword: 'site web entreprise construction',
  },
  {
    slug: 'avis-google-construction',
    topic: 'Comment obtenir plus d\'avis Google pour une compagnie de construction',
    keyword: 'avis Google entrepreneur construction',
  },
  {
    slug: 'reseaux-sociaux-construction',
    topic: 'Stratégie réseaux sociaux pour compagnies de construction : guide complet',
    keyword: 'réseaux sociaux compagnie construction',
  },
  {
    slug: 'leads-renovation-maison',
    topic: 'Comment générer des leads qualifiés pour la rénovation résidentielle au Québec',
    keyword: 'leads rénovation maison Québec',
  },
  {
    slug: 'branding-entrepreneur-construction',
    topic: 'Image de marque pour entrepreneur en construction : comment se démarquer',
    keyword: 'branding entrepreneur construction',
  },
  {
    slug: 'marketing-numerique-construction',
    topic: 'Marketing numérique pour l\'industrie de la construction : par où commencer',
    keyword: 'marketing numérique industrie construction',
  },
  {
    slug: 'photos-chantier-reseaux-sociaux',
    topic: 'Comment utiliser les photos de chantier pour attirer des clients sur les réseaux sociaux',
    keyword: 'photos chantier réseaux sociaux clients',
  },
  {
    slug: 'tarification-contrats-construction',
    topic: 'Comment arrêter de brader ses prix et vendre à sa juste valeur en construction',
    keyword: 'tarification entrepreneur construction',
  },
  {
    slug: 'google-maps-entrepreneur',
    topic: 'Comment optimiser votre fiche Google Maps pour attirer plus de clients locaux',
    keyword: 'Google Maps entrepreneur construction',
  },
  {
    slug: 'contenu-video-construction',
    topic: 'Vidéos de chantier : comment les créer et les utiliser pour générer des contrats',
    keyword: 'vidéo chantier marketing construction',
  },
];

// ─── Read existing slugs ──────────────────────────────────────────────────────
function getExistingSlugs() {
  const dataPath = path.join(ROOT, 'src/constants/painPointsData.tsx');
  const content = fs.readFileSync(dataPath, 'utf8');
  const matches = content.match(/slug:\s*'([^']+)'/g) || [];
  return matches.map((m) => m.replace(/slug:\s*'/, '').replace("'", '').trim());
}

// ─── Pick next unpublished topic ──────────────────────────────────────────────
function pickNextTopic(existingSlugs) {
  const available = TOPIC_POOL.filter((t) => !existingSlugs.includes(t.slug));
  if (available.length === 0) {
    console.log('✅ All topics already published!');
    process.exit(0);
  }
  return available[0];
}

// ─── Call OpenAI ──────────────────────────────────────────────────────────────
async function generateArticle(topic) {
  console.log(`🤖 Generating article for: ${topic.topic}`);

  const prompt = `Tu es un expert en marketing numérique spécialisé pour les entrepreneurs en construction au Québec. 
Tu travailles pour Propulsite, une agence marketing dédiée aux compagnies de construction.

Génère un article de blog SEO complet et persuasif sur le sujet suivant :
"${topic.topic}"

Mot-clé principal à cibler : "${topic.keyword}"

IMPORTANT : Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte avant ou après.

Format JSON exact à respecter :
{
  "slug": "${topic.slug}",
  "tag": "Stratégie Marketing",
  "titlePart1": "première partie du titre (peut être vide si le titre entier est dans titleHighlight)",
  "titleHighlight": "mots mis en évidence en bleu dans le titre",
  "titlePart3": "fin du titre si nécessaire (optionnel)",
  "intro": "phrase d'accroche en 1-2 phrases, percutante",
  "blocks": [
    {
      "title": "Titre de section H2",
      "paragraphs": ["paragraphe 1", "paragraphe 2"],
      "listItems": [
        {"bold": "Terme important :", "text": " explication concise"}
      ],
      "solutionBox": {
        "label": "Comment Propulsite règle ce problème",
        "text": "description de la solution Propulsite"
      }
    }
  ],
  "cta": {
    "title": "Titre CTA accrocheur en majuscules",
    "desc": "Description courte du CTA",
    "btnText": "Texte du bouton →",
    "btnLink": "/funnel"
  }
}

Règles :
- 4 blocks minimum
- Contenu en français québécois professionnel
- Mentionner concrètement Propulsite comme solution dans au moins 1 solutionBox
- Chiffres et statistiques réalistes (avec source plausible)
- Ton direct, sans jargon excessif
- Chaque block doit avoir soit paragraphs, soit listItems, ou les deux
- Le solutionBox est optionnel (1 à 2 maximum par article)
- NE PAS inclure de phrases comme "nos clients obtiennent X résultats" sans données réelles
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content.trim();

  try {
    return JSON.parse(rawContent);
  } catch {
    // Try to extract JSON if wrapped in backticks
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error(`Failed to parse OpenAI response as JSON: ${rawContent.slice(0, 200)}`);
  }
}

// ─── Append to painPointsData.tsx ────────────────────────────────────────────
function appendToPainPointsData(article) {
  const dataPath = path.join(ROOT, 'src/constants/painPointsData.tsx');
  let content = fs.readFileSync(dataPath, 'utf8');

  const articleJson = JSON.stringify(article, null, 2);
  // Convert JSON to TSX-compatible object literal
  const tsxEntry = `  ${articleJson
    .replace(/"([^"]+)":/g, '$1:')     // remove quotes from keys
    .replace(/: "([^"]*)"/g, ": '$1'") // double quotes → single quotes for strings
    .replace(/\\'/g, "'")              // fix escaped single quotes
  }`;

  // Insert before closing ];
  content = content.replace(/\];\s*$/, `,\n${tsxEntry}\n];\n`);
  fs.writeFileSync(dataPath, content, 'utf8');
  console.log(`✅ Appended article "${article.slug}" to painPointsData.tsx`);
}

// ─── Append card to Blog.tsx ─────────────────────────────────────────────────
function appendToBlog(article) {
  const blogPath = path.join(ROOT, 'src/pages/Blog.tsx');
  let content = fs.readFileSync(blogPath, 'utf8');

  // Get current number of pain points to determine next num
  const nums = content.match(/num: "(\d+)"/g) || [];
  const nextNum = String(nums.length + 1).padStart(2, '0');

  const title = `${article.titlePart1}${article.titleHighlight}${article.titlePart3 || ''}`;
  const desc = article.intro;

  const newCard = `        {
            num: "${nextNum}",
            icon: <Zap className="w-8 h-8 text-accent-blue" />,
            title: "${title.replace(/"/g, '\\"')}",
            desc: "${desc.replace(/"/g, '\\"')}",
            link: "/blog/${article.slug}"
        }`;

  // Insert before closing of painPoints array
  content = content.replace(
    /(\s*\]\s*;[\s\S]*?return\s*\()/,
    `,\n${newCard}\n    ];\n\n    return (`
  );

  fs.writeFileSync(blogPath, content, 'utf8');
  console.log(`✅ Added card for "${article.slug}" to Blog.tsx`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const existingSlugs = getExistingSlugs();
  console.log(`📋 Existing slugs: ${existingSlugs.join(', ')}`);

  const topic = pickNextTopic(existingSlugs);
  console.log(`🎯 Selected topic: ${topic.topic}`);

  const article = await generateArticle(topic);
  console.log(`📝 Article generated: "${article.titleHighlight}"`);

  appendToPainPointsData(article);
  appendToBlog(article);

  console.log('🚀 Done! Article ready to be committed and deployed.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
