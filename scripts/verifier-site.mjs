/**
 * verifier-site.mjs — barrière de qualité avant livraison
 *
 * Analyse le dossier dist/ construit et vérifie les invariants SEO,
 * d'accessibilité et de performance qui doivent tenir sur CHAQUE page.
 *
 *   npm run build && npm run verifier
 *
 * Sort en code 1 s'il reste au moins une ERREUR, 0 sinon. Les AVERTISSEMENTS
 * n'échouent pas le script : ce sont des points à juger au cas par cas.
 *
 * Limite assumée : l'analyse est faite par expressions régulières sur le HTML
 * pré-rendu, sans arbre DOM. C'est suffisant pour du HTML généré par notre
 * propre prerender (structure prévisible), mais ça ne remplace pas un test
 * dans un vrai navigateur. Vérifier aussi visuellement avant de livrer.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://propulsite.ca';

// Seuils. Les longueurs de balises viennent de ce que Google affiche
// réellement dans ses résultats avant de tronquer.
const TITRE_MIN = 30, TITRE_MAX = 65;
const DESC_MIN = 70, DESC_MAX = 160;
// Au-delà, une ressource pèse sur le premier affichage sur données mobiles.
const IMAGE_LOURDE_KO = 300;
const JS_LOURD_KO = 400;

const erreurs = [];
const avertissements = [];
const err = (page, msg) => erreurs.push(`${page} — ${msg}`);
const avert = (page, msg) => avertissements.push(`${page} — ${msg}`);

/** Retourne le contenu du <head>, ou le document entier s'il n'y en a pas. */
function tete(html) {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : html;
}

/**
 * Extrait le contenu d'une balise meta par son name= ou property=.
 *
 * La capture du guillemet ouvrant puis le renvoi arrière \1 sont essentiels :
 * une classe [^"'] s'arrêterait à la première apostrophe du texte français
 * (« aujourd'hui »), tronquant silencieusement la valeur lue.
 */
function attribut(balise, nom) {
  const val = balise.match(new RegExp(`${nom}=(["'])([\\s\\S]*?)\\1`, 'i'));
  return val ? val[2].trim() : null;
}

function meta(html, cle) {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${cle}["'][^>]*>`, 'i');
  const balise = html.match(re);
  return balise ? attribut(balise[0], 'content') : null;
}

/** Liste tous les fichiers correspondant à un prédicat, récursivement. */
function parcourir(dir, garder, acc = []) {
  for (const entree of fs.readdirSync(dir, { withFileTypes: true })) {
    const complet = path.join(dir, entree.name);
    if (entree.isDirectory()) parcourir(complet, garder, acc);
    else if (garder(complet)) acc.push(complet);
  }
  return acc;
}

/** Décode les entités HTML les plus courantes pour compter la vraie longueur. */
function decoder(txt) {
  return txt
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

if (!fs.existsSync(DIST)) {
  console.error('✗ dist/ absent. Lancer « npm run build » avant de vérifier.');
  process.exit(1);
}

const pages = parcourir(DIST, (f) => f.endsWith('.html'));
if (pages.length === 0) {
  console.error('✗ Aucune page HTML dans dist/.');
  process.exit(1);
}

const titresVus = new Map();
const descsVues = new Map();
const urlsIndexables = new Set();

for (const fichier of pages) {
  const rel = path.relative(DIST, fichier).replace(/\\/g, '/');
  const html = fs.readFileSync(fichier, 'utf8');
  const head = tete(html);

  // Les sites de démonstration sont volontairement hors index et suivent
  // leurs propres règles : on ne leur applique pas les contrôles SEO.
  const horsIndex = /content=["'][^"']*noindex/i.test(head);

  // ── Langue ──────────────────────────────────────────────────────────
  const lang = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  if (!lang) err(rel, 'attribut lang manquant sur <html>');

  // ── Titre ───────────────────────────────────────────────────────────
  const titreBrut = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titreBrut) {
    err(rel, 'balise <title> manquante');
  } else {
    const titre = decoder(titreBrut[1].trim());
    if (titre.length === 0) err(rel, '<title> vide');
    else if (!horsIndex) {
      if (titre.length < TITRE_MIN)
        avert(rel, `titre court (${titre.length} car., visé ${TITRE_MIN}-${TITRE_MAX})`);
      if (titre.length > TITRE_MAX)
        avert(rel, `titre long (${titre.length} car., tronqué par Google au-delà de ${TITRE_MAX})`);
      if (titresVus.has(titre))
        err(rel, `titre identique à ${titresVus.get(titre)} — chaque page doit avoir un titre unique`);
      else titresVus.set(titre, rel);
    }
  }

  // ── Description ─────────────────────────────────────────────────────
  const descBrute = meta(head, 'description');
  if (!descBrute) {
    if (!horsIndex) err(rel, 'meta description manquante');
  } else if (!horsIndex) {
    const desc = decoder(descBrute);
    if (desc.length < DESC_MIN)
      avert(rel, `description courte (${desc.length} car., visé ${DESC_MIN}-${DESC_MAX})`);
    if (desc.length > DESC_MAX)
      avert(rel, `description longue (${desc.length} car., tronquée au-delà de ${DESC_MAX})`);
    if (descsVues.has(desc))
      err(rel, `description identique à ${descsVues.get(desc)} — doit être unique`);
    else descsVues.set(desc, rel);
  }

  // ── Canonical ───────────────────────────────────────────────────────
  const canoniques = head.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi) || [];
  if (!horsIndex) {
    if (canoniques.length === 0) err(rel, 'canonical manquant');
    else if (canoniques.length > 1)
      err(rel, `${canoniques.length} canonical — il ne doit y en avoir qu'un`);
    else {
      const href = attribut(canoniques[0], 'href');
      if (!href) err(rel, 'canonical sans href');
      else if (!href.startsWith('http'))
        err(rel, `canonical relatif (${href}) — doit être absolu`);
      else urlsIndexables.add(href.replace(/\/$/, '') || SITE_URL);
    }
  }

  // ── Open Graph ──────────────────────────────────────────────────────
  if (!horsIndex && !meta(head, 'og:image'))
    avert(rel, 'og:image manquante — aperçu vide au partage sur Facebook/LinkedIn');

  // ── Un seul h1 ──────────────────────────────────────────────────────
  const h1 = html.match(/<h1[\s>]/gi) || [];
  if (h1.length === 0) avert(rel, 'aucun <h1>');
  else if (h1.length > 1) err(rel, `${h1.length} <h1> — il n'en faut qu'un par page`);

  // ── JSON-LD valide ──────────────────────────────────────────────────
  const blocs = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  blocs.forEach((bloc, i) => {
    const corps = bloc.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
    try {
      const donnees = JSON.parse(corps);
      if (!donnees['@context'] && !Array.isArray(donnees))
        avert(rel, `JSON-LD nº${i + 1} sans @context`);
    } catch (e) {
      err(rel, `JSON-LD nº${i + 1} invalide : ${e.message}`);
    }
  });

  // ── Images : alt et dimensions ──────────────────────────────────────
  const images = html.match(/<img\b[^>]*>/gi) || [];
  let sansAlt = 0, sansDim = 0;
  for (const img of images) {
    if (!/\salt=/i.test(img)) sansAlt++;
    // Une image sans dimensions ni aspect-ratio fait sauter la mise en page
    // au chargement (CLS). L'attribut style peut porter l'aspect-ratio.
    const aDim = /\swidth=/i.test(img) && /\sheight=/i.test(img);
    const aRatio = /aspect-ratio/i.test(img);
    if (!aDim && !aRatio) sansDim++;
  }
  if (sansAlt > 0)
    err(rel, `${sansAlt} image(s) sans attribut alt (mettre alt="" si décorative)`);
  if (sansDim > 0)
    avert(rel, `${sansDim} image(s) sans width/height — risque de saut de mise en page (CLS)`);

  // ── Lien téléphone cliquable ────────────────────────────────────────
  if (!horsIndex && !/href=["']tel:/i.test(html))
    avert(rel, 'aucun lien tel: — le téléphone doit être cliquable sur mobile');
}

// ── Fichiers attendus à la racine ─────────────────────────────────────
for (const f of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  if (!fs.existsSync(path.join(DIST, f))) err('dist/', `${f} manquant`);
}

// ── Cohérence du sitemap ──────────────────────────────────────────────
const cheminSitemap = path.join(DIST, 'sitemap.xml');
if (fs.existsSync(cheminSitemap)) {
  const xml = fs.readFileSync(cheminSitemap, 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim().replace(/\/$/, '') || SITE_URL);

  const dansSitemap = new Set(urls);
  for (const u of urlsIndexables) {
    if (!dansSitemap.has(u))
      err('sitemap.xml', `${u} est indexable mais absente du sitemap`);
  }
  for (const u of urls) {
    if (!urlsIndexables.has(u))
      avert('sitemap.xml', `${u} listée mais sans page canonique correspondante`);
  }
  const doublons = urls.filter((u, i) => urls.indexOf(u) !== i);
  if (doublons.length)
    err('sitemap.xml', `URL en double : ${[...new Set(doublons)].join(', ')}`);
}

// ── Poids des ressources ──────────────────────────────────────────────
const ko = (o) => Math.round(o / 1024);
for (const f of parcourir(DIST, (f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))) {
  const taille = ko(fs.statSync(f).size);
  if (taille > IMAGE_LOURDE_KO)
    avert(path.relative(DIST, f).replace(/\\/g, '/'),
      `image de ${taille} Ko (seuil ${IMAGE_LOURDE_KO} Ko) — compresser ou servir en WebP/AVIF`);
}
for (const f of parcourir(DIST, (f) => f.endsWith('.js'))) {
  const taille = ko(fs.statSync(f).size);
  if (taille > JS_LOURD_KO)
    avert(path.relative(DIST, f).replace(/\\/g, '/'),
      `script de ${taille} Ko (seuil ${JS_LOURD_KO} Ko) — envisager un chargement paresseux`);
}

// ── Rapport ───────────────────────────────────────────────────────────
console.log(`\n${pages.length} page(s) analysée(s) dans dist/\n`);

if (avertissements.length) {
  console.log(`⚠  ${avertissements.length} avertissement(s) :`);
  for (const a of avertissements) console.log(`   ${a}`);
  console.log('');
}

if (erreurs.length) {
  console.log(`✗  ${erreurs.length} erreur(s) :`);
  for (const e of erreurs) console.log(`   ${e}`);
  console.log('\nCorriger puis relancer « npm run verifier ».\n');
  process.exit(1);
}

console.log('✓  Aucune erreur bloquante.');
console.log('   Vérifier aussi visuellement (desktop + mobile) avant de livrer.\n');
