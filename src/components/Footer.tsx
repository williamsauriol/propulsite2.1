import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 bg-[#050a15] border-t border-white/10 pt-16 pb-8 px-6 overflow-hidden">

            {/* Decorative Glow Inside Footer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Logo + Description */}
                    <div className="md:col-span-5">
                        <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
                            <img
                                src="/images/logo-fuser-sans-backk.png"
                                alt="Propulsite Logo"
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
                            <li><Link to="/services" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Conception de site web</Link></li>
                            <li><Link to="/services" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Google Ads</Link></li>
                            <li><Link to="/services" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Référencement SEO</Link></li>
                            <li><Link to="/services" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Publicité Facebook</Link></li>
                            <li><Link to="/services" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Médias sociaux</Link></li>
                            <li><Link to="/services" className="text-white/60 hover:text-accent-blue transition-colors text-sm">Design graphique</Link></li>
                        </ul>
                    </div>

                    {/* Contact Links */}
                    <div className="md:col-span-4">
                        <h4 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Contact</h4>
                        <ul className="space-y-4 mb-8">
                            <li><a href="mailto:propulsiteprojet@gmail.com" className="text-white/60 hover:text-accent-blue transition-colors text-sm break-all">propulsiteprojet@gmail.com</a></li>
                            <li><a href="tel:5146496862" className="text-white/60 hover:text-accent-blue transition-colors text-sm">(514) 649-6862</a></li>
                            <li className="text-white/60 text-sm">Terrebonne & Longueuil, Québec</li>
                        </ul>

                        {/* Iso Social Icons */}
                        <h4 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Suivez-nous</h4>
                        <div className="flex gap-6">

                            {/* Facebook Iso */}
                            <a
                                href="https://facebook.com/propulsite"
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
                                href="https://instagram.com/propulsite"
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

                {/* BOTTOM BAR */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-xs">
                        © {new Date().getFullYear()} Tous droits réservés. Agence Propulsite.
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
