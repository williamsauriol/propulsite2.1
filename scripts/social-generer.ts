/**
 * social-generer.ts — Fabrique le carrousel Instagram de la semaine.
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
 * Un appel Sonnet à effort « high » par semaine : de l'ordre de 0,15 $.
 * Les fonds sont gratuits quand ce sont de vraies photos — celles de William
 * ou celles de Pexels (voir social-photo.ts). Gemini ne prend le relais que si
 * aucune n'est disponible, et coûte alors 0,67 $ pour les cinq diapos.
 * Donc 0,15 $ la plupart des semaines, 0,82 $ au pire.
 *
 * L'effort « high » est la dépense la plus rentable des deux. Le point faible
 * d'une publication n'est jamais le pixel, c'est la phrase.
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
import { fabriquerFond } from './social-fond';
import { vraiesPhotos } from './social-photo';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(__dirname, '..');
const DOSSIER = path.join(RACINE, 'public', 'social');
const JOURNAL = path.join(DOSSIER, 'journal.json');

const CLE = process.env.ANTHROPIC_API_KEY;

// Sonnet, mais à effort « high » (voir l'appel plus bas). Opus coûterait dix
// fois plus pour un écart que personne ne saurait distinguer sur un carrousel
// de 200 mots ; monter l'effort de Sonnet, lui, se voit tout de suite.
const MODELE = 'claude-sonnet-4-6';

/**
 * Cinq diapos. Instagram en accepte dix, mais au-dela de cinq le taux de
 * defilement jusqu'a la fin s'effondre : mieux vaut cinq diapos lues que dix
 * abandonnees a la troisieme.
 */
const NB_DIAPOS = 5;

/**
 * Une diapo du carrousel. `lignes` est vide sur l'ouverture : la premiere
 * image ne porte qu'un titre, parce qu'un pouce qui defile ne lit pas un
 * paragraphe.
 */
interface Diapo {
  titre: string;
  lignes: string[];
  /**
   * Le texte alternatif de l'image, en francais.
   *
   * Instagram le lit aux lecteurs d'ecran et s'en sert pour comprendre de quoi
   * parle la publication. Sans lui, il en invente un, souvent faux.
   */
  alt: string;
}

interface Publication {
  slug: string;
  angle: string;
  diapos: Diapo[];
  /**
   * Le mot-cle anglais qui sert a chercher les vraies photos de fond.
   * Anglais parce que les banques d'images sont indexees en anglais.
   */
  photo: string;
  legende: string;
  hashtags: string[];
}

interface EntreeJournal extends Publication {
  date: string;
  /** Les images du carrousel, dans l'ordre de defilement. */
  images: string[];
  publie: boolean;
  /** La matiere peinte par Gemini, ou la raison pour laquelle il n'y en a pas. */
  fond?: string;
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

POURQUOI UN CARROUSEL DE 5 ET PAS UNE IMAGE

Instagram fait une chose qu'aucun autre format n'obtient : si quelqu'un ne
reagit pas a la premiere image, il lui remontre la publication en affichant la
DEUXIEME. Une publication, deux chances d'etre vue.

Consequence directe sur ton travail : chaque diapo doit tenir debout toute
seule. Si la diapo 2 n'a aucun sens sans la 1, la deuxieme chance est perdue.

LA STRUCTURE, DANS CET ORDRE :

- Diapo 1 — L'ARRET. Un titre, rien d'autre, et une liste "lignes" vide. C'est ce qui
  arrete le pouce. Une affirmation qui derange ou une question qui pique.
  MAXIMUM 46 caracteres.
- Diapo 2 — LE PROBLEME. Ce que l'entrepreneur vit sans le nommer.
- Diapo 3 — LA PREUVE. Un des chiffres fournis plus haut, avec ce qu'il veut
  dire pour lui. Jamais un chiffre invente.
- Diapo 4 — QUOI FAIRE. Concret, faisable, pas une liste de services.
- Diapo 5 — L'INVITATION. Ce qu'il gagne a repondre. Pas de « lien en bio ».

CE QUE TU PRODUIS :
- diapos : EXACTEMENT 5. Chacune a :
  - titre : MAXIMUM 46 caracteres. Court, frappant, lisible en une seconde.
  - lignes : de 1 a 3 lignes, MAXIMUM 62 caracteres chacune. VIDE sur la
    diapo 1 seulement.
  - alt : ce que montre LA DIAPO, en francais, une phrase.
    Decris le TEXTE et la mise en page, jamais la photo de fond : tu ne sais
    pas encore quelle photo sera choisie, et decrire une image imaginaire est
    pire que ne rien decrire. Exemple : « Diapo 3 sur 5 : le chiffre 68 % en
    gros titre blanc sur fond sombre texture, aux couleurs de Propulsite. »
- photo : le mot-cle ANGLAIS qui servira a chercher la photo de fond dans une
  banque d'images. Deux a quatre mots.
  UNE MATIERE OU UN LIEU VIDE, JAMAIS DES GENS AU TRAVAIL. « concrete wall
  texture », « empty construction site », « steel beams », « lumber stack »
  conviennent. « construction workers », « happy contractor », « team meeting »
  sont interdits : une photo de banque montrant une equipe laisserait croire
  que c'est celle de Propulsite, et un homme de metier verrait le mensonge.
- legende : le texte sous la publication. 60 a 110 mots. La PREMIERE PHRASE
  doit contenir les mots que quelqu'un taperait dans Google — depuis 2026 les
  publications des comptes professionnels peuvent sortir dans les resultats,
  et Instagram coupe a 125 caracteres. Termine par une invitation simple a
  ecrire en prive ou a visiter propulsite.ca.
- hashtags : 12 a 15, en francais, melange de metier (#construction,
  #renovationquebec) et de region (#rivenord, #sainteustache, #laval).`;

const SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string', description: 'identifiant court en minuscules avec des tirets' },
    angle: { type: 'string', description: 'le sujet en 5 mots, pour ne pas le répéter plus tard' },
    // AUCUNE contrainte de taille ici, et c'est volontaire.
    //
    // L'API d'Anthropic rejette le schema en entier, erreur 400, des qu'un
    // tableau porte un `minItems` autre que 0 ou 1. Le message ne nomme qu'une
    // contrainte a la fois : corriger celle qu'il pointe pour decouvrir la
    // suivante coute un aller-retour par contrainte. On les enleve donc toutes.
    //
    // Les limites vivent en francais dans les REGLES ci-dessus, ou le modele
    // les lit, et `verifier()` refuse le resultat qui ne les respecte pas.
    diapos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          titre: { type: 'string' },
          lignes: { type: 'array', items: { type: 'string' } },
          alt: { type: 'string' },
        },
        required: ['titre', 'lignes', 'alt'],
        additionalProperties: false,
      },
    },
    photo: { type: 'string', description: 'mot-cle anglais pour chercher la photo de fond' },
    legende: { type: 'string' },
    hashtags: { type: 'array', items: { type: 'string' } },
  },
  required: ['slug', 'angle', 'diapos', 'photo', 'legende', 'hashtags'],
  additionalProperties: false,
};

/**
 * Ce que le schema ne peut plus exiger, on le verifie ici.
 *
 * Le gabarit tombe a plat sans au moins deux lignes sous l'accroche, et une
 * publication a moins de douze mots-cles se prive de la moitie de sa portee.
 * Le modele respecte les REGLES presque toujours ; « presque » suffit a
 * publier un visuel casse un mercredi matin sans que personne regarde.
 */
function verifier(p: Publication): string | null {
  if (!p.diapos || p.diapos.length !== NB_DIAPOS) {
    return `${p.diapos?.length ?? 0} diapos, il en faut exactement ${NB_DIAPOS}`;
  }
  for (let i = 0; i < p.diapos.length; i++) {
    const d = p.diapos[i];
    const n = i + 1;
    if (!d.titre || d.titre.length > 46) {
      return `diapo ${n} : titre de ${d.titre?.length ?? 0} caracteres, maximum 46`;
    }
    // La premiere image doit rester nue. Un pouce qui defile ne lit pas un
    // paragraphe : c'est le titre seul qui l'arrete, ou rien.
    if (i === 0 && d.lignes.length > 0) {
      return `diapo 1 : elle doit n'avoir qu'un titre, ${d.lignes.length} ligne(s) en trop`;
    }
    if (i > 0 && (d.lignes.length < 1 || d.lignes.length > 3)) {
      return `diapo ${n} : ${d.lignes.length} ligne(s), il en faut 1 a 3`;
    }
    const trop = d.lignes.find((l) => l.length > 62);
    if (trop) return `diapo ${n} : ligne de ${trop.length} caracteres, maximum 62`;
    if (!d.alt || d.alt.length < 10) return `diapo ${n} : texte alternatif absent ou trop court`;
  }
  if (!p.hashtags || p.hashtags.length < 12) {
    return `${p.hashtags?.length ?? 0} hashtags, il en faut 12`;
  }
  return null;
}

async function demander(dejaFaits: string[]): Promise<Publication> {
  // Deux essais. Le modele derape rarement, et quand il derape c'est sur une
  // contrainte de comptage qu'un second tirage corrige — relancer coute cinq
  // cents, publier un visuel casse coute une semaine.
  for (let essai = 1; essai <= 2; essai++) {
    const p = await demanderUneFois(dejaFaits);
    const probleme = verifier(p);
    if (!probleme) return p;
    console.log(`  Essai ${essai} rejete : ${probleme}`);
    if (essai === 2) throw new Error(`Deux essais rejetes. Dernier : ${probleme}`);
  }
  throw new Error('inatteignable');
}

async function demanderUneFois(dejaFaits: string[]): Promise<Publication> {
  if (!CLE) throw new Error('ANTHROPIC_API_KEY absente.');

  // Le modele n'a aucune idee de la date. Sans cette ligne il a ecrit « en
  // 2025 » dans une publication de septembre 2026 -- le genre de detail qui
  // fait paraitre une entreprise endormie.
  const aujourdhui = new Date().toLocaleDateString('fr-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
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
      max_tokens: 4000,
      // Effort 'high', et c'est la depense la plus rentable du script. Le point
      // faible d'une publication n'est jamais le pixel, c'est la phrase. Passer
      // de 'low' a 'high' coute une dizaine de cents et change la seule chose
      // que le lecteur remarque.
      output_config: { effort: 'high', format: { type: 'json_schema', schema: SCHEMA } },
      messages: [
        {
          role: 'user',
          content:
            `Nous sommes le ${aujourdhui}. Toute année que tu écris doit être ` +
            `cohérente avec cette date.\n\n` +
            `${matierePremiere()}\n\n---\n\n${REGLES}${evite}`,
        },
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
 *
 * `fond` est une matière photographiée par Gemini (voir social-fond.ts), posée
 * sous un voile sombre. Le voile n'est pas décoratif : il garantit que le texte
 * blanc reste lisible quoi que le modèle ait rendu. Sans lui, une image un peu
 * trop claire rendrait l'accroche illisible et personne ne s'en apercevrait
 * avant que ce soit publié. Si `fond` est nul, l'aplat d'origine reprend sa
 * place et rien ne bouge.
 */
function gabarit(
  d: Diapo,
  index: number,
  total: number,
  fond: string | null = null,
): string {
  const echapper = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // Trois roles, trois mises en page. L'ouverture n'a qu'un titre, enorme. La
  // fin porte l'invitation. Entre les deux, le corps de l'argument.
  const ouverture = index === 0;
  const fin = index === total - 1;
  const role = ouverture ? 'ouverture' : fin ? 'fin' : 'corps';

  const lignes = d.lignes
    .map((l) => `<p class="ligne">${echapper(l)}</p>`)
    .join('');

  const compteur = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

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
  .fond { position:absolute; inset:0; background-size:cover; background-position:center; }
  /* Le voile fixe le contraste. Au plus clair (72 % d'opacite en haut), du
     blanc pur sur #050a15 garde un rapport bien au-dela du 4,5:1 exige, quelle
     que soit la matiere rendue en dessous. */
  .voile {
    position:absolute; inset:0;
    background:linear-gradient(180deg,
      rgba(5,10,21,.72) 0%, rgba(5,10,21,.84) 42%, rgba(5,10,21,.94) 100%);
  }
  .halo {
    position:absolute; top:-260px; left:50%; transform:translateX(-50%);
    width:1200px; height:700px; border-radius:50%;
    background:#00d2ff; opacity:.14; filter:blur(170px);
  }
  .filet { position:absolute; left:0; right:0; top:0; height:6px; background:#00d2ff; }
  header, main, footer { position:relative; }
  header { display:flex; align-items:baseline; justify-content:space-between; }
  .etiquette {
    font-weight:600; font-size:24px; letter-spacing:.28em; text-transform:uppercase;
    color:#00d2ff;
  }
  .compteur {
    font-weight:600; font-size:22px; letter-spacing:.2em;
    color:rgba(255,255,255,.34);
  }
  /* L'ouverture centre son titre : elle n'a que lui a montrer. */
  body.ouverture main { display:flex; flex-direction:column; justify-content:center; flex:1; }
  .titre {
    font-weight:900; line-height:1.0; letter-spacing:-.03em;
    text-transform:uppercase; text-wrap:balance;
  }
  body.ouverture .titre { font-size:112px; }
  body.corps .titre    { font-size:70px; }
  body.fin .titre      { font-size:80px; }
  .barre { width:96px; height:8px; background:#00d2ff; border-radius:4px; margin:44px 0 40px; }
  body.ouverture .barre { margin-bottom:0; }
  .ligne {
    font-weight:600; font-size:40px; line-height:1.4; color:rgba(255,255,255,.74);
    margin-bottom:22px;
  }
  footer { display:flex; align-items:flex-end; justify-content:space-between; }
  .marque { font-weight:900; font-size:34px; letter-spacing:.12em; text-transform:uppercase; }
  .site { font-weight:600; font-size:26px; color:rgba(255,255,255,.42); margin-top:8px; }
  .metier {
    font-weight:600; font-size:22px; letter-spacing:.16em; text-transform:uppercase;
    color:#00d2ff; text-align:right; line-height:1.6;
  }
  /* Le seul mouvement du carrousel : dire au pouce ou aller. */
  .glisse {
    font-weight:900; font-size:26px; letter-spacing:.24em; text-transform:uppercase;
    color:#00d2ff; display:flex; align-items:center; gap:14px;
  }
  .fleche { font-size:34px; line-height:1; }
</style></head><body class="${role}">
  ${fond ? `<div class="fond" style="background-image:url('${fond}')"></div><div class="voile"></div>` : ''}
  <div class="halo"></div>
  <div class="filet"></div>
  <header>
    <span class="etiquette">Propulsite · Marketing construction</span>
    <span class="compteur">${compteur}</span>
  </header>
  <main>
    <h1 class="titre">${echapper(d.titre)}</h1>
    <div class="barre"></div>
    ${lignes}
  </main>
  <footer>
    <div>
      <div class="marque">Propulsite</div>
      <div class="site">propulsite.ca</div>
    </div>
    ${
      ouverture
        ? '<div class="glisse">Glisse<span class="fleche">&rsaquo;</span></div>'
        : '<div class="metier">Entrepreneurs<br>en construction<br>du Québec</div>'
    }
  </footer>
</body></html>`;
}

/**
 * Rend les cinq images du carrousel. Un seul navigateur pour les cinq : le
 * lancer coute plus cher que les cinq captures reunies.
 */
async function rendre(
  p: Publication,
  fonds: (string | null)[],
  nomFichier: (index: number) => string,
): Promise<string[]> {
  // Puppeteer est installé par le workflow avec --no-save : le rendu de texte
  // par un vrai navigateur est fiable et charge les polices Google, alors que
  // rasteriser un SVG dépend des polices installées sur la machine — ce qui
  // sur un exécuteur GitHub donne une police de repli, ou rien.
  const { default: puppeteer } = await import('puppeteer');
  const navigateur = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const noms: string[] = [];
  try {
    const page = await navigateur.newPage();
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });

    for (let i = 0; i < p.diapos.length; i++) {
      const html = gabarit(p.diapos[i], i, p.diapos.length, fonds[i] ?? null);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      // Laisser les polices Google finir de s'appliquer.
      await page.evaluateHandle('document.fonts.ready');
      await new Promise((r) => setTimeout(r, 400));
      const nom = nomFichier(i);
      await page.screenshot({ path: path.join(DOSSIER, nom), type: 'png' });
      noms.push(nom);
    }
  } finally {
    await navigateur.close();
  }
  return noms;
}

// ─── Programme ──────────────────────────────────────────────────────────────

const ESSAI: Publication = {
  slug: 'essai-gabarit',
  angle: 'essai du gabarit',
  photo: 'concrete wall texture',
  diapos: [
    {
      titre: 'Ton site est beau. Google ne le voit pas.',
      lignes: [],
      alt: 'Mur de beton brut, texte blanc par dessus.',
    },
    {
      titre: 'Le probleme',
      lignes: [
        'Un site parfait dans le code peut rester invisible.',
        'Sitemap jamais soumis, pages jamais explorees.',
      ],
      alt: 'Mur de beton brut, texte expliquant le probleme.',
    },
    {
      titre: '9 pages sur 25',
      lignes: [
        "C'est ce que Google avait reellement indexe",
        "sur un site qu'on croyait complet.",
      ],
      alt: 'Mur de beton brut, le chiffre 9 pages sur 25.',
    },
    {
      titre: 'Quoi faire',
      lignes: [
        'Ouvrir Search Console. Soumettre le sitemap.',
        'Verifier page par page ce qui est indexe.',
      ],
      alt: 'Mur de beton brut, les etapes a suivre.',
    },
    {
      titre: 'On regarde ensemble ?',
      lignes: ['Ecris-nous en prive. Le diagnostic ne coute rien.'],
      alt: 'Mur de beton brut, invitation a ecrire en prive.',
    },
  ],
  legende: 'Essai de gabarit — ce texte ne sera jamais publie.',
  hashtags: ['#construction', '#rivenord'],
};

async function main() {
  fs.mkdirSync(DOSSIER, { recursive: true });

  // node scripts/social-generer.ts --essai : rend le carrousel a partir d'un
  // contenu fixe, sans appeler l'API. Pour verifier le gabarit gratuitement.
  //
  // Ajouter --fond y ajoute les matieres generees par Gemini. Ca coute environ
  // 0,67 $ US et ca n'appelle toujours pas Anthropic : c'est la façon de juger
  // le visuel sans depenser une publication.
  if (process.argv.includes('--essai')) {
    const avecFond = process.argv.includes('--fond');
    let fonds: (string | null)[] = new Array(NB_DIAPOS).fill(null);
    if (avecFond) {
      const reel = await vraiesPhotos(ESSAI.photo, NB_DIAPOS, 0);
      if (reel.photos) {
        fonds = reel.photos.map((ph) => ph.image);
      } else {
        console.log(`  ${reel.note}`);
        fonds = [];
        for (let i = 0; i < NB_DIAPOS; i++) {
          fonds.push((await fabriquerFond(ESSAI.angle, 0)).image);
        }
      }
    }
    const noms = await rendre(ESSAI, fonds, (i) => `essai-gabarit-${i + 1}.png`);
    console.log(`Essai rendu : ${noms.join(', ')}`);
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
  p.diapos.forEach((d, i) => console.log(`  ${i + 1}. ${d.titre}`));

  // Les vraies photos d'abord. Le fil d'un entrepreneur est fait de photos, et
  // l'oeil repere une image de synthese plus vite qu'on ne le croit. Gemini ne
  // sert que si aucune vraie photo n'est disponible — et il coute 0,67 $ de
  // plus.
  const fonds: (string | null)[] = [];
  const notes: string[] = [];

  const reel = await vraiesPhotos(p.photo, p.diapos.length, journal.length);
  if (reel.photos) {
    reel.photos.forEach((ph) => {
      fonds.push(ph.image);
      notes.push(ph.note);
    });
  } else {
    // La raison de l'echec entre au journal AVANT le repli. Sans elle, une
    // publication qui retombe sur Gemini n'a l'air de rien.
    notes.push(`vraies photos ecartees : ${reel.note}`);
    // Le rang fait tourner les matieres : la publication n de l'annee ne peut
    // pas retomber sur le beton de la publication n-1. Les cinq diapos
    // partagent le meme rang, donc la meme matiere — cinq rendus differents du
    // meme beton, pour que le carrousel se tienne comme une seule piece.
    for (let i = 0; i < p.diapos.length; i++) {
      const f = await fabriquerFond(p.angle, journal.length);
      fonds.push(f.image);
      notes.push(f.note);
    }
  }

  // Le dernier fond comble si une source en a rendu moins que cinq.
  while (fonds.length < p.diapos.length) {
    fonds.push(fonds[fonds.length - 1] ?? null);
  }

  const noms = await rendre(p, fonds, (i) => `${jour}-${p.slug}-${i + 1}.png`);

  journal.push({
    ...p,
    date: jour,
    images: noms,
    publie: false,
    // Une note par diapo serait illisible : on garde la premiere, et le compte
    // de celles qui ont vraiment recu une matiere.
    fond: `${fonds.filter(Boolean).length}/${noms.length} — ${notes[0]}`,
  });
  fs.writeFileSync(JOURNAL, JSON.stringify(journal, null, 2) + '\n', 'utf8');

  console.log(`✅ ${noms.length} images écrites, en attente de publication.`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
