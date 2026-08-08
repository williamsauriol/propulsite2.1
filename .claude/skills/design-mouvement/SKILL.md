---
name: design-mouvement
description: Craft de l'animation web — durées, courbes d'accélération, apparitions au défilement et micro-interactions qui donnent une sensation haut de gamme. À utiliser quand on ajoute des animations, des transitions, ou quand on cherche à rendre un site plus vivant, plus fluide ou plus premium.
---

# Design de mouvement

La différence entre un site qui a l'air cher et un site qui a l'air bricolé
tient presque entièrement au timing et aux courbes. Les mêmes éléments, mal
animés, ont l'air amateurs.

## Durées

| Type | Durée |
|---|---|
| Micro-interaction (survol, bouton, bascule) | 120–200 ms |
| Transition d'élément (apparition, panneau) | 250–400 ms |
| Transition de section ou de page | 500–800 ms |
| Mouvement d'ambiance (fond, parallaxe) | 1 s et plus |

Sur mobile, raccourcir : le toucher appelle une réponse plus immédiate que
la souris. Sous 100 ms le mouvement n'est pas perçu ; au-delà de 400 ms sur
une interaction directe, il est perçu comme de la lenteur.

## Courbes

Le linéaire a l'air mécanique. Rien ne démarre ni ne s'arrête d'un coup dans
le monde réel.

```css
--sortie: cubic-bezier(0.16, 1, 0.3, 1);      /* entrées : vif puis pose */
--entree: cubic-bezier(0.7, 0, 0.84, 0);      /* sorties : part vite */
--doux:   cubic-bezier(0.16, 0.84, 0.32, 1);  /* usage général */
```

Règle : **ce qui entre décélère** (l'utilisateur doit le suivre), **ce qui
sort accélère** (on n'a pas besoin de le regarder partir).

## Ce qui donne la sensation « haut de gamme »

Les références que William aime (alethia, era-residence, noartmusic)
partagent cinq traits :

1. **Rien n'apparaît d'un coup.** Tout entre en fondu et en léger
   déplacement, jamais en surgissant.
2. **Décalage en cascade.** Les éléments d'un groupe s'animent à 40–80 ms
   d'intervalle plutôt que tous ensemble. C'est ce qui donne l'impression
   que le site est vivant et non scripté.
3. **Amplitude faible.** Un déplacement de 12–24 px suffit. Les grandes
   translations font bon marché.
4. **Il y a toujours quelque chose qui bouge lentement** en fond — une
   lumière, une poussière, un léger flottement. Un site parfaitement immobile
   entre deux interactions a l'air mort.
5. **Le mouvement suit le défilement** plutôt que de se déclencher une fois.
   L'utilisateur sent qu'il contrôle.

## Ce qui fait bon marché

- Rebonds et effets élastiques sur du contenu sérieux
- Rotations complètes, retournements 3D gratuits
- Tout ce qui clignote ou pulse en boucle
- Animer plus de deux propriétés à la fois sur le même élément
- Un délai avant que le contenu principal soit lisible

## Performance

N'animer que `transform` et `opacity` — le GPU les compose sans recalculer
la mise en page. Animer `width`, `height`, `top`, `left`, `margin` force un
recalcul à chaque trame et fait tomber le taux de rafraîchissement.

Prévenir le navigateur uniquement quand c'est utile, et retirer ensuite :

```css
will-change: transform;   /* jamais en permanence sur beaucoup d'éléments */
```

## Apparitions au défilement

`IntersectionObserver`, jamais un écouteur de défilement qui recalcule des
positions. Cesser d'observer après le déclenchement.

```js
const io = new IntersectionObserver((entrees) => {
  entrees.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
```

La marge négative en bas déclenche l'apparition **avant** que l'élément
touche le bord de l'écran — sinon l'utilisateur voit l'animation démarrer
en retard.

## Cohérence

Une même interaction doit toujours avoir la même durée et la même courbe
partout sur le site. Déclarer les valeurs en variables CSS et les réutiliser.
Des durées choisies au cas par cas se remarquent, même sans savoir pourquoi.

## Accessibilité

`prefers-reduced-motion: reduce` est obligatoire, pas optionnel — voir
`accessibilite-web`. Le contenu doit apparaître dans son état final, complet,
sans mouvement.
