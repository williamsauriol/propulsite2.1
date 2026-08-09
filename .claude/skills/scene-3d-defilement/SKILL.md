---
name: scene-3d-defilement
description: Architecture Three.js « mondes fractionnels » — un canvas fixe plein écran dont l'ambiance change selon le défilement, chaque section étant un univers distinct. À utiliser pour créer, étendre ou déboguer une scène 3D pilotée par le scroll, comme celle de public/exemples/specimen-01.
---

# Scène 3D pilotée par le défilement

Un seul `<canvas>` fixe derrière tout le site. Le canvas ne défile pas : le
défilement choisit quel **monde** est actif et fond les ambiances entre
elles. Chaque section devient un univers visuellement distinct.

Implémentation de référence :
`public/exemples/specimen-01/scene3d.js`.
Détail complet de l'architecture : voir [reference/architecture.md](reference/architecture.md).

## Principe

Chaque section HTML porte `data-monde="N"` et `data-nom="Nom affiché"`. Un
tableau `MONDES` définit une ambiance par section :

```js
{ id:'vide', fond:0x0D0E0B, brume:0.042, cle:0xFFF0D4, contre:0x7FA8CC,
  accent:0xD6A968, cam:[0,0,14], regard:[0,0,-4] }
```

À chaque trame, on calcule un index **fractionnaire** (ex. `2.7`) à partir du
défilement, puis on interpole toutes les propriétés entre `MONDES[2]` et
`MONDES[3]` : couleur de fond, densité de brume, les trois lumières, la
position de caméra et sa cible.

C'est l'interpolation continue qui crée la sensation de traverser des
univers. Un changement brusque à la frontière casse complètement l'effet.

## Trois règles non négociables

**1. Mesurer après le chargement des polices.** Les frontières viennent de
`offsetTop`/`offsetHeight`. Si on mesure avant que les polices soient
chargées, la mise en page change ensuite et toutes les frontières restent
fausses pour la session. Toujours :

```js
mesurer();
document.fonts.ready.then(mesurer);
addEventListener('load', () => setTimeout(mesurer, 400));
addEventListener('resize', mesurer);
```

**2. Aucune balise `<img>` dans les sections 3D.** Toute image doit devenir
une texture Three.js. Une image HTML posée par-dessus la scène se bat
visuellement avec elle et casse l'illusion de profondeur.

**3. Transition dans le dernier tiers seulement.** Le monde ne doit pas
commencer à changer dès qu'on entre dans la section, sinon on ne voit jamais
un univers stable :

```js
const f = Math.max(0, (t - 0.66) / 0.34);
```

## Ajouter un monde

```
- [ ] 1. Ajouter la section HTML avec data-monde="N" et data-nom
- [ ] 2. Renuméroter les data-monde suivants
- [ ] 3. Ajouter l'entrée correspondante dans MONDES (même index)
- [ ] 4. Ajouter les objets propres au monde avec leur fenêtre de visibilité
- [ ] 5. Vérifier par capture d'écran à ce point de défilement
```

Le nombre d'entrées de `MONDES` doit **toujours** égaler le nombre de
`[data-monde]` dans le HTML.

## Objets propres à un monde

Un objet visible seulement autour de son monde a besoin d'une fenêtre de
fondu, sinon il apparaît d'un coup :

```js
const d = Math.abs(m - obj.userData.monde);
const vis = Math.max(0, Math.min(1, 1 - d / 0.5));
```

Appliquer `vis` à l'opacité et à l'échelle. Une fenêtre trop large fait
déborder l'objet sur le monde voisin — c'est la cause la plus fréquente de
« ça a l'air sale entre deux sections ».

## Interactivité

La souris pilote une visée lissée (`visee.x`, `visee.y`) qui décale
légèrement la caméra et fait pivoter les objets. Amplitude faible : le
mouvement doit suggérer la profondeur, pas donner le vertige.

`Raycaster` pour le survol — ne l'activer que dans le monde concerné, jamais
en permanence.

## Débogage

| Symptôme | Cause la plus probable |
|---|---|
| Frontières décalées | Mesure avant chargement des polices |
| Objet qui coupe un titre | Position de caméra du monde, pas la position de l'objet |
| Image d'un monde visible dans le suivant | Fenêtre de visibilité trop large |
| Saut brusque entre sections | Facteur de lissage trop élevé, ou pas de smoothstep |
| Scène figée | Boucle mise en pause hors-écran et jamais relancée |

Toujours confirmer une correction par une capture d'écran au bon point de
défilement. Ne jamais déclarer corrigé sans avoir revu la scène.

## Performance et repli

Voir `performance-webgl` pour les budgets, et `accessibilite-web` pour
`prefers-reduced-motion`. La scène est un enrichissement : sous 900 px de
large ou si WebGL échoue, on retire le canvas et le site reste complet.
