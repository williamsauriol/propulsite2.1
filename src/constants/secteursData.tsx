/**
 * Pages de secteur desservi.
 *
 * ÉCRIRE À L'ENTREPRENEUR, JAMAIS AU PROPRIÉTAIRE. Mesuré dans Search
 * Console : cette page génère 543 impressions — 39 % de tout le site — sur
 * « couvreur saint-eustache », « entrepreneur général saint-eustache » et
 * leurs variantes. Ce sont des propriétaires qui veulent ENGAGER un
 * entrepreneur, pas des entrepreneurs qui cherchent du marketing. Zéro clic,
 * et c'est tant mieux : ces gens-là n'ont rien à faire ici.
 *
 * La cause était un paragraphe écrit du point de vue du client final — « un
 * propriétaire qui cherche un couvreur ». Le nom de métier accolé au nom de
 * ville, sur une page de secteur, suffit à faire basculer la lecture que
 * Google fait de la page. On s'adresse donc au lecteur à la deuxième
 * personne : « vos clients », « votre métier », jamais « un propriétaire qui
 * cherche un couvreur ».
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
      "Vous êtes entrepreneur en construction sur la Rive-Nord et vous voulez plus d'appels ? C'est ce qu'on fait : site web, fiche Google et publicité locale pour les entrepreneurs de Saint-Eustache, Deux-Montagnes, Boisbriand, Blainville, Mirabel et Laval.",
    contexte: {
      titre: 'Pourquoi le local change tout ici',
      paragraphes: [
        "La Rive-Nord n'est pas un seul marché, c'est une dizaine de petites villes collées les unes sur les autres. Vos clients ne cherchent jamais à l'échelle de la province : ils tapent votre métier suivi du nom de LEUR ville, et Google leur répond avec une carte de trois entreprises situées à quelques kilomètres. Votre travail, c'est d'être une des trois.",
        "C'est ce qui rend le référencement local si décisif pour vous. Vous n'êtes pas en compétition avec toute la province — vous l'êtes avec les six autres entrepreneurs de votre coin. Et celui qui gagne, ce n'est pas toujours le meilleur sur le chantier : c'est celui que Google montre en premier.",
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
