import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, MessageSquare, TrendingUp, Bot, ChevronDown } from 'lucide-react';

/**
 * GeoSection — Section vedette de la page d'accueil dédiée au GEO.
 *
 * Pièce maîtresse : sa propre bande de fond (dégradé + étoiles + halo), un
 * titre surdimensionné, une « fausse » conversation IA qui se tape toute seule
 * (effet machine à écrire) où l'IA recommande l'entreprise du client, et une
 * rangée « Pourquoi maintenant ». On MONTRE le GEO au lieu de l'expliquer.
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

const WHY_NOW = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "L'IA répond en premier",
    desc: "Sur Google, une réponse générée par IA (AI Overviews) s'affiche désormais avant les liens. Si l'IA ne vous nomme pas, le client ne vous voit pas.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Des millions de questions',
    desc: "ChatGPT, Gemini et Perplexity sont utilisés par des centaines de millions de personnes qui demandent des recommandations en langage naturel.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Le terrain est libre',
    desc: "Presque aucune entreprise de construction au Québec n'est optimisée pour l'IA. Celui qui s'y met maintenant prend une avance difficile à rattraper.",
  },
];

export default function GeoSection() {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  // Replie sur telephone uniquement : au-dessus de md, le bloc est toujours
  // affiche quelle que soit la valeur.
  const [pourquoiOuvert, setPourquoiOuvert] = useState(false);
  const done = count >= FULL_LENGTH;

  useEffect(() => {
    if (!started || done) return;
    const t = setTimeout(() => setCount((c) => c + 1), 18);
    return () => clearTimeout(t);
  }, [started, count, done]);

  return (
    <section className="px-4 md:px-6 mt-20 md:mt-52 mb-12 md:mb-20">
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] border border-white/10 py-10 md:py-32 px-5 md:px-10 max-w-7xl mx-auto bg-gradient-to-b from-[#060d1f] via-[#081834] to-[#0a1628] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
      {/* Étoiles */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70" style={{
        backgroundImage: `
          radial-gradient(1.5px 1.5px at 8% 15%, rgba(255,255,255,0.45) 0%, transparent 100%),
          radial-gradient(1px 1px at 22% 72%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(2px 2px at 45% 10%, rgba(255,255,255,0.25) 0%, transparent 100%),
          radial-gradient(1px 1px at 68% 88%, rgba(255,255,255,0.35) 0%, transparent 100%),
          radial-gradient(1.5px 1.5px at 85% 30%, rgba(255,255,255,0.2) 0%, transparent 100%),
          radial-gradient(1px 1px at 93% 65%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 33% 50%, rgba(255,255,255,0.15) 0%, transparent 100%),
          radial-gradient(1.5px 1.5px at 57% 38%, rgba(255,255,255,0.2) 0%, transparent 100%)
        `
      }} />
      {/* Halos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-accent-blue/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto max-w-6xl relative z-10">

        {/* ── En-tête centré ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2.5 bg-accent-blue/15 border border-accent-blue/40 text-accent-blue text-[10px] md:text-sm font-bold tracking-[2px] md:tracking-[2.5px] uppercase px-4 md:px-5 py-2 md:py-2.5 rounded-full mb-5 md:mb-8 shadow-[0_0_25px_rgba(0,210,255,0.35)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            Nouveau · Juillet 2026 · GEO
          </div>

          <h2 className="text-[32px] md:text-6xl lg:text-7xl font-black leading-[1.05] md:leading-[0.95] text-white uppercase tracking-tight mb-5 md:mb-8">
            Vos clients ne cherchent plus.<br />
            <span className="text-accent-blue text-glow-blue italic">Ils demandent à l'IA.</span>
          </h2>

          <p className="text-[15px] md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            De plus en plus de propriétaires posent leur question directement à
            ChatGPT ou à l'IA de Google. Le <span className="text-white font-bold">GEO</span> (Generative
            Engine Optimization) fait en sorte que ce soit <span className="text-white font-bold">votre nom</span> que
            l'intelligence artificielle recommande.
          </p>
        </motion.div>

        {/* ── 2 colonnes : pitch + conversation IA ────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-9 lg:gap-16 items-center mb-12 md:mb-20">

          {/* Gauche : arguments + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <ul className="space-y-3.5 md:space-y-5 mb-7 md:mb-10">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 md:gap-4 text-white/85 text-[15px] md:text-lg">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-accent-blue/15 border border-accent-blue/40 flex items-center justify-center text-accent-blue mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link
                to="/services/domination-google"
                className="inline-flex items-center gap-2 px-7 md:px-9 py-4 md:py-5 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest text-sm hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.6)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] transform hover:-translate-y-1"
              >
                Découvrir le GEO <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/blog/geo-chatgpt-construction"
                className="inline-flex items-center px-7 md:px-9 py-4 md:py-5 bubble-glass text-white/80 font-bold uppercase tracking-widest text-sm hover:text-white"
              >
                Lire l'article
              </Link>
            </div>
          </motion.div>

          {/* Droite : la conversation IA animée */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onViewportEnter={() => { if (!started) setTimeout(() => setStarted(true), 650); }}
          >
            <div className="relative bg-[#0a1628]/90 backdrop-blur-md border border-accent-blue/30 rounded-3xl p-5 md:p-8 shadow-[0_25px_70px_rgba(0,210,255,0.18)]">
              {/* Liseré lumineux */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent-blue/30 via-transparent to-cyan-300/20 -z-10 blur-sm" />

              {/* En-tête de la fenêtre IA */}
              <div className="flex items-center gap-3 pb-4 md:pb-5 border-b border-white/10 mb-5 md:mb-6">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-accent-blue to-cyan-300 flex items-center justify-center text-[#050a15]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">Assistant IA</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> en ligne
                  </div>
                </div>
              </div>

              {/* Bulle utilisateur */}
              <div className="flex justify-end mb-4 md:mb-5">
                <div className="bg-accent-blue/15 border border-accent-blue/25 text-white/90 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-[14px] md:text-[15px] leading-relaxed">
                  Quel entrepreneur en construction engager près de Saint-Eustache ?
                </div>
              </div>

              {/* Bulle IA (texte tapé) */}
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 text-white/85 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[92%] text-[14px] md:text-[15px] leading-relaxed min-h-[110px]">
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
              <div className="flex flex-wrap items-center gap-2 mt-5 md:mt-6 pt-4 md:pt-5 border-t border-white/10">
                <span className="text-[11px] text-white/40 uppercase tracking-wider mr-1">Fonctionne avec</span>
                {ENGINES.map((e) => (
                  <span key={e} className="text-[11px] font-semibold text-white/70 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-center text-white/40 text-xs mt-3 md:mt-4">
              ☝️ C'est exactement ce que le GEO rend possible.
            </p>
          </motion.div>
        </div>

        {/* ── Pourquoi maintenant ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Sur telephone, ces trois cartes pesaient 670 px — c'est le
              TROISIEME endroit ou la section explique le GEO, apres le
              paragraphe d'intro et la liste d'arguments. On les replie donc
              derriere un bouton : le texte reste dans le DOM (donc lu par
              Google et par le pre-rendu), mais l'ecran arrete de defiler.
              Au-dessus de md, rien ne change : le titre est un simple libelle
              et les cartes sont toujours ouvertes. */}
          <div className="text-center mb-6 md:mb-10">
            <button
              type="button"
              onClick={() => setPourquoiOuvert((v) => !v)}
              aria-expanded={pourquoiOuvert}
              className="md:hidden inline-flex items-center gap-2 text-accent-blue text-sm font-bold tracking-[2.5px] uppercase px-4 py-2 rounded-full border border-accent-blue/30 bg-accent-blue/10"
            >
              Pourquoi maintenant
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${pourquoiOuvert ? 'rotate-180' : ''}`} />
            </button>
            <span className="hidden md:inline text-accent-blue text-sm font-bold tracking-[2.5px] uppercase">Pourquoi maintenant</span>
          </div>
          <div className={`${pourquoiOuvert ? 'grid' : 'hidden md:grid'} md:grid-cols-3 gap-4 md:gap-6`}>
            {WHY_NOW.map((c) => (
              <div
                key={c.title}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:p-7 backdrop-blur-sm flex gap-4 md:block transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-blue/40 hover:shadow-[0_15px_45px_rgba(0,210,255,0.12)]"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 flex-shrink-0 rounded-xl bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent-blue md:mb-5">
                  {c.icon}
                </div>
                <div>
                  <h3 className="text-[17px] md:text-xl font-bold text-white mb-2 md:mb-3">{c.title}</h3>
                  <p className="text-white/60 text-[13px] md:text-sm leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
      </div>
    </section>
  );
}
