import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronLeft, HelpCircle } from 'lucide-react';
import { QUESTIONS } from '../constants/questionsData';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Page d'une question unique.
 *
 * La réponse courte est placée immédiatement sous le H1, avant tout le reste.
 * C'est délibéré : un moteur de réponse qui lit cette page reprend le premier
 * passage qui répond à la question. Toute introduction placée avant lui vole
 * cette position.
 *
 * Les animations n'animent que `y`, jamais `opacity` — le HTML pré-rendu doit
 * rester lisible sans JavaScript.
 */
export default function QuestionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const question = QUESTIONS.find((q) => q.slug === slug);

  usePageMeta(
    question ? `${question.metaTitle} | Propulsite` : 'Question | Propulsite',
    question?.metaDescription,
  );

  if (!question) return <Navigate to="/questions" replace />;

  const liees = question.liees
    .map((s) => QUESTIONS.find((q) => q.slug === s))
    .filter((q): q is (typeof QUESTIONS)[number] => Boolean(q));

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
        <Link
          to="/questions"
          className="inline-flex items-center gap-2 text-white/50 hover:text-accent-blue mb-10 min-h-[24px]"
        >
          <ChevronLeft className="w-5 h-5" />
          Toutes les questions
        </Link>

        <motion.div
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-accent-blue mb-5">
            <HelpCircle className="w-4 h-4" />
            {question.categorie}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {question.question}
          </h1>
        </motion.div>

        {/* La réponse citable. Elle vient avant tout autre contenu. */}
        <div className="mb-12 border-l-4 border-accent-blue pl-6 md:pl-8">
          <p className="text-xl md:text-2xl text-white leading-relaxed font-medium">
            {question.reponseCourte}
          </p>
        </div>

        {question.sections.map((section, i) => (
          <motion.div
            key={section.titre}
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="mb-8"
          >
            <LiquidGlassCard>
              <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-accent-blue pl-4">
                {section.titre}
              </h2>
              {section.paragraphes?.map((p, j) => (
                <p
                  key={j}
                  className="text-lg text-white/70 leading-relaxed mb-6 last:mb-0"
                >
                  {p}
                </p>
              ))}
              {section.items && (
                <ul className="space-y-4 mt-4">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent-blue mt-1 flex-shrink-0" />
                      <span className="text-lg text-white/70 leading-snug">
                        {item.bold && (
                          <strong className="text-white font-bold">
                            {item.bold}
                          </strong>
                        )}
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </LiquidGlassCard>
          </motion.div>
        ))}

        {liees.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-white mb-6">
              Questions liées
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {liees.map((q) => (
                <Link
                  key={q.slug}
                  to={`/questions/${q.slug}`}
                  className="block p-5 rounded-2xl border border-white/12 hover:border-accent-blue/40 transition-colors min-h-[48px]"
                >
                  <span className="text-white/80 leading-snug text-sm">
                    {q.question}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <motion.div
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 p-10 md:p-14 rounded-3xl text-center mt-14"
        >
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            On regarde votre cas en quinze minutes
          </h2>
          <p className="text-white/65 mb-8 max-w-2xl mx-auto">
            Votre fiche Google, votre site et vos concurrents directs. Sans
            engagement — et on vous le dit franchement si vous n’avez pas besoin
            de nous.
          </p>
          <Link
            to="/funnel"
            className="inline-flex items-center justify-center gap-2 bg-accent-blue text-[#050a15] font-black px-8 py-4 rounded-full hover:brightness-110 transition min-h-[48px]"
          >
            Demander mon analyse →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
