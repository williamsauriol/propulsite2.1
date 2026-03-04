import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { SERVICES } from '../constants/services';
import { ArrowRight } from 'lucide-react';

export default function Services() {
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
            <Link key={s.slug} to={`/services/${s.slug}`} className="group">
              <LiquidGlassCard delay={i * 0.05} className="h-full transition-all duration-500 transform group-hover:-translate-y-6 group-hover:scale-[1.03] group-hover:shadow-[0_20px_50px_rgba(0,210,255,0.4)] group-hover:border-accent-blue bg-gradient-to-br hover:from-accent-blue/10 hover:to-transparent">
                <div className="text-accent-blue mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent-blue transition-colors uppercase">{s.title}</h3>
                <p className="text-white/60 leading-relaxed mb-8">{s.shortDesc}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-accent-blue uppercase tracking-widest">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </div>
              </LiquidGlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
