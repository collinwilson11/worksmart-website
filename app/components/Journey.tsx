"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import JourneyTrail, { JOURNEY_H, JOURNEY_W, LANDMARKS } from "./JourneyTrail";

const PHASES = [
  {
    num: "I",
    name: "Diagnose",
    deck:
      "We open the box and watch your business actually run — not the org chart, the real thing.",
    body:
      "Two weeks side-by-side with your team. We sit in on calls, follow the work through every system, and listen for the friction nobody talks about anymore. The output is an honest map of where time, money, and attention leak.",
    out: "Audit + opportunity map",
    weeks: "2 weeks",
  },
  {
    num: "II",
    name: "Design",
    deck:
      "A blueprint drawn before any code is written — every part, every connection, named on paper.",
    body:
      "Each fix gets sketched as a clean intervention. We name the agent, the data it touches, the human who owns it, and the metric that proves it worked. You sign off before we build a thing.",
    out: "Signed blueprint",
    weeks: "2 weeks",
  },
  {
    num: "III",
    name: "Build",
    deck:
      "Each part fabricated, tested, and set into place — one at a time, in plain view.",
    body:
      "No big bang. Components ship one by one, each observable from day one. You watch the machine come together part by part, and at every step the old way still works underneath.",
    out: "Working components",
    weeks: "4–6 weeks",
  },
  {
    num: "IV",
    name: "Train",
    deck: "Your team learns the controls — and we hand over the keys, room by room.",
    body:
      "A named owner for each component. A parallel-run period where humans and agents do the work together. Documentation written by us, tested by your people, until the machine is theirs to run.",
    out: "Trained team · named owners",
    weeks: "3 weeks",
  },
  {
    num: "V",
    name: "Refine",
    deck:
      "The machine runs. You watch the dials. We stay close, but you hold the wrench.",
    body:
      "Live dashboards, monthly reviews, and a standing channel for new ideas. Your team owns the operation. We are on retainer for harder questions and the next horizon.",
    out: "A business that runs",
    weeks: "Ongoing",
  },
];

export default function Journey() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (p) => {
      const idx = Math.min(PHASES.length - 1, Math.max(0, Math.floor(p * PHASES.length)));
      setStage(idx);
    });
  }, [scrollYProgress]);

  return (
    <section
      id="process"
      className="relative border-t border-b border-white/[0.10]"
      style={{
        background:
          "linear-gradient(180deg, #040c06 0%, #0a1410 50%, #040c06 100%)",
      }}
    >
      {/* Section intro */}
      <div className="mx-auto max-w-[1480px] px-6 md:px-16 pt-32 md:pt-40 pb-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-24 md:items-end">
          <div>
            <div className="eyebrow mb-7">Volume I — Process</div>
            <h2 className="font-serif font-light text-canvas leading-[1.05] tracking-[-0.025em] text-[clamp(40px,5vw,76px)] text-balance">
              The five-phase{" "}
              <em className="text-ember font-normal italic">partnership.</em>
            </h2>
          </div>
          <p className="font-serif italic text-pale text-[18px] md:text-[22px] leading-[1.55] max-w-[580px] text-pretty">
            Scroll on. Each phase is a landmark on the trail. The pin moves with
            you, and the further you go, the more of the road we&apos;ve walked
            together.
          </p>
        </div>
      </div>

      {/* Sticky scroll viewport */}
      <div ref={wrapRef} className="relative" style={{ height: `${PHASES.length * 100}vh` }}>
        <div className="sticky top-0 grid h-[100dvh] overflow-hidden md:grid-cols-[480px_1fr]">
          {/* Left — phase content */}
          <div className="relative z-[2] flex flex-col justify-center border-r border-white/[0.10] bg-deep px-8 py-16 md:px-12 md:py-20 md:pl-20">
            <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-stone mb-6 flex items-center gap-3">
              <em className="font-serif italic text-[28px] tracking-normal text-ember not-italic [font-style:italic]">
                Phase {PHASES[stage].num}
              </em>
              <span>· of V</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <h3 className="font-serif font-light text-canvas leading-none tracking-[-0.03em] text-[clamp(48px,5vw,84px)] mb-6 text-balance">
                  {PHASES[stage].name}
                  <em className="text-ember not-italic">.</em>
                </h3>
                <p className="font-serif italic text-ember-soft text-[20px] leading-[1.5] mb-6 text-pretty">
                  {PHASES[stage].deck}
                </p>
                <p className="text-pale text-[15px] leading-[1.75] max-w-[40ch] text-pretty">
                  {PHASES[stage].body}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg bg-parchment p-5">
                  <div>
                    <div className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-warm-black/65 mb-1.5">
                      Output
                    </div>
                    <div className="font-serif italic text-warm-black text-[18px] leading-[1.2]">
                      {PHASES[stage].out}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-warm-black/65 mb-1.5">
                      Duration
                    </div>
                    <div className="font-serif italic text-warm-black text-[18px] leading-[1.2]">
                      {PHASES[stage].weeks}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — animated trail viewport */}
          <TrailViewport stage={stage} />
        </div>
      </div>
    </section>
  );
}

function TrailViewport({ stage }: { stage: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [pin, setPin] = useState({ left: "50%", top: "50%" });

  useEffect(() => {
    const compute = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const panelW = wrap.clientWidth;
      const panelH = wrap.clientHeight;
      const svgRenderedW = panelH * (JOURNEY_W / JOURNEY_H);
      const lm = LANDMARKS[stage];
      const lmCssX = (lm.x / JOURNEY_W) * svgRenderedW;
      const lmCssY = (lm.y / JOURNEY_H) * panelH;
      setTranslateX(panelW / 2 - lmCssX);
      setPin({ left: `${panelW / 2}px`, top: `${lmCssY}px` });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [stage]);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(222,76,0,0.06) 0%, transparent 60%), #0a1410",
      }}
    >
      {/* Legend */}
      <div className="absolute top-7 left-7 z-[3] flex flex-col gap-1 border border-white/[0.10] bg-deep/60 px-4 py-3 backdrop-blur-sm">
        <span className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-stone">
          Plate I — The Trail
        </span>
        <span className="font-serif italic text-[14px] text-ember">Five Landmarks</span>
      </div>

      {/* Stage indicator */}
      <div className="absolute top-7 right-7 z-[3] flex items-center gap-3 border border-white/[0.10] bg-deep/60 px-4 py-3 backdrop-blur-sm">
        <span className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-stone">
          Stage
        </span>
        <span className="font-serif italic text-[16px] text-canvas">
          {LANDMARKS[stage].num}
        </span>
        <span className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-stone">
          / V
        </span>
      </div>

      {/* Trail (panning container) */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: translateX }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        <JourneyTrail stage={stage} />
      </motion.div>

      {/* Pin */}
      <motion.div
        className="absolute z-[5] pointer-events-none"
        style={{ transform: "translate(-50%, -100%)" }}
        animate={{ left: pin.left, top: pin.top }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 18 4 C 8 4 4 12 4 20 C 4 30 18 44 18 44 C 18 44 32 30 32 20 C 32 12 28 4 18 4 Z"
            fill="#de4c00"
            stroke="#fffefb"
            strokeWidth="1.5"
          />
          <circle cx="18" cy="20" r="6" fill="#fffefb" />
          <circle cx="18" cy="20" r="2.5" fill="#de4c00" />
        </svg>
        <span className="absolute left-1/2 -bottom-1 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-ember opacity-80 [animation:ws-pulse-dot_2s_ease-out_infinite]" />
      </motion.div>
    </div>
  );
}
