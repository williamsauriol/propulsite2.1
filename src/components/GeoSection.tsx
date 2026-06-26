import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

/**
 * GeoSection — Section vedette de la page d'accueil dédiée au GEO.
 *
 * Met en scène une « fausse » conversation IA qui se tape toute seule (effet
 * machine à écrire) : un client demande une recommandation à une IA, et l'IA
 * répond en nommant l'entreprise du client. On MONTRE le GEO au lieu de
 * seulement l'expliquer.
 */

// L'IA « tape » cette réponse, segment par segment (le nom de l'entreprise en cyan).
const SEGMENTS: { text: string; accent?: boolean }[] = [
  { text: 'Pour un projet de construction ou de rénovation dans votre secteur, je recommande ' },
  { text: 'Constructions [Votre entreprise]', accent: true },
  { text: " : spécialisée dans votre région, d'excellents avis clients et un service reconnu. Voici comment la contacter pour une soumission." },
];
const FULL_LENGTH = SEGMENTS.reduce((n, s) => n + s.text.length, 0);

function renderTyped(count: number): React.ReactNode[] {
  let remaining = count;
  return SEGMENTS.map((seg, i) => {
    if (remaining <= 0) return null;
    const slice = seg.text.slice(0, remaining);
    remaining -= seg.text.length;
    return seg.accent ? (
      <span key={i} className="text-accent-blue font-bold">{slice}</span>
    ) : (
      <span key={i}>{slice}</span>
    );
  });
}

const ENGINES = ['ChatGPT', 'Google AI', 'Perplexity', 'Gemini'];

const BENEFITS = [
  'Être cité par ChatGPT, Gemini, Perplexity et l\'IA de Google',
  'Devenir LA réponse — pas juste un lien bleu parmi d\'autres',
  'Prendre l\'avance pendant que vos concurrents l\'ignorent encore',
];

export default function GeoSection() {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const done = count >= FULL_LENGTH;

  useEffect(() => {
    if (!started || done) return;
    const t = setTimeout(() => setCount((c) => c + 1), 18);
    return () => clearTimeout(t);
  }, [started, count, done]);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Colonne gauche : le pitch ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent-blue/15 border border-accent-blue/30 text-accent-blue text-xs font-bold tracking-[2.5px] uppercase px-5 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" /> Nouveau en 2026 · GEO
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[52px] font-black leading-tight text-white uppercase tracking-tight mb-6">
              Vos clients ne<br />cherchent plus.<br />
              <span className="text-accent-blue text-glow-blue italic">Ils demandent à l'IA.</span>
            </h2>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
              De plus en plus de propriétaires posent leur question directement à
              ChatGPT ou à l'IA de Google. Le <span className="text-white font-bold">GEO</span> (Generative
              Engine Optimization) fait en sorte que ce soit <span className="text-white font-bold">votre nom</span> que
              l'intelligence artificielle recommande.
            </p>

            <ul className="space-y-4 mb-10">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-white/80">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent-blue mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/services/domination-google"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest text-sm hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,210,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.7)] transform hover:-translate-y-1"
              >
                Découvrir le GEO <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/blog/geo-chatgpt-construction"
                className="inline-flex items-center px-8 py-4 bubble-glass text-white/80 font-bold uppercase tracking-widest text-sm hover:text-white"
              >
                Lire l'article
              </Link>
            </div>
          </motion.div>

          {/* ── Colonne droite : la conversation IA animée ────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onViewportEnter={() => { if (!started) setTimeout(() => setStarted(true), 650); }}
          >
            <div className="relative bg-[#0a1628] border border-accent-blue/25 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,210,255,0.12)]">
              {/* En-tête de la fenêtre IA */}
              <div className="flex items-center gap-3 pb-5 border-b border-white/10 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-cyan-300 flex items-center justify-center text-[#050a15]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">Assistant IA</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> en ligne
                  </div>
                </div>
              </div>

              {/* Bulle utilisateur */}
              <div className="flex justify-end mb-5">
                <div className="bg-accent-blue/15 border border-accent-blue/25 text-white/90 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] text-sm leading-relaxed">
                  Quel entrepreneur en construction engager près de Saint-Eustache ?
                </div>
              </div>

              {/* Bulle IA (texte tapé) */}
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 text-white/80 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%] text-sm leading-relaxed min-h-[96px]">
                  {started ? (
                    <>
                      {renderTyped(count)}
                      {!done && <span className="inline-block w-[2px] h-4 bg-accent-blue ml-0.5 align-middle animate-pulse" />}
                    </>
                  ) : (
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>

              {/* Moteurs supportés */}
              <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/10">
                <span className="text-[11px] text-white/40 uppercase tracking-wider mr-1">Fonctionne avec</span>
                {ENGINES.map((e) => (
                  <span key={e} className="text-[11px] font-semibold text-white/70 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-center text-white/40 text-xs mt-4">
              ☝️ C'est exactement ce que le GEO rend possible.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
