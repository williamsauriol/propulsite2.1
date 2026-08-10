---
name: audit-site-reference
description: Méthode pour analyser un site web d'inspiration fourni en référence — palette, typographie, rythme d'animation et techniques employées — avant de s'en inspirer. À utiliser quand William envoie des URLs de sites dont il aime le design.
---

# Audit d'un site de référence

Quand William envoie des URLs de sites qu'il aime, ne jamais se fier au nom
de domaine ni à un souvenir : aller regarder le site pour vrai.

## Outils

Utiliser le **Browser pane** (`preview_start` avec `{url}`, puis `navigate`,
`read_page`, `javascript_tool`, `computer` pour les captures).

Ce projet n'a **pas** Puppeteer ni Playwright installés — ne pas écrire de
script qui les suppose.

## Démarche

```
- [ ] 1. Ouvrir le site et capturer le haut de page
- [ ] 2. Défiler par paliers et capturer à chaque changement notable
- [ ] 3. Extraire palette, polices et techniques
- [ ] 4. Traduire chaque remarque de William en caractéristique précise
- [ ] 5. Résumer en décisions applicables
```

### Extraire la palette et la typographie

```js
getComputedStyle(document.body).fontFamily
getComputedStyle(document.body).backgroundColor
[...document.querySelectorAll('h1,h2')].map(e => getComputedStyle(e).fontFamily)
```

### Identifier les techniques

Regarder les scripts chargés pour comprendre **comment** l'effet est fait,
pas seulement à quoi il ressemble :

```js
[...document.scripts].map(s => s.src).filter(Boolean)
```

Signatures courantes : `three` (3D WebGL), `gsap` (animation), `lenis` ou
`locomotive` (défilement lissé), `matter` (physique). Un effet qui semble
magique vient souvent d'une seule de ces librairies.

Vérifier aussi la présence d'un `<canvas>` plein écran — c'est la signature
d'une scène 3D de fond comme celle de Spécimen 01.

## Traduire les remarques de William

Il ne dit presque jamais « fais pareil ». Il nomme une caractéristique
précise, et c'est **elle** qu'il faut reproduire — pas l'ambiance générale
du site.

Exemples de ses références passées :

| Site | Ce qu'il a nommé | Caractéristique à reproduire |
|---|---|---|
| structurecorp.com | la page de couverture avec le logo avant d'entrer | Écran d'ouverture bloquant |
| alethia.earth | les animations et le minimalisme, « j'adore tout » | Ancre visuelle principale : vide, lenteur, mouvement permanent |
| noartmusic.com | le chargement, le globe qu'on peut bouger, la vidéo plein écran, les lettres qui bougent | Objet 3D manipulable + typographie légèrement vivante |
| era-residence.com | quand on scrolle vers le bas | Chorégraphie pilotée par le défilement |
| snydercg.com | comment c'est présenté physiquement | Mise en page, échelle, composition |

Consigner ses mots exacts. « J'aime le globe qu'on peut bouger » est une
exigence d'interactivité, pas une demande de globe.

## Droit d'auteur

Ne jamais copier le texte, les images ni le code source d'un site de
référence. On s'inspire de la **sensation** — rythme, échelle, type
d'interaction — et on reconstruit avec le contenu propre au projet.
