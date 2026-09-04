import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, ShieldCheck } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Funnel — le questionnaire de soumission.
 *
 * CE QUI A CHANGÉ, ET POURQUOI
 *
 * 1. PLUS D'ÉCRAN D'ACCUEIL. « Prêt pour le décollage ? » demandait un clic
 *    pour arriver à la première question. La personne venait de cliquer sur
 *    « Obtenir mon analyse gratuite » : elle a déjà dit oui. Lui redemander,
 *    c'est une porte de sortie offerte gratuitement.
 *
 * 2. UN SEUL CLIC PAR QUESTION. Avant, il fallait choisir PUIS appuyer sur
 *    « Suivant » : deux gestes pour une réponse, sept fois de suite. Le choix
 *    fait maintenant avancer tout seul. C'est le gain de conversion le plus
 *    important de cette refonte, et le moins visible.
 *
 * 3. PLUS DE TEXTE OBLIGATOIRE. La troisième question demandait d'écrire un
 *    paragraphe sur son plus grand défi. Un champ libre obligatoire en milieu
 *    de parcours, sur un téléphone, avec des mains de chantier : c'est là que
 *    le formulaire perdait le plus de monde. Le champ libre existe encore, à
 *    la fin, et il est facultatif.
 *
 * 4. LES QUESTIONS SONT CELLES D'UN ENTREPRENEUR. « Développeur / Technique »
 *    et « solopreneur » ne sont pas des mots de chantier. On demande
 *    maintenant le métier, la région, l'état du site actuel, ce qui manque, le
 *    volume visé et l'échéance — c'est-à-dire ce qu'il faut vraiment savoir
 *    pour préparer l'analyse, et rien d'autre.
 *
 * 5. LA DURÉE EST ANNONCÉE. « Six questions, moins de deux minutes » en haut de
 *    page. Un formulaire dont on ne voit pas la fin est un formulaire qu'on
 *    abandonne.
 *
 * 6. LES RÉPONSES SURVIVENT À UNE FERMETURE. Elles sont gardées dans le
 *    navigateur et rechargées au retour. Un entrepreneur interrompu par un
 *    appel ne recommence pas à zéro.
 *
 * NOTE SUR LES ANIMATIONS
 *
 * Elles n'animent que `y` et jamais `opacity`, comme partout dans le projet.
 * Cette page n'est pas pré-rendue (robots.txt la bloque), mais un contenu
 * caché par du CSS reste un contenu invisible si le JavaScript tarde.
 */

type Reponses = {
  metier: string;
  region: string;
  site: string;
  manque: string;
  volume: string;
  echeance: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
};

const VIDE: Reponses = {
  metier: '', region: '', site: '', manque: '', volume: '', echeance: '',
  nom: '', email: '', telephone: '', message: '',
};

interface Question {
  cle: keyof Reponses;
  titre: string;
  aide: string;
  options: string[];
  /** Une réponse écrite plutôt qu'un choix (la région varie trop pour une liste). */
  libre?: boolean;
  placeholder?: string;
}

/**
 * Six questions, et chacune sert à quelque chose de précis dans l'analyse.
 * Une question qui ne change rien à ce qu'on répondra est une question qui
 * coûte des soumissions.
 */
const QUESTIONS: Question[] = [
  {
    cle: 'metier',
    titre: 'Vous faites quoi, au juste ?',
    aide: 'Les mots que vos clients tapent dans Google changent complètement d’un métier à l’autre.',
    options: [
      'Toiture',
      'Rénovation générale',
      'Construction neuve',
      'Excavation / terrassement',
      'Électricité',
      'Plomberie / chauffage',
      'Paysagement',
      'Un autre métier du bâtiment',
    ],
  },
  {
    cle: 'region',
    titre: 'Vous travaillez dans quel coin ?',
    aide: 'Votre ville et celles autour. C’est ce qui décide sur quelles recherches on vous fait sortir.',
    options: [],
    libre: true,
    placeholder: 'Ex. : Saint-Eustache, Deux-Montagnes, Blainville',
  },
  {
    cle: 'site',
    titre: 'Vous avez un site web en ce moment ?',
    aide: 'Refaire et repartir de zéro, ce n’est pas le même travail ni le même prix.',
    options: [
      'Non, aucun site',
      'Juste une page Facebook',
      'Oui, mais il est vieux et je n’en suis pas fier',
      'Oui, il est correct, mais personne ne le trouve',
      'Oui, et il m’amène déjà des clients',
    ],
  },
  {
    cle: 'manque',
    titre: 'Qu’est-ce qui vous manque le plus ?',
    aide: 'Une seule réponse. Celle qui vous dérange le plus en ce moment.',
    options: [
      'Le téléphone ne sonne pas assez',
      'On ne me trouve pas sur Google',
      'J’ai l’air moins sérieux que mes concurrents',
      'J’ai des appels, mais pas les bons projets',
      'Je n’ai pas le temps de m’en occuper',
    ],
  },
  {
    cle: 'volume',
    titre: 'Vous voulez combien de contrats de plus par mois ?',
    aide: 'Ça détermine le budget et les moyens. Répondez ce que vous êtes capable de livrer.',
    options: [
      '1 ou 2 de plus, ce serait déjà bien',
      '3 à 5 de plus',
      '6 à 10 de plus',
      'Le plus possible, j’ai l’équipe pour',
    ],
  },
  {
    cle: 'echeance',
    titre: 'Vous voulez commencer quand ?',
    aide: 'Réponse honnête. Magasiner est une réponse tout à fait correcte.',
    options: [
      'Tout de suite',
      'D’ici un mois',
      'D’ici trois mois',
      'Je magasine, je regarde ce que ça donne',
    ],
  },
];

const CLE_SAUVEGARDE = 'propulsite-funnel-v2';

/** Ce qui lève les objections juste avant le bouton d'envoi. */
const GARANTIES = [
  { icone: <Clock className="w-4 h-4" />, texte: 'Réponse en 24 h ouvrables' },
  { icone: <ShieldCheck className="w-4 h-4" />, texte: 'Aucune relance automatique' },
];

export default function Funnel() {
  usePageMeta(
    'Analyse gratuite – Propulsite | 6 questions, moins de 2 minutes',
    'Six questions et on regarde votre fiche Google, votre site et vos concurrents directs. Gratuit, sans engagement, réponse en 24 h ouvrables.',
  );

  /** 0 à 5 : les questions. 6 : les coordonnées. 7 : le merci. */
  const [etape, setEtape] = useState(0);
  const [rep, setRep] = useState<Reponses>(VIDE);
  const [erreur, setErreur] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const champRegion = useRef<HTMLInputElement | null>(null);

  const DERNIERE_Q = QUESTIONS.length - 1;
  const ETAPE_CONTACT = QUESTIONS.length;
  const ETAPE_MERCI = QUESTIONS.length + 1;

  /* Reprise. Un entrepreneur interrompu par un appel de chantier ne doit pas
     retrouver un formulaire vide. On ne restaure jamais l'étape de fin : on
     n'envoie pas deux fois. */
  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE_SAUVEGARDE);
      if (!brut) return;
      const sauve = JSON.parse(brut);
      if (sauve && typeof sauve === 'object' && sauve.rep) {
        setRep({ ...VIDE, ...sauve.rep });
        if (typeof sauve.etape === 'number' && sauve.etape > 0 && sauve.etape <= ETAPE_CONTACT) {
          setEtape(sauve.etape);
        }
      }
    } catch {
      /* Navigation privée ou stockage bloqué : on repart de zéro, sans bruit. */
    }
  }, [ETAPE_CONTACT]);

  useEffect(() => {
    if (etape >= ETAPE_MERCI) return;
    try {
      localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify({ etape, rep }));
    } catch {
      /* Idem : la sauvegarde est un confort, pas une condition. */
    }
  }, [etape, rep, ETAPE_MERCI]);

  /* Le champ de région prend le focus tout seul : c'est la seule question qui
     demande de taper, et sans ça il faut viser le champ avant d'écrire. */
  useEffect(() => {
    if (QUESTIONS[etape]?.libre) champRegion.current?.focus();
  }, [etape]);

  const q = QUESTIONS[etape];
  const enQuestion = etape <= DERNIERE_Q;

  /** Le choix fait avancer. Deux gestes par question, sept fois de suite,
   *  c'était quatorze occasions d'abandonner. */
  const repondre = (cle: keyof Reponses, valeur: string) => {
    setErreur('');
    setRep((r) => ({ ...r, [cle]: valeur }));
    setTimeout(() => setEtape((e) => Math.min(e + 1, ETAPE_CONTACT)), 180);
  };

  const suivant = () => {
    setErreur('');
    if (enQuestion && q.libre && !rep[q.cle].trim()) {
      setErreur('Écrivez au moins votre ville.');
      return;
    }
    setEtape((e) => Math.min(e + 1, ETAPE_CONTACT));
  };

  const retour = () => {
    setErreur('');
    setEtape((e) => Math.max(0, e - 1));
  };

  const envoyer = async () => {
    setErreur('');
    if (!rep.nom.trim()) { setErreur('Il me faut votre nom.'); return; }
    if (!rep.email.trim() && !rep.telephone.trim()) {
      setErreur('Laissez au moins un courriel ou un téléphone, sinon je ne peux pas vous répondre.');
      return;
    }
    setEnvoiEnCours(true);
    try {
      const reponse = await fetch('https://formsubmit.co/ajax/propulsiteprojet@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Analyse gratuite — ${rep.nom} (${rep.metier || 'métier non précisé'})`,
          Nom: rep.nom,
          Courriel: rep.email || 'N/A',
          Téléphone: rep.telephone || 'N/A',
          Métier: rep.metier,
          'Secteur desservi': rep.region,
          'Site actuel': rep.site,
          'Ce qui manque': rep.manque,
          'Contrats visés par mois': rep.volume,
          Échéance: rep.echeance,
          Message: rep.message || 'Aucun',
        }),
      });
      if (!reponse.ok) {
        setErreur("L'envoi a échoué. Réessayez, ou écrivez directement à propulsiteprojet@gmail.com.");
        return;
      }
      try { localStorage.removeItem(CLE_SAUVEGARDE); } catch { /* sans importance */ }
      setEtape(ETAPE_MERCI);
    } catch {
      setErreur("Impossible de joindre le serveur. Vérifiez votre connexion, ou écrivez à propulsiteprojet@gmail.com.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const avancement = Math.round((Math.min(etape, ETAPE_CONTACT) / (ETAPE_CONTACT + 1)) * 100);

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-20 px-5 md:px-6 relative z-10">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="max-w-2xl mx-auto">
        {/* Le retour au site vit ici, pas dans la carte : il ne doit pas
            concurrencer le bouton qui fait avancer. */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-accent-blue text-sm mb-8 min-h-[24px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au site
        </Link>

        <div className="fn-carte rounded-[28px] md:rounded-[36px] px-6 py-9 md:px-12 md:py-12">
          {etape < ETAPE_MERCI && (
            <div className="mb-9 md:mb-11">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-accent-blue">
                  {etape < ETAPE_CONTACT
                    ? `Question ${etape + 1} sur ${QUESTIONS.length}`
                    : 'Vos coordonnées'}
                </span>
                {/* La durée est annoncée dès le premier écran. Un formulaire
                    dont on ne voit pas la fin est un formulaire qu'on quitte. */}
                <span className="text-[11px] md:text-xs text-white/35">
                  {etape === 0 ? 'moins de 2 minutes' : `${avancement} %`}
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                <div
                  className="fn-jauge h-full rounded-full"
                  style={{ width: `${Math.max(avancement, 4)}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Les six questions ─────────────────────────────────────── */}
          {enQuestion && (
            <div key={q.cle} className="fn-entree">
              <h1 className="text-[26px] md:text-4xl font-black text-white leading-[1.12] mb-3">
                {q.titre}
              </h1>
              <p className="text-white/45 text-sm md:text-base leading-relaxed mb-8">
                {q.aide}
              </p>

              {q.libre ? (
                <>
                  <input
                    ref={champRegion}
                    type="text"
                    inputMode="text"
                    autoComplete="address-level2"
                    aria-label={q.titre}
                    placeholder={q.placeholder}
                    value={rep[q.cle]}
                    onChange={(e) => setRep({ ...rep, [q.cle]: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') suivant(); }}
                    className="fn-champ w-full text-white text-base md:text-lg px-5 py-4 rounded-2xl"
                  />
                  <button
                    onClick={suivant}
                    className="fn-cta mt-6 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-accent-blue text-[#050a15] font-black uppercase tracking-wide px-10 py-4 rounded-full min-h-[48px]"
                  >
                    Continuer
                  </button>
                </>
              ) : (
                <div className="grid gap-3">
                  {q.options.map((opt, i) => {
                    const choisi = rep[q.cle] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => repondre(q.cle, opt)}
                        style={{ ['--rang' as string]: String(i) }}
                        className={`fn-choix ${choisi ? 'fn-choix-actif' : ''} w-full text-left flex items-center gap-4 px-5 py-4 md:px-6 md:py-[18px] rounded-2xl min-h-[48px]`}
                      >
                        <span className="fn-puce shrink-0" aria-hidden="true">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-white/85 leading-snug text-[15px] md:text-base">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Les coordonnées ───────────────────────────────────────── */}
          {etape === ETAPE_CONTACT && (
            <div className="fn-entree">
              <h1 className="text-[26px] md:text-4xl font-black text-white leading-[1.12] mb-3">
                Où je vous envoie l’analyse ?
              </h1>
              <p className="text-white/45 text-sm md:text-base leading-relaxed mb-8">
                Un courriel ou un téléphone suffit. C’est William qui vous répond,
                pas un robot.
              </p>

              <div className="grid gap-3">
                <input
                  type="text"
                  name="nom"
                  autoComplete="name"
                  aria-label="Votre nom"
                  placeholder="Votre nom *"
                  value={rep.nom}
                  onChange={(e) => setRep({ ...rep, nom: e.target.value })}
                  className="fn-champ w-full text-white px-5 py-4 rounded-2xl"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-label="Votre courriel"
                    placeholder="Courriel"
                    value={rep.email}
                    onChange={(e) => setRep({ ...rep, email: e.target.value })}
                    className="fn-champ w-full text-white px-5 py-4 rounded-2xl"
                  />
                  <input
                    type="tel"
                    name="telephone"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-label="Votre téléphone"
                    placeholder="Téléphone"
                    value={rep.telephone}
                    onChange={(e) => setRep({ ...rep, telephone: e.target.value })}
                    className="fn-champ w-full text-white px-5 py-4 rounded-2xl"
                  />
                </div>
                {/* Le champ libre est ici, et il est facultatif. Il était en
                    troisième position et obligatoire : c'est là que le
                    formulaire perdait le plus de monde. */}
                <textarea
                  aria-label="Précisions"
                  placeholder="Quelque chose à ajouter ? (facultatif)"
                  value={rep.message}
                  onChange={(e) => setRep({ ...rep, message: e.target.value })}
                  rows={3}
                  className="fn-champ w-full text-white px-5 py-4 rounded-2xl resize-none"
                />
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                {GARANTIES.map((g) => (
                  <li key={g.texte} className="inline-flex items-center gap-2 text-white/45 text-[12.5px]">
                    <span className="text-accent-blue">{g.icone}</span>
                    {g.texte}
                  </li>
                ))}
              </ul>

              <button
                onClick={envoyer}
                disabled={envoiEnCours}
                className="fn-cta mt-7 w-full inline-flex items-center justify-center gap-3 bg-accent-blue text-[#050a15] font-black text-base md:text-lg uppercase tracking-wide px-10 py-5 rounded-full min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {envoiEnCours ? (
                  <>
                    <span className="w-5 h-5 border-2 border-[#050a15] border-t-transparent rounded-full animate-spin" />
                    Envoi…
                  </>
                ) : (
                  'Envoyer ma demande'
                )}
              </button>
            </div>
          )}

          {/* ── Le merci ──────────────────────────────────────────────── */}
          {etape === ETAPE_MERCI && (
            <div className="fn-entree text-center py-6">
              <div className="fn-sceau mx-auto mb-8">
                <Check className="w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                C’est reçu.
              </h1>
              {/* On dit ce qui va se passer, et quand. « Nous vous contacterons
                  sous peu » ne rassure personne. */}
              <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-md mx-auto mb-3">
                William regarde votre fiche Google, votre site et vos concurrents
                directs, puis vous revient <strong className="text-white">d’ici 24 h ouvrables</strong>
                {rep.email ? <> à <strong className="text-white">{rep.email}</strong></> : null}.
              </p>
              <p className="text-white/40 text-sm mb-9">
                Si c’est urgent : <a href="tel:5146496862" className="text-accent-blue hover:underline">(514) 649-6862</a>
              </p>
              <Link
                to="/questions"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 font-bold px-8 py-4 rounded-full hover:border-accent-blue/50 hover:text-white transition-colors min-h-[48px]"
              >
                En attendant, lisez nos réponses aux questions fréquentes
              </Link>
            </div>
          )}

          {erreur && (
            <p className="mt-5 text-[#ff8b8b] text-sm font-medium" role="alert">
              {erreur}
            </p>
          )}

          {/* Le retour arrière reste discret et n'apparaît jamais sur la
              première question ni après l'envoi. */}
          {etape > 0 && etape < ETAPE_MERCI && (
            <button
              onClick={retour}
              disabled={envoiEnCours}
              className="mt-8 inline-flex items-center gap-2 text-white/35 hover:text-white/70 text-sm transition-colors min-h-[24px] disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              Question précédente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Le CSS vit ici plutôt qu'en classes Tailwind : les états de choix demandent
 * des ombres et des dégradés composés que les valeurs arbitraires rendent
 * illisibles, et l'entrée en cascade a besoin d'un délai calculé par index.
 */
const CSS = `
.fn-carte{
  position:relative;
  background:linear-gradient(160deg, rgba(16,32,62,.92) 0%, rgba(8,17,36,.96) 55%, rgba(6,12,26,.98) 100%);
  box-shadow:
    0 0 0 1px rgba(0,210,255,.14),
    0 40px 110px rgba(0,0,0,.7),
    inset 0 1px 0 rgba(255,255,255,.06);
}

.fn-jauge{
  background:linear-gradient(90deg, #0077b6, #00d2ff);
  box-shadow:0 0 14px rgba(0,210,255,.6);
  transition:width .45s cubic-bezier(.2,.8,.25,1);
}

/* L'entrée n'anime que y : jamais opacity. Un contenu à opacity 0 reste
   invisible si le JavaScript tarde ou échoue. */
.fn-entree{ animation:fn-monte .42s cubic-bezier(.2,.8,.25,1) both; }
@keyframes fn-monte{ from{ transform:translateY(14px); } to{ transform:translateY(0); } }

.fn-choix{
  position:relative;
  background:rgba(255,255,255,.035);
  border:1px solid rgba(255,255,255,.09);
  transition:border-color .2s ease, background .2s ease, transform .2s cubic-bezier(.2,.8,.25,1);
  animation:fn-monte .38s cubic-bezier(.2,.8,.25,1) both;
  animation-delay:calc(var(--rang, 0) * 45ms);
  cursor:pointer;
}
.fn-choix:hover{
  background:rgba(0,210,255,.07);
  border-color:rgba(0,210,255,.4);
  transform:translateX(4px);
}
.fn-choix:focus-visible{
  outline:2px solid #00d2ff;
  outline-offset:2px;
}
.fn-choix-actif{
  background:rgba(0,210,255,.11);
  border-color:rgba(0,210,255,.7);
}

/* La pastille se remplit au choix. Elle reste visible mais creuse au repos :
   un choix qui n'a pas d'emplacement visible se cherche du regard. */
.fn-puce{
  width:22px; height:22px;
  border-radius:999px;
  border:2px solid rgba(255,255,255,.22);
  display:flex; align-items:center; justify-content:center;
  color:transparent;
  transition:background .2s ease, border-color .2s ease, color .2s ease;
}
.fn-choix:hover .fn-puce{ border-color:rgba(0,210,255,.55); }
.fn-choix-actif .fn-puce{
  background:#00d2ff;
  border-color:#00d2ff;
  color:#050a15;
}

.fn-champ{
  background:rgba(0,0,0,.35);
  border:1px solid rgba(255,255,255,.1);
  transition:border-color .2s ease, box-shadow .2s ease;
}
.fn-champ::placeholder{ color:rgba(255,255,255,.28); }
.fn-champ:focus{
  outline:none;
  border-color:rgba(0,210,255,.65);
  box-shadow:0 0 0 3px rgba(0,210,255,.14);
}

.fn-cta{
  box-shadow:0 10px 30px rgba(0,0,0,.4), 0 0 26px rgba(0,210,255,.35);
  transition:box-shadow .3s ease, transform .25s cubic-bezier(.2,.8,.25,1), filter .2s ease;
}
.fn-cta:hover:not(:disabled){
  transform:translateY(-2px);
  filter:brightness(1.08);
  box-shadow:0 14px 38px rgba(0,0,0,.45), 0 0 46px rgba(0,210,255,.5);
}

.fn-sceau{
  width:88px; height:88px;
  border-radius:999px;
  display:flex; align-items:center; justify-content:center;
  color:#00d2ff;
  background:radial-gradient(circle at 50% 40%, rgba(0,210,255,.22), rgba(0,210,255,.05));
  box-shadow:0 0 0 1px rgba(0,210,255,.3), 0 0 60px rgba(0,210,255,.22);
  animation:fn-sceau-entre .6s cubic-bezier(.2,1.2,.3,1) both;
}
@keyframes fn-sceau-entre{ from{ transform:scale(.6); } to{ transform:scale(1); } }

@media (prefers-reduced-motion: reduce){
  .fn-entree, .fn-choix, .fn-sceau{ animation:none; }
  .fn-choix:hover, .fn-cta:hover:not(:disabled){ transform:none; }
  .fn-jauge{ transition:none; }
}
`;
