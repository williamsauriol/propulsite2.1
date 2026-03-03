import React from 'react';
import { motion } from 'motion/react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function LiquidGlassCard({ children, className = '', delay = 0 }: LiquidGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`bubble-glass p-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
