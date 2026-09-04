import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { SECTEURS } from '../constants/secteursData';

export default function Footer() {
    return (
        /* Pas de `border-t` ici. Le trait blanc allait d'un bord à l'autre de
           l'écran et coupait la page en deux : on voyait la couture entre le
           contenu et le pied de page. Le filet cyan juste en dessous fait déjà
           le travail, et lui s'éteint aux extrémités — on sent la séparation
           sans voir la ligne. */
        <footer className="relative z-10 bg-[#050a15] pt-16 pb-8 px-6 overflow-hidden">

            {/* Decorative Glow Inside Footer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Logo + Description */}
                    <div className="md:col-span-4">
                        <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
                            <img
                                src="/images/logo-fuser-sans-backk.png"
                                alt="Propulsite Logo"
                                width={450}
                                height={450}
                                className="h-10 md:h-12 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform group-hover:scale-105"
                            />
                            <span className="text-2xl font-black tracking-widest text-white group-hover:text-accent-blue transition-colors">
                                PROPULSITE
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-sm">
                            Nous aidons les entreprises à propulser leur présence en ligne grâce à des stratégies numériques efficaces et un design moderne.
                        </p>
                    </div>

                    {/* Services Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Services</h4>
                        <ul className="space-y-4">
                            <li><Link to="/services/conception-site-web" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Conception de site web</Link></li>
                            <li><Link to="/services/google-ads" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Google Ads</Link></li>
                            <li><Link to="/services/domination-google" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Domination Google</Link></li>
                            <li><Link to="/services/publicite-facebook" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Publicité Facebook</Link></li>
                            <li><Link to="/services/gestion-medias-sociaux" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Médias sociaux</Link></li>
                            <li><Link to="/services/chatbot-ia" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Chatbot IA</Link></li>
                        </ul>
                    </div>

                    {/* NAVIGATION — /contact, /blog et /a-propos n'etaient lies
                        que depuis la barre du haut. Google le confirme : sur
                        /contact, l'inspection d'URL affiche « Referring page :
                        None detected ». Le pied de page est la deuxieme surface
                        de maillage d'un site, et elle etait vide de ces pages.

                        A noter aussi : le bouton d'appel a l'action pointe vers
                        /funnel, qui est Disallow dans robots.txt. Quatre liens
                        par page vers une adresse que le robot n'a pas le droit
                        de suivre, contre deux vers /contact. C'est voulu pour le
                        funnel, mais ca rendait /contact d'autant plus important
                        a lier ici. */}
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Le site</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Accueil</Link></li>
                            <li><Link to="/services" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Nos services</Link></li>
                            <li><Link to="/geo" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Le GEO</Link></li>
                            <li><Link to="/blog" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Blogue</Link></li>
                            <li><Link to="/questions" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Questions fréquentes</Link></li>
                            <li><Link to="/a-propos" className="text-white/60 hover:text-accent-blue transition-colors text-sm">À propos</Link></li>
                            <li><Link to="/contact" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Nous joindre</Link></li>
                        </ul>
                    </div>

                    {/* Contact Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Contact</h4>
                        <ul className="space-y-4 mb-8">
                            <li><a href="mailto:propulsiteprojet@gmail.com" className="text-white/60 hover:text-accent-blue transition-colors text-sm break-all">propulsiteprojet@gmail.com</a></li>
                            <li><a href="tel:5146496862" className="text-white/60 hover:text-accent-blue transition-colors text-sm">(514) 649-6862</a></li>
                            <li className="text-white/60 text-sm">Saint-Eustache, Québec</li>
                            <li><a href="https://www.google.com/maps?cid=6519031247085477855" target="_blank" rel="noreferrer" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Notre fiche Google</a></li>
                        </ul>

                        {/* Iso Social Icons */}
                        <h4 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Suivez-nous</h4>
                        <div className="flex gap-6">

                            {/* Facebook Iso */}
                            <a
                                href="https://www.facebook.com/1277763615427534"
                                target="_blank"
                                rel="noreferrer"
                                className="relative group w-14 h-14 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:translate-x-2"
                            >
                                {/* Isometric Layers */}
                                <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-20 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1"></div>
                                <div className="absolute inset-0 bg-accent-blue/10 rounded-xl border border-accent-blue/20 opacity-0 group-hover:opacity-40 transition-all duration-300 transform group-hover:translate-x-2 group-hover:-translate-y-2"></div>

                                {/* Main Icon Box */}
                                <div className="relative w-full h-full bg-[#0a1930] rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-accent-blue group-hover:shadow-[0_0_20px_rgba(0,198,255,0.3)] z-10">
                                    <Facebook className="w-6 h-6 text-white/50 group-hover:text-accent-blue transition-colors" />
                                </div>

                                {/* Tooltip Hover */}
                                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs font-bold text-accent-blue bg-accent-blue/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(0,198,255,0.2)] pointer-events-none transform group-hover:translate-y-0 translate-y-2 whitespace-nowrap">
                                    Facebook
                                </span>
                            </a>

                            {/* Instagram Iso */}
                            <a
                                href="https://www.instagram.com/propulsite_/"
                                target="_blank"
                                rel="noreferrer"
                                className="relative group w-14 h-14 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:translate-x-2"
                            >
                                {/* Isometric Layers */}
                                <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-20 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1"></div>
                                <div className="absolute inset-0 bg-purple-500/10 rounded-xl border border-purple-500/20 opacity-0 group-hover:opacity-40 transition-all duration-300 transform group-hover:translate-x-2 group-hover:-translate-y-2"></div>

                                {/* Main Icon Box */}
                                <div className="relative w-full h-full bg-[#0a1930] rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] z-10">
                                    <Instagram className="w-6 h-6 text-white/50 group-hover:text-purple-400 transition-colors" />
                                </div>

                                {/* Tooltip Hover */}
                                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(168,85,247,0.2)] pointer-events-none transform group-hover:translate-y-0 translate-y-2 whitespace-nowrap">
                                    Instagram
                                </span>
                            </a>

                        </div>
                    </div>
                </div>

                {/* SECTEURS DESSERVIS */}
                {/* Sans ce lien, les pages de secteur sont orphelines : Google les
                    trouve dans le sitemap, ne voit aucun lien vers elles, et les
                    laisse en « Detectee, actuellement non indexee ». */}
                <div className="mb-12">
                    <h4 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Secteurs desservis</h4>
                    <ul className="space-y-4">
                        {SECTEURS.map((secteur) => (
                            <li key={secteur.slug}>
                                <Link
                                    to={`/secteurs/${secteur.slug}`}
                                    className="text-white/60 hover:text-accent-blue transition-colors text-sm"
                                >
                                    Marketing web pour entrepreneurs &mdash; {secteur.region}
                                </Link>
                                <p className="text-white/55 text-xs mt-1 leading-relaxed max-w-3xl">
                                    {secteur.villes.join(' · ')}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BOTTOM BAR */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-xs">
                        © {new Date().getFullYear()} Tous droits réservés. Agence Propulsite. <span className="text-white/30">NEQ&nbsp;2282389883</span>
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/legal#confidentialite" className="text-white/40 hover:text-white transition-colors text-xs">Politique de confidentialité</Link>
                        <span className="text-white/20">•</span>
                        <Link to="/legal#conditions" className="text-white/40 hover:text-white transition-colors text-xs">Conditions d'utilisation</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
