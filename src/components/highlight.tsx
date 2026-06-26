import React from 'react';

/**
 * highlight — Met en valeur les mots importants d'un texte.
 *
 * Tout ce qui est entouré de **double astérisques** dans la chaîne devient un
 * mot « brillant » (blanc vif + gras) qui saute aux yeux quand on survole le
 * texte. Permet au visiteur de saisir l'essentiel d'un coup d'œil, sans tout
 * lire. Les chaînes sans astérisques s'affichent normalement.
 */
export function highlight(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
