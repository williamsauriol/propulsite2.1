import React from 'react';
import { motion } from 'motion/react';
import LiquidGlassCard from '../components/LiquidGlassCard';

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 relative z-10">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 italic">L'AGENCE <span className="text-accent-blue">PROPULSE</span></h1>
            <div className="space-y-6 text-lg text-white/70">
              <p>
                Née de la vision de transformer le paysage digital, Propulse est bien plus qu'une agence marketing. Nous sommes vos copilotes dans l'aventure numérique.
              </p>
              <p>
                Avec plus de 1500 projets à notre actif sous l'entité Agence LB, nous avons décidé de franchir une nouvelle étape. Propulse incarne notre volonté d'aller plus loin, plus vite, et avec une précision chirurgicale.
              </p>
              <p>
                Notre équipe est composée de passionnés de données, de créatifs audacieux et de stratèges visionnaires. Ensemble, nous construisons le futur de votre entreprise.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bubble-glass">
                <img src="https://picsum.photos/seed/construction-site/400/600" alt="Construction Site" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden bubble-glass">
                <img src="https://picsum.photos/seed/digital-marketing/400/400" alt="Digital Marketing" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="aspect-square rounded-3xl overflow-hidden bubble-glass">
                <img src="https://picsum.photos/seed/team-collaboration/400/400" alt="Team Collaboration" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bubble-glass">
                <img src="https://picsum.photos/seed/crane/400/600" alt="Crane" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <LiquidGlassCard>
            <h3 className="text-4xl font-black text-accent-blue mb-2">10+</h3>
            <p className="font-bold uppercase tracking-widest text-sm">Années d'expérience</p>
          </LiquidGlassCard>
          <LiquidGlassCard>
            <h3 className="text-4xl font-black text-accent-blue mb-2">1500+</h3>
            <p className="font-bold uppercase tracking-widest text-sm">Projets livrés</p>
          </LiquidGlassCard>
          <LiquidGlassCard>
            <h3 className="text-4xl font-black text-accent-blue mb-2">98%</h3>
            <p className="font-bold uppercase tracking-widest text-sm">Clients satisfaits</p>
          </LiquidGlassCard>
        </div>
      </div>
    </div>
  );
}
