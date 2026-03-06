import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Shield, FileText } from 'lucide-react';

export default function Legal() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'confidentialite' | 'conditions'>('confidentialite');

    // Handle hash changes to switch tabs automatically
    useEffect(() => {
        if (location.hash === '#conditions') {
            setActiveTab('conditions');
        } else if (location.hash === '#confidentialite') {
            setActiveTab('confidentialite');
        }
    }, [location]);

    return (
        <div className="pt-32 pb-24 px-6 relative z-10 min-h-screen">

            {/* Background Glows */}
            <div className="absolute top-40 left-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container mx-auto max-w-4xl">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-bold tracking-widest uppercase mb-6">
                        Légal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                        POLITIQUE & <span className="text-accent-blue italic">CONDITIONS</span>
                    </h1>
                    <p className="text-white/50">Dernière mise à jour : Mars 2026</p>
                </div>

                {/* Custom Tabs */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveTab('confidentialite')}
                        className={`px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 flex items-center justify-center gap-3 ${activeTab === 'confidentialite'
                                ? 'bg-accent-blue text-[#050a15] shadow-[0_0_20px_rgba(0,198,255,0.4)]'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        <Shield className="w-4 h-4" /> Confidentialité
                    </button>
                    <button
                        onClick={() => setActiveTab('conditions')}
                        className={`px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 flex items-center justify-center gap-3 ${activeTab === 'conditions'
                                ? 'bg-accent-blue text-[#050a15] shadow-[0_0_20px_rgba(0,198,255,0.4)]'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        <FileText className="w-4 h-4" /> Conditions
                    </button>
                </div>

                {/* Content Area */}
                <LiquidGlassCard className="p-8 md:p-12 text-white/80">
                    <AnimatePresence mode="wait">

                        {/* POLITIQUE DE CONFIDENTIALITÉ */}
                        {activeTab === 'confidentialite' && (
                            <motion.div
                                key="confidentialite"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="border-b border-white/10 pb-6 mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Politique de confidentialité</h2>
                                    <p className="text-accent-blue/80 text-sm font-semibold tracking-wider uppercase">Propulsite</p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">1.</span> Introduction
                                        </h3>
                                        <p className="leading-relaxed">
                                            Propulsite (ci-après « nous », « notre » ou « l'entreprise ») s'engage à protéger la vie privée des personnes qui visitent notre site web et qui nous contactent. La présente politique de confidentialité décrit les types d'informations que nous collectons, la façon dont nous les utilisons et les mesures que nous prenons pour les protéger. En utilisant notre site web, vous acceptez les pratiques décrites dans cette politique.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">2.</span> Informations que nous collectons
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Nous collectons uniquement les informations que vous nous fournissez volontairement, notamment lorsque vous remplissez notre formulaire de contact :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Votre nom complet</li>
                                            <li>Votre adresse courriel</li>
                                            <li>Toute information supplémentaire que vous choisissez de nous transmettre dans votre message</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Nous ne collectons pas de données de paiement, de données de navigation automatisées ni d'informations sensibles.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">3.</span> Utilisation des informations
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Les informations que vous nous transmettez sont utilisées uniquement aux fins suivantes :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Répondre à vos demandes de renseignements</li>
                                            <li>Vous contacter dans le cadre d'un projet ou d'une consultation</li>
                                            <li>Vous faire parvenir des informations relatives à nos services, si vous en avez fait la demande</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Nous n'utilisons pas vos informations à des fins de marketing automatisé sans votre consentement préalable.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">4.</span> Partage des informations
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Propulsite ne vend, ne loue et ne partage pas vos informations personnelles avec des tiers, sauf dans les cas suivants :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Lorsque la loi l'exige</li>
                                            <li>Pour protéger nos droits légaux</li>
                                            <li>Avec votre consentement explicite</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">5.</span> Conservation des données
                                        </h3>
                                        <p className="leading-relaxed">
                                            Nous conservons vos informations personnelles aussi longtemps que nécessaire pour répondre à votre demande ou pour la durée de notre relation d'affaires. Vous pouvez à tout moment nous demander de supprimer vos données en nous contactant à notre adresse courriel.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">6.</span> Vos droits (Loi 25 – Québec)
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            En vertu de la Loi sur la protection des renseignements personnels dans le secteur privé (Loi 25) du Québec, vous avez le droit de :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Accéder aux informations personnelles que nous détenons à votre sujet</li>
                                            <li>Demander la correction de renseignements inexacts</li>
                                            <li>Demander la suppression de vos données</li>
                                            <li>Retirer votre consentement à tout moment</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Pour exercer ces droits, contactez-nous à : <strong className="text-white">propulsiteprojet@gmail.com</strong>
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">7.</span> Sécurité & Modifications
                                        </h3>
                                        <p className="leading-relaxed mb-4">
                                            Nous prenons des mesures raisonnables pour protéger vos informations personnelles contre tout accès non autorisé, divulgation, modification ou destruction. Toutefois, aucune transmission de données sur Internet n'est entièrement sécurisée.
                                        </p>
                                        <p className="leading-relaxed">
                                            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page. Nous vous encourageons à la consulter régulièrement.
                                        </p>
                                    </section>

                                    <div className="mt-8 p-6 bg-accent-blue/10 border border-accent-blue/20 rounded-xl">
                                        <p className="text-white/80">
                                            📬 Pour toute question relative à cette politique, contactez-nous à <strong className="text-white">propulsiteprojet@gmail.com</strong> — Propulsite, Québec, Canada.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* CONDITIONS D'UTILISATION */}
                        {activeTab === 'conditions' && (
                            <motion.div
                                key="conditions"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="border-b border-white/10 pb-6 mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Conditions d'utilisation</h2>
                                    <p className="text-accent-blue/80 text-sm font-semibold tracking-wider uppercase">Propulsite</p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">1.</span> Acceptation des conditions
                                        </h3>
                                        <p className="leading-relaxed">
                                            En accédant à ce site web et en utilisant les services offerts par Propulsite, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">2.</span> Description des services
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Propulsite est une agence de marketing numérique basée au Québec offrant les services suivants :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Conception et développement de sites web</li>
                                            <li>Gestion de campagnes Google Ads et publicité Facebook</li>
                                            <li>Référencement naturel (SEO)</li>
                                            <li>Gestion de médias sociaux</li>
                                            <li>Design web et graphique</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">3.</span> Utilisation du site
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Vous vous engagez à utiliser ce site uniquement à des fins légales et conformément aux présentes conditions. Il vous est notamment interdit de :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Reproduire, copier ou distribuer le contenu du site sans autorisation écrite</li>
                                            <li>Utiliser le site à des fins frauduleuses ou malveillantes</li>
                                            <li>Tenter d'accéder à des sections non autorisées du site</li>
                                            <li>Transmettre des virus ou tout autre code nuisible</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">4.</span> Propriété intellectuelle
                                        </h3>
                                        <p className="leading-relaxed">
                                            Tout le contenu présent sur ce site (textes, images, logos, design) est la propriété exclusive de Propulsite ou de ses partenaires, et est protégé par les lois canadiennes sur le droit d'auteur. Toute reproduction sans autorisation est strictement interdite.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">5.</span> Limitation de responsabilité
                                        </h3>
                                        <p className="leading-relaxed">
                                            Propulsite s'efforce de maintenir les informations de ce site à jour et exactes. Cependant, nous ne garantissons pas l'exactitude, l'exhaustivité ou l'actualité du contenu. Propulsite ne pourra être tenu responsable de tout dommage direct ou indirect résultant de l'utilisation de ce site.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">6.</span> Liens externes
                                        </h3>
                                        <p className="leading-relaxed">
                                            Notre site peut contenir des liens vers des sites tiers. Ces liens sont fournis à titre informatif uniquement. Propulsite n'est pas responsable du contenu ou des pratiques de confidentialité de ces sites externes.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">7.</span> Droit applicable
                                        </h3>
                                        <p className="leading-relaxed">
                                            Les présentes conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables. Tout litige sera soumis à la juridiction exclusive des tribunaux du Québec.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">8.</span> Modifications des conditions
                                        </h3>
                                        <p className="leading-relaxed">
                                            Propulsite se réserve le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur cette page. Il vous appartient de consulter régulièrement cette page pour rester informé des mises à jour.
                                        </p>
                                    </section>

                                    <div className="mt-8 p-6 bg-accent-blue/10 border border-accent-blue/20 rounded-xl">
                                        <p className="text-white/80">
                                            📬 <strong>Propulsite</strong> — <strong className="text-white">propulsiteprojet@gmail.com</strong> — Québec, Canada.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </LiquidGlassCard>
            </div>
        </div>
    );
}
