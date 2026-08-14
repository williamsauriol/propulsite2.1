/* ==========================================================================
   SPÉCIMEN 02
   Une seule vidéo derrière tout le site. Le défilement la fait avancer, ou
   la tient en arrêt pendant qu'on lit. Elle ne redémarre jamais et n'est
   jamais remplacée par une autre.
   ========================================================================== */

const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Amortissement indépendant de la fréquence d'images : sans ça, le même
   geste n'a pas la même inertie sur un écran 60 Hz et sur un 120 Hz. */
const approche = (actuel, cible, taux, dt) =>
  actuel + (cible - actuel) * (1 - Math.pow(1 - taux, dt * 60));

/* --- Choix de la source vidéo -------------------------------------------- */
/* Le fichier de bureau pèse 10,9 Mo, celui du mobile 3,3 Mo. On choisit
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
(() => {
  for (const el of document.querySelectorAll('[data-mots]')) {
    const mots = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    mots.forEach((mot, i) => {
      const span = document.createElement('span');
      span.className = 'mot';
      const inner = document.createElement('i');
      inner.textContent = mot;
      inner.style.transitionDelay = `${i * 55}ms`;
      span.append(inner);
      el.append(span, document.createTextNode(' '));
    });
  }
})();

/* --- Apparitions --------------------------------------------------------- */
(() => {
  const cibles = [
    ...document.querySelectorAll('[data-mots]'),
    ...document.querySelectorAll('.texte,.liste,.grille,.etapes,.joindre,.fine,.chapo'),
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
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  cibles.forEach((el) => obs.observe(el));
})();

/* --- La carte du parcours ------------------------------------------------ */
/* Chaque section porte soit data-avance="début,fin" (la vidéo progresse),
   soit data-halte="t" (la vidéo est tenue sur cette image pendant qu'on
   lit). Les sections se suivent sans trou : la position de lecture est donc
   continue, sans saut aux frontières. */
(() => {
  if (!video) return;

  const barre = document.getElementById('jauge-barre');
  const nomPiece = document.getElementById('jauge-nom');
  const voile = document.getElementById('voile');
  const ciel = document.getElementById('ciel');

  const sections = [...document.querySelectorAll('[data-avance],[data-halte]')];
  let segments = [];

  const mesurer = () => {
    segments = sections.map((s, i) => {
      const suivante = sections[i + 1];
      const debut = s.offsetTop;
      const fin = suivante
        ? suivante.offsetTop
        : Math.max(debut + 1, document.documentElement.scrollHeight - innerHeight);
      // Une section peut imposer sa propre densité de voile.
      const voileVoulu = s.dataset.voile ? Number(s.dataset.voile) : null;
      if (s.dataset.avance) {
        const [t0, t1] = s.dataset.avance.split(',').map(Number);
        return { debut, fin, t0, t1, halte: false, voileVoulu, piece: s.dataset.piece };
      }
      const t = Number(s.dataset.halte);
      return { debut, fin, t0: t, t1: t, halte: true, voileVoulu, piece: s.dataset.piece };
    });
  };

  /* Mesurer avant le chargement des polices donne des frontières fausses
     pour toute la session : la mise en page bouge ensuite. */
  mesurer();
  document.fonts?.ready.then(mesurer);
  addEventListener('load', () => setTimeout(mesurer, 400));
  addEventListener('resize', mesurer);

  const voileDe = (s) => s.voileVoulu ?? (s.halte ? 0.82 : 0.30);

  const lire = () => {
    const y = scrollY;
    if (!segments.length) return { t: 0, voile: 0.4, piece: '' };
    for (const s of segments) {
      if (y < s.fin) {
        const f = Math.max(0, Math.min(1, (y - s.debut) / Math.max(1, s.fin - s.debut)));
        // Adoucissement aux extrémités : l'arrivée dans une pièce ralentit
        // au lieu de s'arrêter net.
        const e = s.halte ? f : f * f * (3 - 2 * f);
        return { t: s.t0 + (s.t1 - s.t0) * e, voile: voileDe(s), piece: s.piece };
      }
    }
    const d = segments[segments.length - 1];
    return { t: d.t1, voile: voileDe(d), piece: d.piece };
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

  let actuel = 0, dernier = performance.now(), opaciteVoile = 0.35;

  const trame = (maintenant) => {
    const dt = Math.min((maintenant - dernier) / 1000, 0.1);
    dernier = maintenant;
    const { t, voile: voileCible, piece } = lire();

    if (prete) {
      // Assez souple pour absorber une molette brusque, assez ferme pour que
      // l'image suive le doigt sans traîner.
      actuel = approche(actuel, t, 0.14, dt);
      const pos = Math.max(0, Math.min(actuel, video.duration - 0.05));
      if (Math.abs(video.currentTime - pos) > 0.02) video.currentTime = pos;
    }

    // Le voile s'épaissit quand on lit, s'efface quand on avance. C'est ce
    // qui rend le texte lisible sans ternir l'image pendant la marche.
    if (voile) {
      opaciteVoile = approche(opaciteVoile, voileCible, 0.08, dt);
      voile.style.opacity = opaciteVoile.toFixed(3);
    }

    // Le ciel dessiné ne sert que sur la couverture.
    if (ciel) {
      const f = Math.max(0, Math.min(1, 1 - scrollY / (innerHeight * 0.85)));
      ciel.style.opacity = f.toFixed(3);
    }

    if (barre) {
      const total = document.documentElement.scrollHeight - innerHeight;
      barre.style.width = `${total > 0 ? Math.min(100, (scrollY / total) * 100) : 0}%`;
    }
    if (nomPiece && piece && nomPiece.textContent !== piece) nomPiece.textContent = piece;

    requestAnimationFrame(trame);
  };
  requestAnimationFrame(trame);
})();

/* --- Le ciel de la couverture -------------------------------------------- */
/* Trois plans de nuages qui dérivent à des vitesses différentes. C'est cette
   différence qui donne la profondeur — un seul plan ferait papier peint. */
(() => {
  const canvas = document.getElementById('ciel');
  if (!canvas || doux) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let l = 0, h = 0, actif = true;
  const nuages = [];

  const semer = () => {
    nuages.length = 0;
    const plans = [
      { n: 6, taille: 0.14, vitesse: 0.0022, alpha: 0.13, y: [0.06, 0.42] },
      { n: 4, taille: 0.24, vitesse: 0.0038, alpha: 0.17, y: [0.04, 0.34] },
      { n: 3, taille: 0.38, vitesse: 0.0062, alpha: 0.20, y: [0.02, 0.28] },
    ];
    for (const p of plans) {
      for (let i = 0; i < p.n; i++) {
        nuages.push({
          x: Math.random() * 1.5 - 0.25,
          y: p.y[0] + Math.random() * (p.y[1] - p.y[0]),
          r: p.taille * (0.7 + Math.random() * 0.6),
          v: p.vitesse * (0.85 + Math.random() * 0.3),
          a: p.alpha * (0.8 + Math.random() * 0.4),
          bosses: 3 + Math.floor(Math.random() * 3),
          graine: Math.random() * 100,
        });
      }
    }
  };

  const mesurer = () => {
    const r = canvas.getBoundingClientRect();
    // Densité plafonnée à 2 : au-delà, on paie cher sans rien gagner.
    const dpr = Math.min(devicePixelRatio || 1, 2);
    l = r.width; h = r.height;
    canvas.width = Math.round(l * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    semer();
  };

  const dessiner = (n) => {
    const cx = n.x * l, cy = n.y * h, base = n.r * Math.min(l, h);
    for (let i = 0; i < n.bosses; i++) {
      const dx = Math.cos(n.graine + i * 2.1) * base * 0.55;
      const dy = Math.sin(n.graine + i * 1.7) * base * 0.16;
      const r = base * (0.42 + 0.2 * Math.sin(n.graine + i));
      const g = ctx.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, r);
      g.addColorStop(0, `rgba(255,253,247,${n.a})`);
      g.addColorStop(0.55, `rgba(255,251,242,${n.a * 0.4})`);
      g.addColorStop(1, 'rgba(255,251,242,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  let dernier = performance.now();
  const trame = (maintenant) => {
    const dt = Math.min((maintenant - dernier) / 1000, 0.1);
    dernier = maintenant;
    if (actif && canvas.style.opacity !== '0.000') {
      ctx.clearRect(0, 0, l, h);
      for (const n of nuages) {
        n.x += n.v * dt;
        if (n.x - n.r > 1.3) n.x = -0.35 - Math.random() * 0.2;
        dessiner(n);
      }
    }
    requestAnimationFrame(trame);
  };

  // On ne peint pas un ciel que personne ne regarde.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { actif = e.isIntersecting; }, { threshold: 0 })
      .observe(canvas);
  }

  mesurer();
  addEventListener('resize', mesurer);
  requestAnimationFrame(trame);
})();
