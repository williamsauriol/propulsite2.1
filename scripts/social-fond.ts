/**
 * social-fond.ts — Fabrique l'arriere-plan de la publication avec Gemini.
 *
 * POURQUOI UNE IMAGE GENEREE PLUTOT QU'UN FOND PLAT
 *
 * Le gabarit tenait sur un aplat #050a15 et un halo flou. C'est propre, mais
 * c'est plat : dans un fil rempli de photos de chantier, ca ne retient pas
 * l'oeil. Une vraie matiere photographiee derriere la typographie change tout,
 * pour environ 0,13 $ par publication.
 *
 * CE QUE L'IMAGE A LE DROIT DE MONTRER — ET SURTOUT PAS
 *
 * Une MATIERE, jamais une scene. Du beton, de l'acier, du bois scie, de
 * l'asphalte mouille. Jamais un chantier, jamais une equipe, jamais un projet
 * fini. Propulsite est jeune : une image generee qui laisse croire a une
 * realisation est un mensonge, et les gens du metier le voient tout de suite.
 * `personGeneration: ALLOW_NONE` verrouille l'absence de personnes cote API,
 * en plus de la consigne texte.
 *
 * SI GEMINI N'EST PAS LA
 *
 * Le script rend `null` et le gabarit reprend son fond plat. Une cle absente
 * ou un appel qui echoue ne doit jamais empecher la publication de la semaine
 * de partir.
 *
 * COUT : 0,134 $ US par image avec Nano Banana Pro, gratuit avec son petit
 * frere sur le palier gratuit. Une par semaine : moins de 0,55 $ US par mois.
 */
import { GoogleGenAI } from '@google/genai';

const CLE = process.env.GEMINI_API_KEY;

/**
 * Deux modeles, essayes dans l'ordre.
 *
 * Nano Banana Pro rend mieux les matieres, mais Google ne l'offre PAS sur le
 * palier gratuit de l'API : une cle creee dans AI Studio sans facturation
 * activee se fait refuser le modele, et le fond disparait sans que rien ne
 * rougisse. Son petit frere est disponible gratuitement (500 images par jour)
 * et fait tres bien le travail sur une texture abstraite.
 *
 * On demande donc le meilleur, et on retombe sur celui qui marche partout.
 */
const MODELES = ['gemini-3-pro-image-preview', 'gemini-2.5-flash-image'];

/**
 * Les matieres tournent dans cet ordre, pilotees par le nombre de
 * publications deja faites. Deterministe exprès : deux executions du meme
 * mercredi donnent la meme matiere, et on ne peut pas tomber trois fois de
 * suite sur le beton comme un tirage au hasard le ferait.
 */
const MATIERES = [
  'raw poured concrete with visible form-tie holes and cold joints',
  'brushed structural steel plate with weld seams',
  'rough-sawn spruce framing lumber, end grain',
  'wet asphalt at night',
  'galvanized corrugated metal sheeting',
  'cracked cured concrete slab with aggregate showing',
  'stacked grey concrete block',
  'oxidized weathering steel (corten) panel',
];

/**
 * L'invite est en anglais. Les modeles d'image sont entraines sur des legendes
 * trees majoritairement anglaises : la meme demande en francais donne un rendu
 * mesurablement plus mou. C'est le seul endroit du depot ou ca se justifie.
 */
function invite(matiere: string, angle: string): string {
  return [
    `Extreme close-up abstract texture photograph of ${matiere}.`,
    'Shot on a long lens, shallow depth of field, the surface fills the entire frame.',
    'Lighting: one hard cold cyan light (hex #00d2ff) rakes across the surface at a',
    'sharp angle from the upper left, catching every ridge, pit and grain of the',
    'material so the texture is unmistakable.',
    // Le gabarit pose un voile sombre par dessus pour garantir la lisibilite du
    // texte. Demander en plus une image sombre donnerait deux couches noires
    // l'une sur l'autre, et la matiere disparaitrait completement. Le contraste
    // se regle dans le CSS, pas dans l'invite : ici on demande une image
    // MOYENNEMENT exposee, qui a encore de la matiere a donner apres le voile.
    'Exposure is mid-tone and even — a medium grey overall, neither dark nor blown',
    'out. Heavily desaturated, almost monochrome except for the cyan highlights.',
    'Fine cinematic film grain.',
    'The composition is quiet and uniform, with no single bright hotspot and no',
    'large empty flat area: the texture is continuous edge to edge.',
    '',
    `Loose mood reference, do not illustrate it literally: ${angle}.`,
    '',
    'ABSOLUTELY NO text, letters, numbers, logos, watermarks or signatures.',
    'NO people, no hands, no tools, no machinery.',
    'NOT a construction site, NOT a finished building, NOT a room, NOT a project photo.',
    'Just the bare material surface, nothing else.',
  ].join('\n');
}

export interface Fond {
  /** Data URI pret a poser dans un `background-image`, ou null. */
  image: string | null;
  /**
   * Ce qui s'est passe, en clair. Recopie dans journal.json.
   *
   * Un fond absent ne casse rien et ne fait pas rougir l'execution : sans
   * cette note, il faut deplier le bon journal de la bonne execution pour
   * apprendre pourquoi l'image est plate. La raison doit vivre a cote du
   * resultat, pas dans un journal qui expire.
   */
  note: string;
}

/**
 * Peint la matiere de fond. N'echoue jamais : rend `image: null` et une note
 * qui dit pourquoi.
 */
export async function fabriquerFond(angle: string, rang: number): Promise<Fond> {
  if (!CLE) {
    console.log('  GEMINI_API_KEY absente — fond plat conserve.');
    return { image: null, note: 'GEMINI_API_KEY absente' };
  }

  const matiere = MATIERES[rang % MATIERES.length];
  console.log(`  Fond demande : ${matiere.split(',')[0]}`);

  const genai = new GoogleGenAI({ apiKey: CLE });
  const echecs: string[] = [];

  for (const modele of MODELES) {
    try {
      const reponse = await genai.models.generateContent({
        model: modele,
        contents: invite(matiere, angle),
        config: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            // 4:5 n'est pas propose par l'API. 3:4 est le plus proche, et le
            // `background-size: cover` du gabarit recadre la difference sans
            // deformer quoi que ce soit.
            aspectRatio: '3:4',
            // 1K fait 1024 px de large, soit un poil moins que les 1080 du
            // gabarit : l'image serait etiree. 2K coute le meme prix.
            imageSize: '2K',
            personGeneration: 'ALLOW_NONE',
          },
        },
      });

      const parties = reponse.candidates?.[0]?.content?.parts ?? [];
      const image = parties.find((p: any) => p.inlineData?.data);

      if (!image?.inlineData?.data) {
        // Gemini repond parfois du texte au lieu d'une image — un refus de
        // securite, le plus souvent. La raison vaut d'etre gardee : c'est elle
        // qui dit s'il faut adoucir l'invite.
        const raison = reponse.candidates?.[0]?.finishReason || 'sans raison donnee';
        echecs.push(`${modele} : aucune image (${raison})`);
        console.log(`  ${modele} n'a pas renvoye d'image (${raison})`);
        continue;
      }

      const type = image.inlineData.mimeType || 'image/png';
      console.log(`  Fond peint par ${modele}`);
      return {
        image: `data:${type};base64,${image.inlineData.data}`,
        note: `${modele} — ${matiere}`,
      };
    } catch (e: any) {
      const message = (e.message || String(e)).slice(0, 160);
      echecs.push(`${modele} : ${message}`);
      console.log(`  ${modele} a echoue (${message})`);
    }
  }

  // Un fond rate ne doit jamais couter la publication de la semaine.
  console.log("  Aucun modele n'a rendu de fond — fond plat conserve.");
  return { image: null, note: echecs.join(' | ') };
}
