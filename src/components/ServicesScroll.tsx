import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../constants/services';
import { LOGOS_SERVICES } from './logosServices';

/**
 * ServicesScroll — « Nos expertises », en défilement.
 *
 * Remplace la grille de six cartes, qui faisait 2930 px sur un téléphone : la
 * section la plus longue du site, plus grosse que la section GEO ne l'a jamais
 * été. Six cartes côte à côte demandent au visiteur de choisir avant d'avoir
 * compris ; ici il descend, et chaque service se présente à son tour.
 *
 * Sur grand écran : le texte défile à gauche, le logo reste collé à droite et
 * change quand on passe d'un service au suivant. Rien d'autre dans le panneau
 * de droite — juste le logo et son halo, qui prend la couleur du service.
 *
 * Sur téléphone : pas de panneau collé (il n'y a pas deux colonnes), donc le
 * logo passe au-dessus de son texte, en plus petit. Le contenu est le même.
 *
 * Le service actif est celui dont le bloc traverse le milieu de l'écran. C'est
 * un IntersectionObserver avec `rootMargin: '-50% 0px -50% 0px'` : la marge
 * ecrase la zone d'observation en une ligne d'un pixel au centre de l'ecran,
 * et un bloc « intersecte » exactement quand il la croise. Les blocs se
 * touchent, donc il y en a toujours un et un seul.
 *
 * Une premiere version ecoutait l'evenement `scroll` sur window. Mesure dans
 * le navigateur : `window.scrollY` bougeait bien, mais AUCUN evenement scroll
 * n'etait emis — ni sur window, ni sur html, ni sur body — et le logo restait
 * bloque sur le premier service. L'IntersectionObserver ne depend d'aucun
 * evenement de defilement, donc la question ne se pose plus.
 */

const SERVICES_ACCUEIL = SERVICES.slice(0, 6);

export default function ServicesScroll() {
  const [actif, setActif] = useState(0);
  const blocs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => {
          // On ne reagit qu'a l'entree : la sortie d'un bloc coincide avec
          // l'entree du suivant, et traiter les deux ferait clignoter.
          if (!e.isIntersecting) return;
          const i = blocs.current.indexOf(e.target as HTMLDivElement);
          if (i !== -1) setActif(i);
        });
      },
      // Ecrase la zone d'observation en une ligne au milieu de l'ecran.
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    blocs.current.forEach((el) => el && observateur.observe(el));
    return () => observateur.disconnect();
  }, []);

  const service = SERVICES_ACCUEIL[actif];
  const LogoActif = LOGOS_SERVICES[service.slug];

  return (
    <section className="px-5 md:px-6 py-16 md:py-32">
      <div className="container mx-auto max-w-6xl">

        {/* En-tête */}
        <div className="text-center mb-10 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-5 text-3d uppercase italic">Nos expertises</h2>
          <p className="text-white/50 text-[15px] md:text-base max-w-xl mx-auto">
            Tout ce dont un entrepreneur a besoin pour bâtir une présence en ligne indestructible.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 xl:gap-24">

          {/* ── Gauche : les services, l'un après l'autre ───────────────── */}
          <div>
            {SERVICES_ACCUEIL.map((s, i) => {
              const Logo = LOGOS_SERVICES[s.slug];
              const courant = actif === i;
              return (
                <div
                  key={s.slug}
                  ref={(el) => { blocs.current[i] = el; }}
                  className="py-6 md:py-10 lg:min-h-[72vh] lg:flex lg:flex-col lg:justify-center border-b border-white/[0.07] lg:border-0"
                >
                  {/* Sur telephone, le logo se met SUR la ligne du titre plutot
                      qu'au-dessus : empile, il coutait 76 px par service pour
                      ne rien dire de plus. Au-dessus de lg, cette rangee
                      redevient un simple bloc et le logo disparait — il est
                      alors dans le panneau colle. */}
                  <div className="flex items-center gap-4 mb-3.5 lg:block lg:mb-0">
                    <div
                      className="lg:hidden w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center border"
                      style={{ color: s.color, backgroundColor: `${s.color}1A`, borderColor: `${s.color}44` }}
                    >
                      <Logo className="w-7 h-7" />
                    </div>

                    <span
                      className="hidden lg:block text-sm font-black tabular-nums tracking-widest mb-4 transition-colors duration-500"
                      style={{ color: courant ? s.color : 'rgba(255,255,255,0.18)' }}
                    >
                      {String(i + 1).padStart(2, '0')} / 06
                    </span>

                    <h3
                      className="text-[21px] md:text-4xl font-black uppercase leading-[1.12] lg:mb-4 transition-colors duration-500"
                      style={{ color: courant ? s.color : undefined }}
                    >
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-white/60 text-[15px] md:text-lg leading-relaxed mb-4 lg:mb-6 max-w-xl">
                    {s.shortDesc}
                  </p>

                  {/* Le detail des prestations n'apparait qu'a partir de lg :
                      la grille de cartes qu'on remplace ne le montrait pas non
                      plus, et sur telephone il rallongeait la section de
                      660 px sans rien ajouter que la page du service ne dise
                      deja mieux. */}
                  <ul className="hidden lg:block space-y-2.5 mb-7 max-w-xl">
                    {s.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-3 text-white/50 text-[13px] md:text-sm">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: s.color }} />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/services/${s.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:gap-3.5"
                    style={{ color: s.color }}
                  >
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* ── Droite : le logo collé, et rien d'autre ─────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-0 h-screen flex items-center justify-center">
              <div className="relative w-[300px] h-[300px] flex items-center justify-center">

                {/* Le halo prend la couleur du service courant. */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-[80px]"
                  animate={{ backgroundColor: `${service.color}33` }}
                  transition={{ duration: 0.6 }}
                />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, scale: 0.86, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -14 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                    style={{ color: service.color }}
                  >
                    <LogoActif className="w-[190px] h-[190px]" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
