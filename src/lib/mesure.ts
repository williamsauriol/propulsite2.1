/**
 * Mesure des conversions.
 *
 * Relevé du 8 septembre 2026 : le site n'envoyait qu'un seul événement à
 * Google Analytics, `page_view`. Les deux formulaires partaient chez
 * formsubmit.co sans rien déclarer, et les quatre liens téléphone non plus.
 *
 * « Qualified leads : 0 » et « Conversions : 0 » dans Analytics ne mesuraient
 * donc rien du tout — c'était garanti d'afficher zéro même avec dix demandes
 * par jour. Et une campagne Google Ads n'aurait eu aucun signal pour
 * optimiser : on aurait payé des clics à l'aveugle.
 *
 * Tout passe par ici. Une seule déclaration de `gtag`, un seul endroit où
 * corriger le jour où les noms d'événements GA4 changent.
 *
 * Après un déploiement, les deux événements doivent être cochés comme
 * « événements clés » dans Analytics (Admin → Événements). Sans ça ils
 * arrivent, mais ne comptent pas comme conversions.
 */

declare function gtag(...args: unknown[]): void;

function envoyer(nom: string, details: Record<string, unknown> = {}) {
  // Le site est pré-rendu : ce fichier s'exécute aussi côté Node, où ni
  // `window` ni `gtag` n'existent. Et le visiteur peut avoir refusé les
  // témoins, auquel cas `gtag` est là mais n'enverra rien — c'est correct.
  if (typeof window === 'undefined' || typeof gtag === 'undefined') return;
  try {
    gtag('event', nom, { ...details, page_path: window.location.pathname });
  } catch {
    // Une mesure ratée ne doit jamais casser l'envoi d'un formulaire.
  }
}

/**
 * Une demande envoyée. C'est l'événement que Google Ads doit optimiser, et le
 * seul chiffre qui dit si le site travaille.
 */
export function mesurerLead(source: 'contact' | 'funnel') {
  envoyer('generate_lead', { source });
}

/**
 * Un clic sur un numéro de téléphone. Sur un chantier, c'est le vrai geste :
 * l'entrepreneur ne remplit pas de formulaire, il appelle.
 */
export function mesurerAppel() {
  envoyer('contact_appel');
}
