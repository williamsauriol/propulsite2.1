import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Search } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta(
    'Page introuvable – Propulsite',
    "La page que vous cherchez n'existe pas. Retournez à l'accueil ou explorez nos services de marketing pour entrepreneurs en construction."
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <div className="text-center max-w-2xl">

        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-[10rem] md:text-[14rem] font-black leading-none text-white/5 select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="-mt-16 md:-mt-24 relative z-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs font-bold tracking-[2.5px] uppercase mb-6">
            Page introuvable
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            OUPS, MAUVAISE <span className="text-accent-blue italic">TRAJECTOIRE</span>
          </h2>

          <p className="text-white/60 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Cette page n'existe pas ou a été déplacée. Pas de panique — on vous remet sur orbite.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-blue rounded-full text-[#050a15] font-black uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,210,255,0.5)] hover:-translate-y-1 transform"
            >
              <Home className="w-5 h-5" /> Retour à l'accueil
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 transform"
            >
              <Search className="w-5 h-5" /> Nos services
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
