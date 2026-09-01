import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ClipboardList, Palette, Search, ArrowRight } from 'lucide-react';

/**
 * PourquoiNousChoisissent — un jeu de cartes qu'on retourne au défilement.
 *
 * Demande de William : « je veux qu'elle fit dans l'écran au complet, puis que
 * ça prenne une, deux, trois scrolls avant que l'écran bouge ».
 *
 * COMMENT ÇA MARCHE
 *
 * Le conteneur fait 340 vh. Dedans, un panneau `sticky top-0 h-screen` : il se
 * colle dès que le haut de la section atteint le haut de l'écran et reste
 * accroché pendant 240 vh de défilement. Ce qui bouge pendant ce temps-là,
 * ce n'est pas l'écran, c'est la carte.
 *
 * L'étape courante ne vient PAS d'un écouteur de défilement : trois zones
 * invisibles empilées sur la hauteur du conteneur sont observées par un
 * IntersectionObserver règlé sur une ligne au milieu de l'écran. Même mécanisme
 * que la section des expertises, et pour la même raison — mesuré dans le
 * navigateur, aucun événement `scroll` n'était émis, ni sur window, ni sur
 * html, ni sur body.
 *
 * POURQUOI UNE PILE ET PAS DEUX COLONNES
 *
 * La section des expertises, juste au-dessus, est déjà un panneau collé à
 * droite. Reprendre la même forme aurait donné deux sections jumelles à la
 * suite. Ici les cartes s'empilent physiquement : celle du dessus s'efface
 * vers le haut, la suivante avance. C'est un geste différent, et il porte le
 * comptage « une, deux, trois » que William décrivait.
 */

const CARTES = [
  {
    numero: '01',
    icone: <ClipboardList className="w-6 h-6" />,
    titre: 'Pas assez de contrats ?',
    texte:
      "Votre carnet de commandes est vide ? Nous ciblons les propriétaires qui cherchent activement vos services et les convertissons en clients.",
    lien: '/blog/pas-assez-contrats',
    image: '/images/contrat-signe-construction.webp',
    alt: 'Contrat de construction, plans et casque de chantier',
  },
  {
    numero: '02',
    icone: <Palette className="w-6 h-6" />,
    titre: 'Image de marque datée ?',
    texte:
      "Votre site web fait peur aux clients ? Modernisez votre image pour refléter la qualité réelle de vos travaux et inspirer confiance dès le premier regard.",
    lien: '/blog/image-marque-datee',
    image: '/images/maison-terminee-crepuscule.webp',
    alt: 'Maison neuve terminée, éclairée au crépuscule',
  },
  {
    numero: '03',
    icone: <Search className="w-6 h-6" />,
    titre: 'Perdu dans Google ?',
    texte:
      "Vos concurrents prennent toute la place ? Nous vous propulsons en tête des résultats locaux pour que les bons clients vous trouvent en premier.",
    lien: '/blog/invisible-google',
    image: '/images/entrepreneur-au-telephone.webp',
    alt: 'Entrepreneur en construction répondant à un appel de client',
  },
];

/** Où se place une carte selon sa distance à celle qui est devant. */
function pose(ecart: number) {
  if (ecart < 0) return { opacity: 0, y: -70, scale: 0.96 };   // déjà passée
  if (ecart === 0) return { opacity: 1, y: 0, scale: 1 };       // devant
  if (ecart === 1) return { opacity: 0.5, y: 26, scale: 0.95 }; // juste derrière
  return { opacity: 0.22, y: 48, scale: 0.9 };                  // au fond
}

export default function PourquoiNousChoisissent() {
  const [actif, setActif] = useState(0);
  const zones = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = zones.current.indexOf(e.target as HTMLDivElement);
          if (i !== -1) setActif(i);
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    zones.current.forEach((el) => el && observateur.observe(el));
    return () => observateur.disconnect();
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-[#060d1f] to-[#0a1628]">
      <div className="relative h-[340vh]">

        {/* ── Les trois temps du défilement ────────────────────────────────
            Invisibles, sans interaction : elles ne servent qu'à dire à quelle
            hauteur on se trouve. */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} ref={(el) => { zones.current[i] = el; }} className="h-1/3" />
          ))}
        </div>

        {/* ── L'écran qui reste accroché ───────────────────────────────── */}
        <div className="sticky top-0 z-10 h-screen overflow-hidden flex flex-col items-center justify-center px-5 md:px-6 pb-24 sm:pb-0">

          {/* Étoiles */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-60" style={{
            backgroundImage: `
              radial-gradient(1.5px 1.5px at 8%  15%, rgba(255,255,255,0.45) 0%, transparent 100%),
              radial-gradient(1px   1px   at 22% 72%, rgba(255,255,255,0.3)  0%, transparent 100%),
              radial-gradient(2px   2px   at 45% 10%, rgba(255,255,255,0.25) 0%, transparent 100%),
              radial-gradient(1px   1px   at 68% 88%, rgba(255,255,255,0.35) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 85% 30%, rgba(255,255,255,0.2)  0%, transparent 100%),
              radial-gradient(1px   1px   at 93% 65%, rgba(255,255,255,0.3)  0%, transparent 100%)
            `,
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[100px] pointer-events-none z-0" />

          <div className="relative z-10 w-full max-w-lg flex flex-col items-center">

            {/* En-tête, compact : il doit partager l'écran avec la carte. */}
            <div className="text-center mb-7 md:mb-9">
              <div className="inline-block bg-accent-blue/15 border border-accent-blue/30 text-accent-blue text-[10px] md:text-xs font-bold tracking-[2.5px] uppercase px-4 py-1.5 rounded-full mb-4">
                Pourquoi nous choisir
              </div>
              <h2 className="text-[26px] md:text-4xl font-black leading-[1.1] text-white uppercase tracking-tight">
                Pourquoi les entrepreneurs<br />
                <span className="text-accent-blue">nous choisissent ?</span>
              </h2>
            </div>

            {/* La pile. Hauteur fixe : les cartes sont superposées en absolu,
                donc rien ne la donne toute seule. */}
            <div className="relative w-full h-[420px] md:h-[460px]">
              {CARTES.map((c, i) => {
                const ecart = i - actif;
                return (
                  <motion.div
                    key={c.numero}
                    className="absolute inset-x-0 top-0 rounded-3xl overflow-hidden border border-white/10 bg-[#0a1628] shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                    animate={pose(ecart)}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ zIndex: 10 - Math.abs(ecart), pointerEvents: ecart === 0 ? 'auto' : 'none' }}
                  >
                    <div className="relative h-[168px] md:h-[190px] overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.alt}
                        loading="lazy"
                        width={900}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent opacity-90" />
                      <div className="absolute top-3 right-5 text-5xl font-black text-white/10 tabular-nums">
                        {c.numero}
                      </div>
                    </div>

                    <div className="p-6 md:p-7 relative z-10 -mt-9">
                      <div className="w-11 h-11 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue mb-4 backdrop-blur-md">
                        {c.icone}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">{c.titre}</h3>
                      <p className="text-white/60 text-[13.5px] md:text-sm leading-relaxed mb-5">{c.texte}</p>
                      <Link
                        to={c.lien}
                        className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue uppercase tracking-widest transition-all hover:gap-3.5"
                      >
                        En savoir plus <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Où on en est dans les trois. */}
            <div className="flex items-center gap-2 mt-7" aria-hidden="true">
              {CARTES.map((c, i) => (
                <span
                  key={c.numero}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: actif === i ? 32 : 12,
                    backgroundColor: actif === i ? '#00d2ff' : 'rgba(255,255,255,0.18)',
                    boxShadow: actif === i ? '0 0 12px rgba(0,210,255,0.6)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
