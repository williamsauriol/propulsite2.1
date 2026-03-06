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
                  <div key={i} className="flex gap-6 group">
                    <div className="text-4xl font-black text-accent-blue/20">0{i + 1}</div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-accent-blue">{p.title}</h3>
                      <p className="text-white/70 leading-relaxed mb-3">{p.desc}</p>
                      <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-accent-blue uppercase tracking-widest hover:text-white transition-colors">
                        En savoir plus <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full min-h-[400px]">
              <div className="absolute inset-0 rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_30px_rgba(0,210,255,0.15)] group">
                <div className="absolute inset-0 bg-accent-blue/10 mix-blend-overlay z-10 opacity-50 transition-opacity duration-300 group-hover:opacity-0" />
                <img
                  src="/images/unnamed.jpg"
                  alt="Propulsite équipe en action"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-32 px-6">
        <style>{`
          .cta-container {
            perspective: 1000px;
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .cta-canvas {
            display: grid;
            position: absolute;
            inset: 0;
            z-index: 200;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(5, 1fr);
            gap: 0px 0px;
            grid-template-areas:
              "tr-1 tr-2 tr-3 tr-4 tr-5"
              "tr-6 tr-7 tr-8 tr-9 tr-10"
              "tr-11 tr-12 tr-13 tr-14 tr-15"
              "tr-16 tr-17 tr-18 tr-19 tr-20"
              "tr-21 tr-22 tr-23 tr-24 tr-25";
            /* We need to stretch canvas over the card below */
          }
          
          .cta-tracker {
            position: absolute;
            cursor: pointer;
          }

          /* Explicit grid-area assignments for the 25 trackers */
          .tr-1 { grid-area: tr-1; } .tr-2 { grid-area: tr-2; } .tr-3 { grid-area: tr-3; } .tr-4 { grid-area: tr-4; } .tr-5 { grid-area: tr-5; }
          .tr-6 { grid-area: tr-6; } .tr-7 { grid-area: tr-7; } .tr-8 { grid-area: tr-8; } .tr-9 { grid-area: tr-9; } .tr-10 { grid-area: tr-10; }
          .tr-11 { grid-area: tr-11; } .tr-12 { grid-area: tr-12; } .tr-13 { grid-area: tr-13; } .tr-14 { grid-area: tr-14; } .tr-15 { grid-area: tr-15; }
          .tr-16 { grid-area: tr-16; } .tr-17 { grid-area: tr-17; } .tr-18 { grid-area: tr-18; } .tr-19 { grid-area: tr-19; } .tr-20 { grid-area: tr-20; }
          .tr-21 { grid-area: tr-21; } .tr-22 { grid-area: tr-22; } .tr-23 { grid-area: tr-23; } .tr-24 { grid-area: tr-24; } .tr-25 { grid-area: tr-25; }

          #cta-card {
            position: relative;
            z-index: 0;
            transition: transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transform-style: preserve-3d;
          }

          /* Hover Effects from Trackers */
          .tr-1:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(-10deg) rotateZ(0deg); }
          .tr-2:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(-5deg) rotateZ(0deg); }
          .tr-3:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg); }
          .tr-4:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(5deg) rotateZ(0deg); }
          .tr-5:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(10deg) rotateZ(0deg); }
          
          .tr-6:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(-10deg) rotateZ(0deg); }
          .tr-7:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(-5deg) rotateZ(0deg); }
          .tr-8:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(0deg) rotateZ(0deg); }
          .tr-9:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(5deg) rotateZ(0deg); }
          .tr-10:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(10deg) rotateZ(0deg); }
          
          .tr-11:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(-10deg) rotateZ(0deg); }
          .tr-12:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(-5deg) rotateZ(0deg); }
          .tr-13:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          .tr-14:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(5deg) rotateZ(0deg); }
          .tr-15:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(10deg) rotateZ(0deg); }
          
          .tr-16:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(-10deg) rotateZ(0deg); }
          .tr-17:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(-5deg) rotateZ(0deg); }
          .tr-18:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(0deg) rotateZ(0deg); }
          .tr-19:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(5deg) rotateZ(0deg); }
          .tr-20:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(10deg) rotateZ(0deg); }
          
          .tr-21:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(-10deg) rotateZ(0deg); }
          .tr-22:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(-5deg) rotateZ(0deg); }
          .tr-23:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg); }
          .tr-24:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(5deg) rotateZ(0deg); }
          .tr-25:hover ~ #cta-card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(10deg) rotateZ(0deg); }

          /* Glow effect on hover */
          .cta-tracker:hover ~ #cta-card {
            filter: brightness(1.1);
          }

          /* 3D text and button inside #cta-card */
          #cta-card .cta-3d-content {
            transform: translateZ(0);
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .cta-container:hover #cta-card .cta-3d-content {
            transform: translateZ(50px);
          }
          
          #cta-card .cta-3d-btn {
            transform: translateZ(0);
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .cta-container:hover #cta-card .cta-3d-btn {
            transform: translateZ(80px); /* Extruded more than text */
          }
        `}</style>

        <Link to="/funnel" className="block container mx-auto max-w-5xl select-none group">
          <div className="cta-container w-full h-full">
            <div className="cta-canvas">
              {/* Generating 25 Trackers */}
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`cta-tracker tr-${i + 1}`} />
              ))}
            </div>

            <div id="cta-card" className="rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,210,255,0.15)] border border-white/10 bg-gradient-to-br from-[#0a1526] to-[#050a15] w-full h-full pointer-events-none">
              {/* Decorative background instead of specific image */}
              <div className="absolute inset-0 bg-accent-blue/5 transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-blue/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-blue/10 rounded-full blur-[60px]" />

              <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 h-full">
                <div className="flex-1 text-center md:text-left cta-3d-content">
                  <h2 className="text-4xl md:text-5xl font-black mb-4 text-white text-3d drop-shadow-2xl">
                    Prêt à décoller avec Propulsite ?
                  </h2>
                  <p className="text-white/70 text-lg drop-shadow-lg">
                    Prêt à propulser votre entreprise de construction au sommet ? Notre équipe d'experts est prête à décoller avec vous.
                  </p>
                </div>
                <div className="shrink-0 cta-3d-btn">
                  <div className="px-8 py-5 bg-accent-blue group-hover:bg-white text-[#050a15] rounded-[50px] font-black tracking-widest shadow-[0_30px_50px_rgba(0,210,255,0.4)] transition-colors inline-flex items-center">
                    DÉCOLLAGE <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
