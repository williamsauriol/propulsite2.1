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
      <section className="py-32 px-6 flex justify-center">
        <style>{`
          .widget-container {
            position: relative;
            width: 560px;
            height: 280px;
            transition: 200ms;
            user-select: none;
            margin: 0 auto;
          }
          .widget-container:active { height: 270px; }
          .widget-canvas {
            perspective: 800px;
            position: absolute;
            inset: 0;
            z-index: 200;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(5, 1fr);
          }
          .widget-tracker {
            position: absolute;
            z-index: 200;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          #widget-card {
            position: absolute;
            inset: 0;
            z-index: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            padding: 28px 32px;
            border-radius: 24px;
            transition: 700ms;
            background: linear-gradient(135deg, #0a1628 0%, #0f2044 50%, #0a1628 100%);
            border: 1px solid rgba(59, 130, 246, 0.2);
            overflow: hidden;
          }
          #widget-card::before {
            content: "";
            position: absolute;
            inset: -2px;
            border-radius: 26px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8, #60a5fa);
            opacity: 0;
            z-index: -1;
            transition: opacity 300ms;
          }
          .widget-container:hover #widget-card::before { opacity: 0.6; }
          #widget-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
              radial-gradient(1.5px 1.5px at 15% 25%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(2px 2px at 60% 15%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 80% 80%, rgba(255,255,255,0.35) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 92% 40%, rgba(255,255,255,0.25) 0%, transparent 100%);
            pointer-events: none;
          }
          #widget-prompt {
            font-size: 42px;
            font-weight: 900;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: -1px;
            line-height: 1.1;
            transition: 300ms ease-in-out;
            z-index: 10;
            text-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
            margin: 0;
          }
          .widget-description {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 32px;
            opacity: 0;
            transition: opacity 300ms ease-in-out;
            transition-delay: 100ms;
            z-index: 10;
            text-align: center;
            gap: 20px;
          }
          .widget-description p { font-size: 17px; color: #e2e8f0; line-height: 1.6; max-width: 380px; margin: 0; }
          .widget-description .cta-btn {
            display: inline-block;
            background: #2563eb;
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            padding: 12px 28px;
            border-radius: 8px;
            text-decoration: none;
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
          }
          .widget-rocket {
            position: absolute;
            top: 24px;
            right: 28px;
            font-size: 36px;
            z-index: 10;
            transition: transform 300ms ease-in-out;
            filter: drop-shadow(0 0 12px rgba(59,130,246,0.8));
          }
          .widget-tracker:hover ~ #widget-card #widget-prompt { opacity: 0; }
          .widget-tracker:hover ~ #widget-card .widget-description { opacity: 1; }
          .widget-tracker:hover ~ #widget-card .widget-rocket { transform: translateY(-8px) rotate(15deg); }
          .widget-tracker:hover ~ #widget-card { filter: brightness(1.15); }
          .w-tr-1  { grid-area: 1/1; } .w-tr-2  { grid-area: 1/2; } .w-tr-3  { grid-area: 1/3; }
          .w-tr-4  { grid-area: 1/4; } .w-tr-5  { grid-area: 1/5; } .w-tr-6  { grid-area: 2/1; }
          .w-tr-7  { grid-area: 2/2; } .w-tr-8  { grid-area: 2/3; } .w-tr-9  { grid-area: 2/4; }
          .w-tr-10 { grid-area: 2/5; } .w-tr-11 { grid-area: 3/1; } .w-tr-12 { grid-area: 3/2; }
          .w-tr-13 { grid-area: 3/3; } .w-tr-14 { grid-area: 3/4; } .w-tr-15 { grid-area: 3/5; }
          .w-tr-16 { grid-area: 4/1; } .w-tr-17 { grid-area: 4/2; } .w-tr-18 { grid-area: 4/3; }
          .w-tr-19 { grid-area: 4/4; } .w-tr-20 { grid-area: 4/5; } .w-tr-21 { grid-area: 5/1; }
          .w-tr-22 { grid-area: 5/2; } .w-tr-23 { grid-area: 5/3; } .w-tr-24 { grid-area: 5/4; }
          .w-tr-25 { grid-area: 5/5; }
          .w-tr-1:hover  ~ #widget-card { transform: rotateX(20deg) rotateY(-10deg); transition: 125ms ease-in-out; }
          .w-tr-2:hover  ~ #widget-card { transform: rotateX(20deg) rotateY(-5deg);  transition: 125ms ease-in-out; }
          .w-tr-3:hover  ~ #widget-card { transform: rotateX(20deg) rotateY(0deg);   transition: 125ms ease-in-out; }
          .w-tr-4:hover  ~ #widget-card { transform: rotateX(20deg) rotateY(5deg);   transition: 125ms ease-in-out; }
          .w-tr-5:hover  ~ #widget-card { transform: rotateX(20deg) rotateY(10deg);  transition: 125ms ease-in-out; }
          .w-tr-6:hover  ~ #widget-card { transform: rotateX(10deg) rotateY(-10deg); transition: 125ms ease-in-out; }
          .w-tr-7:hover  ~ #widget-card { transform: rotateX(10deg) rotateY(-5deg);  transition: 125ms ease-in-out; }
          .w-tr-8:hover  ~ #widget-card { transform: rotateX(10deg) rotateY(0deg);   transition: 125ms ease-in-out; }
          .w-tr-9:hover  ~ #widget-card { transform: rotateX(10deg) rotateY(5deg);   transition: 125ms ease-in-out; }
          .w-tr-10:hover ~ #widget-card { transform: rotateX(10deg) rotateY(10deg);  transition: 125ms ease-in-out; }
          .w-tr-11:hover ~ #widget-card { transform: rotateX(0deg)  rotateY(-10deg); transition: 125ms ease-in-out; }
          .w-tr-12:hover ~ #widget-card { transform: rotateX(0deg)  rotateY(-5deg);  transition: 125ms ease-in-out; }
          .w-tr-13:hover ~ #widget-card { transform: rotateX(0deg)  rotateY(0deg);   transition: 125ms ease-in-out; }
          .w-tr-14:hover ~ #widget-card { transform: rotateX(0deg)  rotateY(5deg);   transition: 125ms ease-in-out; }
          .w-tr-15:hover ~ #widget-card { transform: rotateX(0deg)  rotateY(10deg);  transition: 125ms ease-in-out; }
          .w-tr-16:hover ~ #widget-card { transform: rotateX(-10deg) rotateY(-10deg);transition: 125ms ease-in-out; }
          .w-tr-17:hover ~ #widget-card { transform: rotateX(-10deg) rotateY(-5deg); transition: 125ms ease-in-out; }
          .w-tr-18:hover ~ #widget-card { transform: rotateX(-10deg) rotateY(0deg);  transition: 125ms ease-in-out; }
          .w-tr-19:hover ~ #widget-card { transform: rotateX(-10deg) rotateY(5deg);  transition: 125ms ease-in-out; }
          .w-tr-20:hover ~ #widget-card { transform: rotateX(-10deg) rotateY(10deg); transition: 125ms ease-in-out; }
          .w-tr-21:hover ~ #widget-card { transform: rotateX(-20deg) rotateY(-10deg);transition: 125ms ease-in-out; }
          .w-tr-22:hover ~ #widget-card { transform: rotateX(-20deg) rotateY(-5deg); transition: 125ms ease-in-out; }
          .w-tr-23:hover ~ #widget-card { transform: rotateX(-20deg) rotateY(0deg);  transition: 125ms ease-in-out; }
          .w-tr-24:hover ~ #widget-card { transform: rotateX(-20deg) rotateY(5deg);  transition: 125ms ease-in-out; }
          .w-tr-25:hover ~ #widget-card { transform: rotateX(-20deg) rotateY(10deg); transition: 125ms ease-in-out; }
        `}</style>

        <Link to="/funnel" className="widget-container block">
          <div className="widget-canvas">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`widget-tracker w-tr-${i + 1}`} />
            ))}
            <div id="widget-card">
              <div className="widget-rocket">🚀</div>
              <p id="widget-prompt">Prêt à<br />décoller?</p>
              <div className="widget-description">
                <p>Propulsez votre entreprise en ligne dès aujourd'hui avec une stratégie numérique sur mesure.</p>
                <span className="cta-btn cursor-pointer">Démarrer maintenant →</span>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
