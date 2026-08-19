---
name: seo-technique
description: SEO technique — balises title/description, canonical, sitemap, robots, indexation et données structurées JSON-LD. À utiliser en ajoutant une page ou un article, en modifiant prerender.ts, ou quand on parle de référencement, Google, indexation, balises meta ou schema.org.
---

# SEO technique

Le SEO technique ne fait pas monter un site à lui seul — il enlève les
raisons de ne pas le faire monter. C'est une barrière de qualité, pas une
stratégie.

## Règle nº 1 sur ce projet

Toute nouvelle route React doit être ajoutée à `scripts/prerender.ts`.
Sans ça : pas de `title` propre, pas de canonical, pas de JSON-LD, absente
du sitemap. La page existe pour les humains et pas pour Google.

Vérifier après `npm run build` que la route apparaît dans `dist/sitemap.xml`
et que `dist/<route>/index.html` contient les bonnes balises.

## Balises par page

| Balise | Règle |
|---|---|
| `title` | 30–60 caractères, unique, le mot-clé en premier, la marque à la fin |
| `description` | 70–155 caractères, unique, une promesse + une raison de cliquer |
| `canonical` | absolu, une seule par page, pointant sur elle-même |
| `h1` | exactement un par page, distinct du `title` |
| `html lang` | `fr-CA` pour le marché québécois |
| `og:image` | 1200×630, absolue |

La `description` n'est pas un facteur de classement direct mais elle décide
du taux de clic — donc du trafic réel. L'écrire comme une annonce, pas comme
un résumé.

## Données structurées (JSON-LD)

Ce qui produit encore des résultats enrichis chez Google et ce qui n'en
produit plus :

| Type | Statut | Utilité |
|---|---|---|
| `LocalBusiness` | actif | Recherche locale, Google Maps — le plus important ici |
| `Service` | actif | Pages de service |
| `BreadcrumbList` | actif | Fil d'Ariane dans les résultats |
| `Article` / `BlogPosting` | actif | Articles de blogue |
| `Product`, `Review`, `Event` | actif | Selon le contenu |
| `FAQPage` | **plus de résultat enrichi Google** | Garder quand même : lu par Bing et les moteurs IA |
| `HowTo` | **plus de résultat enrichi Google** | Aucun gain SERP, aucune pénalité |

Le retrait des résultats enrichis FAQ ne rend pas le balisage inutile —
il reste une aide à la compréhension pour les moteurs de réponse IA
(voir `geo-visibilite-ia`). Ne pas le retirer, mais ne pas en attendre un
gain d'affichage Google.

Règles : le JSON-LD doit décrire ce qui est réellement visible sur la page,
être du JSON valide, et ne jamais inventer d'avis ou de notes.

## Architecture

- Une URL par intention de recherche, pas une page fourre-tout.
- URLs courtes, en minuscules, avec des traits d'union, sans accents ni
  paramètres : `/services/conception-site-web`.
- Maillage interne : chaque page de service pointe vers les pages connexes
  et vers la conversion. Les pages orphelines ne se font pas explorer.
- Ne jamais changer une URL qui se positionne. Si c'est inévitable :
  redirection 301 dans `vercel.json`.

## Vérification

```bash
npm run build && npm run verifier
```

Le script valide les longueurs de balises, l'unicité des `title`/
`description`, la présence des canonical, le nombre de `h1`, la validité du
JSON-LD et la cohérence du sitemap. Corriger jusqu'à zéro erreur.

Ensuite seulement : Search Console pour l'indexation réelle, et le test des
résultats enrichis de Google pour le balisage.

**Le code qui passe ne suffit pas.** Un sitemap généré à chaque build n'est pas
un sitemap remis à Google : sur ce projet, 25 URLs se généraient depuis le
lancement et Search Console affichait « Submitted sitemaps : 0 » — 9 pages
indexées sur 25. Dérouler `google-apres-lancement` après chaque déploiement.
