"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion } from "motion/react";

const ease = [0.32, 0.72, 0, 1] as const;

const phases = [
  {
    range: [0, 0.34] as [number, number],
    num: "01",
    heading: "You control\nthe trigger.",
    body: "A single press, a double tap, or a long hold — you decide exactly when CLiKR AI fires.",
  },
  {
    range: [0.34, 0.68] as [number, number],
    num: "02",
    heading: "You design\nthe action.",
    body: "Connect it to anything — smart home scenes, AI shortcuts, custom multi-step workflows. Built by you.",
  },
  {
    range: [0.68, 1.01] as [number, number],
    num: "03",
    heading: "Press it.\nWatch it happen.",
    body: "Every CLiKR AI is different because every person is different. Make yours yours.",
  },
];

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setProgress(p);
    const v = videoRef.current;
    if (v && v.readyState >= 2 && v.duration) {
      v.currentTime = p * v.duration;
    }
  });

  const activeIdx = phases.findIndex(
    (ph) => progress >= ph.range[0] && progress < ph.range[1]
  );

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      style={{ height: "500vh" }}
    >
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col md:flex-row"
        style={{ background: "#FFFFFF" }}
      >
        {/* ── Eyebrow / brand mark at top ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-12 pt-8 z-10 pointer-events-none"
        >
          <span
            className="font-display font-extrabold text-lg tracking-[-0.02em]"
            style={{ color: "var(--text-1)" }}
          >
            CLiKR<span style={{ color: "var(--accent)" }}>AI</span>
          </span>
          <span
            className="font-sans text-[0.65rem] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            Scroll to explore
          </span>
        </motion.div>

        {/* ── Left: Video ── */}
        <div className="flex-1 relative flex items-center justify-center p-8 md:p-12 pt-20 md:pt-8">
          <video
            ref={videoRef}
            src="/exploded-view.mp4"
            className="w-full h-full object-contain"
            muted
            playsInline
            preload="auto"
          />
        </div>

        {/* ── Right: Text column ── */}
        <div
          className="hidden md:flex flex-col justify-center relative px-12 pr-16 shrink-0"
          style={{
            width: "42%",
            borderLeft: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {phases.map((phase, i) => {
            const visible = i === activeIdx;
            return (
              <div
                key={i}
                className="absolute inset-x-12 inset-y-0 flex flex-col justify-center pr-4"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: `translateY(${visible ? 0 : 18}px)`,
                  transition:
                    "opacity 750ms cubic-bezier(0.32,0.72,0,1), transform 750ms cubic-bezier(0.32,0.72,0,1)",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <span
                  className="font-sans text-[0.6rem] font-semibold tracking-[0.28em] uppercase mb-6 block"
                  style={{ color: "var(--accent)" }}
                >
                  {phase.num}
                </span>
                <h2
                  className="font-display font-extrabold leading-[1.04] tracking-[-0.025em]"
                  style={{
                    fontSize: "clamp(2.25rem, 3.5vw, 3.5rem)",
                    color: "var(--text-1)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {phase.heading}
                </h2>
                <p
                  className="mt-5 font-light leading-relaxed max-w-xs"
                  style={{ color: "var(--text-2)", fontSize: "1.0625rem" }}
                >
                  {phase.body}
                </p>

                {/* CTA on last phase */}
                {i === phases.length - 1 && (
                  <a
                    href="#reserve"
                    className="group inline-flex items-center gap-2.5 font-display font-bold tracking-wide rounded-full mt-9 px-6 py-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      width: "fit-content",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.boxShadow =
                        "0 0 30px var(--accent-glow)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.boxShadow = "none")
                    }
                  >
                    Reserve Yours
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                      ↗
                    </span>
                  </a>
                )}
              </div>
            );
          })}

          {/* Progress indicator */}
          <div className="absolute bottom-10 left-12 flex gap-2">
            {phases.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  width: "0.35rem",
                  height: "0.35rem",
                  background:
                    i === activeIdx
                      ? "var(--accent)"
                      : "rgba(0,0,0,0.18)",
                  transform: i === activeIdx ? "scale(1.6)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile: text below video ── */}
        <div className="flex md:hidden items-start px-6 pb-10 shrink-0" style={{ height: "38%" }}>
          {phases.map((phase, i) => {
            const visible = i === activeIdx;
            return (
              <div
                key={i}
                className="absolute px-6"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: `translateY(${visible ? 0 : 12}px)`,
                  transition:
                    "opacity 600ms cubic-bezier(0.32,0.72,0,1), transform 600ms cubic-bezier(0.32,0.72,0,1)",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <span
                  className="font-sans text-[0.6rem] font-semibold tracking-[0.28em] uppercase mb-3 block"
                  style={{ color: "var(--accent)" }}
                >
                  {phase.num}
                </span>
                <h2
                  className="font-display font-extrabold leading-[1.05] tracking-[-0.02em]"
                  style={{ fontSize: "2rem", color: "var(--text-1)", whiteSpace: "pre-line" }}
                >
                  {phase.heading}
                </h2>
                <p
                  className="mt-3 font-light leading-relaxed text-[0.9rem]"
                  style={{ color: "var(--text-2)" }}
                >
                  {phase.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
