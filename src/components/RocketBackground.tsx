import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'motion/react';
import { useLocation } from 'react-router-dom';

// Detect low-power devices (mobile / small screens)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

const Star = ({ top, left, size, duration, delay, color = "white" }: any) => (
  <motion.div
    initial={{ opacity: 0.1, scale: 1 }}
    animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.2, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full`}
    style={{
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
      backgroundColor: color,
    }}
  />
);

// Parallax star as a standalone component to respect rules of hooks
const ParallaxStar = ({ top, left, size, speedRatio, scrollYProgress }: {
  top: number; left: number; size: number; speedRatio: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const y = useTransform(scrollYProgress, [0, 1], [0, speedRatio * 800]);
  return (
    <motion.div
      className="absolute rounded-full bg-white z-10"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: size,
        height: size,
        y,
        willChange: 'transform',
      }}
    />
  );
};

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
  // Décoratif et dépendant du navigateur : on ne le rend pas côté serveur
  // (pré-rendu SEO). Le client le rend normalement après le montage.
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();

  const isHome = pathname === '/';
  const isServices = pathname.startsWith('/services');
  const isAbout = pathname === '/a-propos';
  const isContact = pathname === '/contact';
  const isFunnel = pathname === '/funnel';

  // Fewer stars on mobile to reduce CPU/GPU load
  const starCount = isMobile ? 60 : 150;
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 1.5,
      delay: Math.random() * 5,
      color: Math.random() > 0.8 ? "#00d2ff" : (Math.random() > 0.9 ? "#ff00d2" : "white")
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starCount]);

  // Fewer parallax stars on mobile
  const followingStarCount = isMobile ? 4 : 12;
  const followingStars = useMemo(() => {
    return Array.from({ length: followingStarCount }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speedRatio: Math.random() * 0.3 + 0.1, // 0.1–0.4 of viewport
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followingStarCount]);

  const fireScale = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const fireOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const overallOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  // Scroll-driven Y: use spring only on desktop for smoothness
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -3500]);
  const springY = useSpring(translateY, { stiffness: 45, damping: 20 });
  const rocketY = isMobile ? translateY : springY;

  // Background color logic depending on page
  let bgColor = "bg-[#050a15]";
  if (isServices) bgColor = "bg-[#050c20]";
  if (isAbout) bgColor = "bg-[#100515]";
  if (isContact) bgColor = "bg-[#051515]";
  if (isFunnel) bgColor = "bg-[#060b20]";

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 ${bgColor}`}>
      {/* Static Stars Background (CSS only — no image request) */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isHome ? 0.5 : 0.2,
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 65%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(2px 2px at 42% 12%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(1px 1px at 58% 80%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 72% 35%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 58%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 42%, rgba(255,255,255,0.15) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 65% 90%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 88%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(2px 2px at 92% 15%, rgba(0,210,255,0.3) 0%, transparent 100%)
          `,
        }}
      />

      {/* Dynamic Ambient Orbs */}
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

      {/* Shooting Stars — desktop only */}
      {!isMobile && <ShootingStar />}
      {!isMobile && <ShootingStar />}
      {!isMobile && !isHome && <ShootingStar />}
      {!isMobile && !isHome && <ShootingStar />}

      {/* Following Stars (Parallax) */}
      <div className={`transition-opacity duration-1000 ${isHome ? 'opacity-100' : 'opacity-60'}`}>
        {followingStars.map((star, i) => (
          <ParallaxStar
            key={`following-${i}`}
            {...star}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Rocket — ONLY ON HOME */}
      {isHome && (
        <motion.div
          className="absolute inset-x-0 mx-auto top-[20%] md:top-[10%] flex justify-center w-[350px] md:w-[650px] z-[5]"
          style={{
            opacity: overallOpacity,
            scale: 0.9,
            y: rocketY,
            willChange: 'transform',
          }}
        >
          <motion.div
            className="relative w-full flex justify-center"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: 'transform' }}
          >
            {/* Idle Rocket */}
            <motion.img
              src="/images/rocket.webp"
              alt="Rocket Idle"
              className="w-full h-auto drop-shadow-[0_0_50px_rgba(0,210,255,0.4)] relative z-10"
              referrerPolicy="no-referrer"
              style={{ willChange: 'transform' }}
            />

            {/* Exhaust Fire — slower animation = less CPU load */}
            <motion.div
              className="absolute top-[85%] left-1/2 -translate-x-1/2 origin-top z-0"
              style={{
                opacity: fireOpacity,
                scaleY: fireScale,
                width: "25%",
                height: "120%",
                background: "linear-gradient(to bottom, #ffffff 0%, #00d2ff 30%, #001a4d 80%, transparent 100%)",
                filter: "blur(20px)",
                borderRadius: "100px",
                willChange: 'transform, opacity',
              }}
              animate={{
                scaleX: [0.9, 1.1, 0.9],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                // Slowed down significantly: was 0.08s (too fast for mobile)
                duration: isMobile ? 0.6 : 0.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Core Heat Exhaust */}
            <motion.div
              className="absolute top-[85%] left-1/2 -translate-x-1/2 origin-top z-0"
              style={{
                opacity: fireOpacity,
                scaleY: fireScale,
                width: "12%",
                height: "80%",
                background: "linear-gradient(to bottom, #ffffff 0%, #aaddff 50%, transparent 100%)",
                filter: "blur(10px)",
                borderRadius: "100px",
                willChange: 'transform',
              }}
              animate={{
                scaleX: [0.95, 1.05, 0.95],
              }}
              transition={{
                // Slowed down significantly: was 0.05s (extremely aggressive)
                duration: isMobile ? 0.8 : 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Space Dust */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/[0.02] to-transparent" />
    </div>
  );
});
