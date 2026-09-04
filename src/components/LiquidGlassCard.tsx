import React from 'react';
import { motion } from 'motion/react';

interface LiquidGlassCardProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function LiquidGlassCard({ children, className = '', delay = 0 }: LiquidGlassCardProps) {
  return (
    // On anime `y` seulement, jamais `opacity`. En SSR, motion écrit l'état
    // initial en style inline : un `opacity: 0` laisserait tout le contenu des
    // cartes invisible dans le HTML pré-rendu que lisent Google et les IA.
    <motion.div
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`bubble-glass p-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
