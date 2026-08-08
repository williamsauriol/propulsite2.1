---
name: performance-webgl
description: Budgets et optimisation d'une scène Three.js/WebGL — appels de dessin, lumières, ombres, textures, ratio de pixels et libération mémoire. À utiliser quand une scène 3D rame, chauffe, saccade sur mobile, ou avant de livrer une page contenant de la 3D.
---

# Performance WebGL

Une scène 3D impressionnante qui fait chauffer le téléphone du client est un
échec. Sur un site vitrine, la 3D doit coûter le moins possible.

## Budgets

| Ressource | Bureau | Mobile |
|---|---|---|
| Appels de dessin par trame | < 100 | < 50 |
| Lumières actives | 3 | 2 |
| Lumières projetant une ombre | 1 | 0 |
| Carte d'ombre | 1024–2048 px | 512–1024 px |
| Ratio de pixels | ≤ 2 | ≤ 1,5 |
| Texture | 1024 px, qualité 0,86 | idem |

Mesurer, ne pas deviner :

```js
console.log(rendu.info.render.calls, rendu.info.render.triangles);
console.log(rendu.info.memory.geometries, rendu.info.memory.textures);
```

Une mémoire qui grimpe en continu signale une fuite : quelque chose n'est
pas libéré.

## Réglages du rendu

```js
const rendu = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
rendu.setPixelRatio(Math.min(devicePixelRatio, 2));
```

Ne jamais passer `devicePixelRatio` brut : sur un écran à 3x, le nombre de
pixels à calculer est multiplié par 9. Le plafond à 2 est invisible à l'œil
et divise la charge.

## Lumières et ombres

Chaque lumière ajoute du calcul par pixel. Trois lumières suffisent à
sculpter n'importe quelle scène : une principale, un contre-jour, un accent.

Les ombres coûtent très cher. Une `PointLight` avec ombre exige **six**
rendus par trame (les six faces du cube). Sur une scène de site vitrine,
l'éclairage sans ombre portée est presque toujours le bon choix — la carte
d'environnement et le contre-jour donnent déjà le relief.

Si la scène est statique :

```js
rendu.shadowMap.autoUpdate = false;   // et déclencher manuellement au besoin
```

## Géométrie et matériaux

- **Réutiliser** géométries et matériaux entre objets identiques. Créer un
  matériau par maillage empêche tout regroupement automatique.
- Beaucoup d'objets identiques → `InstancedMesh` : mille objets en un seul
  appel de dessin.
- Objets statiques nombreux → fusionner avec
  `BufferGeometryUtils.mergeGeometries()`.
- Laisser `frustumCulled = true` (défaut) : ce qui est hors champ ne coûte
  rien.

## Textures

- Redimensionner à 1024 px de côté et compresser avant de servir. Les
  fichiers bruts d'un générateur d'images sont trop lourds pour le web.
- Réutiliser la même texture entre matériaux plutôt que de la recharger.
- Pour une scène lourde en assets, envisager KTX2/Basis (≈10× moins de
  mémoire GPU que PNG/JPEG) — surdimensionné pour un site vitrine simple.

## Libération mémoire

Tout ce qui est créé doit être détruit quand on ne s'en sert plus :

```js
geo.dispose(); mat.dispose(); tex.dispose();
```

Vaut aussi pour les scènes temporaires (studio de carte d'environnement) et
les cibles de rendu. Oublier `dispose()` est la cause nº 1 de fuite mémoire
dans une page 3D qui reste ouverte longtemps.

## Ne pas rendre pour rien

```js
const io = new IntersectionObserver(([e]) => { actif = e.isIntersecting; });
io.observe(canvas);
// dans la boucle : if (!actif) return requestAnimationFrame(trame);
```

Une scène hors écran ne doit consommer aucune ressource. Sur une scène
statique, ne redessiner que sur changement plutôt qu'en continu.

## Repli obligatoire

- Sous 900 px de large : retirer le canvas, garder le site complet.
- WebGL indisponible : `catch` sur l'import dynamique, retirer le canvas.
- `prefers-reduced-motion` : pas d'animation ni d'interactivité 3D.

Vérifier ces trois cas avant de livrer, pas seulement le cas nominal.
