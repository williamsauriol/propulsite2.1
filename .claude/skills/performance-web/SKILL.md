---
name: performance-web
description: Budgets de performance web et Core Web Vitals (LCP, INP, CLS) — seuils, causes courantes et corrections. À utiliser quand un site est lent, quand on ajoute des images/polices/scripts, avant un lancement, ou quand on parle de vitesse, PageSpeed, Lighthouse ou Core Web Vitals.
---

# Performance web

La vitesse est un facteur de classement ET de conversion. Sur un site de
construction, le visiteur est souvent sur données cellulaires : une page
lente est un contrat perdu avant même d'avoir été lue.

## Seuils à respecter

Mesurés au 75e centile des vrais utilisateurs, sur 28 jours. Les trois
doivent passer.

| Métrique | Bon | Mauvais | Ce qu'elle mesure |
|---|---|---|---|
| LCP | ≤ 2,5 s | > 4,0 s | Délai d'affichage du plus gros élément visible |
| INP | ≤ 200 ms | > 500 ms | Réactivité aux interactions |
| CLS | ≤ 0,1 | > 0,25 | Stabilité visuelle (contenu qui saute) |

INP est la métrique la plus souvent échouée — c'est là qu'il faut regarder
en premier quand un site « passe » sur papier mais semble mou.

## Causes et corrections

### LCP trop lent

Presque toujours une image ou une police.

- L'image du héros doit être `<img>` dans le HTML, pas une image de fond CSS
  (le navigateur la découvre plus tôt), avec `fetchpriority="high"` et
  **sans** `loading="lazy"`.
- Toutes les autres images : `loading="lazy"` + `decoding="async"`.
- Servir en AVIF/WebP, dimensionner à la taille réelle d'affichage.
- Polices : auto-héberger en `.woff2`, `<link rel="preload">` sur la graisse
  du titre uniquement, et `font-display: swap`.

Attention sur `propulsite.ca` : la police Inter vient de Google Fonts via
deux `preconnect` + une feuille de style bloquante. C'est un coût LCP réel ;
l'auto-hébergement est le gain le plus direct disponible.

### INP trop lent

- Découper tout travail JS long ; rien ne doit bloquer le fil principal plus
  de 50 ms.
- N'animer que `transform` et `opacity` — quasi gratuits car composités par
  le GPU. Animer `width`, `height`, `top`, `left` force un recalcul de mise
  en page à chaque trame.
- Écouteurs de défilement et de souris en `{ passive: true }`, et lisser le
  travail dans `requestAnimationFrame`.
- Différer les scripts tiers (analytics, chat) après l'interaction.

### CLS trop élevé

- `width`/`height` ou `aspect-ratio` sur **toute** image, vidéo, iframe.
- Réserver la hauteur des bannières et bandeaux injectés en JS.
- Jamais d'insertion de contenu au-dessus de contenu déjà visible.
- Polices : `size-adjust` ou une police de repli métriquement proche pour
  éviter le saut au moment de l'échange.

## Budgets

Sur une page vitrine construction, viser :

- HTML + CSS + JS critique : < 150 Ko compressés
- Image du héros : < 200 Ko
- Total au premier affichage : < 1 Mo
- Polices : 2 fichiers `.woff2` maximum

Dépasser un budget est une décision consciente, pas un accident. Si une
fonctionnalité coûte plus que son budget, elle doit être chargée
paresseusement ou retirée.

## Vérification

```bash
npm run build && npm run verifier
```

Le script signale les fichiers lourds et les images sans dimensions. Pour la
mesure réelle, utiliser PageSpeed Insights sur l'URL en production — les
données de laboratoire locales ne reflètent pas le 75e centile terrain.

Après toute correction de performance, revérifier dans le Browser pane en
desktop ET en largeur mobile (`resize_window`), pas seulement sur le poste
de développement.
