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
 * COUT : gemini-3-pro-image-preview, 0,134 $ US par image en 1K/2K.
 * Une par semaine = environ 0,55 $ US par mois.
 */
import { GoogleGenAI } from '@google/genai';

const CLE = process.env.GEMINI_API_KEY;

// Nano Banana Pro. Son petit frere (gemini-2.5-flash-image) coute 3,4 fois
// moins cher, mais sur une image par semaine l'ecart est de 40 cents par mois
// et le rendu des matieres est nettement meilleur ici.
const MODELE = 'gemini-3-pro-image-preview';

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

/**
 * Rend une image de fond en « data URI », prete a poser dans un
 * `background-image` CSS. Rend `null` si la cle manque ou si l'appel echoue.
 */
export async function fabriquerFond(
  angle: string,
  rang: number,
): Promise<string | null> {
  if (!CLE) {
    console.log('  GEMINI_API_KEY absente — fond plat conserve.');
    return null;
  }

  const matiere = MATIERES[rang % MATIERES.length];
  console.log(`  Fond : ${matiere.split(',')[0]}`);

  try {
    const genai = new GoogleGenAI({ apiKey: CLE });
    const reponse = await genai.models.generateContent({
      model: MODELE,
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
      console.log('  Gemini n\'a pas renvoye d\'image — fond plat conserve.');
      return null;
    }

    const type = image.inlineData.mimeType || 'image/png';
    return `data:${type};base64,${image.inlineData.data}`;
  } catch (e: any) {
    // Un fond rate ne doit jamais couter la publication de la semaine.
    console.log(`  Gemini a echoue (${e.message?.slice(0, 120)}) — fond plat conserve.`);
    return null;
  }
}
