import React from 'react';
import { Layout, Search, Megaphone, Users, Palette, MessageSquare, Globe, Zap } from 'lucide-react';

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  color: string;
  faq: ServiceFaq[];
}

export const SERVICES: Service[] = [
  {
    slug: 'conception-site-web',
    title: 'Conception de site web',
    icon: <Layout className="w-8 h-8" />,
    color: '#0ea5e9', // Cyan
    shortDesc: 'Des sites vitrines et e-commerce performants pour entrepreneurs.',
    fullDesc: "Votre site web est votre carte de visite numérique 24/7. Chez Propulsite, nous concevons des sites web qui ne sont pas seulement beaux, mais qui sont bâtis pour convertir. Spécialisés pour le secteur de la construction, nous comprenons vos besoins : présentation de projets, formulaires de soumission simplifiés et rapidité de chargement sur chantier.",
    features: [
      'Design responsive (mobile, tablette, desktop)',
      'Optimisation de la vitesse de chargement',
      'Système de gestion de contenu (CMS) intuitif',
      'Intégration de formulaires de soumission personnalisés',
      'Hébergement sécurisé et maintenance'
    ],
    faq: [
      {
        q: 'Combien de temps faut-il pour créer un site web de construction ?',
        a: "En général, comptez de 2 à 4 semaines selon la complexité du projet : un site vitrine simple se livre plus vite qu'un site avec portfolio de réalisations, formulaires de soumission avancés et intégrations sur mesure. On établit un échéancier clair dès le départ et on le respecte."
      },
      {
        q: 'Mon site sera-t-il adapté aux téléphones mobiles ?',
        a: "Absolument. Plus de 70 % des recherches pour trouver un entrepreneur se font sur mobile, alors chaque site qu'on conçoit est responsive : il s'affiche parfaitement sur téléphone, tablette et ordinateur, avec un temps de chargement optimisé."
      },
      {
        q: 'Vais-je pouvoir modifier mon site moi-même ?',
        a: "Oui. On intègre un système de gestion de contenu (CMS) intuitif et on vous montre comment ajouter vos photos de chantier, modifier vos textes ou publier une nouvelle réalisation — sans aucune connaissance technique."
      },
      {
        q: "Combien coûte un site web pour une entreprise de construction ?",
        a: "Le prix dépend de l'ampleur du projet : nombre de pages, fonctionnalités, photographie, rédaction. Plutôt que des forfaits génériques, on prépare une soumission personnalisée gratuite basée sur vos besoins réels et vos objectifs d'affaires."
      }
    ]
  },
  {
    slug: 'google-ads',
    title: 'Google Ads (SEM)',
    icon: <Search className="w-8 h-8" />,
    color: '#f59e0b', // Amber
    shortDesc: 'Générez des appels de clients prêts à signer dès aujourd\'hui.',
    fullDesc: "Le marketing par moteur de recherche (SEM) vous permet d'apparaître exactement quand un client cherche vos services. Nous gérons vos campagnes Google Ads pour maximiser votre retour sur investissement. Pour un entrepreneur, chaque clic doit compter : nous ciblons les mots-clés les plus rentables de votre région.",
    features: [
      'Analyse approfondie des mots-clés',
      'Rédaction d\'annonces percutantes',
      'Ciblage géographique précis',
      'Suivi des conversions et appels',
      'Optimisation continue du budget'
    ],
    faq: [
      {
        q: 'En combien de temps Google Ads donne-t-il des résultats ?',
        a: "C'est le levier le plus rapide du marketing numérique : vos annonces apparaissent dès le lancement de la campagne, et les premières demandes de soumission peuvent arriver en quelques jours. Les semaines suivantes servent à optimiser le coût par lead."
      },
      {
        q: 'Quel budget publicitaire prévoir pour la construction au Québec ?',
        a: "Le budget dépend de votre région, de vos services et de la concurrence locale. On recommande de commencer avec un budget de test raisonnable, de mesurer le coût par demande de soumission, puis d'augmenter progressivement ce qui fonctionne. Vous gardez le contrôle du budget en tout temps."
      },
      {
        q: 'Est-ce que Google Ads fonctionne pour une petite entreprise de construction ?',
        a: "Oui, et c'est même un avantage : le géociblage permet de viser uniquement votre territoire de service et vos types de projets. Vous ne payez jamais pour des clics à l'extérieur de votre zone, ce qui rend l'outil rentable même avec une petite équipe."
      }
    ]
  },
  {
    slug: 'domination-google',
    title: 'Domination Google',
    icon: <Globe className="w-8 h-8" />,
    color: '#10b981', // Emerald
    shortDesc: 'Être partout où vos clients cherchent : référencement (SEO), fiche Google, Local Services Ads et GEO (être cité par ChatGPT et l\'IA de Google).',
    fullDesc: "Il n'y a pas une seule façon d'être premier sur Google — il y en a plusieurs, et on les combine. Le référencement naturel (SEO) fait grimper votre site dans les résultats avec le temps, sans payer le clic. Votre fiche Google Business vous place sur la carte et dans le top local. Les Local Services Ads (le « Google Garantie ») vous propulsent tout en haut, avec un badge vérifié, où vous ne payez que lorsqu'un vrai client vous appelle. Et le GEO — l'optimisation pour les moteurs de réponse IA — fait en sorte que lorsqu'un propriétaire demande à ChatGPT, à l'IA de Google (AI Overviews) ou à Perplexity « quel entrepreneur engager dans ma région ? », c'est votre nom qui ressort. Ensemble, ces leviers font de vous le nom qui revient partout : dans les résultats Google, sur la carte, et dans les nouvelles réponses générées par l'intelligence artificielle.",
    features: [
      'Référencement naturel (SEO) : audit technique et optimisation on-page',
      'Optimisation de votre fiche Google Business (carte et top local)',
      'Local Services Ads « Google Garantie » : configuration et gestion',
      'GEO : être cité et recommandé par ChatGPT, l\'IA de Google et Perplexity',
      'Stratégie de contenu et de mots-clés locaux',
      'Avis clients et autorité — les signaux que Google et les IA récompensent'
    ],
    faq: [
      {
        q: "C'est quoi le GEO, et pourquoi ça compte pour mon entreprise de construction ?",
        a: "Le GEO (Generative Engine Optimization), c'est l'art de se faire citer par les moteurs de réponse IA — ChatGPT, l'IA de Google (AI Overviews), Perplexity, Gemini. De plus en plus de propriétaires posent leur question directement à une IA (« quel entrepreneur en rénovation engager à [votre ville] ? ») au lieu de faire défiler Google. Le GEO structure votre contenu et vos informations pour que l'IA vous comprenne, vous fasse confiance et vous recommande. C'est le prolongement naturel du référencement, et on le bâtit en même temps que votre SEO — pour que vous ne soyez pas invisible dans les réponses que vos futurs clients lisent déjà."
      },
      {
        q: 'Quelle est la différence entre le SEO et les Local Services Ads ?',
        a: "Le SEO, c'est organique et gratuit : votre site grimpe naturellement dans les résultats, mais ça prend des mois. Les Local Services Ads, c'est une pub vérifiée qui s'affiche tout en haut avec le badge « Garanti par Google » — instantané, et vous payez seulement quand un client vous appelle. C'est complémentaire : on combine les deux pour occuper le plus d'espace possible sur Google."
      },
      {
        q: 'Combien de temps avant de voir des résultats ?',
        a: "Ça dépend du levier. Les Local Services Ads et la fiche Google peuvent générer des appels en quelques jours. Le référencement naturel est un investissement à moyen terme : les premiers gains organiques apparaissent généralement entre 3 et 6 mois, mais ils sont durables et ne se paient pas au clic."
      },
      {
        q: "C'est quoi le SEO local exactement ?",
        a: "C'est l'art d'apparaître quand quelqu'un cherche « entrepreneur général près de moi » ou « rénovation + votre ville » sur Google et Google Maps. Ça passe par votre fiche Google Business, des pages optimisées pour votre territoire et vos avis clients."
      },
      {
        q: 'Est-ce que je suis éligible aux Local Services Ads au Québec ?',
        a: "Google a ouvert les Local Services Ads à plusieurs métiers de la construction au Canada, mais l'éligibilité exacte dépend de votre type de travaux et de votre région. On vérifie ça avec vous avant de lancer quoi que ce soit — pour ne pas vous faire perdre de temps."
      },
      {
        q: 'On commence par quoi si mon budget est limité ?',
        a: "On priorise selon votre situation. Souvent, on commence par optimiser votre fiche Google Business (gratuit et rapide) et on teste les Local Services Ads (paiement au lead, donc à faible risque), pendant que le SEO se construit en arrière-plan. On vous recommande le bon dosage lors de la consultation gratuite."
      }
    ]
  },
  {
    slug: 'publicite-facebook',
    title: 'Publicité Facebook (SMM)',
    icon: <Megaphone className="w-8 h-8" />,
    color: '#3b82f6', // Blue
    shortDesc: 'Ciblez vos clients idéaux avec des créations visuelles percutantes.',
    fullDesc: "Les réseaux sociaux sont parfaits pour montrer la qualité de vos travaux. Nous créons des campagnes publicitaires sur Facebook et Instagram qui captent l'attention des propriétaires. Grâce à un ciblage démographique précis, nous montrons vos réalisations aux bonnes personnes.",
    features: [
      'Création de visuels et vidéos publicitaires',
      'Ciblage d\'audience personnalisé',
      'Retargeting (reciblage des visiteurs)',
      'Tests A/B pour maximiser les performances',
      'Rapports de performance détaillés'
    ],
    faq: [
      {
        q: 'Est-ce que la publicité Facebook fonctionne vraiment pour la construction ?',
        a: "Oui — les photos avant/après et les vidéos de chantier sont parmi les contenus les plus performants sur Facebook et Instagram. On cible les propriétaires de votre région selon leur profil, et vos réalisations font le reste."
      },
      {
        q: 'Quelle est la différence entre « booster » une publication et une vraie campagne ?',
        a: "Le bouton « Booster » achète de la visibilité sans réelle stratégie. Une campagne structurée définit un objectif précis (demandes de soumission, appels), des audiences ciblées, du reciblage des visiteurs de votre site et des tests A/B — c'est ce qui transforme un budget pub en contrats."
      },
      {
        q: 'Mes publicités vont-elles apparaître aussi sur Instagram ?',
        a: "Oui. Les campagnes sont gérées via Meta et diffusées sur Facebook et Instagram en même temps, avec des formats adaptés à chaque plateforme. Vous touchez les deux audiences sans doubler le travail ni le budget."
      }
    ]
  },
  {
    slug: 'gestion-medias-sociaux',
    title: 'Gestion de médias sociaux',
    icon: <Users className="w-8 h-8" />,
    color: '#ec4899', // Pink
    shortDesc: 'Bâtissez une communauté engagée autour de votre marque.',
    fullDesc: "Vous n'avez pas le temps de gérer vos pages sociales entre deux chantiers ? Nous nous en occupons. Nous publions du contenu régulier qui met en valeur vos projets, votre équipe et votre savoir-faire, renforçant ainsi la confiance de vos futurs clients.",
    features: [
      'Calendrier éditorial mensuel',
      'Publication de photos de chantiers',
      'Interaction avec la communauté',
      'Veille concurrentielle',
      'Croissance organique de l\'audience'
    ],
    faq: [
      {
        q: 'Sur quelles plateformes mon entreprise devrait-elle être présente ?',
        a: "Pour le résidentiel, Facebook et Instagram sont prioritaires : c'est là que vos futurs clients passent leur temps. Pour les projets commerciaux et institutionnels, LinkedIn devient pertinent. On choisit ensemble selon votre clientèle cible plutôt que d'être partout à moitié."
      },
      {
        q: 'À quelle fréquence faut-il publier ?',
        a: "La régularité bat le volume : mieux vaut 2 à 3 publications de qualité par semaine, constantes, qu'une rafale suivie de trois mois de silence. C'est exactement ce que le calendrier éditorial mensuel garantit — sans que vous ayez à y penser entre deux chantiers."
      },
      {
        q: 'Dois-je fournir les photos et le contenu ?',
        a: "Vos photos de chantier sont votre meilleur atout : quelques clichés pris au téléphone suffisent. On s'occupe de la sélection, de la retouche, des textes et de la publication. Vous bâtissez, on raconte."
      }
    ]
  },
  {
    slug: 'chatbot-ia',
    title: 'Chatbot IA',
    icon: <MessageSquare className="w-8 h-8" />,
    color: '#8b5cf6', // Violet
    shortDesc: 'Un assistant virtuel intelligent disponible 24/7 pour engager vos clients.',
    fullDesc: "Un Chatbot IA transforme la façon dont vous interagissez avec vos clients. Fini les opportunités perdues en dehors des heures d'ouverture. Notre agent conversationnel intelligent automatisé répond instantanément aux questions fréquentes, qualifie vos prospects et redirige les demandes complexes vers la bonne personne.",
    features: [
      'Réponses instantanées 24/7',
      'Qualification de prospects automatisée',
      'Capture de coordonnées (Lead Gen)',
      'Personnalisation selon votre marque',
      'Support conversationnel fluide'
    ],
    faq: [
      {
        q: 'Comment un chatbot IA aide-t-il une entreprise de construction ?',
        a: "Il répond instantanément aux visiteurs de votre site, le soir et la fin de semaine inclus — exactement quand les propriétaires magasinent leur entrepreneur. Il capte les demandes de soumission que vous auriez manquées pendant que vous êtes sur le chantier."
      },
      {
        q: "Est-ce compliqué à installer sur mon site ?",
        a: "Non, on s'occupe de tout : configuration, intégration à votre site web, personnalisation des réponses selon vos services et votre territoire. Le chatbot est entraîné avec les questions réelles de vos clients avant la mise en ligne."
      },
      {
        q: 'Le chatbot peut-il qualifier mes prospects ?',
        a: "Oui, c'est sa force principale : il pose les bonnes questions (type de projet, secteur, échéancier), recueille les coordonnées et vous transmet un lead déjà qualifié. Les demandes complexes sont redirigées vers vous automatiquement."
      }
    ]
  }
];
