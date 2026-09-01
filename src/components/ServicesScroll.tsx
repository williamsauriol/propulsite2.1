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

// Le nom court pour les pastilles. Le nom complet reste dans le bloc du
// service : ici on veut la reconnaissance, pas l'exactitude commerciale.
const COURT: Record<string, string> = {
  'conception-site-web': 'Site web',
  'google-ads': 'Google Ads',
  'domination-google': 'Domination Google',
  'publicite-facebook': 'Pub Facebook',
  'gestion-medias-sociaux': 'Médias sociaux',
  'chatbot-ia': 'Chatbot IA',
};

export default function ServicesScroll() {
  const [actif, setActif] = useState(0);
  const blocs = useRef<(HTMLDivElement | null)[]>([]);

  const service = SERVICES_ACCUEIL[actif];
  const LogoActif = LOGOS_SERVICES[service.slug];

  return (
    <section className="px-5 md:px-6 py-28 md:py-48">
      <div className="container mx-auto max-w-6xl">

        {/* En-tête */}
        <div className="text-center mb-10 md:mb-24">
          <span className="inline-block text-accent-blue text-[11px] md:text-xs font-bold tracking-[3px] uppercase mb-5">
            Six services · Un seul métier
          </span>
          <h2 className="text-[42px] md:text-7xl font-black mb-6 text-3d uppercase italic leading-[0.95]">
            Nos expertises
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent-blue to-cyan-300 rounded-full mx-auto mb-6" />
          <p className="text-white/50 text-[15px] md:text-lg max-w-xl mx-auto mb-9 md:mb-12">
            Tout ce dont un entrepreneur a besoin pour bâtir une présence en ligne indestructible.
          </p>
        </div>

        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 md:gap-8 lg:grid-cols-[auto_minmax(0,1fr)_360px] lg:gap-12 xl:gap-16">

          {/* ── Rail gauche : les six, empilees, toujours a l'ecran ──────
              Il colle sous la barre de navigation et n'a pas besoin de
              defiler : six tuiles tiennent dans un ecran. Sur telephone il
              se reduit au logo seul pour laisser la place au texte. */}
          <div>
            <nav
              aria-label="Les six expertises"
              className="sticky top-24 md:top-28 flex flex-col gap-2 md:gap-2.5"
            >
              {SERVICES_ACCUEIL.map((s, i) => {
                const Logo = LOGOS_SERVICES[s.slug];
                const courant = actif === i;
                return (
                  <a
                    key={s.slug}
                    href={`#expertise-${s.slug}`}
                    aria-current={courant ? 'true' : undefined}
                    title={s.title}
                    className="group flex items-center gap-3 rounded-xl border p-2 md:p-2.5 transition-all duration-500"
                    style={
                      courant
                        ? { backgroundColor: `${s.color}1F`, borderColor: s.color, boxShadow: `0 0 18px ${s.color}44` }
                        : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.10)' }
                    }
                  >
                    <span
                      className="flex-none w-7 h-7 md:w-8 md:h-8 flex items-center justify-center transition-opacity duration-500"
                      style={{ color: s.color, opacity: courant ? 1 : 0.4 }}
                    >
                      <Logo className="w-full h-full" />
                    </span>
                    <span
                      className="hidden xl:block pr-1 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-500"
                      style={{ color: courant ? s.color : 'rgba(255,255,255,0.45)' }}
                    >
                      {COURT[s.slug] || s.title}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* ── Gauche : les services, l'un après l'autre ───────────────── */}
          <div>
            {SERVICES_ACCUEIL.map((s, i) => {
              const courant = actif === i;
              return (
                <div
                  key={s.slug}
                  ref={(el) => { blocs.current[i] = el; }}
                  id={`expertise-${s.slug}`}
                  className="scroll-mt-28 md:scroll-mt-32 py-6 md:py-10 lg:min-h-[72vh] lg:flex lg:flex-col lg:justify-center border-b border-white/[0.07] lg:border-0"
                >
                  {/* Sur telephone, le logo se met SUR la ligne du titre plutot
                      qu'au-dessus : empile, il coutait 76 px par service pour
                      ne rien dire de plus. Au-dessus de lg, cette rangee
                      redevient un simple bloc et le logo disparait — il est
                      alors dans le panneau colle. */}
                  <div className="mb-3.5 lg:mb-0">
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

                  {/* Allume sur le service courant : rempli et halo. Les
                      autres restent en contour. Le clic se propose au moment
                      exact ou le visiteur lit ce service-la. */}
                  <Link
                    to={`/services/${s.slug}`}
                    className="group self-start inline-flex items-center gap-2.5 px-6 py-3 md:px-7 md:py-3.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-500 hover:gap-4"
                    style={
                      courant
                        ? {
                            backgroundColor: s.color,
                            borderColor: s.color,
                            color: '#050a15',
                            boxShadow: `0 0 28px ${s.color}66`,
                          }
                        : {
                            backgroundColor: 'transparent',
                            borderColor: `${s.color}55`,
                            color: s.color,
                          }
                    }
                  >
                    Découvrir <ArrowRight className="w-4 h-4 transition-transform duration-300" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* ── Droite : le logo collé, et rien d'autre ─────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-8">

              {/* L'etiquette de section : le seul element toujours a l'ecran
                  pendant qu'on traverse les six services. */}
              <span className="text-white/35 text-[11px] font-bold tracking-[3px] uppercase">
                Nos expertises
              </span>

              <div className="relative w-[340px] h-[340px] flex items-center justify-center">

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
                    <LogoActif className="w-[230px] h-[230px]" />
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
