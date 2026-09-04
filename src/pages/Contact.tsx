import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, Star, ArrowRight, Clock, Sparkles,
} from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Contact — parler à quelqu'un, vite.
 *
 * CE QUI A CHANGÉ, ET POURQUOI
 *
 * 1. LE TÉLÉPHONE ET LE COURRIEL SONT CLIQUABLES, ET ILS PASSENT EN PREMIER.
 *    Ils étaient écrits en texte mort, sous le formulaire, dans la colonne de
 *    droite. Sur une page de contact, c'est le défaut le plus cher qui soit :
 *    un entrepreneur en char entre deux chantiers veut appuyer sur le numéro,
 *    pas remplir cinq champs. Ils sont maintenant en haut, en gros, et ils
 *    déclenchent l'appel ou le courriel.
 *
 * 2. LE MESSAGE N'EST PLUS OBLIGATOIRE. On refusait l'envoi tant que la
 *    personne n'avait pas rédigé un texte. Quelqu'un qui veut juste être
 *    rappelé n'a rien à écrire — et il partait.
 *
 * 3. UN COURRIEL *OU* UN TÉLÉPHONE SUFFIT. Le courriel était exigé. Un
 *    entrepreneur qui préfère qu'on l'appelle devait inventer une adresse.
 *
 * 4. LE DÉLAI EST ÉCRIT. « Dans les plus brefs délais » ne veut rien dire.
 *    « Réponse en 24 h ouvrables » se vérifie, donc ça engage.
 *
 * 5. BOGUE CORRIGÉ. Après un envoi réussi, la remise à zéro du formulaire
 *    oubliait le champ `provenance` : il disparaissait de l'état, et le select
 *    devenait non contrôlé au message suivant. TypeScript ne l'a pas vu — le
 *    projet n'a pas @types/react et esbuild ne type-vérifie pas.
 *
 * 6. UNE SORTIE VERS L'ANALYSE GRATUITE. Quelqu'un qui arrive ici sans savoir
 *    quoi écrire a maintenant un parcours guidé de six questions à sa portée.
 */

type Formulaire = {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  provenance: string;
  message: string;
};

const VIDE: Formulaire = {
  nom: '', email: '', telephone: '', sujet: 'Analyse gratuite', provenance: '', message: '',
};

/** Les sujets correspondent aux services réels, pas à des catégories vagues. */
const SUJETS = [
  'Analyse gratuite',
  'Refaire ou créer mon site',
  'Être trouvé sur Google',
  'Publicité Google ou Facebook',
  'Être cité par ChatGPT et les IA',
  'Autre chose',
];

const PROVENANCES = [
  'Recherche Google',
  'ChatGPT ou une autre IA',
  'Instagram ou Facebook',
  'Bouche-à-oreille',
  'On s’est déjà parlé',
  'Autre',
];

export default function Contact() {
  usePageMeta(
    'Nous joindre – Propulsite | Réponse en 24 h ouvrables',
    'Appelez au (514) 649-6862, écrivez-nous, ou laissez vos coordonnées. Réponse en 24 h ouvrables par William Sauriol, pas par un robot.',
  );

  const [form, setForm] = useState<Formulaire>(VIDE);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState('');

  const modifier = (champ: keyof Formulaire, valeur: string) =>
    setForm((f) => ({ ...f, [champ]: valeur }));

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim()) {
      setErreur('Il me faut votre nom.');
      return;
    }
    if (!form.email.trim() && !form.telephone.trim()) {
      setErreur('Laissez un courriel ou un téléphone, sinon je ne peux pas vous répondre.');
      return;
    }
    setErreur('');
    setEnvoiEnCours(true);
    try {
      const reponse = await fetch('https://formsubmit.co/ajax/propulsiteprojet@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Contact — ${form.nom} (${form.sujet})`,
          Nom: form.nom,
          Courriel: form.email || 'N/A',
          Téléphone: form.telephone || 'N/A',
          Sujet: form.sujet,
          'Nous a trouvés par': form.provenance || 'Non répondu',
          Message: form.message || 'Aucun',
        }),
      });
      if (!reponse.ok) {
        setErreur("L'envoi a échoué. Réessayez, ou appelez au (514) 649-6862.");
        return;
      }
      setEnvoye(true);
      // La remise à zéro repart de VIDE : lister les champs à la main, c'est
      // ce qui avait fait disparaître `provenance` de l'état.
      setForm(VIDE);
    } catch {
      setErreur("Impossible de joindre le serveur. Appelez au (514) 649-6862 ou écrivez à propulsiteprojet@gmail.com.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-5 md:px-6 relative z-10">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="max-w-5xl mx-auto">
        {/* ── En-tête ────────────────────────────────────────────────── */}
        <div className="max-w-2xl mb-12 md:mb-14">
          <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-accent-blue mb-5">
            Nous joindre
          </p>
          <h1 className="text-[38px] md:text-6xl font-black text-white leading-[0.98] tracking-tight mb-5">
            Parlons de votre <span className="text-accent-blue">prochain contrat</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Le plus rapide, c’est le téléphone. Sinon, laissez-moi vos coordonnées
            et je vous reviens en 24 h ouvrables. C’est William qui répond, pas un
            robot.
          </p>
        </div>

        {/* ── Les deux moyens directs, en premier ────────────────────────
            Ils étaient en texte mort sous le formulaire. Un entrepreneur entre
            deux chantiers veut appuyer sur le numéro, pas remplir cinq champs. */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <a href="tel:5146496862" className="ct-direct group">
            <span className="ct-icone"><Phone className="w-5 h-5" /></span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1.5">
                Appelez, c’est le plus vite
              </span>
              <span className="block text-white font-black text-xl md:text-2xl tracking-tight">
                (514) 649-6862
              </span>
              <span className="block text-white/40 text-[12.5px] mt-1.5">
                Lundi au vendredi, 8 h à 18 h
              </span>
            </span>
          </a>

          <a href="mailto:propulsiteprojet@gmail.com" className="ct-direct group">
            <span className="ct-icone"><Mail className="w-5 h-5" /></span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1.5">
                Ou écrivez-moi
              </span>
              <span className="block text-white font-bold text-[15px] md:text-base break-all">
                propulsiteprojet@gmail.com
              </span>
              <span className="block text-white/40 text-[12.5px] mt-1.5">
                Réponse en 24 h ouvrables
              </span>
            </span>
          </a>
        </div>

        {/* ── Le raccourci vers le parcours guidé ────────────────────────
            Pour qui arrive ici sans savoir quoi écrire : six questions valent
            mieux qu'un champ vide devant lequel on abandonne. */}
        <Link to="/funnel" className="ct-guide group mb-12 md:mb-14">
          <span className="ct-icone"><Sparkles className="w-5 h-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-white font-bold text-[15px] md:text-base mb-1">
              Vous ne savez pas trop quoi demander ?
            </span>
            <span className="block text-white/55 text-[13.5px] leading-relaxed">
              Six questions, moins de deux minutes, et je regarde votre fiche
              Google, votre site et vos concurrents directs.
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-accent-blue text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all group-hover:gap-3">
            Commencer <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* ── Le formulaire ───────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="ct-carte rounded-[26px] p-6 md:p-9">
              {envoye ? (
                <div className="text-center py-8">
                  <div className="ct-sceau mx-auto mb-7">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                    C’est parti.
                  </h2>
                  <p className="text-white/60 leading-relaxed max-w-sm mx-auto mb-3">
                    Votre message est arrivé. Je vous reviens d’ici
                    {' '}<strong className="text-white">24 h ouvrables</strong>.
                  </p>
                  <p className="text-white/40 text-sm mb-8">
                    Si c’est urgent :{' '}
                    <a href="tel:5146496862" className="text-accent-blue hover:underline">
                      (514) 649-6862
                    </a>
                  </p>
                  <button
                    type="button"
                    onClick={() => setEnvoye(false)}
                    className="px-8 py-3 border border-white/15 hover:border-accent-blue/50 text-white/80 hover:text-white rounded-full font-bold text-sm transition-colors min-h-[48px]"
                  >
                    Écrire un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={soumettre} className="grid gap-4">
                  <div>
                    <label htmlFor="ct-nom" className="ct-etiquette">Votre nom *</label>
                    <input
                      id="ct-nom" name="nom" type="text" autoComplete="name"
                      value={form.nom}
                      onChange={(e) => modifier('nom', e.target.value)}
                      placeholder="Jean Tremblay"
                      className="ct-champ"
                    />
                  </div>

                  {/* Un courriel OU un téléphone suffit. Exiger le courriel
                      forçait ceux qui préfèrent être appelés à en inventer un. */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ct-email" className="ct-etiquette">Courriel</label>
                      <input
                        id="ct-email" name="email" type="email" inputMode="email" autoComplete="email"
                        value={form.email}
                        onChange={(e) => modifier('email', e.target.value)}
                        placeholder="jean@entreprise.ca"
                        className="ct-champ"
                      />
                    </div>
                    <div>
                      <label htmlFor="ct-tel" className="ct-etiquette">Téléphone</label>
                      <input
                        id="ct-tel" name="telephone" type="tel" inputMode="tel" autoComplete="tel"
                        value={form.telephone}
                        onChange={(e) => modifier('telephone', e.target.value)}
                        placeholder="(514) 555-1234"
                        className="ct-champ"
                      />
                    </div>
                  </div>
                  <p className="text-white/35 text-[12.5px] -mt-1">
                    L’un des deux suffit. Dites-moi lequel vous préférez.
                  </p>

                  <div>
                    <label htmlFor="ct-sujet" className="ct-etiquette">C’est à propos de quoi ?</label>
                    <select
                      id="ct-sujet" name="sujet"
                      value={form.sujet}
                      onChange={(e) => modifier('sujet', e.target.value)}
                      className="ct-champ ct-select"
                    >
                      {SUJETS.map((s) => (
                        <option key={s} value={s} className="bg-[#0a1628]">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ct-message" className="ct-etiquette">
                      Votre message <span className="text-white/30 normal-case tracking-normal font-medium">(facultatif)</span>
                    </label>
                    <textarea
                      id="ct-message" name="message" rows={4}
                      value={form.message}
                      onChange={(e) => modifier('message', e.target.value)}
                      placeholder="Votre métier, votre secteur, ce que vous cherchez… ou rien du tout, on en parlera."
                      className="ct-champ resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="ct-provenance" className="ct-etiquette">
                      Comment m’avez-vous trouvé ?
                    </label>
                    <select
                      id="ct-provenance" name="provenance"
                      value={form.provenance}
                      onChange={(e) => modifier('provenance', e.target.value)}
                      className="ct-champ ct-select"
                    >
                      <option value="" className="bg-[#0a1628]">Préfère ne pas le dire</option>
                      {PROVENANCES.map((p) => (
                        <option key={p} value={p} className="bg-[#0a1628]">{p}</option>
                      ))}
                    </select>
                  </div>

                  {erreur && (
                    <p className="text-[#ff8b8b] text-sm font-medium" role="alert">{erreur}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-1">
                    <span className="inline-flex items-center gap-2 text-white/45 text-[12.5px]">
                      <Clock className="w-4 h-4 text-accent-blue" />
                      Réponse en 24 h ouvrables
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={envoiEnCours}
                    className="ct-cta mt-2 w-full inline-flex items-center justify-center gap-3 bg-accent-blue text-[#050a15] font-black text-base uppercase tracking-wide px-8 py-5 rounded-full min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {envoiEnCours ? (
                      <>
                        <span className="w-5 h-5 border-2 border-[#050a15] border-t-transparent rounded-full animate-spin" />
                        Envoi…
                      </>
                    ) : (
                      <>Envoyer <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── La colonne de droite ────────────────────────────────── */}
          <div className="lg:col-span-2 grid gap-4 content-start">
            <div className="ct-carte rounded-[22px] p-6">
              <span className="ct-icone mb-4"><MapPin className="w-5 h-5" /></span>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-2">
                Où on est
              </p>
              <p className="text-white font-bold mb-1">Saint-Eustache, Québec</p>
              <p className="text-white/50 text-[13.5px] leading-relaxed mb-4">
                On dessert la Rive-Nord et le Grand Montréal, et on travaille à
                distance partout au Québec.
              </p>
              <Link
                to="/secteurs/rive-nord-saint-eustache"
                className="inline-flex items-center gap-1.5 text-accent-blue text-[11px] font-bold uppercase tracking-widest hover:gap-3 transition-all min-h-[24px]"
              >
                Les villes couvertes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Les avis : c'est ici que quelqu'un pense déjà à nous. Le volume
                d'avis est un des premiers signaux que les moteurs de réponse
                lisent pour décider qui recommander. */}
            <a
              href="https://www.google.com/maps?cid=6519031247085477855"
              target="_blank"
              rel="noreferrer"
              className="ct-carte ct-avis group rounded-[22px] p-6 block"
            >
              <span className="ct-icone mb-4"><Star className="w-5 h-5" /></span>
              <span className="block text-white font-bold text-[15px] mb-2">
                Déjà travaillé avec nous ?
              </span>
              <span className="block text-white/55 text-[13.5px] leading-relaxed mb-4">
                Un avis sur notre fiche Google prend trente secondes et nous aide
                plus que n’importe quelle publicité.
              </span>
              <span className="inline-flex items-center gap-1.5 text-accent-blue text-[11px] font-bold uppercase tracking-widest transition-all group-hover:gap-3">
                Laisser un avis <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.ct-carte{
  background:linear-gradient(160deg, rgba(16,32,62,.7) 0%, rgba(8,17,36,.85) 55%, rgba(6,12,26,.9) 100%);
  box-shadow:
    0 0 0 1px rgba(255,255,255,.07),
    0 24px 60px rgba(0,0,0,.45);
}

/* Les deux moyens directs. Ils se soulèvent au survol : c'est ce qui dit
   « ceci est un bouton », pas un bloc de texte. */
.ct-direct{
  display:flex; align-items:flex-start; gap:16px;
  padding:22px;
  border-radius:22px;
  min-height:48px;
  background:linear-gradient(150deg, rgba(0,210,255,.09) 0%, rgba(8,17,36,.85) 60%);
  box-shadow:0 0 0 1px rgba(0,210,255,.22), 0 18px 44px rgba(0,0,0,.4);
  transition:transform .25s cubic-bezier(.2,.8,.25,1), box-shadow .3s ease;
}
.ct-direct:hover{
  transform:translateY(-3px);
  box-shadow:0 0 0 1px rgba(0,210,255,.5), 0 24px 60px rgba(0,0,0,.5), 0 0 50px rgba(0,210,255,.14);
}

.ct-guide{
  display:flex; align-items:center; gap:16px;
  padding:18px 22px;
  border-radius:20px;
  min-height:48px;
  background:rgba(255,255,255,.025);
  box-shadow:0 0 0 1px rgba(255,255,255,.08);
  transition:box-shadow .3s ease, background .3s ease;
}
.ct-guide:hover{
  background:rgba(0,210,255,.05);
  box-shadow:0 0 0 1px rgba(0,210,255,.35);
}
@media (max-width: 639px){
  .ct-guide{ flex-direction:column; align-items:flex-start; gap:12px; }
}

.ct-icone{
  flex:none;
  width:42px; height:42px;
  border-radius:13px;
  display:flex; align-items:center; justify-content:center;
  color:#00d2ff;
  background:rgba(0,210,255,.12);
  box-shadow:inset 0 0 0 1px rgba(0,210,255,.28);
}

.ct-etiquette{
  display:block;
  font-size:11px; font-weight:700;
  text-transform:uppercase; letter-spacing:.16em;
  color:rgba(255,255,255,.45);
  margin-bottom:8px;
}

.ct-champ{
  width:100%;
  background:rgba(0,0,0,.32);
  border:1px solid rgba(255,255,255,.1);
  border-radius:14px;
  padding:14px 18px;
  color:#fff;
  transition:border-color .2s ease, box-shadow .2s ease;
}
.ct-champ::placeholder{ color:rgba(255,255,255,.26); }
.ct-champ:focus{
  outline:none;
  border-color:rgba(0,210,255,.65);
  box-shadow:0 0 0 3px rgba(0,210,255,.13);
}
/* La flèche du select est dessinée en fond : le chevron natif est gris clair
   sur fond sombre dans plusieurs navigateurs, donc invisible. */
.ct-select{
  appearance:none;
  cursor:pointer;
  padding-right:44px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9' fill='none'%3E%3Cpath d='M1 1L7 7L13 1' stroke='%2300d2ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 18px center;
}

.ct-cta{
  box-shadow:0 10px 30px rgba(0,0,0,.4), 0 0 26px rgba(0,210,255,.32);
  transition:box-shadow .3s ease, transform .25s cubic-bezier(.2,.8,.25,1), filter .2s ease;
}
.ct-cta:hover:not(:disabled){
  transform:translateY(-2px);
  filter:brightness(1.08);
  box-shadow:0 14px 38px rgba(0,0,0,.45), 0 0 46px rgba(0,210,255,.48);
}

.ct-avis{ transition:box-shadow .3s ease, transform .25s cubic-bezier(.2,.8,.25,1); }
.ct-avis:hover{
  transform:translateY(-3px);
  box-shadow:0 0 0 1px rgba(0,210,255,.4), 0 24px 60px rgba(0,0,0,.5);
}

.ct-sceau{
  width:80px; height:80px;
  border-radius:999px;
  display:flex; align-items:center; justify-content:center;
  color:#00d2ff;
  background:radial-gradient(circle at 50% 40%, rgba(0,210,255,.22), rgba(0,210,255,.05));
  box-shadow:0 0 0 1px rgba(0,210,255,.3), 0 0 55px rgba(0,210,255,.2);
}

@media (prefers-reduced-motion: reduce){
  .ct-direct:hover, .ct-avis:hover, .ct-cta:hover:not(:disabled){ transform:none; }
}
`;
