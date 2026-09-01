import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../constants/services';
import { LOGOS_SERVICES } from '../components/logosServices';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Page des services.
 *
 * Refonte : les cartes portaient les pictogrammes generiques de lucide — la
 * meme loupe, le meme porte-voix que n'importe quel site du monde. Elles
 * portent maintenant les logos dessines a la main, les memes que sur l'accueil,
 * en grand et dans leur halo de couleur. Un visiteur qui arrive ici depuis
 * l'accueil reconnait chaque service au premier coup d'oeil.
 *
 * Deuxieme changement : chaque carte montre ses trois premieres prestations.
 * L'ancienne version donnait une phrase et un lien, ce qui obligeait a ouvrir
 * six pages pour savoir ce que Propulsite fait vraiment. Le detail se lit
 * maintenant sur place, et le lien ne sert qu'a ceux qui veulent le fond.
 *
 * Comme sur l'accueil, les revelations n'animent que la position, jamais
 * l'opacite : le HTML pre-rendu reste entierement lisible pour les robots qui
 * n'executent pas le JavaScript.
 */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  key?: string | number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Services() {
  usePageMeta(
    'Services marketing construction — plus de contrats | Propulsite',
    'Site web, Google, GEO, pub, réseaux sociaux, chatbot : nos services pour aider les entrepreneurs en construction du Québec à décrocher plus de contrats.',
  );

  return (
    <div className="pt-32 pb-24 px-5 md:px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">

        {/* ── Titre ─────────────────────────────────────────────────────── */}
        <Reveal className="max-w-3xl mb-14 md:mb-20">
          <span className="inline-block text-accent-blue text-[11px] md:text-xs font-bold tracking-[3px] uppercase mb-5">
            Six services · Un seul métier
          </span>
          <h1 className="text-[44px] md:text-7xl font-black mb-6 italic text-3d uppercase leading-[0.95]">
            Nos services
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed">
            Tout est pensé pour une seule chose : faire sonner le téléphone d'un
            entrepreneur en construction. Pas de forfait générique, pas de jargon.
          </p>
        </Reveal>

        {/* ── Les six ───────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SERVICES.map((s, i) => {
            const Logo = LOGOS_SERVICES[s.slug];
            return (
              <Reveal key={s.slug} delay={(i % 3) * 0.07}>
                <Link
                  to={`/services/${s.slug}`}
                  className="group h-full flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:-translate-y-2"
                  style={{ ['--teinte' as string]: s.color }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${s.color}88`;
                    e.currentTarget.style.boxShadow = `0 24px 60px ${s.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Le logo, en grand, dans son halo */}
                  <div className="relative h-[168px] flex items-center justify-center overflow-hidden border-b border-white/[0.07]">
                    <div
                      className="absolute w-[220px] h-[220px] rounded-full blur-[60px] transition-opacity duration-500 opacity-60 group-hover:opacity-100"
                      style={{ backgroundColor: `${s.color}33` }}
                    />
                    <span
                      className="absolute top-4 right-5 text-4xl font-black tabular-nums text-white/[0.07]"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Logo
                      className="relative w-[86px] h-[86px] transition-transform duration-500 group-hover:scale-110"
                      style={{ color: s.color }}
                    />
                  </div>

                  <div className="flex flex-col flex-grow p-6 md:p-7">
                    <h2
                      className="text-xl md:text-[22px] font-black uppercase leading-tight mb-3 transition-colors duration-300"
                      style={{ color: 'white' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = s.color; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; }}
                    >
                      {s.title}
                    </h2>

                    <p className="text-white/55 text-[14.5px] leading-relaxed mb-5">{s.shortDesc}</p>

                    <ul className="space-y-2 mb-7">
                      {s.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-white/45 text-[13px]">
                          <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: s.color }} />
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <span
                      className="mt-auto self-start inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group-hover:gap-4"
                      style={{ borderColor: `${s.color}55`, color: s.color }}
                    >
                      En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* ── Pour ceux qui ne savent pas par où commencer ──────────────── */}
        <Reveal className="mt-20 md:mt-28">
          <div className="relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 rounded-[32px] p-8 md:p-16 text-center overflow-hidden shadow-[0_0_60px_rgba(0,210,255,0.1)]">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-[10px] md:text-xs font-bold tracking-[2.5px] uppercase mb-6">
                Pas sûr par où commencer ?
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Trouvons ensemble le<br />
                <span className="text-accent-blue italic">service parfait pour vous</span>
              </h2>
              <p className="text-white/60 text-[15px] md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                Répondez à quelques questions et on vous propose une stratégie sur
                mesure — gratuitement, sans engagement.
              </p>
              <Link
                to="/funnel"
                className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-accent-blue rounded-full text-[#050a15] font-black text-sm md:text-lg uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.5)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:-translate-y-1 transform"
              >
                <img
                  src="/images/logo-fuser-sans-backk.png"
                  alt=""
                  width={450}
                  height={450}
                  className="h-5 md:h-6 w-auto object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                />
                Obtenir ma soumission
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
