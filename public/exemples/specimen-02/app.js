/* ==========================================================================
   SPÉCIMEN 02 — la maison qu'on traverse, en caméra subjective
   UNE seule vidéo derrière tout le site : la traversée du manoir rendue
   image par image (tools/traversee.py, tools/rendre_traversee.py). On ne la
   regarde pas, on la parcourt : le défilement la fait avancer, ou la tient
   en arrêt pendant qu'on lit. Elle ne redémarre jamais.

   Une seule boucle d'animation pilote tout ce qui dépend du défilement :
   l'image de la vidéo, les trois voiles, les couches en parallaxe, le fil
   et le plan. Une seule lecture de scrollY par trame, aucune mesure de
   mise en page dans la boucle.
   ========================================================================== */

const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Amortissement indépendant de la fréquence d'images : sans ça, le même
   geste n'a pas la même inertie sur un écran 60 Hz et sur un 120 Hz. */
const approche = (actuel, cible, taux, dt) =>
  actuel + (cible - actuel) * (1 - Math.pow(1 - taux, dt * 60));

/* --- Choix de la source vidéo -------------------------------------------- */
/* Deux encodages de la même traversée (1920 et 1280 de large). On choisit
   avant le chargement : un <source media> n'est pas fiable sur <video>. */
const video = document.getElementById('traversee');
if (video) {
  const petit = innerWidth < 900 || (navigator.connection?.saveData === true);
  video.src = petit ? video.dataset.mobile : video.dataset.bureau;
  video.load();
}

/* --- Rideau -------------------------------------------------------------- */
(() => {
  const rideau = document.getElementById('rideau');
  if (!rideau) return;
  if (doux) { rideau.remove(); return; }
  requestAnimationFrame(() => rideau.classList.add('charge'));
  const lever = () => rideau.classList.add('parti');
  // On attend que la vidéo puisse jouer, sans jamais bloquer la page.
  video?.addEventListener('loadeddata', () => setTimeout(lever, 700), { once: true });
  addEventListener('load', () => setTimeout(lever, 1800));
  setTimeout(lever, 4000);
})();

/* --- Titres mot par mot -------------------------------------------------- */
/* Les <em> sont conservés : c'est eux qui passent en serif italique. */
(() => {
  for (const el of document.querySelectorAll('[data-mots]')) {
    let i = 0;
    const marcher = (noeud) => {
      for (const enfant of [...noeud.childNodes]) {
        if (enfant.nodeType === Node.ELEMENT_NODE) { marcher(enfant); continue; }
        if (enfant.nodeType !== Node.TEXT_NODE) continue;
        const frag = document.createDocumentFragment();
        for (const morceau of enfant.textContent.split(/(\s+)/)) {
          if (!morceau) continue;
          if (/^\s+$/.test(morceau)) { frag.append(' '); continue; }
          const span = document.createElement('span');
          span.className = 'mot';
          const inner = document.createElement('i');
          inner.textContent = morceau;
          inner.style.transitionDelay = `${i++ * 55}ms`;
          span.append(inner);
          frag.append(span);
        }
        enfant.replaceWith(frag);
      }
    };
    marcher(el);
  }
})();

/* --- Apparitions --------------------------------------------------------- */
(() => {
  const cibles = [
    ...document.querySelectorAll('[data-mots]'),
    ...document.querySelectorAll('.sur,.chapo,.texte,.liste,.grille,.etapes,.joindre,.fine,.fiche,.etiquette'),
  ];
  cibles.forEach((el) => { if (!el.hasAttribute('data-mots')) el.setAttribute('data-monte', ''); });

  if (doux || !('IntersectionObserver' in window)) {
    cibles.forEach((el) => el.classList.add('vu'));
    return;
  }
  const obs = new IntersectionObserver((entrees) => {
    for (const e of entrees) {
      if (e.isIntersecting) { e.target.classList.add('vu'); obs.unobserve(e.target); }
    }
  }, { threshold: 0.06, rootMargin: '0px 0px -12% 0px' });
  cibles.forEach((el) => obs.observe(el));
})();

/* --- Le plan : où est la caméra à chaque instant ------------------------- */
/* Les stations de tools/traversee.py : (œil x, y), (regard x, y), et
   l'instant où la caméra y passe. La vidéo avance à vitesse constante le
   long de la courbe, donc l'instant est proportionnel à la distance
   parcourue ; les arrêts mesurés (hall, salon, cuisine) sont posés exacts. */
const STATIONS = [
  [0.6, -34.5, 0.0, -7.0, 0.00],
  [-5.5, -31.0, 0.0, -7.5, 3.75],
  [-9.4, -25.0, -1.0, -8.5, 7.56],
  [-7.6, -17.0, 0.0, -8.0, 11.92],
  [-2.2, -12.8, 0.0, -7.2, 15.57],
  [0.0, -10.6, 0.0, -5.0, 17.22],
  [0.0, -8.6, 0.3, -1.0, 18.29],
  [0.0, -6.6, 0.8, 0.0, 19.36],
  [0.1, -4.9, 1.6, 0.6, 20.15],
  [-0.9, -3.3, -6.0, -1.5, 21.27],
  [-3.6, -4.6, -8.5, -0.5, 22.86],
  [-7.5, -5.2, -6.6, 1.8, 24.88],
  [-9.6, -2.6, -4.8, 0.6, 26.74],
  [-9.2, 2.6, -3.0, 4.6, 29.52],
  [-5.2, 4.6, 2.0, 3.6, 31.90],
  [-1.0, 4.3, 7.7, 3.3, 34.15],
  [3.0, 3.7, 9.0, 4.6, 36.30],
  [5.3, 1.5, 8.6, 5.4, 37.96],
  [6.0, -1.0, 7.7, -3.4, 39.38],
  [5.0, -1.6, 8.8, -3.6, 40.00],
];

const positionA = (t) => {
  let i = 0;
  while (i < STATIONS.length - 2 && t >= STATIONS[i + 1][4]) i++;
  const a = STATIONS[i], b = STATIONS[i + 1];
  const f = Math.max(0, Math.min(1, (t - a[4]) / Math.max(1e-6, b[4] - a[4])));
  const l = (u, v) => u + (v - u) * f;
  return { i, f, x: l(a[0], b[0]), y: l(a[1], b[1]), rx: l(a[2], b[2]), ry: l(a[3], b[3]) };
};

/* --- La carte du parcours ------------------------------------------------ */
/* Chaque section porte soit data-avance="début,fin" (la vidéo progresse),
   soit data-halte="t" (la vidéo est tenue sur cette image pendant qu'on
   lit). Les sections se suivent sans trou : la position de lecture est donc
   continue, sans saut aux frontières. */
(() => {
  if (!video) return;

  const voiles = {
    bas: document.getElementById('voile-bas'),
    gauche: document.getElementById('voile-gauche'),
    droite: document.getElementById('voile-droite'),
  };
  const filBarre = document.getElementById('fil-barre');
  const filArrets = [...document.querySelectorAll('#fil-arrets a')];
  const planVous = document.getElementById('plan-vous');
  const planTrace = document.getElementById('plan-trace');
  const planPiece = document.getElementById('plan-piece');
  const planTemps = document.getElementById('plan-temps');

  const sections = [...document.querySelectorAll('[data-avance],[data-halte]')];
  let segments = [];
  let couches = [];

  const mesurer = () => {
    let arret = -1;
    segments = sections.map((s, i) => {
      const suivante = sections[i + 1];
      const debut = s.offsetTop;
      const fin = suivante
        ? suivante.offsetTop
        : Math.max(debut + 1, document.documentElement.scrollHeight - innerHeight);
      const halte = 'halte' in s.dataset;
      if (halte) arret++;
      // Une section peut imposer sa propre densité de voile et son côté.
      const voileVoulu = s.dataset.voile ? Number(s.dataset.voile) : null;
      const cote = s.dataset.cote || null;
      if (!halte) {
        const [t0, t1] = s.dataset.avance.split(',').map(Number);
        return { debut, fin, t0, t1, halte, voileVoulu, cote, piece: s.dataset.piece, arret };
      }
      const t = Number(s.dataset.halte);
      return { debut, fin, t0: t, t1: t, halte, voileVoulu, cote, piece: s.dataset.piece, arret };
    });

    // Les couches en parallaxe : on retient le centre de leur section, une
    // fois, et on ne mesure plus rien dans la boucle.
    couches = [...document.querySelectorAll('[data-parallaxe]')].map((el) => {
      const section = el.closest('section');
      return {
        el,
        facteur: Number(el.dataset.parallaxe) || 0,
        centre: section.offsetTop + section.offsetHeight / 2,
      };
    });
  };

  /* Mesurer avant le chargement des polices donne des frontières fausses
     pour toute la session : la mise en page bouge ensuite. */
  mesurer();
  document.fonts?.ready.then(mesurer);
  addEventListener('load', () => setTimeout(mesurer, 400));
  addEventListener('resize', mesurer);

  /* À une halte, si un voile de côté protège le texte, celui du bas peut
     rester léger : la pièce garde sa lumière de l'autre côté. */
  const voileDe = (s) => s.voileVoulu ?? (s.halte ? (s.cote ? 0.42 : 0.78) : 0.30);

  const lire = () => {
    const y = scrollY;
    if (!segments.length) return { t: 0, voile: 0.4, cote: null, piece: '', arret: 0 };
    for (const s of segments) {
      if (y < s.fin) {
        const f = Math.max(0, Math.min(1, (y - s.debut) / Math.max(1, s.fin - s.debut)));
        // Adoucissement aux extrémités : l'arrivée dans une pièce ralentit
        // au lieu de s'arrêter net.
        const e = s.halte ? f : f * f * (3 - 2 * f);
        return { t: s.t0 + (s.t1 - s.t0) * e, voile: voileDe(s), cote: s.cote, piece: s.piece, arret: s.arret };
      }
    }
    const d = segments[segments.length - 1];
    return { t: d.t1, voile: voileDe(d), cote: d.cote, piece: d.piece, arret: d.arret };
  };

  /* On ne lance JAMAIS la lecture. Avec preload="auto" le fichier est en
     mémoire et se déplace directement. Un amorçage par play() puis pause()
     paraît anodin, mais la promesse de play() peut tarder : la vidéo joue
     alors plusieurs secondes et le visiteur arrive au milieu du plan. */
  let prete = false;
  const caler = () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    prete = true;
    actuel = lire().t;
    video.currentTime = Math.min(actuel, video.duration - 0.05);
  };
  video.pause();
  if (video.readyState >= 1) caler();
  video.addEventListener('loadedmetadata', caler, { once: true });

  let actuel = 0, dernier = performance.now();
  const opacites = { bas: 0.35, gauche: 0, droite: 0 };
  let arretActif = -1, pieceAffichee = '';

  const trame = (maintenant) => {
    const dt = Math.min((maintenant - dernier) / 1000, 0.1);
    dernier = maintenant;
    const y = scrollY;
    const vh = innerHeight;
    const { t, voile: voileCible, cote, piece, arret } = lire();

    if (prete) {
      // Assez souple pour absorber une molette brusque, assez ferme pour que
      // l'image suive le doigt sans traîner.
      actuel = approche(actuel, t, 0.14, dt);
      const pos = Math.max(0, Math.min(actuel, video.duration - 0.05));
      if (Math.abs(video.currentTime - pos) > 0.02) video.currentTime = pos;
    }

    // Les voiles : celui du bas s'épaissit quand on lit, s'efface quand on
    // avance ; celui du côté du texte ne monte qu'aux haltes.
    const cibles = {
      bas: voileCible,
      gauche: cote === 'gauche' ? 0.94 : 0,
      droite: cote === 'droite' ? 0.94 : 0,
    };
    for (const k in voiles) {
      if (!voiles[k]) continue;
      opacites[k] = approche(opacites[k], cibles[k], 0.08, dt);
      voiles[k].style.opacity = opacites[k].toFixed(3);
    }

    // Le parallaxe : chaque couche se décale selon sa distance au centre de
    // l'écran, à sa propre vitesse. Négatif = en retrait, positif = devant.
    if (!doux) {
      const centreEcran = y + vh / 2;
      const borne = vh * 1.5;
      for (const c of couches) {
        const d = Math.max(-borne, Math.min(borne, centreEcran - c.centre));
        c.el.style.transform = `translate3d(0,${(-d * c.facteur).toFixed(1)}px,0)`;
      }
    }

    // Le fil : le trait se remplit, l'arrêt courant s'allume.
    const total = document.documentElement.scrollHeight - vh;
    if (filBarre) filBarre.style.height = `${total > 0 ? Math.min(100, (y / total) * 100) : 0}%`;
    if (arret !== arretActif) {
      arretActif = arret;
      filArrets.forEach((a, i) => a.classList.toggle('actif', i === arret));
    }

    // Le plan : le point suit la caméra, le cône montre où elle regarde,
    // le trait laiton retrace le chemin parcouru.
    if (planVous) {
      const p = positionA(actuel);
      const angle = Math.atan2(-(p.ry - p.y), p.rx - p.x) * 180 / Math.PI;
      planVous.setAttribute('transform', `translate(${p.x.toFixed(2)} ${(-p.y).toFixed(2)}) rotate(${angle.toFixed(1)})`);
      if (planTrace) {
        let pts = '';
        for (let i = 0; i <= p.i; i++) pts += `${STATIONS[i][0]},${-STATIONS[i][1]} `;
        planTrace.setAttribute('points', pts + `${p.x.toFixed(2)},${(-p.y).toFixed(2)}`);
      }
      if (planTemps) planTemps.textContent = `${actuel.toFixed(1).replace('.', ',')} s`;
    }
    if (planPiece && piece && piece !== pieceAffichee) { pieceAffichee = piece; planPiece.textContent = piece; }

    requestAnimationFrame(trame);
  };
  requestAnimationFrame(trame);
})();
