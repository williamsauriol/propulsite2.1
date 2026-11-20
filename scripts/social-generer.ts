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
 * CE QUI A CHANGÉ LE 15 NOVEMBRE 2026, ET POURQUOI
 *
 * Les cinq premières publications se ressemblaient toutes : même gabarit
 * sombre, et quatre sujets sur cinq parlaient d'IA et de statistiques
 * américaines. Un entrepreneur ne se demande pas ce qu'est le « recoupement » ;
 * il se demande pourquoi son téléphone ne sonne pas. Quatre corrections :
 *
 *   1. TROIS FORMATS qui tournent (l'erreur courante, la liste à garder,
 *      l'avant-après), chacun avec son propre look. Le fil ne ressemble plus à
 *      une seule image répétée.
 *   2. LE SUJET PART DU CLIENT. Les statistiques deviennent facultatives.
 *   3. LA DERNIÈRE DIAPO se sauvegarde et s'envoie. Les envois sont le signal
 *      qui pèse le plus pour rejoindre des gens qui ne suivent pas le compte.
 *   4. TROIS BROUILLONS, UN JUGE. Le modèle écrit trois candidats sur trois
 *      sujets, un second appel les note sur une grille, le meilleur part.
 *
 * COÛT
 *
 * Deux appels à Sonnet 5.5 par semaine (2 $ / 10 $ le million de jetons) :
 * l'écriture des trois candidats, environ 7 cents, et le juge, environ 3 cents.
 * Donc autour de 10 cents par semaine, 45 cents par mois. Les fonds sont
 * gratuits quand ce sont de vraies photos — celles de William ou celles de
 * Pexels (voir social-photo.ts). Gemini ne prend le relais que si aucune n'est
 * disponible, et coûte alors 0,67 $ pour les cinq diapos.
 *
 *   npx tsx scripts/social-generer.ts
 *   npx tsx scripts/social-generer.ts --essai          (les 3 gabarits, sans API)
 *   npx tsx scripts/social-generer.ts --essai --fond   (avec de vraies photos)
 *   npx tsx scripts/social-generer.ts --essai --pire   (textes à la limite)
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

// Sonnet 5.5 : meilleur que le 4.6 d'avant, et moins cher (2 $ / 10 $ contre
// 3 $ / 15 $). Opus coûterait deux fois et demie plus pour un écart que
// personne ne verrait sur un carrousel de 200 mots.
const MODELE = 'claude-sonnet-5-5';

/**
 * Cinq diapos. Instagram en accepte dix, mais au-dela de cinq le taux de
 * defilement jusqu'a la fin s'effondre : mieux vaut cinq diapos lues que dix
 * abandonnees a la troisieme.
 */
const NB_DIAPOS = 5;
const NB_CANDIDATS = 3;

/**
 * Les trois formats, dans l'ordre ou ils tournent.
 *
 * C'est le CODE qui choisit le format de la semaine, pas le modele : laisse
 * libre, il retombe toujours sur celui qu'il prefere, et le fil redevient une
 * seule image repetee.
 */
type Format = 'erreur' | 'liste' | 'avant-apres';
const FORMATS: Format[] = ['erreur', 'liste', 'avant-apres'];

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

interface Mesures {
  quand: string;
  likes?: number;
  commentaires?: number;
  portee?: number;
  sauvegardes?: number;
  partages?: number;
  vues?: number;
}

interface EntreeJournal extends Publication {
  date: string;
  /** Absent sur les publications d'avant le 15 novembre 2026. */
  format?: Format;
  /** Les images du carrousel, dans l'ordre de defilement. */
  images: string[];
  publie: boolean;
  /** La matiere peinte par Gemini, ou la raison pour laquelle il n'y en a pas. */
  fond?: string;
  /** Pourquoi ce candidat a gagne, dans les mots du juge. */
  jugement?: string;
  publieLe?: string;
  urlInstagram?: string;
  /** Ecrit par social-mesurer.ts quand le jeton Meta le permet. */
  mesures?: Mesures;
}

function lireJournal(): EntreeJournal[] {
  if (!fs.existsSync(JOURNAL)) return [];
  try {
    return JSON.parse(fs.readFileSync(JOURNAL, 'utf8'));
  } catch {
    return [];
  }
}

/** Le format qui suit celui de la derniere publication. */
function formatSuivant(journal: EntreeJournal[]): Format {
  const dernier = [...journal].reverse().find((e) => e.format)?.format;
  // Les cinq premieres publications etaient toutes des « erreur » sans le
  // dire : on repart donc sur la liste, le format le plus sauvegarde.
  if (!dernier) return 'liste';
  return FORMATS[(FORMATS.indexOf(dernier) + 1) % FORMATS.length];
}

// ─── La matière première, tirée du site lui-même ────────────────────────────

/** Les seuls pourcentages qu'une publication a le droit d'afficher. */
const POURCENTAGES_PERMIS = new Set(
  CHIFFRES.filter((c) => String(c.suffixe || '').includes('%')).map((c) => String(c.valeur)),
);

function matierePremiere(): string {
  const services = SERVICES.slice(0, 6)
    .map((s) => `- ${s.title} : ${s.shortDesc}`)
    .join('\n');

  const articles = PAIN_POINTS_ARTICLES.map((a) => `- ${a.metaTitle || a.titleHighlight}`).join('\n');

  // Les chiffres portent leur source : c'est ce qui permet de publier une
  // statistique sans l'inventer.
  const chiffres = CHIFFRES.map((c) => {
    const src = SOURCES.find((s) => s.id === c.source);
    return `- ${c.prefixe || ''}${c.valeur}${c.suffixe} ${c.titre} (source : ${src ? src.label : c.source})`;
  }).join('\n');

  return [
    '## Ce que Propulsite fait', services,
    '', '## Sujets déjà traités sur le site (pour rester cohérent)', articles,
    '', '## Les SEULS chiffres permis. Tu peux très bien n’en utiliser aucun.', chiffres,
  ].join('\n');
}

/**
 * La consigne permanente. Elle ne change pas d'une semaine a l'autre : la voix,
 * le lecteur, les interdits. Le format de la semaine arrive a part.
 */
const REGLES = `Tu écris pour le compte Instagram de Propulsite, l'agence de marketing web de
William Sauriol. William a été charpentier-menuisier avant de faire du web. Il
travaille seulement avec des entrepreneurs en construction du Québec.

QUI LIT : un entrepreneur en construction québécois, 30 à 55 ans, sur son
téléphone, entre deux chantiers. Il n'a pas de temps et il déteste le jargon.
Il ne suit probablement pas encore le compte.

LA VOIX : tutoiement, phrases courtes, québécois naturel mais écrit
correctement. Quelqu'un du métier qui parle à quelqu'un du métier. Jamais
« boostez », « leviers », « synergie », « visibilité digitale ». Aucun
anglicisme de marketing. Un mot de chantier vaut mieux qu'un mot de bureau.

LE SUJET TOUCHE CE QUE PROPULSITE FAIT. TOUJOURS.
Le compte existe pour une raison : qu'un entrepreneur se dise « ce gars-là
connaît le web ET la construction ». Un bon conseil de gestion (rappeler
vite, organiser son horaire, négocier un prix) n'a rien à faire ici, même
s'il est vrai : n'importe quel coach pourrait le publier.
Chaque publication part d'UN de ces cinq piliers, et le conseil se fait
DANS l'outil en ligne, pas dans sa tête ou dans son agenda :
1. sa fiche Google et sa place sur Google Maps (photos, catégorie, heures,
   secteur desservi, description) ;
2. les avis Google (les demander, y répondre, le lien d'avis) ;
3. son site sur cellulaire et son formulaire de soumission (ce que le
   client voit avant d'appeler, ce qui le fait partir) ;
4. être nommé par ChatGPT et les réponses de Google (au plus une
   publication sur quatre) ;
5. ses photos de chantier en ligne (fiche, site, Instagram).
Le problème, lui, vient de SA journée : le téléphone qui sonne moins, la
demande qui ne rentre pas, le client qui choisit un autre. Mais la cause
nommée et le geste proposé sont TOUJOURS en ligne.
Mauvais : « Rappelle tes clients plus vite. » (gestion, pas web)
Bon : « Ton formulaire ne dit pas quand tu rappelles. Le client essaie
le suivant. » (le site, donc Propulsite)
Regarde la liste « déjà publié » : ne reprends ni un sujet ni un chiffre
qui y est déjà.

L'ACCROCHE (le titre de la diapo 1) décide de tout. Elle nomme un problème
qu'il vit, dans ses mots à lui. Pas une statistique. Pas le nom d'un outil.
Pas une vérité générale sur le marketing. Il doit se dire « ça, c'est moi ».
ELLE SE COMPREND TOUTE SEULE, SANS LA DIAPO 2 : elle dit la cause ET la
conséquence. « Le client a déjà appelé un autre » ne dit pas pourquoi : on
ne comprend rien. « Ta fiche dit fermé le samedi. Le client appelle un
autre. » se comprend en deux secondes.

CHAQUE CONSEIL EST VRAI ET FAISABLE CE SOIR
Un geste gratuit, précis, de moins de 15 minutes, fait sur sa fiche, son
site ou son compte. Si tu n'es pas certain qu'un bouton ou un réglage existe
dans l'outil, ne le nomme pas : décris le geste.

INTERDITS ABSOLUS :
- Ne JAMAIS inventer une statistique. Les seuls chiffres permis sont dans la
  liste fournie, et tu n'es pas obligé d'en utiliser un.
- Ne JAMAIS inventer une anecdote, un client, un chantier ou un témoignage.
  L'entreprise est jeune ; mentir se verrait.
- Ne JAMAIS promettre un résultat (« +300 % d'appels », « double tes contrats »).
- Aucun emoji sur les diapos. Au plus un seul dans la légende, s'il sert.
- Aucune adresse web et aucun lien, nulle part : un lien dans une légende
  Instagram n'est pas cliquable.

CHAQUE DIAPO TIENT DEBOUT TOUTE SEULE
Instagram remontre parfois la publication en affichant la DEUXIÈME diapo. Si
elle n'a aucun sens sans la première, cette deuxième chance est perdue.

LES LIMITES DE TAILLE (le gabarit casse si tu les dépasses) :
- titre : MAXIMUM 46 caractères, espaces comprises.
- chaque ligne : MAXIMUM 62 caractères.
- alt : une phrase qui décrit le TEXTE et la mise en page de la diapo, jamais
  la photo de fond (tu ne sais pas laquelle sera choisie).

AUTOUR DES DIAPOS :
- photo : le mot-clé ANGLAIS pour chercher la photo de fond dans une banque
  d'images. DEUX OU TROIS MOTS courants. Une MATIÈRE ou un LIEU VIDE, jamais
  des gens au travail : « concrete wall texture », « lumber stack », « empty
  construction site », « steel beams ». Une photo d'équipe laisserait croire
  que c'est celle de Propulsite.
- legende : 40 à 80 mots. La PREMIÈRE PHRASE contient les mots qu'un
  entrepreneur taperait dans une recherche, en moins de 125 caractères.
  Termine par UNE question simple à laquelle il peut répondre en commentaire.
- hashtags : EXACTEMENT 3. Un de métier, un de région, un de sujet. Les
  mots-clics n'augmentent plus la portée ; trois suffisent à classer le sujet.
- angle : le sujet en cinq mots, pour ne pas le refaire plus tard.
- slug : identifiant court, minuscules et tirets.`;

/** Ce que chaque format exige, diapo par diapo. */
const FICHES: Record<Format, { nom: string; etiquette: string; consigne: string }> = {
  erreur: {
    nom: 'l’erreur courante',
    etiquette: 'L’erreur courante',
    consigne: `FORMAT DE LA SEMAINE : « L'ERREUR COURANTE »
Une erreur que beaucoup d'entrepreneurs font sans le savoir, et son correctif.
- Diapo 1 — L'ARRÊT. Un titre, et "lignes" VIDE. L'erreur, dite comme il la vit.
- Diapo 2 — CE QUI SE PASSE. Titre + 1 à 3 lignes. La scène, concrète.
- Diapo 3 — CE QUE ÇA LUI COÛTE. Titre + 1 à 3 lignes. Un chiffre de la liste
  seulement s'il sert vraiment. Sinon, aucun chiffre.
- Diapo 4 — LE CORRECTIF. Titre + 1 à 3 lignes. Le geste gratuit, précis.
- Diapo 5 — À GARDER. Titre court + 2 ou 3 lignes : le correctif résumé en
  étapes. C'est la diapo qu'on sauvegarde. Aucune invitation à écrire ou à
  partager : le gabarit l'ajoute lui-même.`,
  },
  liste: {
    nom: 'la liste à garder',
    etiquette: 'La liste à garder',
    consigne: `FORMAT DE LA SEMAINE : « LA LISTE À GARDER »
Trois gestes gratuits qui règlent UN problème précis.
- Diapo 1 — L'ARRÊT. Un titre, et "lignes" VIDE. Le problème, puis la promesse
  de la liste (« 3 gestes pour… »).
- Diapos 2, 3 et 4 — UN GESTE CHACUNE. Le titre est le geste, à l'impératif
  (« Ajoute 5 photos de chantier »). Puis 1 ou 2 lignes : comment le faire, ou
  pourquoi ça compte. N'écris PAS le numéro : le gabarit l'affiche en gros.
- Diapo 5 — LA LISTE. Titre court + EXACTEMENT 3 lignes : les trois gestes en
  version courte, dans le même ordre. Le gabarit met une case à cocher devant
  chacune. Aucune invitation à écrire ou à partager : le gabarit l'ajoute.`,
  },
  'avant-apres': {
    nom: 'l’avant-après',
    etiquette: 'Avant · Après',
    consigne: `FORMAT DE LA SEMAINE : « L'AVANT-APRÈS »
Trois exemples d'une même chose : la version que presque tout le monde fait,
et la bonne version.
- Diapo 1 — L'ARRÊT. Un titre, et "lignes" VIDE.
- Diapos 2, 3 et 4 — UN AVANT-APRÈS CHACUNE. Le titre dit de quoi on parle
  (« Le titre de ta fiche Google »). Puis EXACTEMENT 2 lignes : la première est
  l'AVANT, la deuxième est l'APRÈS. N'écris PAS les mots « Avant » et
  « Après » : le gabarit les affiche lui-même.
  C'est l'avant-après d'une FORMULATION ou d'un GESTE, écrit tel quel, comme
  un exemple à recopier. JAMAIS l'avant-après d'un résultat (« 2 appels »
  puis « 20 appels » est interdit : ce serait une promesse).
- Diapo 5 — À GARDER. Titre court + 2 ou 3 lignes : la règle à retenir.
  Aucune invitation à écrire ou à partager : le gabarit l'ajoute lui-même.`,
  },
};

const SCHEMA_PUBLICATION = {
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

const SCHEMA_CANDIDATS = {
  type: 'object',
  properties: { candidats: { type: 'array', items: SCHEMA_PUBLICATION } },
  required: ['candidats'],
  additionalProperties: false,
};

const SCHEMA_JUGE = {
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          candidat: { type: 'integer', description: 'le numéro du candidat, à partir de 1' },
          accroche: { type: 'integer' },
          clarte: { type: 'integer' },
          utilite: { type: 'integer' },
          partage: { type: 'integer' },
          lien: { type: 'integer' },
          honnete: { type: 'boolean' },
          remarque: { type: 'string' },
        },
        required: ['candidat', 'accroche', 'clarte', 'utilite', 'partage', 'lien', 'honnete', 'remarque'],
        additionalProperties: false,
      },
    },
    choix: { type: 'integer', description: 'le numéro du candidat retenu, à partir de 1' },
    pourquoi: { type: 'string', description: 'une phrase' },
  },
  required: ['notes', 'choix', 'pourquoi'],
  additionalProperties: false,
};

/**
 * Ce que le schema ne peut pas exiger, on le verifie ici.
 *
 * Le modele respecte les REGLES presque toujours ; « presque » suffit a
 * publier un visuel casse un mercredi matin sans que personne regarde.
 * Rend la raison du refus, ou null quand tout est bon.
 */
function verifier(p: Publication, format: Format): string | null {
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
    const milieu = i >= 1 && i <= 3;
    if (format === 'liste' && milieu && d.lignes.length > 2) {
      return `diapo ${n} : ${d.lignes.length} lignes sous un geste, maximum 2`;
    }
    if (format === 'liste' && i === 4 && d.lignes.length !== 3) {
      return `diapo 5 : la liste a ${d.lignes.length} ligne(s), il en faut exactement 3`;
    }
    if (format === 'avant-apres' && milieu && d.lignes.length !== 2) {
      return `diapo ${n} : ${d.lignes.length} ligne(s), il faut exactement l'avant et l'apres`;
    }
    const trop = d.lignes.find((l) => l.length > 62);
    if (trop) return `diapo ${n} : ligne de ${trop.length} caracteres, maximum 62`;
    if (!d.alt || d.alt.length < 10) return `diapo ${n} : texte alternatif absent ou trop court`;
  }

  // Un pourcentage affiche doit venir de la liste sourcee. C'est le seul
  // garde-fou qu'on peut tenir en code contre une statistique inventee ; le
  // juge couvre le reste.
  const tout = [p.legende, ...p.diapos.flatMap((d) => [d.titre, ...d.lignes])].join(' ');
  for (const m of tout.matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)) {
    if (!POURCENTAGES_PERMIS.has(m[1].replace(',', '.')) && !POURCENTAGES_PERMIS.has(m[1])) {
      return `« ${m[0]} » n'est pas dans la liste des chiffres permis`;
    }
  }

  if (/https?:\/\/|www\.|\.ca\/|\.com\//i.test(p.legende)) {
    return 'la legende contient un lien, et il ne serait pas cliquable';
  }
  const mots = p.legende.trim().split(/\s+/).length;
  if (mots < 25 || mots > 110) return `legende de ${mots} mots, on vise 40 a 80`;
  if (!p.hashtags || p.hashtags.length < 1) return 'aucun hashtag';
  return null;
}

/**
 * Un appel a Claude qui rend du JSON conforme a un schema.
 *
 * Trois sorties qui ne sont PAS des erreurs HTTP et qu'il faut lire quand
 * meme : le refus (reponse 200, stop_reason « refusal »), la reponse coupee
 * faute de place, et le compte a sec — celui-la a arrete ce robot six semaines
 * sans que personne le voie, alors son message est ecrit en clair.
 */
async function appelClaude(corps: {
  system: string;
  message: string;
  schema: object;
  effort: 'low' | 'medium' | 'high';
  max_tokens: number;
}): Promise<any> {
  if (!CLE) throw new Error('ANTHROPIC_API_KEY absente.');

  const reponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': CLE as string,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODELE,
      // La reflexion compte dans cette limite. Il faut de la place pour les deux.
      max_tokens: corps.max_tokens,
      thinking: { type: 'adaptive' },
      output_config: { effort: corps.effort, format: { type: 'json_schema', schema: corps.schema } },
      system: corps.system,
      messages: [{ role: 'user', content: corps.message }],
    }),
  });

  if (!reponse.ok) {
    const texte = await reponse.text();
    if (/credit balance/i.test(texte)) {
      throw new Error(
        'PLUS DE CRÉDITS ANTHROPIC. Rien ne sera publié tant que le compte est à zéro : ' +
        'console.anthropic.com → Plans & Billing.',
      );
    }
    throw new Error(`API ${reponse.status} : ${texte.slice(0, 300)}`);
  }
  const data = await reponse.json();
  if (data.stop_reason === 'refusal') throw new Error('Le modèle a refusé de répondre.');
  if (data.stop_reason === 'max_tokens') throw new Error('Réponse coupée : max_tokens trop bas.');
  const texte = data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  return JSON.parse(texte);
}

/** Les publications qui ont ete le plus envoyees et sauvegardees, s'il y en a. */
function meilleures(journal: EntreeJournal[]): string {
  const mesurees = journal
    .filter((e) => e.mesures && (e.mesures.partages != null || e.mesures.sauvegardes != null))
    .map((e) => ({ e, score: (e.mesures!.partages || 0) * 2 + (e.mesures!.sauvegardes || 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  if (!mesurees.length) return '';
  return (
    '\n\nCE QUI A LE MIEUX MARCHÉ JUSQU’ICI (envois et sauvegardes) — pas à copier, à comprendre :\n' +
    mesurees
      .map((x) => `- « ${x.e.diapos[0].titre} » (${x.e.mesures!.partages || 0} envois, ${x.e.mesures!.sauvegardes || 0} sauvegardes)`)
      .join('\n')
  );
}

/** Trois candidats, trois sujets, un seul format. */
async function ecrireCandidats(format: Format, journal: EntreeJournal[]): Promise<Publication[]> {
  // Le modele n'a aucune idee de la date. Sans cette ligne il a ecrit « en
  // 2025 » dans une publication de septembre 2026 -- le genre de detail qui
  // fait paraitre une entreprise endormie.
  const aujourdhui = new Date().toLocaleDateString('fr-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const dejaFaits = journal.slice(-12).map((e) => `- ${e.angle} — « ${e.diapos[0].titre} »`);
  const evite = dejaFaits.length
    ? `\n\nDÉJÀ PUBLIÉ — choisis d'autres sujets :\n${dejaFaits.join('\n')}`
    : '';

  const data = await appelClaude({
    system: REGLES,
    message:
      `Nous sommes le ${aujourdhui}. Toute année ou saison que tu écris doit être ` +
      `cohérente avec cette date.\n\n${matierePremiere()}\n\n---\n\n${FICHES[format].consigne}\n\n` +
      `Écris ${NB_CANDIDATS} CANDIDATS complets, dans ce format, sur ${NB_CANDIDATS} SUJETS ` +
      `DIFFÉRENTS. Un seul sera publié : donne à chacun une vraie chance. ` +
      `Chaque candidat a exactement ${NB_DIAPOS} diapos.${evite}${meilleures(journal)}`,
    schema: SCHEMA_CANDIDATS,
    // Effort « high » : la depense la plus rentable du script. Le point faible
    // d'une publication n'est jamais le pixel, c'est la phrase.
    effort: 'high',
    max_tokens: 20000,
  });
  return data.candidats || [];
}

/**
 * Le juge. Un second appel, qui n'a pas ecrit les candidats.
 *
 * Demander au meme appel d'ecrire puis de choisir ne marche pas : il prefere
 * toujours son premier jet. Ici le juge prend le role du lecteur, avec une
 * grille, et il peut dire qu'un candidat n'est pas honnete.
 *
 * Si le juge tombe en panne, on prend le premier candidat valide : une
 * publication correcte vaut mieux qu'une semaine sans rien.
 */
async function juger(candidats: Publication[], format: Format): Promise<{ gagnant: Publication; jugement: string }> {
  if (candidats.length === 1) return { gagnant: candidats[0], jugement: 'un seul candidat valide' };

  const fiches = candidats
    .map((c, i) => {
      const diapos = c.diapos
        .map((d, j) => `  Diapo ${j + 1} : ${d.titre}${d.lignes.length ? ' | ' + d.lignes.join(' | ') : ''}`)
        .join('\n');
      return `CANDIDAT ${i + 1}\n${diapos}\n  Légende : ${c.legende}`;
    })
    .join('\n\n');

  try {
    const j = await appelClaude({
      system:
        'Tu es un entrepreneur en construction du Québec : 45 ans, un cellulaire dans la main, ' +
        'dix minutes de pause. Tu ne connais rien au marketing et tu te méfies de ceux qui en vendent. ' +
        'On te montre des publications Instagram. Tu dis laquelle t’arrêterait pour vrai.',
      message:
        `Voici ${candidats.length} publications candidates, au format « ${FICHES[format].nom} ».\n\n${fiches}\n\n` +
        `Note chacune de 1 à 5 :\n` +
        `- accroche : en lisant SEULEMENT le titre de la diapo 1, est-ce que je comprends de quoi on parle, ` +
        `je me reconnais et j'arrête de défiler ? Un titre qu'on ne comprend pas sans la diapo 2 vaut 1.\n` +
        `- lien : la publication vient d'une agence web. Est-ce que le problème et le conseil touchent ma fiche ` +
        `Google, mes avis, mon site, mes photos en ligne ou ce que ChatGPT dit de moi ? 1 = un conseil de gestion ` +
        `sans rapport avec le web, 5 = ça me fait penser « eux autres pourraient m'aider avec ça ».\n` +
        `- clarte : est-ce que je comprends chaque diapo en trois secondes, sans un seul mot de bureau ?\n` +
        `- utilite : est-ce que je peux faire quelque chose ce soir, gratuitement, avec ce qui est écrit ?\n` +
        `- partage : est-ce que je l'enverrais à un autre entrepreneur que je connais ?\n` +
        `- honnete : false s'il y a une promesse de résultat, un chiffre douteux, une anecdote ou un client ` +
        `inventé, ou un conseil qui a l'air faux. Un candidat pas honnête ne peut pas gagner.\n\n` +
        `Chiffres permis (tout autre pourcentage est inventé) :\n` +
        CHIFFRES.map((c) => `- ${c.prefixe || ''}${c.valeur}${c.suffixe} ${c.titre}`).join('\n') +
        `\n\nPuis donne ton choix et pourquoi, en une phrase.`,
      schema: SCHEMA_JUGE,
      effort: 'medium',
      max_tokens: 8000,
    });

    const total = (n: any) => n.accroche * 2 + n.clarte + n.utilite + n.partage + n.lien;
    const notes = (j.notes || []).filter((n: any) => candidats[n.candidat - 1]);
    notes.forEach((n: any) =>
      console.log(`  Candidat ${n.candidat} : accroche ${n.accroche}, clarté ${n.clarte}, utilité ${n.utilite}, ` +
        `partage ${n.partage}, lien ${n.lien}${n.honnete ? '' : ' — PAS HONNÊTE'} — ${n.remarque}`));

    // Le 18 novembre 2026, le gagnant parlait de rappeler vite : vrai, utile,
    // et sans aucun rapport avec Propulsite. Un candidat sans lien avec le web
    // (moins de 3) ne gagne que si aucun autre n'en a.
    const honnetesTous = notes.filter((n: any) => n.honnete);
    if (!honnetesTous.length) throw new Error('le juge ne trouve aucun candidat honnête');
    const relies = honnetesTous.filter((n: any) => n.lien >= 3);
    const honnetes = relies.length ? relies : honnetesTous;
    // Le choix du juge, s'il est honnete. Sinon la meilleure note : l'accroche
    // compte double, parce que personne ne lit la diapo 2 d'une publication
    // dont la diapo 1 ne l'a pas arrete.
    const choisi = honnetes.find((n: any) => n.candidat === j.choix)
      || [...honnetes].sort((a: any, b: any) => total(b) - total(a))[0];
    return {
      gagnant: candidats[choisi.candidat - 1],
      jugement: `candidat ${choisi.candidat} sur ${candidats.length} (${total(choisi)}/30) — ${j.pourquoi}`,
    };
  } catch (e: any) {
    // Aucun candidat honnete : on ne publie pas. Tout le reste est une panne
    // du juge, et la semaine ne doit pas tomber pour ca.
    if (/aucun candidat honnête|CRÉDITS/.test(e.message)) throw e;
    console.log(`  Juge indisponible (${e.message}) — on prend le premier candidat valide.`);
    return { gagnant: candidats[0], jugement: `juge indisponible : ${String(e.message).slice(0, 80)}` };
  }
}

async function demander(format: Format, journal: EntreeJournal[]): Promise<{ p: Publication; jugement: string }> {
  // Deux essais. Sur trois candidats il en reste presque toujours un de valide ;
  // quand aucun ne passe, un second tirage coute sept cents, et publier un
  // visuel casse coute une semaine.
  for (let essai = 1; essai <= 2; essai++) {
    const candidats = await ecrireCandidats(format, journal);
    const valides = candidats.filter((c, i) => {
      // Trois mots-clics, pas un de plus : on coupe au lieu de refuser.
      c.hashtags = (c.hashtags || []).slice(0, 3);
      const probleme = verifier(c, format);
      if (probleme) console.log(`  Candidat ${i + 1} écarté : ${probleme}`);
      return !probleme;
    });
    if (valides.length) {
      console.log(`  ${valides.length} candidat(s) valide(s) sur ${candidats.length}.`);
      const { gagnant, jugement } = await juger(valides, format);
      return { p: gagnant, jugement };
    }
    console.log(`  Essai ${essai} : aucun candidat valide.`);
  }
  throw new Error('Deux essais sans un seul candidat valide.');
}

// ─── Le visuel ──────────────────────────────────────────────────────────────

/**
 * 1080 × 1350, le format 4:5 — le plus haut qu'Instagram accepte dans le fil,
 * donc celui qui occupe le plus d'écran sur un téléphone.
 *
 * TROIS LOOKS, UN PAR FORMAT. Meme police, memes couleurs de marque (le marine
 * #050a15, le cyan #00d2ff), mais trois images qu'on distingue d'un coup d'oeil
 * dans la grille du profil :
 *
 *   erreur       sombre, la photo sous un voile. Le look d'origine.
 *   liste        clair, papier. La photo en bandeau sur la diapo 1, puis de
 *                gros numeros sur fond clair.
 *   avant-apres  la diapo 1 en aplat cyan, puis deux blocs empiles : l'avant
 *                eteint, l'apres en cyan.
 *
 * Le cyan ne porte jamais de texte blanc (contraste trop faible) : sur du cyan,
 * le texte est marine. Sur du marine ou sous le voile, il est blanc.
 *
 * `fond` est une photo ou une matiere, posee sous un voile sombre. Le voile
 * n'est pas decoratif : il garantit que le texte blanc reste lisible quoi que
 * la photo montre. Si `fond` est nul, l'aplat reprend sa place.
 */
function gabarit(
  d: Diapo,
  index: number,
  total: number,
  fond: string | null = null,
  format: Format = 'erreur',
): string {
  const echapper = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const ouverture = index === 0;
  const fin = index === total - 1;
  const role = ouverture ? 'ouverture' : fin ? 'fin' : 'corps';
  const look = format === 'liste' ? 'clair' : format === 'avant-apres' ? 'contraste' : 'sombre';

  const compteur = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  // Ou va la photo : en bandeau sur l'ouverture claire, sous le voile sur les
  // diapos sombres, nulle part sur l'aplat cyan et sur le papier.
  const bandeau = look === 'clair' && ouverture;
  const sousVoile = look === 'sombre' || (look === 'contraste' && !ouverture);
  let decor = '';
  if (bandeau) {
    decor = `<div class="bande"${fond ? ` style="background-image:url('${fond}')"` : ''}></div>`;
  } else if (sousVoile && fond) {
    decor = `<div class="fond" style="background-image:url('${fond}')"></div><div class="voile"></div>`;
  }
  const halo = look === 'sombre' || (look === 'contraste' && !ouverture) ? '<div class="halo"></div>' : '';

  // Le corps de la diapo, selon le role et le format.
  let corps: string;
  if (ouverture) {
    corps = `<h1 class="titre">${echapper(d.titre)}</h1><div class="barre"></div>`;
  } else if (fin) {
    const lignes = d.lignes
      .map((l) =>
        format === 'liste'
          ? `<p class="ligne coche"><span class="case"></span><span>${echapper(l)}</span></p>`
          : `<p class="ligne">${echapper(l)}</p>`,
      )
      .join('');
    // L'invitation est ecrite ICI, pas par le modele : c'est la meme chaque
    // semaine, et c'est elle qui demande le geste qui compte le plus.
    corps = `<h1 class="titre">${echapper(d.titre)}</h1><div class="barre"></div>${lignes}
      <div class="partage">
        <div class="partage-1">Envoie ça à un entrepreneur qui en a besoin.</div>
        <div class="partage-2">Ou sauvegarde-le pour ce soir.</div>
      </div>`;
  } else if (format === 'liste') {
    corps = `<div class="numero">${index}</div>
      <h1 class="titre">${echapper(d.titre)}</h1>
      ${d.lignes.map((l) => `<p class="ligne">${echapper(l)}</p>`).join('')}`;
  } else if (format === 'avant-apres') {
    corps = `<h1 class="titre">${echapper(d.titre)}</h1>
      <div class="bloc avant"><div class="marqueur">Avant</div><p>${echapper(d.lignes[0] || '')}</p></div>
      <div class="bloc apres"><div class="marqueur">Après</div><p>${echapper(d.lignes[1] || '')}</p></div>`;
  } else {
    corps = `<h1 class="titre">${echapper(d.titre)}</h1><div class="barre"></div>
      ${d.lignes.map((l) => `<p class="ligne">${echapper(l)}</p>`).join('')}`;
  }

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  :root { --marine:#050a15; --cyan:#00d2ff; --papier:#f3efe6; }
  body {
    width:1080px; height:1350px; background:var(--marine); color:#fff;
    font-family:Archivo, system-ui, sans-serif; overflow:hidden; position:relative;
    display:flex; flex-direction:column; justify-content:space-between;
    padding:96px 84px;
  }
  .fond { position:absolute; inset:0; background-size:cover; background-position:center; }
  /* Le voile fixe le contraste. Au plus clair (72 % d'opacite en haut), du
     blanc pur sur le marine garde un rapport bien au-dela du 4,5:1 exige,
     quelle que soit la photo en dessous. */
  .voile {
    position:absolute; inset:0;
    background:linear-gradient(180deg,
      rgba(5,10,21,.72) 0%, rgba(5,10,21,.84) 42%, rgba(5,10,21,.94) 100%);
  }
  .halo {
    position:absolute; top:-260px; left:50%; transform:translateX(-50%);
    width:1200px; height:700px; border-radius:50%;
    background:var(--cyan); opacity:.14; filter:blur(170px);
  }
  .filet { position:absolute; left:0; right:0; top:0; height:8px; background:var(--cyan); }
  header, main, footer { position:relative; }
  header { display:flex; align-items:baseline; justify-content:space-between; }
  .etiquette {
    font-weight:600; font-size:24px; letter-spacing:.24em; text-transform:uppercase;
    color:var(--cyan);
  }
  .compteur { font-weight:600; font-size:22px; letter-spacing:.2em; color:rgba(255,255,255,.4); }
  body.ouverture main { display:flex; flex-direction:column; justify-content:center; flex:1; }
  .titre {
    font-weight:900; line-height:1.0; letter-spacing:-.03em;
    text-transform:uppercase; text-wrap:balance;
  }
  body.ouverture .titre { font-size:112px; }
  body.corps .titre    { font-size:78px; }
  body.fin .titre      { font-size:78px; }
  .barre { width:96px; height:8px; background:var(--cyan); border-radius:4px; margin:44px 0 40px; }
  body.ouverture .barre { margin-bottom:0; }
  .ligne {
    font-weight:600; font-size:46px; line-height:1.36; color:rgba(255,255,255,.8);
    margin-bottom:24px;
  }
  footer { display:flex; align-items:flex-end; justify-content:space-between; }
  .marque { font-weight:900; font-size:34px; letter-spacing:.12em; text-transform:uppercase; }
  .site { font-weight:600; font-size:26px; color:rgba(255,255,255,.46); margin-top:8px; }
  .metier {
    font-weight:600; font-size:22px; letter-spacing:.16em; text-transform:uppercase;
    color:var(--cyan); text-align:right; line-height:1.6;
  }
  /* Le seul mouvement du carrousel : dire au pouce ou aller. */
  .glisse {
    font-weight:900; font-size:26px; letter-spacing:.24em; text-transform:uppercase;
    color:var(--cyan); display:flex; align-items:center; gap:14px;
  }
  .fleche { font-size:34px; line-height:1; }

  /* La derniere diapo : ce qu'on demande au lecteur de faire. Marine sur cyan,
     jamais blanc sur cyan. */
  .partage { margin-top:34px; background:var(--cyan); color:var(--marine); border-radius:18px; padding:30px 36px; }
  .partage-1 { font-weight:900; font-size:44px; line-height:1.15; letter-spacing:-.01em; }
  .partage-2 { font-weight:600; font-size:33px; margin-top:12px; opacity:.8; }

  /* ── LOOK CLAIR : la liste a garder ─────────────────────────────────────── */
  body.clair { background:var(--papier); color:var(--marine); }
  body.clair .filet { background:var(--marine); }
  body.clair .etiquette { color:var(--marine); }
  body.clair .compteur { color:rgba(5,10,21,.46); }
  body.clair .ligne { color:rgba(5,10,21,.76); }
  body.clair .site { color:rgba(5,10,21,.5); }
  body.clair .metier, body.clair .glisse { color:var(--marine); }
  body.clair .barre { background:var(--marine); }
  /* Le bandeau photo de l'ouverture. Sans photo, un aplat marine : la diapo
     garde sa forme. Le degrade du haut tient l'etiquette lisible. */
  .bande {
    position:absolute; left:0; right:0; top:0; height:560px;
    background-color:var(--marine); background-size:cover; background-position:center;
  }
  .bande::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(5,10,21,.78) 0%, rgba(5,10,21,.18) 46%, rgba(5,10,21,0) 100%);
  }
  body.clair.ouverture .etiquette { color:#fff; }
  body.clair.ouverture .compteur { color:rgba(255,255,255,.7); }
  body.clair.ouverture .filet { background:var(--cyan); }
  body.clair.ouverture main { padding-top:500px; justify-content:center; }
  body.clair.ouverture .titre { font-size:88px; }
  body.clair.ouverture .barre { background:var(--cyan); height:12px; width:140px; margin-top:36px; }
  .numero {
    width:184px; height:184px; border-radius:26px; background:var(--cyan); color:var(--marine);
    font-weight:900; font-size:132px; line-height:184px; text-align:center; margin-bottom:44px;
  }
  body.clair.corps .titre { margin-bottom:36px; }
  .coche { display:flex; align-items:flex-start; gap:24px; }
  .case {
    flex:none; width:48px; height:48px; border:5px solid var(--marine); border-radius:10px;
    margin-top:8px; background:#fff;
  }
  body.clair .partage { background:var(--marine); color:#fff; }
  body.clair .partage-2 { color:var(--cyan); opacity:1; }

  /* ── LOOK CONTRASTE : l'avant-apres ─────────────────────────────────────── */
  body.contraste.ouverture { background:var(--cyan); color:var(--marine); }
  body.contraste.ouverture .filet { background:var(--marine); }
  body.contraste.ouverture .etiquette,
  body.contraste.ouverture .glisse { color:var(--marine); }
  body.contraste.ouverture .compteur { color:rgba(5,10,21,.55); }
  body.contraste.ouverture .site { color:rgba(5,10,21,.6); }
  body.contraste.ouverture .barre { background:var(--marine); }
  body.contraste.corps .titre { font-size:64px; margin-bottom:44px; }
  .bloc { border-radius:20px; padding:30px 36px 34px; }
  .bloc p { font-weight:600; font-size:44px; line-height:1.3; }
  .marqueur { font-weight:900; font-size:22px; letter-spacing:.26em; text-transform:uppercase; margin-bottom:14px; }
  .bloc.avant { border:3px solid rgba(255,255,255,.26); color:rgba(255,255,255,.62); margin-bottom:22px; }
  .bloc.avant .marqueur { color:rgba(255,255,255,.5); }
  .bloc.apres { background:var(--cyan); color:var(--marine); }

  /* Quand le texte deborde, rendre() ajoute cette classe et tout rapetisse
     d'un cran. Un texte plus petit vaut mieux qu'un texte coupe. */
  body.serre .titre { zoom:.84; }
  body.serre .ligne, body.serre .bloc p { font-size:38px; }
  body.serre .numero { width:120px; height:120px; line-height:120px; font-size:86px; margin-bottom:30px; }
  body.serre .barre { margin:30px 0 28px; }
  body.serre .partage { margin-top:22px; padding:24px 30px; }
  body.serre .partage-1 { font-size:38px; }
</style></head><body class="${look} ${role}">
  ${decor}
  ${halo}
  <div class="filet"></div>
  <header>
    <span class="etiquette">Propulsite · ${FICHES[format].etiquette}</span>
    <span class="compteur">${compteur}</span>
  </header>
  <main>
    ${corps}
  </main>
  <footer>
    <div>
      <div class="marque">Propulsite</div>
      <div class="site">propulsite.ca</div>
    </div>
    ${
      ouverture
        ? '<div class="glisse">Glisse<span class="fleche">&rsaquo;</span></div>'
        : '<div class="metier">Par un ancien<br>charpentier</div>'
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
  format: Format,
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

    // Le texte touche-t-il le pied de page, ou sort-il de l'image ? Les limites
    // de caracteres protegent presque toujours ; « presque », encore.
    const deborde = () =>
      page.evaluate(() => {
        const main = document.querySelector('main')!;
        const pied = document.querySelector('footer')!;
        const dernier = main.lastElementChild || main;
        const premier = main.firstElementChild || main;
        // Le plafond : le bas du bandeau photo s'il y en a un, sinon l'en-tete.
        const toit = (document.querySelector('.bande') || document.querySelector('header')!).getBoundingClientRect().bottom;
        return (
          dernier.getBoundingClientRect().bottom > pied.getBoundingClientRect().top - 24 ||
          premier.getBoundingClientRect().top < toit + 12
        );
      });

    for (let i = 0; i < p.diapos.length; i++) {
      const html = gabarit(p.diapos[i], i, p.diapos.length, fonds[i] ?? null, format);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      // Laisser les polices Google finir de s'appliquer.
      await page.evaluateHandle('document.fonts.ready');
      await new Promise((r) => setTimeout(r, 400));
      if (await deborde()) {
        await page.evaluate(() => document.body.classList.add('serre'));
        await new Promise((r) => setTimeout(r, 150));
        if (await deborde()) {
          throw new Error(`diapo ${i + 1} : le texte déborde même resserré — « ${p.diapos[i].titre} »`);
        }
        console.log(`  diapo ${i + 1} resserrée pour tenir dans l'image`);
      }
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

/**
 * Un contenu fixe par format, pour juger les gabarits sans appeler l'API.
 * Les textes sont volontairement proches des limites : c'est le pire cas qui
 * doit tenir dans l'image, pas le cas moyen.
 */
const ESSAIS: Record<Format, Publication> = {
  erreur: {
    slug: 'essai-erreur',
    angle: 'essai du gabarit erreur',
    photo: 'concrete wall texture',
    diapos: [
      { titre: 'Ta fiche Google dit que t’es fermé le samedi', lignes: [], alt: 'Diapo d’essai du gabarit.' },
      {
        titre: 'Ce qui se passe',
        lignes: [
          'Un client cherche un couvreur samedi matin.',
          'Google écrit « Fermé » en rouge à côté de ton nom.',
          'Il appelle le suivant sur la liste. Pas toi.',
        ],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'Ce que ça te coûte',
        lignes: ['Tu réponds au téléphone le samedi.', 'Mais personne ne le sait, alors personne n’appelle.'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'Le correctif prend deux minutes',
        lignes: ['Ouvre ta fiche Google sur ton cellulaire.', 'Change tes heures pour celles où tu réponds vraiment.'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'À retenir',
        lignes: ['Ouvre ta fiche Google.', 'Mets les heures où tu réponds.', 'Refais-le à chaque changement de saison.'],
        alt: 'Diapo d’essai du gabarit.',
      },
    ],
    legende: 'Essai de gabarit — ce texte ne sera jamais publie.',
    hashtags: ['#construction', '#rivenord', '#fichegoogle'],
  },
  liste: {
    slug: 'essai-liste',
    angle: 'essai du gabarit liste',
    photo: 'lumber stack',
    diapos: [
      { titre: 'Ton téléphone sonne moins ? 3 gestes gratuits', lignes: [], alt: 'Diapo d’essai du gabarit.' },
      {
        titre: 'Ajoute 5 photos de ton dernier chantier',
        lignes: ['Une fiche avec des photos récentes rassure.', 'Prends-les sur ton cell, pas besoin de photographe.'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'Demande un avis à tes 3 derniers clients',
        lignes: ['Envoie-leur le lien par texto le jour même.', 'Le lendemain, ils ont déjà oublié.'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'Réponds à chaque avis, même les bons',
        lignes: ['Deux lignes suffisent. Le prochain client les lit.'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'Ta liste pour ce soir',
        lignes: ['5 photos de ton dernier chantier', 'Un texto d’avis à 3 clients', 'Une réponse à chaque avis reçu'],
        alt: 'Diapo d’essai du gabarit.',
      },
    ],
    legende: 'Essai de gabarit — ce texte ne sera jamais publie.',
    hashtags: ['#construction', '#rivenord', '#fichegoogle'],
  },
  'avant-apres': {
    slug: 'essai-avant-apres',
    angle: 'essai du gabarit avant-apres',
    photo: 'steel beams',
    diapos: [
      { titre: '« Rénovation générale » ne dit rien à personne', lignes: [], alt: 'Diapo d’essai du gabarit.' },
      {
        titre: 'La description de ta fiche Google',
        lignes: ['Rénovation générale, travail de qualité depuis 2009.', 'Sous-sols et salles de bain à Laval. Soumission en 48 h.'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'Ta réponse à une demande de prix',
        lignes: ['Bonjour, je vous reviens là-dessus bientôt.', 'Bonjour Marc, je passe mesurer jeudi à 17 h. Ça te va ?'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'Le texte sous ta photo de chantier',
        lignes: ['Beau projet terminé cette semaine !', 'Toiture refaite à Saint-Eustache : bardeau 30 ans, 4 jours.'],
        alt: 'Diapo d’essai du gabarit.',
      },
      {
        titre: 'La règle',
        lignes: ['Dis quoi, où, et en combien de temps.', 'Le client veut se reconnaître, pas être impressionné.'],
        alt: 'Diapo d’essai du gabarit.',
      },
    ],
    legende: 'Essai de gabarit — ce texte ne sera jamais publie.',
    hashtags: ['#construction', '#rivenord', '#fichegoogle'],
  },
};

/** Cherche les fonds : les vraies photos d'abord, Gemini en dernier recours. */
async function chercherFonds(p: Publication, rang: number): Promise<{ fonds: (string | null)[]; notes: string[] }> {
  const fonds: (string | null)[] = [];
  const notes: string[] = [];

  // Les vraies photos d'abord. Le fil d'un entrepreneur est fait de photos, et
  // l'oeil repere une image de synthese plus vite qu'on ne le croit. Gemini ne
  // sert que si aucune vraie photo n'est disponible — et il coute 0,67 $ de
  // plus.
  const reel = await vraiesPhotos(p.photo, p.diapos.length, rang);
  if (reel.photos) {
    reel.photos.forEach((ph) => {
      fonds.push(ph.image);
      notes.push(ph.note);
    });
  } else {
    // La raison de l'echec entre au journal AVANT le repli. Sans elle, une
    // publication qui retombe sur Gemini n'a l'air de rien.
    notes.push(`vraies photos ecartees : ${reel.note}`);
    for (let i = 0; i < p.diapos.length; i++) {
      const f = await fabriquerFond(p.angle, rang);
      fonds.push(f.image);
      notes.push(f.note);
    }
  }

  // Le dernier fond comble si une source en a rendu moins que cinq.
  while (fonds.length < p.diapos.length) {
    fonds.push(fonds[fonds.length - 1] ?? null);
  }
  return { fonds, notes };
}

async function main() {
  fs.mkdirSync(DOSSIER, { recursive: true });

  // --essai : rend les TROIS gabarits a partir de contenus fixes, sans appeler
  // l'API. Pour juger le visuel gratuitement.
  //
  // Ajouter --fond y met de vraies photos (Pexels, gratuit). Sans cle Pexels,
  // le repli sur Gemini coute environ 0,67 $ par carrousel.
  if (process.argv.includes('--essai')) {
    const avecFond = process.argv.includes('--fond');
    for (const [i, format] of FORMATS.entries()) {
      // --pire : gonfle chaque titre et chaque ligne jusqu'a la limite permise.
      // C'est le pire cas qui doit tenir dans l'image, pas le cas moyen.
      const gonfler = (texte: string, max: number) =>
        (texte + ' et encore des mots pour remplir jusqu’au bout de la limite').slice(0, max);
      const p: Publication = !process.argv.includes('--pire')
        ? ESSAIS[format]
        : {
            ...ESSAIS[format],
            diapos: ESSAIS[format].diapos.map((d) => ({
              ...d,
              titre: gonfler(d.titre, 46),
              lignes: d.lignes.map((l) => gonfler(l, 62)),
            })),
          };
      const probleme = verifier({ ...p, legende: 'mot '.repeat(50) }, format);
      if (probleme) console.log(`  (${format}) le contenu d'essai ne passerait pas : ${probleme}`);
      let fonds: (string | null)[] = new Array(NB_DIAPOS).fill(null);
      if (avecFond) fonds = (await chercherFonds(p, i)).fonds;
      const noms = await rendre(p, format, fonds, (n) => `essai-gabarit-${format}-${n + 1}.png`);
      console.log(`Essai « ${format} » rendu : ${noms.join(', ')}`);
    }
    return;
  }

  const journal = lireJournal();
  const jour = new Date().toISOString().slice(0, 10);
  if (journal.some((e) => e.date === jour)) {
    console.log(`Une publication existe déjà pour le ${jour} — rien à faire.`);
    return;
  }

  const format = formatSuivant(journal);
  console.log(`Format de la semaine : ${FICHES[format].nom}`);

  const { p, jugement } = await demander(format, journal);
  console.log(`Retenu : ${p.angle} — ${jugement}`);
  p.diapos.forEach((d, i) => console.log(`  ${i + 1}. ${d.titre}`));

  // Le rang fait tourner les photos : la publication n ne retombe pas sur le
  // beton de la publication n-1.
  const { fonds, notes } = await chercherFonds(p, journal.length);

  const noms = await rendre(p, format, fonds, (i) => `${jour}-${p.slug}-${i + 1}.png`);

  journal.push({
    ...p,
    date: jour,
    format,
    images: noms,
    publie: false,
    // Une note par diapo serait illisible : on garde la premiere, et le compte
    // de celles qui ont vraiment recu une matiere.
    fond: `${fonds.filter(Boolean).length}/${noms.length} — ${notes[0]}`,
    jugement,
  });
  fs.writeFileSync(JOURNAL, JSON.stringify(journal, null, 2) + '\n', 'utf8');

  console.log(`✅ ${noms.length} images écrites, en attente de publication.`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
