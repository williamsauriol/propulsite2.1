# Spécimen 02 — la maison qu'on traverse

Site de démonstration nº 2. Le visiteur descend dans la page et se promène
d'une pièce à l'autre. Parcours en 9 plans, dans cet ordre :

`00 extérieur` · `01 entrée` · `02 salon` · `03 cuisine` · `04 salle de bain`
· `05 chambre` · `06 bureau` · `07 cour` · `08 aérien`

Fichier Blender : `blender/specimen-02.blend` (hors dépôt, voir .gitignore).
Rendus de contrôle : `blender/rendus/`.

## Exigence de William sur la caméra — décisive

**Pas de caméra fixe qui refait le même mouvement à chaque défilement.** Une
séquence pré-rendue rejouée à l'identique se lit comme une vidéo, pas comme
un espace.

Technique retenue : rendre **chaque plan avec sa carte de profondeur**
(passe Mist ou Z de Cycles), puis appliquer une **parallaxe pilotée par la
souris** dans le navigateur. Le premier plan se décale plus que l'arrière-
plan, ce qui recrée un vrai déplacement de tête. Deux visites ne donnent
jamais le même mouvement, et le poids reste celui d'une image + une carte
de gris.

À combiner avec le défilement : le scroll change de pièce, la souris fait
bouger la vue à l'intérieur de la pièce.

## Ce qui est fait

- Coquille : deux étages, plan en L, aile arrière, toit plat
- 8 ouvertures vitrées avec profils noirs et meneaux, porte de chêne
- Plancher de bois (texture Poly Haven, projection cubique à l'échelle)
- Éclairage : HDRI ciel pur + une source de jour dans chaque ouverture,
  courbe AgX contrastée. **C'est ce qui a débloqué les intérieurs**, qui
  étaient noirs et bruités.
- Mobilier provisoire en primitives (à remplacer)
- Cadrages 1 à 7 recomposés

## Décisions de production

**Mobilier importé, pas modélisé.** Des boîtes ne seront jamais belles.
Vérifié à l'écran : un vrai modèle Poly Haven change tout.

**Licence : usage commercial.** Ce site sert à vendre les services de
Propulsite. Poly Haven est en CC0 — aucune contrainte. Sur Sketchfab, les
licences varient et beaucoup interdisent le commercial ou imposent une
attribution : **vérifier chaque modèle avant import**.

**Ne détailler que ce qui entre dans le cadre** des 9 plans (voir la mémoire
`methode-3d-cadre`). Un mur hors champ ne mérite aucun effort.

## Ce qui reste, par ordre d'impact sur le réalisme

1. **L'extérieur** — sol gris et ciel vide en ce moment, et ça se voit par
   *toutes* les fenêtres. Arbres, terrasse, végétation.
2. **Remplacer tout le mobilier** par des modèles importés.
3. **La décoration** — plantes, cadres, coussins, livres. C'est littéralement
   ce qui sépare une maquette d'une photo d'immobilier.
4. Rendre les plans 4 à 8, corriger leurs cadrages (seuls 1 à 3 vérifiés).
5. Passe de profondeur sur chaque plan, pour la parallaxe.
6. Rendu final Cycles, puis assemblage du site.

## Rappels

- Nom affiché : **Spécimen 02**, jamais un nom d'entreprise crédible
- `noindex,nofollow` + bandeau de démonstration dès le premier commit
- La fenêtre Blender doit être **visible** pour que la vue rendue calcule ;
  sinon passer par un rendu dans un fichier, qui marche toujours
