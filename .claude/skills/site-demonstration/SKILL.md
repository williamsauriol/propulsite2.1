---
name: site-demonstration
description: Gabarit pour créer un site-vitrine de démonstration d'entreprise fictive sous public/exemples/, servant d'exemple de réalisation sur propulsite.ca. À utiliser quand William demande un nouveau site-exemple pour un métier (paysagiste, cuisiniste, électricien, toiturier...).
---

# Site de démonstration

Un site-exemple sert à montrer à un prospect ce que Propulsite peut faire.
Il doit être plus ambitieux qu'un vrai site client — c'est une vitrine, pas
une livraison.

Référence existante : `public/exemples/specimen-01/` (rénovation haut de
gamme, scène 3D à huit mondes).

## Pourquoi en statique

Ces sites vivent dans `public/exemples/<nom>/` en HTML/CSS/JS pur, **hors**
du routeur React. Raison : ils échappent ainsi au `Navbar`/`Footer` globaux
de `App.tsx` et peuvent avoir une identité visuelle totalement indépendante,
tout en étant servis par le même déploiement Vercel.

Conséquence : ils ne passent pas par `scripts/prerender.ts` et portent donc
leur propre `<head>` complet.

## Structure

```
public/exemples/<nom>/
  index.html              <head> complet, sections sémantiques
  style.css               design system en variables CSS
  app.js                  rideau, titre animé, apparitions au défilement
  scene3d.js              optionnel — voir scene-3d-defilement
  vendor/three.module.js  si 3D — copie locale, jamais de CDN
  polices/*.woff2         auto-hébergées
  img/                    images compressées
```

## Convention de nommage — obligatoire

Les sites de démonstration s'appellent **« Spécimen NN »**, numérotés dans
l'ordre de création : `Spécimen 01`, `Spécimen 02`, etc. Dossier
correspondant : `public/exemples/specimen-NN/`.

**Pourquoi :** un nom qui sonne comme une vraie entreprise (l'ancien
« Atelier Nord ») laisse croire au visiteur qu'il regarde le site d'un
client réel. « Spécimen 01 » annonce immédiatement une pièce de
démonstration, tout en gardant l'allure d'une collection soignée.

Ne jamais inventer un nom d'entreprise crédible pour une démo. Les
coordonnées suivent la même règle : courriel en `@specimen.exemple`,
téléphone et licence RBQ manifestement fictifs.

## Obligations

**Isolation SEO.** L'entreprise est fictive : elle ne doit jamais entrer
dans l'index de Google et brouiller le référencement réel de propulsite.ca.

```html
<meta name="robots" content="noindex,nofollow">
```

**Déclaration visible.** Un bandeau en bas de page qui dit explicitement que
c'est une démonstration, que l'entreprise est fictive, et que les prix et
réalisations sont des exemples. Non négociable : un visiteur ne doit jamais
pouvoir croire qu'il s'agit d'une vraie entreprise qu'il pourrait engager.

**Lien de retour** vers `https://propulsite.ca` dans le pied de page.

**Aucune fausse preuve sociale** : pas de faux avis nominatifs, pas de faux
logos de partenaires, pas de fausse licence RBQ ressemblant à une vraie.
Utiliser des numéros manifestement fictifs (`0000-0000-00`).

## Composants attendus

Pour rester cohérent avec le niveau de Spécimen 01 :

- **Rideau d'ouverture** — nom + accroche, se lève après ~2 s, sauté si
  `prefers-reduced-motion`
- **Titre découpé mot par mot** qui monte en cascade
- **Jauge de progression** nommant la section courante
- **Apparitions au défilement** via `IntersectionObserver`
- **Repli complet** si la 3D ou le JS échoue

## Créer un nouveau site

```
- [ ] 1. Choisir le métier et inventer une entreprise crédible
- [ ] 2. Écrire les textes en premier (voir redaction-conversion)
- [ ] 3. Copier la structure de specimen-01, remplacer le design system
- [ ] 4. noindex + bandeau de démonstration dès le premier commit
- [ ] 5. Ajouter la carte de prévisualisation dans src/pages/Home.tsx
- [ ] 6. Vérifier en desktop ET mobile dans le Browser pane
```

## Mise en vitrine

Ajouter une carte dans la section « Nos réalisations » de
`src/pages/Home.tsx`, pointant vers `/exemples/<nom>/`.

## Ce qui fait « haut de gamme »

Retenu des références fournies par William (voir `audit-site-reference`) :

- Minimalisme radical — peu de texte à l'écran à la fois, beaucoup de vide
- Écran de couverture avant d'entrer
- Chaque section est un univers distinct : la caméra, la lumière et la
  composition changent, pas seulement la couleur
- Quelque chose bouge toujours lentement en fond
- Grandes images, peu nombreuses, jamais de grille dense de vignettes
