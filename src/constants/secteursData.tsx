/**
 * Pages de secteur desservi.
 *
 * Attention au piège des « doorway pages » : dupliquer la même page en
 * changeant le nom de ville est explicitement pénalisé par Google. Chaque
 * entrée doit décrire une réalité locale propre — villes réellement
 * couvertes, contexte du marché, exemples de métiers du coin.
 *
 * Mieux vaut une seule page fouillée que dix pages creuses.
 */

export interface SecteurData {
  slug: string;
  region: string;
  villePrincipale: string;
  villes: string[];
  metaTitle: string;
  metaDescription: string;
  titrePart1: string;
  titreHighlight: string;
  intro: string;
  contexte: { titre: string; paragraphes: string[] };
  blocs: {
    titre: string;
    paragraphes?: string[];
    items?: { bold?: string; text: string }[];
  }[];
}

export const SECTEURS: SecteurData[] = [
  {
    slug: 'rive-nord-saint-eustache',
    region: 'Rive-Nord de Montréal',
    villePrincipale: 'Saint-Eustache',
    villes: [
      'Saint-Eustache',
      'Deux-Montagnes',
      'Boisbriand',
      'Sainte-Thérèse',
      'Blainville',
      'Rosemère',
      'Lorraine',
      'Mirabel',
      'Saint-Jérôme',
      'Laval',
    ],
    metaTitle: 'Site web entrepreneur construction Saint-Eustache',
    metaDescription:
      "Sites web et référencement local pour entrepreneurs en construction de Saint-Eustache, Deux-Montagnes, Boisbriand et Laval. Soumission gratuite.",
    titrePart1: 'Marketing web pour entrepreneurs de ',
    titreHighlight: 'Saint-Eustache et la Rive-Nord',
    intro:
      "On travaille avec les entrepreneurs en construction de la couronne nord : Saint-Eustache, Deux-Montagnes, Boisbriand, Blainville, Mirabel, Laval. Site web, fiche Google, publicité locale.",
    contexte: {
      titre: 'Pourquoi le local change tout ici',
      paragraphes: [
        "La Rive-Nord n'est pas un seul marché, c'est une dizaine de petites villes collées les unes sur les autres. Un propriétaire de Deux-Montagnes qui cherche un couvreur ne tape pas « couvreur Québec » : il tape « couvreur Deux-Montagnes », et Google lui répond avec une carte de trois entreprises situées à quelques kilomètres.",
        "C'est ce qui rend le référencement local si décisif dans le secteur. Vous n'êtes pas en compétition avec toute la province — vous êtes en compétition avec les six autres entrepreneurs de votre coin. Et celui qui gagne, ce n'est pas toujours le meilleur sur le chantier : c'est celui que Google montre en premier.",
        "La couronne nord a aussi son rythme : beaucoup de construction neuve à Mirabel et Blainville, beaucoup de rénovation dans les quartiers plus anciens de Saint-Eustache et de Sainte-Thérèse. Le message qui fonctionne n'est pas le même dans les deux cas.",
      ],
    },
    blocs: [
      {
        titre: 'Ce qu\'on met en place, concrètement',
        items: [
          {
            bold: 'Un site web pensé pour le téléphone :',
            text: " la majorité de vos visiteurs vous cherchent depuis un chantier ou un stationnement. Le numéro doit être cliquable sans avoir à défiler.",
          },
          {
            bold: 'Une fiche Google optimisée pour votre ville :',
            text: " catégories exactes, secteur desservi bien défini, photos de vos vrais chantiers, et une cadence de publication qui garde la fiche vivante.",
          },
          {
            bold: 'Des pages par service :',
            text: " une page « toiture », une page « revêtement », une page « agrandissement ». Une seule page fourre-tout ne se classe sur rien.",
          },
          {
            bold: 'De la publicité locale quand ça vaut la peine :',
            text: " Google Ads et Local Services Ads, ciblés sur votre rayon réel de déplacement — pas sur toute la région métropolitaine.",
          },
        ],
      },
      {
        titre: 'Les villes qu\'on couvre',
        paragraphes: [
          "On dessert l'ensemble de la couronne nord et le nord de Laval. Si votre municipalité n'est pas dans la liste mais que vous êtes dans le secteur, écrivez-nous quand même — on travaille aussi avec des entrepreneurs qui se déplacent sur un large territoire.",
        ],
      },
      {
        titre: 'Pourquoi nous',
        paragraphes: [
          "Propulsite a été fondée par quelqu'un qui a porté les bottes avant de toucher à un clavier. On ne vous demandera pas ce qu'est une membrane élastomère, et on ne vous vendra pas une refonte complète si votre fiche Google suffit à vous remplir l'été.",
          "On dit non quand c'est non. C'est plus rare qu'on pense, et c'est probablement la meilleure raison de nous appeler.",
        ],
      },
    ],
  },
];
