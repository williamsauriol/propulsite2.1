import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Shield, FileText } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Legal() {
    usePageMeta(
        'Politique de confidentialité – Propulsite',
        'Consultez la politique de confidentialité et les conditions d’utilisation de Propulsite, agence marketing pour les entrepreneurs en construction au Québec.'
    );
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
                    <p className="text-white/50">Dernière mise à jour : 4 septembre 2026</p>
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
                                initial={{ y: 10 }}
                                animate={{ y: 0 }}
                                exit={{ y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="border-b border-white/10 pb-6 mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Politique de confidentialité</h2>
                                    <p className="text-accent-blue/80 text-sm font-semibold tracking-wider uppercase">Propulsite — NEQ 2282389883</p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">1.</span> Qui nous sommes
                                        </h3>
                                        <p className="leading-relaxed">
                                            Propulsite (ci-après « nous », « notre » ou « l'entreprise ») est une entreprise québécoise immatriculée sous le NEQ 2282389883, établie à Saint-Eustache (Québec) J7P 2G6, qui offre des services de conception web et de marketing numérique aux entrepreneurs en construction du Québec.
                                        </p>
                                        <p className="leading-relaxed mt-3">
                                            La présente politique explique quels renseignements personnels nous recueillons, pourquoi, ce que nous en faisons et quels sont vos droits. Elle est rédigée conformément à la <em>Loi sur la protection des renseignements personnels dans le secteur privé</em> du Québec, telle que modifiée par la Loi 25.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">2.</span> Responsable de la protection des renseignements personnels
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            La loi exige que chaque entreprise désigne une personne responsable de la protection des renseignements personnels. Chez nous, c'est :
                                        </p>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-1">
                                            <p className="text-white font-semibold">William Sauriol</p>
                                            <p className="text-white/70">Fondateur, Propulsite</p>
                                            <p className="text-white/70">Saint-Eustache (Québec) J7P 2G6</p>
                                            <p className="text-white/70">
                                                <a href="mailto:propulsiteprojet@gmail.com" className="text-accent-blue hover:underline">propulsiteprojet@gmail.com</a>
                                            </p>
                                        </div>
                                        <p className="leading-relaxed mt-3">
                                            Vous pouvez le joindre pour toute question sur cette politique, pour exercer vos droits, ou pour signaler un problème.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">3.</span> Renseignements que nous recueillons
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            <strong className="text-white">Ce que vous nous donnez vous-même</strong>, en remplissant le formulaire de contact ou de soumission :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Votre nom</li>
                                            <li>Votre adresse courriel</li>
                                            <li>Votre numéro de téléphone, si vous le fournissez</li>
                                            <li>Le nom de votre entreprise, si vous le fournissez</li>
                                            <li>Toute information que vous choisissez d'écrire dans votre message</li>
                                        </ul>
                                        <p className="leading-relaxed mb-3 mt-5">
                                            <strong className="text-white">Ce qui est recueilli automatiquement</strong> quand vous naviguez sur le site, au moyen de Google Analytics :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Les pages que vous consultez et le temps que vous y passez</li>
                                            <li>Le type d'appareil, le navigateur et la langue</li>
                                            <li>Une région approximative (ville ou région, jamais une adresse précise)</li>
                                            <li>Le site ou le moteur de recherche qui vous a amené chez nous</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Nous ne recueillons aucune donnée de paiement sur ce site, ni aucun renseignement sensible au sens de la loi.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">4.</span> Pourquoi nous les recueillons
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Répondre à vos demandes et préparer une soumission</li>
                                            <li>Communiquer avec vous au sujet d'un projet en cours</li>
                                            <li>Comprendre quelles pages de notre site sont utiles, pour l'améliorer</li>
                                            <li>Respecter nos obligations légales et comptables</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Nous n'utilisons jamais vos renseignements à d'autres fins sans vous le demander d'abord. Aucune décision vous concernant n'est prise de façon entièrement automatisée.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">5.</span> Témoins (cookies)
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Un témoin est un petit fichier déposé dans votre navigateur. Nous en utilisons de deux sortes :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li><strong className="text-white/90">Témoins nécessaires</strong> — ils font fonctionner le site. Ils ne demandent pas votre consentement.</li>
                                            <li><strong className="text-white/90">Témoins de mesure d'audience</strong> — déposés par Google Analytics pour compter les visites. Ils ne sont activés qu'avec votre consentement.</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Vous pouvez retirer votre consentement en tout temps, ou bloquer les témoins directement dans les réglages de votre navigateur. Le site continue de fonctionner normalement sans eux.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">6.</span> Avec qui nous les partageons
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Nous ne vendons ni ne louons vos renseignements. Ils sont communiqués uniquement aux fournisseurs qui nous permettent de faire fonctionner le site et de vous répondre :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li><strong className="text-white/90">Vercel</strong> — hébergement du site</li>
                                            <li><strong className="text-white/90">Google</strong> — mesure d'audience (Analytics) et courriel (Gmail)</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Ces fournisseurs peuvent conserver des données à l'extérieur du Québec, notamment aux États-Unis. Avant de les utiliser, nous avons vérifié qu'ils offrent une protection adéquate. Nous pouvons aussi devoir communiquer des renseignements si la loi nous y oblige.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">7.</span> Combien de temps nous les gardons
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li><strong className="text-white/90">Demande sans suite</strong> — 24 mois, puis destruction</li>
                                            <li><strong className="text-white/90">Dossier client</strong> — 7 ans après la fin du mandat, pour nos obligations fiscales</li>
                                            <li><strong className="text-white/90">Données d'audience</strong> — 14 mois, puis suppression automatique</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Passé ces délais, les renseignements sont détruits ou rendus anonymes.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">8.</span> Comment nous les protégeons
                                        </h3>
                                        <p className="leading-relaxed">
                                            Le site est servi en HTTPS. L'accès aux courriels et aux dossiers clients est protégé par une authentification à deux facteurs, et limité aux personnes qui en ont besoin pour travailler. Aucune méthode n'est infaillible, mais nous prenons des mesures raisonnables et nous les révisons régulièrement.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">9.</span> Vos droits
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            La loi québécoise vous donne les droits suivants. Écrivez-nous et nous y répondons dans les 30 jours, gratuitement.
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li><strong className="text-white/90">Accès</strong> — savoir quels renseignements nous détenons sur vous</li>
                                            <li><strong className="text-white/90">Rectification</strong> — faire corriger une information inexacte ou incomplète</li>
                                            <li><strong className="text-white/90">Retrait du consentement</strong> — en tout temps, pour l'avenir</li>
                                            <li><strong className="text-white/90">Suppression</strong> — faire effacer vos renseignements quand nous n'avons plus de motif de les garder</li>
                                            <li><strong className="text-white/90">Portabilité</strong> — recevoir vos renseignements dans un format informatique structuré et couramment utilisé</li>
                                            <li><strong className="text-white/90">Désindexation</strong> — demander qu'un lien vers vos renseignements cesse d'être diffusé, dans les cas prévus par la loi</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">10.</span> En cas d'incident
                                        </h3>
                                        <p className="leading-relaxed">
                                            Nous tenons un registre des incidents de confidentialité. Si un incident présentait un risque de préjudice sérieux, nous en aviserions sans délai les personnes concernées ainsi que la Commission d'accès à l'information du Québec, comme la loi l'exige.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">11.</span> Si vous n'êtes pas satisfait
                                        </h3>
                                        <p className="leading-relaxed">
                                            Écrivez-nous d'abord, nous réglons la plupart des situations rapidement. Si notre réponse ne vous convient pas, vous pouvez porter plainte à la <a href="https://www.cai.gouv.qc.ca" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Commission d'accès à l'information du Québec</a>.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">12.</span> Modifications
                                        </h3>
                                        <p className="leading-relaxed">
                                            Nous pouvons modifier cette politique. La date de la dernière mise à jour est affichée en haut de la page. Un changement important vous sera signalé sur le site.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">13.</span> Nous joindre
                                        </h3>
                                        <p className="leading-relaxed">
                                            Pour toute question sur cette politique ou pour exercer vos droits :{' '}
                                            <a href="mailto:propulsiteprojet@gmail.com" className="text-accent-blue hover:underline">propulsiteprojet@gmail.com</a>
                                        </p>
                                    </section>
                                </div>
                            </motion.div>
                        )}

                        {/* CONDITIONS D'UTILISATION */}
                        {activeTab === 'conditions' && (
                            <motion.div
                                key="conditions"
                                initial={{ y: 10 }}
                                animate={{ y: 0 }}
                                exit={{ y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="border-b border-white/10 pb-6 mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Conditions d'utilisation</h2>
                                    <p className="text-accent-blue/80 text-sm font-semibold tracking-wider uppercase">Propulsite — NEQ 2282389883</p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">1.</span> Acceptation
                                        </h3>
                                        <p className="leading-relaxed">
                                            En consultant propulsite.ca, vous acceptez les présentes conditions. Si vous n'êtes pas d'accord, cessez d'utiliser le site. Ces conditions encadrent l'usage du site web seulement. Un mandat confié à Propulsite est régi par un contrat de service distinct, signé par les deux parties.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">2.</span> Nos services
                                        </h3>
                                        <p className="leading-relaxed mb-3">
                                            Propulsite offre aux entreprises du Québec :
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Conception et développement de sites web</li>
                                            <li>Référencement naturel (SEO) et optimisation pour les moteurs de réponse (GEO)</li>
                                            <li>Gestion de campagnes Google Ads et de publicité Facebook</li>
                                            <li>Gestion de médias sociaux</li>
                                            <li>Intégration d'agents conversationnels</li>
                                        </ul>
                                        <p className="leading-relaxed mt-3">
                                            Les descriptions publiées sur ce site sont fournies à titre informatif. Elles ne constituent ni une offre ferme ni un engagement contractuel.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">3.</span> Soumissions et résultats
                                        </h3>
                                        <p className="leading-relaxed">
                                            Une demande envoyée par le formulaire ne crée aucun contrat. Un mandat commence uniquement lorsqu'une soumission écrite est acceptée par les deux parties. Les prix indiqués dans une soumission sont valides 30 jours.
                                        </p>
                                        <p className="leading-relaxed mt-3">
                                            Nous ne garantissons aucun résultat commercial précis : ni un rang dans les moteurs de recherche, ni un nombre de visiteurs, de demandes ou de contrats. Ces résultats dépendent de facteurs hors de notre contrôle, dont la concurrence, le marché et les algorithmes des plateformes.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">4.</span> Propriété intellectuelle
                                        </h3>
                                        <p className="leading-relaxed">
                                            Le contenu de ce site — textes, images, code, illustrations, nom et logo Propulsite — nous appartient ou est utilisé avec autorisation. Il est protégé par les lois canadiennes sur le droit d'auteur et les marques de commerce.
                                        </p>
                                        <p className="leading-relaxed mt-3">
                                            Les travaux réalisés pour un client lui sont cédés selon ce que prévoit son contrat de service, une fois le paiement complet reçu.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">5.</span> Usage interdit
                                        </h3>
                                        <p className="leading-relaxed mb-3">Il est interdit de :</p>
                                        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                            <li>Reproduire, copier ou distribuer le contenu du site sans autorisation écrite</li>
                                            <li>Utiliser le site à des fins frauduleuses, trompeuses ou malveillantes</li>
                                            <li>Tenter d'accéder à des sections non autorisées du site ou à ses systèmes</li>
                                            <li>Transmettre des virus ou tout autre code nuisible</li>
                                            <li>Extraire massivement le contenu du site par des moyens automatisés</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">6.</span> Limitation de responsabilité
                                        </h3>
                                        <p className="leading-relaxed">
                                            Le site est fourni tel quel. Nous faisons de notre mieux pour que l'information soit exacte et à jour, sans le garantir. Nous ne pouvons être tenus responsables des dommages indirects découlant de l'usage du site ou de l'impossibilité d'y accéder.
                                        </p>
                                        <p className="leading-relaxed mt-3">
                                            Rien dans ces conditions ne limite les droits que la <em>Loi sur la protection du consommateur</em> du Québec accorde à un consommateur.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">7.</span> Liens vers d'autres sites
                                        </h3>
                                        <p className="leading-relaxed">
                                            Notre site peut renvoyer à des sites tiers. Nous n'en contrôlons ni le contenu ni les pratiques de confidentialité, et nous n'en sommes pas responsables.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">8.</span> Communications commerciales
                                        </h3>
                                        <p className="leading-relaxed">
                                            Si vous recevez un courriel commercial de notre part, il indique toujours qui nous sommes et comment nous joindre, et il contient un moyen simple de vous désabonner. Un retrait est traité sans délai, conformément à la <em>Loi canadienne anti-pourriel</em>.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">9.</span> Langue
                                        </h3>
                                        <p className="leading-relaxed">
                                            Ce site, nos communications et nos contrats sont en français, conformément à la <em>Charte de la langue française</em>. Les parties peuvent convenir d'une version anglaise; en cas de divergence, la version française prévaut.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">10.</span> Droit applicable
                                        </h3>
                                        <p className="leading-relaxed">
                                            Les présentes conditions sont régies par les lois en vigueur dans la province de Québec et les lois du Canada qui s'y appliquent. Tout litige relève des tribunaux du district judiciaire de Terrebonne, sous réserve des droits d'un consommateur de saisir le tribunal de son domicile.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">11.</span> Modifications
                                        </h3>
                                        <p className="leading-relaxed">
                                            Nous pouvons modifier ces conditions en tout temps. La version affichée sur cette page est celle qui s'applique. La date de la dernière mise à jour figure en haut.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                            <span className="text-accent-blue">12.</span> Nous joindre
                                        </h3>
                                        <p className="leading-relaxed">
                                            Pour toute question sur ces conditions :{' '}
                                            <a href="mailto:propulsiteprojet@gmail.com" className="text-accent-blue hover:underline">propulsiteprojet@gmail.com</a>
                                        </p>
                                    </section>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </LiquidGlassCard>
            </div>
        </div>
    );
}
