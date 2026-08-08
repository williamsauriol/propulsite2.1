# Bibliothèque de skills — Propulsite

Savoir-faire réutilisable pour la création de sites web. Chaque skill se
charge automatiquement quand le travail correspond à sa description ; rien
n'est chargé tant que ce n'est pas pertinent.

## Point d'entrée

**`creation-site-web`** est la skill maîtresse : elle donne l'ordre des
opérations et aiguille vers les autres. C'est celle à suivre pour tout
nouveau site ou toute refonte.

## Les skills

### Fondations web
| Skill | Couvre |
|---|---|
| `creation-site-web` | Workflow complet, stack Propulsite, barrières de qualité |
| `performance-web` | Core Web Vitals (LCP/INP/CLS), budgets, corrections |
| `accessibilite-web` | WCAG 2.2, clavier, contraste, `prefers-reduced-motion` |

### Visibilité
| Skill | Couvre |
|---|---|
| `seo-technique` | Balises, canonical, sitemap, JSON-LD, `prerender.ts` |
| `geo-visibilite-ia` | Être cité par ChatGPT, Perplexity, AI Overviews |
| `seo-local-quebec` | Fiche Google, secteur desservi, avis, NAP |
| `redaction-conversion` | Textes qui convertissent pour la construction |

### 3D et mouvement
| Skill | Couvre |
|---|---|
| `scene-3d-defilement` | Architecture Three.js à mondes pilotés par le scroll |
| `performance-webgl` | Budgets 3D : appels de dessin, lumières, textures |
| `design-mouvement` | Durées, courbes, ce qui fait « haut de gamme » |

### Procédés
| Skill | Couvre |
|---|---|
| `site-demonstration` | Créer un site-vitrine fictif (type Atelier Nord) |
| `audit-site-reference` | Analyser un site d'inspiration fourni en référence |
| `medias-higgsfield` | Générer des médias, gérer les crédits |

## La barrière de qualité

```bash
npm run build && npm run verifier
```

`scripts/verifier-site.mjs` analyse `dist/` et vérifie les invariants qui
doivent tenir sur chaque page : titres et descriptions uniques et de bonne
longueur, canonical, `h1` unique, `lang`, JSON-LD valide, `alt` sur les
images, cohérence du sitemap, poids des ressources.

Les **erreurs** bloquent (code de sortie 1). Les **avertissements** sont à
juger au cas par cas. Boucle : lancer → corriger → relancer.

Le script ne remplace pas le regard : toujours vérifier visuellement en
desktop et en mobile avant de livrer.

## Modifier une skill

Ces skills sont vivantes. Quand une leçon est apprise à la dure — un bug
subtil, une contrainte du projet, une préférence de William — l'ajouter à la
skill concernée plutôt que de la réapprendre la prochaine fois.

Règles d'écriture (doc officielle Anthropic) : `SKILL.md` sous 500 lignes,
`description` à la troisième personne disant **ce que ça fait et quand
l'utiliser**, références à un seul niveau de profondeur, chemins en barres
obliques.
