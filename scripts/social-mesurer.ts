/**
 * social-mesurer.ts — Note ce que chaque publication a donné.
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * Cinq publications sont parties en septembre 2026 sans que personne sache
 * laquelle avait marché. On écrivait la sixième à l'aveugle. Ici, chaque
 * mercredi, on demande à Instagram les chiffres des dernières publications et
 * on les range dans le journal, à côté de la publication. Le générateur les
 * relit : il voit quels sujets ont été envoyés et sauvegardés.
 *
 * CE QU'ON MESURE, ET POURQUOI CES CHIFFRES-LÀ
 *
 * Les envois et les sauvegardes d'abord. Ce sont les deux gestes qui disent
 * « ça m'a servi », et les envois sont ce qui pousse une publication vers des
 * gens qui ne suivent pas le compte. Les mentions j'aime viennent après.
 *
 * IL NE BLOQUE JAMAIS RIEN
 *
 * Les mentions j'aime et les commentaires se lisent avec le jeton de base.
 * La portée, les envois et les sauvegardes demandent une permission de plus
 * (instagram_manage_insights) que le jeton n'a peut-être pas. Dans ce cas on
 * garde ce qu'on a pu lire et on le dit dans le journal de l'exécution. Le
 * script sort toujours en succès : une mesure ratée ne doit jamais faire
 * échouer une publication réussie.
 *
 *   npx tsx scripts/social-mesurer.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JOURNAL = path.resolve(__dirname, '..', 'public', 'social', 'journal.json');

// Meme version que social-publier.ts. Si l'une bouge, l'autre doit suivre.
const API = 'https://graph.facebook.com/v26.0';
const IG_USER_ID = process.env.IG_USER_ID;
const META_TOKEN = process.env.META_TOKEN;

/** Combien de publications on remesure a chaque passage. Les plus vieilles ne bougent plus. */
const COMBIEN = 8;

async function lire(chemin: string): Promise<any> {
  const lien = `${API}/${chemin}${chemin.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(META_TOKEN as string)}`;
  const r = await fetch(lien);
  const data = await r.json();
  if (!r.ok || data.error) throw new Error(data.error?.message || `Meta ${r.status}`);
  return data;
}

/** Deux adresses de la meme publication, a une barre oblique pres. */
const propre = (lien?: string) => String(lien || '').replace(/\/+$/, '').toLowerCase();

async function main() {
  if (!IG_USER_ID || !META_TOKEN) {
    console.log('IG_USER_ID ou META_TOKEN absent : aucune mesure.');
    return;
  }
  if (!fs.existsSync(JOURNAL)) return;
  const journal: any[] = JSON.parse(fs.readFileSync(JOURNAL, 'utf8'));

  const medias = (await lire(`${IG_USER_ID}/media?fields=id,permalink,like_count,comments_count&limit=30`)).data || [];
  const publiees = journal.filter((e) => e.publie && e.urlInstagram).slice(-COMBIEN);

  let mesurees = 0;
  let refus = '';
  for (const e of publiees) {
    const m = medias.find((x: any) => x.id === e.idInstagram || propre(x.permalink) === propre(e.urlInstagram));
    if (!m) continue;

    const mesures: Record<string, any> = {
      quand: new Date().toISOString().slice(0, 10),
      likes: m.like_count ?? 0,
      commentaires: m.comments_count ?? 0,
    };

    // La portee, les envois, les sauvegardes. Meta refuse la demande ENTIERE si
    // une seule mesure n'existe pas pour ce type de publication : on les
    // demande donc une a la fois, et on garde celles qui repondent.
    const noms: Record<string, string> = { reach: 'portee', saved: 'sauvegardes', shares: 'partages', views: 'vues' };
    for (const [metrique, nom] of Object.entries(noms)) {
      try {
        const r = await lire(`${m.id}/insights?metric=${metrique}`);
        const d = r.data?.[0];
        const valeur = d?.values?.[0]?.value ?? d?.total_value?.value;
        if (typeof valeur === 'number') mesures[nom] = valeur;
      } catch (err: any) {
        refus = err.message;
      }
    }

    e.idInstagram = m.id;
    e.mesures = mesures;
    mesurees++;
    console.log(
      `  ${e.date} « ${e.diapos?.[0]?.titre} » : ${mesures.likes} j'aime, ` +
        `${mesures.partages ?? '?'} envois, ${mesures.sauvegardes ?? '?'} sauvegardes, portée ${mesures.portee ?? '?'}`,
    );
  }

  if (refus) console.log(`  Certaines mesures ont été refusées par Meta : ${refus}`);
  if (mesurees) fs.writeFileSync(JOURNAL, JSON.stringify(journal, null, 2) + '\n', 'utf8');
  console.log(`${mesurees} publication(s) mesurée(s).`);
}

main().catch((e) => {
  // Jamais d'echec : voir l'en-tete.
  console.log(`Mesure impossible cette semaine : ${e.message}`);
});
