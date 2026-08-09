# Spécimen 02 — la maison qu'on traverse

Site de démonstration nº 2. Le visiteur descend dans la page et **se promène
d'une pièce à l'autre** : entrée, cuisine, salle de bain, chambre, salon,
sous-sol. Chaque pièce est un décor différent et présente une réalisation.

Statut : **planifié, pas commencé.** Ce document existe pour reprendre le
travail sans le redécider.

## Décision d'architecture

Approche retenue : **rendus pré-calculés dans Blender + caméra 3D dans le
navigateur.**

Écartée : une maison entière modélisée et exportée en GLTF. Un intérieur
détaillé pèse des dizaines de mégaoctets ; injouable sur le téléphone d'un
client sur un chantier, et contraire aux budgets de `performance-webgl`.

### Comment ça marche

Pour chaque pièce, Blender produit **une panoramique équirectangulaire 360°**
rendue en Cycles. Le navigateur la plaque à l'intérieur d'une sphère Three.js
et place la caméra au centre : le visiteur est **dans** la pièce et regarde
autour de lui à la souris.

Le défilement passe d'une pièce à la suivante par fondu entre deux sphères,
avec un léger mouvement de caméra pour vendre le déplacement.

Ce que ça donne :

| | |
|---|---|
| Qualité d'image | celle de Cycles — impossible à atteindre en temps réel |
| Poids | quelques JPEG, pas un modèle 3D |
| Sensation | on est dans la pièce, on peut regarder partout |
| Coût de rendu navigateur | une sphère texturée par pièce : négligeable |

### Budget

- Panoramique : 2048 × 1024, JPEG qualité 80 → environ 150–250 Ko chacune
- 6 pièces ≈ 1,2 Mo **au total**, chargées paresseusement au défilement
- Seule la première pièce est chargée à l'ouverture

## Pipeline Blender

1. Modéliser une maison simple mais juste : volumes, ouvertures, mobilier clé
2. Matériaux et éclairage soignés — c'est là que se joue le réalisme
3. Caméra panoramique équirectangulaire au centre de chaque pièce
   (Cycles → Caméra → Type : Panoramique → Équirectangulaire)
4. Rendre en 4096 × 2048, exporter, réduire à 2048 × 1024 et compresser
5. Déposer dans `public/exemples/specimen-02/pieces/`

## Structure du site

Réutiliser l'architecture à mondes de `specimen-01` (voir la skill
`scene-3d-defilement`) : un monde par pièce, `data-monde` sur chaque section.
La différence : au lieu d'objets flottants, chaque monde est une sphère
panoramique.

Points d'intérêt cliquables dans chaque pièce pour révéler les détails d'une
réalisation (surface, durée, matériaux).

## Ce qu'il manque pour démarrer

- [ ] **Blender connecté dans une session neuve** — un connecteur ajouté en
      cours de session n'est pas visible avant redémarrage
- [ ] Images d'inspiration de William pour le style de la maison
- [ ] Style arrêté : moderne, chalet, classique ?
- [ ] Textes des réalisations (voir `redaction-conversion`)

## Rappels

- Nom affiché : **Spécimen 02**, jamais un nom d'entreprise crédible
- `noindex,nofollow` + bandeau de démonstration dès le premier commit
- Repli obligatoire sous 900 px et si WebGL manque
- `prefers-reduced-motion` : pas de rotation automatique
