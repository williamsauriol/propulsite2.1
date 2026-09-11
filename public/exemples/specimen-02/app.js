/* ==========================================================================
   SPÉCIMEN 02 — la maison qu'on traverse
   Neuf plans d'UNE MÊME maison (rendus Blender), chacun avec sa carte de
   profondeur. Le défilement change de pièce ; la souris — ou une dérive
   lente, jamais la même d'une visite à l'autre — déplace le regard dans la
   pièce : le premier plan glisse plus que le fond. Aucune vidéo rejouée.
   ========================================================================== */

const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Amortissement indépendant de la fréquence d'images. */
const approche = (actuel, cible, taux, dt) =>
  actuel + (cible - actuel) * (1 - Math.pow(1 - taux, dt * 60));
const borne = (v, a, b) => Math.max(a, Math.min(b, v));
const lisse = (f) => f * f * (3 - 2 * f);

/* --- Rideau -------------------------------------------------------------- */
const rideau = document.getElementById('rideau');
const lever = () => rideau?.classList.add('parti');
if (rideau) {
  if (doux) rideau.remove();
  else {
    requestAnimationFrame(() => rideau.classList.add('charge'));
    setTimeout(lever, 4500);       // jamais bloquer la page, quoi qu'il arrive
  }
}

/* --- Titres mot par mot -------------------------------------------------- */
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

/* --- Les plans : WebGL, deux textures par plan ---------------------------- */
const canvas = document.getElementById('plans');
const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });

/* Sans WebGL (très rare), on montre l'image de la couverture, fixe. */
if (canvas && !gl) {
  canvas.remove();
  document.querySelector('.fond')?.style.setProperty('background', 'url(plans/entree.jpg) center/cover');
}

const VERT = `
attribute vec2 p; varying vec2 v;
void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

/* Le décalage dépend de la profondeur : (0,5 − prof) est positif devant,
   négatif au fond. On zoome un peu pour que les bords déplacés ne montrent
   jamais le vide. La profondeur est relue au point déplacé, ce qui évite
   les halos autour des premiers plans. */
const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D iA, dA, iB, dB;
uniform vec2 cadre;          /* ajustement « cover » : fraction visible en x et y */
uniform vec2 offA, offB;     /* déplacement du regard, en fraction d'image */
uniform float zoomA, zoomB, melange, force;
vec3 plan(sampler2D img, sampler2D prof, vec2 off, float zoom){
  vec2 uv = 0.5 + (v - 0.5) * cadre / zoom;
  float d = texture2D(prof, uv).r;
  vec2 uv2 = uv + off * (0.5 - d) * force;
  float d2 = texture2D(prof, uv2).r;
  vec2 uv3 = uv + off * (0.5 - d2) * force;
  return texture2D(img, uv3).rgb;
}
void main(){
  vec3 a = plan(iA, dA, offA, zoomA);
  vec3 b = melange > 0.001 ? plan(iB, dB, offB, zoomB) : a;
  gl_FragColor = vec4(mix(a, b, melange), 1.0);
}`;

let prog = null, unif = {};
const textures = new Map();   // nom → { img, prof, prete }

const compiler = (type, src) => {
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
};

const texture = (image) => {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
};

const charger = (src) => new Promise((ok, non) => {
  const im = new Image();
  im.decoding = 'async';
  im.onload = () => ok(im);
  im.onerror = non;
  im.src = src;
});

/* Un plan = image + profondeur. On les charge dans l'ordre du parcours ;
   le premier lève le rideau, les autres arrivent pendant qu'on lit. */
const preparer = async (nom) => {
  if (textures.has(nom)) return textures.get(nom);
  const entree = { img: null, prof: null, prete: false };
  textures.set(nom, entree);
  try {
    const [im, pr] = await Promise.all([charger(`plans/${nom}.jpg`), charger(`plans/${nom}-prof.png`)]);
    entree.img = texture(im); entree.prof = texture(pr); entree.prete = true;
  } catch (e) {
    console.warn('plan manquant', nom, e);
  }
  return entree;
};

if (gl) {
  prog = gl.createProgram();
  gl.attachShader(prog, compiler(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compiler(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const p = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(p);
  gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
  for (const n of ['iA', 'dA', 'iB', 'dB', 'cadre', 'offA', 'offB', 'zoomA', 'zoomB', 'melange', 'force']) {
    unif[n] = gl.getUniformLocation(prog, n);
  }
  gl.uniform1i(unif.iA, 0); gl.uniform1i(unif.dA, 1); gl.uniform1i(unif.iB, 2); gl.uniform1i(unif.dB, 3);
}

/* --- La carte du parcours ------------------------------------------------ */
/* Chaque section porte data-plan="nom" (on est dans la pièce) ou
   data-plan="a>b" (on marche de a vers b : fondu + légère avancée). */
const sections = [...document.querySelectorAll('[data-plan]')];
let segments = [];
const mesurer = () => {
  segments = sections.map((s, i) => {
    const suivante = sections[i + 1];
    const debut = s.offsetTop;
    const fin = suivante ? suivante.offsetTop : Math.max(debut + 1, document.documentElement.scrollHeight - innerHeight);
    const [a, b] = s.dataset.plan.split('>');
    return {
      debut, fin, a, b: b || null, piece: s.dataset.piece || '',
      voile: s.dataset.voile ? Number(s.dataset.voile) : (b ? 0.18 : 0.62),
    };
  });
};
mesurer();
document.fonts?.ready.then(mesurer);
addEventListener('load', () => setTimeout(mesurer, 400));
addEventListener('resize', mesurer);

const lire = () => {
  const y = scrollY;
  for (const s of segments) {
    if (y < s.fin) {
      const f = borne((y - s.debut) / Math.max(1, s.fin - s.debut), 0, 1);
      // En marchant : on avance d'abord dans la pièce qu'on quitte (zoom), le
      // fondu n'occupe que le milieu du trajet, puis on finit d'arriver.
      const fondu = s.b ? lisse(borne((f - 0.28) / 0.44, 0, 1)) : 0;
      return { a: s.a, b: s.b || s.a, mix: fondu, piece: s.piece, voile: s.voile, f };
    }
  }
  const d = segments[segments.length - 1] || { a: 'entree', piece: '', voile: 0.6 };
  return { a: d.b || d.a, b: d.b || d.a, mix: 0, piece: d.piece, voile: d.voile, f: 1 };
};

/* --- Le regard : souris, gyroscope, ou dérive propre à cette visite ------- */
const regard = { x: 0, y: 0 };          // cible, entre −1 et 1
const graine = Math.random() * 1000;    // deux visites, deux mouvements
let souris = false;
addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return;
  souris = true;
  regard.x = (e.clientX / innerWidth) * 2 - 1;
  regard.y = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });
addEventListener('pointerleave', () => { souris = false; });
if ('DeviceOrientationEvent' in window && matchMedia('(pointer: coarse)').matches) {
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    souris = true;
    regard.x = borne(e.gamma / 25, -1, 1);
    regard.y = borne((e.beta - 50) / 25, -1, 1);
  }, { passive: true });
}

/* --- La boucle ----------------------------------------------------------- */
const voile = document.getElementById('voile');
const barre = document.getElementById('jauge-barre');
const nomPiece = document.getElementById('jauge-nom');
let dernier = performance.now();
let ox = 0, oy = 0, opaciteVoile = 0.4, mixAffiche = 0, tempsDerive = graine;

const cadrer = () => {
  const dpr = Math.min(devicePixelRatio || 1, 1.5);   // au-delà, on paie sans rien voir
  const w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
  const ecran = w / h, image = 16 / 9;
  // « cover » : on ne montre que la fraction de l'image qui remplit l'écran
  gl.uniform2f(unif.cadre, ecran > image ? 1 : ecran / image, ecran > image ? image / ecran : 1);
};

const dessiner = (a, b, mix, f) => {
  const A = textures.get(a), B = textures.get(b);
  if (!A?.prete) return false;
  const bb = B?.prete ? B : A;
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, A.img);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, A.prof);
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, bb.img);
  gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, bb.prof);
  gl.uniform2f(unif.offA, ox, oy);
  gl.uniform2f(unif.offB, ox, oy);
  // En marchant : on avance dans le plan qu'on quitte, on arrive de loin dans le suivant
  gl.uniform1f(unif.zoomA, 1.06 + 0.10 * lisse(borne(f / 0.6, 0, 1)));
  gl.uniform1f(unif.zoomB, 1.16 - 0.10 * lisse(borne((f - 0.4) / 0.6, 0, 1)));
  gl.uniform1f(unif.melange, B?.prete ? mix : 0);
  gl.uniform1f(unif.force, doux ? 0 : 0.035);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return true;
};

const trame = (maintenant) => {
  const dt = Math.min((maintenant - dernier) / 1000, 0.1);
  dernier = maintenant;
  const etat = lire();

  // Sans souris, le regard dérive lentement — jamais la même courbe
  if (!souris && !doux) {
    tempsDerive += dt;
    regard.x = Math.sin(tempsDerive * 0.23) * 0.6 + Math.sin(tempsDerive * 0.071 + 1.7) * 0.4;
    regard.y = Math.sin(tempsDerive * 0.17 + 0.9) * 0.35;
  }
  ox = approche(ox, regard.x, 0.05, dt);
  oy = approche(oy, -regard.y, 0.05, dt);

  if (gl && prog) {
    cadrer();
    dessiner(etat.a, etat.b, etat.mix, etat.f);
    // On prépare le plan suivant pendant qu'on est dans celui-ci
    const i = segments.findIndex((s) => scrollY < s.fin);
    for (const s of segments.slice(Math.max(0, i), i + 3)) { preparer(s.a); if (s.b) preparer(s.b); }
  }

  if (voile) {
    opaciteVoile = approche(opaciteVoile, etat.voile, 0.08, dt);
    voile.style.opacity = opaciteVoile.toFixed(3);
  }
  if (barre) {
    const total = document.documentElement.scrollHeight - innerHeight;
    barre.style.width = `${total > 0 ? Math.min(100, (scrollY / total) * 100) : 0}%`;
  }
  if (nomPiece && etat.piece && nomPiece.textContent !== etat.piece) nomPiece.textContent = etat.piece;
  requestAnimationFrame(trame);
};

if (gl && prog) {
  preparer('entree').then(() => { cadrer(); dessiner('entree', 'entree', 0, 0); setTimeout(lever, 500); });
  preparer('hall');
} else {
  setTimeout(lever, 800);
}
requestAnimationFrame(trame);
