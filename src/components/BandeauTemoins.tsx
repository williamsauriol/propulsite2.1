import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

declare function gtag(...args: unknown[]): void;

const CLE = 'propulsite-temoins';

/**
 * Bandeau de consentement aux témoins.
 *
 * La Loi 25 interdit de déposer un témoin de mesure d'audience avant d'avoir
 * obtenu un consentement libre et éclairé. Google Analytics part donc en mode
 * « denied » (voir index.html) et n'est activé que si le visiteur accepte ici.
 *
 * Refuser doit être aussi facile qu'accepter : les deux boutons ont le même
 * poids visuel et la même taille de cible.
 */
export default function BandeauTemoins() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // On n'affiche le bandeau que si aucun choix n'a encore été fait.
        try {
            if (!localStorage.getItem(CLE)) setVisible(true);
        } catch {
            // Navigateur qui bloque le stockage : on demande à chaque visite.
            setVisible(true);
        }
    }, []);

    const repondre = (accepte: boolean) => {
        try {
            localStorage.setItem(CLE, accepte ? 'accepte' : 'refuse');
        } catch {
            // Tant pis pour la mémoire, le choix s'applique quand même.
        }
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                analytics_storage: accepte ? 'granted' : 'denied',
            });
        }
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 120 }}
                    animate={{ y: 0 }}
                    exit={{ y: 120 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    role="dialog"
                    aria-label="Consentement aux témoins"
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
                >
                    <div className="container mx-auto max-w-4xl bg-[#0a1628] border border-white/15 rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] p-6 sm:p-7">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
                            <div className="flex-1">
                                <h2 className="text-white font-bold text-lg mb-2">Des témoins pour compter les visites</h2>
                                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                                    On aimerait savoir quelles pages vous servent, avec Google Analytics. Ça nous aide à améliorer le site. Vous pouvez refuser : le site marche pareil.{' '}
                                    <Link to="/legal#confidentialite" className="text-accent-blue hover:underline">
                                        Notre politique
                                    </Link>
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                                <button
                                    onClick={() => repondre(false)}
                                    className="min-h-[48px] px-7 py-3 rounded-full font-bold text-sm tracking-wide bg-white/5 text-white border border-white/20 hover:bg-white/10 transition-colors duration-200"
                                >
                                    Refuser
                                </button>
                                <button
                                    onClick={() => repondre(true)}
                                    className="min-h-[48px] px-7 py-3 rounded-full font-bold text-sm tracking-wide bg-accent-blue text-[#050a15] hover:brightness-110 transition-all duration-200"
                                >
                                    Accepter
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
