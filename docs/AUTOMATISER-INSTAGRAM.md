# Automatiser Instagram

Tout est bâti. Il manque **deux valeurs** que Meta ne donne qu'à toi.

Tant qu'elles ne sont pas là, le robot génère quand même l'image et la légende
chaque mercredi et les dépose dans `public/social/` — rien n'est perdu, tu peux
publier à la main. Dès que les deux valeurs sont posées, il publie tout seul.

---

## Ce que le robot fait déjà, sans toi

Chaque mercredi 9 h (heure de l'Est), sur GitHub Actions :

1. Il lit **les données de ton propre site** — tes six services, tes treize
   articles, les chiffres GEO avec leurs sources.
2. Il écrit une publication : accroche, trois lignes, légende, hashtags.
3. Il fabrique l'image 1080 × 1350 aux couleurs de Propulsite.
4. Il la pousse dans le dépôt.
5. Il publie sur Instagram — **si les deux secrets existent**.

Il ne peut pas inventer de statistique : les seuls chiffres qu'il a le droit
d'utiliser sont ceux du site, et ils portent tous leur source. Il n'a pas le
droit non plus de prétendre que tu as des clients ou des résultats.

**Coût : environ 0,20 $ US par semaine.** Un appel à Sonnet en effort bas
(0,05 $) plus la matière de fond peinte par Gemini (0,13 $). Le rendu de
l'image et l'exécution ne coûtent rien — GitHub Actions est gratuit et
illimité pour un dépôt public. Sur un mois : moins d'un dollar.

---

## Les valeurs qu'il te faut

| Secret | Ce que c'est | Sans lui |
|---|---|---|
| `IG_USER_ID` | L'identifiant numérique de ton compte Instagram professionnel | Rien n'est publié |
| `META_TOKEN` | Un jeton d'accès qui autorise la publication | Rien n'est publié |
| `GEMINI_API_KEY` | Une clé d'API Google, pour peindre la matière derrière le texte | Le visuel reste sur son fond plat |

Les deux premières bloquent la publication. La troisième ne bloque rien : elle
ne change que l'allure du visuel.

**Où prendre la clé Gemini :** `aistudio.google.com` → *Get API key*. Gratuit à
créer, facturé à l'image. Ce n'est **pas** ton abonnement Google AI Pro — celui-là
n'ouvre aucune API, les deux se paient séparément.

Elles se posent ici, une fois :
**github.com/williamsauriol/propulsite2.1 → Settings → Secrets and variables →
Actions → New repository secret**

---

## Les conditions préalables

Trois choses doivent être vraies avant même de commencer :

1. **@propulsite_ doit être un compte professionnel** (Entreprise, pas
   Créateur — l'API de publication refuse les comptes Créateur).
   Instagram → Paramètres → Type de compte.
2. **Il doit être relié à une Page Facebook.** Pas ton profil personnel : une
   *Page*. Si tu n'en as pas, il faut en créer une — c'est gratuit et ça prend
   cinq minutes. C'est aussi, au passage, un des liens externes qui te manquent.
3. **Un compte développeur Meta**, sur `developers.facebook.com`. Gratuit.

Le point 2 est celui qui bloque la plupart du monde. Ton `sameAs` sur le site
pointe aujourd'hui vers ton profil Facebook **personnel** — donc il y a de
bonnes chances que la Page n'existe pas encore.

---

## Le chemin

Dans `developers.facebook.com` : créer une app de type **Business**, y ajouter
le produit **Instagram**, puis générer un jeton avec ces quatre permissions :

```
instagram_basic
instagram_content_publish
pages_show_list
pages_read_engagement
business_management
```

**La cinquième est celle qu'on oublie.** Sans `business_management`, `/me/accounts`
répond une liste vide et rien ne laisse deviner pourquoi : les quatre autres
sont pourtant accordées, et l'erreur ressemble à une Page mal reliée. Toute Page
créée à l'intérieur d'un portefeuille business la réclame.

Et dans la fenêtre d'autorisation, à l'écran « Pages » puis « Comptes Instagram »,
il faut **cliquer la ligne** pour qu'elle soit cochée. Passer vite donne un jeton
valide, avec toutes les permissions, et zéro Page accessible.

Puis, plutôt que d'enchaîner les appels à la main :

```bash
npx tsx scripts/meta-jetons.ts
```

Il échange le jeton court contre un jeton de Page permanent, trouve
l'`IG_USER_ID`, et **affiche le nom du compte visé** pour qu'on vérifie qu'on
pointe bien vers @propulsite_ avant de publier quoi que ce soit. Le jeton n'est
jamais affiché : il est écrit dans `.meta-token.txt`, ignoré par git.

Les deux valeurs d'entrée se posent dans `.meta-secret.txt` et `.meta-court.txt`.
**Ne les colle pas dans le terminal** — un jeton Meta fait 300 caractères, la
console Windows le tronque et l'écrit par-dessus la commande suivante. Copie la
valeur, puis :

```bash
Get-Clipboard | Out-File -Encoding ascii -NoNewline .meta-court.txt
```

**Je ne t'écris pas la suite clic par clic, et c'est volontaire.** La console
Meta change de nom de bouton tous les quelques mois ; une marche à suivre datée
t'enverrait tourner en rond, et c'est exactement comme ça que les tentatives
précédentes sont mortes. **Demande-moi et on le fait ensemble, écran par
écran** — comme pour le Gmail. Compte trente minutes.

---

## Le piège qui casse ça dans deux mois

Un jeton d'utilisateur Meta **expire après 60 jours**. Si tu poses celui-là, le
robot marchera jusqu'à la fin octobre puis s'arrêtera sans prévenir — et tu
conclueras encore une fois que « ça a lâché ».

Ce qu'il faut poser à la place : un **jeton de Page dérivé d'un jeton
utilisateur de longue durée**. Celui-là n'expire pas tant que tu ne changes pas
ton mot de passe et que tu ne révoques pas l'app. C'est une étape de plus, et
c'est la différence entre un robot qui tient un an et un robot qui tient huit
semaines.

---

## Essayer sans rien dépenser

```bash
npx tsx scripts/social-generer.ts --essai
```

Rend `public/social/essai-gabarit.png` à partir d'un texte fixe, sans appeler
l'IA. Sert à vérifier le visuel après une retouche du gabarit.

Pour voir le visuel **avec** la matière de fond, pour 0,13 $ US et sans toucher
à une vraie publication :

```bash
npx tsx scripts/social-generer.ts --essai --fond
```

Pour générer une vraie publication sans la publier : lancer le workflow à la
main depuis l'onglet Actions et mettre **publier = non**.

---

## Où regarder quand ça casse

- **L'historique des exécutions :** onglet Actions du dépôt.
- **Le journal :** `public/social/journal.json` — chaque publication, son angle,
  si elle est partie et quand.
- **Symptôme le plus probable :** `META_TOKEN` expiré. L'erreur de Meta le dit
  explicitement dans le journal d'exécution.
