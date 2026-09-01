import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import {
  Sparkles, ArrowRight, Check, X, Bot, Search, ChevronDown, Quote,
  MapPin, Star, Link2, FileCode2, Globe, AlertTriangle, RotateCcw,
} from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  CHIFFRES, MOTEURS, SOURCES_IA, LEVIERS, MYTHES, FAMILLES, QUESTIONS, VERDICTS, FAQ, SOURCES,
} from '../constants/geoData';

/**
 * Page GEO — la page vitrine du site.
 *
 * DEUX RÈGLES QUI GOUVERNENT TOUT CE FICHIER.
 *
 * 1. On anime la POSITION, jamais l'opacité.
 *    Le site est pré-rendu au build (scripts/prerender.ts) : le HTML servi
 *    contient l'état INITIAL des animations. Ailleurs sur le site, les blocs
 *    partent de `opacity: 0` — le texte est bien dans le HTML, mais il y est
 *    marqué invisible. Sur une page qui explique comment se faire lire par des
 *    machines, c'était une contradiction. Ici les révélations n'animent que
 *    `y` : le HTML pré-rendu est entièrement visible, et l'effet reste le même
 *    à l'œil.
 *
 * 2. Rien d'interactif ne cache du contenu au premier rendu.
 *    Les accordéons rendent leur réponse dans le DOM même fermés, les onglets
 *    aussi. Un robot qui n'exécute pas le JavaScript lit la page complète.
 */

// ─── Révélation au défilement : translation seule, jamais d'opacité ──────────
function Reveal({
  children,
  delay = 0,
  className = '',
  y = 26,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  // Le projet n'installe pas @types/react : sans lui, TypeScript ne connait
  // pas JSX.IntrinsicAttributes et refuse `key` sur un composant maison.
  // React retire `key` des props avant l'appel, donc il n'est jamais lu ici.
  key?: string | number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Compteur ────────────────────────────────────────────────────────────────
/**
 * Part de la valeur FINALE, pas de zéro : c'est cette valeur-là qui se retrouve
 * dans le HTML pré-rendu. Le retour à zéro se fait au montage côté client,
 * donc bien avant que le bloc n'entre dans l'écran.
 */
function Compteur({ valeur, prefixe = '', suffixe = '' }: { valeur: number; prefixe?: string; suffixe?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const vu = useInView(ref, { once: true, margin: '-80px' });
  const [n, setN] = useState(valeur);

  useEffect(() => setN(0), []);

  useEffect(() => {
    if (!vu) return;
    const duree = 1100;
    const debut = performance.now();
    let brut = 0;
    const pas = (t: number) => {
      const p = Math.min(1, (t - debut) / duree);
      // Décélération : le chiffre s'installe au lieu de s'arrêter net.
      setN(Math.round(valeur * (1 - Math.pow(1 - p, 3))));
      if (p < 1) brut = requestAnimationFrame(pas);
    };
    brut = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(brut);
  }, [vu, valeur]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefixe}{n}{suffixe}
    </span>
  );
}

// ─── Héros : la question qui se tape toute seule ─────────────────────────────
const QUESTIONS_HERO = [
  'meilleur couvreur saint-eustache',
  'qui peut refaire ma toiture avant l’hiver ?',
  'quel entrepreneur engager pour un agrandissement ?',
];

function BarreDeRecherche() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(QUESTIONS_HERO[0].length);
  const [efface, setEfface] = useState(false);

  useEffect(() => {
    const texte = QUESTIONS_HERO[i];
    if (!efface && n < texte.length) {
      const t = setTimeout(() => setN(n + 1), 45);
      return () => clearTimeout(t);
    }
    if (!efface && n === texte.length) {
      const t = setTimeout(() => setEfface(true), 2100);
      return () => clearTimeout(t);
    }
    if (efface && n > 0) {
      const t = setTimeout(() => setN(n - 1), 18);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setEfface(false);
      setI((v) => (v + 1) % QUESTIONS_HERO.length);
    }, 250);
    return () => clearTimeout(t);
  }, [n, efface, i]);

  return (
    <div className="flex items-center gap-3 w-full max-w-xl mx-auto bg-white/[0.04] border border-white/15 rounded-full px-5 py-3.5 backdrop-blur-md">
      <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
      <span className="text-white/80 text-[14px] md:text-base text-left truncate">
        {QUESTIONS_HERO[i].slice(0, n)}
        <span className="inline-block w-[2px] h-4 bg-accent-blue ml-0.5 align-middle animate-pulse" />
      </span>
    </div>
  );
}

// ─── La bascule : le même besoin, deux mondes ────────────────────────────────
const LIENS_BLEUS = [
  'Les 10 meilleurs couvreurs de la Rive-Nord — Annuaire',
  'Toiture Rive-Nord inc. — Estimation gratuite',
  'Comparez 3 soumissions de couvreurs | Service en ligne',
  'Couvreur Saint-Eustache — Pages Jaunes',
  'Réfection de toiture : prix 2026 au Québec',
];

function BasculeSeoGeo() {
  const [mode, setMode] = useState<'seo' | 'geo'>('seo');

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1.5 gap-1">
          {(['seo', 'geo'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-5 md:px-7 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === m
                  ? 'bg-accent-blue text-[#050a15] shadow-[0_0_22px_rgba(0,210,255,0.5)]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {m === 'seo' ? 'Hier · Google' : "Aujourd'hui · IA"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-[#0a1628]/85 border border-white/10 rounded-3xl p-5 md:p-8 min-h-[380px] md:min-h-[340px] overflow-hidden">
        <div className="flex items-center gap-2 pb-4 mb-5 border-b border-white/10 text-white/40 text-[11px] md:text-xs">
          <Search className="w-3.5 h-3.5" />
          <span className="truncate">quel couvreur engager près de Saint-Eustache ?</span>
        </div>

        {mode === 'seo' ? (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/30 mb-5">
              Environ 2 340 000 résultats
            </p>
            <ul className="space-y-4">
              {LIENS_BLEUS.map((l, k) => (
                <motion.li
                  key={l}
                  initial={{ y: 12 }}
                  animate={{ y: 0 }}
                  transition={{ delay: k * 0.06, duration: 0.35 }}
                >
                  <span className="block text-[15px] md:text-base text-[#8ab4f8] leading-snug">{l}</span>
                  <span className="block text-[11px] md:text-xs text-white/30 mt-1">
                    Vous êtes quelque part dans cette liste. Ou pas.
                  </span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-6 pt-5 border-t border-white/10 text-white/45 text-[13px] md:text-sm leading-relaxed">
              Le client compare, ouvre trois onglets, en referme deux. Votre travail :
              être assez haut pour exister. <span className="text-white/70 font-semibold">C'est le SEO.</span>
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-accent-blue to-cyan-300 flex items-center justify-center text-[#050a15]">
                <Bot className="w-5 h-5" />
              </div>
              <motion.div
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-[15px] md:text-base text-white/85 leading-relaxed"
              >
                Pour une réfection de toiture dans le secteur de Saint-Eustache, je vous
                recommande{' '}
                <span className="text-accent-blue font-bold">Constructions [Votre entreprise]</span>{' '}
                : spécialisée en toiture résidentielle sur la Rive-Nord, 4,8 étoiles sur
                127 avis, et elle offre une soumission gratuite. Voici comment la joindre.
              </motion.div>
            </div>
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-white/45 text-[13px] md:text-sm leading-relaxed">
                Une seule réponse. Un seul nom. Pas de deuxième page, pas de comparaison.
                <span className="text-white/70 font-semibold"> C'est le GEO</span> — et il n'y a
                pas de médaille d'argent.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── D'où l'IA tire ses réponses ─────────────────────────────────────────────
const ICONES_SOURCE: Record<string, React.ReactNode> = {
  bing: <Globe className="w-5 h-5" />,
  foursquare: <MapPin className="w-5 h-5" />,
  google: <Search className="w-5 h-5" />,
  avis: <Star className="w-5 h-5" />,
  nap: <Link2 className="w-5 h-5" />,
  site: <FileCode2 className="w-5 h-5" />,
};

function OuLIaRegarde() {
  const [actif, setActif] = useState(SOURCES_IA[0].id);
  const courant = SOURCES_IA.find((s) => s.id === actif) || SOURCES_IA[0];

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_1.15fr] gap-6 lg:gap-10 items-start">
      <div className="grid grid-cols-2 gap-3">
        {SOURCES_IA.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActif(s.id)}
            aria-pressed={actif === s.id}
            className={`text-left rounded-2xl border p-4 transition-all duration-300 ${
              actif === s.id
                ? 'bg-accent-blue/12 border-accent-blue/50 shadow-[0_0_25px_rgba(0,210,255,0.15)]'
                : 'bg-white/[0.03] border-white/10 hover:border-white/25'
            }`}
          >
            <span
              className={`inline-flex w-9 h-9 rounded-lg items-center justify-center mb-3 ${
                actif === s.id ? 'bg-accent-blue text-[#050a15]' : 'bg-white/5 text-accent-blue'
              }`}
            >
              {ICONES_SOURCE[s.id]}
            </span>
            <span className="block text-white font-bold text-sm leading-tight">{s.nom}</span>
            <span className="block text-white/40 text-[11px] mt-1 leading-snug">{s.poids}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 lg:sticky lg:top-28">
        <motion.div key={courant.id} initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{courant.nom}</h3>
          <p className="text-accent-blue text-xs font-bold uppercase tracking-widest mb-5">{courant.poids}</p>
          <p className="text-white/70 text-[15px] leading-relaxed mb-6">{courant.fait}</p>
          <div className="flex items-start gap-3 bg-accent-blue/[0.07] border border-accent-blue/25 rounded-2xl p-4">
            <Check className="w-4 h-4 text-accent-blue flex-shrink-0 mt-1" />
            <p className="text-white/85 text-sm leading-relaxed">{courant.action}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Les leviers ─────────────────────────────────────────────────────────────
function Leviers() {
  const [ouvert, setOuvert] = useState<string | null>(LEVIERS[0].numero);

  return (
    <div className="space-y-3">
      {LEVIERS.map((l) => {
        const actif = ouvert === l.numero;
        return (
          <div
            key={l.numero}
            className={`rounded-3xl border transition-colors duration-300 overflow-hidden ${
              actif ? 'bg-white/[0.05] border-accent-blue/35' : 'bg-white/[0.02] border-white/10'
            }`}
          >
            <button
              type="button"
              onClick={() => setOuvert(actif ? null : l.numero)}
              aria-expanded={actif}
              className="w-full text-left p-5 md:p-7 flex items-start gap-4 md:gap-6"
            >
              <span
                className={`text-2xl md:text-3xl font-black tabular-nums flex-shrink-0 transition-colors ${
                  actif ? 'text-accent-blue' : 'text-white/15'
                }`}
              >
                {l.numero}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-lg md:text-2xl font-bold text-white leading-tight">{l.titre}</span>
                <span className="block text-accent-blue/80 text-[13px] md:text-sm mt-1.5">{l.promesse}</span>
              </span>
              <ChevronDown
                className={`w-5 h-5 text-white/40 flex-shrink-0 mt-1 transition-transform duration-300 ${
                  actif ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Toujours dans le DOM : un robot sans JavaScript lit la page entière. */}
            <div className={actif ? 'block' : 'hidden'}>
              <div className="px-5 md:px-7 pb-6 md:pb-7 md:pl-[4.75rem]">
                <p className="text-white/65 text-[15px] leading-relaxed mb-5">{l.pourquoi}</p>
                <ul className="space-y-2.5">
                  {l.gestes.map((g) => (
                    <li key={g} className="flex items-start gap-3 text-white/80 text-sm">
                      <Check className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Le test ─────────────────────────────────────────────────────────────────

/**
 * Le diagnostic.
 *
 * Trois choses qu'il fait et que l'ancienne version ne faisait pas :
 *
 *   1. Il RESTITUE. Le score seul ne dit rien ; ce qui compte, c'est la liste
 *      de ce qui manque, triee par ce que ca coute de ne pas l'avoir, avec le
 *      geste exact a poser.
 *   2. Il TRANSPORTE. « Faire corriger » envoyait vers un formulaire vide et
 *      tout le travail du visiteur etait perdu. Le diagnostic complet part
 *      maintenant dans le courriel — William sait exactement quoi corriger
 *      avant meme de rappeler.
 *   3. Il RESTE HONNETE. Rien n'est envoye tant que la personne n'a pas ecrit
 *      son courriel elle-meme. Le score se calcule dans le navigateur.
 */
function Test() {
  const [coches, setCoches] = useState<Record<string, boolean>>({});
  const [touche, setTouche] = useState(false);
  const [envoi, setEnvoi] = useState<'repos' | 'encours' | 'fait' | 'erreur'>('repos');
  const [identite, setIdentite] = useState({ nom: '', entreprise: '', courriel: '', ville: '' });

  const total = QUESTIONS.reduce((n, q) => n + (coches[q.id] ? q.points : 0), 0);
  const verdict = VERDICTS.find((v) => total >= v.min) || VERDICTS[VERDICTS.length - 1];

  // Ce qui manque, du plus couteux au moins couteux.
  const manques = QUESTIONS.filter((q) => !coches[q.id]).sort((a, b) => b.points - a.points);

  const CIRC = 2 * Math.PI * 54;

  function basculer(id: string) {
    setCoches((c) => ({ ...c, [id]: !c[id] }));
    setTouche(true);
  }

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!identite.courriel) return;
    setEnvoi('encours');

    // Le diagnostic complet, lisible tel quel dans le courriel.
    const rapport = FAMILLES.map((f) => {
      const qs = QUESTIONS.filter((q) => q.famille === f.id);
      const obtenus = qs.reduce((n, q) => n + (coches[q.id] ? q.points : 0), 0);
      const possibles = qs.reduce((n, q) => n + q.points, 0);
      const lignes = qs.map((q) => `  ${coches[q.id] ? '[OUI]' : '[NON]'} ${q.texte}`).join('\n');
      return `${f.titre} — ${obtenus}/${possibles}\n${lignes}`;
    }).join('\n\n');

    const aFaire = manques
      .map((q, i) => `${i + 1}. (${q.points} pts) ${q.action}`)
      .join('\n');

    try {
      const r = await fetch('https://formsubmit.co/ajax/propulsiteprojet@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Diagnostic GEO — ${identite.entreprise || identite.nom} — ${total}/100`,
          Nom: identite.nom || 'Non fourni',
          Entreprise: identite.entreprise || 'Non fournie',
          Courriel: identite.courriel,
          Ville: identite.ville || 'Non fournie',
          Score: `${total} / 100 — ${verdict.titre}`,
          Diagnostic: rapport,
          'À corriger, par ordre de priorité': aFaire || 'Rien : tout est déjà en place.',
        }),
      });
      setEnvoi(r.ok ? 'fait' : 'erreur');
    } catch {
      setEnvoi('erreur');
    }
  }

  return (
    <div className="grid lg:grid-cols-[1.25fr_minmax(0,1fr)] gap-8 lg:gap-12 items-start">

      {/* ── Les questions, par famille ─────────────────────────────────── */}
      <div className="space-y-8">
        {FAMILLES.map((f) => {
          const qs = QUESTIONS.filter((q) => q.famille === f.id);
          const obtenus = qs.reduce((n, q) => n + (coches[q.id] ? q.points : 0), 0);
          const possibles = qs.reduce((n, q) => n + q.points, 0);
          return (
            <div key={f.id}>
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <h3 className="text-accent-blue text-[11px] md:text-xs font-bold tracking-[2.5px] uppercase">
                  {f.titre}
                </h3>
                <span className="text-white/35 text-[11px] font-bold tabular-nums">
                  {obtenus} / {possibles}
                </span>
              </div>
              <div className="space-y-2.5">
                {qs.map((q) => {
                  const coche = !!coches[q.id];
                  return (
                    <button
                      key={q.id}
                      type="button"
                      role="checkbox"
                      aria-checked={coche}
                      onClick={() => basculer(q.id)}
                      className={`w-full text-left flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                        coche
                          ? 'bg-accent-blue/10 border-accent-blue/45'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 flex-shrink-0 rounded-lg border flex items-center justify-center mt-0.5 transition-all ${
                          coche ? 'bg-accent-blue border-accent-blue text-[#050a15]' : 'border-white/25 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-white/90 text-[14px] md:text-[15px] leading-snug">{q.texte}</span>
                        <span className="block text-white/35 text-[12px] mt-1.5 leading-snug">{q.indice}</span>
                      </span>
                      <span className="flex-none text-white/25 text-[11px] font-bold tabular-nums mt-0.5">
                        {q.points}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Le résultat ────────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-24 bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 rounded-3xl p-6 md:p-7">

        <div className="relative w-[128px] h-[128px] mx-auto mb-5">
          <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
            <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <motion.circle
              cx="64" cy="64" r="54" fill="none" stroke="#00d2ff" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRC}
              animate={{ strokeDashoffset: CIRC - (CIRC * total) / 100 }}
              initial={false}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,210,255,0.6))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white tabular-nums">{total}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">sur 100</span>
          </div>
        </div>

        {touche ? (
          <>
            <h3 className="text-lg font-bold text-white mb-2 leading-tight text-center">{verdict.titre}</h3>
            <p className="text-white/55 text-[13.5px] leading-relaxed mb-6 text-center">{verdict.texte}</p>

            {manques.length > 0 && (
              <div className="mb-6">
                <p className="text-white/35 text-[10px] font-bold tracking-[2px] uppercase mb-3">
                  Vos trois priorités
                </p>
                <ol className="space-y-3">
                  {manques.slice(0, 3).map((q) => (
                    <li key={q.id} className="flex items-start gap-3">
                      <span className="flex-none mt-0.5 text-accent-blue text-[11px] font-black tabular-nums">
                        +{q.points}
                      </span>
                      <span className="text-white/65 text-[13px] leading-relaxed">{q.action}</span>
                    </li>
                  ))}
                </ol>
                {manques.length > 3 && (
                  <p className="text-white/30 text-[12px] mt-3">
                    Et {manques.length - 3} autre{manques.length - 3 > 1 ? 's' : ''} point
                    {manques.length - 3 > 1 ? 's' : ''} dans le rapport complet.
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-white/50 text-[13.5px] leading-relaxed mb-6 text-center">
            Cochez ce qui est déjà vrai chez vous. Le score se calcule tout seul,
            et rien ne part avant que vous ne le demandiez.
          </p>
        )}

        {/* ── Recevoir le rapport ──────────────────────────────────────── */}
        {envoi === 'fait' ? (
          <div className="rounded-2xl border border-accent-blue/40 bg-accent-blue/10 p-4 text-center">
            <Check className="w-5 h-5 text-accent-blue mx-auto mb-2" />
            <p className="text-white text-sm font-bold mb-1">Rapport envoyé</p>
            <p className="text-white/55 text-[13px] leading-relaxed">
              On vous écrit dans les prochaines heures avec le détail des
              {' '}{manques.length} point{manques.length > 1 ? 's' : ''} à corriger.
            </p>
          </div>
        ) : (
          <form onSubmit={envoyer} className="space-y-2.5 pt-5 border-t border-white/10">
            <p className="text-white/35 text-[10px] font-bold tracking-[2px] uppercase mb-1">
              Recevoir le rapport complet
            </p>
            <input
              type="text" required value={identite.nom} placeholder="Votre nom"
              onChange={(e) => setIdentite({ ...identite, nom: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-blue transition-colors"
            />
            <input
              type="text" value={identite.entreprise} placeholder="Nom de l'entreprise"
              onChange={(e) => setIdentite({ ...identite, entreprise: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-blue transition-colors"
            />
            <input
              type="text" value={identite.ville} placeholder="Ville"
              onChange={(e) => setIdentite({ ...identite, ville: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-blue transition-colors"
            />
            <input
              type="email" required value={identite.courriel} placeholder="Courriel"
              onChange={(e) => setIdentite({ ...identite, courriel: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent-blue transition-colors"
            />

            {envoi === 'erreur' && (
              <p className="text-red-400 text-[12px]">
                L'envoi a échoué. Écrivez-nous directement à propulsiteprojet@gmail.com.
              </p>
            )}

            <button
              type="submit"
              disabled={envoi === 'encours'}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-300 disabled:opacity-60"
            >
              {envoi === 'encours' ? 'Envoi…' : 'Faire corriger ça'} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-white/25 text-[11px] leading-snug text-center pt-1">
              Vos réponses partent avec le message. Aucune autre utilisation.
            </p>
          </form>
        )}

        {touche && envoi !== 'fait' && (
          <button
            type="button"
            onClick={() => { setCoches({}); setTouche(false); }}
            className="w-full inline-flex items-center justify-center gap-2 text-white/35 hover:text-white/70 text-xs mt-4 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Recommencer
          </button>
        )}
      </div>
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function Faq() {
  const [ouvert, setOuvert] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {FAQ.map((f, i) => {
        const actif = ouvert === i;
        return (
          <div
            key={f.q}
            className={`rounded-2xl border transition-colors ${
              actif ? 'bg-white/[0.05] border-accent-blue/30' : 'bg-white/[0.02] border-white/10'
            }`}
          >
            <button
              type="button"
              onClick={() => setOuvert(actif ? null : i)}
              aria-expanded={actif}
              className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center gap-4"
            >
              <h3 className="flex-1 text-white font-bold text-[15px] md:text-lg leading-snug">{f.q}</h3>
              <ChevronDown
                className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${
                  actif ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div className={actif ? 'block' : 'hidden'}>
              <p className="px-5 md:px-6 pb-5 md:pb-6 text-white/65 text-sm md:text-[15px] leading-relaxed">
                {f.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Titre de section ────────────────────────────────────────────────────────
function TitreSection({
  etiquette, titre, accent, intro,
}: { etiquette: string; titre: string; accent?: string; intro?: string }) {
  return (
    <Reveal className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
      <span className="inline-block text-accent-blue text-[11px] md:text-xs font-bold tracking-[2.5px] uppercase mb-4">
        {etiquette}
      </span>
      <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.08] tracking-tight mb-5">
        {titre}
        {accent && <span className="text-accent-blue"> {accent}</span>}
      </h2>
      {intro && <p className="text-white/60 text-[15px] md:text-lg leading-relaxed">{intro}</p>}
    </Reveal>
  );
}

// ─── La page ─────────────────────────────────────────────────────────────────
export default function Geo() {
  usePageMeta(
    'GEO : être recommandé par ChatGPT et l’IA de Google | Propulsite',
    "Comment ChatGPT, Gemini et l'IA de Google choisissent l'entrepreneur qu'ils recommandent — et quoi faire pour être ce nom-là. Chiffres et sources.",
  );

  const lien = (id: string) => SOURCES.find((s) => s.id === id);

  return (
    <div className="relative z-10 overflow-hidden">

      {/* ══ HÉROS ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 px-5 md:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] rounded-full bg-accent-blue/10 blur-[150px] pointer-events-none -z-10" />
        <div className="container mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 bg-accent-blue/15 border border-accent-blue/40 text-accent-blue text-[10px] md:text-xs font-bold tracking-[2px] uppercase px-4 md:px-5 py-2 rounded-full mb-7 shadow-[0_0_25px_rgba(0,210,255,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Generative Engine Optimization
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-[34px] md:text-6xl lg:text-7xl font-black text-white uppercase leading-[1.02] tracking-tight mb-7">
              Vos clients ne cherchent plus.<br />
              <span className="text-accent-blue text-glow-blue italic">Ils demandent.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-[15px] md:text-xl text-white/65 leading-relaxed max-w-2xl mx-auto mb-10">
              Le <strong className="text-white font-bold">GEO</strong> est le travail qui fait que
              ChatGPT, Gemini, Perplexity et l'IA de Google prononcent le nom de votre entreprise
              quand un propriétaire leur demande un entrepreneur. Voici comment ça marche, de A à Z,
              chiffres et sources à l'appui.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <BarreDeRecherche />
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3 mt-9">
              <a
                href="#test"
                className="inline-flex items-center gap-2 px-7 md:px-9 py-4 md:py-4.5 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest text-xs md:text-sm hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.55)]"
              >
                Tester mon entreprise <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#leviers"
                className="inline-flex items-center px-7 md:px-9 py-4 md:py-4.5 bubble-glass text-white/80 font-bold uppercase tracking-widest text-xs md:text-sm hover:text-white"
              >
                Les 7 leviers
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ LE BASCULEMENT ═════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <TitreSection
            etiquette="Ce qui vient de changer"
            titre="La recherche n'envoie plus"
            accent="de visiteurs."
            intro="Ce ne sont pas des projections : ce sont des mesures faites en 2026. Chaque chiffre porte sa source, en bas de page."
          />

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {CHIFFRES.map((c, i) => (
              <Reveal key={c.titre} delay={i * 0.06}>
                <div className="h-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 hover:border-accent-blue/35 transition-colors duration-300">
                  <div className="text-5xl md:text-6xl font-black text-accent-blue mb-3 leading-none">
                    <Compteur valeur={c.valeur} prefixe={c.prefixe} suffixe={c.suffixe} />
                  </div>
                  <h3 className="text-white font-bold text-[17px] md:text-xl leading-snug mb-3">{c.titre}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{c.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SEO vs GEO ═════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <TitreSection
            etiquette="Voyez la différence"
            titre="Dix liens, ou"
            accent="un seul nom."
            intro="Le même client, la même question, deux époques. Basculez d'un monde à l'autre."
          />
          <Reveal>
            <BasculeSeoGeo />
          </Reveal>
        </div>
      </section>

      {/* ══ LES MOTEURS ════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <TitreSection
            etiquette="Tous les moteurs ne se valent pas"
            titre="Qui cite ses sources,"
            accent="et à quelle fréquence."
            intro="Un moteur qui ne cite jamais ne vous enverra jamais personne — mais il peut quand même vous nommer à voix haute. Ce n'est pas la même bataille."
          />
          <div className="space-y-5">
            {MOTEURS.map((m, i) => (
              <Reveal key={m.nom} delay={i * 0.08}>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:p-6">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <span className="text-white font-bold text-base md:text-lg">{m.nom}</span>
                    <span className="text-accent-blue font-black text-2xl md:text-3xl tabular-nums">
                      <Compteur valeur={m.taux} suffixe=" %" />
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/8 overflow-hidden mb-3">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent-blue to-cyan-300"
                      initial={{ width: `${m.taux}%` }}
                      whileInView={{ width: `${m.taux}%` }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="text-white/50 text-[13px] md:text-sm leading-relaxed">{m.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OÙ L'IA REGARDE ════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-16 md:py-24 relative">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-accent-blue/[0.07] blur-[130px] pointer-events-none -z-10" />
        <div className="container mx-auto max-w-6xl">
          <TitreSection
            etiquette="Le mécanisme"
            titre="Où une IA va chercher"
            accent="le nom qu'elle donne."
            intro="Elle ne vous invente pas. Elle recoupe six endroits — et la plupart des entrepreneurs sont absents de quatre d'entre eux. Touchez une carte."
          />
          <Reveal>
            <OuLIaRegarde />
          </Reveal>
        </div>
      </section>

      {/* ══ LES LEVIERS ════════════════════════════════════════════════════ */}
      <section id="leviers" className="px-5 md:px-6 py-16 md:py-24 scroll-mt-24">
        <div className="container mx-auto max-w-4xl">
          <TitreSection
            etiquette="De A à Z"
            titre="Les sept leviers,"
            accent="dans l'ordre où ils rapportent."
            intro="Rien d'ésotérique. Sept chantiers concrets, du plus payant au plus technique."
          />
          <Reveal>
            <Leviers />
          </Reveal>
        </div>
      </section>

      {/* ══ CE QU'ON RACONTE DE FAUX ═══════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <TitreSection
            etiquette="Mise au point"
            titre="Trois choses qu'on vous dira"
            accent="et qui sont fausses."
            intro="Le GEO attire beaucoup de vendeurs. Voici ce qu'on ne vous dira pas."
          />
          <div className="space-y-4">
            {MYTHES.map((m, i) => (
              <Reveal key={m.mythe} delay={i * 0.07}>
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8">
                  <div className="flex items-start gap-3 mb-4">
                    <X className="w-5 h-5 text-red-400/80 flex-shrink-0 mt-0.5" />
                    <p className="text-white font-bold text-lg md:text-xl leading-snug">{m.mythe}</p>
                  </div>
                  <div className="flex items-start gap-3 md:pl-8">
                    <Check className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <p className="text-white/65 text-[15px] leading-relaxed">{m.verite}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LA CITATION ════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <Reveal>
            <div className="relative bg-gradient-to-br from-accent-blue/[0.09] to-transparent border border-accent-blue/25 rounded-[32px] p-7 md:p-12 text-center">
              <Quote className="w-8 h-8 text-accent-blue/50 mx-auto mb-5" />
              <p className="text-white text-lg md:text-2xl font-bold leading-snug mb-5">
                Ajouter des citations directes fait grimper la visibilité d'un contenu de
                <span className="text-accent-blue"> 41 %</span>, les statistiques de
                <span className="text-accent-blue"> 32 %</span> et les références de
                <span className="text-accent-blue"> 30 %</span>.
              </p>
              <p className="text-white/45 text-xs md:text-sm">
                Étude « GEO: Generative Engine Optimization », Princeton et IIT Delhi, publiée
                à la conférence KDD 2024. C'est exactement ce que fait cette page.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ LE TEST ════════════════════════════════════════════════════════ */}
      <section id="test" className="px-5 md:px-6 py-16 md:py-24 scroll-mt-24">
        <div className="container mx-auto max-w-6xl">
          <TitreSection
            etiquette="Deux minutes"
            titre="Est-ce qu'une IA"
            accent="sait que vous existez ?"
            intro="Quinze questions, deux minutes. Vous obtenez votre score, vos priorités, et le rapport complet par courriel si vous le voulez."
          />
          <Reveal>
            <Test />
          </Reveal>
        </div>
      </section>

      {/* ══ FAQ ════════════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl">
          <TitreSection etiquette="Questions" titre="Ce qu'on nous demande" accent="le plus souvent." />
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* ══ APPEL ══════════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] border border-accent-blue/25 bg-gradient-to-b from-[#081834] to-[#0a1628] p-8 md:p-14 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent-blue/15 blur-[120px] pointer-events-none" />
              <div className="relative">
                <Sparkles className="w-8 h-8 text-accent-blue mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.08] mb-5">
                  Le terrain est encore <span className="text-accent-blue">libre</span>.
                </h2>
                <p className="text-white/65 text-[15px] md:text-lg leading-relaxed max-w-xl mx-auto mb-9">
                  Sept pour cent des recherches locales affichent une réponse IA aujourd'hui.
                  Dans deux ans, ce sera un rattrapage. Là, c'est encore une avance.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest text-xs md:text-sm hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.55)]"
                  >
                    Soumission gratuite <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/services/domination-google"
                    className="inline-flex items-center px-8 md:px-10 py-4 md:py-5 bubble-glass text-white/80 font-bold uppercase tracking-widest text-xs md:text-sm hover:text-white"
                  >
                    Le service au complet
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ SOURCES ════════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-6 pb-24">
        <div className="container mx-auto max-w-3xl">
          <div className="border-t border-white/10 pt-10">
            <h2 className="flex items-center gap-2.5 text-white/70 text-xs font-bold uppercase tracking-[2.5px] mb-5">
              <AlertTriangle className="w-4 h-4 text-accent-blue" /> Sources
            </h2>
            <p className="text-white/40 text-[13px] leading-relaxed mb-6">
              Tous les chiffres de cette page sont datés d'août 2026. Le domaine bouge vite :
              si vous lisez ceci beaucoup plus tard, revérifiez.
            </p>
            <ul className="space-y-2.5">
              {SOURCES.map((s) => (
                <li key={s.id} className="text-[13px] leading-relaxed">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-white/45 hover:text-accent-blue transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/10 text-[13px]">
              <span className="text-white/35">À lire ensuite :</span>
              <Link to="/blog/geo-chatgpt-construction" className="text-accent-blue hover:text-white transition-colors">
                Le GEO expliqué en cinq minutes
              </Link>
              <Link to="/blog/invisible-google" className="text-accent-blue hover:text-white transition-colors">
                Pourquoi votre entreprise n'apparaît pas sur Google
              </Link>
              <Link to="/services/domination-google" className="text-accent-blue hover:text-white transition-colors">
                Domination Google
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
