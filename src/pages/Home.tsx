import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import GeoTeaser from '../components/GeoTeaser';
import ServicesScroll from '../components/ServicesScroll';
import PourquoiNousChoisissent from '../components/PourquoiNousChoisissent';
import CarteRelief from '../components/CarteRelief';
import PretADecoller from '../components/PretADecoller';
import { ArrowRight, HardHat } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta(
    'Marketing construction Québec — plus de contrats | Propulsite',
    'On aide les entrepreneurs en construction du Québec à décrocher plus de contrats grâce au web : site, référencement Google, GEO et pub. Soumission gratuite.'
  );


  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-6 relative pt-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-3 mb-6 text-accent-blue font-bold tracking-widest uppercase text-sm">
              <HardHat className="w-5 h-5" /> Spécialiste Marketing Construction
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-8 text-3xl-effect">
              <span className="block text-white text-3d mb-2">PROPULSEZ VOTRE</span>
              <span className="block text-accent-blue text-glow-blue italic text-[0.62em] md:text-[0.66em]">ENTREPRISE DE CONSTRUCTION</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              Nous aidons les <span className="text-white font-bold">entrepreneurs en construction au Québec</span> à dominer leur marché local grâce au marketing numérique.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link to="/funnel" className="px-10 py-5 bubble-glass text-white font-black hover:text-accent-blue transform hover:-translate-y-1">
                OBTENIR UNE SOUMISSION
              </Link>
              <Link to="/services" className="px-10 py-5 bubble-glass text-white/70 font-bold hover:text-white">
                NOS SERVICES
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nos expertises — defilement, logo colle a droite */}
      <ServicesScroll />

      {/* La notification GEO vient APRES les expertises : une fois les six
          services vus, on decouvre celui dont personne ne parle encore. */}
      <GeoTeaser />

      {/* Pourquoi nous choisissent — pile de cartes, ecran accroche */}
      <PourquoiNousChoisissent />

      {/* Réalisations — vitrine des sites de démonstration */}
      <section id="exemples" className="py-32 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-blue mb-4">Nos réalisations</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Voyez ce qu'on peut <span className="text-accent-blue">bâtir</span> pour vous
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Plutôt que de vous le décrire, on vous le montre. Deux sites complets, conçus pour des entreprises de construction.
            </p>
          </motion.div>

          {/* Les cartes s'inclinent vers le curseur et une lueur les balaie. Le
              relief vit dans leur enveloppe, pas ici. */}
          <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ y: 28 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
          <CarteRelief classeObjet="rounded-2xl">
          <a
            href="/exemples/specimen-01/"
            target="_blank"
            rel="noopener"
            className="group block relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628] hover:border-accent-blue/60 transition-colors"
          >
            <img
              src="/exemples/specimen-01/img/hero.jpg"
              alt="Aperçu du site Spécimen 01, réalisé par Propulsite"
              loading="lazy"
              width={1920}
              height={1080}
              className="w-full h-[280px] md:h-[360px] object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050a15] via-[#050a15]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-accent-blue mb-2">Rénovation haut de gamme</p>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">Spécimen 01</h3>
                <p className="text-white/55 text-sm mt-2 max-w-md">Site vitrine, animations sur mesure, optimisé pour le mobile et pour Google.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border border-white/25 rounded-full px-5 py-3 group-hover:bg-accent-blue group-hover:text-[#050a15] group-hover:border-accent-blue transition-all">
                Visiter le site <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>
          </CarteRelief>
          </motion.div>
          <motion.div
            initial={{ y: 28 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <CarteRelief classeObjet="rounded-2xl">
          <a
            href="/exemples/specimen-02/"
            target="_blank"
            rel="noopener"
            className="group block relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628] hover:border-accent-blue/60 transition-colors"
          >
            <img
              src="/exemples/specimen-02/video/affiche.jpg"
              alt="Aperçu du site Spécimen 02, réalisé par Propulsite"
              loading="lazy"
              width={1920}
              height={1080}
              className="w-full h-[280px] md:h-[360px] object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050a15] via-[#050a15]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-accent-blue mb-2">Constructeur de maisons neuves</p>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">Spécimen 02</h3>
                <p className="text-white/55 text-sm mt-2 max-w-md">Une maison modélisée en 3D qu'on traverse au défilement, avec un plan qui suit la visite.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border border-white/25 rounded-full px-5 py-3 group-hover:bg-accent-blue group-hover:text-[#050a15] group-hover:border-accent-blue transition-all">
                Visiter le site <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>
          </CarteRelief>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Prêt à décoller — la console de lancement.
          Voir le composant : l'ancienne carte cachait l'offre et le bouton
          derrière un survol, donc le trafic mobile ne les voyait jamais. */}
      <PretADecoller />
    </div>
  );
}
