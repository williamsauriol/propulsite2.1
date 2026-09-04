import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { QUESTIONS } from '../constants/questionsData';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Index des questions-réponses.
 *
 * Les animations n'animent que `y`, jamais `opacity` : le HTML pré-rendu par
 * scripts/prerender.ts doit rester lisible par un robot qui n'exécute pas le
 * JavaScript. Un `opacity: 0` inline rendrait la page invisible pour eux —
 * exactement le contraire du but de ces pages.
 */
export default function Questions() {
  usePageMeta(
    'Vos questions sur le web en construction | Propulsite',
    'Réponses directes aux questions que se posent les entrepreneurs en construction du Québec sur le web : prix d’un site, référencement, publicité, avis Google et IA.',
  );

  /* `relative z-10` est obligatoire ici, pas décoratif. RocketBackground est posé
     en `fixed inset-0 z-0` avec un fond OPAQUE. Un contenu laissé dans le flux
     normal se peint AVANT les éléments positionnés du même plan, donc ce fond le
     recouvrait : le titre et l'intro de cette page étaient invisibles en
     production. Les cartes y échappaient parce que leur `transform` leur crée un
     contexte d'empilement ; l'en-tête, non. Toutes les autres pages du site
     portent déjà ces deux classes. */
  return (
    <div className="pt-32 pb-24 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-accent-blue mb-5">
            <HelpCircle className="w-4 h-4" />
            Questions et réponses
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            Les questions que les entrepreneurs
            <span className="text-accent-blue"> nous posent vraiment</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl">
            Une question par page, une réponse dès la première ligne. Pas de
            préambule, pas de discours de vente : des chiffres, des fourchettes
            et ce qu’on ferait à votre place.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {QUESTIONS.map((q, i) => (
            <motion.div
              key={q.slug}
              initial={{ y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link to={`/questions/${q.slug}`} className="block group">
                <LiquidGlassCard className="transition-colors group-hover:border-accent-blue/40">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-blue mb-3">
                    {q.categorie}
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-4">
                    {q.question}
                  </h2>
                  <p className="text-white/70 leading-relaxed mb-5">
                    {q.reponseCourte}
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent-blue font-bold text-sm min-h-[24px]">
                    Lire la réponse complète
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </LiquidGlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 p-10 md:p-14 rounded-3xl text-center mt-14"
        >
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            Votre question n’est pas là ?
          </h2>
          <p className="text-white/65 mb-8 max-w-2xl mx-auto">
            Posez-la directement. On répond en français, sans jargon, même si la
            réponse est que vous n’avez pas besoin de nous.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-accent-blue text-[#050a15] font-black px-8 py-4 rounded-full hover:brightness-110 transition min-h-[48px]"
          >
            Poser ma question →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
