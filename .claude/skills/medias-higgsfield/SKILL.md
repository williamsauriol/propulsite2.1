---
name: medias-higgsfield
description: Utilisation du connecteur MCP Higgsfield pour générer images, textures, vidéos et voix — gestion des crédits et arbitrage entre média généré et code. À utiliser avant toute génération d'image ou de vidéo, ou quand on parle de crédits Higgsfield, de forfaits ou de visuels à produire.
---

# Médias Higgsfield

Higgsfield génère des **médias** : images, vidéos, voix, 3D à partir d'image.
Ce n'est pas un moteur de site web. Pour de la 3D interactive dans une page,
c'est Three.js en code — gratuit et illimité (voir `scene-3d-defilement`).

Les outils MCP sont préfixés par l'identifiant du connecteur, par exemple
`mcp__<id>__balance`. L'identifiant change si William reconnecte le
connecteur — repérer les outils par leur suffixe (`balance`,
`generate_image`, `show_plans_and_credits`…), pas par le préfixe complet.

## Vérifier le solde en premier — toujours

Appeler `balance` **avant** toute génération. Les crédits partent vite :
le solde est tombé de 10 à 2 pendant la seule refonte d'Spécimen 01
(4 textures = 6 crédits, à 2 crédits l'image).

Ne jamais lancer une génération en lot sans avoir annoncé le coût à William.

## Règle de facturation — stricte

William a été explicite : **jamais d'abonnement, uniquement des forfaits à
prix fixe.**

Si le solde est insuffisant :

1. Dire combien il reste et combien l'opération coûte.
2. Présenter les forfaits fixes via `show_plans_and_credits` (paliers 500 /
   1000 / 2000 / 4000 crédits) — jamais les plans d'abonnement.
3. Ne jamais effectuer un achat. Fournir l'information et laisser William
   acheter lui-même.

## Générer un média, ou l'écrire en code ?

| Besoin | Choix |
|---|---|
| Texture de matériau (bois, marbre, laiton) | `generate_image` — 2 crédits |
| Photo d'ambiance, visuel de campagne | `generate_image` |
| Vidéo de fond, montage, effets | `generate_video` ou app Marketplace |
| Géométrie, éclairage, caméra, interactivité | **Code** — Three.js, gratuit |
| Animation d'interface, défilement, apparitions | **Code** — CSS/JS, gratuit |
| Photos réelles de projets ou de personnes | **Ni l'un ni l'autre** — vraies photos |

C'est l'arbitrage central : Higgsfield produit la matière première, le code
produit le mouvement et l'interaction. C'est ce partage qui a permis de
faire une expérience 3D complète avec 6 crédits.

## Photos réelles vs générées

Pour tout ce qui prétend montrer un vrai projet, une vraie équipe ou un vrai
client : **photo réelle obligatoire**. William l'a demandé explicitement pour
les visuels de réseaux sociaux. Une image générée présentée comme une
réalisation est un mensonge que les clients du métier repèrent.

Banque de photos réelles : API Pexels (clé dans le `.env` du projet
« claude assistant »).

## Après génération

Toute image destinée à devenir une texture doit être redimensionnée à
~1024 px et compressée avant d'être servie — les fichiers bruts sont trop
lourds pour le web (voir `performance-webgl`).

## Pièges connus

- **Faux positifs NSFW** sur des descriptions de matériaux anodines. Ces
  échecs ne consomment pas de crédit : reformuler et relancer.
- `apps_search` sans requête liste toutes les apps Marketplace — utile pour
  découvrir ce que William a ajouté depuis la dernière fois.
