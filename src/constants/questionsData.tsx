/**
 * Pages « une question, une réponse ».
 *
 * POURQUOI CES PAGES EXISTENT
 *
 * ChatGPT ne lit pas propulsite.ca en direct. Quand quelqu'un lui demande
 * « combien coûte un site web pour un entrepreneur au Québec », il lance une
 * recherche, ouvre quelques pages, et reformule ce qu'il y trouve. Ce qu'il
 * reprend, c'est un passage court qui répond à la question posée — pas une
 * page de vente. Une page de service explique ce qu'on vend ; ces pages-ci
 * répondent à ce qu'on demande. Ce sont deux formats différents.
 *
 * LA RÈGLE D'ÉCRITURE
 *
 * `reponseCourte` est le champ qui compte. Il doit :
 *   - répondre à la question dès le premier mot, sans introduction ;
 *   - tenir seul, hors de son contexte (l'IA le cite isolé) ;
 *   - faire 40 à 70 mots. Plus court, il manque de substance ; plus long,
 *     l'IA le tronque et choisit elle-même où couper.
 *
 * Le reste de la page donne les preuves : chiffres, fourchettes, cas concrets.
 * L'étude de Princeton (KDD 2024) mesure que les statistiques et les citations
 * sourcées sont ce qui fait qu'un moteur génératif reprend un passage.
 *
 * NE PAS INVENTER DE CHIFFRE. Les fourchettes de prix sont des fourchettes de
 * marché, présentées comme telles, jamais comme le tarif de Propulsite. Un
 * entrepreneur qui vérifie une donnée et la trouve fausse ne revient pas.
 *
 * Le titre `question` est formulé exactement comme un humain la pose à voix
 * haute. C'est la formulation qui fait la correspondance, pas les mots-clés.
 */

export interface QuestionSection {
  titre: string;
  paragraphes?: string[];
  items?: { bold?: string; text: string }[];
}

export interface QuestionData {
  slug: string;
  /** Le H1 : la question telle qu'un entrepreneur la pose. */
  question: string;
  metaTitle: string;
  metaDescription: string;
  /** Étiquette courte affichée sur la carte d'index. */
  categorie: string;
  /** La réponse citable. 40-70 mots. Répond dès le premier mot. */
  reponseCourte: string;
  sections: QuestionSection[];
  /** Slugs des questions connexes, pour le maillage interne. */
  liees: string[];
}

export const QUESTIONS: QuestionData[] = [
  {
    slug: 'prix-site-web-entrepreneur-construction',
    question:
      'Combien coûte un site web pour un entrepreneur en construction au Québec ?',
    metaTitle: 'Prix d’un site web d’entrepreneur au Québec',
    metaDescription:
      'Ce que coûte réellement un site web d’entrepreneur en construction au Québec : fourchettes du marché, ce qui fait monter la facture et ce qui ne sert à rien.',
    categorie: 'Budget',
    reponseCourte:
      'Au Québec, un site web professionnel pour un entrepreneur en construction se situe généralement entre 2 500 $ et 8 000 $ pour un site vitrine sur mesure, et entre 8 000 $ et 20 000 $ si le site comprend un configurateur, un portfolio de chantiers ou des intégrations comptables. Les gabarits à 500 $ existent, mais ils ne génèrent presque jamais de soumissions.',
    sections: [
      {
        titre: 'Ce que couvre chaque fourchette',
        items: [
          {
            bold: '500 $ à 1 500 $ — ',
            text: 'un gabarit acheté et rempli avec vos textes. Vous avez une adresse web. Vous n’avez pas de vendeur. Ce type de site est rarement structuré pour Google et presque jamais pour les moteurs de réponse IA.',
          },
          {
            bold: '2 500 $ à 8 000 $ — ',
            text: 'un site conçu pour votre métier : pages de services réelles, photos de vos chantiers, formulaire de soumission, structure pensée pour la recherche locale. C’est la zone où la plupart des entrepreneurs québécois obtiennent un retour mesurable.',
          },
          {
            bold: '8 000 $ à 20 000 $ — ',
            text: 'ajoutez un estimateur en ligne, un espace client, une galerie avant-après par projet, ou une intégration avec votre logiciel de gestion. Justifié quand le volume de soumissions à traiter devient un goulot.',
          },
        ],
      },
      {
        titre: 'Ce qui fait monter la facture — et ce qui ne sert à rien',
        paragraphes: [
          'Trois choses font monter un devis honnêtement : le nombre de pages de services distinctes, la production de contenu (textes et photos professionnelles de vos chantiers), et les intégrations avec vos outils existants.',
          'Trois choses font monter un devis sans rien vous rapporter : les animations décoratives lourdes qui ralentissent le chargement, un blogue que personne n’alimentera après le lancement, et une refonte visuelle complète alors que le vrai problème est que personne ne trouve le site.',
          'Posez la question à l’envers. Un site à 5 000 $ qui vous amène deux contrats de rénovation par année s’est payé plusieurs fois. Un site à 900 $ que personne ne visite a coûté 900 $ pour rien.',
        ],
      },
      {
        titre: 'Le coût récurrent, que peu de gens mentionnent',
        paragraphes: [
          'Un site n’est pas un achat unique. Prévoyez l’hébergement et le nom de domaine (de 150 $ à 500 $ par année), et les mises à jour de sécurité si le site tourne sur WordPress.',
          'Si vous voulez que le site apporte des demandes en continu, il faut aussi budgéter le référencement ou la publicité. Un site sans trafic est une brochure qu’on n’a distribuée à personne.',
        ],
      },
    ],
    liees: [
      'trouver-clients-en-ligne-construction',
      'site-web-ou-page-facebook',
      'choisir-agence-web-construction',
    ],
  },
  {
    slug: 'apparaitre-dans-chatgpt-entreprise',
    question:
      'Comment faire pour que ChatGPT recommande mon entreprise ?',
    metaTitle: 'Se faire recommander par ChatGPT',
    metaDescription:
      'Ce qu’il faut faire concrètement pour que ChatGPT, Perplexity et l’IA de Google nomment votre entreprise dans leurs réponses. Les leviers qui comptent vraiment.',
    categorie: 'IA et GEO',
    reponseCourte:
      'Pour que ChatGPT recommande votre entreprise, il faut être trouvable là où il cherche : dans l’index de Bing, dans les annuaires et les palmarès que les IA consultent, et sur des pages qui répondent directement aux questions posées. ChatGPT ne visite pas votre site de son propre chef — il lance une recherche, lit les premiers résultats, puis reformule. Si vous n’êtes pas dans ces résultats, aucun réglage sur votre site n’y changera rien.',
    sections: [
      {
        titre: 'Le malentendu à dissiper en premier',
        paragraphes: [
          'Beaucoup d’entreprises ajoutent un fichier llms.txt à leur site et attendent. Il ne se passe rien, et c’est normal.',
          'Quand un moteur de réponse a besoin d’information fraîche — quelle entreprise engager, quel prix payer, qui dessert telle ville — il lance une recherche web. ChatGPT s’appuie sur l’index de Bing. Google AI Overviews s’appuie sur l’index de Google. Perplexity mêle plusieurs sources.',
          'Autrement dit : le référencement classique n’est pas remplacé par le GEO. Il en est la condition d’entrée.',
        ],
      },
      {
        titre: 'Les leviers, dans l’ordre où ils comptent',
        items: [
          {
            bold: 'Être dans l’index de Bing. ',
            text: 'Créez un compte Bing Webmaster Tools et soumettez votre sitemap. C’est gratuit, ça prend dix minutes, et c’est la porte d’entrée de ChatGPT. On peut importer directement sa configuration depuis Google Search Console.',
          },
          {
            bold: 'Être mentionné ailleurs que chez vous. ',
            text: 'Les IA font davantage confiance à ce que les autres disent de vous qu’à ce que vous dites de vous. Annuaires professionnels, associations de votre métier, articles de médias locaux, discussions sur des forums : chaque mention est un vote.',
          },
          {
            bold: 'Avoir des pages qui répondent à des questions. ',
            text: 'Une page qui répond à une question précise dans ses cinquante premiers mots se fait citer. Une page de vente qui commence par « Depuis 2015, notre équipe passionnée… » ne se fait jamais citer.',
          },
          {
            bold: 'Avoir des avis et une fiche à jour. ',
            text: 'Pour toute recherche locale, les moteurs de réponse s’appuient massivement sur les fiches Google Business et les avis. Une fiche complète avec trente avis récents pèse plus lourd qu’un beau site.',
          },
          {
            bold: 'Autoriser les robots IA. ',
            text: 'Votre robots.txt doit laisser passer GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot et Google-Extended. C’est nécessaire mais pas suffisant : ça évite d’être exclu, ça ne fait pas être choisi.',
          },
        ],
      },
      {
        titre: 'Comment vérifier où vous en êtes',
        paragraphes: [
          'Ouvrez ChatGPT et posez la question qu’un client poserait : « quel entrepreneur en rénovation recommandes-tu à Saint-Eustache ? ». Notez les noms qui sortent. Ce sont vos vrais concurrents dans ce canal.',
          'Puis cherchez ces noms sur Bing. Vous verrez presque toujours qu’ils y sont bien positionnés, ou qu’ils apparaissent dans un palmarès ou un annuaire que l’IA a lu. C’est reproductible.',
        ],
      },
    ],
    liees: [
      'combien-de-temps-premier-sur-google',
      'plus-avis-google-construction',
      'trouver-clients-en-ligne-construction',
    ],
  },
  {
    slug: 'trouver-clients-en-ligne-construction',
    question:
      'Comment un entrepreneur en construction peut-il trouver des clients en ligne ?',
    metaTitle: 'Trouver des clients en ligne en construction',
    metaDescription:
      'Les canaux qui rapportent réellement des contrats à un entrepreneur en construction au Québec, dans l’ordre du meilleur rendement pour le budget investi.',
    categorie: 'Génération de clients',
    reponseCourte:
      'Un entrepreneur en construction trouve des clients en ligne par trois canaux, dans cet ordre de rendement : une fiche Google Business complète avec des avis récents, un site qui se positionne sur les recherches de sa région, et de la publicité géociblée pour combler les creux. Les réseaux sociaux servent à convaincre quelqu’un qui vous a déjà trouvé, rarement à le trouver.',
    sections: [
      {
        titre: 'Pourquoi la fiche Google passe avant le site',
        paragraphes: [
          'Quelqu’un qui cherche « couvreur près de moi » voit d’abord une carte avec trois fiches. Cette zone occupe le premier écran sur un téléphone. Le premier lien de site web arrive souvent après un défilement complet.',
          'Une fiche Google Business est gratuite. La remplir au complet — horaires, secteur desservi, services, photos de chantiers récents, questions-réponses — prend une soirée. C’est le meilleur rendement disponible en marketing pour un entrepreneur québécois.',
        ],
      },
      {
        titre: 'Ce que le site doit faire, concrètement',
        items: [
          {
            bold: 'Une page par service réel. ',
            text: 'Toiture, revêtement, agrandissement : une page chacun. Une seule page « nos services » qui liste tout ne se positionne sur rien.',
          },
          {
            bold: 'Une page par secteur desservi, mais seulement si elle est vraie. ',
            text: 'Une page fouillée sur votre région réelle vaut mieux que dix pages identiques où seul le nom de ville change. Google pénalise explicitement ce dernier procédé.',
          },
          {
            bold: 'Vos vraies photos. ',
            text: 'Les photos de banque d’images se reconnaissent et coûtent de la crédibilité. Un téléphone récent suffit largement pour photographier un chantier fini.',
          },
          {
            bold: 'Un formulaire court. ',
            text: 'Nom, téléphone, type de projet. Chaque champ supplémentaire fait perdre des demandes.',
          },
        ],
      },
      {
        titre: 'Quand la publicité vaut la peine',
        paragraphes: [
          'Le référencement met des mois à produire. La publicité produit dès le premier jour, mais s’arrête le jour où vous arrêtez de payer. Les deux se complètent : la pub comble le trou pendant que le référencement se construit.',
          'Pour un entrepreneur, Google Ads bat presque toujours Facebook, parce que la personne qui tape « réparation toiture urgence » a déjà le problème. Sur Facebook, il faut créer le besoin.',
          'Un point à surveiller : la Régie du bâtiment du Québec exige que le numéro de licence RBQ apparaisse dans votre publicité. Une campagne sans licence affichée est un risque légal, pas seulement une occasion manquée.',
        ],
      },
    ],
    liees: [
      'google-ads-vaut-la-peine-construction',
      'plus-avis-google-construction',
      'prix-site-web-entrepreneur-construction',
    ],
  },
  {
    slug: 'google-ads-vaut-la-peine-construction',
    question:
      'Est-ce que Google Ads vaut la peine pour un entrepreneur en construction ?',
    metaTitle: 'Google Ads vaut-il la peine en construction ?',
    metaDescription:
      'Quand Google Ads est rentable pour un entrepreneur en construction au Québec, quel budget prévoir, et les erreurs qui font brûler l’argent sans contrat.',
    categorie: 'Publicité',
    reponseCourte:
      'Google Ads est rentable pour un entrepreneur en construction quand la valeur moyenne d’un contrat dépasse quelques milliers de dollars, ce qui est presque toujours le cas. Un clic coûte généralement de 3 $ à 12 $ selon le métier et la région au Québec. Il faut souvent de 20 à 50 clics pour une demande de soumission, et quelques demandes pour un contrat. Faites le calcul avec vos chiffres avant de lancer.',
    sections: [
      {
        titre: 'Le calcul à faire avant de dépenser un dollar',
        paragraphes: [
          'Prenez trois nombres : la valeur moyenne d’un de vos contrats, votre marge sur ce contrat, et la proportion de soumissions que vous décrochez.',
          'Exemple. Un contrat moyen de 15 000 $, une marge de 25 % (3 750 $), et une soumission sur quatre acceptée. Il vous faut donc quatre demandes pour un contrat. À 8 $ le clic et 30 clics par demande, une demande coûte 240 $, et un contrat 960 $ en publicité — pour 3 750 $ de marge.',
          'Ce calcul reste rentable même si vos coûts doublent. C’est la raison pour laquelle la publicité fonctionne en construction : la valeur d’un client absorbe un coût d’acquisition élevé.',
        ],
      },
      {
        titre: 'Les erreurs qui font brûler le budget',
        items: [
          {
            bold: 'Aucun mot-clé négatif. ',
            text: 'Sans exclusions, vous payez pour « emploi couvreur », « formation toiture » et « toiture pas cher ». C’est le premier poste de gaspillage, souvent le tiers du budget.',
          },
          {
            bold: 'Envoyer les clics vers la page d’accueil. ',
            text: 'Quelqu’un qui cherche « réparation de toiture » doit atterrir sur la page de réparation de toiture. Chaque clic de plus à faire perd des gens.',
          },
          {
            bold: 'Aucun suivi des appels. ',
            text: 'En construction, la majorité des demandes arrivent par téléphone. Sans suivi des appels, vous ne voyez qu’une partie des résultats et vous coupez souvent les campagnes qui fonctionnent.',
          },
          {
            bold: 'Un rayon trop large. ',
            text: 'Payer pour des clics à deux heures de route de votre secteur, pour des projets que vous refuserez de toute façon.',
          },
        ],
      },
      {
        titre: 'Le budget minimum réaliste',
        paragraphes: [
          'En bas de 800 $ à 1 000 $ par mois, il est difficile d’accumuler assez de données pour ajuster une campagne au Québec. Vous obtenez des clics épars, pas un système.',
          'Mieux vaut une seule campagne bien ciblée sur votre service le plus rentable, avec un vrai budget, que cinq campagnes affamées.',
        ],
      },
    ],
    liees: [
      'trouver-clients-en-ligne-construction',
      'combien-de-temps-premier-sur-google',
      'prix-site-web-entrepreneur-construction',
    ],
  },
  {
    slug: 'combien-de-temps-premier-sur-google',
    question:
      'Combien de temps ça prend pour être premier sur Google ?',
    metaTitle: 'Combien de temps pour être premier sur Google ?',
    metaDescription:
      'Les délais réels du référencement pour une entreprise de construction au Québec : ce qui bouge en semaines, en mois, et ce qui ne bougera jamais.',
    categorie: 'Référencement',
    reponseCourte:
      'Comptez de 3 à 6 mois pour voir des résultats sur des recherches locales de votre région, et de 9 à 18 mois pour des recherches concurrentielles à l’échelle du Québec. La fiche Google Business fait exception : bien remplie, elle peut remonter en quelques semaines. Toute agence qui promet la première place en 30 jours vend soit de la publicité déguisée, soit rien du tout.',
    sections: [
      {
        titre: 'Pourquoi c’est aussi long',
        paragraphes: [
          'Google doit d’abord découvrir vos pages, puis les évaluer, puis observer comment les gens réagissent quand elles apparaissent. Chacune de ces étapes prend du temps, et la dernière demande du volume.',
          'Un piège fréquent : le site est parfait, mais le sitemap n’a jamais été soumis dans Search Console. Des pages restent alors non indexées pendant des mois. Vérifiez cela avant de conclure que le référencement ne fonctionne pas.',
        ],
      },
      {
        titre: 'Ce qui bouge, et quand',
        items: [
          {
            bold: 'Semaines 1 à 4 — ',
            text: 'la fiche Google Business complétée peut déjà changer votre position dans la carte locale. Les corrections techniques (vitesse, mobile, indexation) sont prises en compte rapidement.',
          },
          {
            bold: 'Mois 2 à 4 — ',
            text: 'les pages de services commencent à apparaître sur des recherches longues et précises : « réparation de toiture plate Deux-Montagnes » plutôt que « couvreur ».',
          },
          {
            bold: 'Mois 4 à 9 — ',
            text: 'les recherches de votre ville avec votre métier deviennent atteignables si les avis et les mentions suivent.',
          },
          {
            bold: 'Après un an — ',
            text: 'les recherches larges à l’échelle de la province. Beaucoup d’entreprises n’ont aucun intérêt à les viser : elles amènent du trafic hors secteur.',
          },
        ],
      },
      {
        titre: 'Premier sur quoi, au juste',
        paragraphes: [
          'La question « être premier sur Google » n’a pas de réponse unique : les résultats varient selon la ville d’où l’on cherche, l’appareil, et l’historique de la personne.',
          'La bonne cible n’est pas une position, c’est un nombre de demandes de soumission par mois. Une troisième place sur une recherche qui convertit vaut mieux qu’une première place sur une recherche que personne ne fait.',
        ],
      },
    ],
    liees: [
      'apparaitre-dans-chatgpt-entreprise',
      'plus-avis-google-construction',
      'choisir-agence-web-construction',
    ],
  },
  {
    slug: 'site-web-ou-page-facebook',
    question:
      'Ai-je vraiment besoin d’un site web si j’ai déjà une page Facebook ?',
    metaTitle: 'Site web ou page Facebook pour un entrepreneur ?',
    metaDescription:
      'Ce qu’une page Facebook fait bien, ce qu’elle ne fera jamais, et pourquoi un entrepreneur en construction perd des contrats sans site web.',
    categorie: 'Fondations',
    reponseCourte:
      'Oui. Une page Facebook montre votre travail à des gens qui vous suivent déjà ; un site vous fait trouver par des gens qui cherchent votre service maintenant. Les deux ne remplissent pas la même fonction. De plus, une page Facebook ne vous appartient pas : un changement de règles ou un blocage de compte peut effacer dix ans de présence du jour au lendemain.',
    sections: [
      {
        titre: 'Ce que Facebook fait bien',
        paragraphes: [
          'Facebook est excellent pour une chose : montrer que vous existez et que vous travaillez. Des photos de chantier régulières rassurent quelqu’un qui hésite entre vous et un autre soumissionnaire.',
          'C’est aussi là que le bouche-à-oreille se joue. Quand une cliente demande « quelqu’un connaît un bon couvreur ? » dans un groupe local, votre page est ce qu’on lui envoie.',
        ],
      },
      {
        titre: 'Ce que Facebook ne fera jamais',
        items: [
          {
            bold: 'Apparaître dans une recherche Google. ',
            text: 'Les pages Facebook se positionnent mal sur les recherches de service. La personne qui tape « entrepreneur général Blainville » ne vous trouvera pas là.',
          },
          {
            bold: 'Être cité par ChatGPT. ',
            text: 'Les moteurs de réponse IA lisent difficilement le contenu de Facebook, qui est largement fermé aux robots. Votre site est ce qu’ils peuvent lire et citer.',
          },
          {
            bold: 'Vous appartenir. ',
            text: 'Un compte suspendu, une règle qui change, une portée qui s’effondre : vous n’avez aucun recours. Un site avec votre nom de domaine est à vous.',
          },
          {
            bold: 'Présenter une soumission sérieusement. ',
            text: 'Pour un contrat de 40 000 $, un client compare. Une entreprise sans site paraît plus petite qu’une entreprise avec site, même à qualité de travail égale.',
          },
        ],
      },
      {
        titre: 'La combinaison qui fonctionne',
        paragraphes: [
          'Le site est votre base : il se fait trouver, il explique, il reçoit les demandes. Facebook et Instagram sont vos preuves : ils montrent les chantiers de la semaine.',
          'Chaque publication renvoie au site. Le site affiche les publications. La personne qui vous découvre par l’un finit par voir l’autre, et c’est cette répétition qui fait décrocher le téléphone.',
        ],
      },
    ],
    liees: [
      'prix-site-web-entrepreneur-construction',
      'trouver-clients-en-ligne-construction',
      'apparaitre-dans-chatgpt-entreprise',
    ],
  },
  {
    slug: 'plus-avis-google-construction',
    question:
      'Comment obtenir plus d’avis Google quand on est entrepreneur ?',
    metaTitle: 'Obtenir plus d’avis Google en construction',
    metaDescription:
      'La méthode qui fonctionne pour accumuler des avis Google en construction : quand demander, comment demander, et ce qui est interdit.',
    categorie: 'Réputation',
    reponseCourte:
      'Demandez l’avis le jour même de la fin des travaux, en personne, puis envoyez immédiatement un texto contenant votre lien direct d’avis Google. Ce moment est le seul où le client est content et disponible. Une semaine plus tard, il est passé à autre chose. Visez un rythme régulier plutôt qu’un lot : dix avis étalés sur six mois pèsent plus que trente avis publiés la même semaine.',
    sections: [
      {
        titre: 'Le moment fait tout',
        paragraphes: [
          'La différence entre un entrepreneur avec 60 avis et un entrepreneur avec 4 n’est presque jamais la qualité du travail. C’est le moment de la demande.',
          'Le bon moment est celui de la dernière poignée de main, quand le client voit le résultat fini. Dites-le simplement : « ça m’aiderait beaucoup, je vous envoie le lien tout de suite ». Puis envoyez le texto pendant que vous êtes encore devant lui.',
          'Récupérez votre lien court d’avis dans votre profil Google Business et gardez-le dans vos réponses rapides. Un client qui doit chercher votre entreprise lui-même abandonne.',
        ],
      },
      {
        titre: 'Ce qui est interdit, et ce qui coûte cher',
        items: [
          {
            bold: 'Payer pour des avis. ',
            text: 'Interdit par Google, détectable, et sanctionnable. Une fiche suspendue disparaît de la carte locale — le canal le plus rentable que vous ayez.',
          },
          {
            bold: 'Ne demander qu’aux clients satisfaits en filtrant les autres. ',
            text: 'Le filtrage préalable est contraire aux règles. Demandez à tout le monde ; les insatisfaits répondent rarement de toute façon.',
          },
          {
            bold: 'Ignorer un avis négatif. ',
            text: 'Une réponse calme et factuelle à un avis d’une étoile convainc davantage que dix avis parfaits. Les gens lisent les réponses pour voir comment vous réagissez quand ça va mal.',
          },
        ],
      },
      {
        titre: 'Pourquoi les avis pèsent au-delà de Google',
        paragraphes: [
          'Les moteurs de réponse IA s’appuient fortement sur les fiches d’entreprises et leurs avis pour répondre aux questions locales. Quand ChatGPT nomme trois entrepreneurs d’une région, ce sont souvent ceux dont la fiche est la mieux garnie.',
          'Les avis servent donc deux fois : ils convainquent l’humain qui hésite, et ils fournissent à la machine la preuve qu’elle cherche.',
        ],
      },
    ],
    liees: [
      'apparaitre-dans-chatgpt-entreprise',
      'trouver-clients-en-ligne-construction',
      'combien-de-temps-premier-sur-google',
    ],
  },
  {
    slug: 'choisir-agence-web-construction',
    question:
      'Comment choisir une agence web quand on est entrepreneur en construction ?',
    metaTitle: 'Choisir une agence web en construction',
    metaDescription:
      'Les questions à poser à une agence web avant de signer, les réponses qui devraient vous faire fuir, et ce qu’un bon contrat doit prévoir.',
    categorie: 'Choisir un partenaire',
    reponseCourte:
      'Choisissez sur trois critères vérifiables : l’agence connaît-elle votre métier, êtes-vous propriétaire du site et des comptes publicitaires, et vous montre-t-elle des résultats chiffrés plutôt que des maquettes. Exigez que le nom de domaine, l’hébergement, la fiche Google Business et le compte Google Ads soient à votre nom. C’est le point qui coince le plus souvent au moment de changer de fournisseur.',
    sections: [
      {
        titre: 'Les cinq questions à poser avant de signer',
        items: [
          {
            bold: 'À qui appartiennent les comptes ? ',
            text: 'Domaine, hébergement, Google Ads, Analytics, fiche Google Business. Tout doit être à votre nom, avec vous comme propriétaire et l’agence comme gestionnaire. Une réponse floue ici annonce un divorce difficile.',
          },
          {
            bold: 'Que se passe-t-il si j’arrête ? ',
            text: 'Vous devez pouvoir partir avec votre site et vos données. Certains contrats laissent l’entreprise sans rien après trois ans de mensualités.',
          },
          {
            bold: 'Montrez-moi un résultat, pas un design. ',
            text: 'Demandez une capture de Search Console ou de Google Ads d’un client comparable. Un beau portfolio prouve qu’on sait dessiner, pas qu’on sait vendre.',
          },
          {
            bold: 'Qui écrit les textes ? ',
            text: 'Si c’est vous, dites-le tout de suite : c’est la cause numéro un des projets qui traînent six mois.',
          },
          {
            bold: 'Comment mesurez-vous le succès ? ',
            text: 'La bonne réponse est un nombre de demandes de soumission. Les mauvaises réponses sont « les impressions », « le trafic » et « la visibilité ».',
          },
        ],
      },
      {
        titre: 'Les signaux qui devraient vous faire partir',
        paragraphes: [
          'Une garantie de première place sur Google. Personne ne peut la donner, et Google l’interdit dans ses conditions pour les partenaires.',
          'Un devis sans échéancier ni livrables nommés. « Refonte du site web — 6 000 $ » n’est pas un devis, c’est un chiffre.',
          'Une agence qui ne pose aucune question sur votre métier, vos marges ou le type de contrat que vous voulez décrocher. Sans ça, elle construira une brochure générique.',
        ],
      },
      {
        titre: 'Petite agence ou grosse agence',
        paragraphes: [
          'Une grosse agence a plus de ressources, mais un entrepreneur en toiture y sera un petit compte, confié à un junior.',
          'Une petite agence donne un accès direct à la personne qui fait le travail, mais dépend de la disponibilité de cette personne.',
          'Le critère utile n’est pas la taille : c’est de savoir si l’agence a déjà généré des soumissions pour un métier semblable au vôtre, et si elle peut le prouver.',
        ],
      },
    ],
    liees: [
      'prix-site-web-entrepreneur-construction',
      'combien-de-temps-premier-sur-google',
      'google-ads-vaut-la-peine-construction',
    ],
  },
];
