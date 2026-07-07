"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis-powered smooth scroll, mounted once at the root.
 * Tuned for a calm editorial feel — no rubber-band, no overshoot.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Respect reduced-motion users
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
    });

    // dev-only handle for scroll-driven preview/debugging
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
