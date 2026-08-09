---
name: design-visuel
description: Règles visuelles objectives et vérifiables — typographie, échelle modulaire, espacement, couleur, contraste, composition et retenue en 3D. À utiliser dès qu'on juge ou conçoit l'apparence d'une page, quand un design a l'air amateur ou bon marché, ou quand on cherche à rendre un site plus « haut de gamme ».
---

# Design visuel

Skill née d'un échec : un site a été jugé « dégueulasse » après avoir empilé
de la 3D partout. **Plus de 3D n'est pas plus beau.** Ce qui rend un site
cher, c'est la retenue et la typographie.

Comme je ne vois pas le rendu, je m'appuie sur des règles **mesurables**.
Elles ne remplacent pas un œil, mais elles éliminent la majorité des fautes.

## Le piège du minimalisme

Le minimalisme est l'approche la plus exigeante : les défauts qui se cachent
sur une page chargée deviennent criants sur une page vide. Choisir le
minimalisme, c'est s'obliger à la perfection des détails — pas se simplifier
la vie.

## Règles vérifiables

Chacune se contrôle sans jugement esthétique.

| Règle | Seuil |
|---|---|
| Texte courant | ≥ 16 px — jamais moins |
| Longueur de ligne | 45–80 caractères, viser ~66 |
| Interligne | 1,5–1,7 pour le texte ; 1,05–1,25 pour les grands titres |
| Polices | **2 maximum** |
| Contraste texte | ≥ 4,5:1 (≥ 3:1 pour le grand texte et l'interface) |
| Espacement | multiples de 8 px, sans exception |
| Tailles de police | tirées d'une échelle modulaire (raison 1,2 à 1,333) |
| Remplissage de bouton | horizontal = 2 × vertical |
| Cibles cliquables | ≥ 24 × 24 px |
| Remplissage | extérieur ≥ intérieur |

Autres règles sans chiffre, mais binaires :

- **Tout doit être aligné sur autre chose.** Un élément aligné sur rien
  donne l'impression de ne pas appartenir à la composition. Les positions et
  rotations aléatoires sont la faute la plus visible.
- **Jamais de complexe sur du complexe.** Du texte sur une scène chargée est
  illisible et sale. Si le fond est riche, le premier plan doit être calme —
  et inversement.
- **Toute photographie qui porte du texte doit être assombrie à la source**
  (multiplier sa couleur) **et recevoir un voile dégradé**. Une photo bien
  exposée est toujours trop lumineuse pour ça, même sombre à l'œil.
- **Décor fixe + texte qui défile = aucune bande sûre.** Quand un canvas 3D
  reste fixe derrière un texte qui défile, il n'existe aucune zone de l'écran
  où la lisibilité soit garantie à tous les niveaux de défilement. Le texte
  doit alors porter sa propre protection (fond translucide + flou), et
  l'en-tête fixe aussi.
- **Une seule technique de profondeur** dans toute l'interface.
- **La hiérarchie se fait par la taille et la graisse**, pas par la couleur.

## Interface sombre

- **Jamais de noir pur.** Le texte clair sur noir absolu crée une halation
  qui fatigue l'œil et écrase la profondeur. Partir de `#121212` environ.
- **Jamais de blanc pur** non plus pour le texte : un blanc légèrement
  adouci réduit l'éblouissement.
- **L'élévation se fait par la clarté, pas par l'ombre** — les ombres ne se
  voient pas sur fond sombre. Une surface plus haute est une surface plus
  claire. Écart entre fond et conteneur : environ 12 %.
- **Désaturer les accents vifs** : une couleur saturée vibre sur fond sombre.

## La 3D : la retenue est le sujet

Un seul objet bien éclairé, plus une révélation à l'interaction, suffit à
faire passer un site en premium. Pas besoin d'un monde explorable.

**Les quatre signes d'amateur :**

1. **Scène surchargée** — empiler modèles, effets et interactions trahit
   l'insécurité, pas la maîtrise.
2. **Matériaux génériques** — une géométrie simplement texturée se lit comme
   un « placeholder ». Un cube avec une image de bois dessus n'est pas du
   bois.
3. **Interactions non motivées** — du mouvement qui existe parce que c'est
   possible, pas parce que ça raconte quelque chose.
4. **Typographie déconnectée** — du texte posé *par-dessus* la 3D au lieu
   d'appartenir à la même logique spatiale.

Ne jamais utiliser un `GridHelper` comme décor : c'est un outil de débogage.

## Ordre de travail

La typographie d'abord, la couleur ensuite, le décor en dernier. Un site
bien composé en noir et blanc, sans aucune image, doit déjà fonctionner.
S'il ne fonctionne pas à ce stade, aucun effet ne le sauvera.

## Vérification

Contrôler dans le navigateur, pas à l'œil nu :

```js
getComputedStyle(el).fontSize      // ≥ 16px pour le texte courant
getComputedStyle(el).lineHeight
document.fonts                     // au plus 2 familles
```

Calculer les ratios de contraste réels sur les couleurs calculées, pas sur
les valeurs de la palette — l'opacité et la superposition changent le
résultat.
