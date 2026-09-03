/**
 * social-publier.ts — Publie sur Instagram la dernière image en attente.
 *
 * L'API de publication d'Instagram se fait en deux temps : on crée un
 * « conteneur média » en lui donnant l'URL de l'image, puis on publie ce
 * conteneur. Elle ne prend jamais les octets de l'image — d'où l'obligation
 * d'un hébergement public, réglée en écrivant dans `public/social/` d'un dépôt
 * public.
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

interface Entree {
  slug: string; angle: string; accroche: string; lignes: string[];
  legende: string; hashtags: string[];
  date: string; image: string; publie: boolean;
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
  const enAttente = entrees.filter((e) => !e.publie);

  if (enAttente.length === 0) {
    console.log('Rien en attente de publication.');
    return;
  }
  // On ne publie que la plus récente. Si plusieurs se sont accumulées parce
  // que les jetons manquaient, publier tout d'un coup ferait trois posts à la
  // même minute — le meilleur moyen de se faire limiter par Instagram.
  const e = enAttente[enAttente.length - 1];
  console.log(`À publier : ${e.image} — « ${e.accroche} »`);

  if (!IG_USER_ID || !META_TOKEN) {
    console.log('');
    console.log('⏸  IG_USER_ID ou META_TOKEN absent : rien n\'est publié.');
    console.log('   L\'image reste dans public/social/ et repartira au prochain');
    console.log('   passage. Voir docs/AUTOMATISER-INSTAGRAM.md.');
    return;
  }

  const urlImage = `${BASE_IMAGES}/${e.image}`;
  console.log(`  URL : ${urlImage}`);
  if (!(await attendreImage(urlImage))) {
    throw new Error("L'image n'est pas servie publiquement — publication annulée.");
  }

  const legende = `${e.legende}\n\n.\n.\n${e.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`;

  const conteneur = await appeler(`${IG_USER_ID}/media`, {
    image_url: urlImage,
    caption: legende,
  });
  console.log(`  conteneur ${conteneur.id} créé`);

  // Meta a besoin d'un moment pour télécharger l'image avant de pouvoir publier.
  await new Promise((r) => setTimeout(r, 8000));

  const publie = await appeler(`${IG_USER_ID}/media_publish`, {
    creation_id: conteneur.id,
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
