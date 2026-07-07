"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RunningHead, RiseLines, Reveal } from "./Sections";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────── WHAT WE BUILD — the architecture, assembled in front of you ───────────
   A COO-grade read of the system we actually build, told in BUILD ORDER: the
   company brain is the first thing you read, and its slab settles at the
   bottom of the stack diagram. Each next layer crossfades in as its slab
   drops onto the pile, so the reader never scrolls past the top of the stack
   and has to read back up. Desktop pins the stage; mobile reads 01 to 04 in
   simple flow. */

type Layer = {
  no: string;
  tag: string;
  slabTag: string;
  title: string;
  what: string;
  why: string;
  tone: "dark" | "light";
};

/* reading order: foundation first */
const LAYERS: Layer[] = [
  {
    no: "01",
    tag: "The foundation · data & memory",
    slabTag: "Foundation",
    title: "The company brain",
    what: "We consolidate the knowledge scattered across drives, inboxes, tickets, transcripts, and systems of record into one governed retrieval layer your agents can reason over. Vector and structured stores, role-based access, data lineage, and a private model boundary.",
    why: "This is the moat. Software can be rented by anyone; your data, decisions, and institutional memory cannot. Every layer above is only ever as good as this one.",
    tone: "light",
  },
  {
    no: "02",
    tag: "The engine · agentic execution",
    slabTag: "Execution",
    title: "Agents, automations, workflows",
    what: "On top of the brain we deploy narrow, supervised agents wired into the systems you already run. Each one owns a single outcome end to end: triage, draft, reconcile, route, report. Guardrails, evals, and human checkpoints, not a chatbot.",
    why: "You buy outcomes, not seats. The shift is from licensing more software to operating processes that execute, each one sharper because it reasons over your brain.",
    tone: "light",
  },
  {
    no: "03",
    tag: "The surface · human command",
    slabTag: "Command",
    title: "Control centers, dashboards, apps",
    what: "The people-facing layer. Control rooms, dashboards, and internal apps where your team directs the work: approve, override, inspect, and see what every agent did and why. Full audit trail, role-based views, one operating picture.",
    why: "Autonomy without visibility is a liability. Your people stay in command and the system stays accountable.",
    tone: "light",
  },
  {
    no: "04",
    tag: "The team · literacy & operation",
    slabTag: "People",
    title: "Train your people to run it",
    what: "Hands-on enablement: AI literacy, prompting, working alongside agents, reading the control surfaces, and troubleshooting when a process drifts. We hand over the keys, not a dependency.",
    why: "The capability has to outlast the engagement. When your team can extend and correct the system themselves, the moat stays yours.",
    tone: "light",
  },
];

const N = LAYERS.length;
const W = 0.24; // scroll-progress window per layer; the last holds to the end

/* ── the full-copy reading card, one per layer, crossfading in place ── */
function DetailCard({ layer, i, p }: { layer: Layer; i: number; p: MotionValue<number> }) {
  const s = i * W;
  const e = s + W;
  const first = i === 0;
  const last = i === N - 1;
  const dark = layer.tone === "dark";

  const opacity = useTransform(
    p,
    first ? [e - 0.05, e] : last ? [s, s + 0.05] : [s, s + 0.05, e - 0.05, e],
    first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(p, [s, s + 0.05], first ? [0, 0] : [18, 0]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        borderRadius: "18px",
        padding: "clamp(1.6rem, 2.6vw, 2.6rem)",
        background: dark
          ? "linear-gradient(158deg, var(--espresso) 0%, var(--espresso-2) 100%)"
          : "var(--card-cream)",
        border: dark
          ? "1px solid rgba(247,235,208,0.17)"
          : "1px solid var(--sepia)",
      }}
      className={`${dark ? "card-grain shadow-plate" : "shadow-artifact"} absolute inset-0 flex flex-col justify-center pointer-events-none`}
    >
      <div
        className="font-mono uppercase flex items-center gap-3"
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.3em",
          color: "var(--ember)",
        }}
      >
        Layer {layer.no} of {String(N).padStart(2, "0")}
        <span
          aria-hidden
          className="h-px w-8"
          style={{ background: dark ? "rgba(247,235,208,0.25)" : "var(--sepia-hi)" }}
        />
        <span style={{ color: dark ? "rgba(247,235,208,0.46)" : "var(--text-3)" }}>
          {layer.tag}
        </span>
      </div>

      <h3
        className="mt-4 font-serif font-light leading-[1.04] tracking-[-0.008em] text-balance"
        style={{
          fontSize: "clamp(1.9rem, 2.9vw, 2.8rem)",
          color: dark ? "var(--card-cream)" : "var(--text-1)",
        }}
      >
        {layer.title}
      </h3>

      <p
        className="mt-4 text-pretty"
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.62,
          color: dark ? "rgba(247,235,208,0.72)" : "var(--text-2)",
          maxWidth: "58ch",
        }}
      >
        {layer.what}
      </p>

      <p
        className="mt-5 pt-4 font-serif italic text-pretty"
        style={{
          borderTop: `1px solid ${dark ? "rgba(247,235,208,0.16)" : "var(--sepia)"}`,
          fontSize: "clamp(1rem, 1.25vw, 1.2rem)",
          lineHeight: 1.5,
          color: dark ? "rgba(247,235,208,0.9)" : "var(--text-1)",
          maxWidth: "52ch",
        }}
      >
        {layer.why}
      </p>
    </motion.div>
  );
}

/* ── one slab in the stack diagram; drops onto the pile when its turn comes ── */
function StackSlab({ layer, i, p }: { layer: Layer; i: number; p: MotionValue<number> }) {
  const s = i * W;
  const e = s + W;
  const last = i === N - 1;
  const dark = layer.tone === "dark";
  const foundation = i === 0;

  const opacity = useTransform(p, [s + 0.01, s + 0.06], [0, 1]);
  const y = useTransform(p, [s + 0.01, s + 0.08], [-30, 0]);
  /* ember ring while this layer is the one being read; the finished stack rests quiet */
  const ringOpacity = useTransform(
    p,
    last ? [s, s + 0.05, 0.94, 1] : [s, s + 0.05, e - 0.04, e],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        minHeight: foundation
          ? "clamp(6.5rem, 13vh, 8.5rem)"
          : "clamp(4rem, 8vh, 5rem)",
        borderRadius: "14px",
        background: foundation
          ? "linear-gradient(158deg, #FBF1D8 0%, #F3E3BE 100%)"
          : "var(--card-cream)",
        border: foundation
          ? "1.5px solid rgba(222,76,0,0.40)"
          : "1px solid var(--sepia)",
      }}
      className="shadow-plate relative flex items-center gap-5 px-6"
    >
      <span
        className="font-serif italic leading-none"
        style={{
          fontSize: foundation ? "2.1rem" : "1.5rem",
          color: "var(--ember)",
        }}
      >
        {layer.no}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className="font-serif leading-[1.1]"
          style={{
            fontSize: foundation ? "clamp(1.2rem, 1.5vw, 1.45rem)" : "clamp(1rem, 1.2vw, 1.15rem)",
            color: dark ? "var(--card-cream)" : "var(--text-1)",
          }}
        >
          {layer.title}
        </div>
        {foundation && (
          <div
            className="mt-1.5 font-mono uppercase"
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.28em",
              color: "var(--ember)",
            }}
          >
            Bedrock · everything rests here
          </div>
        )}
      </div>
      <span
        className="font-mono uppercase shrink-0"
        style={{
          fontSize: "0.52rem",
          letterSpacing: "0.26em",
          color: dark ? "rgba(247,235,208,0.42)" : "var(--text-3)",
        }}
      >
        {layer.slabTag}
      </span>

      {/* active ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: ringOpacity,
          borderRadius: "14px",
          border: "1.5px solid rgba(222,76,0,0.65)",
          boxShadow: "0 0 24px -6px rgba(222,76,0,0.4)",
        }}
      />
    </motion.div>
  );
}

/* ── mobile: simple flow, still read foundation-first ── */
function MobileLayer({ layer }: { layer: Layer }) {
  const dark = layer.tone === "dark";
  return (
    <Reveal
      y={24}
      className={`${dark ? "card-grain shadow-plate" : "shadow-artifact"} relative`}
      style={{
        borderRadius: "16px",
        padding: "1.5rem",
        background: dark
          ? "linear-gradient(158deg, var(--espresso) 0%, var(--espresso-2) 100%)"
          : "var(--card-cream)",
        border: dark
          ? "1px solid rgba(247,235,208,0.17)"
          : "1px solid var(--sepia)",
      }}
    >
      <div
        className="font-mono uppercase"
        style={{ fontSize: "0.56rem", letterSpacing: "0.28em", color: "var(--ember)" }}
      >
        Layer {layer.no} · {layer.slabTag}
      </div>
      <h3
        className="mt-3 font-serif font-light leading-[1.06] tracking-[-0.008em]"
        style={{
          fontSize: "1.55rem",
          color: dark ? "var(--card-cream)" : "var(--text-1)",
        }}
      >
        {layer.title}
      </h3>
      <p
        className="mt-3 text-pretty"
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: dark ? "rgba(247,235,208,0.72)" : "var(--text-2)",
        }}
      >
        {layer.what}
      </p>
      <p
        className="mt-4 pt-3 font-serif italic text-pretty"
        style={{
          borderTop: `1px solid ${dark ? "rgba(247,235,208,0.16)" : "var(--sepia)"}`,
          fontSize: "0.98rem",
          lineHeight: 1.5,
          color: dark ? "rgba(247,235,208,0.9)" : "var(--text-1)",
        }}
      >
        {layer.why}
      </p>
    </Reveal>
  );
}

export default function WhatWeBuild() {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section
      id="build"
      className="relative overflow-clip pt-28 md:pt-40 pb-20 md:pb-0"
      style={{
        background: "linear-gradient(to bottom, #1A130C 0%, #17110B 100%)",
      }}
    >
      {/* dusk falls: the journey's parchment daylight dissolves into the dark
          workshop. this is the page's day-to-night turn. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-44 md:h-64"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg) 0%, rgba(26,19,12,0) 100%)",
        }}
      />
      {/* a low warm lamp in the dark, top-left of the bench */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(80% 55% at 16% 18%, rgba(222,76,0,0.09), rgba(222,76,0,0) 60%)",
        }}
      />

      <div className="relative">
        <RunningHead left="Volume II" right="The Architecture" tone="light" />

        {/* ── intro: thesis on the left, the argument on the right ── */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-16 mt-12 pb-10 lg:pb-0">
          <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <Reveal
                y={14}
                className="font-mono uppercase mb-5"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.34em",
                  color: "var(--ember)",
                }}
              >
                What we actually build
              </Reveal>
              <RiseLines
                delay={0.08}
                className="font-serif font-light leading-[0.96] tracking-[-0.01em] text-balance"
                style={{
                  fontSize: "clamp(2.6rem, 5.4vw, 5.6rem)",
                  color: "var(--card-cream)",
                  maxWidth: "16ch",
                }}
                lines={[
                  <span key="a">We don&apos;t hand you tools.</span>,
                  <span key="b">
                    We build the{" "}
                    <em
                      className="not-italic"
                      style={{ color: "var(--ember)", fontStyle: "italic" }}
                    >
                      intelligence
                    </em>
                  </span>,
                  <span key="c">underneath them.</span>,
                ]}
              />
            </div>

            <Reveal y={18} delay={0.16} className="lg:pb-2">
              <p
                className="font-serif italic text-pretty"
                style={{
                  fontSize: "clamp(1.05rem, 1.35vw, 1.3rem)",
                  lineHeight: 1.52,
                  color: "rgba(247,235,208,0.92)",
                  maxWidth: "46ch",
                }}
              >
                Every layer rests on one foundation: a company brain that turns
                your scattered data, decisions, and institutional memory into a
                private, governed knowledge layer.
              </p>
              <p
                className="mt-4 text-pretty"
                style={{
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  color: "rgba(247,235,208,0.66)",
                  maxWidth: "52ch",
                }}
              >
                Buying more software adds surface area. Building the brain
                compounds a moat no competitor can license. From there: agents
                that deliver outcomes, the interfaces your team commands them
                from, and the literacy to run all of it without us.
              </p>
              <div
                className="mt-6 font-mono uppercase"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  color: "rgba(247,235,208,0.42)",
                }}
              >
                Read it in build order, foundation first
              </div>
            </Reveal>
          </div>
        </div>

        {isWide ? (
          /* ════════ DESKTOP: pinned stage — read a layer, watch it take its
             place in the stack, foundation first, building upward ════════ */
          <div ref={runwayRef} className="relative" style={{ height: "440vh" }}>
            <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden">
              <div className="flex flex-1 items-center">
                <div className="mx-auto grid w-full max-w-[1320px] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
                  {/* LEFT: the reading card, one layer at a time */}
                  <div className="relative" style={{ height: "min(62vh, 30rem)" }}>
                    {LAYERS.map((layer, i) => (
                      <DetailCard key={layer.no} layer={layer} i={i} p={p} />
                    ))}
                  </div>

                  {/* RIGHT: the stack, assembling bottom-up as you read */}
                  <div>
                    <div
                      className="flex flex-col justify-end gap-2.5"
                      style={{ minHeight: "min(54vh, 27rem)" }}
                    >
                      {[...LAYERS].reverse().map((layer) => {
                        const i = LAYERS.indexOf(layer);
                        return <StackSlab key={layer.no} layer={layer} i={i} p={p} />;
                      })}
                    </div>
                    <div
                      className="mt-5 flex items-center gap-4 font-mono uppercase"
                      style={{
                        fontSize: "0.56rem",
                        letterSpacing: "0.3em",
                        color: "rgba(247,235,208,0.45)",
                      }}
                    >
                      <svg width="11" height="14" viewBox="0 0 11 14" aria-hidden>
                        <path
                          d="M5.5 13V1M1 5.5L5.5 1L10 5.5"
                          stroke="var(--ember)"
                          strokeWidth="1.3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Each layer rests on the one below
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ════════ MOBILE: simple flow, still foundation-first ════════ */
          <div className="mx-auto max-w-[1320px] px-6 mt-2 flex flex-col gap-4">
            {LAYERS.map((layer) => (
              <MobileLayer key={layer.no} layer={layer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
