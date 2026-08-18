import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, CheckCircle2, ChevronLeft } from 'lucide-react';
import { SECTEURS } from '../constants/secteursData';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { usePageMeta } from '../hooks/usePageMeta';

export default function SecteurDetail() {
  const { slug } = useParams<{ slug: string }>();
  const secteur = SECTEURS.find((s) => s.slug === slug);

  usePageMeta(
    secteur ? `${secteur.metaTitle} | Propulsite` : 'Secteur desservi | Propulsite',
    secteur?.metaDescription,
  );

  if (!secteur) return <Navigate to="/" replace />;

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-accent-blue mb-10 min-h-[24px]"
        >
          <ChevronLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-accent-blue mb-5">
            <MapPin className="w-4 h-4" />
            {secteur.region}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            {secteur.titrePart1}
            <span className="text-accent-blue">{secteur.titreHighlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl">
            {secteur.intro}
          </p>
        </motion.div>

        <LiquidGlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-accent-blue pl-4">
            {secteur.contexte.titre}
          </h2>
          {secteur.contexte.paragraphes.map((p, i) => (
            <p key={i} className="text-lg text-white/70 leading-relaxed mb-6 last:mb-0">
              {p}
            </p>
          ))}
        </LiquidGlassCard>

        {secteur.blocs.map((bloc, i) => (
          <motion.div
            key={bloc.titre}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="mb-8"
          >
            <LiquidGlassCard>
              <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-accent-blue pl-4">
                {bloc.titre}
              </h2>
              {bloc.paragraphes?.map((p, j) => (
                <p key={j} className="text-lg text-white/70 leading-relaxed mb-6 last:mb-0">
                  {p}
                </p>
              ))}
              {bloc.items && (
                <ul className="space-y-4 mt-4">
                  {bloc.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent-blue mt-1 flex-shrink-0" />
                      <span className="text-lg text-white/70 leading-snug">
                        {item.bold && <strong className="text-white font-bold">{item.bold}</strong>}
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {/* La liste des villes appartient au bloc qui la nomme : la
                  répéter partout donnerait une page à mots-clés, pas une page
                  utile. */}
              {bloc.titre.includes('villes') && (
                <ul className="flex flex-wrap gap-3 mt-6">
                  {secteur.villes.map((v) => (
                    <li
                      key={v}
                      className="px-4 py-2 rounded-full border border-white/15 text-white/75 text-sm"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              )}
            </LiquidGlassCard>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 p-10 md:p-14 rounded-3xl text-center mt-14"
        >
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            Une analyse gratuite de votre présence locale
          </h2>
          <p className="text-white/65 mb-8 max-w-2xl mx-auto">
            On regarde votre fiche Google, votre site et vos concurrents directs
            dans votre ville. Quinze minutes, sans engagement — et on vous dit
            franchement si vous n'avez pas besoin de nous.
          </p>
          <Link
            to="/funnel"
            className="inline-flex items-center justify-center gap-2 bg-accent-blue text-[#050a15] font-black px-8 py-4 rounded-full hover:brightness-110 transition min-h-[48px]"
          >
            Demander mon analyse →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
