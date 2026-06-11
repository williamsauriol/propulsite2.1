import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide header on scroll down, show on scroll up. Also close menu on scroll.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMenuOpen(false);
    } else {
      setHidden(false);
    }
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050a15]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo (Left) */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center group gap-3">
            <img
              src="/images/logo-fuser-sans-backk.png"
              alt="Propulsite Accueil"
              className="h-10 md:h-12 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform group-hover:scale-105"
            />
            <span className="text-xl md:text-2xl font-black tracking-widest text-white transition-colors group-hover:text-accent-blue">
              PROPULSITE
            </span>
          </Link>
        </div>

        {/* Links (Centered — desktop only) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
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
        </nav>

        {/* Right side */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {/* CTA button — desktop */}
          <Link
            to="/funnel"
            className="px-8 py-3 bg-accent-blue rounded-[50px] text-[#050a15] font-bold hover:bg-white transition-colors text-sm md:text-base hidden md:block shadow-[0_0_15px_rgba(0,210,255,0.6)] hover:shadow-[0_0_25px_rgba(255,255,255,0.8)]"
          >
            SOUMISSION GRATUITE
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="md:hidden relative z-[60] flex flex-col justify-center items-center w-10 h-10 gap-[6px]"
          >
            <span
              className={`block h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                menuOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'
              }`}
            />
            <span
              className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${
                menuOpen ? 'opacity-0 w-0' : 'w-5'
              }`}
            />
            <span
              className={`block h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                menuOpen ? 'w-6 -rotate-45 -translate-y-[8px]' : 'w-6'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0, pointerEvents: 'auto' as const } : { opacity: 0, y: -12, pointerEvents: 'none' as const }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        className="md:hidden absolute top-full left-0 right-0 bg-[#050a15]/98 backdrop-blur-xl border-b border-white/10"
      >
        <nav className="container mx-auto px-6 py-6 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.path}
              initial={false}
              animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ delay: menuOpen ? i * 0.05 : 0, duration: 0.2 }}
            >
              <Link
                to={link.path}
                className={`flex items-center py-4 text-xl font-black tracking-widest uppercase border-b border-white/5 transition-colors hover:text-accent-blue ${
                  location.pathname === link.path ? 'text-accent-blue' : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}

          {/* CTA inside mobile menu */}
          <motion.div
            initial={false}
            animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ delay: menuOpen ? navLinks.length * 0.05 : 0, duration: 0.2 }}
            className="pt-4"
          >
            <Link
              to="/funnel"
              className="block w-full py-4 bg-accent-blue rounded-[50px] text-[#050a15] font-black text-center text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(0,210,255,0.5)] hover:bg-white transition-colors"
            >
              SOUMISSION GRATUITE <img src="/images/logo-fuser-sans-backk.png" alt="" className="inline h-6 w-auto object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </motion.header>
  );
}
