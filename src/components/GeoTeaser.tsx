import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bot, ArrowRight } from 'lucide-react';

/**
 * GeoTeaser — la notification GEO de la page d'accueil.
 *
 * Remplace l'ancienne GeoSection, qui faisait 2916 px de haut sur un écran de
 * téléphone. Réduite à 1407 px, elle restait la deuxième plus longue section du
 * site, et surtout elle répétait trois fois le même argument. Tout ce contenu
 * vit maintenant sur /geo, où il a la place de bien faire les choses.
 *
 * Ici, une seule chose à obtenir : le clic. Donc la forme d'une notification —
 * un objet qu'on lit sans y penser et sur lequel on appuie. Une ligne de titre,
 * une ligne de corps, une flèche. Rien d'autre.
 *
 * Le nom de l'entreprise se tape tout seul : c'est le seul mouvement, et c'est
 * lui qui fait comprendre l'idée sans une phrase d'explication.
 */

const NOM = 'Constructions [Votre entreprise]';

export default function GeoTeaser() {
  const [n, setN] = useState(NOM.length);
  const [demarre, setDemarre] = useState(false);

  // Comme les compteurs de /geo : on part du texte COMPLET pour que le HTML
  // pré-rendu soit lisible, et on remet à zéro au montage côté client.
  useEffect(() => setN(0), []);

  useEffect(() => {
    if (!demarre || n >= NOM.length) return;
    const t = setTimeout(() => setN(n + 1), 55);
    return () => clearTimeout(t);
  }, [demarre, n]);

  return (
    <section className="px-5 md:px-6 mt-20 md:mt-32 mb-10 md:mb-20">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ y: 22 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onViewportEnter={() => { if (!demarre) setTimeout(() => setDemarre(true), 500); }}
      >
        <Link
          to="/geo"
          className="group block relative overflow-hidden rounded-[26px] border border-accent-blue/30 bg-[#0a1628]/90 backdrop-blur-md p-4 md:p-5 transition-all duration-300 hover:border-accent-blue/60 hover:-translate-y-1 shadow-[0_18px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_60px_rgba(0,210,255,0.18)]"
        >
          {/* Halo qui respire, comme une notification qui vient d'arriver. */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[420px] h-[180px] rounded-full bg-accent-blue/15 blur-[70px] pointer-events-none" />

          <div className="relative flex items-start gap-3.5">
            {/* Icône d'application */}
            <div className="w-11 h-11 md:w-12 md:h-12 flex-shrink-0 rounded-[14px] bg-gradient-to-br from-accent-blue to-cyan-300 flex items-center justify-center text-[#050a15] shadow-[0_0_18px_rgba(0,210,255,0.45)]">
              <Bot className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Ligne d'en-tête : expéditeur + « à l'instant » */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-white font-bold text-[13px] md:text-sm">Assistant IA</span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-blue" />
                </span>
                <span className="text-white/30 text-[11px] ml-auto flex-shrink-0">à l'instant</span>
              </div>

              {/* Le corps : la réponse que l'IA donne à un client */}
              <p className="text-white/85 text-[13.5px] md:text-[15px] leading-snug mb-2.5">
                « Pour votre projet, je recommande{' '}
                <span className="text-accent-blue font-bold">
                  {NOM.slice(0, n)}
                  {n < NOM.length && (
                    <span className="inline-block w-[2px] h-3.5 bg-accent-blue ml-0.5 align-middle animate-pulse" />
                  )}
                </span>
                {n >= NOM.length && ' »'}
              </p>

              <p className="text-white/45 text-[12px] md:text-[13px] leading-snug mb-3">
                68 % des recherches se terminent sans un seul clic. Le <strong className="text-white/70 font-semibold">GEO</strong>,
                c'est le travail qui fait dire votre nom à l'IA.
              </p>

              <span className="inline-flex items-center gap-1.5 text-accent-blue text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all group-hover:gap-2.5">
                Comprendre le GEO <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
