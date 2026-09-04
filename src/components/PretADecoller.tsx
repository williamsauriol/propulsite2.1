import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, MessageSquareOff } from 'lucide-react';

/**
 * PretADecoller — la console de lancement. Dernière section de l'accueil.
 *
 * POURQUOI LA REFAIRE EN ENTIER
 *
 * L'ancienne version était une carte de 560×280 qui pivotait selon une grille
 * de 25 zones de survol. Trois défauts, du plus grave au moins grave :
 *
 * 1. L'OFFRE ÉTAIT CACHÉE. Le paragraphe et le bouton vivaient dans un bloc à
 *    `opacity: 0` que seul un survol révélait. Sur un téléphone il n'y a pas de
 *    survol : la moitié des visiteurs ne voyait jamais ni l'offre, ni le bouton,
 *    ni une raison de cliquer. C'est la section qui fait signer, et elle était
 *    muette pour le trafic mobile.
 * 2. Vingt-cinq div de survol et vingt-cinq règles CSS pour une rotation par
 *    paliers de 5°. Ça saute, et ça ne suit pas vraiment le curseur.
 * 3. Aucune preuve, aucun délai, aucune raison d'agir maintenant. « Prêt à
 *    décoller ? » est une question, pas une offre.
 *
 * CE QUI LA REMPLACE
 *
 * Une salle de lancement. Le sol fuit vers un horizon, deux rampes de lumière
 * convergent, et la console flotte au-dessus. Le vocabulaire est celui de la
 * section « pourquoi nous choisissent » — sol, plafond, profondeur réelle,
 * caméra qui suit la souris. Deux grammaires 3D différentes sur une même page
 * se liraient comme deux sites collés.
 *
 * LA PROFONDEUR EST DÉCLARÉE, PAS DESSINÉE
 *
 * `perspective` sur la salle, `preserve-3d` sur la console, et chaque couche à
 * sa propre distance : le halo à -140 px, le cadre à 0, le texte à +26, le
 * bouton à +58, la fusée à +80. Quand la caméra bouge, elles glissent les unes
 * sur les autres à des vitesses que le moteur calcule — aucune interpolation
 * manuelle ne rend ça juste. C'est ce décalage-là qui fait la profondeur, pas
 * la rotation.
 *
 * LA POUSSÉE
 *
 * Sous la console, un cône de lumière qui s'allume quand la souris approche du
 * bouton. Il ne décore pas : il dit où appuyer. Le regard suit la lumière.
 *
 * TOUT EST VISIBLE SANS BOUGER LA SOURIS
 *
 * Le titre, l'offre, le bouton, le délai et les trois garanties sont lisibles
 * au premier coup d'œil, sur téléphone comme sur écran. La 3D ajoute; elle ne
 * conditionne rien. Aucune opacity animée non plus : le HTML pré-rendu que
 * lisent Google et les robots IA sort avec tout le texte en clair.
 */

const CSS = `
.pad{
  --cx:0; --cy:0; --feu:0;
  perspective:1400px;
  perspective-origin:calc(50% + var(--cx) * 6%) calc(38% + var(--cy) * 5%);
  position:relative;
  /* L'espace du pas de tir. Sans lui, le sol et la poussée vivent DERRIÈRE la
     console et on ne voit ni l'un ni l'autre : il ne reste qu'un panneau posé
     sur du noir. Ces 210 px sont la scène — c'est là que la lumière se pose et
     que les rampes convergent. */
  padding-bottom:210px;
}

/* ── Le sol ─────────────────────────────────────────────────────────────
   Il fait l'horizon. Sans lui la console ne flotte pas, elle est posée sur
   un rectangle. Masque sur les deux axes : une grille qui s'arrête net sur
   ses bords donne un rectangle de quadrillage en plein milieu de l'écran. */
.pad-sol{
  position:absolute; left:-30%; right:-30%; bottom:0; height:240px;
  transform-origin:50% 100%;
  transform:rotateX(75deg) translateZ(-30px) translateX(calc(var(--cx) * -30px));
  background-image:
    linear-gradient(rgba(0,210,255,.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,210,255,.16) 1px, transparent 1px);
  background-size:84px 84px;
  -webkit-mask-image:linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.4) 38%, transparent 76%),
                     linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, transparent 100%);
  -webkit-mask-composite:source-in;
  mask-image:linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.4) 38%, transparent 76%),
             linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, transparent 100%);
  mask-composite:intersect;
  pointer-events:none;
}

/* Les deux rampes qui convergent vers la console. Elles ne décorent pas :
   deux lignes qui fuient vers un même point disent au regard où aller. */
.pad-rampe{
  position:absolute; bottom:20px; height:2px; width:46%;
  background:linear-gradient(90deg, transparent, rgba(0,210,255,.55));
  filter:blur(1px);
  transform-origin:100% 50%;
  pointer-events:none;
}
.pad-rampe.g{ left:0;  transform:rotateX(75deg) rotate(-13deg) translateZ(-28px); }
.pad-rampe.d{ right:0; transform:rotateX(75deg) rotate(13deg) translateZ(-28px) scaleX(-1); }

.pad-horizon{
  position:absolute; left:0; right:0; bottom:230px; height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,210,255,.3) 28%, rgba(0,210,255,.3) 72%, transparent);
  filter:blur(.6px);
  pointer-events:none;
}

/* ── La poussée ─────────────────────────────────────────────────────────
   Un cône sous la console. Il s'allume quand la souris approche du bouton :
   la lumière dit où appuyer, et le regard la suit. */
.pad-poussee{
  position:absolute; left:50%; bottom:40px;
  width:340px; height:230px;
  transform:translateX(-50%) translateZ(-60px) scaleY(calc(.7 + var(--feu) * .5));
  background:radial-gradient(ellipse at 50% 0%,
    rgba(0,210,255,.34) 0%,
    rgba(0,140,220,.16) 34%,
    transparent 70%);
  filter:blur(24px);
  opacity:calc(.28 + var(--feu) * .72);
  transition:opacity .45s ease, transform .45s ease;
  pointer-events:none;
}

/* ── La console ─────────────────────────────────────────────────────────
   preserve-3d : ses couches vivent chacune à sa distance et le moteur les
   projette. Le léger rotateX vient de la caméra, pas d'une rotation choisie
   à la main — on penche la tête, on ne fait pas tourner l'objet. */
.pad-console{
  position:relative;
  transform-style:preserve-3d;
  transform:
    rotateX(calc(var(--cy) * -4.5deg))
    rotateY(calc(var(--cx) * 6deg))
    translateZ(calc(var(--feu) * 18px));
  transition:transform .5s cubic-bezier(.2,.8,.25,1);
}

/* Le halo derrière la console : c'est lui qui la décolle du fond. Loin
   derrière, donc il parallaxe le plus. */
.pad-halo{
  position:absolute; left:50%; top:50%;
  width:760px; height:560px;
  transform:translate(-50%,-50%) translateZ(-140px);
  background:radial-gradient(ellipse at 50% 50%,
    rgba(0,210,255,.16) 0%,
    rgba(0,90,180,.09) 40%,
    transparent 72%);
  filter:blur(50px);
  pointer-events:none;
}

/* Le cadre. Son liseré s'allume du côté d'où vient la lumière : une arête
   qui reste éclairée pareil pendant que l'objet penche trahit la surface
   plate. */
.pad-cadre{
  position:relative;
  border-radius:32px;
  background:
    linear-gradient(160deg, rgba(16,32,62,.96) 0%, rgba(8,17,36,.98) 52%, rgba(6,12,26,.99) 100%);
  box-shadow:
    0 0 0 1px rgba(0,210,255,calc(.16 + var(--feu) * .22)),
    calc(var(--cx) * -20px) calc(42px + var(--cy) * 14px) 90px rgba(0,0,0,.72),
    0 0 90px rgba(0,210,255,calc(.05 + var(--feu) * .12)),
    inset 0 1px 0 rgba(255,255,255,calc(.10 + var(--cx) * .05));
  overflow:hidden;
}

/* Les étoiles du fond de console, décalées à l'inverse de la caméra : elles
   sont derrière la vitre, donc elles bougent moins vite que le cadre. */
.pad-etoiles{
  position:absolute; inset:-8%;
  transform:translate(calc(var(--cx) * 14px), calc(var(--cy) * 10px));
  background-image:
    radial-gradient(1.6px 1.6px at 12% 22%, rgba(255,255,255,.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 31% 68%, rgba(255,255,255,.35) 0%, transparent 100%),
    radial-gradient(2px 2px at 54% 14%, rgba(255,255,255,.28) 0%, transparent 100%),
    radial-gradient(1px 1px at 72% 78%, rgba(255,255,255,.4) 0%, transparent 100%),
    radial-gradient(1.4px 1.4px at 88% 34%, rgba(255,255,255,.24) 0%, transparent 100%),
    radial-gradient(1px 1px at 46% 90%, rgba(255,255,255,.3) 0%, transparent 100%);
  pointer-events:none;
}

/* Les couches de contenu. Chaque translateZ est une distance réelle : c'est
   ce qui les fait parallaxer les unes sur les autres quand la caméra bouge. */
.pad-avant  { transform:translateZ(26px); }
.pad-bouton { transform:translateZ(58px); }
.pad-fusee  { transform:translateZ(80px); }

/* Le bouton. Sa lueur monte avec --feu, comme la poussée sous la console :
   les deux répondent au même geste, donc l'œil relie l'un à l'autre. */
.pad-cta{
  box-shadow:
    0 10px 30px rgba(0,0,0,.45),
    0 0 calc(24px + var(--feu) * 40px) rgba(0,210,255,calc(.35 + var(--feu) * .45));
  transition:box-shadow .4s ease, transform .3s cubic-bezier(.2,.8,.25,1);
}
.pad-cta:hover{ transform:translateY(-2px) scale(1.02); }

@media (max-width: 767px){
  /* Sur un écran étroit, la perspective se resserre et les distances en Z se
     raccourcissent : à 1400 px de focale, une couche à +80 déborde du cadre. */
  .pad{ perspective:900px; }
  .pad-avant  { transform:translateZ(14px); }
  .pad-bouton { transform:translateZ(30px); }
  .pad-fusee  { transform:translateZ(42px); }
  .pad-halo   { width:420px; height:380px; }
  .pad-poussee{ width:220px; height:150px; bottom:28px; }
  .pad{ padding-bottom:130px; }
  .pad-sol{ height:150px; }
  .pad-horizon{ bottom:145px; }
}

@media (prefers-reduced-motion: reduce){
  .pad-console{ transform:none; transition:none; }
  .pad-cta:hover{ transform:none; }
  .pad-poussee{ transition:none; }
}
`;

/** Ce qui lève les trois objections qu'un entrepreneur a devant un formulaire :
 *  « ça va me prendre du temps », « je vais me faire relancer », « ils vont me
 *  vendre quelque chose dont je n'ai pas besoin ». */
const GARANTIES = [
  { icone: <Clock className="w-4 h-4" />, texte: 'Réponse en 24 h ouvrables' },
  { icone: <ShieldCheck className="w-4 h-4" />, texte: 'Sans engagement' },
  { icone: <MessageSquareOff className="w-4 h-4" />, texte: 'On vous dit non si vous n’en avez pas besoin' },
];

/** Lissage de la caméra. Même valeur que la pile de cartes : deux effets 3D
 *  sur une page doivent réagir avec la même inertie. */
const LISSAGE = 6.5;

export default function PretADecoller() {
  const salle = useRef<HTMLDivElement | null>(null);
  const bouton = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = salle.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let viseX = 0, viseY = 0, viseF = 0;
    let x = 0, y = 0, f = 0;
    let boucle = 0, t0 = 0, vivant = false;

    const suivre = (t: number) => {
      const dt = t0 ? Math.min((t - t0) / 1000, 0.1) : 0.016;
      t0 = t;
      const k = 1 - Math.exp(-LISSAGE * dt);
      x += (viseX - x) * k;
      y += (viseY - y) * k;
      f += (viseF - f) * k;
      el.style.setProperty('--cx', x.toFixed(4));
      el.style.setProperty('--cy', y.toFixed(4));
      el.style.setProperty('--feu', f.toFixed(4));
      if (Math.abs(viseX - x) + Math.abs(viseY - y) + Math.abs(viseF - f) > 0.0015) {
        boucle = requestAnimationFrame(suivre);
      } else {
        vivant = false;
        t0 = 0;
      }
    };

    const relancer = () => {
      if (vivant) return;
      vivant = true;
      t0 = 0;
      boucle = requestAnimationFrame(suivre);
    };

    /* Rectangles en cache. Les lire dans le gestionnaire forcerait un recalcul
       de mise en page à chaque trame : la boucle écrit des variables en fin de
       trame, ce qui invalide la mise en page, et la lecture suivante oblige le
       navigateur à tout recalculer sur-le-champ. */
    let rSalle: DOMRect | null = null;
    let rBouton: DOMRect | null = null;
    const oublier = () => { rSalle = null; rBouton = null; };

    const bouger = (e: PointerEvent) => {
      if (!rSalle) rSalle = el.getBoundingClientRect();
      const r = rSalle;
      if (r.bottom < 0 || r.top > innerHeight) return;
      viseX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      viseY = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));

      /* La poussée monte quand le curseur approche du bouton, et pas seulement
         quand il est dessus : l'allumage doit précéder le survol, sinon il
         confirme un geste déjà décidé au lieu de l'appeler. */
      const b = bouton.current;
      if (b) {
        if (!rBouton) rBouton = b.getBoundingClientRect();
        const cx = rBouton.left + rBouton.width / 2;
        const cy = rBouton.top + rBouton.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        viseF = Math.max(0, Math.min(1, 1 - (d - 90) / 300));
      }
      relancer();
    };

    const sortir = () => { viseX = 0; viseY = 0; viseF = 0; relancer(); };

    addEventListener('pointermove', bouger, { passive: true });
    addEventListener('scroll', oublier, { passive: true });
    addEventListener('resize', oublier);
    addEventListener('blur', sortir);
    document.addEventListener('pointerleave', sortir);

    return () => {
      removeEventListener('pointermove', bouger);
      removeEventListener('scroll', oublier);
      removeEventListener('resize', oublier);
      removeEventListener('blur', sortir);
      document.removeEventListener('pointerleave', sortir);
      cancelAnimationFrame(boucle);
    };
  }, []);

  return (
    <section className="relative px-5 md:px-6 py-28 md:py-40 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div ref={salle} className="pad max-w-3xl mx-auto">
        <div className="pad-sol" aria-hidden="true" />
        <div className="pad-rampe g" aria-hidden="true" />
        <div className="pad-rampe d" aria-hidden="true" />
        <div className="pad-horizon" aria-hidden="true" />
        <div className="pad-poussee" aria-hidden="true" />

        <div className="pad-console relative z-10">
          <div className="pad-halo" aria-hidden="true" />

          <div className="pad-cadre px-6 py-12 md:px-14 md:py-16 text-center">
            <div className="pad-etoiles" aria-hidden="true" />

            <div className="relative">
              <div className="pad-fusee flex justify-center mb-7">
                <img
                  src="/images/logo-fuser-sans-backk.png"
                  alt=""
                  aria-hidden="true"
                  width={450}
                  height={450}
                  className="h-14 md:h-16 w-auto"
                  style={{ filter: 'drop-shadow(0 8px 26px rgba(0,210,255,0.55))' }}
                />
              </div>

              <div className="pad-avant">
                <p className="text-[10px] md:text-xs font-bold tracking-[0.28em] uppercase text-accent-blue mb-5">
                  Dernière étape
                </p>

                <h2 className="text-[34px] md:text-6xl font-black text-white uppercase leading-[0.95] tracking-tight mb-6">
                  Prêt à<br />
                  <span className="text-accent-blue">décoller ?</span>
                </h2>

                {/* L'offre est écrite, pas cachée derrière un survol. C'est
                    elle qui fait cliquer, et la moitié du trafic est sur un
                    téléphone où le survol n'existe pas. */}
                <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-9">
                  On regarde votre fiche Google, votre site et vos concurrents
                  directs dans votre ville. Quinze minutes, et vous savez
                  exactement ce qui vous coûte des contrats.
                </p>
              </div>

              <div className="pad-bouton">
                <Link
                  ref={bouton}
                  to="/funnel"
                  className="pad-cta inline-flex items-center justify-center gap-3 bg-accent-blue text-[#050a15] font-black text-base md:text-lg uppercase tracking-wide px-9 py-5 md:px-12 md:py-6 rounded-full min-h-[48px] hover:brightness-110"
                >
                  Obtenir mon analyse gratuite
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <ul className="pad-avant mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {GARANTIES.map((g) => (
                  <li
                    key={g.texte}
                    className="inline-flex items-start gap-2 text-white/55 text-[12.5px] md:text-sm text-left"
                  >
                    {/* `items-start` et non `items-center` : la troisième
                        garantie passe sur deux lignes en écran étroit, et une
                        icône centrée verticalement se retrouvait alors dans le
                        vide, à gauche du bloc de texte. */}
                    <span className="text-accent-blue shrink-0 mt-[1px]">{g.icone}</span>
                    {g.texte}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
