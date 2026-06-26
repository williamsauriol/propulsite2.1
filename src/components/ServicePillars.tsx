import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { X, Plus, ArrowRight } from 'lucide-react';
import type { ServicePillar } from '../constants/services';

/**
 * ServicePillars — Rangée de cartes cliquables qui ouvrent un pop-up détaillé.
 *
 * Affiche les « piliers » d'un service (ex. SEO, GEO, Local Services Ads) sous
 * forme de cartes épurées. Au clic, un pop-up (modal) révèle l'explication
 * complète : la page reste légère, le texte détaillé n'apparaît que pour le
 * visiteur intéressé.
 */
export default function ServicePillars({ pillars }: { pillars: ServicePillar[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const active = open !== null ? pillars[open] : null;

  // Bloque le scroll de fond + ferme avec Échap quand le pop-up est ouvert.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="mt-32">
      <h2 className="text-4xl font-black mb-4 text-3d uppercase italic">Les 3 leviers</h2>
      <p className="text-white/50 mb-12 max-w-2xl">
        La Domination Google, c'est la combinaison de trois forces. Cliquez sur chacune pour voir comment elle vous rend visible.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((p, i) => (
          <motion.button
            key={p.title}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group text-left relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
            style={{ boxShadow: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${p.color}88`; e.currentTarget.style.boxShadow = `0 20px 50px ${p.color}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border"
              style={{ color: p.color, backgroundColor: `${p.color}1A`, borderColor: `${p.color}55` }}
            >
              {p.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase leading-tight">{p.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed mb-6">{p.tagline}</p>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all group-hover:gap-3"
              style={{ color: p.color }}
            >
              En savoir plus <Plus className="w-4 h-4" />
            </span>
          </motion.button>
        ))}
      </div>

      {/* Pop-up */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-lg rounded-3xl bg-[#0a1628] p-8 md:p-10 border"
              style={{ borderColor: `${active.color}66`, boxShadow: `0 30px 80px ${active.color}33` }}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Fermer"
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border"
                style={{ color: active.color, backgroundColor: `${active.color}1A`, borderColor: `${active.color}55` }}
              >
                {active.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase italic leading-tight">{active.title}</h3>
              <p className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: active.color }}>{active.tagline}</p>

              <div className="space-y-4 mb-8">
                {active.paragraphs.map((para, idx) => (
                  <p key={idx} className="text-white/75 leading-relaxed">{para}</p>
                ))}
              </div>

              <Link
                to="/contact"
                onClick={() => setOpen(null)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-black uppercase tracking-widest text-sm text-[#050a15] transition-all hover:brightness-110 transform hover:-translate-y-0.5"
                style={{ backgroundColor: active.color }}
              >
                Demander une soumission <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
