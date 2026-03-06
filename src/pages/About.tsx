import React from 'react';
import { motion } from 'motion/react';
import { Target, Search, Users, Smartphone, Star, TrendingUp, Handshake, Lightbulb, Zap, Rocket, CheckCircle2, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 relative z-10 overflow-hidden min-h-screen">

      {/* Background Glows */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto max-w-5xl">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,198,255,0.3)]">
            À propos
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            ON BÂTIT DES PRÉSENCES NUMÉRIQUES QUI FONT <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-purple-400 italic">UNE VRAIE DIFFÉRENCE</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Propulsite, c'est une agence humaine, passionnée et engagée à faire grandir les entreprises d'ici.
          </p>
        </motion.section>

        {/* HISTOIRE */}
        <section className="mb-32">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-accent-blue text-sm font-bold tracking-widest uppercase">Notre histoire</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Né d'une conviction simple</h2>
              <div className="space-y-4 text-white/70 text-lg leading-relaxed">
                <p>
                  Propulsite a vu le jour avec une idée claire : trop d'entreprises québécoises méritent mieux que ce qu'elles ont en ligne. Un site vieillissant, une visibilité inexistante, une image qui ne reflète pas leur vrai talent.
                </p>
                <p>
                  On a donc décidé de changer ça — un client à la fois, avec des stratégies sur mesure, un design soigné et une approche qui met les résultats avant tout.
                </p>
                <p>
                  Aujourd'hui, Propulsite accompagne des entrepreneurs et des PME à travers le Québec pour qu'ils occupent la place qu'ils méritent sur le web.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-3xl h-80 flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(0,198,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="/images/logo-fuser-sans-backk.png"
                alt="Propulsite Logo"
                className="w-48 h-auto filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-accent-blue font-bold tracking-widest uppercase text-sm z-10 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Propulsite — Québec
              </span>
            </motion.div>
          </div>
        </section>

        {/* VALEURS */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <div className="text-accent-blue text-sm font-bold tracking-widest uppercase mb-4">Ce qui nous guide</div>
            <h2 className="text-3xl md:text-5xl font-black text-white">Nos valeurs</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Handshake />, title: "Proximité", desc: "On travaille avec vous, pas juste pour vous. Votre succès est notre priorité à chaque étape." },
              { icon: <Lightbulb />, title: "Créativité", desc: "On n'utilise pas de modèles génériques. Chaque stratégie est pensée spécifiquement pour vous." },
              { icon: <TrendingUp />, title: "Résultats", desc: "Le beau design, c'est bien. Celui qui génère des clients, c'est mieux. On vise toujours les deux." },
              { icon: <Search />, title: "Transparence", desc: "Pas de jargon inutile, pas de cachettes. Vous savez toujours ce qu'on fait et pourquoi." },
              { icon: <Zap />, title: "Réactivité", desc: "On répond vite et on livre dans les délais. Votre temps est précieux, on le respecte." },
              { icon: <MapPin />, title: "Engagement local", desc: "On est fiers d'aider les entreprises d'ici à rayonner. Le Québec a des talents extraordinaires." }
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-accent-blue/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,198,255,0.15)] group"
              >
                <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue mb-6 border border-accent-blue/20 group-hover:scale-110 transition-transform">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm md:text-base">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LE FONDATEUR */}
        <section className="mb-32 bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden hover:border-accent-blue/30 transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-3xl">
            <div className="text-accent-blue text-sm font-bold tracking-widest uppercase mb-4">Fondateur</div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">William Suriol</h2>
            <div className="text-white/40 font-medium mb-8 text-lg">Fondateur & Stratège numérique</div>

            <div className="space-y-4 text-white/70 text-lg leading-relaxed mb-10">
              <p>
                Bonjour! Moi c'est William. J'ai fondé Propulsite parce que j'ai toujours cru que chaque entrepreneur mérite une présence en ligne à la hauteur de son travail.
              </p>
              <p>
                Passionné par le marketing numérique, le design et les stratégies de croissance, j'accompagne mes clients avec une approche directe et humaine. Pas de langue de bois — juste des solutions concrètes qui fonctionnent.
              </p>
              <p>
                Ce que j'aime le plus dans mon travail? Voir un client décrocher son téléphone parce qu'un nouveau client l'a trouvé sur Google. C'est pour ça que je fais ce métier.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {['Google Ads', 'SEO', 'Design web', 'Facebook Ads', 'Médias sociaux', 'Stratégie numérique'].map((tag, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center relative py-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-transparent to-accent-blue/5 rounded-3xl blur-xl -z-10"></div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">ON JASE?</h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Vous avez un projet en tête? On adorerait en entendre parler. La première consultation est gratuite.
          </p>
          <a
            href="mailto:propulsiteprojet@gmail.com"
            className="inline-flex px-8 py-4 bg-accent-blue text-[#050a15] rounded-full font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(0,198,255,0.4)]"
          >
            Prendre contact →
          </a>
        </motion.section>

      </div>
    </div>
  );
}
