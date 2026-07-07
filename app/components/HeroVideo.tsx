"use client";

/**
 * Hero backdrop. The cinematic illustration sits behind the headline,
 * with motion-driven scroll transforms overlaying warm tint and contrast.
 */

import { motion, useScroll, useTransform, useSpring } from "motion/react";

export default function HeroVideo({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  const imgScale = useTransform(p, [0, 1], [1.04, 1.16]);
  const imgY = useTransform(p, [0, 1], ["0%", "-3%"]);
  const warmTintOpacity = useTransform(p, [0, 1], [0.18, 0.5]);
  const vignetteOpacity = useTransform(p, [0, 0.6, 1], [0.05, 0.18, 0.32]);

  return (
    <>
      {/* The illustration */}
      <motion.div
        aria-hidden
        style={{ scale: imgScale, y: imgY }}
        className="absolute inset-0 -z-[5] will-change-transform"
      >
        <img
          src="/hero-illustration.png"
          alt=""
          className="h-full w-full object-cover object-[center_70%]"
        />
      </motion.div>

      {/* Warm parchment tint to fold the image into the palette */}
      <motion.div
        aria-hidden
        style={{ opacity: warmTintOpacity }}
        className="absolute inset-0 -z-[4] pointer-events-none"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(243,236,224,0.55) 0%, rgba(243,236,224,0.10) 35%, rgba(232,196,138,0.10) 70%, rgba(217,178,119,0.40) 100%)",
            mixBlendMode: "soft-light",
          }}
        />
      </motion.div>

      {/* Soft vignette for headline contrast */}
      <motion.div
        aria-hidden
        style={{ opacity: vignetteOpacity }}
        className="absolute inset-0 -z-[3] pointer-events-none"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse 65% 75% at 50% 45%, rgba(39,21,3,0) 0%, rgba(39,21,3,0.18) 70%, rgba(39,21,3,0.35) 100%)",
          }}
        />
      </motion.div>
    </>
  );
}
