---
name: google-apres-lancement
description: Vérifications à faire DANS les outils Google (Search Console, fiche Google Business) après la mise en ligne d'un site ou d'une page. À utiliser après un déploiement, quand une page ne se positionne pas, quand on prend en charge un nouveau client, ou quand on se demande pourquoi Google ignore du contenu qui existe pourtant.
---

# Google après la mise en ligne

`seo-technique` s'occupe du code : balises, canonical, JSON-LD, génération du
sitemap. Tout ça peut être parfait et Google peut quand même ne rien voir.

Cette skill couvre l'autre moitié : **la remise à Google**. Ce sont des gestes
qui se font dans Search Console et sur la fiche Google, jamais dans le dépôt.

## L'incident qui a créé cette skill

Le 19 août 2026, propulsite.ca générait `dist/sitemap.xml` avec 25 URLs à
chaque build, depuis le lancement. Le validateur passait. Les balises étaient
bonnes.

**Search Console affichait « Submitted sitemaps : 0 ».** Le sitemap n'avait
jamais été déclaré. Google découvrait les pages une par une, au hasard des
liens : **9 indexées sur 25.** Deux tiers du site étaient invisibles.

Soumis en trente secondes → lu le jour même, 25 pages découvertes.

**La leçon :** générer un sitemap et le remettre à Google sont deux gestes
différents. Aucun script de build ne fait le second.

## Les six vérifications, par ordre de rentabilité

### 1. Le sitemap est-il soumis ?

Search Console → **Sitemaps**. Si la liste est vide, c'est le problème.

Soumettre le chemin seul (`sitemap.xml`), pas l'URL complète. Vérifier ensuite
la colonne **Statut** (doit dire *Success*) et **Pages découvertes** — ce
nombre doit correspondre à ce que le build annonce.

Un écart entre les deux veut dire que Google lit un vieux sitemap ou qu'une
partie des URLs est rejetée.

### 2. L'écart entre pages soumises et pages indexées

Search Console → **Pages**. Comparer au nombre du sitemap.

| Écart | Ce que ça dit |
|---|---|
| Indexées ≈ soumises | sain |
| Indexées très inférieures | Google ne découvre pas, ou juge le contenu trop mince |
| 0 indexée | blocage technique — voir robots, canonical, `noindex` |

C'est le seul chiffre qui mesure vraiment si un site existe pour Google.

### 2 bis. La page est-elle liée depuis le site ?

Découvert le 25 août 2026. Une page peut être dans le sitemap sans qu'aucun
lien du site n'y mène. Google la voit, ne trouve aucun chemin vers elle, et la
range en **« Détectée, actuellement non indexée »**. Ce n'est pas un bug
technique : c'est Google qui conclut qu'une page que personne ne lie ne vaut
pas la peine d'être indexée.

Aucun validateur ne l'attrape, parce que la page est parfaite prise isolément.

Le test, sur le HTML **pré-rendu** — pas sur le code React, parce que Googlebot
lit d'abord le HTML servi :

```bash
grep -rl "secteurs/mon-nouveau-slug" dist/ | head
```

Zéro résultat hors de `sitemap.xml` et de la page elle-même = page orpheline.

Les deux cas rencontrés sur propulsite.ca :

- **Page de secteur** : ni la navigation, ni le pied de page, ni un article
  n'y menaient. Corrigé par une section « Secteurs desservis » au pied de page,
  générée à partir de `SECTEURS` — les prochaines se lient toutes seules.
- **Articles de blogue** : `Blog.tsx` gardait sa **propre** liste d'articles
  écrite à la main, doublon de `painPointsData.tsx`. Les deux derniers articles
  publiés n'apparaissaient nulle part sur `/blog`. Corrigé en dérivant la liste
  de la source unique.

**La leçon générale :** partout où une liste d'articles ou de pages est écrite
à la main à côté des données réelles, elle finit par diverger, et les pages
neuves deviennent invisibles. Toujours dériver de la source unique.

### 3. Demander l'indexation des pages neuves

Search Console → **Inspection d'URL** → coller l'adresse → **Demander
l'indexation**.

L'inspection dit aussi *pourquoi* une page est absente :

- **« URL inconnue de Google »** — jamais explorée. Normal quelques heures
  après la mise en ligne ; anormal après une semaine si le sitemap est soumis.
- **« Détectée, actuellement non indexée »** — vue mais jugée peu prioritaire.
  Ce n'est pas un bug : c'est un jugement sur la valeur du contenu.
- **« Autre page avec canonical approprié »** — Google a choisi une autre page
  comme version principale. Vérifier les canonical.

Soumettre deux fois ne change rien à la position dans la file. Le faire une
fois par page neuve, pas plus.

### 4. Le type de propriété

Search Console → **Paramètres**.

Une propriété **préfixe d'URL** (`https://exemple.ca/`) ne couvre QUE cette
forme exacte. Elle ignore `http://`, `www.` et les sous-domaines. Un site qui
répond aussi sur `www.` a donc la moitié de ses données ailleurs, ou nulle
part.

Une propriété **domaine** (`sc-domain:exemple.ca`) couvre tout. C'est celle à
créer chez un nouveau client, quitte à garder l'ancienne en parallèle.

### 5. robots.txt et noindex

Vérifier que `robots.txt` n'interdit pas ce qu'on veut faire indexer, et
qu'aucune page à indexer ne porte `noindex`.

Attention au cas inverse, propre à ce projet : les sites de démonstration sous
`public/exemples/` **doivent** porter `noindex,nofollow` (voir
`site-demonstration`). Les retirer par mégarde brouillerait le référencement
réel.

### 6. La fiche Google Business

Google gère maintenant les fiches **depuis la recherche** : chercher le nom de
l'entreprise en étant connecté, puis « Gérer maintenant ». L'ancienne adresse
`business.google.com` redirige.

À contrôler :

- **Photos** : logo et couverture d'abord, ce sont les deux qui s'affichent.
  Une fiche sans photo se fait dépasser par une fiche qui en a.
- **Publications** : deux par semaine est la barre en 2026. Écrire une série
  d'avance plutôt qu'un post à la fois — le goulot n'est jamais la rédaction,
  c'est de devoir recommencer chaque semaine.
- **Zones servies** : ouvrir la liste réelle, pas le résumé.
- **Catégorie principale** : celle qui pèse le plus dans le classement local.

## Le piège dans lequel je suis tombé

**Ne jamais conclure à partir du texte affiché publiquement.**

La fiche de Propulsite affichait « Saint-Eustache et les zones à proximité ».
J'en ai déduit que les zones servies étaient mal configurées et j'ai
recommandé de nommer les villes. En ouvrant la liste : **12 villes déjà
configurées** — la recommandation ne tenait pas.

« Saint-Eustache et les zones à proximité » n'était qu'un résumé généré par
Google.

**Règle : ouvrir la configuration réelle avant de recommander de la changer.**
Ça vaut pour les zones servies, les catégories, les heures et les services.

## Quand un client arrive

```
- [ ] 1. Search Console existe-t-il ? Sinon, le créer en propriété domaine
- [ ] 2. Sitemap soumis ? Statut Success ? Pages découvertes cohérentes ?
- [ ] 3. Écart entre pages soumises et indexées
- [ ] 4. robots.txt, noindex, et pages orphelines (grep dans dist/)
- [ ] 5. Fiche Google : photos, cadence de publication, zones, catégorie
- [ ] 6. Noter le nombre de pages indexées — c'est la mesure de départ
```

L'étape 6 compte autant que les autres : sans chiffre de départ, impossible de
prouver plus tard qu'on a changé quelque chose.

## Ce qui n'est pas de la magie

Demander l'indexation **accélère la découverte**, pas le classement. Une page
mince indexée reste une page mince. Si l'écart soumises/indexées ne se referme
pas après quelques semaines alors que le sitemap est lu, le problème est la
valeur du contenu — voir `redaction-conversion` et `seo-technique`.
