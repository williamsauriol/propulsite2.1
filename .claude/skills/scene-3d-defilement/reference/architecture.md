# Architecture détaillée — scène 3D à mondes fractionnels

## Contenu

- Fichiers et rôles
- Le tableau MONDES
- Mesure des frontières
- Calcul de l'index fractionnaire
- Boucle de rendu et interpolation
- Carte d'environnement (réflexions)
- Objets par monde
- Interaction souris
- Repli et accessibilité

## Fichiers et rôles

```
public/exemples/<nom>/
  index.html              sections avec data-monde / data-nom, canvas #scene
  style.css               #scene en position:fixed, inset:0, z-index:-1
  app.js                  rideau, titre mot-par-mot, jauge, IntersectionObserver
  scene3d.js              exporte demarrerMondes(canvas, infobulle)
  vendor/three.module.js  copie locale de Three.js — jamais de CDN
  img/                    textures compressées
```

Le canvas et l'infobulle sont au niveau racine du `<body>`, **hors** de
`<main>` — sinon ils héritent du contexte d'empilement des sections et
passent devant ou derrière au mauvais moment.

## Le tableau MONDES

Un objet par section, dans l'ordre du HTML.

```js
const MONDES = [
  { id:'vide',     fond:0x0D0E0B, brume:0.042, cle:0xFFF0D4, contre:0x7FA8CC,
    accent:0xD6A968, cam:[0,0,14],     regard:[0,0,-4] },
  { id:'atelier',  fond:0x171308, brume:0.055, cle:0xFFD9A0, contre:0x6B7A55,
    accent:0xE0B36A, cam:[2.5,1,10],   regard:[0,0,-6] },
  // ...
];
```

Champs :

| Champ | Rôle |
|---|---|
| `fond` | couleur de fond de scène ET de la brume |
| `brume` | densité de `FogExp2` — plus haut = plus enveloppant, plus intime |
| `cle` | lumière principale, donne la température de l'univers |
| `contre` | contre-jour, sépare les objets du fond |
| `accent` | lumière ponctuelle colorée, crée le point d'intérêt |
| `cam` | position de la caméra `[x,y,z]` |
| `regard` | cible du regard `[x,y,z]` |

Faire varier `cam` et `regard` d'un monde à l'autre est ce qui crée la
sensation de déplacement. Deux mondes qui partagent la même caméra se
ressemblent, même avec des couleurs différentes.

## Mesure des frontières

```js
let bornes = [];
function mesurer() {
  bornes = [...document.querySelectorAll('[data-monde]')].map((el) => {
    const r = el.getBoundingClientRect();
    const haut = r.top + scrollY;
    return { haut, bas: haut + r.height };
  });
}
```

Appeler `mesurer()` au démarrage, après `document.fonts.ready`, après `load`
avec un délai, et sur `resize`. C'est la source de bug la plus coûteuse de
cette architecture.

## Calcul de l'index fractionnaire

```js
function positionMonde() {
  const y = scrollY + innerHeight * 0.5;      // milieu de l'écran
  for (let i = 0; i < bornes.length; i++) {
    const b = bornes[i];
    if (y >= b.haut && y < b.bas) {
      const t = (y - b.haut) / (b.bas - b.haut);   // 0→1 dans la section
      return i + Math.max(0, (t - 0.66) / 0.34);   // transition dernier tiers
    }
  }
  return y < bornes[0].haut ? 0 : bornes.length - 1;
}
```

## Boucle de rendu et interpolation

```js
let m = 0;                       // index fractionnaire lissé
function trame() {
  m += (positionMonde() - m) * 0.055;          // lissage temporel

  const i = Math.min(Math.floor(m), MONDES.length - 2);
  const f0 = m - i;
  const f = f0 * f0 * (3 - 2 * f0);            // smoothstep
  const A = MONDES[i], B = MONDES[i + 1];

  fondA.set(A.fond).lerp(fondB.set(B.fond), f);
  scene.background = fondA;
  scene.fog.color = fondA;
  scene.fog.density = A.brume + (B.brume - A.brume) * f;

  lumCle.color.set(A.cle).lerp(tmp.set(B.cle), f);
  // ...idem contre et accent

  camera.position.set(
    A.cam[0] + (B.cam[0] - A.cam[0]) * f,
    A.cam[1] + (B.cam[1] - A.cam[1]) * f,
    A.cam[2] + (B.cam[2] - A.cam[2]) * f,
  );
  camera.lookAt(/* regard interpolé de la même façon */);

  renderer.render(scene, camera);
  requestAnimationFrame(trame);
}
```

Le facteur `0.055` contrôle l'inertie. Plus bas = plus flottant et cinéma­
tographique ; plus haut = plus réactif mais plus sec. Entre `0.04` et `0.08`.

## Carte d'environnement (réflexions)

Sans `scene.environment`, un matériau métallique est une surface colorée
plate. On fabrique un petit studio en code, on le cuit en carte
d'environnement, puis on le jette — aucun fichier externe requis.

```js
const pmrem = new THREE.PMREMGenerator(rendu);
const studio = new THREE.Scene();
studio.background = new THREE.Color(0x0A0B08);
// panneaux : plafond chaud lumineux, sol froid sombre, deux côtés contrastés
scene.environment = pmrem.fromScene(studio, 0.04).texture;
studio.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
pmrem.dispose();
```

Sur un `MeshStandardMaterial`, régler `metalness` et `roughness` de façon
cohérente : un laiton brossé est `metalness: 1, roughness: 0.35`, un marbre
adouci `metalness: 0, roughness: 0.55`.

## Objets par monde

```js
const d = Math.abs(m - obj.userData.monde);
const vis = Math.max(0, Math.min(1, 1 - d / 0.5));
obj.material.opacity = vis;
obj.visible = vis > 0.01;        // évite le coût de rendu à opacité nulle
```

Une largeur de `0.5` donne une apparition nette sans déborder. Élargir à
`0.85` fait déjà baver l'objet sur le monde voisin — bug déjà rencontré et
corrigé sur Atelier Nord.

## Interaction souris

```js
addEventListener('pointermove', (e) => {
  cible.x = (e.clientX / innerWidth) * 2 - 1;
  cible.y = -(e.clientY / innerHeight) * 2 + 1;
}, { passive: true });

// dans la trame
visee.x += (cible.x - visee.x) * 0.06;
visee.y += (cible.y - visee.y) * 0.06;
camera.position.x += visee.x * 0.6;    // amplitude faible
camera.position.y += visee.y * 0.4;
```

Toujours lisser : appliquer la position brute de la souris donne un
tremblement désagréable.

## Repli et accessibilité

```js
if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
if (innerWidth <= 900) { canvas.remove(); return; }
```

Et côté HTML, l'import dynamique retire le canvas si le module échoue :

```js
import('./scene3d.js')
  .then((m) => m.demarrerMondes(c, infobulle))
  .catch(() => c?.remove());
```
