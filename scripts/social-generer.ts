/**
 * social-generer.ts — Fabrique la publication Instagram de la semaine.
 *
 * POURQUOI CE SCRIPT VIT DANS LE DÉPÔT DU SITE
 *
 * L'API de publication d'Instagram n'accepte pas qu'on lui envoie une image :
 * elle exige une URL publique qu'elle va chercher elle-même. Il fallait donc
 * un hébergement. Le dépôt du site est PUBLIC et déjà déployé — une image
 * écrite dans `public/social/` est immédiatement lisible sur
 * raw.githubusercontent.com, sans attendre le déploiement, sans compte de
 * plus, sans un sou. C'est la seule raison pour laquelle le social vit ici
 * plutôt que dans le dépôt de l'agent.
 *
 * Deuxième gain, imprévu mais plus important : la matière première des posts
 * est lue DIRECTEMENT dans les données du site — services, articles, chiffres
 * GEO avec leurs sources. Les publications ne peuvent pas dériver de ce que le
 * site raconte, et corriger le site corrige les posts.
 *
 * COÛT
 *
 * Un appel Sonnet à effort « low » par semaine, environ 8 000 jetons en entrée
 * et 1 200 en sortie : de l'ordre de 0,05 $. Sur un mois, moins qu'un café.
 * Le rendu de l'image ne coûte rien (Chrome sans écran, sur GitHub Actions,
 * gratuit et illimité pour un dépôt public).
 *
 *   npx tsx scripts/social-generer.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICES } from '../src/constants/services';
import { PAIN_POINTS_ARTICLES } from '../src/constants/painPointsData';
import { CHIFFRES, SOURCES } from '../src/constants/geoData';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(__dirname, '..');
const DOSSIER = path.join(RACINE, 'public', 'social');
const JOURNAL = path.join(DOSSIER, 'journal.json');

const CLE = process.env.ANTHROPIC_API_KEY;

// Sonnet, effort bas : on demande un texte court et cadré, pas un raisonnement.
// Opus ici coûterait dix fois plus pour un résultat que personne ne saurait
// distinguer sur une publication de 200 mots.
const MODELE = 'claude-sonnet-4-6';

interface Publication {
  slug: string;
  angle: string;
  accroche: string;
  lignes: string[];
  legende: string;
  hashtags: string[];
}

interface EntreeJournal extends Publication {
  date: string;
  image: string;
  publie: boolean;
  publieLe?: string;
  urlInstagram?: string;
}

function lireJournal(): EntreeJournal[] {
  if (!fs.existsSync(JOURNAL)) return [];
  try {
    return JSON.parse(fs.readFileSync(JOURNAL, 'utf8'));
  } catch {
    return [];
  }
}

// ─── La matière première, tirée du site lui-même ────────────────────────────

function matierePremiere(): string {
  const services = SERVICES.slice(0, 6)
    .map((s) => `- ${s.title} : ${s.shortDesc}`)
    .join('\n');

  const articles = PAIN_POINTS_ARTICLES.map(
    (a) => `- « ${a.metaTitle || a.titleHighlight} » → propulsite.ca/blog/${a.slug}`,
  ).join('\n');

  // Les chiffres GEO portent leur source : c'est ce qui permet de publier une
  // statistique sans l'inventer.
  const chiffres = CHIFFRES.map((c) => {
    const src = SOURCES.find((s) => s.id === c.source);
    return `- ${c.prefixe || ''}${c.valeur}${c.suffixe} ${c.titre} (source : ${src ? src.label : c.source})`;
  }).join('\n');

  return [
    '## Services offerts', services,
    '', '## Articles publiés sur le site (vers quoi renvoyer)', articles,
    '', '## Chiffres vérifiés et sourcés (les SEULS utilisables)', chiffres,
  ].join('\n');
}

const REGLES = `Tu écris UNE publication Instagram pour Propulsite, une agence de marketing web
du Québec qui travaille uniquement avec des entrepreneurs en construction.

QUI LIT : un entrepreneur en construction québécois, 30-55 ans, sur son
téléphone, entre deux chantiers. Il n'a pas de temps et il déteste le jargon.

LA VOIX : tutoiement, phrases courtes, québécois naturel mais écrit
correctement. Le fondateur a porté les bottes avant de toucher à un clavier —
ça s'entend, sans qu'on ait besoin de le dire. Jamais « boostez », « leviers »,
« synergie », « game changer ». Zéro anglicisme de marketing.

INTERDITS ABSOLUS :
- Ne JAMAIS inventer une statistique. Tu n'utilises que les chiffres fournis
  plus haut, qui portent leur source.
- Ne JAMAIS prétendre avoir des clients, des résultats ou des témoignages.
  L'entreprise est jeune ; mentir se verrait.
- Ne JAMAIS promettre un résultat chiffré (« +300 % d'appels »).
- Pas d'emoji dans l'accroche ni dans les lignes du visuel. Au plus un seul
  dans la légende, et seulement s'il sert.

CE QUE TU PRODUIS :
- accroche : le titre sur l'image. MAXIMUM 52 caractères. Une phrase qui
  arrête le pouce. Une affirmation ou une question, jamais un slogan.
- lignes : 2 à 4 lignes courtes qui vont sur l'image sous l'accroche.
  Maximum 68 caractères chacune. C'est le corps de l'argument.
- legende : le texte sous la publication. 60 à 110 mots. La PREMIÈRE PHRASE
  doit contenir les mots que quelqu'un taperait dans Google — depuis 2026 les
  publications des comptes professionnels peuvent sortir dans les résultats,
  et Instagram coupe à 125 caractères. Termine par une invitation simple à
  écrire en privé ou à visiter propulsite.ca. Pas de « lien en bio ».
- hashtags : 12 à 15, en français, mélange de métier (#construction,
  #renovationquebec) et de région (#rivenord, #sainteustache, #laval).`;

const SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string', description: 'identifiant court en minuscules avec des tirets' },
    angle: { type: 'string', description: 'le sujet en 5 mots, pour ne pas le répéter plus tard' },
    accroche: { type: 'string', maxLength: 52 },
    lignes: { type: 'array', items: { type: 'string', maxLength: 68 }, minItems: 2, maxItems: 4 },
    legende: { type: 'string' },
    hashtags: { type: 'array', items: { type: 'string' }, minItems: 12, maxItems: 15 },
  },
  required: ['slug', 'angle', 'accroche', 'lignes', 'legende', 'hashtags'],
  additionalProperties: false,
};

async function demander(dejaFaits: string[]): Promise<Publication> {
  if (!CLE) throw new Error('ANTHROPIC_API_KEY absente.');
  const evite = dejaFaits.length
    ? `\n\nDÉJÀ PUBLIÉ — trouve autre chose :\n${dejaFaits.map((a) => `- ${a}`).join('\n')}`
    : '';

  const reponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': CLE as string,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODELE,
      max_tokens: 2000,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
      messages: [
        { role: 'user', content: `${matierePremiere()}\n\n---\n\n${REGLES}${evite}` },
      ],
    }),
  });

  if (!reponse.ok) {
    throw new Error(`API ${reponse.status} : ${(await reponse.text()).slice(0, 300)}`);
  }
  const data = await reponse.json();
  const texte = data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  return JSON.parse(texte);
}

// ─── Le visuel ──────────────────────────────────────────────────────────────

/**
 * 1080 × 1350, le format 4:5 — le plus haut qu'Instagram accepte dans le fil,
 * donc celui qui occupe le plus d'écran sur un téléphone.
 *
 * Le fil d'un entrepreneur est rempli de photos de chantier. Une image de
 * typographie sur fond sombre y détonne : c'est ce qui avait le mieux marché
 * dans les publications précédentes, et c'est reconduit ici.
 */
function gabarit(p: Publication): string {
  const lignes = p.lignes
    .map((l) => `<p class="ligne">${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`)
    .join('');
  const accroche = p.accroche.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1080px; height:1350px; background:#050a15; color:#fff;
    font-family:Archivo, system-ui, sans-serif; overflow:hidden; position:relative;
    display:flex; flex-direction:column; justify-content:space-between;
    padding:96px 84px;
  }
  .halo {
    position:absolute; top:-260px; left:50%; transform:translateX(-50%);
    width:1200px; height:700px; border-radius:50%;
    background:#00d2ff; opacity:.14; filter:blur(170px);
  }
  .filet { position:absolute; left:0; right:0; height:6px; background:#00d2ff; }
  .filet.haut { top:0; }
  header, main, footer { position:relative; }
  .etiquette {
    font-weight:600; font-size:24px; letter-spacing:.28em; text-transform:uppercase;
    color:#00d2ff;
  }
  .accroche {
    font-weight:900; font-size:92px; line-height:1.02; letter-spacing:-.03em;
    text-transform:uppercase; text-wrap:balance;
  }
  .barre { width:96px; height:8px; background:#00d2ff; border-radius:4px; margin:44px 0 40px; }
  .ligne {
    font-weight:600; font-size:38px; line-height:1.45; color:rgba(255,255,255,.72);
    margin-bottom:18px;
  }
  footer { display:flex; align-items:flex-end; justify-content:space-between; }
  .marque { font-weight:900; font-size:34px; letter-spacing:.12em; text-transform:uppercase; }
  .site { font-weight:600; font-size:26px; color:rgba(255,255,255,.42); margin-top:8px; }
  .metier {
    font-weight:600; font-size:22px; letter-spacing:.16em; text-transform:uppercase;
    color:#00d2ff; text-align:right; line-height:1.6;
  }
</style></head><body>
  <div class="halo"></div>
  <div class="filet haut"></div>
  <header><span class="etiquette">Propulsite · Marketing construction</span></header>
  <main>
    <h1 class="accroche">${accroche}</h1>
    <div class="barre"></div>
    ${lignes}
  </main>
  <footer>
    <div>
      <div class="marque">Propulsite</div>
      <div class="site">propulsite.ca</div>
    </div>
    <div class="metier">Entrepreneurs<br>en construction<br>du Québec</div>
  </footer>
</body></html>`;
}

async function rendre(p: Publication, destination: string): Promise<void> {
  // Puppeteer est installé par le workflow avec --no-save : le rendu de texte
  // par un vrai navigateur est fiable et charge les polices Google, alors que
  // rasteriser un SVG dépend des polices installées sur la machine — ce qui
  // sur un exécuteur GitHub donne une police de repli, ou rien.
  const { default: puppeteer } = await import('puppeteer');
  const navigateur = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await navigateur.newPage();
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
    await page.setContent(gabarit(p), { waitUntil: 'networkidle0' });
    // Laisser les polices Google finir de s'appliquer.
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: destination, type: 'png' });
  } finally {
    await navigateur.close();
  }
}

// ─── Programme ──────────────────────────────────────────────────────────────

const ESSAI: Publication = {
  slug: 'essai-gabarit',
  angle: 'essai du gabarit',
  accroche: 'Ton site est beau. Google ne le voit pas.',
  lignes: [
    'Un site parfait dans le code peut rester',
    'invisible : sitemap jamais soumis, pages',
    'jamais explorees. On verifie du cote de Google.',
  ],
  legende: 'Essai de gabarit — ce texte ne sera jamais publie.',
  hashtags: ['#construction', '#rivenord'],
};

async function main() {
  fs.mkdirSync(DOSSIER, { recursive: true });

  // node scripts/social-generer.ts --essai : rend le visuel a partir d'un
  // contenu fixe, sans appeler l'API. Pour verifier le gabarit gratuitement.
  if (process.argv.includes('--essai')) {
    const dest = path.join(DOSSIER, 'essai-gabarit.png');
    await rendre(ESSAI, dest);
    console.log(`Essai rendu : ${dest}`);
    return;
  }

  const journal = lireJournal();
  const jour = new Date().toISOString().slice(0, 10);
  if (journal.some((e) => e.date === jour)) {
    console.log(`Une publication existe déjà pour le ${jour} — rien à faire.`);
    return;
  }

  // On donne les douze derniers angles pour éviter de tourner en rond.
  const p = await demander(journal.slice(-12).map((e) => e.angle));
  console.log(`Angle : ${p.angle}`);
  console.log(`Accroche : ${p.accroche} (${p.accroche.length} car.)`);

  const nomImage = `${jour}-${p.slug}.png`;
  await rendre(p, path.join(DOSSIER, nomImage));

  journal.push({ ...p, date: jour, image: nomImage, publie: false });
  fs.writeFileSync(JOURNAL, JSON.stringify(journal, null, 2) + '\n', 'utf8');

  console.log(`✅ ${nomImage} écrit, en attente de publication.`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
