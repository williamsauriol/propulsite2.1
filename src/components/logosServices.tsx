import React from 'react';

/**
 * Les six logos de services, dessinés à la main.
 *
 * Les cartes utilisaient jusqu'ici des pictogrammes génériques de lucide —
 * une loupe pour Google Ads, un porte-voix pour Facebook, deux bonshommes pour
 * les médias sociaux. Vus en grand dans le panneau collé à droite, ces
 * pictogrammes ne disaient rien : n'importe quel site du monde a la même loupe.
 *
 * Chacun de ceux-ci raconte le service : une fenêtre de navigateur avec sa
 * maquette dedans, un résultat de recherche marqué « Ad » avec le curseur qui
 * clique dessus, une épingle de carte au centre de son rayon, une publication
 * avec une mire dessus, un téléphone avec ses réactions qui montent, une bulle
 * de conversation avec un visage de robot.
 *
 * Tracés sur une grille de 64, en `currentColor` : la couleur vient du service
 * (services.tsx), pas du dessin. Les aplats utilisent `fill="currentColor"`
 * avec une opacité basse pour donner du volume sans alourdir le trait.
 */

const commun = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Conception de site web — un navigateur, et la maquette à l'intérieur. */
export function LogoSiteWeb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...commun} {...props}>
      <rect x="5" y="11" width="54" height="42" rx="5" />
      <path d="M5 21h54" />
      <circle cx="11.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="21.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <rect x="11" y="27" width="42" height="10" rx="2" fill="currentColor" fillOpacity="0.22" strokeWidth="1.4" />
      <rect x="11" y="42" width="18" height="6" rx="2" strokeWidth="1.4" />
      <rect x="35" y="42" width="18" height="6" rx="2" strokeWidth="1.4" />
    </svg>
  );
}

/** Google Ads — le résultat payé, en tête, et le doigt qui clique dessus. */
export function LogoGoogleAds(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...commun} {...props}>
      <rect x="5" y="7" width="54" height="14" rx="7" />
      <circle cx="14.5" cy="14" r="3.4" strokeWidth="1.5" />
      <path d="M17.2 16.7 19.6 19" strokeWidth="1.5" />
      <path d="M25 14h22" strokeWidth="1.4" opacity="0.55" />
      <rect x="5" y="27" width="54" height="15" rx="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="10" y="31.5" width="11" height="6.5" rx="2" fill="currentColor" stroke="none" />
      <path d="M25 34.7h24" strokeWidth="1.4" />
      <path d="M10 48h30" strokeWidth="1.4" opacity="0.4" />
      <path d="M10 54h20" strokeWidth="1.4" opacity="0.4" />
      {/* Le curseur, posé sur l'annonce */}
      <path d="M44 38.5v14l3.7-3.6 2.6 5.4 2.9-1.5-2.6-5.2h5.1z" fill="currentColor" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

/** Domination Google — l'épingle, et le rayon qu'elle couvre. */
export function LogoDominationGoogle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...commun} {...props}>
      <ellipse cx="32" cy="49" rx="25" ry="8.5" opacity="0.28" strokeWidth="1.4" />
      <ellipse cx="32" cy="49" rx="14" ry="4.8" opacity="0.5" strokeWidth="1.4" />
      <path
        d="M32 6c-7.7 0-14 6.2-14 13.9 0 10 14 26.1 14 26.1s14-16.1 14-26.1C46 12.2 39.7 6 32 6Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <circle cx="32" cy="19.6" r="5.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Publicité Facebook — une publication de fil, et la mire posée dessus. */
export function LogoPubliciteFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...commun} {...props}>
      <rect x="7" y="8" width="50" height="48" rx="5" />
      <circle cx="17" cy="18.5" r="4" strokeWidth="1.5" />
      <path d="M25 16.5h19" strokeWidth="1.4" />
      <path d="M25 21.5h11" strokeWidth="1.4" opacity="0.5" />
      <rect x="13" y="28" width="38" height="21" rx="3" fill="currentColor" fillOpacity="0.18" strokeWidth="1.4" />
      {/* La mire */}
      <circle cx="32" cy="38.5" r="9" strokeWidth="1.6" />
      <circle cx="32" cy="38.5" r="2.6" fill="currentColor" stroke="none" />
      <path d="M32 25.5v4M32 47.5v4M19 38.5h4M41 38.5h4" strokeWidth="1.6" />
    </svg>
  );
}

/** Médias sociaux — le téléphone, et les réactions qui montent. */
export function LogoMediasSociaux(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...commun} {...props}>
      <rect x="19" y="6" width="26" height="52" rx="5" />
      <path d="M28.5 10.5h7" strokeWidth="1.5" />
      <rect x="24" y="17" width="16" height="13" rx="2.5" fill="currentColor" fillOpacity="0.22" strokeWidth="1.4" />
      <path d="M24 35.5h16M24 41h11" strokeWidth="1.4" opacity="0.55" />
      {/* Un cœur qui remonte à gauche, une bulle à droite */}
      <path
        d="M11 22.5c0-2 1.6-3.5 3.5-3.5 1.1 0 2.1.5 2.7 1.3.6-.8 1.6-1.3 2.7-1.3 1.9 0 3.5 1.5 3.5 3.5 0 3.6-6.2 7-6.2 7s-6.2-3.4-6.2-7Z"
        fill="currentColor"
        fillOpacity="0.25"
        strokeWidth="1.5"
        transform="translate(-6 6)"
      />
      <path d="M46 40h9a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3.5L49 55.5V52h-3a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3Z" fill="currentColor" fillOpacity="0.25" strokeWidth="1.5" />
    </svg>
  );
}

/** Chatbot IA — la bulle de conversation, avec un robot dedans. */
export function LogoChatbotIa(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...commun} {...props}>
      <path d="M32 8v5" strokeWidth="1.6" />
      <circle cx="32" cy="6" r="2.6" fill="currentColor" stroke="none" />
      <path d="M13 13h38a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H26.5L15 56v-11h-2a6 6 0 0 1-6-6V19a6 6 0 0 1 6-6Z" fill="currentColor" fillOpacity="0.14" />
      <circle cx="24" cy="27" r="3" fill="currentColor" stroke="none" />
      <circle cx="40" cy="27" r="3" fill="currentColor" stroke="none" />
      <path d="M24.5 36c2 2.2 4.6 3.3 7.5 3.3s5.5-1.1 7.5-3.3" strokeWidth="1.7" />
    </svg>
  );
}

/** Le logo d'un service, par son slug. */
export const LOGOS_SERVICES: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'conception-site-web': LogoSiteWeb,
  'google-ads': LogoGoogleAds,
  'domination-google': LogoDominationGoogle,
  'publicite-facebook': LogoPubliciteFacebook,
  'gestion-medias-sociaux': LogoMediasSociaux,
  'chatbot-ia': LogoChatbotIa,
};
