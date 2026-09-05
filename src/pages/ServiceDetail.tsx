import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SERVICES, serviceTitle, serviceDescription } from '../constants/services';
import LiquidGlassCard from '../components/LiquidGlassCard';
import ServicePillars from '../components/ServicePillars';
import { highlight } from '../components/highlight';
import { LOGOS_SERVICES } from '../components/logosServices';
import { ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find((s) => s.slug === slug);

  // Meme formule que le pre-rendu : voir serviceTitle() dans constants/services.
  usePageMeta(
    service ? serviceTitle(service) : 'Service – Propulsite',
    service ? serviceDescription(service) : undefined
  );

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const otherServices = SERVICES.filter((s) => s.slug !== slug);
  const LogoService = LOGOS_SERVICES[service.slug];

  return (
    <div 
      className="pt-32 pb-24 px-6 relative z-10"
      style={{
        '--service-color': service.color,
        '--service-bg': `${service.color}1A`, // 10% opacity
        '--service-border': `${service.color}33`, // 20% opacity
        '--service-shadow': `${service.color}66`, // 40% opacity
      } as React.CSSProperties}
    >
      {/* Ambient Service Color Glow in Background */}
      <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
        <motion.div
          className="absolute top-[10%] left-[5%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full blur-[150px]"
          style={{ backgroundColor: 'var(--service-color)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ backgroundColor: 'var(--service-color)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.02, 0.06, 0.02] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 text-[color:var(--service-color)] mb-8 hover:gap-4 transition-all font-bold uppercase tracking-widest text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Retour aux services
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Le logo maison, pas l'icone lucide de services.tsx. Cette page
                etait la derniere a montrer les anciennes : l'accueil, la liste
                des services et la page a-propos affichaient deja les nouvelles,
                donc on changeait de logo en cliquant sur une carte. */}
            <div className="w-16 h-16 bg-[color:var(--service-bg)] rounded-2xl flex items-center justify-center mb-8 text-[color:var(--service-color)] border border-[color:var(--service-border)]">
              {LogoService ? (
                <LogoService className="w-9 h-9" style={{ color: 'var(--service-color)' }} />
              ) : (
                service.icon
              )}
            </div>
            {/* `h1` porte la formule complete — celle qui contient les mots
                pour lesquels la page se classe reellement. `title` reste court
                pour les cartes. Voir le commentaire dans services.tsx. */}
            <h1 className="text-5xl md:text-7xl font-black mb-8 text-3d uppercase italic">
              {service.h1 || service.title}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              {highlight(service.fullDesc)}
            </p>
            <Link
              to="/contact"
              className="inline-block px-10 py-5 bubble-glass text-white font-black hover:text-[color:var(--service-color)]"
            >
              DEMANDER UNE SOUMISSION
            </Link>
            <div className="mt-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[color:var(--service-color)] font-bold uppercase tracking-widest text-sm hover:gap-3 transition-all"
              >
                Mieux comprendre sur le blogue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <LiquidGlassCard className="h-full">
              <h2 className="text-2xl font-bold mb-8 text-[color:var(--service-color)] uppercase tracking-widest">Ce que nous incluons</h2>
              <ul className="space-y-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <CheckCircle2 className="w-6 h-6 text-[color:var(--service-color)] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-lg text-white/80 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </LiquidGlassCard>
          </motion.div>
        </div>

        {/* Piliers du service (cartes + pop-up) */}
        {service.pillars && service.pillars.length > 0 && (
          <ServicePillars pillars={service.pillars} />
        )}

        {/* FAQ Section */}
        {service.faq && service.faq.length > 0 && (
          <div className="mt-32 max-w-3xl">
            <h2 className="text-4xl font-black mb-4 text-3d uppercase italic">Questions fréquentes</h2>
            <p className="text-white/50 mb-12">
              Les questions que les entrepreneurs nous posent le plus souvent à propos de ce service.
            </p>
            <div className="space-y-6">
              {service.faq.map((item, index) => (
                <LiquidGlassCard key={index} delay={index * 0.05} className="!p-8">
                  <h3 className="text-xl font-bold mb-3 text-[color:var(--service-color)]">{item.q}</h3>
                  <p className="text-white/70 leading-relaxed">{item.a}</p>
                </LiquidGlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Other Services Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-black mb-12 text-3d uppercase italic">Autres Expertises</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherServices.map((s, i) => {
              const LogoAutre = LOGOS_SERVICES[s.slug];
              return (
              <Link 
                key={s.slug} 
                to={`/services/${s.slug}`} 
                className="group"
                style={{
                  '--other-color': s.color,
                  '--other-bg': `${s.color}1A`,
                  '--other-border': `${s.color}33`,
                  '--other-shadow': `${s.color}66`,
                } as React.CSSProperties}
              >
                <LiquidGlassCard className="h-full group-hover:border-[color:var(--other-color)] group-hover:shadow-[0_20px_50px_var(--other-shadow)] transition-all bg-gradient-to-br hover:bg-[linear-gradient(to_bottom_right,var(--other-bg),transparent)]">
                  <div className="text-[color:var(--other-color)] mb-6 group-hover:scale-110 transition-transform">
                    {LogoAutre ? (
                      <LogoAutre className="w-14 h-14" style={{ color: s.color }} />
                    ) : (
                      s.icon
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-[color:var(--other-color)] transition-colors uppercase">{s.title}</h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-2">{s.shortDesc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-[color:var(--other-color)] uppercase tracking-widest">
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </div>
                </LiquidGlassCard>
              </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
