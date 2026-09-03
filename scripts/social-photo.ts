/**
 * social-photo.ts — Trouve de VRAIES photos pour le fond du carrousel.
 *
 * POURQUOI DE VRAIES PHOTOS AVANT DE L'IMAGE GENEREE
 *
 * Une matiere generee est propre, disponible et couteuse. Une vraie photo est
 * gratuite, et surtout elle est vraie : le fil d'un entrepreneur est fait de
 * photos, et l'oeil repere une image de synthese plus vite qu'on ne le croit.
 * L'IA reste la, mais en dernier recours.
 *
 * L'ORDRE, ET POURQUOI
 *
 *   1. `public/social/photos/` — les photos de William. Elles gagnent toujours :
 *      ce sont les seules qui montrent vraiment son travail.
 *   2. Pexels — de vraies photographies, gratuites, choisies selon le sujet de
 *      la semaine. Cinq images differentes d'une meme recherche, pour que le
 *      carrousel se tienne sans se repeter.
 *   3. Rien — l'appelant retombe alors sur Gemini (voir social-fond.ts).
 *
 * LA REGLE QUI NE SE NEGOCIE PAS
 *
 * Une photo de fond ne doit jamais laisser croire que c'est un chantier de
 * Propulsite, une equipe de Propulsite ou un projet livre par Propulsite.
 * L'entreprise est jeune ; un client du metier verrait le mensonge tout de
 * suite. Les recherches visent donc des matieres et des lieux vides, et la
 * consigne est repetee dans les REGLES du generateur, la ou le modele choisit
 * le mot-cle.
 *
 * COUT : zero. Pexels est gratuit, la cle aussi (pexels.com/api).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(__dirname, '..');
const MES_PHOTOS = path.join(RACINE, 'public', 'social', 'photos');

const CLE = process.env.PEXELS_API_KEY;

/** Ce que rend une source de fond : l'image prete a poser, et d'ou elle vient. */
export interface Photo {
  image: string;
  note: string;
}

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/** Lit une image du disque et la rend en data URI, prete pour le CSS. */
function lireLocale(fichier: string): string | null {
  const type = TYPES[path.extname(fichier).toLowerCase()];
  if (!type) return null;
  const octets = fs.readFileSync(fichier);
  return `data:${type};base64,${octets.toString('base64')}`;
}

/**
 * Les photos de William, s'il en a depose.
 *
 * On en prend autant que demande, en tournant sur le rang pour ne pas toujours
 * commencer par la meme, et on boucle si le dossier en contient moins que le
 * nombre de diapos.
 */
function mesPhotos(combien: number, rang: number): Photo[] | null {
  if (!fs.existsSync(MES_PHOTOS)) return null;
  const fichiers = fs
    .readdirSync(MES_PHOTOS)
    .filter((f) => TYPES[path.extname(f).toLowerCase()])
    .sort();
  if (fichiers.length === 0) return null;

  const choisies: Photo[] = [];
  for (let i = 0; i < combien; i++) {
    const nom = fichiers[(rang + i) % fichiers.length];
    const image = lireLocale(path.join(MES_PHOTOS, nom));
    if (image) choisies.push({ image, note: `photo de William — ${nom}` });
  }
  return choisies.length ? choisies : null;
}

/**
 * Cinq photos differentes d'une meme recherche Pexels.
 *
 * `orientation=portrait` n'est pas un detail : une photo paysage recadree en
 * 1080 x 1350 perd les deux tiers de son sujet, et ca se voit.
 */
async function pexels(motCle: string, combien: number, rang: number): Promise<Photo[] | null> {
  if (!CLE) return null;
  try {
    const url =
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(motCle)}` +
      `&orientation=portrait&size=large&per_page=${Math.max(combien * 3, 15)}`;
    const r = await fetch(url, { headers: { Authorization: CLE } });
    if (!r.ok) {
      console.log(`  Pexels ${r.status} — on passe a la suite.`);
      return null;
    }
    const data = await r.json();
    const photos: any[] = data.photos || [];
    if (photos.length === 0) {
      console.log(`  Pexels n'a rien pour « ${motCle} » — on passe a la suite.`);
      return null;
    }

    const choisies: Photo[] = [];
    for (let i = 0; i < combien; i++) {
      // Le rang decale le point de depart : deux semaines sur le meme mot-cle
      // ne donnent pas les memes photos.
      const p = photos[(rang + i) % photos.length];
      const lien = p.src?.portrait || p.src?.large || p.src?.original;
      if (!lien) continue;

      const img = await fetch(lien);
      if (!img.ok) continue;
      const octets = Buffer.from(await img.arrayBuffer());
      const type = img.headers.get('content-type') || 'image/jpeg';
      choisies.push({
        image: `data:${type};base64,${octets.toString('base64')}`,
        // Le nom du photographe est garde : Pexels ne l'exige pas, mais savoir
        // d'ou vient une image evite d'avoir a le redecouvrir plus tard.
        note: `Pexels « ${motCle} » — ${p.photographer || 'inconnu'}`,
      });
    }
    return choisies.length ? choisies : null;
  } catch (e: any) {
    console.log(`  Pexels a echoue (${(e.message || e).toString().slice(0, 120)})`);
    return null;
  }
}

/**
 * Trouve `combien` vraies photos. Rend `null` si aucune source n'a repondu —
 * l'appelant retombe alors sur l'image generee.
 */
export async function vraiesPhotos(
  motCle: string,
  combien: number,
  rang: number,
): Promise<Photo[] | null> {
  const miennes = mesPhotos(combien, rang);
  if (miennes) {
    console.log(`  Fond : ${miennes.length} photo(s) du dossier public/social/photos`);
    return miennes;
  }

  const trouvees = await pexels(motCle, combien, rang);
  if (trouvees) {
    console.log(`  Fond : ${trouvees.length} photo(s) Pexels pour « ${motCle} »`);
    return trouvees;
  }

  if (!CLE) console.log('  PEXELS_API_KEY absente — on passe a l\'image generee.');
  return null;
}
