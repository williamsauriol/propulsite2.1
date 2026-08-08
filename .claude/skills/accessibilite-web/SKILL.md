---
name: accessibilite-web
description: Accessibilité web selon WCAG 2.2 — clavier, contraste, taille des cibles, focus visible, lecteurs d'écran et prefers-reduced-motion. À utiliser en construisant une interface, un formulaire, une navigation ou une animation, et avant toute livraison.
---

# Accessibilité web (WCAG 2.2)

Un site inaccessible exclut des clients réels et expose légalement. La
plupart des exigences sont satisfaites par du HTML correct — c'est
l'improvisation en `<div>` qui crée les problèmes.

## Le socle

- **HTML sémantique.** `<button>` pour une action, `<a href>` pour une
  navigation. Un `<div onclick>` n'est ni focusable, ni annoncé, ni
  activable au clavier — il faut alors tout réimplémenter à la main.
- **Une seule hiérarchie de titres** cohérente, sans saut de niveau.
- **Étiquettes de formulaire** liées avec `<label for>`. Un `placeholder`
  n'est pas une étiquette : il disparaît à la saisie.
- **`alt` sur les images** : décrire la fonction, pas l'apparence. `alt=""`
  pour une image purement décorative — c'est la bonne réponse, pas un oubli.
- **Contraste** : 4,5:1 pour le texte courant, 3:1 pour le grand texte et les
  éléments d'interface. Le texte blanc sur photo échoue presque toujours
  sans voile assombrissant.

## Nouveautés WCAG 2.2 souvent échouées

| Critère | Exigence |
|---|---|
| Taille de cible (2.5.8, AA) | 24×24 px CSS minimum, ou espacement suffisant entre cibles |
| Focus non masqué (2.4.11, AA) | L'élément focusé ne doit pas être caché par un en-tête collant ou une bannière |
| Mouvements de glissement (2.5.7, AA) | Toute action au glisser doit avoir une alternative en un seul geste |
| Aide cohérente (3.2.6, A) | Le moyen d'obtenir de l'aide reste au même endroit sur tout le site |
| Saisie redondante (3.3.7, A) | Ne pas redemander une information déjà fournie dans le même processus |

Les deux premiers sont les plus fréquemment ratés sur un site vitrine :
un en-tête `position: sticky` qui recouvre le lien focusé, et des icônes
sociales trop petites dans le pied de page.

## Focus visible

Ne jamais faire `outline: none` sans remplacement. Un focus visible doit
avoir un contraste de 3:1 avec l'arrière-plan et rester perceptible sur
tous les fonds. Utiliser `:focus-visible` pour ne le montrer qu'au clavier.

## Mouvement et animation

`prefers-reduced-motion: reduce` n'est pas optionnel — le mouvement
déclenche des malaises réels (vertiges, nausée) chez certaines personnes.

Quand la préférence est active : désactiver les animations de défilement,
les parallaxes, les scènes 3D interactives, et afficher directement l'état
final du contenu. Le site doit rester **complet**, jamais amputé.

Vérifier en JavaScript aussi, pas seulement en CSS :

```js
const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Ne jamais faire clignoter du contenu plus de trois fois par seconde.

## Vérification

Copier cette liste avant toute livraison :

```
- [ ] Naviguer toute la page au clavier seul (Tab, Maj+Tab, Entrée, Échap)
- [ ] Le focus reste visible et jamais masqué par l'en-tête collant
- [ ] Aucun piège au clavier (on peut toujours ressortir)
- [ ] Contrastes vérifiés sur texte et boutons
- [ ] Toutes les images ont un alt pertinent (ou alt="")
- [ ] Les champs de formulaire ont une étiquette liée
- [ ] Testé avec prefers-reduced-motion activé
- [ ] Zoom à 200 % sans perte de contenu ni défilement horizontal
```

`npm run verifier` couvre les `alt` manquants et la structure des titres.
Le reste demande un test manuel — aucun outil automatique ne détecte plus
d'environ un tiers des problèmes réels.
