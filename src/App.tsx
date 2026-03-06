import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RocketBackground from './components/RocketBackground';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Funnel from './pages/Funnel';
import Blog from './pages/Blog';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen relative">
        <RocketBackground />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/funnel" element={<Funnel />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>

        <footer className="py-12 px-6 border-t border-white/5 relative z-10 bg-black/50 backdrop-blur-md">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <span className="text-2xl font-bold tracking-tighter text-white">PROPULSITE</span>
              <p className="text-white/40 text-sm mt-2">© 2026 Tous droits réservés. Agence Propulsite.</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-white/60 hover:text-accent-blue transition-colors">Politique de confidentialité</a>
              <a href="#" className="text-white/60 hover:text-accent-blue transition-colors">Conditions d'utilisation</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
