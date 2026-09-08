import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import RocketBackground from './components/RocketBackground';
import Home from './pages/Home';
import Geo from './pages/Geo';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Funnel from './pages/Funnel';
import Blog from './pages/Blog';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import Legal from './pages/Legal';
import PainPointDetail from './pages/PainPointDetail';
import SecteurDetail from './pages/SecteurDetail';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import BandeauTemoins from './components/BandeauTemoins';
import { mesurerAppel } from './lib/mesure';

// Déclaration de gtag pour TypeScript
declare function gtag(...args: unknown[]): void;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Tracking GA4 : envoie un page_view à chaque changement de route
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname]);
  return null;
}

/**
 * Mesure les clics sur les numéros de téléphone.
 *
 * Un seul écouteur sur le document, plutôt qu'un `onClick` collé sur chaque
 * lien : il y en a quatre aujourd'hui (contact, funnel, pied de page) et le
 * prochain sera mesuré sans que personne ait à y penser. C'est la même raison
 * qui a fait mettre la formule de titre dans constants/services : une règle
 * répétée à quatre endroits finit toujours par diverger.
 */
function MesurerLesAppels() {
  useEffect(() => {
    const surClic = (e: MouseEvent) => {
      const cible = e.target as HTMLElement | null;
      if (cible?.closest?.('a[href^="tel:"]')) mesurerAppel();
    };
    document.addEventListener('click', surClic);
    return () => document.removeEventListener('click', surClic);
  }, []);
  return null;
}

// Contenu de l'app SANS routeur — partagé entre le client (BrowserRouter) et
// le pré-rendu SEO (StaticRouter dans scripts/prerender.ts).
export function AppContent() {
  return (
    <>
      <ScrollToTop />
      <MesurerLesAppels />
      <div className="min-h-screen relative">
        <RocketBackground />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/geo" element={<Geo />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/funnel" element={<Funnel />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<PainPointDetail />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:slug" element={<QuestionDetail />} />
            <Route path="/secteurs/:slug" element={<SecteurDetail />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        <BandeauTemoins />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <Analytics />
    </Router>
  );
}
