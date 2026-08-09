/* ATELIER NORD — moteur de mondes
   Un seul canvas fixe derrière tout le site. Le défilement ne fait pas
   descendre une page : il fait traverser une suite de mondes. Chaque section
   a sa couleur de vide, sa brume, ses lumières, ses objets et son mouvement
   de caméra. Le HTML n'est qu'une couche de texte posée par-dessus. */

import * as THREE from './vendor/three.module.js';

/* ── Les mondes ─────────────────────────────────────────────────────────
   Un par section, dans l'ordre du défilement. On interpole en continu entre
   le monde courant et le suivant : la bascule n'est jamais brutale. */
const MONDES = [
  { id:'vide',     fond:0x0D0E0B, brume:0.042, cle:0xFFF0D4, contre:0x7FA8CC, accent:0xD6A968, cam:[0,0,14],    regard:[0,0,-4] },
  { id:'atelier',  fond:0x171308, brume:0.055, cle:0xFFD9A0, contre:0x6B7A55, accent:0xE0B36A, cam:[2.5,1,10],  regard:[0,0,-6] },
  { id:'matieres', fond:0x090B0D, brume:0.030, cle:0xFFFFFF, contre:0x9FC4E8, accent:0xD6A968, cam:[0,0.6,12],  regard:[0,0.4,-2] },
  { id:'cuisine',  fond:0x1C1611, brume:0.038, cle:0xFFE2B8, contre:0xC08A50, accent:0xE8C48A, cam:[-3,0.5,9],  regard:[0,0,-3] },
  { id:'bain',     fond:0x0C1418, brume:0.040, cle:0xDDF0FF, contre:0x5E92B8, accent:0x9FC4E8, cam:[3,-0.5,9],  regard:[0,0,-3] },
  { id:'soussol',  fond:0x140F0C, brume:0.052, cle:0xFFCE8F, contre:0x4A5560, accent:0xD6A968, cam:[-2,1.2,8.5],regard:[0,0,-3] },
  { id:'plan',     fond:0x060A0C, brume:0.026, cle:0xBFE4FF, contre:0x2E6E96, accent:0x6FD2FF, cam:[0,4,11],    regard:[0,-1,-6] },
  // « Les chiffres » : l'air le plus clair du parcours. La brume tombe au
  // minimum et la lumière redevient neutre — on ne cache rien au moment de
  // parler d'argent. Ce monde fait le pont entre le bleu technique du plan
  // et la chaleur du retour.
  { id:'chiffres', fond:0x0A0C0B, brume:0.024, cle:0xE8F0F4, contre:0x5A7E96, accent:0xC9A063, cam:[0,1.6,12],  regard:[0,0,-4] },
  { id:'retour',   fond:0x0D0E0B, brume:0.048, cle:0xFFF0D4, contre:0x7FA8CC, accent:0xD6A968, cam:[0,0,13],    regard:[0,0,-5] },
];

const MATIERES = [
  { fichier:'img/tex-chene.jpg',    nom:'CHÊNE BLANC', detail:'MASSIF · HUILE NATURELLE',   rug:0.72, met:0.0  },
  { fichier:'img/tex-marbre.jpg',   nom:'MARBRE',      detail:'CARRARE · FINI ADOUCI',      rug:0.34, met:0.0  },
  { fichier:'img/tex-laiton.jpg',   nom:'LAITON',      detail:'BROSSÉ · NON VERNI',         rug:0.28, met:0.95 },
  { fichier:'img/tex-terrazzo.jpg', nom:'TERRAZZO',    detail:'ADOUCI · ÉCLATS DE MARBRE',  rug:0.66, met:0.0  },
];

const PROJETS = [
  { fichier:'img/proj-1.jpg', monde:3 },
  { fichier:'img/proj-2.jpg', monde:4 },
  { fichier:'img/proj-3.jpg', monde:5 },
];

export function demarrerMondes(canvas, infobulle) {
  const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rendu = new THREE.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
  rendu.setPixelRatio(Math.min(devicePixelRatio, 2));
  rendu.setSize(innerWidth, innerHeight);
  rendu.toneMapping = THREE.ACESFilmicToneMapping;
  rendu.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0D0E0B, 0.042);
  const camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, 0.1, 160);

  const ambiante = new THREE.AmbientLight(0x3A3D31, 0.32); scene.add(ambiante);
  const cle    = new THREE.DirectionalLight(0xFFF0D4, 3.2); cle.position.set(6,8,5);    scene.add(cle);
  const contre = new THREE.DirectionalLight(0x7FA8CC, 1.6); contre.position.set(-8,-3,-4); scene.add(contre);
  const accent = new THREE.PointLight(0xD6A968, 30, 26, 2); accent.position.set(2,-1,6);  scene.add(accent);

  /* ── Carte d'environnement ───────────────────────────────────────────
     Sans elle, le laiton est une surface jaune plate : un métal n'a l'air
     métallique que s'il a quelque chose à refléter. On fabrique un petit
     studio (sol sombre, plafond lumineux, deux panneaux latéraux), on le
     cuit en carte d'environnement, et on jette la scène. Aucun fichier. */
  const pmrem = new THREE.PMREMGenerator(rendu);
  const studio = new THREE.Scene();
  const panneau = (couleur, intensite, x, y, z, sx, sy) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(sx, sy),
      new THREE.MeshBasicMaterial({ color: couleur, side: THREE.DoubleSide }),
    );
    m.material.color.multiplyScalar(intensite);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    studio.add(m);
  };
  studio.background = new THREE.Color(0x0A0B08);
  panneau(0xFFF2DC, 3.2,  0,  9,  0, 26, 26);  // plafond chaud
  panneau(0x24303A, 0.6,  0, -9,  0, 26, 26);  // sol froid
  panneau(0xFFE2B0, 1.5, -11, 1,  4, 14, 18);  // panneau latéral chaud
  panneau(0x7FA8CC, 0.9,  11, 0, -4, 14, 18);  // panneau latéral froid
  const envMap = pmrem.fromScene(studio, 0.04).texture;
  scene.environment = envMap;
  studio.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
  pmrem.dispose();

  const chargeur = new THREE.TextureLoader();
  const survolables = [];

  /** Charge une image en texture prête à l'affichage. */
  function image(fichier){
    const tex = chargeur.load(fichier);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = rendu.capabilities.getMaxAnisotropy();
    return tex;
  }

  /* ── Monde 0-1 : la grande image de fond ────────────────────────────
     Une photographie occupe le fond du héros, pas un vide noir. Elle est
     assombrie à la source (color < 1) pour que le titre reste lisible
     par-dessus : on ne pose pas du texte sur une image en pleine lumière.
     Elle vit dans la scène 3D, donc elle bouge en parallaxe avec la souris
     et recule au défilement — une image de fond CSS resterait plate. */
  const fondPhoto = new THREE.Mesh(
    new THREE.PlaneGeometry(38, 21.4, 24, 14),
    // fog:false — à 28 unités de la caméra, la brume exponentielle mangerait
    // les trois quarts de l'image. Un fond doit rester lisible ; c'est son
    // assombrissement volontaire qui l'intègre à la scène, pas la brume.
    new THREE.MeshBasicMaterial({ map:image('img/hero.jpg'), transparent:true, opacity:0, fog:false }),
  );
  // L'image est déjà exposée bas et son côté gauche est dans l'ombre : elle
  // a été faite pour porter le titre. Un assombrissement léger suffit, là où
  // une photo d'intérieur ordinaire aurait dû être écrasée.
  fondPhoto.material.color.setScalar(0.62);
  fondPhoto.position.set(0, 0, -14);
  scene.add(fondPhoto);

  /* ── Monde 2 : les matières, en panneaux photographiques ─────────────
     Les blocs texturés flottants ont été retirés : une texture plaquée sur
     un cube ne se lit pas comme de la matière, elle se lit comme un objet
     de démonstration. Ici chaque matière est un grand tirage, présenté
     comme dans une galerie — c'est la photographie qui vend la matière. */
  const grBlocs = new THREE.Group(); scene.add(grBlocs);
  // Rangée régulière : même écart, même hauteur. L'alignement fait la
  // composition ; c'est l'éparpillement qui faisait bricolé.
  // Écarts calculés pour que les quatre tirages tiennent dans le cadre à la
  // distance de caméra du monde « matières » : au-delà de ±6,5 les panneaux
  // extérieurs sortent de l'écran en 16:9.
  // Rangée resserrée et reculée : à 4,3 × 6,1 unités les tirages remplissaient
  // tout l'écran et écrasaient le texte. Un tirage doit être un élément de
  // composition, pas un fond.
  const RANG = [[-5.0,0.2,-3.6],[-1.75,0.2,-3.2],[1.75,0.2,-3.2],[5.0,0.2,-3.6]];
  // À l'arrivée, les panneaux montent d'en bas en éventail.
  const DEPART = [[-6.0,-6,-7],[-2.1,-7.5,-6],[2.1,-7.5,-6],[6.0,-6,-7]];

  MATIERES.forEach((m,i) => {
    const maille = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 4.5, 16, 22),
      new THREE.MeshBasicMaterial({ map:image(m.fichier), transparent:true, opacity:0 }),
    );
    maille.material.color.setScalar(0.55);
    maille.position.set(...DEPART[i]);
    // Léger éventail : les panneaux extérieurs se tournent vers le centre.
    maille.userData = {
      libre:new THREE.Vector3(...DEPART[i]), rang:new THREE.Vector3(...RANG[i]),
      biais:(i-1.5)*0.13, dep:i*1.7, info:m, survol:0,
      base:null,
    };
    maille.userData.base = maille.geometry.attributes.position.array.slice();
    grBlocs.add(maille); survolables.push(maille);
  });

  /* ── Mondes 3-5 : les grandes images de réalisation ────────────────── */
  const plans = PROJETS.map((p) => {
    const maille = new THREE.Mesh(
      new THREE.PlaneGeometry(11.5, 8, 40, 28),
      new THREE.MeshBasicMaterial({ map:image(p.fichier), transparent:true, opacity:0 }),
    );
    // Même règle que pour le héros : une photo affichée à pleine luminosité
    // écrase la carte de texte posée devant et rend les légendes voisines
    // illisibles. Elle doit rester un décor, pas le sujet.
    maille.material.color.setScalar(0.34);
    maille.position.set(0, 0, -6);
    maille.userData = { monde:p.monde, base:maille.geometry.attributes.position.array.slice() };
    maille.visible = false;
    scene.add(maille);
    return maille;
  });

  /* ── Poussière ──────────────────────────────────────────────────────
     Elle donne l'échelle et empêche le vide d'être mort, mais elle doit
     rester à la limite du perceptible. Deux fois moins dense et deux fois
     plus discrète qu'avant : elle se remarquait, donc elle encombrait.
     (La grille technique a été retirée : GridHelper est un outil de
     débogage de Three.js, pas un élément de décor.) */
  const N = 450, pos = new Float32Array(N*3);
  for (let i=0;i<N;i++){ pos[i*3]=(Math.random()-.5)*70; pos[i*3+1]=(Math.random()-.5)*44; pos[i*3+2]=(Math.random()-.5)*70; }
  const geoP = new THREE.BufferGeometry();
  geoP.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const poussiere = new THREE.Points(geoP, new THREE.PointsMaterial({
    size:0.026, color:0xD6A968, transparent:true, opacity:0.2, sizeAttenuation:true, depthWrite:false,
  }));
  scene.add(poussiere);

  /* ── Défilement : on mesure les sections pour savoir où on est ─────── */
  let bornes = [];
  function mesurer(){
    bornes = [...document.querySelectorAll('[data-monde]')].map((s)=>{
      const r = s.getBoundingClientRect();
      return { haut:r.top+scrollY, bas:r.bottom+scrollY, i:+s.dataset.monde };
    });
  }
  // Les polices et les images déplacent la mise en page : on remesure après
  // coup, sinon les frontières de mondes sont fausses tout le reste du temps.
  mesurer();
  addEventListener('load', () => { mesurer(); setTimeout(mesurer, 600); });
  if (document.fonts?.ready) document.fonts.ready.then(mesurer);

  // Renvoie l'index fractionnaire du monde : 2.4 = 40 % du chemin entre le
  // monde 2 et le 3. C'est ce nombre qui pilote absolument tout.
  function positionMonde(){
    const y = scrollY + innerHeight*0.5;
    for (let k=0;k<bornes.length;k++){
      const b = bornes[k];
      if (y >= b.haut && y < b.bas){
        const t = (y-b.haut)/Math.max(b.bas-b.haut,1);
        const suiv = bornes[k+1] ? bornes[k+1].i : b.i;
        // La bascule ne commence qu'au dernier tiers : on habite le monde
        // avant d'en changer, sinon tout est en transition permanente.
        return b.i + (suiv-b.i) * Math.max(0,(t-0.66)/0.34);
      }
    }
    return y < (bornes[0]?.haut ?? 0) ? 0 : MONDES.length-1;
  }

  /* ── Souris ────────────────────────────────────────────────────────── */
  const souris = new THREE.Vector2(-2,-2), visee = {x:0,y:0};
  const rayon = new THREE.Raycaster(); let survole = null;
  addEventListener('pointermove', (e)=>{
    souris.x = (e.clientX/innerWidth)*2-1; souris.y = -(e.clientY/innerHeight)*2+1;
    visee.x = souris.x; visee.y = souris.y;
    if (infobulle){ infobulle.style.left=e.clientX+'px'; infobulle.style.top=e.clientY+'px'; }
  }, {passive:true});

  addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix();
    rendu.setSize(innerWidth, innerHeight); mesurer();
  });

  /* ── Boucle ────────────────────────────────────────────────────────── */
  const horloge = new THREE.Clock();
  const cFond=new THREE.Color(), cCle=new THREE.Color(), cContre=new THREE.Color(), cAcc=new THREE.Color();
  const camViseeP = new THREE.Vector3(), camViseeR = new THREE.Vector3();
  // Objets de travail réutilisés à chaque trame : sans eux, chaque .lerp()
  // allouerait une couleur ou un vecteur neuf soixante fois par seconde.
  const cCible = new THREE.Color(), vCible = new THREE.Vector3();
  let m = 0, t = 0;

  /* Amortissement indépendant du taux de rafraîchissement.
     Un facteur fixe appliqué par trame fait réagir la scène deux fois plus
     vite sur un écran 120 Hz que sur un 60 Hz. Cette forme exponentielle
     donne le même mouvement à toutes les fréquences, et reste identique au
     réglage d'origine à 60 images par seconde. */
  const amorti = (k, dt) => 1 - Math.pow(1 - k, dt * 60);

  function boucle(){
    requestAnimationFrame(boucle);
    // Borne haute : au retour d'un onglet resté inactif, le delta peut valoir
    // plusieurs secondes et propulserait la scène d'un bout à l'autre.
    const dt = Math.min(horloge.getDelta(), 0.1);
    t += dt;

    // Amortissement : le monde suit le défilement sans jamais saccader.
    m += (positionMonde() - m) * amorti(0.055, dt);
    const i = Math.min(Math.floor(m), MONDES.length-2);
    const f = THREE.MathUtils.clamp(m-i, 0, 1);
    const a = MONDES[i], b = MONDES[i+1];
    const e = f*f*(3-2*f); // lissage aux extrémités

    cFond.setHex(a.fond).lerp(cCible.setHex(b.fond), e);
    rendu.setClearColor(cFond, 1);
    scene.fog.color.copy(cFond);
    scene.fog.density = THREE.MathUtils.lerp(a.brume, b.brume, e);
    cCle.setHex(a.cle).lerp(cCible.setHex(b.cle), e);          cle.color.copy(cCle);
    cContre.setHex(a.contre).lerp(cCible.setHex(b.contre), e); contre.color.copy(cContre);
    cAcc.setHex(a.accent).lerp(cCible.setHex(b.accent), e);    accent.color.copy(cAcc);
    poussiere.material.color.copy(cAcc);

    camViseeP.fromArray(a.cam).lerp(vCible.fromArray(b.cam), e);
    camViseeR.fromArray(a.regard).lerp(vCible.fromArray(b.regard), e);
    const kCam = amorti(0.045, dt);
    camera.position.x += (camViseeP.x + visee.x*1.6 - camera.position.x)*kCam;
    camera.position.y += (camViseeP.y + visee.y*1.0 - camera.position.y)*kCam;
    camera.position.z += (camViseeP.z - camera.position.z)*kCam;
    camera.lookAt(camViseeR);

    // Les blocs : dispersés dans le vide, rassemblés en rang au monde 2,
    // puis ils s'écartent et s'effacent quand les réalisations arrivent.
    /* L'image de fond du héros : présente sur les deux premiers mondes,
       elle recule et s'efface quand on entre dans le site. */
    const vFond = THREE.MathUtils.clamp(1 - Math.max(0, m-0.6)/1.1, 0, 1);
    fondPhoto.visible = vFond > 0.01;
    if (fondPhoto.visible){
      fondPhoto.material.opacity = vFond;
      // Parallaxe : le fond bouge moins que la caméra, donc il paraît loin.
      fondPhoto.position.x = visee.x * -0.9;
      fondPhoto.position.y = visee.y * -0.6;
      fondPhoto.position.z = -14 - (1-vFond)*10;
      fondPhoto.scale.setScalar(1 + (1-vFond)*0.12);
    }

    /* Les panneaux de matière : ils montent en éventail, se rangent, puis
       s'effacent quand les réalisations arrivent. */
    // Fenêtre resserrée sur le seul monde « matières ». Elle commençait à
    // m=0,9 : les tirages montaient pendant le manifeste et se superposaient
    // à son texte. Un objet ne doit exister que dans son monde.
    const versRang = THREE.MathUtils.clamp((m-1.6)/0.5, 0, 1);
    const eRang = versRang*versRang*(3-2*versRang);
    const presence = THREE.MathUtils.clamp(1-Math.max(0, m-2.45)/0.4, 0, 1);
    grBlocs.visible = presence > 0.01 && eRang > 0.001;
    if (grBlocs.visible) grBlocs.children.forEach((bl, i)=>{
      const u = bl.userData;
      bl.position.set(
        THREE.MathUtils.lerp(u.libre.x, u.rang.x, eRang),
        THREE.MathUtils.lerp(u.libre.y, u.rang.y, eRang) + Math.sin(t*0.5+u.dep)*0.13,
        THREE.MathUtils.lerp(u.libre.z, u.rang.z, eRang) - u.survol*1.4,
      );
      const vise = bl===survole ? 1 : 0;
      u.survol += (vise-u.survol)*amorti(0.12, dt);
      // Les panneaux font face au visiteur, avec un éventail léger et une
      // réaction douce à la souris. Aucune rotation libre : un tirage
      // accroché ne tourne pas sur lui-même.
      bl.rotation.y = u.biais*(1-u.survol*0.6) + visee.x*0.10;
      bl.rotation.x = -visee.y*0.06 + (1-eRang)*0.5;
      bl.scale.setScalar(presence * (0.92 + eRang*0.08 + u.survol*0.06));
      bl.material.opacity = presence * eRang;
      bl.material.color.setScalar(0.55 + u.survol*0.35);

      // Le tirage respire très légèrement : il vit sans se tordre.
      if (!doux){
        const at = bl.geometry.attributes.position, base = u.base;
        for (let k=0;k<at.count;k++){
          const x = base[k*3], y = base[k*3+1];
          at.setZ(k, Math.sin(x*0.5 + t*0.6 + u.dep)*0.07 + Math.cos(y*0.45 + t*0.45)*0.05);
        }
        at.needsUpdate = true;
      }
    });

    // Les grandes images : elles n'existent que dans leur monde, arrivent de
    // loin et ondulent légèrement sous la souris.
    plans.forEach((pl)=>{
      // Fenêtre serrée : une image n'existe que dans SON monde, sinon elle
      // déborde sur le monde d'avant et tout se mélange.
      // Fenêtre resserrée à 0,35 : à 0,5 l'image d'une réalisation était déjà
      // visible pendant le monde des matières et noyait ses légendes.
      const d = Math.abs(m - pl.userData.monde);
      const vis = THREE.MathUtils.clamp(1 - d/0.35, 0, 1);
      pl.visible = vis > 0.01;
      if (!pl.visible) return;
      pl.material.opacity = vis;
      pl.position.z = -6 + (1-vis)*7;
      pl.position.x = (m - pl.userData.monde) * 5.5;
      pl.rotation.y = visee.x*0.16 + (m-pl.userData.monde)*0.28;
      pl.rotation.x = -visee.y*0.10;
      pl.scale.setScalar(0.9 + vis*0.14);
      // Ondulation du maillage : l'image respire au lieu d'être un carton.
      if (!doux){
        const at = pl.geometry.attributes.position, base = pl.userData.base;
        for (let k=0;k<at.count;k++){
          const x = base[k*3], y = base[k*3+1];
          at.setZ(k, Math.sin(x*0.42 + t*0.65)*0.16 + Math.cos(y*0.5 + t*0.5)*0.12);
        }
        at.needsUpdate = true;
      }
    });

    /* Règle de composition : on ne pose jamais du complexe sur du complexe.
       Les mondes qui portent beaucoup de texte (manifeste, processus,
       chiffres, contact) font taire le décor ; ceux qui montrent quelque
       chose le laissent respirer. C'est cette alternance qui fait la
       direction artistique — pas la quantité d'objets. */
    const CALME = [0.35, 0.9, 0.15, 0.3, 0.3, 0.3, 0.9, 0.95, 0.8];
    const iC = Math.min(Math.floor(m), CALME.length-2);
    const calme = THREE.MathUtils.lerp(CALME[iC], CALME[iC+1], THREE.MathUtils.clamp(m-iC,0,1));

    poussiere.rotation.y = t*0.012;
    poussiere.material.opacity = 0.22 * (1-calme);
    poussiere.visible = poussiere.material.opacity > 0.01;

    // Survol : seulement quand les blocs sont vraiment là.
    if (!doux && presence > 0.5){
      rayon.setFromCamera(souris, camera);
      const touche = rayon.intersectObjects(grBlocs.children, false);
      const nouv = touche.length ? touche[0].object : null;
      if (nouv !== survole){
        survole = nouv;
        if (infobulle){
          if (survole){
            infobulle.innerHTML = '<b>'+survole.userData.info.nom+'</b>'+survole.userData.info.detail;
            infobulle.classList.add('on'); canvas.style.cursor='none';
          } else { infobulle.classList.remove('on'); canvas.style.cursor=''; }
        }
      }
    } else if (survole){ survole=null; infobulle?.classList.remove('on'); canvas.style.cursor=''; }

    rendu.render(scene, camera);
  }
  boucle();
}

