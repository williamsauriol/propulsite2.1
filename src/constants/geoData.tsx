/**
 * Données de la page GEO.
 *
 * Séparées du composant pour une raison précise : ce sont des CHIFFRES, et un
 * chiffre sans source est une invention. La page vend un service ; si un
 * entrepreneur vérifie une seule statistique et qu'elle est fausse, tout le
 * reste tombe. Chaque donnée porte donc sa source, et la page les affiche.
 *
 * C'est aussi la technique que la page enseigne : l'étude de Princeton mesure
 * que les citations (+30 %), les statistiques (+32 %) et les citations directes
 * (+41 %) sont ce qui fait qu'une IA reprend un contenu. Une page sur le GEO
 * qui n'appliquerait pas le GEO serait sa propre contre-publicité.
 *
 * À REVALIDER : ces chiffres datent d'août 2026. Le domaine bouge vite —
 * revérifier les sources avant de réutiliser la page telle quelle dans un an.
 */

export interface Source {
  id: string;
  label: string;
  url: string;
}

export const SOURCES: Source[] = [
  {
    id: 'princeton',
    label: 'Aggarwal et coll., « GEO: Generative Engine Optimization », KDD 2024 (Princeton / IIT Delhi)',
    url: 'https://arxiv.org/abs/2311.09735',
  },
  {
    id: 'sparktoro',
    label: 'SparkToro — part des recherches Google sans clic, 2026',
    url: 'https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/',
  },
  {
    id: 'sel',
    label: 'Search Engine Land — zero-click et AI Overviews, 2026',
    url: 'https://searchengineland.com/google-zero-click-searches-2026-study-479717',
  },
  {
    id: 'omnibound',
    label: 'Omnibound — statistiques de citation par moteur génératif, 2026',
    url: 'https://www.omnibound.ai/blog/generative-engine-optimization-statistics',
  },
  {
    id: 'formative',
    label: 'Formative Digital — comment ChatGPT choisit les entreprises locales',
    url: 'https://formativedigital.com/research/chatgpt-google-maps-local-citations/',
  },
  {
    id: 'digitalapplied',
    label: 'Digital Applied — llms.txt : adoption et preuves, 2026',
    url: 'https://www.digitalapplied.com/blog/llms-txt-in-practice-adoption-evidence-2026',
  },
  {
    id: 'derivatex',
    label: 'Derivatex — données structurées et citations des IA',
    url: 'https://derivatex.agency/blog/schema-markup-llm-seo/',
  },
];

/** Les compteurs qui s'animent au défilement. */
export interface Chiffre {
  valeur: number;
  suffixe: string;
  prefixe?: string;
  titre: string;
  detail: string;
  source: string;
}

export const CHIFFRES: Chiffre[] = [
  {
    valeur: 68,
    suffixe: ' %',
    titre: 'des recherches Google ne mènent à aucun clic',
    detail:
      "L'internaute lit la réponse et referme. Le lien bleu qu'on a mis des mois à décrocher ne rapporte plus rien s'il n'est pas cité dans la réponse.",
    source: 'sparktoro',
  },
  {
    valeur: 20,
    prefixe: '+',
    suffixe: ' %',
    titre: 'des recherches affichent déjà une réponse écrite par une IA',
    detail:
      "Quand cette réponse apparaît, le taux de clic sur les résultats classiques chute d'environ 60 %.",
    source: 'sel',
  },
  {
    valeur: 20,
    prefixe: '< ',
    suffixe: ' %',
    titre: 'de recoupement entre le top Google et ce que l’IA cite',
    detail:
      "C'était 70 % il y a peu. Être premier sur Google ne garantit plus du tout d'être la réponse de l'IA : ce sont deux classements différents.",
    source: 'omnibound',
  },
  {
    valeur: 7,
    suffixe: ' %',
    titre: 'seulement des recherches LOCALES affichent une réponse IA',
    detail:
      "C'est la bonne nouvelle : chez les entrepreneurs, la vague n'est pas encore arrivée. Celui qui se prépare maintenant prend une avance que personne ne lui disputera avant un an ou deux.",
    source: 'sel',
  },
];

/** Taux de citation : à quelle fréquence chaque moteur nomme ses sources. */
export const MOTEURS = [
  {
    nom: 'Perplexity',
    taux: 97,
    note: 'Cite presque toujours ses sources. Le moteur le plus payant à travailler.',
  },
  {
    nom: 'Google AI Overviews',
    taux: 34,
    note: "Cite dans un tiers des cas, et s'appuie fortement sur les signaux locaux de Google.",
  },
  {
    nom: 'ChatGPT',
    taux: 16,
    note: "Cite rarement — mais c'est celui que vos clients utilisent le plus. Y être nommé vaut cher.",
  },
];

/** D'où une IA tire une recommandation d'entrepreneur local. */
export interface SourceIA {
  id: string;
  nom: string;
  poids: string;
  fait: string;
  action: string;
}

export const SOURCES_IA: SourceIA[] = [
  {
    id: 'bing',
    nom: 'Bing Places',
    poids: 'Le trou noir du Québec',
    fait: "ChatGPT ne consulte pas l'index de Google : il interroge celui de Bing. Presque aucun entrepreneur en construction au Québec n'a de fiche Bing vérifiée.",
    action: "Créer et vérifier la fiche Bing Places. C'est gratuit, ça prend vingt minutes, et c'est le geste le plus rentable de toute la liste.",
  },
  {
    id: 'foursquare',
    nom: 'Foursquare',
    poids: '~70 % des données locales',
    fait: "Foursquare alimente une grande partie des données d'entreprises locales que ChatGPT utilise pour ses recommandations. Personne ne le sait, tout le monde l'ignore.",
    action: 'Revendiquer la fiche, corriger l’adresse et la catégorie, ajouter le site web.',
  },
  {
    id: 'google',
    nom: 'Fiche Google',
    poids: 'La base de tout',
    fait: "Elle nourrit AI Overviews directement, et sert de référence de vérité quand les autres sources se contredisent.",
    action: 'Catégorie exacte, secteur desservi réel, horaires, photos de vrais chantiers, publications régulières.',
  },
  {
    id: 'avis',
    nom: 'Les avis',
    poids: '4,3 ★ en moyenne',
    fait: "Les entreprises que ChatGPT recommande tournent autour de 4,3 étoiles. Sous une certaine masse d'avis, une entreprise n'est pas classée plus bas : elle est simplement écartée.",
    action: 'Demander un avis après chaque chantier livré, et répondre à tous — même aux bons.',
  },
  {
    id: 'nap',
    nom: 'Vos coordonnées',
    poids: 'Zéro tolérance',
    fait: "Un seul numéro de téléphone différent entre deux annuaires et la machine passe à une réponse plus sûre. Elle ne devine pas : elle évite.",
    action: 'Même nom, même adresse, même numéro, partout, au caractère près.',
  },
  {
    id: 'site',
    nom: 'Votre site web',
    poids: '71 % ont du schema',
    fait: "Environ 71 % des pages citées par ChatGPT contiennent des données structurées. Ce n'est pas ce qui décide, mais c'est ce qui permet à la machine de comprendre qui vous êtes.",
    action: "Une page par service, une page par ville, des réponses directes aux vraies questions, et du schema sur chaque page.",
  },
];

/** Les leviers, dans l'ordre où ils rapportent. */
export interface Levier {
  numero: string;
  titre: string;
  promesse: string;
  pourquoi: string;
  gestes: string[];
  preuve?: string;
}

export const LEVIERS: Levier[] = [
  {
    numero: '01',
    titre: 'Répondre à la question, pas la contourner',
    promesse: 'Le levier le plus fort, et le plus ignoré.',
    pourquoi:
      "Une IA cherche un passage qui répond directement. « Combien coûte une toiture à Saint-Eustache ? » doit trouver, sur votre site, un paragraphe qui commence par un prix et une fourchette. Un texte qui tourne autour pendant six lignes avant de dire « ça dépend » n'est jamais repris.",
    gestes: [
      'Écrire le titre sous forme de question réelle, celle que le client tape.',
      'Donner la réponse dans les deux premières phrases, avant tout argumentaire.',
      'Un sujet = une page. Une page fourre-tout ne se fait citer sur rien.',
    ],
  },
  {
    numero: '02',
    titre: 'Des chiffres, des sources, des citations',
    promesse: '+41 % de citations mesurés en laboratoire.',
    pourquoi:
      "C'est le résultat le plus solide de la recherche sur le sujet : l'étude de Princeton a mesuré qu'ajouter des citations directes fait grimper la visibilité d'un contenu de 41 %, les statistiques de 32 % et les références de 30 %. Une IA préfère reprendre ce qui est vérifiable.",
    gestes: [
      'Remplacer « beaucoup de clients » par un nombre.',
      'Citer la source de chaque chiffre, avec le lien.',
      'Dater les affirmations : une IA se méfie de ce qui n’a pas d’époque.',
    ],
    preuve: 'princeton',
  },
  {
    numero: '03',
    titre: 'Exister dans l’index que la machine consulte',
    promesse: "ChatGPT lit Bing. Pas Google.",
    pourquoi:
      "C'est l'erreur la plus coûteuse et la plus facile à corriger. Un entrepreneur peut être premier sur Google Maps et totalement inconnu de ChatGPT, simplement parce qu'il n'a jamais créé de fiche Bing Places ni revendiqué son profil Foursquare.",
    gestes: [
      'Fiche Bing Places créée et vérifiée.',
      'Profil Foursquare revendiqué et corrigé.',
      'Apple Business Connect pour les recherches faites depuis un iPhone.',
    ],
    preuve: 'formative',
  },
  {
    numero: '04',
    titre: 'La même identité partout, au caractère près',
    promesse: 'Une virgule de différence suffit à vous faire sauter.',
    pourquoi:
      "Les modèles recoupent. Quand le nom, l'adresse ou le numéro divergent d'un annuaire à l'autre, la machine ne tranche pas : elle recommande quelqu'un d'autre. C'est un travail ingrat, sans gloire, et c'est ce qui sépare ceux qui sont cités de ceux qui ne le sont pas.",
    gestes: [
      'Lister tous les endroits où votre entreprise apparaît.',
      'Uniformiser le nom légal, l’adresse et le numéro.',
      'Supprimer les fiches en double laissées par un ancien fournisseur.',
    ],
  },
  {
    numero: '05',
    titre: 'Les avis, mais lus par une machine',
    promesse: 'Sous un certain seuil, vous n’êtes pas classé — vous êtes exclu.',
    pourquoi:
      "Les entreprises recommandées par ChatGPT tournent autour de 4,3 étoiles. Le volume compte autant que la note, et le taux de réponse aux avis est lui aussi lu comme un signal : une entreprise qui ne répond jamais ressemble à une entreprise qui n'existe plus.",
    gestes: [
      'Un avis demandé après chaque chantier livré, systématiquement.',
      'Une réponse à chaque avis, y compris les cinq étoiles.',
      'Des avis qui nomment le service et la ville — l’IA y lit votre spécialité.',
    ],
    preuve: 'formative',
  },
  {
    numero: '06',
    titre: 'Ce que les AUTRES disent de vous',
    promesse: 'Le plafond réel de tout le reste.',
    pourquoi:
      "Une IA fait davantage confiance à ce qu'elle lit ailleurs qu'à ce que vous écrivez sur votre propre site. Sans une seule mention externe — un annuaire sérieux, une association, un journal local, un fournisseur qui vous liste — le meilleur site du monde reste une source isolée.",
    gestes: [
      'Association de votre métier, chambre de commerce, RBQ.',
      'Fournisseurs et manufacturiers qui listent leurs installateurs.',
      'Journal local, projet marquant, commandite : tout ce qui laisse une trace ailleurs.',
    ],
  },
  {
    numero: '07',
    titre: 'Les données structurées',
    promesse: 'La traduction de votre site en langage machine.',
    pourquoi:
      "Environ 71 % des pages citées par ChatGPT et 65 % de celles citées par Google en contiennent. Ce n'est pas le schema qui vous fait choisir — c'est lui qui permet à la machine de savoir que vous êtes un couvreur de Saint-Eustache et non un blogue sur les toitures.",
    gestes: [
      'LocalBusiness avec le secteur réellement desservi.',
      'Service pour chaque prestation, FAQPage pour chaque page de questions.',
      'Cohérence entre le schema et ce qui est écrit à l’écran.',
    ],
    preuve: 'derivatex',
  },
];

/** Ce qu'on entend partout et qui est faux. */
export const MYTHES = [
  {
    mythe: '« Il faut un fichier llms.txt. »',
    verite:
      "Google a confirmé en juin 2026 que llms.txt n'a aucun effet — ni positif ni négatif — sur Search ni sur AI Overviews. Aucun grand fournisseur d'IA n'a confirmé s'en servir en production. Seuls 2 % des sites en ont un, et ce n'est pas ce qui les fait citer. Le poser ne coûte rien ; compter dessus coûte cher.",
    source: 'digitalapplied',
  },
  {
    mythe: '« Le SEO est mort. »',
    verite:
      "Faux, et dangereux pour un entrepreneur. Les recherches locales restent parmi les plus résistantes : seulement 7 % d'entre elles affichent une réponse IA. Le GEO se construit PAR-DESSUS un référencement sain — pas à sa place. Un site que Google n'explore pas, aucune IA ne le lira non plus.",
    source: 'sel',
  },
  {
    mythe: '« Il faut payer pour être dans ChatGPT. »',
    verite:
      "Il n'existe aucun espace publicitaire pour être recommandé dans une réponse générative. On ne s'y achète pas une place : on la mérite par la cohérence des données, les avis et les mentions externes. C'est précisément ce qui rend l'avance difficile à rattraper.",
  },
];

/** Les familles du diagnostic, dans l’ordre ou elles pesent. */
export const FAMILLES = [
  { id: 'index', titre: 'Les index que l’IA consulte' },
  { id: 'autorite', titre: 'Autorité et contenu' },
  { id: 'reputation', titre: 'Réputation' },
  { id: 'coherence', titre: 'Cohérence de l’identité' },
];

export interface Question {
  id: string;
  famille: string;
  texte: string;
  points: number;
  indice: string;
  /**
   * Ce qu'il faut faire quand la reponse est non. C'est ce que le rapport
   * renvoie au visiteur, et ce que William recoit par courriel.
   */
  action: string;
}

export const QUESTIONS: Question[] = [
  // ── Les index que l’IA consulte ──
  {
    id: 'gbp', famille: 'index', points: 10,
    texte: 'Ma fiche Google est vérifiée, avec la bonne catégorie et le bon secteur desservi.',
    indice: 'La base de tout. Sans elle, rien ne tient.',
    action: 'Créer ou revendiquer la fiche Google Business, choisir la catégorie exacte du métier et déclarer le secteur réellement desservi.',
  },
  {
    id: 'bing', famille: 'index', points: 9,
    texte: 'J’ai une fiche Bing Places vérifiée.',
    indice: 'C’est l’index que ChatGPT interroge, pas celui de Google.',
    action: 'Créer la fiche Bing Places et la faire vérifier. Gratuit, vingt minutes, et c’est le geste au meilleur rendement de toute la liste.',
  },
  {
    id: 'foursquare', famille: 'index', points: 5,
    texte: 'Mon profil Foursquare est revendiqué et à jour.',
    indice: 'Foursquare alimente une grande partie des données locales de ChatGPT.',
    action: 'Revendiquer le profil Foursquare, corriger l’adresse et la catégorie, ajouter le site web.',
  },
  {
    id: 'apple', famille: 'index', points: 4,
    texte: 'Je suis inscrit sur Apple Business Connect.',
    indice: 'C’est ce que voit un client qui cherche depuis un iPhone.',
    action: 'Créer la fiche Apple Business Connect — gratuit, et la moitié des téléphones au Québec sont des iPhone.',
  },

  // ── Autorite et contenu ──
  {
    id: 'mentions', famille: 'autorite', points: 10,
    texte: 'On parle de mon entreprise ailleurs que sur mon propre site.',
    indice: 'Le plafond réel de tout le reste.',
    action: 'Obtenir cinq mentions réelles : association de métier, chambre de commerce, RBQ, fournisseur qui liste ses installateurs, journal local.',
  },
  {
    id: 'page-service', famille: 'autorite', points: 6,
    texte: 'Mon site a une page distincte par service.',
    indice: 'Une page fourre-tout ne se fait citer sur rien.',
    action: 'Créer une page par service, avec son propre titre et ses propres questions.',
  },
  {
    id: 'page-ville', famille: 'autorite', points: 5,
    texte: 'Mon site a une page par ville réellement desservie.',
    indice: 'Attention : dupliquer la même page en changeant le nom de ville est pénalisé.',
    action: 'Créer une page par secteur, avec un contenu propre à chaque marché — jamais un copier-coller avec le nom de ville changé.',
  },
  {
    id: 'reponses', famille: 'autorite', points: 5,
    texte: 'Mes pages répondent à de vraies questions de clients, dès la première phrase.',
    indice: 'C’est le passage que l’IA reprend mot pour mot.',
    action: 'Réécrire les titres sous forme de question réelle, et donner la réponse dans les deux premières phrases.',
  },
  {
    id: 'schema', famille: 'autorite', points: 4,
    texte: 'Mes pages contiennent des données structurées (schema).',
    indice: '71 % des pages citées par ChatGPT en contiennent.',
    action: 'Ajouter LocalBusiness avec le secteur desservi, Service par prestation, FAQPage sur les pages de questions.',
  },

  // ── Reputation ──
  {
    id: 'avis-volume', famille: 'reputation', points: 8,
    texte: 'J’ai plus de 50 avis Google.',
    indice: 'Sous un certain volume, une entreprise n’est pas classée plus bas : elle est écartée.',
    action: 'Demander un avis après chaque chantier livré, systématiquement, avec un lien direct envoyé par texto.',
  },
  {
    id: 'avis-note', famille: 'reputation', points: 6,
    texte: 'Ma note moyenne dépasse 4,2 étoiles.',
    indice: 'Les entreprises recommandées par ChatGPT tournent autour de 4,3.',
    action: 'Traiter les avis négatifs un par un, et augmenter le volume : c’est le volume qui relève la moyenne.',
  },
  {
    id: 'avis-reponse', famille: 'reputation', points: 8,
    texte: 'Je réponds à tous mes avis, même les cinq étoiles.',
    indice: 'Le taux de réponse est lu comme un signal à part entière.',
    action: 'Répondre à chaque avis dans la semaine. Une entreprise qui ne répond jamais ressemble à une entreprise qui n’existe plus.',
  },

  // ── Coherence de l’identite ──
  {
    id: 'nap', famille: 'coherence', points: 8,
    texte: 'Mon nom, mon adresse et mon numéro sont identiques partout, au caractère près.',
    indice: 'Une seule divergence et la machine passe à une réponse plus sûre.',
    action: 'Lister tous les endroits où l’entreprise apparaît et uniformiser le nom légal, l’adresse et le numéro.',
  },
  {
    id: 'villes', famille: 'coherence', points: 8,
    texte: 'Mon site nomme les villes que je dessers vraiment.',
    indice: 'L’IA a besoin de savoir où vous vous déplacez, pas seulement où vous êtes.',
    action: 'Écrire la liste des villes desservies sur le site et la répliquer dans le schema (areaServed).',
  },
  {
    id: 'doublons', famille: 'coherence', points: 4,
    texte: 'Aucune fiche en double ne traîne d’un ancien fournisseur.',
    indice: 'Deux fiches pour la même entreprise, c’est deux entreprises pour une machine.',
    action: 'Chercher le nom de l’entreprise sur Google, Bing et Yelp, et faire fermer les fiches en double.',
  },
];

export const VERDICTS = [
  {
    min: 80,
    titre: 'Vous êtes déjà dans la course',
    texte: "Rare. Il vous reste surtout à surveiller ce que l'IA dit de vous et à tenir la cadence sur les avis et les mentions externes.",
  },
  {
    min: 50,
    titre: 'La base est là, le dessus manque',
    texte: "Votre référencement classique tient. Ce qui manque, ce sont les index que Google ne couvre pas — Bing, Foursquare — et les mentions ailleurs que chez vous.",
  },
  {
    min: 25,
    titre: 'Vous êtes visible pour Google, invisible pour l’IA',
    texte: "Le cas le plus fréquent, et le plus facile à corriger : la plupart des points manquants se règlent en quelques heures, pas en quelques mois.",
  },
  {
    min: 0,
    titre: 'Pour une IA, votre entreprise n’existe pas',
    texte: "Ce n'est pas une insulte, c'est la situation de presque tous les entrepreneurs du Québec en ce moment. C'est exactement pour ça que la fenêtre est ouverte.",
  },
];

export const FAQ = [
  {
    q: "C'est quoi le GEO, en une phrase ?",
    a: "Le GEO (Generative Engine Optimization) est le travail qui fait que ChatGPT, Gemini, Perplexity et l'IA de Google nomment votre entreprise quand quelqu'un leur demande un entrepreneur dans votre région.",
  },
  {
    q: 'Quelle est la différence avec le SEO ?',
    a: "Le SEO vise une position dans une liste de liens. Le GEO vise d'être la réponse elle-même. Les deux se recoupent de moins en moins : le recoupement entre le top Google et les sources citées par l'IA est passé de 70 % à moins de 20 %.",
  },
  {
    q: 'Est-ce que ça vaut la peine pour un entrepreneur en construction au Québec ?',
    a: "Aujourd'hui, seulement 7 % des recherches locales affichent une réponse générée par IA — donc le volume est encore faible. Mais c'est précisément ce qui rend l'investissement intéressant : le travail se fait une fois, il coûte peu, et personne dans votre secteur ne l'a fait. Dans deux ans, ce sera un rattrapage.",
  },
  {
    q: 'Combien de temps avant de voir un résultat ?',
    a: "Les gestes d'index — Bing Places, Foursquare, cohérence des coordonnées — se répercutent en quelques semaines. Les mentions externes et les avis prennent des mois. C'est un travail de fond, pas une campagne.",
  },
  {
    q: 'Est-ce qu’on peut payer pour être recommandé par ChatGPT ?',
    a: "Non. Il n'existe aucun espace publicitaire dans une réponse générative. On y entre par la cohérence des données, les avis et ce que les autres sites disent de vous.",
  },
  {
    q: 'Le SEO devient-il inutile ?',
    a: "Au contraire : le GEO se construit par-dessus. Un site que Google n'explore pas ne sera lu par aucune IA non plus. On ne remplace pas le référencement, on ajoute une couche.",
  },
];
