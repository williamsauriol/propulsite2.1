/**
 * social-publier.ts — Publie sur Instagram le carrousel en attente.
 *
 * L'API de publication d'Instagram ne prend jamais les octets d'une image :
 * elle exige une URL publique qu'elle va chercher elle-même — d'où l'obligation
 * d'un hébergement public, réglée en écrivant dans `public/social/` d'un dépôt
 * public.
 *
 * UN CARROUSEL SE PUBLIE EN TROIS TEMPS, PAS DEUX
 *
 *   1. Un conteneur par image, chacun marqué `is_carousel_item=true`.
 *      Ceux-là ne portent PAS la légende.
 *   2. Un conteneur `CAROUSEL` qui liste les enfants et porte la légende.
 *   3. La publication de ce dernier conteneur.
 *
 * Poser la légende sur les enfants la fait disparaître : c'est le conteneur
 * parent qui la porte, et lui seul.
 *
 * IL FAUT DEUX SECRETS DANS LE DÉPÔT (voir docs/AUTOMATISER-INSTAGRAM.md) :
 *   IG_USER_ID     l'identifiant du compte Instagram professionnel
 *   META_TOKEN     un jeton d'accès de longue durée
 *
 * Sans eux, le script s'arrête proprement sans rien casser : l'image reste
 * dans le dépôt, marquée non publiée, et repartira au prochain passage.
 *
 *   npx tsx scripts/social-publier.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(__dirname, '..');
const DOSSIER = path.join(RACINE, 'public', 'social');
const JOURNAL = path.join(DOSSIER, 'journal.json');

const IG_USER_ID = process.env.IG_USER_ID;
const META_TOKEN = process.env.META_TOKEN;

/**
 * Le lieu de la publication. Facultatif, mais il compte : une publication
 * geolocalisee sort dans le fil du lieu, et c'est du monde de la region qui
 * cherche justement un entrepreneur.
 *
 * `IG_LOCATION_ID` en secret GitHub court-circuite la recherche. Sans lui, on
 * cherche le nom ci-dessous — et si Meta refuse la recherche, la publication
 * part quand meme, sans lieu. Un lieu manquant ne vaut pas une semaine perdue.
 */
const LIEU = process.env.IG_LOCATION_NOM || 'Sainte-Eustache, Quebec';
const LIEU_ID = process.env.IG_LOCATION_ID;

// Le dépôt est public : raw.githubusercontent sert le fichier dès que le
// commit est poussé, sans attendre le déploiement de Vercel. C'est ce qui
// permet de générer et publier dans la même exécution.
const DEPOT = process.env.GITHUB_REPOSITORY || 'williamsauriol/propulsite2.1';
const BRANCHE = process.env.GITHUB_REF_NAME || 'main';
const BASE_IMAGES = `https://raw.githubusercontent.com/${DEPOT}/${BRANCHE}/public/social`;

// Meta retire chaque version de l'API environ deux ans apres sa sortie, et
// sans prevenir autrement que par une erreur au moment de publier. v21.0
// datait d'octobre 2024 : elle arrivait a echeance. v26.0 est la plus recente
// encore servie en septembre 2026.
//
// Pour verifier laquelle est vivante sans jeton :
//   curl -s https://graph.facebook.com/v27.0/me
// « An active access token must be used » = la version existe.
// « Unknown path components » = elle n'existe pas.
const API = 'https://graph.facebook.com/v26.0';

interface Diapo { titre: string; lignes: string[]; alt?: string }

interface Entree {
  slug: string; angle: string; diapos: Diapo[];
  legende: string; hashtags: string[];
  date: string; images: string[]; publie: boolean;
  fond?: string;
  publieLe?: string; urlInstagram?: string;
}

function journal(): Entree[] {
  if (!fs.existsSync(JOURNAL)) return [];
  return JSON.parse(fs.readFileSync(JOURNAL, 'utf8'));
}

/** Attend que l'image soit réellement servie — Meta ira la chercher. */
async function attendreImage(url: string, essaisMax = 20): Promise<boolean> {
  for (let i = 1; i <= essaisMax; i++) {
    try {
      const r = await fetch(url, { method: 'HEAD' });
      if (r.ok) {
        console.log(`  image accessible après ${i} essai(s)`);
        return true;
      }
    } catch { /* le réseau peut hoqueter, on réessaie */ }
    await new Promise((r) => setTimeout(r, 6000));
  }
  return false;
}

/** Cherche l'identifiant du lieu. Rend null des que quelque chose resiste. */
async function trouverLieu(): Promise<string | null> {
  if (LIEU_ID) {
    console.log(`  lieu impose par secret : ${LIEU_ID}`);
    return LIEU_ID;
  }
  try {
    const url =
      `${API}/pages/search?q=${encodeURIComponent(LIEU)}&type=place` +
      `&fields=id,name&limit=1&access_token=${encodeURIComponent(META_TOKEN as string)}`;
    const r = await fetch(url);
    const data = await r.json();
    const lieu = data?.data?.[0];
    if (!r.ok || data.error || !lieu?.id) {
      console.log(`  lieu introuvable (${data?.error?.message || 'aucun resultat'}) — on publie sans.`);
      return null;
    }
    console.log(`  lieu : ${lieu.name} (${lieu.id})`);
    return lieu.id;
  } catch {
    console.log('  recherche de lieu impossible — on publie sans.');
    return null;
  }
}

async function appeler(chemin: string, corps: Record<string, string>) {
  const r = await fetch(`${API}/${chemin}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ ...corps, access_token: META_TOKEN as string }),
  });
  const data = await r.json();
  if (!r.ok || data.error) {
    throw new Error(`Meta ${r.status} : ${JSON.stringify(data.error || data).slice(0, 400)}`);
  }
  return data;
}

async function main() {
  const entrees = journal();

  // `e.images?.length` et pas `!e.publie` tout court : le journal peut encore
  // contenir des entrees de l'epoque « une seule image », qui n'ont pas de
  // tableau `images`. Les lire les ferait planter ici, sur une ligne qui n'a
  // rien a voir avec la vraie cause.
  const enAttente = entrees.filter((e) => !e.publie && e.images?.length);

  if (enAttente.length === 0) {
    console.log('Rien en attente de publication.');
    return;
  }
  // On ne publie que la plus récente. Si plusieurs se sont accumulées parce
  // que les jetons manquaient, publier tout d'un coup ferait trois posts à la
  // même minute — le meilleur moyen de se faire limiter par Instagram.
  const e = enAttente[enAttente.length - 1];
  console.log(`À publier : ${e.images.length} diapos — « ${e.diapos[0].titre} »`);

  if (!IG_USER_ID || !META_TOKEN) {
    console.log('');
    console.log("⏸  IG_USER_ID ou META_TOKEN absent : rien n'est publié.");
    console.log('   Les images restent dans public/social/ et repartiront au');
    console.log('   prochain passage. Voir docs/AUTOMATISER-INSTAGRAM.md.');
    return;
  }

  const urls = e.images.map((nom) => `${BASE_IMAGES}/${nom}`);

  // Meta ira chercher chaque image lui-même : si une seule n'est pas encore
  // servie, le carrousel part incomplet ou echoue. On les verifie toutes
  // avant de creer quoi que ce soit.
  for (const url of urls) {
    console.log(`  vérification : ${url.split('/').pop()}`);
    if (!(await attendreImage(url))) {
      throw new Error(`${url} n'est pas servie publiquement — publication annulée.`);
    }
  }

  // 1. Un conteneur par diapo. Pas de légende ici : elle irait se perdre.
  //
  // `alt_text` va en revanche sur chaque enfant, et nulle part ailleurs :
  // c'est ce que lit un lecteur d'ecran, et ce dont Instagram se sert pour
  // comprendre de quoi parle l'image. Sans lui, il en invente un.
  const enfants: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const alt = e.diapos[i]?.alt;
    const c = await appeler(`${IG_USER_ID}/media`, {
      image_url: urls[i],
      is_carousel_item: 'true',
      ...(alt ? { alt_text: alt } : {}),
    });
    console.log(`  diapo ${i + 1}/${urls.length} — conteneur ${c.id}`);
    enfants.push(c.id);
  }

  // Meta télécharge les images en arrière-plan. Créer le parent trop tôt le
  // fait échouer sur un enfant pas encore prêt.
  await new Promise((r) => setTimeout(r, 10000));

  // 2. Le conteneur du carrousel. C'est lui, et lui seul, qui porte la légende.
  const legende = `${e.legende}

.
.
${e.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`;

  const lieuId = await trouverLieu();

  const parent = await appeler(`${IG_USER_ID}/media`, {
    media_type: 'CAROUSEL',
    children: enfants.join(','),
    caption: legende,
    ...(lieuId ? { location_id: lieuId } : {}),
  });
  console.log(`  carrousel ${parent.id} assemblé`);

  await new Promise((r) => setTimeout(r, 8000));

  // 3. La publication.
  const publie = await appeler(`${IG_USER_ID}/media_publish`, {
    creation_id: parent.id,
  });

  e.publie = true;
  e.publieLe = new Date().toISOString();
  e.urlInstagram = `https://www.instagram.com/p/${publie.id}/`;
  fs.writeFileSync(JOURNAL, JSON.stringify(entrees, null, 2) + '\n', 'utf8');

  console.log(`✅ Publié — média ${publie.id}`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
