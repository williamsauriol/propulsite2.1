import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LiquidGlassCard from '../components/LiquidGlassCard';

type FunnelData = {
    objectif: string;
    services: string[];
    budget: string;
    delai: string;
    nom: string;
    email: string;
    telephone: string;
    message: string;
};

const STEPS = ['welcome', 'objectif', 'services', 'budget', 'contact', 'success'];

export default function Funnel() {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<FunnelData>({
        objectif: '',
        services: [],
        budget: '',
        delai: '',
        nom: '',
        email: '',
        telephone: '',
        message: ''
    });
    const [error, setError] = useState('');

    const stepId = STEPS[currentStep];
    const totalSteps = STEPS.length - 2;

    const progressPercent = () => {
        if (currentStep === 0) return 0;
        if (currentStep === STEPS.length - 1) return 100;
        return Math.round((currentStep / totalSteps) * 100);
    };

    const handleNext = () => {
        setError('');

        // Validation
        if (stepId === 'objectif' && !data.objectif) {
            setError('Veuillez choisir une option.');
            return;
        }
        if (stepId === 'services' && data.services.length === 0) {
            setError('Veuillez choisir au moins un service.');
            return;
        }
        if (stepId === 'budget' && (!data.budget || !data.delai)) {
            setError('Veuillez remplir les deux sections.');
            return;
        }
        if (stepId === 'contact') {
            if (!data.nom.trim() || !data.email.trim()) {
                setError('Veuillez remplir votre nom et email.');
                return;
            }
            sendEmail();
        }

        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setError('');
        setCurrentStep(prev => prev - 1);
    };

    const toggleService = (service: string) => {
        setData(prev => {
            const services = prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service];
            return { ...prev, services };
        });
    };

    const sendEmail = () => {
        const TO = 'contact@propulsite.ca'; // Replace with actual email
        const subject = encodeURIComponent(`Nouveau lead – ${data.nom}`);
        const body = encodeURIComponent(
            `Nom: ${data.nom}\nEmail: ${data.email}\nTéléphone: ${data.telephone || 'N/A'}\n\n` +
            `Objectif: ${data.objectif}\nServices: ${data.services.join(', ')}\n` +
            `Budget: ${data.budget}\nDélai: ${data.delai}\n\nMessage: ${data.message || 'Aucun'}`
        );
        // Use a small timeout to allow UI to transition to success before opening mailto
        setTimeout(() => {
            window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
        }, 500);
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 relative z-10 flex items-center justify-center">
            <div className="container mx-auto max-w-2xl">
                <LiquidGlassCard className="relative overflow-hidden shadow-[0_0_50px_rgba(0,210,255,0.15)] ring-1 ring-white/10">

                    {/* Progress Bar */}
                    {currentStep > 0 && currentStep < STEPS.length - 1 && (
                        <div className="mb-10">
                            <div className="flex justify-between text-xs font-bold text-accent-blue uppercase tracking-widest mb-3">
                                <span>Étape {currentStep} sur {totalSteps}</span>
                                <span>{progressPercent()}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-accent-blue shadow-[0_0_10px_rgba(0,210,255,0.8)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent()}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={stepId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >

                            {/* WELCOME STEP */}
                            {stepId === 'welcome' && (
                                <div className="text-center py-8">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-6xl mb-6"
                                    >
                                        🚀
                                    </motion.div>
                                    <h2 className="text-4xl font-black mb-4 text-3d uppercase italic">Prêt pour le décollage ?</h2>
                                    <p className="text-white/70 text-lg mb-10 leading-relaxed">
                                        Trouvons ensemble la trajectoire idéale pour votre entreprise de construction. Répondez à ces quelques questions pour lancer la mission.
                                    </p>
                                    <button onClick={handleNext} className="w-full md:w-auto px-10 py-5 bg-accent-blue rounded-[50px] text-[#050a15] font-black tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,210,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] hover:-translate-y-1 transform duration-200">
                                        DÉMARRER L'EXPLORATION →
                                    </button>
                                </div>
                            )}

                            {/* OBJECTIF STEP */}
                            {stepId === 'objectif' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Quel est votre objectif principal ?</h2>
                                    <p className="text-white/50 mb-8">Sélectionnez la destination de votre mission.</p>

                                    <div className="space-y-4 mb-8">
                                        {['Attirer plus de clients', 'Améliorer ma visibilité en ligne', 'Refaire mon image de marque', 'Vendre en ligne', 'Autre'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setData({ ...data, objectif: opt })}
                                                className={`w-full text-left px-6 py-4 rounded-2xl border transition-all duration-300 font-medium ${data.objectif === opt
                                                        ? 'bg-accent-blue/10 border-accent-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.objectif === opt ? 'border-accent-blue' : 'border-white/30'}`}>
                                                        {data.objectif === opt && <div className="w-2.5 h-2.5 bg-accent-blue rounded-full" />}
                                                    </div>
                                                    {opt}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SERVICES STEP */}
                            {stepId === 'services' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Quels services vous intéressent ?</h2>
                                    <p className="text-white/50 mb-8">Sélectionnez les propulseurs nécessaires (plusieurs choix possibles).</p>

                                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                        {['Conception de site web', 'Google Ads', 'Référencement SEO', 'Publicité Facebook', 'Gestion de médias sociaux', 'Design web', 'Design graphique'].map(srv => (
                                            <button
                                                key={srv}
                                                onClick={() => toggleService(srv)}
                                                className={`text-left px-5 py-4 rounded-2xl border transition-all duration-300 font-medium ${data.services.includes(srv)
                                                        ? 'bg-accent-blue/10 border-accent-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex shrink-0 items-center justify-center ${data.services.includes(srv) ? 'border-accent-blue bg-accent-blue' : 'border-white/30'}`}>
                                                        {data.services.includes(srv) && <svg className="w-3.5 h-3.5 text-[#050a15]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <span className="leading-tight">{srv}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* BUDGET & DELAI STEP */}
                            {stepId === 'budget' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-8 text-white">Paramètres de la mission</h2>

                                    <h3 className="text-xl font-bold text-accent-blue mb-4">Budget approximatif</h3>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-10">
                                        {['Moins de 500$', '500$ – 1 500$', '1 500$ – 5 000$', '5 000$+', 'Je ne sais pas encore'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setData({ ...data, budget: opt })}
                                                className={`text-left px-5 py-3 rounded-xl border transition-all duration-300 text-sm font-medium ${data.budget === opt
                                                        ? 'bg-accent-blue/10 border-accent-blue text-white'
                                                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>

                                    <h3 className="text-xl font-bold text-accent-blue mb-4">Délai de lancement</h3>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                        {['Le plus tôt possible', 'Dans 1 à 3 mois', 'Dans 3 à 6 mois', 'Pas de délai précis'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setData({ ...data, delai: opt })}
                                                className={`text-left px-5 py-3 rounded-xl border transition-all duration-300 text-sm font-medium ${data.delai === opt
                                                        ? 'bg-accent-blue/10 border-accent-blue text-white'
                                                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CONTACT STEP */}
                            {stepId === 'contact' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Dernière étape</h2>
                                    <p className="text-white/50 mb-8">Configurez vos coordonnées de contact pour l'atterrissage.</p>

                                    <div className="space-y-4 mb-8">
                                        <input
                                            type="text"
                                            placeholder="Nom complet *"
                                            value={data.nom}
                                            onChange={e => setData({ ...data, nom: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                        />
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <input
                                                type="email"
                                                placeholder="Adresse courriel *"
                                                value={data.email}
                                                onChange={e => setData({ ...data, email: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Téléphone"
                                                value={data.telephone}
                                                onChange={e => setData({ ...data, telephone: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Détails supplémentaires (optionnel)"
                                            value={data.message}
                                            onChange={e => setData({ ...data, message: e.target.value })}
                                            rows={4}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* SUCCESS STEP */}
                            {stepId === 'success' && (
                                <div className="text-center py-12">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: 360 }}
                                        transition={{ type: "spring", damping: 15, stiffness: 100 }}
                                        className="w-24 h-24 bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center mx-auto mb-8 mx-auto"
                                    >
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <h2 className="text-4xl font-black mb-4 text-white">Mission accomplie !</h2>
                                    <p className="text-white/60 text-lg leading-relaxed max-w-md mx-auto">
                                        Vos coordonnées de vol ont été transmises. L'équipage Propulsite vous contactera sur <strong className="text-white">{data.email}</strong> d'ici peu.
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm font-medium mb-4"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Navigation Buttons (hidden on welcome and success) */}
                            {currentStep > 0 && currentStep < STEPS.length - 1 && (
                                <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10">
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-3 text-white/50 font-bold hover:text-white transition-colors uppercase tracking-widest text-sm"
                                    >
                                        ← Retour
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-accent-blue text-[#050a15] rounded-full font-bold hover:bg-white transition-colors uppercase tracking-widest shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                                    >
                                        {stepId === 'contact' ? 'Envoyer ✓' : 'Suivant →'}
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>

                </LiquidGlassCard>
            </div>
        </div>
    );
}
