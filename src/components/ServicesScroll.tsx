import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../constants/services';
import { LOGOS_SERVICES } from './logosServices';

/**
 * ServicesScroll — « Nos expertises ».
 *
 * CE QUE WILLIAM A DEMANDE, MOT POUR MOT
 *
 * « Mettre les pastilles des expertises en ligne de gauche a droite, en dessous
 * de Nos expertises. Et puis quand je scroll down, apres deux, trois mouvements,
 * elles se placent toutes visuellement vers la gauche. Et quand je descends, a
 * chaque section, le logo change et la pastille de gauche s'allume. »
 *
 * COMMENT LE DEPLACEMENT EST FAIT
 *
 * Les pastilles ne sont pas dupliquees puis fondues d'un endroit a l'autre :
 * ce sont les MEMES elements qui changent de parent. Chacune porte un
 * `layoutId`, et motion se charge de la transition entre sa place dans la
 * rangee et sa place dans le rail. C'est la seule facon d'obtenir un vrai
 * deplacement plutot qu'une disparition suivie d'une apparition.
 *
 * Le passage se declenche sur une sentinelle posee sous la rangee : des
 * qu'elle sort par le haut de l'ecran, on est en rail ; des qu'elle revient,
 * la rangee se reforme. La hauteur de la rangee est mesuree une fois et
 * reservee, sinon la page sauterait au moment ou les pastilles la quittent.
 *
 * LARGEUR
 *
 * « Plus large, plus apaisant pour les yeux » : le rail colle a gauche, le logo
 * colle a droite. Le conteneur monte a 1700 px au lieu de 1152, et la grille
 * reserve ses trois colonnes en permanence — le rail ne flotte pas par-dessus
 * le texte, il a sa place.
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

function Pastille({
  service,
  courant,
}: {
  service: (typeof SERVICES)[number];
  courant: boolean;
  key?: string;
}) {
  const Logo = LOGOS_SERVICES[service.slug];
  return (
    <motion.a
      layoutId={`pastille-${service.slug}`}
      href={`#expertise-${service.slug}`}
      aria-current={courant ? 'true' : undefined}
      title={service.title}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 lg:px-3.5 lg:py-3 transition-colors duration-500"
      style={
        courant
          ? { backgroundColor: `${service.color}1F`, borderColor: service.color, boxShadow: `0 0 20px ${service.color}44` }
          : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.10)' }
      }
    >
      <span
        className="flex-none w-6 h-6 lg:w-7 lg:h-7 transition-opacity duration-500"
        style={{ color: service.color, opacity: courant ? 1 : 0.42 }}
      >
        <Logo className="w-full h-full" />
      </span>
      <span
        className="hidden sm:block whitespace-nowrap text-[11px] lg:text-xs font-bold uppercase tracking-wider transition-colors duration-500"
        style={{ color: courant ? service.color : 'rgba(255,255,255,0.45)' }}
      >
        {COURT[service.slug] || service.title}
      </span>
    </motion.a>
  );
}

export default function ServicesScroll() {
  const [actif, setActif] = useState(0);
  const [enRail, setEnRail] = useState(false);
  const [hauteurRangee, setHauteurRangee] = useState<number>();

  const blocs = useRef<(HTMLDivElement | null)[]>([]);
  const zoneRangee = useRef<HTMLDivElement>(null);
  const parcours = useRef<HTMLDivElement>(null);

  // Le service courant : celui dont le bloc traverse le milieu de l'ecran.
  // Un IntersectionObserver plutot qu'un ecouteur de defilement — mesure dans
  // le navigateur, aucun evenement `scroll` n'est emis ici, ni sur window, ni
  // sur html, ni sur body.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = blocs.current.indexOf(e.target as HTMLDivElement);
          if (i !== -1) setActif(i);
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    blocs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // La rangee garde sa hauteur reservee quand les pastilles la quittent,
  // sinon toute la page remonte d'un coup au moment du passage en rail.
  useLayoutEffect(() => {
    const el = zoneRangee.current;
    if (el && hauteurRangee === undefined) setHauteurRangee(el.offsetHeight);
  }, [hauteurRangee]);

  // Bascule rangee / rail.
  //
  // On observe LA GRILLE du parcours — plusieurs ecrans de haut — avec une
  // bande d'observation au milieu de l'ecran. La condition se reduit alors a
  // `isIntersecting`, sans lecture de coordonnees.
  //
  // C'est le troisieme essai, et les deux premiers ont echoue pour la meme
  // raison : la condition lisait `boundingClientRect.top < 0` au moment du
  // franchissement. Or la rangee sort de l'ecran par le BAS de sa boite —
  // quand son bord inferieur passe la ligne, son bord superieur est encore
  // positif de toute sa hauteur. La condition etait donc fausse au seul
  // instant ou elle etait evaluee. Elle ne devenait vraie que si le
  // defilement se faisait par bonds assez gros pour que le rectangle
  // enregistre soit deja au-dessus — ce qui etait le cas de mes essais, et
  // jamais celui d'un vrai visiteur qui defile doucement.
  useEffect(() => {
    const el = parcours.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setEnRail(e.isIntersecting),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const service = SERVICES_ACCUEIL[actif];
  const LogoActif = LOGOS_SERVICES[service.slug];

  return (
    <section className="relative dalle dalle-fond px-4 md:px-6 xl:px-10 py-28 md:py-44">
      <div className="mx-auto max-w-[1700px]">

        {/* ── En-tête ──────────────────────────────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-accent-blue text-[11px] md:text-xs font-bold tracking-[3px] uppercase mb-5">
            Six services · Un seul métier
          </span>
          <h2 className="text-[42px] md:text-7xl font-black mb-6 text-3d uppercase italic leading-[0.95]">
            Nos expertises
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent-blue to-cyan-300 rounded-full mx-auto mb-6" />
          <p className="text-white/50 text-[15px] md:text-lg max-w-xl mx-auto">
            Tout ce dont un entrepreneur a besoin pour bâtir une présence en ligne indestructible.
          </p>
        </div>

        {/* ── La rangée, de gauche à droite ────────────────────────────── */}
        <div
          ref={zoneRangee}
          style={{ minHeight: hauteurRangee }}
          className="flex flex-wrap justify-center gap-2 mb-14 md:mb-20"
        >
          {!enRail && SERVICES_ACCUEIL.map((s, i) => (
            <Pastille key={s.slug} service={s} courant={actif === i} />
          ))}
        </div>

        {/* ── Le parcours ──────────────────────────────────────────────── */}
        <div ref={parcours} className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 md:gap-8 lg:grid-cols-[200px_minmax(0,1fr)_420px] lg:gap-10 xl:gap-20">

          {/* Rail gauche : les pastilles viennent s'y ranger. */}
          <div>
            <nav aria-label="Les six expertises" className="sticky top-28 flex flex-col gap-2">
              {enRail && SERVICES_ACCUEIL.map((s, i) => (
                <Pastille key={s.slug} service={s} courant={actif === i} />
              ))}
            </nav>
          </div>

          {/* Les services, l'un après l'autre. */}
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
                  <span
                    className="hidden lg:block text-sm font-black tabular-nums tracking-widest mb-4 transition-colors duration-500"
                    style={{ color: courant ? s.color : 'rgba(255,255,255,0.18)' }}
                  >
                    {String(i + 1).padStart(2, '0')} / 06
                  </span>

                  <h3
                    className="text-[21px] md:text-4xl font-black uppercase leading-[1.12] mb-3.5 lg:mb-4 transition-colors duration-500"
                    style={{ color: courant ? s.color : undefined }}
                  >
                    {s.title}
                  </h3>

                  <p className="text-white/60 text-[15px] md:text-lg leading-relaxed mb-4 lg:mb-6 max-w-xl">
                    {s.shortDesc}
                  </p>

                  {/* Le détail ne s'affiche qu'à partir de lg : la grille de
                      cartes qu'on remplace ne le montrait pas non plus, et sur
                      téléphone il rallongeait la section de 660 px. */}
                  <ul className="hidden lg:block space-y-2.5 mb-7 max-w-xl">
                    {s.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-3 text-white/50 text-[13px] md:text-sm">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: s.color }} />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Allumé sur le service courant, en contour sinon. */}
                  <Link
                    to={`/services/${s.slug}`}
                    className="group self-start inline-flex items-center gap-2.5 px-6 py-3 md:px-7 md:py-3.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-500 hover:gap-4"
                    style={
                      courant
                        ? { backgroundColor: s.color, borderColor: s.color, color: '#050a15', boxShadow: `0 0 28px ${s.color}66` }
                        : { backgroundColor: 'transparent', borderColor: `${s.color}55`, color: s.color }
                    }
                  >
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Le logo collé à droite, et rien d'autre. */}
          <div className="hidden lg:block">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-8">
              <span className="text-white/30 text-[11px] font-bold tracking-[3px] uppercase">
                Nos expertises
              </span>

              <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full blur-[80px]"
                  animate={{ backgroundColor: `${service.color}33` }}
                  transition={{ duration: 0.6 }}
                />

                <motion.div
                  key={service.slug}
                  initial={{ scale: 0.88, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                  style={{ color: service.color }}
                >
                  <LogoActif className="w-[250px] h-[250px]" />
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
