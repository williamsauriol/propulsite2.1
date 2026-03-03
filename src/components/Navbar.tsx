import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-accent-blue/20 rounded-lg flex items-center justify-center border border-accent-blue/30 group-hover:border-accent-blue transition-colors">
            <Rocket className="text-accent-blue w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">
            PROPULSITE
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-accent-blue ${
                location.pathname === link.path ? 'text-accent-blue' : 'text-white/70'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className="px-8 py-3 bubble-glass text-white font-bold hover:text-accent-blue"
          >
            DÉCOLLAGE
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
