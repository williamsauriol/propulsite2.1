import React from 'react';
import { motion } from 'motion/react';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 px-6 relative z-10">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 italic">CONTACTEZ-NOUS</h1>
          <p className="text-xl text-white/60">
            Prêt pour le décollage ? Remplissez le formulaire ci-dessous et notre équipe vous contactera dans les plus brefs délais.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LiquidGlassCard>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-white/50">Nom Complet</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-colors"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-white/50">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-colors"
                      placeholder="jean@entreprise.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-white/50">Sujet</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-colors appearance-none">
                    <option className="bg-space-blue">Audit Gratuit</option>
                    <option className="bg-space-blue">Conception Web</option>
                    <option className="bg-space-blue">SEO / Ads</option>
                    <option className="bg-space-blue">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-white/50">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="Parlez-nous de votre projet..."
                  />
                </div>
                <button className="w-full py-5 bubble-glass text-white font-black hover:text-accent-blue flex items-center justify-center gap-2">
                  Envoyer le Message <Send className="w-4 h-4" />
                </button>
              </form>
            </LiquidGlassCard>
          </div>

          <div className="space-y-6">
            <LiquidGlassCard>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">Email</p>
                  <p className="font-bold">info@propulse.ca</p>
                </div>
              </div>
            </LiquidGlassCard>
            <LiquidGlassCard>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">Téléphone</p>
                  <p className="font-bold">(514) 777-7264</p>
                </div>
              </div>
            </LiquidGlassCard>
            <LiquidGlassCard>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">Bureaux</p>
                  <p className="font-bold">Terrebonne & Longueuil</p>
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
