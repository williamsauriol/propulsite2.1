import React, { useEffect, useRef } from 'react';

/**
 * CarteRelief — une enveloppe qui donne du relief à ce qu'on met dedans.
 *
 * POURQUOI UN COMPOSANT ET PAS DU CSS COPIÉ
 *
 * L'effet demande une boucle qui suit le pointeur, un lissage, et quatre
 * variables CSS. Recopier ça dans chaque section, c'est quatre endroits à
 * corriger le jour où l'amplitude est mauvaise. Ici on enveloppe le contenu
 * existant : il n'a rien à savoir, et sa mise en page ne change pas d'un pixel.
 *
 * CE QUE ÇA FAIT
 *
 * La carte s'incline vers le curseur — la tête qui se penche pour mieux voir,
 * pas l'objet qui pivote. Une lueur suit le pointeur sur la surface, comme une
 * lampe qu'on promène : c'est elle qui fait qu'on lit un panneau sous une
 * lumière plutôt qu'une image inclinée. Et la carte se rapproche de quelques
 * pixels, ce qui la détache du fond.
 *
 * MÊME VOCABULAIRE QUE LA SECTION « POURQUOI NOUS CHOISISSENT »
 *
 * Huit degrés d'amplitude, même lissage, même façon de bouger le point de vue.
 * Deux effets 3D différents sur une même page se lisent comme deux sites collés.
 *
 * TROIS RÈGLES QU'ON NE CONTOURNE PAS
 *
 * 1. Aucun re-rendu React par trame. La boucle écrit des variables CSS sur un
 *    seul élément ; le compositeur fait le reste. Elle s'arrête d'elle-même dès
 *    que la carte a rejoint sa cible.
 * 2. Rien au premier rendu. Tout accès au DOM vit dans un useEffect, donc le
 *    pré-rendu de scripts/prerender.ts passe et le HTML sort identique.
 * 3. Aucune opacity animée. Le contenu doit rester lisible pour un robot qui
 *    rend le CSS sans exécuter le JavaScript.
 *
 * Sur téléphone et si prefers-reduced-motion est actif, la boucle n'est même
 * pas installée : la carte reste plate et rien ne tourne en arrière-plan.
 */

const CSS = `
.relief{
  --rx:0; --ry:0; --mx:50; --my:50; --lift:0;
  perspective:1100px;
}
.relief-objet{
  transform:
    rotateX(calc(var(--ry) * -8deg))
    rotateY(calc(var(--rx) * 8deg))
    translateZ(calc(var(--lift) * 26px));
  transform-style:preserve-3d;
  transition:box-shadow .4s ease;
  will-change:transform;
}
/* La lueur qui suit le pointeur. Posée par-dessus le contenu mais inerte :
   c'est de la lumière, elle ne doit intercepter aucun clic. */
.relief-objet::after{
  content:'';
  position:absolute; inset:0;
  border-radius:inherit;
  background:radial-gradient(
    380px circle at calc(var(--mx) * 1%) calc(var(--my) * 1%),
    rgba(255,255,255,.11) 0%,
    rgba(0,210,255,.05) 34%,
    transparent 68%
  );
  opacity:var(--lift);
  transition:opacity .35s ease;
  pointer-events:none;
  z-index:2;
}
/* L'ombre portée ne se contente pas de grossir : elle glisse à l'inverse de
   l'inclinaison. Une ombre qui reste centrée pendant que l'objet penche trahit
   la surface plate. */
.relief-objet{
  box-shadow:0 18px 44px rgba(0,0,0,.42);
}
.relief:hover .relief-objet{
  box-shadow:
    calc(var(--rx) * -22px) calc(30px + var(--ry) * 14px) 70px rgba(0,0,0,.6),
    0 0 60px rgba(0,210,255,.09);
}

@media (prefers-reduced-motion: reduce){
  .relief-objet{ transform:none; transition:none; }
  .relief-objet::after{ display:none; }
}
`;

/** Au-delà d'une dizaine de degrés on ne suggère plus la profondeur, on donne
 *  le vertige. Huit est la valeur retenue pour la pile de cartes ; on s'y tient. */
const LISSAGE = 7.5;

interface Props {
  children: React.ReactNode;
  /** Classe posée sur l'enveloppe (mise en page : largeur, marges, grille). */
  className?: string;
  /** Classe posée sur l'objet qui s'incline (apparence : fond, bordure, coins). */
  classeObjet?: string;
}

export default function CarteRelief({ children, className = '', classeObjet = '' }: Props) {
  const enveloppe = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = enveloppe.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let viseX = 0, viseY = 0, viseL = 0;
    let x = 0, y = 0, l = 0;
    let boucle = 0, t0 = 0, vivant = false;

    const suivre = (t: number) => {
      const dt = t0 ? Math.min((t - t0) / 1000, 0.1) : 0.016;
      t0 = t;
      const k = 1 - Math.exp(-LISSAGE * dt);
      x += (viseX - x) * k;
      y += (viseY - y) * k;
      l += (viseL - l) * k;
      el.style.setProperty('--rx', x.toFixed(4));
      el.style.setProperty('--ry', y.toFixed(4));
      el.style.setProperty('--lift', l.toFixed(4));
      const reste = Math.abs(viseX - x) + Math.abs(viseY - y) + Math.abs(viseL - l);
      if (reste > 0.0015) {
        boucle = requestAnimationFrame(suivre);
      } else {
        vivant = false;
        t0 = 0;
      }
    };

    const relancer = () => {
      if (vivant) return;
      vivant = true;
      t0 = 0;
      boucle = requestAnimationFrame(suivre);
    };

    /* Le rectangle est mis en cache. Le lire dans le gestionnaire forcerait un
       recalcul de mise en page à chaque trame : la boucle écrit des variables
       en fin de trame, ce qui invalide la mise en page, et la lecture suivante
       oblige le navigateur à tout recalculer sur-le-champ. */
    let rect: DOMRect | null = null;
    const oublierRect = () => { rect = null; };

    const bouger = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      const r = rect;
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      viseX = Math.max(-1, Math.min(1, (px - 0.5) * 2));
      viseY = Math.max(-1, Math.min(1, (py - 0.5) * 2));
      // La lueur se place en pourcentage : pas de lissage, elle doit coller au
      // curseur. C'est l'inclinaison qui a besoin d'inertie, pas la lumière.
      el.style.setProperty('--mx', (px * 100).toFixed(1));
      el.style.setProperty('--my', (py * 100).toFixed(1));
      relancer();
    };

    const entrer = () => { viseL = 1; relancer(); };
    const sortir = () => { viseX = 0; viseY = 0; viseL = 0; relancer(); };

    el.addEventListener('pointermove', bouger, { passive: true });
    el.addEventListener('pointerenter', entrer);
    el.addEventListener('pointerleave', sortir);
    addEventListener('scroll', oublierRect, { passive: true });
    addEventListener('resize', oublierRect);

    return () => {
      el.removeEventListener('pointermove', bouger);
      el.removeEventListener('pointerenter', entrer);
      el.removeEventListener('pointerleave', sortir);
      removeEventListener('scroll', oublierRect);
      removeEventListener('resize', oublierRect);
      cancelAnimationFrame(boucle);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={enveloppe} className={`relief ${className}`}>
        <div className={`relief-objet relative ${classeObjet}`}>{children}</div>
      </div>
    </>
  );
}
