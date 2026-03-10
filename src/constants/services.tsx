import React from 'react';
import { Layout, Search, Megaphone, Users, Palette, MessageSquare, Globe, Zap } from 'lucide-react';

export interface Service {
  slug: string;
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  color: string;
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
    ]
  },
  {
    slug: 'seo',
    title: 'Référencement SEO',
    icon: <Globe className="w-8 h-8" />,
    color: '#10b981', // Emerald
    shortDesc: 'Une visibilité organique durable pour dominer votre secteur.',
    fullDesc: "Le SEO est un marathon, pas un sprint. Nous optimisons votre site pour qu'il grimpe naturellement dans les résultats de recherche. Pour les compagnies de construction, le SEO local est crucial : nous vous aidons à devenir la référence dans votre ville et les environs.",
    features: [
      'Audit technique complet',
      'Optimisation SEO on-page',
      'Stratégie de contenu et blogue',
      'Netlinking et autorité de domaine',
      'Optimisation Google Business Profile'
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
    ]
  }
];
