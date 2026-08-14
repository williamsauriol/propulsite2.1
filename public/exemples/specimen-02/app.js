/* ==========================================================================
   SPÉCIMEN 02
   Le défilement fait avancer la marche dans la maison. Le ciel bouge tout
   seul. Tout est en repli : si le JavaScript échoue, la page reste lisible
   et complète.
   ========================================================================== */

const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Amortissement indépendant de la fréquence d'images. Un simple
   « x += (cible - x) * 0.1 » va deux fois plus vite sur un écran 120 Hz que
   sur un 60 Hz : le même geste n'a pas la même inertie selon la machine. */
const approche = (actuel, cible, taux, dt) =>
  actuel + (cible - actuel) * (1 - Math.pow(1 - taux, dt * 60));

/* --- Rideau d'ouverture -------------------------------------------------- */
(() => {
  const rideau = document.getElementById('rideau');
  if (!rideau) return;
  if (doux) { rideau.remove(); return; }
  requestAnimationFrame(() => rideau.classList.add('charge'));
  const lever = () => rideau.classList.add('parti');
  addEventListener('load', () => setTimeout(lever, 1400));
  setTimeout(lever, 3600);            // filet : on ne bloque jamais la page
})();

/* --- Titres découpés mot par mot ----------------------------------------- */
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

/* --- Apparitions au défilement ------------------------------------------- */
(() => {
  const cibles = [
    ...document.querySelectorAll('[data-mots]'),
    ...document.querySelectorAll('.texte,.liste,.grille,.etapes,.joindre,.bouton'),
  ];
  cibles.forEach((el) => {
    if (!el.hasAttribute('data-mots')) el.setAttribute('data-monte', '');
  });

  if (doux || !('IntersectionObserver' in window)) {
    cibles.forEach((el) => el.classList.add('vu'));
    return;
  }
  const obs = new IntersectionObserver((entrees) => {
    for (const e of entrees) {
      if (e.isIntersecting) { e.target.classList.add('vu'); obs.unobserve(e.target); }
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  cibles.forEach((el) => obs.observe(el));
})();

/* --- Jauge de progression ------------------------------------------------ */
(() => {
  const barre = document.getElementById('jauge-barre');
  const nom = document.getElementById('jauge-nom');
  if (!barre || !nom) return;
  const sections = [...document.querySelectorAll('[data-piece]')];

  const majuscule = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - innerHeight;
    barre.style.width = `${total > 0 ? Math.min(100, (scrollY / total) * 100) : 0}%`;

    const milieu = scrollY + innerHeight * 0.5;
    let courante = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= milieu) courante = s;
    }
    const p = courante?.dataset.piece;
    if (p && nom.textContent !== p) nom.textContent = p;
  };
  addEventListener('scroll', majuscule, { passive: true });
  addEventListener('resize', majuscule);
  majuscule();
})();

/* --- La marche : le défilement pilote la lecture vidéo -------------------- */
/* Chaque section « marche » est haute de plusieurs écrans. La vidéo est
   collée en haut ; la fraction parcourue de la section devient la position
   de lecture. On avance donc dans la maison au rythme du doigt. */
(() => {
  const videos = [...document.querySelectorAll('[data-video]')];
  if (!videos.length) return;

  // Repli : sans défilement animé, on laisse simplement la vidéo jouer.
  if (doux) {
    videos.forEach((v) => { v.loop = true; v.play().catch(() => {}); });
    return;
  }

  const etats = videos.map((v) => ({
    video: v,
    section: v.closest('.marche'),
    cible: 0,
    actuel: 0,
    prete: false,
  }));

  /* Position de lecture correspondant au défilement actuel. On la calcule
     aussi hors de la boucle : si celle-ci démarre en retard — onglet en
     arrière-plan, animation suspendue — la vidéo doit déjà montrer la bonne
     image, pas la dernière du clip. */
  const fraction = (e) => {
    if (!e.section) return 0;
    const parcours = e.section.offsetHeight - innerHeight;
    if (parcours <= 0) return 0;
    return Math.max(0, Math.min(1, (scrollY - e.section.offsetTop) / parcours));
  };

  /* On ne lance JAMAIS la lecture. Avec preload="auto", le fichier est
     entièrement en mémoire et se déplace directement — un amorçage par
     play() puis pause() paraît anodin, mais la promesse de play() peut
     tarder à se résoudre : la vidéo joue alors toute seule pendant plusieurs
     secondes avant d'être arrêtée, et le visiteur arrive au milieu du clip. */
  const caler = (e) => {
    if (!e.prete) return;
    const duree = e.video.duration;
    if (!Number.isFinite(duree) || duree <= 0) return;
    e.actuel = e.cible = fraction(e);
    e.video.currentTime = e.actuel * (duree - 0.05);
  };

  etats.forEach((e) => {
    e.video.pause();
    if (e.video.readyState >= 1) { e.prete = true; caler(e); }
    e.video.addEventListener('loadedmetadata', () => { e.prete = true; caler(e); }, { once: true });
  });

  let dernier = performance.now();
  const trame = (maintenant) => {
    const dt = Math.min((maintenant - dernier) / 1000, 0.1);
    dernier = maintenant;

    for (const e of etats) {
      if (!e.prete || !e.section) continue;
      e.cible = fraction(e);

      // Hors champ : inutile de décoder quoi que ce soit. La marge d'un écran
      // laisse le temps de préparer la bonne image avant l'entrée — sans elle,
      // la section pile en bas de fenêtre était exclue et on entrait sur une
      // vidéo restée à sa position précédente.
      const haut = e.section.offsetTop;
      const bas = haut + e.section.offsetHeight;
      if (scrollY + innerHeight * 2 < haut || scrollY - innerHeight > bas) continue;

      e.actuel = approche(e.actuel, e.cible, 0.12, dt);
      const duree = e.video.duration;
      if (Number.isFinite(duree) && duree > 0) {
        const pos = e.actuel * (duree - 0.05);
        // On ne redemande une position que si l'écart se voit : sinon on
        // sature le décodeur de requêtes pour rien.
        if (Math.abs(e.video.currentTime - pos) > 0.02) e.video.currentTime = pos;
      }
    }
    requestAnimationFrame(trame);
  };
  requestAnimationFrame(trame);
})();

/* --- Le ciel vivant ------------------------------------------------------ */
/* Des nuages dessinés en dégradés radiaux, sur trois plans qui dérivent à des
   vitesses différentes. C'est cette différence de vitesse qui donne la
   profondeur — un seul plan ferait papier peint. */
(() => {
  const canvas = document.getElementById('ciel');
  if (!canvas || doux) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let l = 0, h = 0, dpr = 1;
  const nuages = [];

  const semer = () => {
    nuages.length = 0;
    // Trois plans : le plus lointain est petit, pâle et lent.
    const plans = [
      { n: 5, taille: 0.16, vitesse: 5,  alpha: 0.10, y: [0.04, 0.22] },
      { n: 4, taille: 0.26, vitesse: 9,  alpha: 0.14, y: [0.06, 0.30] },
      { n: 3, taille: 0.40, vitesse: 15, alpha: 0.17, y: [0.02, 0.26] },
    ];
    for (const p of plans) {
      for (let i = 0; i < p.n; i++) {
        nuages.push({
          x: Math.random() * 1.4 - 0.2,
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
    // Plafonner la densité : au-delà de 2, on paie cher pour rien.
    dpr = Math.min(devicePixelRatio || 1, 2);
    l = r.width; h = r.height;
    canvas.width = Math.round(l * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    semer();
  };

  const dessinerNuage = (n) => {
    const cx = n.x * l, cy = n.y * h, base = n.r * Math.min(l, h);
    for (let i = 0; i < n.bosses; i++) {
      const dx = Math.cos(n.graine + i * 2.1) * base * 0.55;
      const dy = Math.sin(n.graine + i * 1.7) * base * 0.16;
      const r = base * (0.42 + 0.2 * Math.sin(n.graine + i));
      const g = ctx.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, r);
      g.addColorStop(0, `rgba(255,252,244,${n.a})`);
      g.addColorStop(0.55, `rgba(255,250,238,${n.a * 0.42})`);
      g.addColorStop(1, 'rgba(255,250,238,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  let dernier = performance.now(), actif = true;
  const trame = (maintenant) => {
    const dt = Math.min((maintenant - dernier) / 1000, 0.1);
    dernier = maintenant;
    if (actif) {
      ctx.clearRect(0, 0, l, h);
      for (const n of nuages) {
        n.x += (n.v / 10000) * dt * 60 * 0.06;
        if (n.x - n.r > 1.25) n.x = -0.3 - Math.random() * 0.2;
        dessinerNuage(n);
      }
    }
    requestAnimationFrame(trame);
  };

  // On ne peint pas un ciel que personne ne regarde.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([e]) => { actif = e.isIntersecting; },
      { threshold: 0 },
    ).observe(canvas);
  }

  mesurer();
  addEventListener('resize', mesurer);
  requestAnimationFrame(trame);
})();

/* --- Dérive lente de l'accueil ------------------------------------------- */
/* Une image parfaitement immobile derrière un texte trahit le montage. Un
   déplacement très lent, sous le seuil de perception, suffit à donner vie. */
(() => {
  const fond = document.querySelector('.scene-accueil .scene-fond');
  if (!fond || doux) return;
  let visee = { x: 0, y: 0 }, pos = { x: 0, y: 0 }, dernier = performance.now();

  addEventListener('pointermove', (e) => {
    visee.x = (e.clientX / innerWidth) * 2 - 1;
    visee.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  const trame = (maintenant) => {
    const dt = Math.min((maintenant - dernier) / 1000, 0.1);
    dernier = maintenant;
    pos.x = approche(pos.x, visee.x, 0.05, dt);
    pos.y = approche(pos.y, visee.y, 0.05, dt);
    const t = maintenant / 1000;
    const echelle = 1.06 + Math.sin(t * 0.06) * 0.012;
    // Amplitude faible : le mouvement doit suggérer la profondeur, pas donner
    // le vertige.
    fond.style.transform =
      `scale(${echelle}) translate(${pos.x * -0.9}%, ${pos.y * -0.7}%)`;
    requestAnimationFrame(trame);
  };
  requestAnimationFrame(trame);
})();
