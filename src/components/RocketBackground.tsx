import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useLocation } from 'react-router-dom';

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
    const timeout = setTimeout(trigger, 2000 + Math.random() * 5000);
    return () => clearTimeout(timeout);
  }, [pos.key]);

  return (
    <motion.div
      key={pos.key}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [0, -600],
        y: [0, 600],
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0]
      }}
      transition={{ duration: 1.5, ease: "linear" }}
      className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_20px_2px_white] z-10"
      style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
    />
  );
};

export default React.memo(function RocketBackground() {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();

  const isHome = pathname === '/';
  const isServices = pathname.startsWith('/services');
  const isAbout = pathname === '/a-propos';
  const isContact = pathname === '/contact';
  const isFunnel = pathname === '/funnel';

  // Increase the number of stars for more life
  const stars = useMemo(() => {
    return Array.from({ length: 250 }).map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 1.5,
      delay: Math.random() * 5,
      color: Math.random() > 0.8 ? "#00d2ff" : (Math.random() > 0.9 ? "#ff00d2" : "white")
    }));
  }, []);

  // Following stars (parallax)
  const followingStars = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 250 + 100,
    }));
  }, []);

  const fireScale = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const fireOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const overallOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  // Propel rocket upwards while scrolling
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -3500]);
  const smoothY = useSpring(translateY, { stiffness: 45, damping: 20 });

  // Background color logic depending on page
  let bgColor = "bg-[#050a15]"; // Default Home
  if (isServices) bgColor = "bg-[#050c20]"; // Deeper blue/purple hint
  if (isAbout) bgColor = "bg-[#100515]"; // Slight purple/dark red hint
  if (isContact) bgColor = "bg-[#051515]"; // Slight green/teal hint
  if (isFunnel) bgColor = "bg-[#060b20]"; // Futuristic dark violet/blue

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 ${bgColor}`}>
      {/* Static Stars Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: "url('/input_file_0.png')", opacity: isHome ? 0.4 : 0.15 }}
      />

      {/* Dynamic Ambient Orbs for specific pages to differentiate them */}
      {isServices && (
        <motion.div
          className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isAbout && (
        <motion.div
          className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-[#ff00d2]/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isContact && (
        <motion.div
          className="absolute bottom-[10%] left-[30%] w-[700px] h-[700px] bg-[#00ff88]/10 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isFunnel && (
        <motion.div
          className="absolute top-[20%] right-[20%] w-[800px] h-[800px] bg-[#00d2ff]/10 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2], rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Dynamic Twinkling Stars */}
      <div className={`transition-opacity duration-1000 ${isHome ? 'opacity-100' : 'opacity-80'}`}>
        {stars.map((star, i) => (
          <Star key={i} {...star} />
        ))}
      </div>

      {/* Shooting Stars - More active on non-home pages */}
      <ShootingStar />
      <ShootingStar />
      {!isHome && <ShootingStar />}
      {!isHome && <ShootingStar />}

      {/* Following Stars (Parallax) */}
      <div className={`transition-opacity duration-1000 ${isHome ? 'opacity-100' : 'opacity-60'}`}>
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
      </div>

      {/* Rocket Container - ONLY ON HOME */}
      {isHome && (
        <motion.div
          className="absolute inset-x-0 mx-auto top-[20%] md:top-[10%] flex justify-center w-[350px] md:w-[650px] z-[5]"
          style={{
            opacity: overallOpacity,
            scale: 0.9,
            y: smoothY,
          }}
        >
          <motion.div
            className="relative w-full flex justify-center"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
        </motion.div>
      )}

      {/* Space Dust / Particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/[0.02] to-transparent" />
    </div>
  );
});
