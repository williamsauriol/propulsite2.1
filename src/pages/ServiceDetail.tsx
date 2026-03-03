import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SERVICES } from '../constants/services';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  return (
    <div className="pt-32 pb-24 px-6 relative z-10">
      <div className="container mx-auto">
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 text-accent-blue mb-8 hover:gap-4 transition-all font-bold uppercase tracking-widest text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Retour aux services
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-8 text-accent-blue border border-accent-blue/20">
              {service.icon}
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 text-3d uppercase italic">
              {service.title}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              {service.fullDesc}
            </p>
            <Link 
              to="/contact" 
              className="inline-block px-10 py-5 bubble-glass text-white font-black hover:text-accent-blue"
            >
              DEMANDER UNE SOUMISSION
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <LiquidGlassCard className="h-full">
              <h2 className="text-2xl font-bold mb-8 text-accent-blue uppercase tracking-widest">Ce que nous incluons</h2>
              <ul className="space-y-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <CheckCircle2 className="w-6 h-6 text-accent-blue mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-lg text-white/80 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </LiquidGlassCard>
          </motion.div>
        </div>

        {/* Other Services Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-black mb-12 text-3d uppercase italic">Autres Expertises</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherServices.map((s, i) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="group">
                <LiquidGlassCard className="h-full group-hover:border-accent-blue/50 transition-all">
                  <div className="text-accent-blue mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-accent-blue transition-colors uppercase">{s.title}</h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-2">{s.shortDesc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-accent-blue uppercase tracking-widest">
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </div>
                </LiquidGlassCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
