export interface PainPointArticleData {
  slug: string;
  tag: string;
  datePublished?: string; // format YYYY-MM-DD
  dateModified?: string; // format YYYY-MM-DD
  titlePart1: string;
  titleHighlight: string;
  titlePart3?: string;
  intro: string;
  blocks: {
    title: string;
    paragraphs?: string[];
    listItems?: { text: string; bold?: string }[];
    solutionBox?: { label: string; text: string };
  }[];
  cta: {
    title: string;
    desc: string;
    btnText: string;
    btnLink: string;
  };
}

export const PAIN_POINTS_ARTICLES: PainPointArticleData[] = [
  {
    slug: 'pas-assez-contrats',
    tag: 'Problème 01',
    datePublished: '2026-03-10',
    titlePart1: 'Pas assez de ',
    titleHighlight: 'contrats de construction',
    titlePart3: '?',
    intro: 'Votre expertise est réelle, mais votre téléphone reste silencieux. Voici pourquoi — et comment y remédier.',
    blocks: [
      {
        title: 'Pourquoi votre carnet se vide',
        paragraphs: [
          "La plupart des entrepreneurs en construction excellent sur le chantier mais sont invisibles en ligne. Le problème n'est pas la qualité de votre travail — c'est que les clients potentiels ne peuvent tout simplement pas vous trouver quand ils cherchent.",
          "Aujourd'hui, plus de 80% des propriétaires commencent leur recherche d'entrepreneur sur Google. Si vous n'apparaissez pas dans les premiers résultats, vous n'existez pas pour eux."
        ],
        listItems: [
          { bold: 'Bouche-à-oreille seul :', text: ' Efficace mais imprévisible — vous dépendez du bon vouloir de vos anciens clients.' },
          { bold: 'Pas de présence en ligne :', text: ' Votre concurrent qui a un site optimisé capte tous les leads que vous manquez.' },
          { bold: 'Aucune stratégie de génération de leads :', text: ' Sans système, vous attendez que le téléphone sonne.' }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "On transforme votre site web en machine à leads — optimisé pour Google, conçu pour convertir les visiteurs en appels. Google Ads ciblés, SEO local, et pages de destination conçues pour les entrepreneurs. Votre téléphone recommence à sonner, même quand vous êtes sur le chantier."
        }
      },
      {
        title: "Les signaux d'alarme à reconnaître",
        listItems: [
          { text: "Vous avez terminé un projet mais le prochain n'est pas encore confirmé" },
          { text: "Vos seuls clients viennent de références de proches" },
          { text: "Vous n'avez jamais reçu un appel via votre site web" },
          { text: "Vous ne savez pas combien de personnes cherchent vos services chaque mois sur Google" },
          { text: "Vous baissez vos prix pour décrocher des contrats" }
        ]
      },
      {
        title: "Ce qu'un système de génération de leads change concrètement",
        paragraphs: ["Un entrepreneur avec un système marketing bien rodé ne chasse plus les contrats — ce sont les contrats qui viennent à lui. Voici ce que ça ressemble en pratique :"],
        listItems: [
          { bold: "3 à 5 demandes de soumissions par semaine", text: " provenant de Google et Facebook" },
          { bold: "Des leads qualifiés", text: " — des gens qui cherchent activement votre type de service dans votre région" },
          { bold: "Un carnet de commandes planifié", text: " sur 2 à 3 mois à l'avance" },
          { bold: "La liberté de choisir", text: " vos projets plutôt que d'accepter n'importe quoi" }
        ]
      }
    ],
    cta: {
      title: "Votre prochain contrat commence ici",
      desc: "Une stratégie numérique sur mesure pour votre entreprise de construction. Consultation gratuite, sans engagement.",
      btnText: "Obtenir plus de contrats →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'image-marque-datee',
    tag: 'Problème 02',
    datePublished: '2026-03-10',
    titlePart1: '',
    titleHighlight: 'Une image de marque datée qui repousse les clients',
    intro: 'Votre travail sur le terrain est impeccable. Mais votre image en ligne raconte une autre histoire.',
    blocks: [
      {
        title: "Pourquoi l'image de marque fait ou défait un contrat",
        paragraphs: [
          "Avant même de vous appeler, un client potentiel visite votre site, regarde votre logo, et se fait une opinion en moins de 7 secondes. Si votre image visuelle est dépassée, il associe automatiquement ça à un travail de moindre qualité — même si c'est faux.",
          "Dans la construction, la confiance est tout. Une image professionnelle et cohérente signale sérieux, stabilité et compétence avant même que vous ayez dit un mot."
        ],
        listItems: [
          { bold: 'Logo générique ou vieillissant :', text: " Donne l'impression d'une entreprise peu établie." },
          { bold: 'Couleurs et polices incohérentes :', text: " Crée de la méfiance sans que le client sache pourquoi." },
          { bold: 'Photos de mauvaise qualité :', text: " Sous-valorise un travail pourtant excellent." }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "On crée une identité visuelle complète qui reflète la vraie qualité de votre travail — logo, couleurs, typographie, et site web cohérents. Résultat : vous justifiez vos prix et vous attirez des clients qui valorisent la qualité."
        }
      },
      {
        title: "Les signes que votre image vous coûte des contrats",
        listItems: [
          { text: "Votre logo date de plus de 5 ans et n'a jamais été revu" },
          { text: "Votre site web n'est pas responsive sur mobile" },
          { text: "Vos photos de réalisations sont floues ou mal éclairées" },
          { text: "Vous avez du mal à justifier vos tarifs face à la concurrence" },
          { text: "Les clients hésitent à vous recommander à leurs proches" }
        ]
      },
      {
        title: "Ce qu'une image modernisée change pour vous",
        listItems: [
          { bold: "Crédibilité immédiate :", text: " Les clients vous font confiance avant même le premier appel" },
          { bold: "Tarification justifiée :", text: " Une image haut de gamme permet de facturer à sa juste valeur" },
          { bold: "Différenciation claire :", text: " Vous sortez du lot face aux concurrents génériques" },
          { bold: "Fierté de partager :", text: " Vous et votre équipe êtes fiers de montrer votre carte d'affaires" }
        ]
      }
    ],
    cta: {
      title: "Votre image mérite de refléter votre talent",
      desc: "On redesigne votre identité visuelle pour qu'elle inspire confiance dès le premier regard. Consultation gratuite.",
      btnText: "Moderniser mon image →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'invisible-google',
    tag: 'Problème 03',
    datePublished: '2026-03-10',
    titlePart1: '',
    titleHighlight: 'Totalement invisible sur Google',
    intro: "Vos concurrents apparaissent en premier. Vos clients potentiels ne vous trouvent jamais. Voici comment inverser ça.",
    blocks: [
      {
        title: "Pourquoi Google est votre meilleur vendeur",
        paragraphs: [
          "Quand un propriétaire a besoin d'un entrepreneur, son premier réflexe est de taper 'entrepreneur général près de moi' sur Google. Celui qui apparaît en premier décroche le contrat. C'est aussi simple que ça.",
          "Le SEO local pour la construction n'est pas mystérieux — c'est une combinaison de techniques précises qui font remonter votre entreprise dans les résultats. Mais sans stratégie, vous restez invisible pendant que vos concurrents récoltent tous les appels."
        ],
        listItems: [
          { bold: 'Fiche Google non optimisée :', text: " Votre entreprise n'apparaît pas sur Google Maps." },
          { bold: 'Site sans mots-clés locaux :', text: " Google ne sait pas que vous servez votre région." },
          { bold: 'Aucun avis Google :', text: " Les entreprises avec des avis passent devant vous systématiquement." }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "On optimise votre présence Google de A à Z — fiche Google Business, SEO local ciblé sur vos services et votre région, et stratégie de mots-clés pour les requêtes que vos clients tapent vraiment. Vous remontez, ils vous trouvent, ils appellent."
        }
      },
      {
        title: "Comment savoir si vous êtes invisible en ligne",
        listItems: [
          { text: "Tapez 'entrepreneur général [votre ville]' — apparaissez-vous dans les 3 premiers résultats?" },
          { text: "Votre fiche Google Business est incomplète ou inexistante" },
          { text: "Vous avez moins de 10 avis Google" },
          { text: "Votre site n'a pas été mis à jour depuis plus d'un an" },
          { text: "Vous ne recevez aucun appel provenant de Google" }
        ]
      },
      {
        title: "Ce que le SEO local change concrètement",
        listItems: [
          { bold: "Apparaître dans le top 3 local :", text: " 75% des clics vont aux 3 premiers résultats" },
          { bold: "Leads gratuits et récurrents :", text: " Contrairement aux pubs, le SEO travaille 24/7 sans frais par clic" },
          { bold: "Crédibilité accrue :", text: " Apparaître en premier inspire confiance automatiquement" },
          { bold: "Ciblage précis :", text: " Vous attirez des clients dans votre zone de service exacte" }
        ]
      }
    ],
    cta: {
      title: "Propulsez-vous en tête de Google",
      desc: "On vous place là où vos clients vous cherchent. Audit SEO gratuit pour votre entreprise de construction.",
      btnText: "Apparaître sur Google →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'se-demarquer-concurrence',
    tag: 'Problème 04',
    datePublished: '2026-03-10',
    titlePart1: '',
    titleHighlight: 'Difficile de se démarquer de la concurrence',
    intro: "Quand tout le monde offre les mêmes services au même prix, comment gagner? En étant différent — stratégiquement.",
    blocks: [
      {
        title: "Le piège du prix comme seul argument",
        paragraphs: [
          "Quand votre positionnement n'est pas clair, les clients comparent uniquement les prix. Vous vous retrouvez à baisser vos marges pour décrocher des contrats que vous auriez pu avoir à meilleur tarif avec le bon positionnement.",
          "La différenciation n'est pas une question de prix — c'est une question de perception. Les entreprises qui se démarquent clairement n'ont pas à se battre sur le prix parce que les clients perçoivent une valeur supérieure."
        ],
        listItems: [
          { bold: 'Spécialisation :', text: " Être reconnu pour un type de projet précis vaut plus que d'être générique." },
          { bold: 'Histoire de marque :', text: " Les clients achètent de l'humain — votre histoire compte." },
          { bold: 'Preuves sociales :', text: " Réalisations, témoignages, avant/après — montrer plutôt que dire." }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "On définit votre positionnement unique et on le communique clairement sur tous vos canaux — site web, réseaux sociaux, publicités. Vous cessez d'être un entrepreneur parmi d'autres pour devenir LA référence dans votre spécialité."
        }
      },
      {
        title: "Êtes-vous en train de vous fondre dans la masse?",
        listItems: [
          { text: "Votre slogan pourrait appartenir à n'importe quelle autre entreprise" },
          { text: "Vous répondez à tous les types de projets sans spécialité claire" },
          { text: "Vos clients ne savent pas vraiment ce qui vous distingue" },
          { text: "Vous perdez des soumissions face à des concurrents moins expérimentés" },
          { text: "Vous n'avez pas de section 'réalisations' convaincante sur votre site" }
        ]
      },
      {
        title: "Ce qu'un positionnement clair vous apporte",
        listItems: [
          { bold: "Attirer les bons clients :", text: " Ceux qui cherchent exactement ce que vous faites le mieux" },
          { bold: "Justifier vos prix :", text: " La spécialisation commande des tarifs plus élevés" },
          { bold: "Notoriété locale :", text: " Devenir la référence dans votre niche géographique" },
          { bold: "Moins de compétition directe :", text: " Plus votre niche est précise, moins vous avez de rivaux directs" }
        ]
      }
    ],
    cta: {
      title: "Devenez LA référence dans votre domaine",
      desc: "On vous aide à définir et communiquer ce qui vous rend unique. Votre positionnement, votre force.",
      btnText: "Me démarquer maintenant →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'reseaux-sociaux',
    tag: 'Problème 05',
    datePublished: '2026-03-10',
    titlePart1: '',
    titleHighlight: 'Aucune stratégie sur les réseaux sociaux',
    intro: "Vos chantiers sont impressionnants. Mais si personne ne les voit en ligne, vous passez à côté d'une vitrine gratuite et puissante.",
    blocks: [
      {
        title: "Pourquoi les réseaux sociaux sont essentiels en construction",
        paragraphs: [
          "Facebook et Instagram ne sont pas juste pour les restaurants et les boutiques. Dans la construction, les transformations visuelles — avant/après, avancement de chantier, finitions — génèrent un engagement énorme et créent une preuve concrète de votre expertise.",
          "Un propriétaire qui voit vos réalisations défiler dans son fil d'actualité pense à vous en premier quand il a un projet. C'est de la notoriété gratuite que vous laissez sur la table chaque jour sans présence active."
        ],
        listItems: [
          { bold: 'Avant/après :', text: " Le contenu qui performe le mieux dans la construction — fort impact visuel." },
          { bold: 'Avancement de chantier :', text: " Crée de l'anticipation et montre votre processus sérieux." },
          { bold: 'Équipe en action :', text: " Humanise votre entreprise et bâtit la confiance." }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "On crée et gère votre présence sur Facebook et Instagram — contenu régulier, photos professionnelles de vos réalisations, stories d'avancement. Votre communauté grossit, votre notoriété augmente, et les demandes entrent."
        }
      },
      {
        title: "Les signes que vous manquez des opportunités",
        listItems: [
          { text: "Votre dernière publication remonte à plus de 3 mois" },
          { text: "Vous n'avez jamais reçu un message direct d'un client potentiel via Instagram" },
          { text: "Vous n'avez pas de photos professionnelles de vos réalisations" },
          { text: "Votre page Facebook a moins de 200 abonnés" },
          { text: "Vous ne faites jamais de contenu avant/après" }
        ]
      },
      {
        title: "Ce qu'une présence active sur les réseaux vous apporte",
        listItems: [
          { bold: "Notoriété locale :", text: " Vous devenez reconnaissable dans votre communauté" },
          { bold: "Preuve sociale en temps réel :", text: " Chaque post est une démonstration de votre savoir-faire" },
          { bold: "Leads entrants organiques :", text: " Des clients qui viennent à vous via vos publications" },
          { bold: "Référencement boosté :", text: " Une présence sociale active aide votre SEO Google" }
        ]
      }
    ],
    cta: {
      title: "Montrez votre travail au monde",
      desc: "On gère vos réseaux sociaux pour que vos réalisations travaillent pour vous, même le soir et les fins de semaine.",
      btnText: "Activer mes réseaux sociaux →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'reputation-en-ligne',
    tag: 'Problème 06',
    datePublished: '2026-03-10',
    titlePart1: '',
    titleHighlight: 'Gestion de réputation en ligne inexistante',
    intro: "Vos clients sont satisfaits mais silencieux en ligne. Pendant ce temps, un avis négatif peut faire fuir 10 clients potentiels.",
    blocks: [
      {
        title: "Pourquoi les avis Google sont votre meilleur outil de vente",
        paragraphs: [
          "Plus de 90% des consommateurs lisent les avis en ligne avant de choisir un entrepreneur. Un profil avec 50 avis 5 étoiles écrase systématiquement un concurrent sans avis, même si ce concurrent est meilleur sur le terrain.",
          "Le problème c'est que les clients satisfaits ne pensent pas spontanément à laisser un avis. Ceux qui ont eu un problème, eux, n'oublient pas. Sans stratégie proactive, votre réputation en ligne ne reflète pas la réalité de votre travail."
        ],
        listItems: [
          { bold: 'Collecte automatisée :', text: " Un système simple qui rappelle aux clients satisfaits de laisser un avis." },
          { bold: 'Gestion des avis négatifs :', text: " Répondre correctement transforme un problème en preuve de professionnalisme." },
          { bold: 'Réputation sur plusieurs plateformes :', text: " Google, Facebook, et autres annuaires locaux." }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "On met en place un système de collecte d'avis automatisé et on gère vos réponses aux commentaires. Votre réputation en ligne devient un actif qui travaille pour vous, générant confiance et nouveaux contrats en continu."
        }
      },
      {
        title: "Évaluez votre réputation en ligne maintenant",
        listItems: [
          { text: "Vous avez moins de 20 avis Google" },
          { text: "Votre note moyenne est en dessous de 4.5 étoiles" },
          { text: "Vous ne répondez jamais aux avis — bons ou mauvais" },
          { text: "Vous n'avez aucun processus pour demander des avis après un projet" },
          { text: "Vos concurrents ont plus d'avis que vous malgré moins d'années d'expérience" }
        ]
      },
      {
        title: "Ce qu'une bonne réputation en ligne génère",
        listItems: [
          { bold: "Confiance instantanée :", text: " 50+ avis 5 étoiles et les clients appellent sans hésiter" },
          { bold: "Meilleur classement Google :", text: " Les avis influencent directement votre position locale" },
          { bold: "Bouche-à-oreille numérique :", text: " Chaque avis est une recommandation publique permanente" },
          { bold: "Avantage concurrentiel durable :", text: " Difficile à rattraper pour vos concurrents une fois établi" }
        ]
      }
    ],
    cta: {
      title: "Bâtissez une réputation qui vend pour vous",
      desc: "On met en place votre stratégie de réputation en ligne. Vos clients satisfaits deviennent votre meilleure publicité.",
      btnText: "Gérer ma réputation →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'site-mobile',
    tag: 'Problème 07',
    datePublished: '2026-03-10',
    titlePart1: '',
    titleHighlight: 'Site web non adapté aux appareils mobiles',
    intro: "70% de vos clients potentiels cherchent sur leur téléphone. Si votre site ne fonctionne pas sur mobile, vous perdez ces clients avant même qu'ils vous appellent.",
    blocks: [
      {
        title: "Le mobile d'abord — la réalité de 2025",
        paragraphs: [
          "Aujourd'hui, la majorité des recherches 'entrepreneur près de moi' se font depuis un téléphone intelligent. Si votre site est lent, difficile à naviguer, ou impossible à lire sans zoomer, le visiteur quitte en moins de 3 secondes pour aller chez votre concurrent.",
          "Google pénalise aussi les sites non-mobiles dans ses résultats de recherche. Un site inadapté vous fait donc perdre sur deux fronts : vous perdez les visiteurs ET vous descendez dans Google."
        ],
        listItems: [
          { bold: 'Vitesse de chargement :', text: " Chaque seconde de délai coûte 20% de conversions supplémentaires." },
          { bold: 'Design responsif :', text: " Le site doit s'adapter parfaitement à toutes les tailles d'écran." },
          { bold: 'Bouton d\'appel direct :', text: " Sur mobile, le client doit pouvoir vous appeler en un clic." }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "On conçoit ou refontes votre site web pour qu'il soit ultra-rapide, parfaitement lisible sur mobile, et optimisé pour convertir les visiteurs en appels. Un bouton d'appel bien placé sur mobile peut doubler vos demandes de soumissions."
        }
      },
      {
        title: "Testez votre site mobile maintenant",
        listItems: [
          { text: "Ouvrez votre site sur votre téléphone — est-ce facile à lire sans zoomer?" },
          { text: "Votre numéro de téléphone est-il cliquable directement?" },
          { text: "Le site se charge-t-il en moins de 3 secondes sur mobile?" },
          { text: "Les boutons sont-ils assez grands pour être cliqués facilement?" },
          { text: "Google PageSpeed indique-t-il un score en dessous de 70?" }
        ]
      },
      {
        title: "Ce qu'un site mobile-first change pour vous",
        listItems: [
          { bold: "Zéro client perdu à cause du site :", text: " Chaque visiteur reste et trouve ce qu'il cherche" },
          { bold: "Plus de demandes de soumissions :", text: " Un parcours fluide = plus de conversions" },
          { bold: "Meilleur classement Google :", text: " Google favorise les sites rapides et mobiles" },
          { bold: "Image professionnelle :", text: " Un site moderne inspire confiance instantanément" }
        ]
      }
    ],
    cta: {
      title: "Un site qui performe sur tous les écrans",
      desc: "On refait votre site web pour qu'il soit rapide, moderne, et optimisé mobile. Vos clients vous trouvent et vous appellent.",
      btnText: "Refaire mon site web →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'google-ads-construction',
    tag: 'Stratégie Avancée',
    datePublished: '2026-03-26',
    titlePart1: 'Google Ads pour entrepreneurs en construction : ',
    titleHighlight: 'ça vaut-il vraiment la peine',
    titlePart3: '?',
    intro: "Vous avez entendu parler de Google Ads mais vous ne savez pas si c'est fait pour votre business de construction ? Voici la vérité — chiffres à l'appui.",
    blocks: [
      {
        title: "Pourquoi Google Ads est l'outil le plus puissant en construction",
        paragraphs: [
          "Contrairement aux réseaux sociaux où vous interrompez des gens qui ne cherchent pas votre service, Google Ads vous place devant des personnes qui cherchent EXACTEMENT ce que vous faites — en ce moment précis. Quelqu'un tape 'entrepreneur général Saint-Eustache' ? Votre publicité apparaît en premier, avant tous vos concurrents.",
          "Dans la construction, le coût moyen d'un projet tourne entre 15 000 $ et 150 000 $. Décrocher un seul contrat supplémentaire par mois via Google Ads peut rapporter 10x à 50x votre investissement publicitaire. C'est le médium avec le meilleur retour sur investissement pour les entreprises de construction."
        ],
        listItems: [
          { bold: 'Intention d\'achat maximale :', text: " Les gens cherchent activement un entrepreneur — ils sont prêts à signer." },
          { bold: 'Géociblage précis :', text: " Vous payez uniquement quand quelqu'un dans votre zone cherche vos services." },
          { bold: 'Résultats immédiats :', text: " Contrairement au SEO qui prend des mois, Google Ads génère des appels dès le premier jour." }
        ],
        solutionBox: {
          label: 'Comment Propulsite gère vos Google Ads',
          text: "On crée et optimise vos campagnes Google Ads de A à Z — choix des mots-clés, rédaction des annonces, pages de destination optimisées et suivi des conversions. Chaque dollar investi est tracké pour maximiser votre retour."
        }
      },
      {
        title: "Les erreurs qui font brûler votre budget publicitaire",
        paragraphs: [
          "La plupart des entrepreneurs qui ont 'essayé Google Ads et trouvé que ça ne marche pas' ont commis des erreurs évitables. Sans les bonnes configurations, vous payez des clics inutiles qui ne convertissent jamais."
        ],
        listItems: [
          { bold: 'Mots-clés trop génériques :', text: " 'construction' attire des gens qui cherchent n'importe quoi — et vous coûte une fortune." },
          { bold: 'Pas de mots-clés négatifs :', text: " Sans liste d'exclusions, vous payez pour des clics hors-cible (emploi, DIY, etc.)." },
          { bold: 'Page de destination inefficace :', text: " Envoyer les visiteurs sur votre page d'accueil plutôt qu'une page dédiée réduit vos conversions de 60%." },
          { bold: 'Pas de suivi des appels :', text: " Sans tracking, impossible de savoir quelles annonces génèrent de vrais contrats." }
        ]
      },
      {
        title: "Les résultats réalistes à attendre avec une bonne campagne",
        paragraphs: [
          "Voici ce que vous pouvez espérer avec une campagne Google Ads bien structurée pour une entreprise de construction au Québec, avec un budget mensuel de 800 $ à 2 000 $ :"
        ],
        listItems: [
          { bold: '8 à 20 demandes de soumissions qualifiées par mois :', text: " Des leads qui cherchent exactement ce que vous offrez." },
          { bold: 'Coût par lead entre 40 $ et 120 $ :', text: " Sur un contrat de 20 000 $, c'est un investissement négligeable." },
          { bold: 'Retour sur investissement de 5x à 20x :', text: " Chaque dollar investi rapporte entre 5 $ et 20 $ en chiffre d'affaires." },
          { bold: 'Résultats dès la première semaine :', text: " Les premiers appels arrivent souvent dans les 48 à 72 heures." }
        ],
        solutionBox: {
          label: 'Conseil de pro',
          text: "Combinez Google Ads (résultats immédiats) et SEO local (résultats durables) pour une stratégie complète. Les Ads génèrent des leads pendant que le SEO monte — et dans 6 mois, vous dominez Google sur les deux fronts."
        }
      },
      {
        title: "Google Ads vs autres canaux : le comparatif honnête",
        listItems: [
          { bold: 'Google Ads :', text: " Résultats immédiats, coût par clic, intention d'achat maximale. Idéal pour générer des leads rapidement." },
          { bold: 'SEO local :', text: " Gratuit à long terme, prend 3 à 6 mois à bâtir, durable et cumulatif." },
          { bold: 'Facebook/Instagram Ads :', text: " Bonne notoriété, intention d'achat plus faible, idéal pour le branding et le remarketing." },
          { bold: 'Bouche-à-oreille :', text: " Gratuit mais imprévisible — ne peut pas être votre seule source de leads." }
        ]
      }
    ],
    cta: {
      title: "Prêt à décrocher plus de contrats dès cette semaine ?",
      desc: "On lance votre campagne Google Ads conçue spécifiquement pour les entrepreneurs en construction. Les premiers appels arrivent en 48h.",
      btnText: "Lancer mes Google Ads →",
      btnLink: "/funnel"
    }
  },
  {
    slug: 'geo-chatgpt-construction',
    tag: 'Nouveauté 2026',
    datePublished: '2026-06-25',
    titlePart1: 'Le ',
    titleHighlight: 'GEO',
    titlePart3: " : comment l'IA peut recommander votre entreprise de construction",
    intro: "Le GEO (Generative Engine Optimization) consiste à optimiser votre présence en ligne pour que les intelligences artificielles — ChatGPT, l'IA de Google (AI Overviews), Perplexity, Gemini — citent et recommandent votre entreprise quand un client leur pose une question. Voici pourquoi c'est en train de changer la game pour les entrepreneurs en construction au Québec — et comment en profiter avant vos concurrents.",
    blocks: [
      {
        title: 'Le GEO en clair (et pourquoi ce n\'est pas juste un buzzword)',
        paragraphs: [
          "De plus en plus de propriétaires ne tapent plus seulement « entrepreneur rénovation Laval » dans Google. Ils ouvrent ChatGPT ou l'IA de Google et demandent, en pleine phrase : « Quel entrepreneur fiable pour refaire ma toiture dans la région de Saint-Eustache ? » Et l'IA leur répond avec quelques noms, directement.",
          "Le GEO, c'est tout ce qu'on met en place pour que CE soit votre nom qui sorte de la bouche de l'IA. Là où le SEO vise à apparaître dans la liste des liens bleus, le GEO vise à être la réponse — la recommandation citée par l'intelligence artificielle."
        ],
        solutionBox: {
          label: 'À retenir',
          text: "Le SEO vous fait apparaître dans les résultats de recherche. Le GEO vous fait recommander directement par l'IA. Les deux se bâtissent ensemble, et celui qui s'y met en premier prend une longueur d'avance difficile à rattraper."
        }
      },
      {
        title: 'Pourquoi ça explose maintenant',
        paragraphs: [
          "Google a déployé ses « AI Overviews » (les réponses générées par IA tout en haut des résultats) à grande échelle, et des centaines de millions de personnes utilisent ChatGPT chaque semaine. Une part grandissante des recherches passe désormais par une réponse générée par une IA, AVANT même que la personne clique sur un site.",
          "Concrètement : si l'IA résume « les meilleurs entrepreneurs de votre région » sans jamais vous nommer, vous perdez le client avant même qu'il visite un seul site web. L'enjeu n'est plus seulement d'être bien classé — c'est d'être cité."
        ]
      },
      {
        title: 'SEO et GEO : la différence en une image',
        listItems: [
          { bold: 'SEO :', text: " votre site grimpe dans la liste des résultats Google. Le client doit cliquer, comparer, choisir." },
          { bold: 'GEO :', text: " l'IA lit le web, fait le tri, et nomme directement quelques entreprises. Le client reçoit une recommandation, pas une liste." },
          { bold: 'Le point commun :', text: " les deux récompensent un site clair, crédible, bien structuré et reconnu. C'est pour ça qu'on les bâtit ensemble." }
        ]
      },
      {
        title: 'Comment faire pour que l\'IA vous recommande',
        paragraphs: [
          "Bonne nouvelle : se faire citer par l'IA repose sur des fondations concrètes et atteignables, surtout dans un marché local comme la construction au Québec."
        ],
        listItems: [
          { bold: 'Répondre clairement aux vraies questions :', text: " des pages et un blogue qui répondent directement aux questions que vos clients posent (« combien coûte une rénovation de salle de bain ? », « comment choisir un couvreur ? »)." },
          { bold: 'Des informations structurées et cohérentes :', text: " nom, services, territoire, coordonnées identiques partout (site, fiche Google, annuaires). L'IA fait confiance à ce qui est cohérent." },
          { bold: 'Une vraie preuve de crédibilité :', text: " avis clients, réalisations, années d'expérience — les signaux que l'IA utilise pour décider qui recommander." },
          { bold: 'Laisser les robots IA lire votre site :', text: " une configuration technique qui autorise les moteurs d'IA à explorer et comprendre votre contenu." }
        ],
        solutionBox: {
          label: 'Comment Propulsite règle ce problème',
          text: "Avec notre service Domination Google, on bâtit votre SEO ET votre GEO en même temps : contenu qui répond aux vraies questions, données structurées, fiche Google optimisée, avis clients et configuration technique pour les moteurs d'IA. Objectif : être le nom que Google classe en premier ET celui que l'IA recommande."
        }
      }
    ],
    cta: {
      title: "Soyez le nom que l'IA recommande",
      desc: "Pendant que vos concurrents ignorent encore le GEO, prenez l'avance. On vous rend visible sur Google et dans les réponses des intelligences artificielles. Consultation gratuite, sans engagement.",
      btnText: "Parler de ma visibilité IA →",
      btnLink: "/funnel"
    }
  }
];
