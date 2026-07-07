"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";

/**
 * THE WORKSMART EXPEDITION — a pinned cinematic process.
 *
 * Desktop: one fixed composition that does not scroll. A matted expedition
 * map sits on the left inside its own aged panel; a single immersive stage
 * card holds the right. As the reader scrolls the tall (≈520vh) container,
 * the trail marker climbs from waypoint to waypoint, the active waypoint
 * lights burnt-orange, and the stage card crossfades its full-bleed plate
 * and its copy in place. After the fifth plate, the section releases.
 *
 * Mobile: a single-column field journal. A trail line runs down the page;
 * each stage is a full-image plate with a warm-dark overlay and cream copy,
 * its waypoint lighting as it enters view.
 */

/* The plotted route, authored to pass through the five painted landmarks of
   aerial-trail.png (firetower at the bottom, summit at the top), in a 113×200
   viewBox that matches the map sheet's 1520×2688 aspect. The waypoint dots sit
   on these anchors; the marker rides this curve between them. */
const ROUTE_D =
  "M 34 176 C 40 160 38 145 45 128 C 52 112 64 122 71 116 C 80 110 66 92 60 80 C 54 66 70 45 76 22";
const ANCHORS: { x: number; y: number }[] = [
  { x: 34, y: 176 },
  { x: 45, y: 128 },
  { x: 71, y: 116 },
  { x: 60, y: 80 },
  { x: 76, y: 22 },
];

type Phase = {
  num: string;
  numWord: string;
  name: string;
  landmark: string;
  deck: string;
  body: string;
  details: string[];
  out: string;
  weeks: string;
  vignette: string;
};

const PHASES: Phase[] = [
  {
    num: "I",
    numWord: "One",
    name: "Discover",
    landmark: "Firetower Camp",
    deck:
      "Two weeks beside your team. We watch the real work happen, not the org chart.",
    body:
      "We sit in on calls, follow tickets through every system, and shadow the people who actually run the business, so we see the real work, not the org chart.",
    details: [
      "Shadow three nominated workflows for two weeks",
      "Interview the five to eight people closest to the friction",
      "Map every tool, integration, and silent hand-off",
      "Rank findings by recovered hours, dollars, risk",
    ],
    out: "Audit + ranked opportunity map",
    weeks: "2 weeks",
    vignette: "/illustrations/vignette-1-trailhead.png",
  },
  {
    num: "II",
    numWord: "Two",
    name: "Design",
    landmark: "Drafting Stones",
    deck:
      "A blueprint drawn before any code. Every component named. You sign off before we build.",
    body:
      "We design around how your business actually thinks, not a borrowed stack. Each fix becomes a named component with a clear job and a metric that proves it worked.",
    details: [
      "Architecture diagram, components, interfaces, data flow",
      "One owner named per component, no anonymous systems",
      "Success metric defined for each, baseline and target",
      "Sequenced build plan, what ships first, what waits",
    ],
    out: "Signed blueprint, v0.x",
    weeks: "2 weeks",
    vignette: "/illustrations/vignette-2-stones.png",
  },
  {
    num: "III",
    numWord: "Three",
    name: "Build",
    landmark: "Timber-Frame Workshop",
    deck:
      "Dashboards, custom agents, workflow automations. One ships every five to seven working days.",
    body:
      "No big-bang launch. Each component goes live on its own, observable from day one and run in parallel with your team.",
    details: [
      "Custom dashboards, live KPIs in your stack",
      "Custom AI agents, trained on your work, not generic",
      "Workflow automations, the repetitive work on rails",
      "Every component observable from day one",
    ],
    out: "Working components, live in your stack",
    weeks: "4 to 6 weeks",
    vignette: "/illustrations/vignette-3-workshop.png",
  },
  {
    num: "IV",
    numWord: "Four",
    name: "Train",
    landmark: "River Crossing",
    deck:
      "Your team learns the controls. Each component gets a named owner. We hand over the keys.",
    body:
      "AI literacy is part of the deliverable, not a separate invoice. Every component gets a manual, recorded walkthroughs, and a ten-day parallel run before we step back.",
    details: [
      "Operator runbook plus recorded walkthroughs per component",
      "Ten-day parallel run, humans and agents in tandem",
      "Named owner on every part, no black boxes",
      "Weekly office hours for sixty days post-handoff",
    ],
    out: "Trained team, named owners, runbooks",
    weeks: "3 weeks",
    vignette: "/illustrations/vignette-4-crossing.png",
  },
  {
    num: "V",
    numWord: "Five",
    name: "Operate",
    landmark: "Summit Marker",
    deck:
      "The machine runs. You watch the dials. We stay close, but you hold the wrench.",
    body:
      "Your team owns the operation, with live dashboards and monthly reviews. We stay on retainer for the harder questions.",
    details: [
      "Live operations dashboard, refreshed in real time",
      "Monthly review, sixty minutes, your agenda",
      "Quarterly tune-up, what to extend, what to retire",
      "First refusal on the next horizon when you are ready",
    ],
    out: "A business that runs, ongoing partnership",
    weeks: "Ongoing",
    vignette: "/illustrations/vignette-5-summit.png",
  },
];

const N = PHASES.length;
const ease = [0.22, 1, 0.36, 1] as const;

export default function VerticalJourney() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState(0);
  const [isWide, setIsWide] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollYProgress.on("change", (p) => {
      const idx = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
      setStage((prev) => (prev === idx ? prev : idx));
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* ── marker rides the trail ──
     measure the route once, find the path-length of each painted landmark,
     then drive the marker head + the "travelled" stroke off scroll so the
     marker reaches waypoint i exactly as stage i becomes active. */
  const routeRef = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState(0);
  const [fracs, setFracs] = useState<number[]>([]);
  const markerCX = useMotionValue(ANCHORS[0].x);
  const markerCY = useMotionValue(ANCHORS[0].y);
  const dashOffset = useMotionValue(0);

  useLayoutEffect(() => {
    if (!isWide) return;
    const path = routeRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setLen(total);
    // nearest path-length for each landmark anchor
    const f = ANCHORS.map((a) => {
      let best = 0;
      let bd = Infinity;
      for (let t = 0; t <= 1; t += 0.004) {
        const pt = path.getPointAtLength(t * total);
        const d = (pt.x - a.x) ** 2 + (pt.y - a.y) ** 2;
        if (d < bd) {
          bd = d;
          best = t;
        }
      }
      return best;
    });
    setFracs(f);
    dashOffset.set(total);
  }, [isWide, dashOffset]);

  useEffect(() => {
    if (!isWide || !len || fracs.length !== N) return;
    const path = routeRef.current;
    if (!path) return;
    // scroll-progress → path-fraction: anchor i is reached at p = i/N, the
    // marker travelling toward the next anchor across each stage's range.
    const pathFracFor = (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      const seg = Math.min(N - 1, Math.floor(clamped * N));
      if (seg >= N - 1) return fracs[N - 1];
      const localT = clamped * N - seg;
      return fracs[seg] + (fracs[seg + 1] - fracs[seg]) * localT;
    };
    const update = (p: number) => {
      const fr = pathFracFor(p);
      const head = path.getPointAtLength(fr * len);
      markerCX.set(head.x);
      markerCY.set(head.y);
      dashOffset.set(len * (1 - fr));
    };
    update(smooth.get());
    const unsub = smooth.on("change", update);
    return () => unsub();
  }, [isWide, len, fracs, smooth, markerCX, markerCY, dashOffset]);

  const phase = PHASES[stage];

  return (
    <div id="journey" style={{ background: "var(--bg)" }}>
      {/* ── CHAPTER SEAM ──
          a deliberate ledge + compass mark so the hero's painted sheet hands
          off to the roadmap chapter, instead of two flat parchment tones
          meeting in an accidental line. */}
      <div
        aria-hidden
        className="relative w-full"
        style={{
          height: "clamp(3.5rem, 7vh, 6rem)",
          borderTop: "1px solid var(--sepia-hi)",
          boxShadow: "inset 0 16px 30px -16px rgba(43,33,24,0.25)",
        }}
      >
        <div
          className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "9999px",
            background: "var(--bg)",
            border: "1px solid var(--sepia-hi)",
            boxShadow: "0 2px 10px -4px rgba(43,33,24,0.3)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16">
            <path
              d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
              fill="var(--ember)"
            />
          </svg>
        </div>
      </div>

      {/* ── SECTION INTRO ── */}
      <div className="relative flex min-h-[62vh] flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, ease }}
          className="font-mono uppercase"
          style={{
            fontSize: "0.66rem",
            letterSpacing: "0.36em",
            color: "var(--ember)",
          }}
        >
          The WorkSmart Expedition
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mt-6 font-serif font-light leading-[1.04] tracking-[-0.008em] text-balance"
          style={{
            fontSize: "clamp(2rem, 4.6vw, 3.9rem)",
            color: "var(--text-1)",
            maxWidth: "20ch",
          }}
        >
          Five stages from scattered operations to{" "}
          <em style={{ color: "var(--ember)", fontStyle: "italic" }}>
            intelligent systems.
          </em>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          aria-hidden
          className="mt-10 h-px w-24"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--sepia-hi), transparent)",
          }}
        />
      </div>

      {isWide ? (
        /* ════════════ DESKTOP: pinned cinematic composition ════════════ */
        <section ref={ref} className="relative" style={{ height: "520vh" }}>
          <div className="sticky top-0 h-[100dvh] overflow-hidden">
            <div className="flex h-full items-center gap-[2.6vw] pr-[3.5vw]">
              {/* ─────────── LEFT: the expedition map — a flush-left,
                  full-height ribbon that charts progression. it is deliberately
                  the smaller, secondary visual beside the focal stage card. ── */}
              <div
                className="relative h-[94vh] shrink-0 overflow-hidden shadow-artifact"
                style={{
                  width: "clamp(15rem, 25vw, 22rem)",
                  borderRadius: "0 14px 14px 0",
                  borderRight: "1.5px solid rgba(43,33,24,0.6)",
                  borderTop: "1.5px solid rgba(43,33,24,0.42)",
                  borderBottom: "1.5px solid rgba(43,33,24,0.42)",
                  background: "var(--map-panel)",
                }}
              >
                {/* the map sheet covers the ribbon; the SVG overlay shares its
                    exact aspect box, so the route, waypoints, and marker stay
                    locked to the painted landmarks through the crop. */}
                <div
                  className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2"
                  style={{ aspectRatio: "1520 / 2688" }}
                >
                  <Image
                    src="/illustrations/aerial-trail.png"
                    alt="The five-phase expedition map"
                    fill
                    className="object-cover select-none"
                    sizes="26vw"
                    priority
                  />

                    {/* plotted route + waypoints + marker */}
                    <svg
                      className="absolute inset-0 h-full w-full overflow-visible"
                      viewBox="0 0 113 200"
                      fill="none"
                    >
                      {/* planned route, faint marching dashes */}
                      <path
                        d={ROUTE_D}
                        stroke="rgba(222,76,0,0.30)"
                        strokeWidth={1.3}
                        strokeLinecap="round"
                        strokeDasharray="0.4 5"
                        className="ws-trail-dashes"
                      />
                      {/* measurable route (invisible) */}
                      <path ref={routeRef} d={ROUTE_D} stroke="none" />
                      {/* travelled portion, solid ember */}
                      {len > 0 && (
                        <motion.path
                          d={ROUTE_D}
                          stroke="var(--ember)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: len,
                            strokeDashoffset: dashOffset,
                          }}
                        />
                      )}

                      {/* waypoints on the painted landmarks */}
                      {ANCHORS.map((nd, i) => {
                        const reached = i <= stage;
                        const active = i === stage;
                        return (
                          <g key={i}>
                            {active && (
                              <motion.circle
                                cx={nd.x}
                                cy={nd.y}
                                fill="rgba(222,76,0,0.18)"
                                animate={{
                                  r: [5, 8.5, 5],
                                  opacity: [0.55, 0.12, 0.55],
                                }}
                                transition={{
                                  duration: 2.2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                            <motion.circle
                              cx={nd.x}
                              cy={nd.y}
                              animate={{ r: active ? 3.4 : 2.4 }}
                              transition={{ duration: 0.5, ease }}
                              fill={
                                reached ? "var(--ember)" : "var(--map-panel)"
                              }
                              stroke={
                                reached
                                  ? "var(--ember)"
                                  : "rgba(80,55,30,0.55)"
                              }
                              strokeWidth={1.2}
                            />
                          </g>
                        );
                      })}

                      {/* marker head */}
                      {len > 0 && (
                        <>
                          <motion.circle
                            cx={markerCX}
                            cy={markerCY}
                            fill="rgba(222,76,0,0.16)"
                            animate={{ r: [6, 9, 6], opacity: [0.6, 0.2, 0.6] }}
                            transition={{
                              duration: 1.9,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.circle
                            cx={markerCX}
                            cy={markerCY}
                            r={3}
                            fill="var(--ember)"
                            stroke="var(--card-cream)"
                            strokeWidth={1.3}
                          />
                        </>
                      )}
                    </svg>
                </div>

                {/* scrims so the labels read over the painted art */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(20,15,9,0.82), rgba(20,15,9,0))",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-24"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(20,15,9,0.55), rgba(20,15,9,0))",
                  }}
                />
                <span
                  className="pointer-events-none absolute left-4 top-4 font-mono uppercase"
                  style={{
                    fontSize: "0.56rem",
                    letterSpacing: "0.3em",
                    color: "rgba(247,235,208,0.82)",
                  }}
                >
                  The Roadmap
                </span>

                {/* active landmark legend */}
                <div className="pointer-events-none absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1.5 px-5 text-center">
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.5rem",
                      letterSpacing: "0.34em",
                      color: "rgba(247,235,208,0.6)",
                    }}
                  >
                    Phase {phase.num} of V
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--ember)" }}
                    />
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.22em",
                        color: "var(--card-cream)",
                      }}
                    >
                      {phase.landmark}
                    </span>
                  </div>
                </div>
              </div>

              {/* ─────────── RIGHT: the focal stage card — the largest visual
                  on screen, holding the immersive plate + copy. ─────────── */}
              <div
                className="card-grain relative h-[94vh] min-w-0 flex-1 overflow-hidden shadow-plate"
                style={{
                  borderRadius: "24px",
                }}
              >
                <AnimatePresence>
                  <motion.div
                    key={stage}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease }}
                  >
                    {/* full-bleed plate */}
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1.06 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.1, ease }}
                    >
                      <Image
                        src={phase.vignette}
                        alt={phase.landmark}
                        fill
                        className="object-cover select-none"
                        sizes="60vw"
                        priority={stage === 0}
                      />
                    </motion.div>
                    {/* warm-dark overlay + stronger gradient from bottom-left */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(105deg, rgba(20,15,9,0.92) 0%, rgba(28,21,13,0.74) 34%, rgba(28,21,13,0.4) 60%, rgba(28,21,13,0.16) 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(16,12,7,0.6) 0%, rgba(16,12,7,0) 46%)",
                      }}
                    />

                    {/* copy */}
                    <div className="absolute inset-0 flex items-center">
                      <div
                        className="px-[clamp(2rem,4vw,4rem)]"
                        style={{ width: "min(56%, 44rem)" }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12, duration: 0.6, ease }}
                          className="flex items-center gap-3"
                        >
                          <span
                            className="font-mono uppercase"
                            style={{
                              fontSize: "0.62rem",
                              letterSpacing: "0.3em",
                              color: "var(--ember)",
                            }}
                          >
                            Phase {phase.numWord} of Five
                          </span>
                        </motion.div>

                        <motion.h3
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6, ease }}
                          className="mt-3 font-serif font-light leading-[0.96] tracking-[-0.008em]"
                          style={{
                            fontSize: "clamp(2.6rem, 4.4vw, 4.2rem)",
                            color: "var(--card-cream)",
                          }}
                        >
                          <span style={{ color: "var(--ember)" }}>
                            {phase.num}.
                          </span>{" "}
                          {phase.name}
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.26, duration: 0.6, ease }}
                          className="mt-4 font-serif italic text-pretty"
                          style={{
                            fontSize: "clamp(1.05rem, 1.3vw, 1.28rem)",
                            lineHeight: 1.4,
                            color: "var(--card-cream)",
                            maxWidth: "34ch",
                          }}
                        >
                          {phase.deck}
                        </motion.p>

                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.32, duration: 0.6, ease }}
                          className="mt-3 text-pretty"
                          style={{
                            fontSize: "0.86rem",
                            lineHeight: 1.5,
                            color: "rgba(247,235,208,0.74)",
                            maxWidth: "48ch",
                          }}
                        >
                          {phase.body}
                        </motion.p>

                        <ul className="mt-5 grid grid-cols-2 gap-x-7 gap-y-0">
                          {phase.details.map((d, i) => (
                            <motion.li
                              key={d}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.38 + i * 0.06,
                                duration: 0.5,
                                ease,
                              }}
                              className="grid grid-cols-[22px_1fr] items-baseline gap-2.5 py-1.5"
                              style={{
                                borderTop: "1px solid rgba(247,235,208,0.16)",
                                fontSize: "0.78rem",
                                lineHeight: 1.35,
                                color: "rgba(247,235,208,0.86)",
                              }}
                            >
                              <span
                                className="font-mono"
                                style={{
                                  fontSize: "0.6rem",
                                  letterSpacing: "0.12em",
                                  color: "var(--ember)",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span>{d}</span>
                            </motion.li>
                          ))}
                        </ul>

                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.62, duration: 0.5, ease }}
                          className="mt-5 flex items-stretch gap-7"
                        >
                          <div>
                            <div
                              className="font-mono uppercase"
                              style={{
                                fontSize: "0.54rem",
                                letterSpacing: "0.3em",
                                color: "rgba(247,235,208,0.55)",
                                marginBottom: "0.35rem",
                              }}
                            >
                              You leave with
                            </div>
                            <div
                              className="font-serif italic"
                              style={{
                                fontSize: "0.95rem",
                                lineHeight: 1.3,
                                color: "var(--card-cream)",
                                maxWidth: "24ch",
                              }}
                            >
                              {phase.out}
                            </div>
                          </div>
                          <div
                            aria-hidden
                            className="w-px self-stretch"
                            style={{ background: "rgba(247,235,208,0.22)" }}
                          />
                          <div>
                            <div
                              className="font-mono uppercase"
                              style={{
                                fontSize: "0.54rem",
                                letterSpacing: "0.3em",
                                color: "rgba(247,235,208,0.55)",
                                marginBottom: "0.35rem",
                              }}
                            >
                              Duration
                            </div>
                            <div
                              className="font-serif italic"
                              style={{
                                fontSize: "0.95rem",
                                lineHeight: 1.3,
                                color: "var(--card-cream)",
                              }}
                            >
                              {phase.weeks}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* persistent cream hairline inner frame */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[24px]"
                  style={{ border: "1px solid rgba(247,235,208,0.14)" }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ════════════ MOBILE: single-column field journal ════════════ */
        <div className="relative px-5 pb-24">
          {/* trail line down the page */}
          <div
            aria-hidden
            className="absolute bottom-10 top-2 w-px"
            style={{
              left: "22px",
              background:
                "repeating-linear-gradient(to bottom, var(--sepia-hi) 0 3px, transparent 3px 10px)",
            }}
          />
          <div className="flex flex-col gap-12 pl-9">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.6, ease }}
                className="relative"
              >
                {/* waypoint on the trail */}
                <motion.span
                  aria-hidden
                  className="absolute -left-9 top-3 grid place-items-center"
                  style={{ width: "18px", height: "18px" }}
                >
                  <motion.span
                    className="block rounded-full"
                    initial={{ background: "var(--map-panel)" }}
                    whileInView={{ background: "var(--ember)" }}
                    viewport={{ once: true, margin: "-30%" }}
                    transition={{ duration: 0.4, ease }}
                    style={{
                      width: "11px",
                      height: "11px",
                      border: "1.5px solid var(--ember)",
                      boxShadow: "0 0 0 4px rgba(222,76,0,0.12)",
                    }}
                  />
                </motion.span>

                {/* full-image plate */}
                <div
                  className="card-grain relative flex flex-col justify-end overflow-hidden shadow-plate"
                  style={{
                    borderRadius: "20px",
                    minHeight: "82vh",
                  }}
                >
                  <Image
                    src={p.vignette}
                    alt={p.landmark}
                    fill
                    className="object-cover select-none"
                    sizes="100vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(20,15,9,0.5) 0%, rgba(20,15,9,0.2) 34%, rgba(16,12,7,0.78) 78%, rgba(16,12,7,0.92) 100%)",
                    }}
                  />
                  <div className="relative flex flex-col justify-end p-6">
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: "0.58rem",
                        letterSpacing: "0.28em",
                        color: "var(--ember)",
                      }}
                    >
                      Phase {p.numWord} of Five
                    </span>
                    <h3
                      className="mt-2 font-serif font-light leading-[0.98] tracking-[-0.008em]"
                      style={{
                        fontSize: "clamp(2.2rem, 11vw, 3rem)",
                        color: "var(--card-cream)",
                      }}
                    >
                      <span style={{ color: "var(--ember)" }}>{p.num}.</span>{" "}
                      {p.name}
                    </h3>
                    <p
                      className="mt-3 font-serif italic text-pretty"
                      style={{
                        fontSize: "1rem",
                        lineHeight: 1.4,
                        color: "var(--card-cream)",
                      }}
                    >
                      {p.deck}
                    </p>
                    <ul className="mt-4 flex flex-col">
                      {p.details.map((d, di) => (
                        <li
                          key={d}
                          className="grid grid-cols-[20px_1fr] items-baseline gap-2.5 py-2"
                          style={{
                            borderTop: "1px solid rgba(247,235,208,0.16)",
                            fontSize: "0.8rem",
                            lineHeight: 1.4,
                            color: "rgba(247,235,208,0.84)",
                          }}
                        >
                          <span
                            className="font-mono"
                            style={{
                              fontSize: "0.58rem",
                              color: "var(--ember)",
                            }}
                          >
                            {String(di + 1).padStart(2, "0")}
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-stretch gap-6">
                      <div>
                        <div
                          className="font-mono uppercase"
                          style={{
                            fontSize: "0.5rem",
                            letterSpacing: "0.28em",
                            color: "rgba(247,235,208,0.55)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          You leave with
                        </div>
                        <div
                          className="font-serif italic"
                          style={{
                            fontSize: "0.88rem",
                            lineHeight: 1.3,
                            color: "var(--card-cream)",
                          }}
                        >
                          {p.out}
                        </div>
                      </div>
                      <div
                        aria-hidden
                        className="w-px self-stretch"
                        style={{ background: "rgba(247,235,208,0.22)" }}
                      />
                      <div>
                        <div
                          className="font-mono uppercase"
                          style={{
                            fontSize: "0.5rem",
                            letterSpacing: "0.28em",
                            color: "rgba(247,235,208,0.55)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          Duration
                        </div>
                        <div
                          className="font-serif italic"
                          style={{
                            fontSize: "0.88rem",
                            lineHeight: 1.3,
                            color: "var(--card-cream)",
                          }}
                        >
                          {p.weeks}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
