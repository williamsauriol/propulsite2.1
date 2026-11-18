/**
 * social-facebook.ts — Publie le carrousel de la semaine sur la Page Facebook.
 *
 * POURQUOI
 *
 * Le même travail, un deuxième public, zéro coût de plus : les images sont
 * déjà rendues et servies par raw.githubusercontent, la légende est déjà
 * écrite. Sur Facebook, le lien est cliquable : on l'ajoute à la fin.
 *
 * LA PERMISSION QUI MANQUE (17 novembre 2026)
 *
 * Le jeton posé en septembre ne porte que les permissions d'Instagram. Publier
 * sur la Page demande `pages_manage_posts`. Tant qu'elle manque, Meta refuse
 * avec le code 200 et ce script le dit en une ligne, sans faire échouer la
 * semaine : Instagram part quand même. Il s'activera tout seul le jour où le
 * secret META_TOKEN sera remplacé par un jeton qui porte la permission (voir
 * docs/AUTOMATISER-INSTAGRAM.md).
 *
 * IL NE REPUBLIE JAMAIS UN VIEUX POST
 *
 * Seule une publication rendue dans les six derniers jours peut partir. Sans
 * cette limite, le premier passage aurait vidé sur la Page le post du
 * 30 septembre, et les suivants en rafale.
 *
 *   npx tsx scripts/social-facebook.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JOURNAL = path.resolve(__dirname, '..', 'public', 'social', 'journal.json');

// Meme version que social-publier.ts. Si l'une bouge, l'autre doit suivre.
const API = 'https://graph.facebook.com/v26.0';
const BASE_IMAGES = 'https://raw.githubusercontent.com/williamsauriol/propulsite2.1/main/public/social';
const META_TOKEN = process.env.META_TOKEN;
/** Facultatif. Sinon on demande a Meta a quelle Page appartient le jeton. */
const FB_PAGE_ID = process.env.FB_PAGE_ID;
const JOURS_MAX = 6;

interface Entree {
  date: string;
  images?: string[];
  legende: string;
  diapos: { titre: string; alt?: string }[];
  facebookId?: string;
  publieFacebookLe?: string;
}

class ErreurMeta extends Error {
  constructor(message: string, public code?: number) {
    super(message);
  }
}

async function meta(chemin: string, corps?: Record<string, string>): Promise<any> {
  const r = corps
    ? await fetch(`${API}/${chemin}`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ...corps, access_token: META_TOKEN as string }),
      })
    : await fetch(`${API}/${chemin}${chemin.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(META_TOKEN as string)}`);
  const data = await r.json();
  if (!r.ok || data.error) {
    throw new ErreurMeta(data.error?.message || `Meta ${r.status}`, data.error?.code);
  }
  return data;
}

async function main() {
  if (!META_TOKEN) {
    console.log('META_TOKEN absent : rien sur Facebook.');
    return;
  }
  if (!fs.existsSync(JOURNAL)) return;
  const journal: Entree[] = JSON.parse(fs.readFileSync(JOURNAL, 'utf8'));

  const limite = new Date(Date.now() - JOURS_MAX * 86400000).toISOString().slice(0, 10);
  const e = [...journal].reverse().find((x) => x.images?.length && !x.facebookId && x.date >= limite);
  if (!e) {
    console.log('Rien de récent à publier sur Facebook.');
    return;
  }
  console.log(`Facebook : « ${e.diapos[0].titre} » (${e.date})`);

  // Le jeton de Page repond a /me avec la Page elle-meme.
  const page = FB_PAGE_ID || (await meta('me?fields=id,name')).id;

  // 1. Chaque image est deposee sans etre publiee. Meta va la chercher a
  //    l'URL publique, comme pour Instagram.
  const ids: string[] = [];
  for (let i = 0; i < e.images!.length; i++) {
    const alt = e.diapos[i]?.alt;
    const photo = await meta(`${page}/photos`, {
      url: `${BASE_IMAGES}/${e.images![i]}`,
      published: 'false',
      ...(alt ? { alt_text_custom: alt } : {}),
    });
    ids.push(photo.id);
    console.log(`  image ${i + 1}/${e.images!.length} déposée`);
  }

  // 2. Une seule publication qui les rassemble, dans l'ordre du carrousel.
  const corps: Record<string, string> = {
    message: `${e.legende}\n\nPour en parler : propulsite.ca`,
  };
  ids.forEach((id, i) => {
    corps[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id });
  });
  const post = await meta(`${page}/feed`, corps);

  e.facebookId = post.id;
  e.publieFacebookLe = new Date().toISOString();
  fs.writeFileSync(JOURNAL, JSON.stringify(journal, null, 2) + '\n', 'utf8');
  console.log(`✅ Publié sur Facebook — https://www.facebook.com/${post.id}`);
}

main().catch((err: ErreurMeta) => {
  // 200 et 10 : permission refusee. C'est le cas attendu tant que le jeton
  // n'a pas `pages_manage_posts`. On le dit clairement, sans echouer.
  if (err.code === 200 || err.code === 10 || /pages_manage_posts|permission/i.test(err.message)) {
    console.log('⏸  Facebook refuse : le jeton n’a pas la permission pages_manage_posts.');
    console.log('   Instagram n’est pas touché. Voir docs/AUTOMATISER-INSTAGRAM.md.');
    return;
  }
  console.error('❌ Facebook :', err.message);
  process.exit(1);
});
