import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { ArrowRight, HardHat } from 'lucide-react';
import { SERVICES } from '../constants/services';

export default function Home() {
  const homeServices = SERVICES.slice(0, 6);

  const painPoints = [
    {
      title: "Pas assez de contrats ?",
      desc: "Votre carnet de commandes est vide ? Nous ciblons les propriétaires qui cherchent activement vos services.",
    },
    {
      title: "Image de marque datée ?",
      desc: "Votre site web fait peur aux clients ? Modernisez votre image pour refléter la qualité de vos travaux.",
    },
    {
      title: "Perdu dans Google ?",
      desc: "Vos concurrents prennent toute la place ? Nous vous propulsons en tête des résultats locaux.",
    }
  ];

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-3 mb-6 text-accent-blue font-bold tracking-widest uppercase text-sm">
              <HardHat className="w-5 h-5" /> Spécialiste Marketing Construction
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-8 text-3xl-effect">
              <span className="block text-white text-3d mb-2">PROPULSER VOTRE</span>
              <span className="block text-accent-blue text-glow-blue italic text-[0.85em] md:text-[0.9em]">CROISSANCE DIGITALE</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              Nous aidons les <span className="text-white font-bold">entrepreneurs en construction</span> à dominer leur marché local grâce à des stratégies digitales.
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

      {/* Services Section - All Services */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-3d uppercase italic">NOS EXPERTISES</h2>
            <p className="text-white/50 max-w-xl mx-auto">Tout ce dont un entrepreneur a besoin pour bâtir une présence en ligne indestructible.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeServices.map((s, i) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="group">
                <LiquidGlassCard delay={i * 0.1} className="h-full transition-all duration-500 transform group-hover:-translate-y-6 group-hover:scale-[1.03] group-hover:shadow-[0_20px_50px_rgba(0,210,255,0.4)] group-hover:border-accent-blue bg-gradient-to-br hover:from-accent-blue/10 hover:to-transparent">
                  <div className="w-14 h-14 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-8 text-accent-blue border border-accent-blue/20 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent-blue transition-colors uppercase">{s.title}</h3>
                  <p className="text-white/60 mb-8 leading-relaxed">{s.shortDesc}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-accent-blue uppercase tracking-widest">
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </div>
                </LiquidGlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-blue/5 skew-y-3 transform origin-left" />
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black mb-8 leading-tight text-3d">POURQUOI LES ENTREPRENEURS NOUS CHOISISSENT ?</h2>
              <div className="space-y-12">
                {painPoints.map((p, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-4xl font-black text-accent-blue/20">0{i + 1}</div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-accent-blue">{p.title}</h3>
                      <p className="text-white/70 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="aspect-square rounded-3xl border border-white/10 overflow-hidden bg-accent-blue/5 shadow-lg">
                  <img src="/images/placeholder-1.png" alt="Construction Builder" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[3/4] rounded-3xl border border-white/10 overflow-hidden bg-accent-blue/5 shadow-lg">
                  <img src="/images/placeholder-2.png" alt="Digital Blueprint" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="aspect-[3/4] rounded-3xl border border-white/10 overflow-hidden bg-accent-blue/5 shadow-lg">
                  <img src="/images/placeholder-3.png" alt="Excavator Work" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-square rounded-3xl border border-white/10 overflow-hidden bg-accent-blue/5 shadow-lg">
                  <img src="/images/placeholder-4.png" alt="Marketing Analytics" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,210,255,0.1)] border border-white/10 group">
            <img
              src="/images/cta-banner.png"
              alt="Prêt à décoller avec Propulsite ?"
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050a15] via-transparent to-transparent flex items-end p-12">
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
                <p className="text-white/70 max-w-xl text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 delay-100">
                  Prêt à propulser votre entreprise de construction au sommet ? Notre équipe d'experts est prête à décoller avec vous.
                </p>
                <Link to="/contact" className="px-10 py-5 bubble-glass text-white font-black hover:text-accent-blue shrink-0 animate-pulse-glow">
                  DÉMARRER LE PROJET <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
