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

/** Un essai de recherche. Rend les photos brutes, ou une liste vide. */
async function chercher(motCle: string, large: boolean, combien: number): Promise<any[]> {
  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(motCle)}` +
    `&orientation=portrait${large ? '&size=large' : ''}` +
    `&per_page=${Math.max(combien * 3, 15)}`;
  const r = await fetch(url, { headers: { Authorization: CLE as string } });
  if (!r.ok) {
    console.log(`  Pexels ${r.status} : ${(await r.text()).slice(0, 120)}`);
    return [];
  }
  return (await r.json()).photos || [];
}

/**
 * Cinq photos differentes, en elargissant la recherche jusqu'a trouver.
 *
 * `orientation=portrait` n'est pas negociable : une photo paysage recadree en
 * 1080 x 1350 perd les deux tiers de son sujet, et ca se voit. Le reste, si.
 *
 * Le modele produit parfois un mot-cle trop pointu pour une banque d'images —
 * « empty construction site dusk » n'a rendu aucune photo portrait. Plutot que
 * d'abandonner et de payer Gemini, on relache une contrainte a la fois :
 * d'abord la taille, puis les mots en trop, puis on retombe sur une matiere
 * generique. Une recherche trop precise ne doit pas couter 0,67 $.
 */
async function pexels(motCle: string, combien: number, rang: number): Promise<Photo[] | null> {
  if (!CLE) return null;
  try {
    const mots = motCle.trim().split(/\s+/);
    const essais: { q: string; large: boolean }[] = [
      { q: motCle, large: true },
      { q: motCle, large: false },
      // Les deux premiers mots portent presque toujours le sujet.
      ...(mots.length > 2 ? [{ q: mots.slice(0, 2).join(' '), large: false }] : []),
      { q: 'concrete texture', large: false },
    ];

    let photos: any[] = [];
    let retenu = motCle;
    for (const essai of essais) {
      photos = await chercher(essai.q, essai.large, combien);
      if (photos.length) {
        retenu = essai.q;
        if (essai.q !== motCle) {
          console.log(`  « ${motCle} » n'a rien donne — replie sur « ${essai.q} »`);
        }
        break;
      }
    }
    if (!photos.length) {
      console.log(`  Pexels n'a rien, meme apres avoir elargi.`);
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
        note: `Pexels « ${retenu} » — ${p.photographer || 'inconnu'}`,
      });
    }
    return choisies.length ? choisies : null;
  } catch (e: any) {
    console.log(`  Pexels a echoue (${(e.message || e).toString().slice(0, 120)})`);
    return null;
  }
}

/**
 * Trouve `combien` vraies photos.
 *
 * Rend toujours un objet, jamais `null` tout sec : quand aucune source ne
 * repond, `photos` est nul et `note` dit POURQUOI. Sans cette note, une
 * publication qui retombe sur l'image generee n'a l'air de rien — l'execution
 * reste verte — et il faut deplier le bon journal de la bonne execution pour
 * comprendre. C'est exactement l'angle mort qui a coute trois allers-retours
 * du cote de Gemini.
 */
export async function vraiesPhotos(
  motCle: string,
  combien: number,
  rang: number,
): Promise<{ photos: Photo[] | null; note: string }> {
  const miennes = mesPhotos(combien, rang);
  if (miennes) {
    console.log(`  Fond : ${miennes.length} photo(s) du dossier public/social/photos`);
    return { photos: miennes, note: miennes[0].note };
  }

  if (!CLE) {
    console.log("  PEXELS_API_KEY absente — on passe a l'image generee.");
    return { photos: null, note: 'PEXELS_API_KEY absente' };
  }

  const trouvees = await pexels(motCle, combien, rang);
  if (trouvees) {
    console.log(`  Fond : ${trouvees.length} photo(s) Pexels pour « ${motCle} »`);
    return { photos: trouvees, note: trouvees[0].note };
  }

  return { photos: null, note: `Pexels n'a rien rendu pour « ${motCle} »` };
}
