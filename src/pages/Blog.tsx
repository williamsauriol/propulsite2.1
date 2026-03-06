import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Rocket, Target, Search, Users, Smartphone, Star, TrendingUp, Send } from 'lucide-react';

export default function Blog() {
    const painPoints = [
        {
            num: "01",
            icon: <TrendingUp className="w-8 h-8 text-accent-blue" />,
            title: "Pas assez de contrats?",
            desc: "Le carnet de commandes se vide entre deux projets et les appels entrants se font rares. Sans stratégie numérique claire, les clients potentiels ne savent tout simplement pas que vous existez. Une présence en ligne bien optimisée transforme votre site en véritable générateur de leads, même quand vous êtes sur le chantier."
        },
        {
            num: "02",
            icon: <Target className="w-8 h-8 text-accent-blue" />,
            title: "Image de marque datée",
            desc: "Un logo vieillissant, un site web d'une autre époque, une identité visuelle qui ne reflète plus la qualité de votre travail. Dans un secteur compétitif, la première impression se fait en ligne. Une image de marque moderne inspire confiance dès le premier regard et positionne votre entreprise comme un acteur sérieux et professionnel."
        },
        {
            num: "03",
            icon: <Search className="w-8 h-8 text-accent-blue" />,
            title: "Perdu dans Google",
            desc: "Vos concurrents apparaissent en premier sur Google pendant que votre site est introuvable. La majorité des clients cherchent un entrepreneur en ligne avant de décrocher leur téléphone. Sans référencement SEO adapté à la construction, vous laissez des dizaines de contrats sur la table chaque mois."
        },
        {
            num: "04",
            icon: <Users className="w-8 h-8 text-accent-blue" />,
            title: "Difficile de se démarquer",
            desc: "Trop d'entreprises de construction se ressemblent : mêmes services, même discours, même visuel générique. Sans positionnement clair, vous vous battez uniquement sur le prix. Définir ce qui vous rend unique — votre expertise, votre région, votre spécialité — vous permet d'attirer exactement les clients que vous voulez."
        },
        {
            num: "05",
            icon: <Rocket className="w-8 h-8 text-accent-blue" />,
            title: "Aucune présence sociale",
            desc: "Les chantiers avancent, les transformations sont impressionnantes, mais personne ne le voit. Les réseaux sociaux sont une vitrine gratuite et puissante pour montrer votre savoir-faire en temps réel. Avant/après, avancement de chantier, témoignages — chaque publication renforce votre crédibilité et élargit votre réseau."
        },
        {
            num: "06",
            icon: <Star className="w-8 h-8 text-accent-blue" />,
            title: "Réputation en ligne invisible",
            desc: "Vos clients sont satisfaits, mais ils ne laissent pas d'avis Google. Or, 90% des consommateurs lisent les avis avant de choisir un entrepreneur. Une stratégie simple de collecte d'avis et de gestion de réputation peut devenir votre meilleur outil de vente — plus convaincant que n'importe quelle publicité."
        },
        {
            num: "07",
            icon: <Smartphone className="w-8 h-8 text-accent-blue" />,
            title: "Site web non adapté (Mobile)",
            desc: "Plus de 70% des recherches se font depuis un téléphone. Si votre site est lent, difficile à naviguer ou tout simplement absent, les clients potentiels repartent chez le concurrent en quelques secondes. Un site rapide, clair et adapté au mobile est aujourd'hui la base incontournable de toute stratégie numérique efficace."
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
                                <p className="text-white/60 leading-relaxed text-lg">
                                    {point.desc}
                                </p>
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
                                href="mailto:info@propulse.ca"
                                className="px-8 py-4 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,198,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
                            >
                                Obtenir une consultation gratuite <Send className="w-5 h-5" />
                            </a>
                            <Link
                                to="/funnel"
                                className="px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                            >
                                Démarrer un projet
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
