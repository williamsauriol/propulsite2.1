import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LiquidGlassCard from '../components/LiquidGlassCard';

type FunnelData = {
    role: string;
    tailleEntreprise: string;
    defi: string;
    solutionActuelle: string;
    declencheur: string;
    objectif: string;
    nom: string;
    email: string;
    telephone: string;
    message: string;
};

const STEPS = ['welcome', 'role', 'taille', 'defi', 'solution', 'declencheur', 'objectif', 'contact', 'success'];

const SelectButton = ({ value, selected, onClick }: { key?: string; value: string; selected: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-6 py-4 rounded-2xl border transition-all duration-300 font-medium ${selected
            ? 'bg-accent-blue/10 border-accent-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]'
            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
            }`}
    >
        <div className="flex items-center gap-4">
            <div className={`w-5 h-5 rounded-full border-2 flex shrink-0 items-center justify-center ${selected ? 'border-accent-blue bg-accent-blue' : 'border-white/30'}`}>
                {selected && <div className="w-2 h-2 rounded-full bg-[#050a15]" />}
            </div>
            <span className="leading-tight">{value}</span>
        </div>
    </button>
);

export default function Funnel() {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<FunnelData>({
        role: '',
        tailleEntreprise: '',
        defi: '',
        solutionActuelle: '',
        declencheur: '',
        objectif: '',
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

        if (stepId === 'role' && !data.role) {
            setError('Veuillez choisir votre rôle.');
            return;
        }
        if (stepId === 'taille' && !data.tailleEntreprise) {
            setError('Veuillez choisir la taille de votre équipe.');
            return;
        }
        if (stepId === 'defi' && !data.defi.trim()) {
            setError('Veuillez décrire votre défi principal.');
            return;
        }
        if (stepId === 'solution' && !data.solutionActuelle) {
            setError('Veuillez choisir une option.');
            return;
        }
        if (stepId === 'declencheur' && !data.declencheur) {
            setError('Veuillez choisir une option.');
            return;
        }
        if (stepId === 'objectif' && !data.objectif) {
            setError('Veuillez choisir votre objectif principal.');
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

    const sendEmail = () => {
        const TO = 'contact@propulsite.ca';
        const subject = encodeURIComponent(`Nouveau lead – ${data.nom}`);
        const body = encodeURIComponent(
            `Nom: ${data.nom}\nEmail: ${data.email}\nTéléphone: ${data.telephone || 'N/A'}\n\n` +
            `Rôle: ${data.role}\nTaille d'entreprise: ${data.tailleEntreprise}\n` +
            `Défi principal: ${data.defi}\nSolution actuelle: ${data.solutionActuelle}\n` +
            `Déclencheur: ${data.declencheur}\nObjectif 3 mois: ${data.objectif}\n\n` +
            `Message: ${data.message || 'Aucun'}`
        );
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

                            {/* WELCOME */}
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
                                        Trouvons ensemble la trajectoire idéale pour votre entreprise. Répondez à ces quelques questions pour lancer la mission.
                                    </p>
                                    <button onClick={handleNext} className="w-full md:w-auto px-10 py-5 bg-accent-blue rounded-[50px] text-[#050a15] font-black tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,210,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] hover:-translate-y-1 transform duration-200">
                                        DÉMARRER L'EXPLORATION →
                                    </button>
                                </div>
                            )}

                            {/* Q1 — RÔLE */}
                            {stepId === 'role' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Quel est votre rôle dans l'entreprise ?</h2>
                                    <p className="text-white/50 mb-8">Cela nous aide à mieux adapter notre approche.</p>
                                    <div className="space-y-4 mb-8">
                                        {['Fondateur / Propriétaire', 'Directeur / Manager', 'Responsable marketing', 'Développeur / Technique', 'Autre'].map(opt => (
                                            <SelectButton key={opt} value={opt} selected={data.role === opt} onClick={() => setData({ ...data, role: opt })} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Q2 — TAILLE */}
                            {stepId === 'taille' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Quelle est la taille de votre équipe ?</h2>
                                    <p className="text-white/50 mb-8">Pour personnaliser nos recommandations.</p>
                                    <div className="space-y-4 mb-8">
                                        {['Juste moi (solopreneur)', '2 – 5 personnes', '6 – 20 personnes', '20 – 50 personnes', '50+ personnes'].map(opt => (
                                            <SelectButton key={opt} value={opt} selected={data.tailleEntreprise === opt} onClick={() => setData({ ...data, tailleEntreprise: opt })} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Q3 — DÉFI */}
                            {stepId === 'defi' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Quel est votre plus grand défi en ce moment ?</h2>
                                    <p className="text-white/50 mb-8">Décrivez le problème principal que vous souhaitez résoudre.</p>
                                    <div className="mb-8">
                                        <textarea
                                            placeholder="Ex : Je n'arrive pas à attirer suffisamment de clients en ligne, ma visibilité est très faible..."
                                            value={data.defi}
                                            onChange={e => setData({ ...data, defi: e.target.value })}
                                            rows={5}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Q4 — SOLUTION ACTUELLE */}
                            {stepId === 'solution' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Comment gérez-vous ce problème actuellement ?</h2>
                                    <p className="text-white/50 mb-8">Votre situation actuelle nous aide à trouver la meilleure solution.</p>
                                    <div className="space-y-4 mb-8">
                                        {[
                                            'Je n\'ai aucune solution en place',
                                            'Je gère ça moi-même, sans outil précis',
                                            'J\'utilise des outils gratuits (réseaux sociaux, etc.)',
                                            'Je travaille déjà avec une agence ou un freelance',
                                            'J\'ai une solution interne mais elle ne fonctionne pas bien'
                                        ].map(opt => (
                                            <SelectButton key={opt} value={opt} selected={data.solutionActuelle === opt} onClick={() => setData({ ...data, solutionActuelle: opt })} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Q5 — DÉCLENCHEUR */}
                            {stepId === 'declencheur' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Qu'est-ce qui vous a poussé à chercher une solution maintenant ?</h2>
                                    <p className="text-white/50 mb-8">Comprendre votre moment nous aide à prioriser.</p>
                                    <div className="space-y-4 mb-8">
                                        {[
                                            'Je perds des clients face à la concurrence',
                                            'Je viens de lancer mon entreprise',
                                            'Ma croissance est bloquée depuis un moment',
                                            'J\'ai eu une mauvaise expérience avec une autre agence',
                                            'C\'est le bon moment pour investir',
                                            'Autre'
                                        ].map(opt => (
                                            <SelectButton key={opt} value={opt} selected={data.declencheur === opt} onClick={() => setData({ ...data, declencheur: opt })} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Q6 — OBJECTIF 3 MOIS */}
                            {stepId === 'objectif' && (
                                <div>
                                    <h2 className="text-3xl font-black mb-2 text-white">Quel est votre objectif principal pour les 3 prochains mois ?</h2>
                                    <p className="text-white/50 mb-8">Choisissez la destination prioritaire de votre mission.</p>
                                    <div className="space-y-4 mb-8">
                                        {[
                                            'Attirer plus de clients',
                                            'Améliorer ma visibilité en ligne',
                                            'Lancer ou refaire mon site web',
                                            'Augmenter mes ventes en ligne',
                                            'Renforcer mon image de marque',
                                            'Autre'
                                        ].map(opt => (
                                            <SelectButton key={opt} value={opt} selected={data.objectif === opt} onClick={() => setData({ ...data, objectif: opt })} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CONTACT */}
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

                            {/* SUCCESS */}
                            {stepId === 'success' && (
                                <div className="text-center py-12">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: 360 }}
                                        transition={{ type: "spring", damping: 15, stiffness: 100 }}
                                        className="w-24 h-24 bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center mx-auto mb-8"
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

                            {/* Error */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm font-medium mb-4"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Navigation */}
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
