/**
 * meta-jetons.ts — Transforme le jeton temporaire de l'Explorateur en jeton
 * de Page permanent, et trouve l'identifiant du compte Instagram.
 *
 * POURQUOI CET OUTIL EXISTE
 *
 * Le jeton que l'Explorateur d'API Graph affiche meurt en une a deux heures.
 * Celui d'un utilisateur de longue duree meurt en 60 jours. Le seul qui ne
 * meurt pas est le jeton de PAGE derive d'un jeton utilisateur de longue
 * duree — et l'obtenir demande trois appels dans le bon ordre. Les faire a la
 * main dans un navigateur est la facon la plus fiable de se tromper.
 *
 * CE QU'IL FAIT
 *
 *   1. Echange le jeton court contre un jeton utilisateur de longue duree.
 *   2. Demande la liste des Pages, qui porte le jeton de Page.
 *   3. Demande a la Page l'identifiant du compte Instagram qui lui est relie.
 *   4. Verifie aupres de Meta que le jeton de Page n'a bien AUCUNE expiration.
 *
 * LE JETON N'EST JAMAIS AFFICHE A L'ECRAN
 *
 * Il est ecrit dans `.meta-token.txt`, ignore par git. L'ecran ne montre que
 * l'identifiant et le nom du compte — de quoi verifier qu'on vise bien
 * @propulsite_ avant de publier quoi que ce soit.
 *
 * ON PASSE PAR UN FICHIER, PAS PAR LE TERMINAL
 *
 * Un jeton Meta fait environ 400 caracteres. Colle dans une invite `Read-Host`
 * de la console Windows, une chaine pareille deborde et se retrouve ecrite
 * par-dessus la commande suivante — ce qui echoue de facon incomprehensible.
 * Les deux valeurs se posent donc dans `.env`, ou coller est fiable.
 *
 *   .env :
 *     META_APP_SECRET=...    (Parametres de l'app > De base)
 *     META_TOKEN_COURT=...   (celui de l'Explorateur)
 *
 *   npx tsx scripts/meta-jetons.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(__dirname, '..');
const DESTINATION = path.join(RACINE, '.meta-token.txt');

// Meme version que social-publier.ts. Si l'une bouge, l'autre doit suivre.
const API = 'https://graph.facebook.com/v26.0';

// L'ID d'app n'est pas un secret : il est dans l'URL de la console.
// Un copier-coller traine presque toujours une espace ou des guillemets.
// Les enlever ici evite une erreur « jeton invalide » qui n'a rien a voir.
const propre = (v?: string) => (v || '').trim().replace(/^["']|["']$/g, '');

/**
 * Deux sources possibles, dans cet ordre : un petit fichier ecrit directement
 * depuis le presse-papier, sinon `.env`.
 *
 * Le fichier existe parce que le Bloc-notes de Windows sauvegarde mal les
 * fichiers dont le nom commence par un point — la valeur collee disparait sans
 * message d'erreur. `Get-Clipboard | Out-File` ne peut pas rater : rien n'est
 * tape a la main, donc rien ne peut etre tronque.
 */
function valeur(nomVariable: string, fichier: string): string {
  const chemin = path.join(RACINE, fichier);
  if (fs.existsSync(chemin)) {
    const contenu = propre(fs.readFileSync(chemin, 'utf8'));
    if (contenu) return contenu;
  }
  return propre(process.env[nomVariable]);
}

const APP_ID = propre(process.env.META_APP_ID) || '4415346892115258';
const APP_SECRET = valeur('META_APP_SECRET', '.meta-secret.txt');
const TOKEN_COURT = valeur('META_TOKEN_COURT', '.meta-court.txt');

async function appeler(chemin: string): Promise<any> {
  const r = await fetch(`${API}/${chemin}`);
  const data = await r.json();
  if (!r.ok || data.error) {
    throw new Error(`Meta ${r.status} : ${data.error?.message || JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  if (!TOKEN_COURT) {
    console.error('❌ Aucun jeton trouve dans .meta-court.txt.');
    process.exit(1);
  }

  // La cle secrete est OPTIONNELLE.
  //
  // Avec elle, on echange nous-memes le jeton court contre un jeton de longue
  // duree. Sans elle, on suppose que le jeton fourni a deja ete allonge par le
  // bouton « Etendre le token d'acces » de l'outil de debogage de Meta — ce qui
  // fait exactement le meme echange, cote Meta, sans que la cle secrete ait a
  // sortir de la console. Pour quelqu'un qui n'est pas a l'aise avec un
  // terminal, un bouton bat trois copier-coller.
  let jetonUtilisateur = TOKEN_COURT;

  if (APP_SECRET) {
    console.log('1/4  Echange du jeton court contre un jeton de longue duree...');
    const long = await appeler(
      `oauth/access_token?grant_type=fb_exchange_token` +
        `&client_id=${APP_ID}` +
        `&client_secret=${encodeURIComponent(APP_SECRET)}` +
        `&fb_exchange_token=${encodeURIComponent(TOKEN_COURT)}`,
    );
    jetonUtilisateur = long.access_token;
  } else {
    console.log('1/4  Pas de cle secrete — on utilise le jeton tel quel.');
  }

  const long = { access_token: jetonUtilisateur };

  console.log('2/4  Recherche de la Page...');
  const pages = await appeler(
    `me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(long.access_token)}`,
  );
  if (!pages.data?.length) {
    throw new Error(
      "Aucune Page n'est accessible. L'autorisation a probablement ete donnee " +
        'sans cocher la Page Propulsite — refaire Generate Access Token.',
    );
  }
  if (pages.data.length > 1) {
    console.log(`     ${pages.data.length} Pages trouvees, on prend la premiere :`);
  }
  const page = pages.data[0];
  console.log(`     Page : ${page.name} (${page.id})`);

  console.log('3/4  Recherche du compte Instagram relie...');
  const lien = await appeler(
    `${page.id}?fields=instagram_business_account{id,username}` +
      `&access_token=${encodeURIComponent(page.access_token)}`,
  );
  const ig = lien.instagram_business_account;
  if (!ig?.id) {
    throw new Error(
      "La Page n'a aucun compte Instagram professionnel relie. Refaire l'etape " +
        'de liaison dans Meta Business Suite, puis relancer.',
    );
  }

  console.log('4/4  Verification du jeton de Page...');
  const debug = await appeler(
    `debug_token?input_token=${encodeURIComponent(page.access_token)}` +
      `&access_token=${encodeURIComponent(long.access_token)}`,
  );
  const expire = debug.data?.expires_at;
  const sansExpiration = expire === 0 || expire === undefined;

  // `expires_at: 0` ne suffit PAS, et ca a coute une publication.
  //
  // Un jeton de Page « sans expiration » meurt quand meme si la SESSION dont
  // il descend se termine -- et rechiquer « Generate Access Token » dans
  // l'Explorateur termine la session precedente. Meta a alors repondu
  // « Session has expired », code 190 sous-code 463, sur un jeton que cet
  // outil venait de declarer permanent.
  //
  // On l'essaie donc pour de vrai : un appel de lecture sur le compte
  // Instagram vise. S'il passe, le jeton fonctionne maintenant.
  let vivant = false;
  let raisonMorte = '';
  try {
    const essai = await appeler(
      `${ig.id}?fields=username&access_token=${encodeURIComponent(page.access_token)}`,
    );
    vivant = essai?.username === ig.username;
  } catch (e: any) {
    raisonMorte = (e.message || String(e)).slice(0, 160);
  }

  const permanent = sansExpiration && vivant;

  fs.writeFileSync(DESTINATION, page.access_token + '\n', 'utf8');

  // On n'efface les entrees QUE si le jeton obtenu est permanent. Nettoyer
  // apres un resultat a moitie bon oblige a tout recopier depuis Meta pour
  // refaire l'essai — ce qui est arrive une fois, et une fois de trop.
  if (permanent) {
    for (const f of ['.meta-secret.txt', '.meta-court.txt']) {
      const chemin = path.join(RACINE, f);
      if (fs.existsSync(chemin)) fs.rmSync(chemin);
    }
  }

  console.log('');
  console.log('─────────────────────────────────────────────');
  console.log(`  Compte Instagram vise : @${ig.username}`);
  console.log(`  IG_USER_ID            : ${ig.id}`);
  console.log(`  Sans date d'expiration : ${sansExpiration ? 'oui' : `non — expire le ${new Date(expire * 1000).toISOString().slice(0, 10)}`}`);
  console.log(`  Fonctionne maintenant  : ${vivant ? 'oui' : `NON — ${raisonMorte}`}`);
  console.log(`  Verdict                : ${permanent ? 'utilisable ✅' : 'A NE PAS POSER ⚠️'}`);
  console.log('─────────────────────────────────────────────');
  console.log('');
  console.log(`Le jeton est dans ${path.basename(DESTINATION)} (ignore par git).`);
  console.log('Copie-le dans le secret META_TOKEN, puis supprime le fichier.');

  if (!permanent) {
    console.log('');
    console.log('⚠️  Le jeton porte une date d\'expiration : l\'echange de longue');
    console.log('   duree n\'a pas pris. Ne le pose pas tel quel — il lachera.');
  }
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
