/* ATELIER NORD — scène 3D
   Des blocs de matière flottent dans le noir. Ils tournent, réagissent à la
   souris, et le défilement fait avancer la caméra à travers eux : c'est le
   passage d'un « univers » à l'autre.
   Les textures viennent de Higgsfield ; la géométrie et la lumière sont ici. */

import * as THREE from './vendor/three.module.js';

const MATIERES = [
  { fichier: 'img/tex-chene.jpg',     nom: 'CHÊNE BLANC', detail: 'MASSIF · HUILE NATURELLE', rugosite: 0.72, metal: 0.0 },
  { fichier: 'img/tex-marbre.jpg',    nom: 'MARBRE',      detail: 'CARRARE · FINI ADOUCI',    rugosite: 0.38, metal: 0.0 },
  { fichier: 'img/tex-laiton.jpg',    nom: 'LAITON',      detail: 'BROSSÉ · NON VERNI',       rugosite: 0.31, metal: 0.92 },
  { fichier: 'img/tex-terrazzo.jpg',  nom: 'TERRAZZO',    detail: 'ADOUCI · ÉCLATS DE MARBRE', rugosite: 0.68, metal: 0.0 },
];

export function demarrerScene(canvas, infobulle) {
  const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0d0e0b, 0.055);

  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 120);
  camera.position.set(0, 0, 14);

  // Éclairage : une dominante chaude côté laiton, une froide en contre, et un
  // point d'accent qui fait briller les arêtes. C'est ça qui donne le « cher ».
  // Ambiante très basse : dans le noir, ce sont les lumières directionnelles
  // qui sculptent les arêtes. Trop d'ambiante et les blocs deviennent plats.
  scene.add(new THREE.AmbientLight(0x3a3d31, 0.30));
  const cle = new THREE.DirectionalLight(0xfff0d4, 3.4);
  cle.position.set(6, 8, 5);
  scene.add(cle);
  const contre = new THREE.DirectionalLight(0x7fa8cc, 1.5);
  contre.position.set(-8, -3, -4);
  scene.add(contre);
  const rasant = new THREE.SpotLight(0xd6a968, 90, 30, 0.72, 0.55, 1.6);
  rasant.position.set(-6, 5, 9);
  scene.add(rasant);
  const accent = new THREE.PointLight(0xffd9a0, 26, 22, 2);
  accent.position.set(2, -1, 6);
  scene.add(accent);

  const chargeur = new THREE.TextureLoader();
  const groupe = new THREE.Group();
  scene.add(groupe);

  const blocs = [];
  // Positions réparties en profondeur : la caméra les traversera au défilement.
  // Écartés du centre pour laisser le titre respirer, et étagés en profondeur
  // pour que la plongée au défilement les traverse un à un.
  const PLACES = [
    { p: [-5.6, 2.4, 1.5],   e: 1.35, forme: 'boite' },
    { p: [5.4, 1.0, -1.5],   e: 1.55, forme: 'dalle' },
    { p: [-4.8, -3.0, -6],   e: 1.20, forme: 'dalle' },
    { p: [4.6, -2.4, -10],   e: 1.45, forme: 'boite' },
  ];

  MATIERES.forEach((m, i) => {
    const place = PLACES[i];
    const geo = place.forme === 'dalle'
      ? new THREE.BoxGeometry(2.6, 0.42, 2.0, 24, 6, 20)
      : new THREE.BoxGeometry(1.7, 1.7, 1.7, 20, 20, 20);
    adoucirAretes(geo, 0.14);

    const tex = chargeur.load(m.fichier);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: m.rugosite,
      metalness: m.metal,
      envMapIntensity: 1.1,
    });

    const maille = new THREE.Mesh(geo, mat);
    maille.position.set(...place.p);
    maille.scale.setScalar(place.e);
    maille.rotation.set(Math.random() * 0.6 - 0.3, Math.random() * Math.PI, Math.random() * 0.4 - 0.2);
    maille.userData = {
      base: maille.position.clone(),
      echelle: place.e,
      vitesse: 0.06 + i * 0.022,
      dephase: i * 1.9,
      info: m,
      survol: 0,
    };
    groupe.add(maille);
    blocs.push(maille);
  });

  // ── Interaction souris ───────────────────────────────────────────────────
  const souris = new THREE.Vector2(-2, -2);
  const cible = { x: 0, y: 0 };
  const rayon = new THREE.Raycaster();
  let survole = null;

  addEventListener('pointermove', (e) => {
    souris.x = (e.clientX / innerWidth) * 2 - 1;
    souris.y = -(e.clientY / innerHeight) * 2 + 1;
    cible.x = souris.x;
    cible.y = souris.y;
    if (infobulle) { infobulle.style.left = e.clientX + 'px'; infobulle.style.top = e.clientY + 'px'; }
  }, { passive: true });

  // ── Défilement : la caméra avance dans la scène ──────────────────────────
  let avance = 0, avanceCible = 0;
  addEventListener('scroll', () => {
    const h = document.querySelector('.hero');
    const max = h ? h.offsetHeight : innerHeight;
    avanceCible = Math.min(scrollY / max, 1.6);
  }, { passive: true });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // ── Boucle ───────────────────────────────────────────────────────────────
  const horloge = new THREE.Clock();
  let actif = true;
  const io = new IntersectionObserver((es) => { actif = es[0].isIntersecting; }, { threshold: 0 });
  io.observe(canvas);

  function boucle() {
    requestAnimationFrame(boucle);
    if (!actif) return;

    const t = horloge.getElapsedTime();
    avance += (avanceCible - avance) * 0.06;

    // Parallaxe douce de la caméra + plongée au défilement.
    camera.position.x += (cible.x * 1.5 - camera.position.x) * 0.035;
    camera.position.y += (cible.y * 0.9 - camera.position.y) * 0.035;
    camera.position.z = 14 - avance * 11;
    camera.lookAt(0, 0, -4);

    // Détection de survol.
    if (!doux) {
      rayon.setFromCamera(souris, camera);
      const touches = rayon.intersectObjects(blocs, false);
      const nouveau = touches.length ? touches[0].object : null;
      if (nouveau !== survole) {
        survole = nouveau;
        if (infobulle) {
          if (survole) {
            infobulle.innerHTML = '<b>' + survole.userData.info.nom + '</b>' + survole.userData.info.detail;
            infobulle.classList.add('on');
            canvas.style.cursor = 'none';
          } else {
            infobulle.classList.remove('on');
            canvas.style.cursor = '';
          }
        }
      }
    }

    blocs.forEach((b) => {
      const u = b.userData;
      // Flottement continu.
      b.position.y = u.base.y + Math.sin(t * 0.55 + u.dephase) * 0.34;
      b.position.x = u.base.x + Math.cos(t * 0.37 + u.dephase) * 0.16;
      if (!doux) {
        b.rotation.y += u.vitesse * 0.016;
        b.rotation.x = Math.sin(t * 0.28 + u.dephase) * 0.14;
      }
      // Le bloc survolé grossit et se redresse vers la caméra.
      const vise = b === survole ? 1 : 0;
      u.survol += (vise - u.survol) * 0.12;
      b.scale.setScalar(u.echelle * (1 + u.survol * 0.22));
      b.material.envMapIntensity = 1.1 + u.survol * 1.4;
    });

    renderer.render(scene, camera);
  }
  boucle();

  return { blocs, scene };
}

/* Trois.js n'a pas de boîte à arêtes arrondies. On déplace les sommets vers le
   centre proportionnellement à leur distance des arêtes : ça suffit pour
   attraper la lumière comme un vrai bloc taillé. */
function adoucirAretes(geo, rayon) {
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const params = geo.parameters;
  const demi = new THREE.Vector3(params.width / 2, params.height / 2, params.depth / 2);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const interieur = new THREE.Vector3(
      Math.max(-demi.x + rayon, Math.min(demi.x - rayon, v.x)),
      Math.max(-demi.y + rayon, Math.min(demi.y - rayon, v.y)),
      Math.max(-demi.z + rayon, Math.min(demi.z - rayon, v.z)),
    );
    const dir = v.clone().sub(interieur);
    if (dir.length() > 0) v.copy(interieur).add(dir.normalize().multiplyScalar(rayon));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
}
