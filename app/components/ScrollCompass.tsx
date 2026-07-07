"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

/* ─────────── SCROLL COMPASS — a pocket instrument in the corner ───────────
   A small parchment compass fixed bottom-left (desktop only). The needle
   sweeps one full revolution over the length of the page, so the reader can
   feel how deep into the journey they are. It reads as a physical object, so
   it sits comfortably over both the daylight and the night chapters. */

export default function ScrollCompass() {
  const { scrollYProgress } = useScroll();
  const angle = useSpring(useTransform(scrollYProgress, [0, 1], [0, 360]), {
    stiffness: 55,
    damping: 18,
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-6 left-6 z-[60] hidden lg:block"
    >
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: 58,
          height: 58,
          background:
            "radial-gradient(circle at 34% 28%, #F4E4BF 0%, #E5D0A0 70%, #D8C188 100%)",
          border: "1px solid rgba(80,55,30,0.55)",
          boxShadow:
            "inset 0 1px 0 rgba(255,250,240,0.6), 0 2px 6px rgba(20,15,9,0.3), 0 10px 24px -8px rgba(20,15,9,0.45)",
        }}
      >
        {/* dial ticks */}
        <svg width="58" height="58" viewBox="0 0 58 58" className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const cardinal = i % 2 === 0;
            const r1 = cardinal ? 21 : 23;
            return (
              <line
                key={i}
                x1={29 + Math.sin(a) * r1}
                y1={29 - Math.cos(a) * r1}
                x2={29 + Math.sin(a) * 25.5}
                y2={29 - Math.cos(a) * 25.5}
                stroke="rgba(80,55,30,0.55)"
                strokeWidth={cardinal ? 1.3 : 0.8}
                strokeLinecap="round"
              />
            );
          })}
          <circle
            cx="29"
            cy="29"
            r="26.5"
            fill="none"
            stroke="rgba(80,55,30,0.3)"
            strokeWidth="0.8"
          />
        </svg>

        {/* needle: rotate an HTML wrapper (guaranteed center origin), not the
            svg element itself, whose transform origin rules differ */}
        <motion.div className="absolute inset-0" style={{ rotate: angle }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <path d="M29 9 L32.4 29 L25.6 29 Z" fill="var(--ember)" />
            <path d="M29 49 L32.4 29 L25.6 29 Z" fill="rgba(43,33,24,0.8)" />
            <circle cx="29" cy="29" r="2.4" fill="#2B2118" />
            <circle cx="29" cy="29" r="1" fill="#F4E4BF" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
