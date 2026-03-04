import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

const Star = ({ top, left, size, duration, delay, color = "white" }: any) => (
  <motion.div
    initial={{ opacity: 0.1, scale: 1 }}
    animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.2, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full shadow-[0_0_10px_currentColor]`}
    style={{
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
      backgroundColor: color,
      color: color
    }}
  />
);

const ShootingStar = () => {
  const [pos, setPos] = useState({ top: -10, left: -10, key: 0 });

  useEffect(() => {
    const trigger = () => {
      setPos({
        top: Math.random() * 40,
        left: Math.random() * 80 + 20,
        key: Math.random()
      });
    };
    const timeout = setTimeout(trigger, 3000 + Math.random() * 7000);
    return () => clearTimeout(timeout);
  }, [pos.key]);

  return (
    <motion.div
      key={pos.key}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [0, -500],
        y: [0, 500],
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{ duration: 1.2, ease: "linear" }}
      className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_20px_2px_white] z-10"
      style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
    />
  );
};

export default React.memo(function RocketBackground() {
  const { scrollYProgress } = useScroll();

  // No mouse tracking needed, rocket is static horizontally until scrolled


  // Generate random stars once
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      color: Math.random() > 0.8 ? "#00d2ff" : "white"
    }));
  }, []);

  // Following stars (parallax)
  const followingStars = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 2,
      speed: Math.random() * 200 + 100,
    }));
  }, []);

  const fireScale = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const fireOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const overallOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  // Propel rocket upwards while scrolling
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -3500]);
  const smoothY = useSpring(translateY, { stiffness: 45, damping: 20 });

  // Parallax for following stars
  const starParallax = useTransform(scrollYProgress, [0, 1], [0, 500]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050a15]">
      {/* Static Stars Background */}
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/input_file_0.png')" }}
      />

      {/* Dynamic Twinkling Stars */}
      {stars.map((star, i) => (
        <Star key={i} {...star} />
      ))}

      {/* Shooting Stars */}
      <ShootingStar />
      <ShootingStar />

      {/* Following Stars (Parallax) */}
      {followingStars.map((star, i) => (
        <motion.div
          key={`following-${i}`}
          className="absolute rounded-full bg-white shadow-[0_0_15px_white] z-10"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            y: useTransform(scrollYProgress, [0, 1], [0, star.speed])
          }}
        />
      ))}

      {/* Rocket Container */}
      <motion.div
        className="absolute inset-x-0 mx-auto top-[20%] md:top-[10%] flex justify-center w-[350px] md:w-[650px] z-[5]"
        style={{
          opacity: overallOpacity,
          scale: 0.9,
          y: smoothY,
        }}
      >
        {/* Idle Rocket */}
        <motion.img
          src="/images/rocket.webp"
          alt="Rocket Idle"
          className="w-full h-auto drop-shadow-[0_0_50px_rgba(0,210,255,0.4)] relative z-10"
          referrerPolicy="no-referrer"
        />

        {/* Generated Exhaust Fire */}
        <motion.div
          className="absolute bottom-[-15%] origin-top z-0"
          style={{
            opacity: fireOpacity,
            scaleY: fireScale,
            width: "30%",
            height: "150%",
            background: "linear-gradient(to bottom, #ffffff 0%, #00d2ff 30%, #001a4d 80%, transparent 100%)",
            filter: "blur(20px)",
            borderRadius: "100px",
          }}
          animate={{
            scaleX: [0.9, 1.1, 0.9],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 0.08,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Core Heat Exhaust */}
        <motion.div
          className="absolute bottom-[-5%] origin-top z-0"
          style={{
            opacity: fireOpacity,
            scaleY: fireScale,
            width: "15%",
            height: "80%",
            background: "linear-gradient(to bottom, #ffffff 0%, #aaddff 50%, transparent 100%)",
            filter: "blur(10px)",
            borderRadius: "100px",
          }}
          animate={{
            scaleX: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 0.05,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Space Dust / Particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/[0.02] to-transparent" />
    </div>
  );
});
