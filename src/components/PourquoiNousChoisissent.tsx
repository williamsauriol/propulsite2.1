import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Palette, Search, ArrowRight } from 'lucide-react';

/**
 * PourquoiNousChoisissent — trois lucarnes dans une salle éclairée.
 *
 * CE QUI CHANGE, ET POURQUOI
 *
 * L'ancienne version empilait trois rectangles plats et les faisait glisser en
 * y. Le geste marchait, mais rien n'avait d'épaisseur : une carte à opacity 0.5
 * derrière une autre, c'est un calque, pas un objet.
 *
 * Ici la profondeur n'est pas suggérée, elle est déclarée au navigateur. Trois
 * perspectives imbriquées, chacune avec un seul métier :
 *
 *   1. LA SALLE       perspective 1500px sur .pq3d-scene
 *                     Un plancher quadrillé posé à plat fabrique un horizon.
 *                     Sans sol, un objet ne flotte pas : il est juste dessiné.
 *
 *   2. LA PILE        transform-style: preserve-3d
 *                     Les trois cartes sont à -320 / -150 / 0 px de profondeur.
 *                     Leur taille et leur ordre d'occultation sont calculés par
 *                     le moteur. Je ne truque aucun scale, aucun z-index.
 *
 *   3. LA LUCARNE     perspective 600px, à l'intérieur de chaque carte
 *                     L'image est enfoncée à -170px derrière une vitre, avec de
 *                     la brume à -95 et des poussières à -45. Le numéro flotte
 *                     à +45, devant la vitre. La carte est une fenêtre percée
 *                     dans une boîte, pas une surface imprimée.
 *
 * LA CAMÉRA, PAS L'OBJET
 *
 * Faire tourner la carte est le réflexe évident, et c'est celui qui tue
 * l'illusion : à 20° on voit que le rectangle est vide. Ici on déplace
 * `perspective-origin` de la lucarne — donc le point de vue. Les couches
 * glissent alors les unes sur les autres à des vitesses inversement
 * proportionnelles à leur profondeur, ce que le moteur calcule tout seul et
 * qu'aucune interpolation manuelle ne rend juste. La carte elle-même n'incline
 * que de 8° : la tête qui se penche, pas l'objet qui pivote.
 *
 * LA BRUME PLUTÔT QUE LA TRANSPARENCE
 *
 * Les cartes du fond sont assombries par `filter: brightness()`, jamais par de
 * l'opacity. Elles restent des objets opaques, donc elles se cachent vraiment
 * les unes derrière les autres. Une carte translucide se lit comme un fantôme ;
 * une carte sombre se lit comme une carte qui est loin.
 *
 * PRÉ-RENDU
 *
 * Ce fichier n'importe plus `motion`. Les états sont des classes CSS pilotées
 * par `data-etat`, donc le HTML écrit par prerender.ts ne contient plus une
 * seule opacity en style inline — l'ancienne version y sortait les cartes 02 et
 * 03 à `opacity:0.22`. Et l'état par défaut du CSS est exactement l'état
 * `actif = 0` : ce que le robot lit, ce que l'usager voit avant l'hydratation et
 * ce que React affiche après sont la même image. Aucun saut de mise en page.
 *
 * MÉCANIQUE DE DÉFILEMENT — INCHANGÉE
 *
 * 340vh, panneau `sticky top-0 h-screen`, trois zones invisibles lues par un
 * IntersectionObserver réglé sur la ligne du milieu. C'est ce que William a
 * demandé (« une, deux, trois scrolls »), et aucun événement `scroll` n'est émis
 * sur ce site — on n'y touche pas.
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

/* Positions et retards figés, jamais tirés au hasard : Math.random() donnerait
   un HTML pré-rendu différent du premier rendu client, et React signalerait un
   écart d'hydratation. */
const GRAINS = [
  { g: 11, h: 24, t: 9.5, r: 0.0, d: 2.0 },
  { g: 26, h: 62, t: 12.0, r: 1.8, d: 1.5 },
  { g: 38, h: 15, t: 8.0, r: 3.4, d: 2.5 },
  { g: 49, h: 78, t: 13.5, r: 0.9, d: 1.5 },
  { g: 57, h: 38, t: 10.5, r: 5.1, d: 2.0 },
  { g: 68, h: 68, t: 11.0, r: 2.6, d: 3.0 },
  { g: 79, h: 22, t: 9.0, r: 4.3, d: 1.5 },
  { g: 88, h: 55, t: 14.0, r: 1.2, d: 2.0 },
  { g: 94, h: 33, t: 10.0, r: 6.0, d: 1.5 },
];

/** Nom d'état lisible plutôt qu'un nombre : c'est lui qui choisit la règle CSS. */
function etat(ecart: number) {
  if (ecart < 0) return 'avant';   // elle est passée à côté de nous
  if (ecart === 0) return 'actif';
  if (ecart === 1) return 'proche';
  return 'loin';
}

const CSS = `
.pq3d-scene{
  --cx:0; --cy:0;
  perspective:1500px;
  perspective-origin:50% 44%;
  position:relative;
}

/* ── Le plancher ────────────────────────────────────────────────────────
   Une grille de plan de chantier posée à plat. C'est elle qui donne un
   horizon : sans sol, la carte ne flotte pas, elle est simplement dessinée.
   Le masque l'efface vers le fond pour qu'aucune ligne ne s'arrête net. */
.pq3d-sol{
  position:absolute; left:-25%; right:-25%; bottom:-6%; height:62%;
  transform-origin:50% 100%;
  transform:rotateX(74deg) translateZ(-40px) translateX(calc(var(--cx) * -26px));
  background-image:
    linear-gradient(rgba(0,210,255,.17) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,210,255,.17) 1px, transparent 1px);
  background-size:78px 78px;
  /* Fondu sur LES DEUX axes. Avec un masque vertical seul, le sol s'arrêtait
     net sur ses bords : un rectangle de grille de 768 px avec deux arêtes
     franches en plein milieu d'un écran large. Le second masque efface les
     côtés ; mask-composite intersect ne garde que ce que les deux laissent
     passer, donc le sol s'éteint vers le haut ET vers l'extérieur. */
  -webkit-mask-image:linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 34%, transparent 74%),
                     linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, transparent 100%);
  -webkit-mask-composite:source-in;
  mask-image:linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 34%, transparent 74%),
             linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, transparent 100%);
  mask-composite:intersect;
  pointer-events:none;
}
/* ── Le plafond ─────────────────────────────────────────────────────────
   Le pendant du plancher, incliné dans l'autre sens. Il ne sert pas à
   décorer : un sol tout seul dit « objet posé sur une surface », un sol ET un
   plafond disent « vous êtes DANS une pièce ». C'est ce qui fait qu'on sent
   qu'on est arrivé ailleurs dans le site plutôt que devant une section de
   plus. Deux fois plus discret que le sol — un plafond qu'on remarque devient
   un deuxième plancher, et le regard ne sait plus où se poser. */
.pq3d-plafond{
  position:absolute; left:-25%; right:-25%; top:-10%; height:46%;
  transform-origin:50% 0%;
  transform:rotateX(-72deg) translateZ(-40px) translateX(calc(var(--cx) * -18px));
  background-image:
    linear-gradient(rgba(0,210,255,.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,210,255,.09) 1px, transparent 1px);
  background-size:78px 78px;
  -webkit-mask-image:linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.5) 46%, rgba(0,0,0,.8) 100%),
                     linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 24%, rgba(0,0,0,1) 76%, transparent 100%);
  -webkit-mask-composite:source-in;
  mask-image:linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.5) 46%, rgba(0,0,0,.8) 100%),
             linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 24%, rgba(0,0,0,1) 76%, transparent 100%);
  mask-composite:intersect;
  pointer-events:none;
}

/* La ligne d'horizon : le plancher doit finir quelque part. */
.pq3d-horizon{
  position:absolute; left:0; right:0; top:42%; height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,210,255,.28) 30%, rgba(0,210,255,.28) 70%, transparent);
  filter:blur(.5px);
  pointer-events:none;
}

.pq3d-pile{ position:relative; width:100%; transform-style:preserve-3d; }

/* ── Le travelling ──────────────────────────────────────────────────────
   Deux transforms séparées sur deux éléments imbriqués, et c'est volontaire :
   celle-ci est transitionnée et pilotée par l'état, celle de .pq3d-carte est
   pilotée par le pointeur soixante fois par seconde. Sur un seul élément,
   chaque écriture de variable relancerait la transition — l'objet resterait
   mou en permanence. */
.pq3d-place{
  position:absolute; left:0; right:0; top:0;
  --prof:0px; --descente:0px;
  transform:translate3d(0, var(--descente), var(--prof));
  transition:transform .78s cubic-bezier(.18,.9,.22,1),
             opacity .5s ease,
             filter .78s ease;
  pointer-events:none;
}
/* Elle est passée devant nous et sort du cadre. La seule opacity du fichier,
   et elle ne concerne jamais l'état par défaut du pré-rendu. */
.pq3d-place[data-etat="avant"]{ --prof:300px; --descente:-46px; opacity:0; }
.pq3d-place[data-etat="actif"]{ --prof:0px; --descente:0px; opacity:1; pointer-events:auto; }
/* Assombries, pas transparentes : elles restent des objets opaques, donc elles
   s'occultent vraiment. Une carte translucide se lit comme un fantôme.

   DEUX RÉGLAGES MESURÉS DANS LE NAVIGATEUR, pas devinés.

   La variable --descente est NÉGATIVE. Il l'était positif : les cartes du fond descendaient
   en rétrécissant, donc elles disparaissaient entièrement derrière celle de
   devant. Capture à 1400×1000 : on ne voyait qu'une seule carte, et toute
   l'idée de pile tombait. Elles remontent maintenant, et leur sommet dépasse
   d'environ 22 px chacune — l'étagement d'un jeu de cartes tenu en main. La
   valeur est divisée par le facteur de perspective (1500/(1500+prof)), sinon
   le déplacement à l'écran ne vaut pas celui qu'on a écrit.

   Le brightness remonte de .5/.3 à .78/.62. Le fond du site est #050a15, soit
   rgb(5,10,21) ; la carte est #0a1628, soit rgb(10,22,40). À brightness .3 elle
   tombait à rgb(3,7,12) — PLUS SOMBRE QUE LA PAGE. Une carte lointaine doit
   être atténuée, pas creusée : en dessous de la couleur du fond, ce n'est plus
   un objet loin, c'est un trou. Le plancher minimum est donc le fond de page. */
.pq3d-place[data-etat="proche"]{ --prof:-155px; --descente:-46px; filter:brightness(.78) saturate(.72) blur(.4px); }
.pq3d-place[data-etat="loin"]  { --prof:-325px; --descente:-99px; filter:brightness(.62) saturate(.5) blur(1px); }
/* On se penche vers la carte de devant. */
.pq3d-place[data-etat="actif"]:hover{ --prof:24px; }

/* ── L'ombre de contact et le rebond de lumière ─────────────────────────
   Ce que le regard lit en premier pour décider qu'un objet est posé quelque
   part. Elles glissent à contresens de la caméra parce qu'elles sont plus
   loin que la carte. */
.pq3d-ombre{
  position:absolute; left:7%; right:7%; bottom:-30px; height:64px;
  border-radius:50%;
  background:radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.68) 0%, rgba(0,0,0,.3) 48%, transparent 72%);
  filter:blur(16px);
  transform:translateX(calc(var(--cx) * -16px));
  pointer-events:none;
}
.pq3d-rebond{
  position:absolute; left:22%; right:22%; bottom:-16px; height:30px;
  border-radius:50%;
  background:radial-gradient(ellipse at 50% 50%, rgba(0,210,255,.3) 0%, transparent 70%);
  filter:blur(12px);
  transform:translateX(calc(var(--cx) * -10px));
  pointer-events:none;
}

/* ── La carte ───────────────────────────────────────────────────────────
   Pas d'overflow:hidden ici : il forcerait transform-style à plat et écraserait
   toute la profondeur intérieure. Le rognage est fait par la lucarne seule.
   Le biseau est un vrai biseau : arête haute claire, arête basse sombre, comme
   un panneau réel sous une lumière venue d'en haut à gauche. */
.pq3d-carte{
  position:relative;
  border-radius:26px;
  background:linear-gradient(160deg, #10203a 0%, #0a1628 46%, #071120 100%);
  perspective:900px;
  transform-origin:50% 55%;
  box-shadow:
    inset 1px 1px 0 rgba(255,255,255,.13),
    inset -1px -1px 0 rgba(0,0,0,.55),
    0 0 0 1px rgba(255,255,255,.07),
    0 30px 70px rgba(0,0,0,.55);
}
/* Seule la carte de devant reçoit la caméra : les autres sont dans la brume,
   les incliner n'ajouterait rien et coûterait des recalculs. */
.pq3d-place[data-etat="actif"] .pq3d-carte{
  /* 8 degrés, pas 4,5. Sur une carte de 490 px, 4,5° ne déplaçaient les arêtes
     que de 19 px : l'objet n'avait pas l'air de pencher du tout. Au-delà d'une
     dizaine on trahit la surface plate — 8 est le point où on voit le geste
     sans voir que le rectangle est vide. */
  transform:rotateY(calc(var(--cx) * 8deg)) rotateX(calc(var(--cy) * -5deg));
}
/* Le liseré cyan sur l'arête éclairée. Il s'allume quand on penche la carte
   vers la lumière — sans ça, une carte inclinée reste une image inclinée. */
.pq3d-carte::after{
  content:''; position:absolute; inset:0; border-radius:26px; pointer-events:none;
  box-shadow:inset 0 1px 0 rgba(0,210,255,calc(.34 + var(--cx) * .28));
}

/* ── La lucarne ─────────────────────────────────────────────────────────
   Sa propre perspective : une caisse de 600px de focale percée dans la carte.
   C'est ce qui autorise une parallaxe forte à l'intérieur alors que la carte
   elle-même bouge à peine. */
.pq3d-lucarne{
  position:relative; overflow:hidden;
  border-radius:25px 25px 0 0;
  perspective:600px;
  perspective-origin:50% 50%;
  background:#050b16;
}
/* Le déplacement du point de vue n'est appliqué qu'à la carte de devant. */
.pq3d-place[data-etat="actif"] .pq3d-lucarne{
  perspective-origin:calc(50% + var(--cx) * 22%) calc(50% + var(--cy) * 15%);
}
.pq3d-couche{ position:absolute; inset:0; transform-style:preserve-3d; }

/* Chaque couche est agrandie de ce que la perspective lui retire, plus une
   marge pour que la parallaxe ne découvre jamais le vide sur les bords. */
.pq3d-fond{ transform:translateZ(-170px) scale(1.45); }
.pq3d-fond img{ width:100%; height:100%; object-fit:cover; }
.pq3d-brume{
  transform:translateZ(-95px) scale(1.26);
  background:
    radial-gradient(120% 90% at 22% 8%, rgba(120,190,255,.18) 0%, transparent 58%),
    linear-gradient(to top, #0a1628 4%, rgba(10,22,40,.55) 44%, transparent 88%);
}
.pq3d-grains{ transform:translateZ(-45px) scale(1.14); }
.pq3d-grain{
  position:absolute; border-radius:50%;
  background:rgba(255,255,255,.55);
  box-shadow:0 0 5px rgba(0,210,255,.5);
  animation:pq3d-derive linear infinite;
  animation-play-state:paused;
}
.pq3d-place[data-etat="actif"] .pq3d-grain{ animation-play-state:running; }
@keyframes pq3d-derive{
  0%   { transform:translate3d(0,0,0);        opacity:.15; }
  35%  { transform:translate3d(9px,-13px,0);  opacity:.7;  }
  70%  { transform:translate3d(-6px,-24px,0); opacity:.35; }
  100% { transform:translate3d(0,-38px,0);    opacity:.15; }
}

/* La vitre. Le reflet spéculaire est posé au point de vue, donc il balaie
   quand on bouge : c'est le seul indice qui dit « il y a du verre ici ». */
.pq3d-vitre{
  transform:translateZ(0);
  background:
    linear-gradient(105deg,
      transparent calc(28% + var(--cx) * 22%),
      rgba(255,255,255,.11) calc(41% + var(--cx) * 22%),
      rgba(0,210,255,.07) calc(48% + var(--cx) * 22%),
      transparent calc(62% + var(--cx) * 22%));
  box-shadow:inset 0 0 40px rgba(0,0,0,.45);
}

/* Le numéro flotte devant la vitre, pas dessus. Il grandit de 8 % à cause de
   la perspective, et c'est exactement ce qu'on veut : il est plus près. */
.pq3d-num{
  transform:translateZ(45px);
  display:flex; align-items:flex-start; justify-content:flex-end;
  padding:10px 20px 0 0;
  font-weight:900; font-size:52px; line-height:1;
  font-variant-numeric:tabular-nums;
  color:rgba(255,255,255,.14);
  text-shadow:0 3px 10px rgba(0,0,0,.6), 0 0 26px rgba(0,210,255,.22);
}

/* Le bloc de texte flotte au-dessus de la face de la carte, avec son ombre
   portée dessus. On compense l'agrandissement de la perspective (900/874) :
   sans ça, il déborderait des arêtes de la carte.
   Il reste hors de la caisse profonde volontairement — un paragraphe pris
   dans un empilement 3D est rematricé et perd son piqué. */
.pq3d-texte{
  position:relative;
  transform:translateZ(26px) scale(.971);
  filter:drop-shadow(0 10px 18px rgba(0,0,0,.5));
}

.pq3d-jauge span{
  display:block; height:3px; border-radius:99px;
  background:rgba(255,255,255,.16);
  transition:width .5s ease, background-color .5s ease, box-shadow .5s ease;
}

/* ── Mobile ─────────────────────────────────────────────────────────────
   Pas de pointeur, donc pas de caméra : --cx reste à 0 et tout se fige
   proprement. On rapproche les plans pour que les cartes du fond ne
   deviennent pas des timbres, et on coupe les poussières (neuf éléments
   animés en continu pour un détail qu'on ne voit pas à cette taille). */
@media (hover:none), (max-width:767px){
  .pq3d-scene{ perspective:1100px; }
  /* Même correction qu'en grand : les cartes du fond remontent pour que leur
     sommet dépasse. Les distances en Z sont raccourcies parce qu'à 1100 px de
     focale sur un écran étroit, une carte à -325 devient un timbre. */
  .pq3d-place[data-etat="proche"]{ --prof:-110px; --descente:-34px; }
  .pq3d-place[data-etat="loin"]  { --prof:-225px; --descente:-72px; }
  .pq3d-grain{ display:none; }
  .pq3d-sol{ background-size:56px 56px; }
}

@media (prefers-reduced-motion:reduce){
  .pq3d-scene{ --cx:0 !important; --cy:0 !important; }
  .pq3d-place{ transition-duration:1ms !important; }
  .pq3d-grain{ display:none; }
  .pq3d-place[data-etat="actif"]:hover{ --prof:0px; }
}
`;

export default function PourquoiNousChoisissent() {
  const [actif, setActif] = useState(0);
  const zones = useRef<(HTMLDivElement | null)[]>([]);
  const scene = useRef<HTMLDivElement | null>(null);

  /* Le pas du défilement. Inchangé : trois zones invisibles lues sur la ligne
     du milieu de l'écran, parce qu'aucun événement `scroll` n'est émis sur ce
     site — ni sur window, ni sur html, ni sur body. */
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

  /* La caméra. Elle n'écrit que deux variables CSS sur un seul élément : aucun
     rendu React par trame, et tout le reste de la scène les lit en cascade.
     L'amortissement est exponentiel et tient compte du temps écoulé, sinon la
     salle réagit deux fois plus vite sur un écran 120 Hz que sur un 60 Hz. */
  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let viseX = 0, viseY = 0, x = 0, y = 0, boucle = 0, t0 = 0, vivant = false;

    const suivre = (t: number) => {
      const dt = t0 ? Math.min((t - t0) / 1000, 0.1) : 0.016;
      t0 = t;
      const k = 1 - Math.exp(-6.5 * dt);
      x += (viseX - x) * k;
      y += (viseY - y) * k;
      el.style.setProperty('--cx', x.toFixed(4));
      el.style.setProperty('--cy', y.toFixed(4));
      if (Math.abs(viseX - x) + Math.abs(viseY - y) > 0.0015) {
        boucle = requestAnimationFrame(suivre);
      } else {
        vivant = false; t0 = 0;
      }
    };

    const relancer = () => {
      if (vivant) return;
      vivant = true; t0 = 0;
      boucle = requestAnimationFrame(suivre);
    };

    /* On écoute la fenêtre, pas la section : la salle doit réagir à l'endroit
       où se trouve le visiteur, même quand son curseur est ailleurs. Le test
       de cadre coupe tout dès que la section sort de l'écran. */
    /* Le rectangle est mis en cache. Lu dans le gestionnaire, il forçait un
       recalcul de mise en page à CHAQUE trame : le rAF écrit --cx en fin de
       trame, ce qui invalide la mise en page, et la lecture suivante obligeait
       le navigateur à tout recalculer sur-le-champ — même quand le visiteur
       était dans le hero, puisque c'est justement ce rectangle qui sert à
       détecter que la section est hors cadre. La garde coûtait ce qu'elle
       prétendait éviter. On le relit seulement quand il peut avoir changé. */
    let rect: DOMRect | null = null;
    const oublierRect = () => { rect = null; };

    const bouger = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      const r = rect;
      if (r.bottom < 0 || r.top > innerHeight) return;
      viseX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      viseY = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      relancer();
    };

    const recentrer = () => { viseX = 0; viseY = 0; relancer(); };

    addEventListener('pointermove', bouger, { passive: true });
    addEventListener('blur', recentrer);
    /* La section bouge par rapport à l'écran dès qu'on défile ou qu'on
       redimensionne : c'est le seul moment où le rectangle en cache devient
       faux. `recentrer` remet la salle droite quand le curseur quitte la page,
       sinon la carte reste penchée jusqu'au prochain mouvement. */
    addEventListener('scroll', oublierRect, { passive: true });
    addEventListener('resize', oublierRect);
    document.addEventListener('pointerleave', recentrer);
    return () => {
      removeEventListener('pointermove', bouger);
      removeEventListener('blur', recentrer);
      cancelAnimationFrame(boucle);
    };
  }, []);

  return (
    /* Le dégradé PART et REVIENT à #050a15, la couleur du corps de page.
       Il allait de #060d1f à #0a1628 : deux couleurs qui ne sont celles
       d'aucune section voisine, donc une ligne droite bien nette en haut ET en
       bas de la section. On voyait la couture. Ici les deux bouts se confondent
       avec la page, et le bleu ne monte qu'au milieu — là où personne ne peut
       le comparer à autre chose. La salle s'ouvre et se referme au lieu de
       commencer d'un coup. */
    <section className="relative bg-gradient-to-b from-[#050a15] via-[#0a1628] to-[#050a15]">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

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
        <div className="sticky top-0 z-10 h-screen overflow-hidden flex flex-col items-center justify-center px-5 md:px-6 pt-20 pb-10 sm:pt-0 sm:pb-0">

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

          {/* La clé de lumière : haute, à gauche, chaude sur les bords froids.
              Tout le reste de l'éclairage de la section en découle — le liseré
              de la carte, le reflet de la vitre, le sens de l'ombre au sol. */}
          <div className="absolute z-0 pointer-events-none top-[6%] left-[12%] w-[560px] h-[560px] rounded-full bg-accent-blue/12 blur-[110px]" />
          <div className="absolute z-0 pointer-events-none bottom-[4%] right-[8%] w-[420px] h-[420px] rounded-full bg-[#1b3a6b]/30 blur-[120px]" />

          {/* ── LA SALLE ─────────────────────────────────────────────────
              La perspective de tout ce qui suit vit ici, et les deux variables
              de caméra sont écrites sur cet élément. */}
          <div ref={scene} className="pq3d-scene relative z-10 w-full max-w-lg flex flex-col items-center">

            <div className="pq3d-plafond" aria-hidden="true" />
            <div className="pq3d-sol" aria-hidden="true" />
            <div className="pq3d-horizon" aria-hidden="true" />

            {/* En-tête, compact : il doit partager l'écran avec la carte. */}
            <div className="relative z-10 text-center mb-7 md:mb-9">
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
            {/* La hauteur monte de 420 à 452 px sous `md`. La carte n'a plus
                d'`overflow-hidden` — il rognerait les couches en translateZ et
                tuerait la lucarne —, donc un texte trop long ne serait plus
                coupé mais déborderait sur la jauge. 32 px de marge suffisent
                pour la plus longue des trois cartes à 375 px de large. */}
            {/* La marge du haut réserve la place que les cartes du fond
                occupent AU-DESSUS de la carte de devant. Sans elle, le sommet
                de la carte 03 remontait dans le titre. Elle est plus courte sur
                téléphone parce que l'étagement y est plus court aussi : sinon
                c'est le titre qui passe sous la barre de navigation. */}
            <div className="pq3d-pile h-[424px] md:h-[460px] mt-5 md:mt-14">
              {CARTES.map((c, i) => {
                const ecart = i - actif;
                return (
                  <div
                    key={c.numero}
                    className="pq3d-place"
                    data-etat={etat(ecart)}
                    /* PAS d'`inert` ici. Il réglait bien le focus clavier, mais il
                       retirait aussi les cartes 02 et 03 de l'arbre
                       d'accessibilité — et rien ne pouvait les en sortir, puisque
                       l'étape ne change qu'en faisant défiler des pixels. Un
                       usager de lecteur d'écran perdait deux tiers du contenu de
                       la section. On neutralise donc seulement le focus du lien
                       (voir tabIndex plus bas) : le texte reste lu, et le clavier
                       ne part pas dans une carte invisible. */
                    aria-current={ecart === 0 ? 'true' : undefined}
                  >
                    <div className="pq3d-ombre" aria-hidden="true" />
                    <div className="pq3d-rebond" aria-hidden="true" />

                    <article className="pq3d-carte">

                      {/* ── La caisse derrière la vitre ───────────────── */}
                      <div className="pq3d-lucarne h-[168px] md:h-[190px]">
                        <div className="pq3d-couche pq3d-fond">
                          <img
                            src={c.image}
                            alt={c.alt}
                            loading="lazy"
                            width={900}
                            height={600}
                          />
                        </div>
                        <div className="pq3d-couche pq3d-brume" aria-hidden="true" />
                        <div className="pq3d-couche pq3d-grains" aria-hidden="true">
                          {GRAINS.map((p, k) => (
                            <i
                              key={k}
                              className="pq3d-grain"
                              style={{
                                left: `${p.g}%`,
                                top: `${p.h}%`,
                                width: p.d,
                                height: p.d,
                                animationDuration: `${p.t}s`,
                                animationDelay: `-${p.r}s`,
                              }}
                            />
                          ))}
                        </div>
                        <div className="pq3d-couche pq3d-vitre" aria-hidden="true" />
                        <div className="pq3d-couche pq3d-num" aria-hidden="true">
                          {c.numero}
                        </div>
                      </div>

                      {/* ── Le texte, posé sur la vitre ───────────────── */}
                      <div className="pq3d-texte p-6 md:p-7 -mt-9">
                        <div className="w-11 h-11 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue mb-4 backdrop-blur-md shadow-[0_6px_16px_rgba(0,0,0,.45)]">
                          {c.icone}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">{c.titre}</h3>
                        <p className="text-white/60 text-[13.5px] md:text-sm leading-relaxed mb-5">{c.texte}</p>
                        {/* Le lien d'une carte enfouie sort de l'ordre de
                            tabulation : sans ça, le clavier se perd dans une
                            carte qu'on ne voit pas. Mais il reste dans le
                            document et dans l'arbre d'accessibilité, donc un
                            lecteur d'écran lit bien les trois cartes. C'est la
                            différence avec `inert`, qui les effaçait des deux. */}
                        <Link
                          to={c.lien}
                          tabIndex={ecart === 0 ? undefined : -1}
                          className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue uppercase tracking-widest transition-all hover:gap-3.5"
                        >
                          En savoir plus <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                    </article>
                  </div>
                );
              })}
            </div>

            {/* Où on en est dans les trois. */}
            <div className="pq3d-jauge relative z-10 flex items-center gap-2 mt-7" aria-hidden="true">
              {CARTES.map((c, i) => (
                <span
                  key={c.numero}
                  style={{
                    width: actif === i ? 34 : 12,
                    backgroundColor: actif === i ? '#00d2ff' : undefined,
                    boxShadow: actif === i ? '0 0 14px rgba(0,210,255,0.65)' : undefined,
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
