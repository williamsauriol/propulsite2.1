import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Hide header on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

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

        {/* Links (Centered) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-accent-blue ${location.pathname === link.path ? 'text-accent-blue' : 'text-white/70'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Button (Right) */}
        <div className="flex-1 flex justify-end">
          <Link
            to="/funnel"
            className="px-8 py-3 bg-accent-blue rounded-[50px] text-[#050a15] font-bold hover:bg-white transition-colors text-sm md:text-base hidden sm:block shadow-[0_0_15px_rgba(0,210,255,0.6)] hover:shadow-[0_0_25px_rgba(255,255,255,0.8)]"
          >
            DÉCOLLAGE
          </Link>
        </div>

      </div>
    </motion.header>
  );
}
