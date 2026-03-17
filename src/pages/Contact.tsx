import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Contact() {
  usePageMeta(
    'Contactez-nous – Propulsite | Obtenir une soumission gratuite',
    'Contactez Propulsite pour obtenir une soumission gratuite. Nous aidons les entrepreneurs en construction à générer plus de leads grâce au marketing numérique.'
  );
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: 'Audit Gratuit',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.email || !formData.message) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/propulsiteprojet@gmail.com`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `Nouveau message Contact - ${formData.sujet}`,
            Nom: formData.nom,
            Email: formData.email,
            Téléphone: formData.telephone || 'Non fourni',
            Sujet: formData.sujet,
            Message: formData.message
        })
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setFormData({ nom: '', email: '', telephone: '', sujet: 'Audit Gratuit', message: '' });
      } else {
        setError("Une erreur est survenue lors de l'envoi du message.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur d'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {isSuccess ? (
                <div className="py-12 text-center flex flex-col items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-black mb-2 text-white">Message envoyé !</h3>
                  <p className="text-white/60 mb-8 max-w-sm mx-auto">
                    Nous avons bien reçu votre message. Notre équipe vous contactera très rapidement.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-colors text-sm uppercase tracking-widest"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-white/50">Nom Complet *</label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-white/50">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                        placeholder="jean@entreprise.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-white/50">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                      placeholder="(514) 555-1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-white/50">Sujet</label>
                    <select 
                      value={formData.sujet}
                      onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-[#050a15]">Audit Gratuit</option>
                      <option className="bg-[#050a15]">Conception Web</option>
                      <option className="bg-[#050a15]">SEO / Ads</option>
                      <option className="bg-[#050a15]">Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-white/50">Message *</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all resize-none"
                      placeholder="Parlez-nous de votre projet..."
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 bubble-glass text-white font-black hover:text-accent-blue flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>Envoyer le Message <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              )}
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
                  <p className="font-bold text-sm sm:text-base break-all mt-1">propulsiteprojet@gmail.com</p>
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
                  <p className="font-bold mt-1">(514) 649-6862</p>
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
                  <p className="font-bold">Saint-Eustache</p>
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
