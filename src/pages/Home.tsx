import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import GeoSection from '../components/GeoSection';
import { ArrowRight, HardHat, ClipboardList, Palette, Search } from 'lucide-react';
import { SERVICES } from '../constants/services';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta(
    'Marketing construction Québec — plus de contrats | Propulsite',
    'On aide les entrepreneurs en construction du Québec à décrocher plus de contrats grâce au web : site, référencement Google, GEO et pub. Soumission gratuite.'
  );
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
      <section className="min-h-screen flex items-center px-6 relative pt-24">
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

      {/* GEO Section - Mise en vedette */}
      <GeoSection />

      {/* Services Section - All Services */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-3d uppercase italic">NOS EXPERTISES</h2>
            <p className="text-white/50 max-w-xl mx-auto">Tout ce dont un entrepreneur a besoin pour bâtir une présence en ligne indestructible.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeServices.map((s, i) => (
              <Link 
                key={s.slug} 
                to={`/services/${s.slug}`} 
                className="group"
                style={{
                  '--service-color': s.color,
                  '--service-bg': `${s.color}1A`, // 10% opacity
                  '--service-border': `${s.color}33`, // 20% opacity
                  '--service-shadow': `${s.color}66`, // 40% opacity
                } as React.CSSProperties}
              >
                <LiquidGlassCard delay={i * 0.1} className="h-full transition-all duration-500 transform group-hover:-translate-y-6 group-hover:scale-[1.03] group-hover:shadow-[0_20px_50px_var(--service-shadow)] group-hover:border-[color:var(--service-color)] bg-gradient-to-br hover:bg-[linear-gradient(to_bottom_right,var(--service-bg),transparent)]">
                  <div className="w-14 h-14 bg-[color:var(--service-bg)] rounded-2xl flex items-center justify-center mb-8 text-[color:var(--service-color)] border border-[color:var(--service-border)] group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[color:var(--service-color)] transition-colors uppercase">{s.title}</h3>
                  <p className="text-white/60 mb-8 leading-relaxed">{s.shortDesc}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-[color:var(--service-color)] uppercase tracking-widest">
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </div>
                </LiquidGlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section - New Design */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[#060d1f] to-[#0a1628]">
        {/* Background Stars / Dots */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60" style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 8%  15%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px   1px   at 22% 72%, rgba(255,255,255,0.3)  0%, transparent 100%),
            radial-gradient(2px   2px   at 45% 10%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(1px   1px   at 68% 88%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 85% 30%, rgba(255,255,255,0.2)  0%, transparent 100%),
            radial-gradient(1px   1px   at 93% 65%, rgba(255,255,255,0.3)  0%, transparent 100%),
            radial-gradient(1px   1px   at 33% 50%, rgba(255,255,255,0.15) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 57% 38%, rgba(255,255,255,0.2)  0%, transparent 100%)
          `
        }} />

        {/* Glow Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[100px] pointer-events-none z-0" />

        <div className="container mx-auto relative z-10 px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block bg-accent-blue/15 border border-accent-blue/30 text-accent-blue text-xs font-bold tracking-[2.5px] uppercase px-5 py-2 rounded-full mb-6">
              Pourquoi nous choisir
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[52px] font-black leading-tight text-white uppercase tracking-tight mb-6">
              Pourquoi les entrepreneurs<br />
              <span className="text-accent-blue">nous choisissent ?</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent-blue to-cyan-300 rounded-full mx-auto" />
          </div>

          {/* Cards Grid with Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0a1628] rounded-3xl overflow-hidden border border-white/10 group flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,210,255,0.15)] hover:border-accent-blue/40">
              <div className="relative h-64 overflow-hidden">
                <img src="/images/team_collaboration.webp" alt="Équipe de construction" loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent opacity-90" />
                <div className="absolute top-4 right-6 text-5xl font-black text-white/10">01</div>
              </div>
              <div className="p-8 flex-grow flex flex-col relative z-10 -mt-10">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue mb-4 backdrop-blur-md">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Pas assez de contrats ?</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                  Votre carnet de commandes est vide ? Nous ciblons les propriétaires qui cherchent activement vos services et les convertissons en clients.
                </p>
                <Link to="/blog/pas-assez-contrats" className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue uppercase tracking-widest transition-all hover:text-cyan-300 hover:gap-3 mt-auto">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0a1628] rounded-3xl overflow-hidden border border-white/10 group flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,210,255,0.15)] hover:border-accent-blue/40">
              <div className="relative h-64 overflow-hidden">
                <img src="/images/human_worker.webp" alt="Entrepreneur en construction" loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent opacity-90" />
                <div className="absolute top-4 right-6 text-5xl font-black text-white/10">02</div>
              </div>
              <div className="p-8 flex-grow flex flex-col relative z-10 -mt-10">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue mb-4 backdrop-blur-md">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Image de marque datée ?</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                  Votre site web fait peur aux clients ? Modernisez votre image pour refléter la qualité réelle de vos travaux et inspirer confiance dès le premier regard.
                </p>
                <Link to="/blog/image-marque-datee" className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue uppercase tracking-widest transition-all hover:text-cyan-300 hover:gap-3 mt-auto">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0a1628] rounded-3xl overflow-hidden border border-white/10 group flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,210,255,0.15)] hover:border-accent-blue/40">
              <div className="relative h-64 overflow-hidden">
                <img src="/images/construction_seo.webp" alt="Succès digital et construction" loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent opacity-90" />
                <div className="absolute top-4 right-6 text-5xl font-black text-white/10">03</div>
              </div>
              <div className="p-8 flex-grow flex flex-col relative z-10 -mt-10">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue mb-4 backdrop-blur-md">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Perdu dans Google ?</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                  Vos concurrents prennent toute la place ? Nous vous propulsons en tête des résultats locaux pour que les bons clients vous trouvent en premier.
                </p>
                <Link to="/blog/invisible-google" className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue uppercase tracking-widest transition-all hover:text-cyan-300 hover:gap-3 mt-auto">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Réalisations — vitrine des sites de démonstration */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-blue mb-4">Nos réalisations</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Voyez ce qu'on peut <span className="text-accent-blue">bâtir</span> pour vous
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Plutôt que de vous le décrire, on vous le montre. Voici un site complet conçu pour un entrepreneur en rénovation.
            </p>
          </motion.div>

          {/* Spécimen 02 existe sous public/exemples/specimen-02/ mais n'est
              volontairement pas mis en vitrine : William ne veut pas encore
              le montrer. Pour le remettre, rajouter une carte identique
              pointant vers /exemples/specimen-02/. */}
          <motion.a
            href="/exemples/specimen-01/"
            target="_blank"
            rel="noopener"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group block relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628] hover:border-accent-blue/60 transition-colors"
          >
            <img
              src="/exemples/specimen-01/img/hero.jpg"
              alt="Aperçu du site Spécimen 01, réalisé par Propulsite"
              loading="lazy"
              width={1920}
              height={1080}
              className="w-full h-[280px] md:h-[420px] object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050a15] via-[#050a15]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-accent-blue mb-2">Rénovation haut de gamme</p>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">Spécimen 01</h3>
                <p className="text-white/55 text-sm mt-2 max-w-md">Site vitrine, animations sur mesure, optimisé pour le mobile et pour Google.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border border-white/25 rounded-full px-5 py-3 group-hover:bg-accent-blue group-hover:text-[#050a15] group-hover:border-accent-blue transition-all">
                Visiter le site <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.a>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-32 px-6 flex justify-center">
        <style>{`
          .widget-container {
            position: relative;
            width: 100%;
            max-width: 560px;
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
            border: 1px solid rgba(0, 210, 255, 0.25);
            overflow: hidden;
          }
          #widget-card::before {
            content: "";
            position: absolute;
            inset: -2px;
            border-radius: 26px;
            background: linear-gradient(135deg, #00d2ff, #0077b6, #7ee8ff);
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
            text-shadow: 0 0 40px rgba(0, 210, 255, 0.6);
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
            background: #00d2ff;
            color: #050a15;
            font-size: 15px;
            font-weight: 700;
            padding: 12px 28px;
            border-radius: 50px;
            text-decoration: none;
            box-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
          }
          .widget-rocket {
            position: absolute;
            top: 24px;
            right: 28px;
            font-size: 36px;
            z-index: 10;
            transition: transform 300ms ease-in-out;
            filter: drop-shadow(0 0 12px rgba(0,210,255,0.8));
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
              <div className="widget-rocket"><img src="/images/logo-fuser-sans-backk.png" alt="Propulsite" width={450} height={450} style={{ height: '40px', width: 'auto', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.9))' }} /></div>
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
