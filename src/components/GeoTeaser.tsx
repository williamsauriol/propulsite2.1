import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, ArrowRight, X } from 'lucide-react';

/**
 * GeoTeaser — la notification GEO, en vraie notification.
 *
 * Histoire de cette chose : elle a d'abord ete une section de 2916 px, puis
 * 1407 px, puis une carte de 174 px placee dans le fil de la page. William :
 * « ca prend trop de place pour la petite pastille que c'est ».
 *
 * Il avait raison, et le probleme n'etait pas la taille — c'etait le PRINCIPE.
 * Une carte dans le fil consomme de la hauteur, quelle que soit sa taille, et
 * force le lecteur a passer par-dessus pour continuer. Une notification, la
 * vraie, ne consomme rien : elle flotte au-dessus, on la lit ou on la ferme.
 *
 * Donc `position: fixed`. Zero pixel de hauteur pris dans la page, et la forme
 * correspond enfin au nom qu'on lui donnait depuis le debut.
 *
 * Trois regles pour qu'elle ne devienne pas une nuisance :
 *   - Elle attend six secondes. Elle ne se met pas devant la premiere
 *     impression, qui est le travail de la section d'accueil.
 *   - Elle se ferme, et le refus est retenu. Un visiteur qui a dit non ne se
 *     la fait pas represser a chaque visite.
 *   - En bas a gauche, pas en haut. La barre de navigation est fixe en haut
 *     sur toute la largeur : une notification en haut a gauche passerait
 *     dessous ou par-dessus, et se battrait avec le logo.
 */

const NOM = 'Constructions [Votre entreprise]';
const MEMOIRE = 'propulsite:geo-notif-fermee';
const ATTENTE_MS = 6000;

export default function GeoTeaser() {
  const [visible, setVisible] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    // Le stockage local peut lever (navigation privee, cookies bloques) : une
    // notification n'est pas une raison de casser la page.
    try {
      if (localStorage.getItem(MEMOIRE)) return;
    } catch { /* on la montre, tant pis */ }
    const t = setTimeout(() => setVisible(true), ATTENTE_MS);
    return () => clearTimeout(t);
  }, []);

  // Le nom de l'entreprise se tape tout seul : c'est le seul mouvement, et
  // c'est lui qui fait comprendre l'idee sans une phrase d'explication.
  useEffect(() => {
    if (!visible || n >= NOM.length) return;
    const t = setTimeout(() => setN(n + 1), 55);
    return () => clearTimeout(t);
  }, [visible, n]);

  function fermer() {
    setVisible(false);
    try {
      localStorage.setItem(MEMOIRE, '1');
    } catch { /* sans memoire, elle reviendra : ce n'est pas grave */ }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -24, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-40 bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 sm:w-[340px]"
          role="complementary"
          aria-label="Nouveau : le GEO"
        >
          <div className="relative rounded-2xl border border-accent-blue/35 bg-[#0a1628]/95 backdrop-blur-xl p-3.5 shadow-[0_16px_44px_rgba(0,0,0,0.6)]">

            <button
              type="button"
              onClick={fermer}
              aria-label="Fermer la notification"
              className="absolute top-2.5 right-2.5 text-white/30 hover:text-white/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <Link to="/geo" onClick={fermer} className="group flex items-start gap-3 pr-4">
              <div className="w-9 h-9 flex-shrink-0 rounded-[11px] bg-gradient-to-br from-accent-blue to-cyan-300 flex items-center justify-center text-[#050a15] shadow-[0_0_14px_rgba(0,210,255,0.4)]">
                <Bot className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-white font-bold text-[12px]">Assistant IA</span>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-blue" />
                  </span>
                </div>

                <p className="text-white/85 text-[12.5px] leading-snug mb-1.5">
                  « Je recommande{' '}
                  <span className="text-accent-blue font-bold">
                    {NOM.slice(0, n)}
                    {n < NOM.length && (
                      <span className="inline-block w-[2px] h-3 bg-accent-blue ml-0.5 align-middle animate-pulse" />
                    )}
                  </span>
                  {n >= NOM.length && ' »'}
                </p>

                <span className="inline-flex items-center gap-1.5 text-accent-blue text-[10.5px] font-bold uppercase tracking-widest transition-all group-hover:gap-2.5">
                  C'est le GEO <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
