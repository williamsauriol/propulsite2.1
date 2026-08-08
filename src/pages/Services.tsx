import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { SERVICES } from '../constants/services';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Services() {
  usePageMeta(
    'Services marketing construction — plus de contrats | Propulsite',
    'Site web, Google, GEO, pub, réseaux sociaux, chatbot : nos services pour aider les entrepreneurs en construction du Québec à décrocher plus de contrats.'
  );
  return (
    <div className="pt-32 pb-24 px-6 relative z-10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 italic text-3d uppercase">NOS SERVICES</h1>
          <p className="text-xl text-white/60">
            Une expertise multidimensionnelle pour propulser chaque aspect de votre présence en ligne, spécialisée pour les entrepreneurs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => (
            <Link 
              key={s.slug} 
              to={`/services/${s.slug}`} 
              className="group"
              style={{
                '--service-color': s.color,
                '--service-bg': `${s.color}1A`,
                '--service-border': `${s.color}33`,
                '--service-shadow': `${s.color}66`,
              } as React.CSSProperties}
            >
              <LiquidGlassCard delay={i * 0.05} className="h-full transition-all duration-500 transform group-hover:-translate-y-6 group-hover:scale-[1.03] group-hover:shadow-[0_20px_50px_var(--service-shadow)] group-hover:border-[color:var(--service-color)] bg-gradient-to-br hover:bg-[linear-gradient(to_bottom_right,var(--service-bg),transparent)]">
                <div className="text-[color:var(--service-color)] mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[color:var(--service-color)] transition-colors uppercase">{s.title}</h3>
                <p className="text-white/60 leading-relaxed mb-8">{s.shortDesc}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-[color:var(--service-color)] uppercase tracking-widest">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </div>
              </LiquidGlassCard>
            </Link>
          ))}
        </div>

        {/* CTA — Undecided visitors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 rounded-3xl p-10 md:p-16 text-center overflow-hidden shadow-[0_0_60px_rgba(0,210,255,0.1)]"
        >
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs font-bold tracking-[2.5px] uppercase mb-6">
              Pas sûr par où commencer ?
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Trouvons ensemble le<br />
              <span className="text-accent-blue italic">service parfait pour vous</span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Vous ne savez pas quel service correspond le mieux à vos besoins ? Répondez à quelques questions et on vous propose une stratégie sur mesure — gratuitement, sans engagement.
            </p>
            <Link
              to="/funnel"
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent-blue rounded-[50px] text-[#050a15] font-black text-lg uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.5)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:-translate-y-1 transform"
            >
              <img src="/images/logo-fuser-sans-backk.png" alt="" width={450} height={450} className="h-6 w-auto object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" /> OBTENIR MA SOUMISSION
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
