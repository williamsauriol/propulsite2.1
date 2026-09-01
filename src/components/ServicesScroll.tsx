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

          {/* Les six, annoncees avant le parcours. Chacune saute a son service :
              la carte pour celui qui decouvre, un raccourci pour celui qui sait
              deja ce qu'il cherche. */}
          <nav aria-label="Les six expertises" className="flex flex-wrap justify-center gap-2 md:gap-2.5">
            {SERVICES_ACCUEIL.map((s, i) => {
              const Logo = LOGOS_SERVICES[s.slug];
              const courant = actif === i;
              return (
                <a
                  key={s.slug}
                  href={`#expertise-${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 md:px-4 md:py-2.5 text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all duration-500 hover:-translate-y-0.5"
                  style={
                    courant
                      ? { backgroundColor: `${s.color}1F`, borderColor: s.color, color: s.color }
                      : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)' }
                  }
                >
                  <Logo className="w-4 h-4" style={{ color: s.color }} />
                  {COURT[s.slug] || s.title}
                </a>
              );
            })}
          </nav>
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
                  id={`expertise-${s.slug}`}
                  className="scroll-mt-24 py-6 md:py-10 lg:min-h-[72vh] lg:flex lg:flex-col lg:justify-center border-b border-white/[0.07] lg:border-0"
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

              {/* Six segments : ou on est, et combien il en reste. */}
              <div className="flex items-center gap-2" aria-hidden="true">
                {SERVICES_ACCUEIL.map((autre, i) => (
                  <span
                    key={autre.slug}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: actif === i ? 34 : 14,
                      backgroundColor: actif === i ? autre.color : 'rgba(255,255,255,0.15)',
                      boxShadow: actif === i ? `0 0 12px ${autre.color}88` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
