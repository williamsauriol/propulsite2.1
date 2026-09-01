import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Send } from 'lucide-react';
import { PAIN_POINTS_ARTICLES } from '../constants/painPointsData';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Le blogue.
 *
 * CE QUI CHANGE
 *
 * Treize cartes identiques empilées, sans hiérarchie : rien ne disait quel
 * article était le plus récent, ni lequel valait la peine d'être lu en
 * premier. Le plus récent passe donc en vedette, et les autres suivent en
 * grille, du plus neuf au plus vieux.
 *
 * Les descriptions étaient écrites À LA MAIN dans ce fichier, en double des
 * articles — quatre-vingt-dix lignes de texte qui ne pouvaient que dériver.
 * C'est exactement ce qui s'était déjà produit avec les titres : sept articles
 * retitrés, et la liste affichait encore les anciens. On lit donc maintenant
 * `metaDescription`, qui vit avec l'article.
 *
 * Les dates sont affichées. Pour un lecteur, ça dit si le conseil est encore
 * bon ; pour un moteur de réponse, la fraîcheur d'un contenu compte.
 *
 * Comme ailleurs, les révélations n'animent que la position et jamais
 * l'opacité : le HTML pré-rendu reste lisible par un robot qui n'exécute pas
 * le JavaScript — et /blog est justement une des pages que Google n'a jamais
 * explorées.
 */

function dateLisible(iso?: string) {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00`).toLocaleDateString('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function titreComplet(a: (typeof PAIN_POINTS_ARTICLES)[number]) {
  return `${a.titlePart1}${a.titleHighlight}${a.titlePart3 ?? ''}`;
}

export default function Blog() {
  usePageMeta(
    'Blog marketing pour compagnies de construction | Propulsite',
    'Conseils marketing numérique pour entrepreneurs en construction au Québec : SEO local, Google Ads, image de marque, réseaux sociaux et génération de leads.',
  );

  // Du plus récent au plus ancien. Les articles sans date passent à la fin.
  const articles = [...PAIN_POINTS_ARTICLES].sort((a, b) =>
    (b.datePublished ?? '').localeCompare(a.datePublished ?? ''),
  );
  const [vedette, ...suite] = articles;

  return (
    <div className="pt-32 pb-24 px-5 md:px-6 relative z-10 overflow-hidden">

      <div className="absolute top-40 left-10 w-96 h-96 bg-accent-blue/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto max-w-5xl">

        {/* ── Titre ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-block text-accent-blue text-[11px] md:text-xs font-bold tracking-[3px] uppercase mb-5">
            {articles.length} articles · Écrits pour le chantier
          </span>
          <h1 className="text-[40px] md:text-6xl font-black mb-6 leading-[0.98] text-white uppercase italic text-3d">
            Le blogue
          </h1>
          <p className="text-white/55 text-[15px] md:text-lg max-w-2xl mx-auto leading-relaxed">
            Ce qu'un entrepreneur en construction du Québec a besoin de savoir sur
            Google, la publicité, son image et l'IA. Pas de théorie : ce qui change
            le nombre d'appels.
          </p>
        </motion.div>

        {/* ── L'article en vedette ──────────────────────────────────────── */}
        {vedette && (
          <motion.div
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 md:mb-16"
          >
            <Link
              to={`/blog/${vedette.slug}`}
              className="group block rounded-[28px] border border-accent-blue/30 bg-gradient-to-br from-[#0a1930] to-[#050a15] p-7 md:p-12 transition-all duration-500 hover:border-accent-blue/60 hover:-translate-y-1 shadow-[0_0_50px_rgba(0,210,255,0.08)]"
            >
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-accent-blue text-[#050a15] text-[10px] font-black tracking-[2px] uppercase">
                  Le plus récent
                </span>
                <span className="text-accent-blue/80 text-[11px] font-bold tracking-[2px] uppercase">
                  {vedette.tag}
                </span>
                {dateLisible(vedette.datePublished) && (
                  <span className="text-white/30 text-[12px]">{dateLisible(vedette.datePublished)}</span>
                )}
              </div>

              <h2 className="text-2xl md:text-[40px] font-black text-white leading-[1.1] mb-5 group-hover:text-accent-blue transition-colors duration-300">
                {vedette.titlePart1}
                <span className="text-accent-blue">{vedette.titleHighlight}</span>
                {vedette.titlePart3}
              </h2>

              <p className="text-white/60 text-[15px] md:text-lg leading-relaxed mb-7 max-w-3xl">
                {vedette.metaDescription ?? vedette.intro}
              </p>

              <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent-blue text-[#050a15] text-xs font-black uppercase tracking-widest transition-all duration-300 group-hover:gap-4">
                Lire l'article <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        )}

        {/* ── Les autres ────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-16 md:mb-24">
          {suite.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/blog/${a.slug}`}
                className="group h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 transition-all duration-300 hover:border-accent-blue/45 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                  <span className="text-accent-blue/70 text-[10px] font-bold tracking-[2px] uppercase">
                    {a.tag}
                  </span>
                  {dateLisible(a.datePublished) && (
                    <span className="text-white/25 text-[11px]">{dateLisible(a.datePublished)}</span>
                  )}
                </div>

                <h2 className="text-[18px] md:text-xl font-bold text-white leading-snug mb-3 group-hover:text-accent-blue transition-colors duration-300">
                  {titreComplet(a)}
                </h2>

                <p className="text-white/50 text-[14px] leading-relaxed mb-5 flex-grow">
                  {a.metaDescription ?? a.intro}
                </p>

                <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent-blue transition-all duration-300 group-hover:gap-3.5">
                  Lire <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Appel ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 p-8 md:p-14 rounded-[32px] text-center overflow-hidden shadow-[0_0_50px_rgba(0,198,255,0.12)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-5xl font-black mb-5 text-white leading-tight">
              Votre entreprise se <span className="italic text-accent-blue">reconnaît</span> là-dedans ?
            </h2>
            <p className="text-white/60 text-[15px] md:text-xl mb-9 max-w-2xl mx-auto leading-relaxed">
              On regarde votre situation ensemble, gratuitement. Pas de présentation
              de vente : un diagnostic et des chiffres.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact"
                className="px-7 py-4 bg-white/5 border border-white/20 rounded-full text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
              >
                Nous joindre
              </Link>
              <Link
                to="/funnel"
                className="px-7 py-4 bg-accent-blue rounded-full text-[#050a15] font-black text-sm uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,198,255,0.5)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                Démarrer un projet <Send className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
