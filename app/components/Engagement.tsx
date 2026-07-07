"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { TopoDivider } from "./Decorations";

const ENGAGEMENTS = [
  {
    n: "I",
    name: "Diagnose",
    body:
      "We map where your team is already using AI, where it should be, and where it never should. Two weeks alongside your people, watching the work happen.",
  },
  {
    n: "II",
    name: "Design",
    body:
      "We architect a system around how the business actually thinks, not a stack borrowed from someone else's playbook. Every part is named on paper before we build.",
  },
  {
    n: "III",
    name: "Build",
    body:
      "Custom assistants, dashboards, pipelines, and integrations, built into the tools you already trust. Components ship one at a time, observable from day one.",
  },
  {
    n: "IV",
    name: "Train",
    body:
      "We teach the team to operate it. AI literacy is part of the deliverable, not a separate invoice. A named owner for every component.",
  },
  {
    n: "V",
    name: "Refine",
    body:
      "We tune, harden, and extend. The system gets sharper the longer it runs alongside you. Monthly reviews, live dashboards, and a standing channel.",
  },
];

const colVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function Engagement() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="practice"
      ref={ref}
      className="relative px-6 md:px-16 py-32 md:py-40"
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-20 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-24 md:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="eyebrow mb-7"
            >
              Engagement
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="font-serif font-light text-ink leading-[1.05] tracking-[-0.025em] text-[clamp(40px,5vw,76px)] text-balance"
            >
              A consulting engagement,{" "}
              <em className="text-ember font-normal italic">not a software sale.</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="font-serif italic text-ink-2 text-[18px] md:text-[22px] leading-[1.55] max-w-[580px] text-pretty"
          >
            Most shops sell tools and wave you off at the trailhead. We embed for a
            season, build the machine that fits your business, then teach your team
            to run it.
          </motion.p>
        </div>

        <TopoDivider />

        {/* Zigzag,odd up, even down (anti-3-equal-cards) */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.12 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-16 lg:gap-y-0"
        >
          {ENGAGEMENTS.map((e, i) => (
            <motion.div
              key={e.n}
              variants={colVariants}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className={`relative pr-8 ${i > 0 ? "lg:border-l lg:border-dotted lg:border-ink/20 lg:pl-8" : ""} ${i % 2 === 1 ? "lg:translate-y-12" : ""}`}
            >
              <div className="font-serif italic text-ember text-[96px] leading-none mb-12">
                {e.n}
              </div>
              <div className="font-serif text-ink text-[28px] md:text-[32px] leading-[1.1] tracking-[-0.02em] mb-5">
                {e.name}
              </div>
              <p className="text-ink-2 text-[15px] leading-[1.7] text-pretty">{e.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-24 grid gap-6 md:flex md:justify-between md:gap-8 border-t border-rule pt-8 font-mono text-[11px] tracking-[0.28em] uppercase text-ink-3">
          <span>
            <em className="not-italic text-ink">Volume I</em> · The five-phase
            partnership
          </span>
          <span>~ 13 weeks · ongoing thereafter</span>
          <span>Greenville, SC · 2024 —</span>
        </div>
      </div>
    </section>
  );
}
