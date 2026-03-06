import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Rocket, Target, Search, Users, Smartphone, Star, TrendingUp, Send } from 'lucide-react';

export default function Blog() {
    const painPoints = [
        {
            num: "01",
            icon: <TrendingUp className="w-8 h-8 text-accent-blue" />,
            title: "Pas assez de contrats de construction ?",
            desc: "Le carnet de commandes se vide entre deux projets de rénovation ou de construction neuve, et les appels entrants se font rares. Sans stratégie de marketing numérique ciblée pour les entrepreneurs, les clients potentiels (résidentiels ou commerciaux) ne peuvent tout simplement pas vous trouver. Une présence en ligne bien optimisée transforme votre site web en un véritable générateur de leads qualifiés, travaillant pour vous 24/7, même quand vous êtes sur le chantier.",
            link: "/services/google-ads"
        },
        {
            num: "02",
            icon: <Target className="w-8 h-8 text-accent-blue" />,
            title: "Une image de marque datée qui repousse les clients",
            desc: "Un logo vieillissant, des couleurs passées, un site web d'une autre époque : votre identité visuelle ne reflète plus la qualité exceptionnelle de votre travail sur le terrain. Dans un secteur de la construction hautement compétitif, la première impression se fait désormais à 100% en ligne. Une image de marque moderne, professionnelle et rassurante inspire confiance dès le premier regard et justifie votre tarification auprès des clients.",
            link: "/services/design-graphique"
        },
        {
            num: "03",
            icon: <Search className="w-8 h-8 text-accent-blue" />,
            title: "Totalement invisible sur Google (SEO et Local)",
            desc: "Vos principaux concurrents apparaissent en premier dans les résultats Google pendant que votre entreprise de construction est reléguée à la page 3. La grande majorité des clients cherchent « entrepreneur général près de moi » avant de décrocher leur téléphone. Sans un référencement naturel (SEO) puissant et adapté aux requêtes locales de la construction, vous laissez des dizaines de chantiers lucratifs sur la table chaque mois.",
            link: "/services/referencement-seo"
        },
        {
            num: "04",
            icon: <Users className="w-8 h-8 text-accent-blue" />,
            title: "Difficulté à se démarquer de la concurrence",
            desc: "Trop d'entreprises de construction se ressemblent : mêmes services (rénovation, agrandissement, toiture), même discours promotionnel, même visuel générique. Sans un positionnement stratégique clair, vous vous battez uniquement sur le prix, ce qui réduit vos marges de profit. Définir votre proposition de valeur unique (expertise spécialisée, rapidité, finition haut de gamme) vous permet d'attirer les clients idéaux.",
            link: "/services/conception-site-web"
        },
        {
            num: "05",
            icon: <Rocket className="w-8 h-8 text-accent-blue" />,
            title: "Aucune stratégie sur les réseaux sociaux",
            desc: "Vos chantiers avancent vite et les transformations (avant/après) sont impressionnantes, mais personne ne le voit. Les plateformes sociales (Facebook, Instagram, LinkedIn) sont des vitrines gratuites et extrêmement puissantes pour prouver votre savoir-faire en temps réel. Partager l'avancement d'un chantier, la finition détaillée ou l'équipe au travail renforce instantanément votre crédibilité et bâtit une communauté engagée autour de votre marque.",
            link: "/services/medias-sociaux"
        },
        {
            num: "06",
            icon: <Star className="w-8 h-8 text-accent-blue" />,
            title: "Gestion de réputation en ligne inexistante",
            desc: "Vos clients finaux sont extrêmement satisfaits de leurs travaux, mais ils ne pensent pas à laisser d'avis sur Google ou Facebook. Or, plus de 90% des consommateurs lisent attentivement les avis (reviews) avant de signer un contrat avec un entrepreneur. Mettre en place une stratégie simple et automatisée de collecte d'avis 5 étoiles (et de gestion des commentaires) deviendra votre outil de vente le plus persuasif.",
            link: "/services/creation-contenu"
        },
        {
            num: "07",
            icon: <Smartphone className="w-8 h-8 text-accent-blue" />,
            title: "Site web non adapté aux appareils mobiles",
            desc: "Aujourd'hui, plus de 70% des recherches pour trouver un entrepreneur se font directement depuis un téléphone intelligent (smartphone). Si votre site web est lent à charger, difficile à lire sans zoomer, ou s'il plante sur mobile, les clients potentiels quittent immédiatement pour aller chez le concurrent. Un site web responsif, ultra-rapide et clair est la base absolue de toute tactique numérique réussie.",
            link: "/services/conception-site-web"
        }
    ];

    return (
        <div className="pt-32 pb-24 px-6 relative z-10 overflow-hidden">

            {/* Background Glows Specific to Blog */}
            <div className="absolute top-40 left-10 w-96 h-96 bg-accent-blue/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container mx-auto max-w-4xl">

                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,198,255,0.3)]">
                        Article de Blog
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        7 PROBLÈMES QUI FREINENT LES <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-purple-400">COMPAGNIES DE CONSTRUCTION</span> EN LIGNE
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Vous bâtissez des projets solides, mais votre présence numérique ne suit pas? Voici les obstacles les plus fréquents — et comment les surmonter pour exploser vos ventes.
                    </p>
                </motion.div>

                {/* DIVIDER */}
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-blue to-transparent mx-auto mb-20 opacity-50"></div>

                {/* PAIN POINTS LIST */}
                <div className="space-y-8 mb-20">
                    {painPoints.map((point, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md hover:border-accent-blue/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,198,255,0.15)] group flex flex-col md:flex-row gap-6 items-start"
                        >
                            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,198,255,0.2)]">
                                {point.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-3xl font-black text-white/10 group-hover:text-accent-blue/30 transition-colors">
                                        {point.num}
                                    </span>
                                    <h2 className="text-2xl font-bold text-white group-hover:text-accent-blue transition-colors">
                                        {point.title}
                                    </h2>
                                </div>
                                <p className="text-white/60 leading-relaxed text-lg mb-6">
                                    {point.desc}
                                </p>
                                <Link
                                    to={point.link}
                                    className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-accent-blue hover:text-white transition-colors"
                                >
                                    En savoir plus <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA SECTION */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 p-10 md:p-14 rounded-3xl text-center overflow-hidden shadow-[0_0_50px_rgba(0,198,255,0.2)]"
                >
                    {/* Decorative background elements inside CTA */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
                            VOTRE ENTREPRISE SE <span className="italic text-accent-blue">RECONNAÎT</span> LÀ-DEDANS?
                        </h2>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Propulsite aide les compagnies de construction à prendre leur place en ligne et à générer des leads de qualité. Parlons de votre situation.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="mailto:propulsiteprojet@gmail.com"
                                className="px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white/10 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
                            >
                                Contactez-nous
                            </a>
                            <Link
                                to="/funnel"
                                className="px-8 py-4 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,198,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
                            >
                                Démarrer un projet <Send className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
