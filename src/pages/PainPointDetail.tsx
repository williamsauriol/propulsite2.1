import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PAIN_POINTS_ARTICLES } from '../constants/painPointsData';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { usePageMeta } from '../hooks/usePageMeta';

export default function PainPointDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = PAIN_POINTS_ARTICLES.find((a) => a.slug === slug);

  usePageMeta(
    article ? `${article.titlePart1}${article.titleHighlight}${article.titlePart3 || ''} | Propulsite` : 'Article – Propulsite',
    article ? article.intro : undefined
  );

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="pt-32 pb-24 px-6 relative z-10 overflow-hidden min-h-screen">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-accent-blue mb-8 hover:gap-4 transition-all font-bold uppercase tracking-widest text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Retour au blog
        </Link>
        
        {/* HERO SECTION */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-bold tracking-widest uppercase mb-6">
            {article.tag}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white">
            {article.titlePart1}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-blue-400">
              {article.titleHighlight}
            </span>
            {article.titlePart3}
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            {article.intro}
          </p>
          <div className="mt-6 text-sm text-white/40 font-medium tracking-wide">
            Par <span className="text-white/70 font-bold">William Sauriol</span>
            {article.datePublished && (
              <>
                {' '}· Publié le{' '}
                {new Date(`${article.datePublished}T00:00:00`).toLocaleDateString('fr-CA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </>
            )}
          </div>
        </motion.div>

        {/* CONTENT BLOCKS */}
        <div className="space-y-12 mb-20">
          {article.blocks.map((block, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <LiquidGlassCard className="h-full group-hover:border-accent-blue/50">
                   <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-accent-blue pl-4">
                     {block.title}
                   </h2>
                   
                   {block.paragraphs && block.paragraphs.map((p, i) => (
                     <p key={i} className="text-lg text-white/70 leading-relaxed mb-6 last:mb-0">
                       {p}
                     </p>
                   ))}
                   
                   {block.listItems && (
                     <ul className="space-y-4 mb-6 mt-4">
                       {block.listItems.map((item, i) => (
                         <li key={i} className="flex items-start gap-3">
                           <CheckCircle2 className="w-6 h-6 text-accent-blue mt-1 flex-shrink-0" />
                           <span className="text-lg text-white/70 leading-snug">
                             {item.bold && <strong className="text-white font-bold">{item.bold}</strong>}
                             {item.text}
                           </span>
                         </li>
                       ))}
                     </ul>
                   )}
                   
                   {block.solutionBox && (
                     <div className="mt-8 bg-accent-blue/10 border border-accent-blue/30 rounded-xl p-6 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/20 rounded-full blur-[40px] transform group-hover:scale-150 transition-transform duration-700"></div>
                       <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start">
                         <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0 border border-accent-blue/30 text-accent-blue">
                           <AlertCircle className="w-6 h-6" />
                         </div>
                         <div>
                           <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
                             {block.solutionBox.label}
                           </div>
                           <p className="text-blue-100/90 text-[16px] leading-relaxed">
                             {block.solutionBox.text}
                           </p>
                         </div>
                       </div>
                     </div>
                   )}
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>

        {/* CTA SECTION */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#0a1930] to-[#050a15] border border-accent-blue/30 p-10 md:p-14 rounded-3xl text-center overflow-hidden shadow-[0_0_50px_rgba(0,198,255,0.2)]"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-6 text-white uppercase italic">
                    {article.cta.title}
                </h2>
                <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                    {article.cta.desc}
                </p>
                <div className="flex justify-center">
                    <Link
                        to={article.cta.btnLink}
                        className="px-10 py-5 bubble-glass rounded-full text-white font-black uppercase tracking-widest hover:text-accent-blue transition-all duration-300 shadow-[0_0_20px_rgba(0,198,255,0.3)] hover:translate-y-[-2px]"
                    >
                        {article.cta.btnText}
                    </Link>
                </div>
            </div>
        </motion.div>
        
      </div>
    </div>
  );
}
