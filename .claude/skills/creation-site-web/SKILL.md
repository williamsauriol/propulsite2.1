---
name: creation-site-web
description: Workflow complet de création et refonte de sites web chez Propulsite — de la structure au lancement, avec les barrières de qualité obligatoires. Aiguille vers les skills spécialisées (SEO, GEO, performance, 3D, accessibilité, rédaction). À utiliser dès qu'on crée, refond ou améliore un site web, une page, un site de démonstration ou une landing page.
---

# Création de site web

Skill maîtresse. Elle donne l'ordre des opérations et renvoie aux skills
spécialisées. Ne pas tout charger d'un coup — suivre l'aiguillage.

## Aiguillage

| Le travail porte sur… | Charger |
|---|---|
| Vitesse, Core Web Vitals, poids des pages | `performance-web` |
| Balises, sitemap, données structurées, indexation | `seo-technique` |
| Search Console, fiche Google, page non indexée | `google-apres-lancement` |
| Être cité par ChatGPT / Perplexity / AI Overviews | `geo-visibilite-ia` |
| Fiche Google, recherche locale, secteur desservi | `seo-local-quebec` |
| Textes, titres, appels à l'action, offres | `redaction-conversion` |
| Clavier, contraste, lecteurs d'écran, WCAG | `accessibilite-web` |
| Animations, transitions, sensation « haut de gamme » | `design-mouvement` |
| Scène 3D pilotée par le défilement | `scene-3d-defilement` |
| Trames, éclairage, fluidité d'une scène 3D | `performance-webgl` |
| Nouveau site-vitrine fictif (Spécimen 01, etc.) | `site-demonstration` |
| Analyser un site d'inspiration fourni par William | `audit-site-reference` |
| Générer images / vidéos / voix | `medias-higgsfield` |

## Le stack Propulsite

`propulsite.ca` : React 19 + Vite 6 + Tailwind 4, routeur `react-router-dom`,
déployé sur Vercel depuis `main`. Le SEO ne dépend PAS du rendu client :
`scripts/prerender.ts` s'exécute après `vite build` et écrit un fichier HTML
par route avec ses propres `title`, `description`, canonical, Open Graph et
JSON-LD, plus `dist/sitemap.xml`.

**Conséquence : toute nouvelle route doit être ajoutée à `prerender.ts`,
sinon elle est invisible pour Google et absente du sitemap.** C'est l'oubli
le plus coûteux de ce projet.

Les sites de démonstration vivent dans `public/exemples/<nom>/` en HTML/CSS/JS
statique — hors du routeur React, donc hors du prerender. Ils portent leur
propre `<head>` complet.

## Ordre des opérations

Copier cette liste et la cocher au fur et à mesure :

```
- [ ] 1. Intention   — à qui ça s'adresse, quelle action on veut déclencher
- [ ] 2. Structure   — une page = une intention de recherche = un objectif
- [ ] 3. Contenu     — les textes AVANT la mise en page
- [ ] 4. Construction — sémantique d'abord, décoration ensuite
- [ ] 5. Vérification — `npm run verifier` doit passer
- [ ] 6. Lancement   — build, prerender, sitemap, commit, PUIS remise à Google
```

### 1. Intention

Avant d'écrire une ligne : pour qui, et quelle action unique doit être posée
(appeler, demander une soumission, remplir le formulaire). Une page qui
demande trois choses n'en obtient aucune.

### 2. Structure

Une URL par intention de recherche. Ne pas empiler « toiture + revêtement +
gouttières » sur une page : trois pages, trois titres, trois intentions.
Chaque page a un objectif de conversion explicite.

### 3. Contenu

Rédiger avant de construire (`redaction-conversion`). Une belle mise en page
sur du texte faible ne convertit pas ; du texte fort dans une mise en page
ordinaire convertit. Bâtir la page autour du texte, jamais l'inverse.

### 4. Construction

- HTML sémantique : `<header> <nav> <main> <h1> <section> <footer>`. Un seul
  `<h1>` par page, hiérarchie de titres sans saut de niveau.
- Mobile d'abord — la majorité du trafic construction est sur téléphone, sur
  un chantier, avec une main.
- Dimensions explicites (`width`/`height` ou `aspect-ratio`) sur images et
  médias, sinon la mise en page saute (voir `performance-web`).
- Décoration après. L'animation et la 3D sont un enrichissement : le site
  doit être complet et utilisable si elles ne chargent pas.

### 5. Vérification — barrière obligatoire

```bash
npm run verifier
```

Le script vérifie le `dist/` construit : titres, descriptions, canonical, `h1`
uniques, `lang`, JSON-LD valide, `alt` sur les images, cohérence du sitemap.
**Boucle : lancer → corriger → relancer jusqu'à zéro erreur.** Ne jamais
déclarer un site terminé sans que le script passe.

Il ne remplace pas le regard : vérifier aussi visuellement (Browser pane) en
desktop ET en mobile avant de livrer.

### 6. Lancement

`npm run build` exécute Vite puis le prerender. Vérifier que
`dist/sitemap.xml` contient bien la ou les nouvelles URLs, puis commiter.

## Non négociables

Un site n'est pas livrable s'il manque un de ces points :

- Le numéro de téléphone est cliquable (`tel:`) et visible sans défiler sur mobile
- Une action claire est proposée à chaque écran de défilement
- Chaque page a un `title` et une `description` uniques
- Le site est utilisable au clavier seul
- Aucune erreur console au chargement
- `npm run verifier` passe
