---
name: geo-visibilite-ia
description: GEO (Generative Engine Optimization) — structurer un site pour être cité et recommandé par ChatGPT, Perplexity, Google AI Overviews, Gemini et Claude. À utiliser en rédigeant du contenu, en travaillant llms.txt ou robots.txt, ou quand on parle de GEO, d'IA, de moteurs de réponse ou d'être cité par ChatGPT.
---

# GEO — visibilité dans les moteurs de réponse IA

Le SEO vise un rang dans une liste de liens. Le GEO vise d'être **la
réponse**. Le recoupement entre le top Google et les sources citées par les
IA s'est effondré : bien se classer ne garantit plus d'être cité.

C'est un service que Propulsite vend. Le site doit être son propre exemple.

## Ce que les moteurs IA citent

Ils extraient des passages autonomes. Un passage citable est un bloc court
qui répond complètement à une question sans avoir besoin du reste de la page.

**Structure qui se fait citer :**

1. **Titre en question réelle.** `## Combien coûte une rénovation de cuisine
   au Québec ?` plutôt que `## Nos tarifs`. Les titres doivent ressembler à
   ce que quelqu'un tape ou dit.
2. **Réponse dans les 50 premiers mots** sous le titre. Directe, complète,
   affirmative. L'élaboration vient après, pas avant.
3. **Chiffres précis et vérifiables.** « 15 000 $ à 40 000 $ » se cite ;
   « ça dépend de plusieurs facteurs » ne se cite jamais.
4. **Blocs courts.** Un paragraphe = une idée. Les longs blocs se font
   ignorer parce qu'ils ne s'extraient pas proprement.
5. **Listes et tableaux** pour tout ce qui est comparatif, séquentiel ou
   chiffré — c'est le format que les IA reprennent le plus volontiers.

## Autorité — ce qui décide qui est cité

À contenu égal, l'IA cite la source qui a l'air la plus fiable.

- **Auteur nommé** avec fonction et expérience vérifiable. Un texte signé
  « l'équipe » se fait citer beaucoup moins qu'un texte signé par une
  personne réelle avec une compétence établie.
- **Fraîcheur affichée.** Date de mise à jour visible. Remplacer les
  statistiques de plus de 18 mois.
- **Mentions par des tiers.** Ce que les autres sites disent de l'entreprise
  pèse plus que ce que l'entreprise dit d'elle-même. Citations dans la presse
  locale, associations, annuaires du secteur.
- **Entité claire et cohérente.** Le même nom, la même adresse, le même
  téléphone partout sur le web. Une IA qui n'arrive pas à identifier
  l'entreprise avec certitude ne la recommande pas.

## Les fichiers d'accès

Deux fichiers, déjà en place sur `propulsite.ca` — les maintenir à jour :

**`public/robots.txt`** autorise explicitement les robots IA : `GPTBot`,
`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`,
`Google-Extended`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`,
`Applebot-Extended`, `Amazonbot`, `cohere-ai`.

Bloquer ces robots retire l'entreprise des réponses IA. C'est un choix
stratégique, pas un réglage technique — ne jamais le faire sans en parler.

**`public/llms.txt`** est un résumé lisible de l'entreprise : ce qu'elle
fait, où, pour qui, ses services avec liens, ses coordonnées. Le mettre à
jour à chaque nouveau service ou changement de coordonnées. C'est la fiche
d'identité que l'IA lit en premier.

## Données structurées

Le JSON-LD sert davantage au GEO qu'au SEO maintenant. `LocalBusiness` avec
`areaServed`, `knowsAbout` et `sameAs` bien remplis aide l'IA à comprendre
qui est l'entreprise et sur quoi elle fait autorité.

`FAQPage` ne produit plus de résultat enrichi Google mais reste lu par Bing
et les moteurs IA — le garder (voir `seo-technique`).

## Mesure

Pas de Search Console pour le GEO. Deux méthodes :

1. **Test manuel mensuel.** Poser à ChatGPT, Perplexity et Gemini les
   questions qu'un client poserait (« meilleure agence marketing pour
   entrepreneurs en construction au Québec »). Noter si l'entreprise
   apparaît, et qui apparaît à sa place.
2. **Trafic de référence dans GA4.** Filtrer `chatgpt.com`, `perplexity.ai`,
   `gemini.google.com`, `claude.ai`. La progression mensuelle est le
   véritable indicateur.

## Piège

Ne jamais bourrer un texte de mots-clés en espérant être cité. Les moteurs
IA évaluent la substance : un texte creux mais optimisé se fait ignorer,
alors qu'un texte court avec un chiffre précis et une source claire se fait
citer. La qualité du contenu **est** la tactique.
