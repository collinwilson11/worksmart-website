"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * YOU ARE HERE — the hand-drawn map.
 *
 * Picks up exactly where the hero leaves off: the hero pushes into an unfolded
 * map until the screen is blank parchment. This section scrubs the
 * "map being drawn" sequence on that same parchment, so the two read as one
 * continuous shot. As the ink lays down YOU ARE HERE, the trail, and THE SUMMIT,
 * copy reveals in the margins and along the route.
 *
 * Frames: /public/sequences/map-draw/frame-001.jpg ... frame-192.jpg
 */

const FRAME_COUNT = 192;
const FRAME_SRC = (i: number) =>
  `/sequences/map-draw/frame-${String(i).padStart(3, "0")}.jpg`;

// zoom past the torn paper edge so the map fills the page edge to edge
const OVERSCAN = 1.07;

// the five stages, placed along the trail's lower-left -> upper-right diagonal.
// `place` flips the label above or below its point to balance spacing.
const STAGES: {
  n: string;
  name: string;
  x: number; // vw %
  y: number; // vh %
  place: "above" | "below";
}[] = [
  { n: "01", name: "Discover", x: 21, y: 70, place: "below" },
  { n: "02", name: "Design", x: 34, y: 62, place: "above" },
  { n: "03", name: "Build", x: 48, y: 55, place: "below" },
  { n: "04", name: "Train", x: 61, y: 47, place: "above" },
  { n: "05", name: "Operate", x: 73, y: 38, place: "below" },
];

export default function YouAreHere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawn = useRef<number>(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  /* ── copy reveals, choreographed to the ink ── */
  // problems annotation arrives as YOU ARE HERE is inked (bottom-left)
  const problemsOpacity = useTransform(p, [0.12, 0.22], [0, 1]);
  const problemsY = useTransform(p, [0.12, 0.22], [18, 0]);
  // the connective line introduces the route before the stages appear
  const introOpacity = useTransform(p, [0.16, 0.26], [0, 1]);
  const introY = useTransform(p, [0.16, 0.26], [18, 0]);
  // goals annotation arrives as THE SUMMIT is inked (top-right)
  const goalsOpacity = useTransform(p, [0.48, 0.58], [0, 1]);
  const goalsY = useTransform(p, [0.48, 0.58], [18, 0]);
  // closing line completes the sentence (bottom-center)
  const closingOpacity = useTransform(p, [0.62, 0.72], [0, 1]);
  const closingY = useTransform(p, [0.62, 0.72], [18, 0]);
  // keep-scrolling cue
  const cueOpacity = useTransform(p, [0.86, 0.95], [0, 1]);

  /* ── preload + draw frames ── */
  useEffect(() => {
    let mounted = true;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = FRAME_SRC(i + 1);
      img.onload = () => {
        if (!mounted) return;
        if (i === 0 && lastDrawn.current === -1) drawFrame(0);
      };
      imgs[i] = img;
    }
    framesRef.current = imgs;
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      if (lastDrawn.current >= 0) drawFrame(lastDrawn.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawFrame(idx: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(idx)));
    const img = framesRef.current[clamped];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw: number, dh: number;
    if (ir > cr) {
      dh = ch;
      dw = ch * ir;
    } else {
      dw = cw;
      dh = cw / ir;
    }
    dw *= OVERSCAN;
    dh *= OVERSCAN;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawn.current = clamped;
  }

  // map draws over the first ~58% of the scroll, then holds on the finished plate
  const frameProgress = useTransform(p, [0.02, 0.58], [0, FRAME_COUNT - 1]);
  useMotionValueEvent(frameProgress, "change", (v) => drawFrame(v));

  return (
    <section
      id="here"
      ref={containerRef}
      style={{ height: "360vh", position: "relative", background: "var(--bg)" }}
    >
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* the map, full-bleed */}
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 z-0" />

        {/* parchment edge-fade: hides any residual torn edge and melts the map
            into the page rather than ending on a hard rectangle */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg) 0%, transparent 9%, transparent 91%, var(--bg) 100%), linear-gradient(to right, var(--bg) 0%, transparent 7%, transparent 93%, var(--bg) 100%)",
          }}
        />

        {/* ── COPY OVERLAY ── */}
        <div className="absolute inset-0 z-20">
          {/* intro — top center */}
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="absolute left-1/2 -translate-x-1/2 top-[5.5vh] w-[min(46ch,86vw)] text-center"
          >
            <Halo />
            <p
              className="relative font-serif font-light text-balance"
              style={{
                fontSize: "clamp(1.15rem, 2vw, 1.75rem)",
                lineHeight: 1.35,
                color: "var(--text-1)",
              }}
            >
              Knowing the destination was never the hard part. The route is.
              That is where{" "}
              <em style={{ color: "var(--ember)", fontStyle: "italic" }}>
                WorkSmart
              </em>{" "}
              comes in, taking you on a journey of
            </p>
          </motion.div>

          {/* problems — bottom left, by YOU ARE HERE */}
          <motion.div
            style={{ opacity: problemsOpacity, y: problemsY }}
            className="absolute left-[4vw] bottom-[9vh] w-[min(26ch,72vw)]"
          >
            <Halo />
            <Annotation label="Where you stand">
              Manual work eats the week. Revenue leaks at the seams. What your
              best people know never leaves their heads.
            </Annotation>
          </motion.div>

          {/* goals — top right, by THE SUMMIT */}
          <motion.div
            style={{ opacity: goalsOpacity, y: goalsY }}
            className="absolute right-[4vw] top-[20vh] w-[min(24ch,72vw)] text-right"
          >
            <Halo />
            <Annotation label="Where you're headed" align="right">
              A business that runs without heroics, and a team that owns the
              machine.
            </Annotation>
          </motion.div>

          {/* stage names along the trail */}
          {STAGES.map((s, i) => (
            <StageLabel key={s.name} stage={s} index={i} p={p} />
          ))}

          {/* closing — bottom center, finishes the sentence */}
          <motion.div
            style={{ opacity: closingOpacity, y: closingY }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[12vh] w-[min(50ch,88vw)] text-center"
          >
            <Halo />
            <p
              className="relative font-serif italic font-light text-balance"
              style={{
                fontSize: "clamp(1.05rem, 1.7vw, 1.5rem)",
                lineHeight: 1.4,
                color: "var(--text-1)",
              }}
            >
              as a partner, providing your company with an intelligent
              foundation designed for growth and scalability.
            </p>
          </motion.div>

          {/* keep scrolling cue */}
          <motion.div
            style={{ opacity: cueOpacity }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[4vh] flex flex-col items-center gap-2"
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.34em",
                color: "var(--text-2)",
              }}
            >
              Keep scrolling to experience the journey
            </span>
            <motion.svg
              width="13"
              height="20"
              viewBox="0 0 13 20"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M6.5 1v17M1 13l5.5 5.5L12 13"
                stroke="var(--ember)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── helpers ─────────── */

// soft parchment glow that keeps copy legible over the ink without a card edge
function Halo() {
  return (
    <span
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        inset: "-1.6em -1.4em",
        background:
          "radial-gradient(ellipse 75% 80% at center, var(--bg) 0%, rgba(245,240,232,0.72) 48%, transparent 76%)",
      }}
    />
  );
}

function Annotation({
  label,
  align = "left",
  children,
}: {
  label: string;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className="font-mono uppercase mb-2"
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          color: "var(--ember)",
        }}
      >
        {label}
      </div>
      <p
        className="font-serif font-light"
        style={{
          fontSize: "clamp(1rem, 1.4vw, 1.3rem)",
          lineHeight: 1.4,
          color: "var(--text-1)",
          textAlign: align,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function StageLabel({
  stage,
  index,
  p,
}: {
  stage: (typeof STAGES)[number];
  index: number;
  p: MotionValue<number>;
}) {
  // reveal each name as the trail reaches its waypoint
  const start = 0.2 + index * 0.07;
  const opacity = useTransform(p, [start, start + 0.06], [0, 1]);
  const y = useTransform(
    p,
    [start, start + 0.06],
    [stage.place === "above" ? 12 : -12, 0]
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        left: `${stage.x}vw`,
        top: `${stage.y}vh`,
      }}
      className="absolute -translate-x-1/2 flex flex-col items-center"
    >
      {stage.place === "below" && <Tick />}
      <div
        className="flex flex-col items-center"
        style={{ position: "relative" }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            color: "var(--ember)",
          }}
        >
          {stage.n}
        </span>
        <span
          className="font-serif italic"
          style={{
            fontSize: "clamp(1.05rem, 1.5vw, 1.45rem)",
            color: "var(--text-1)",
            lineHeight: 1,
          }}
        >
          {stage.name}
        </span>
      </div>
      {stage.place === "above" && <Tick />}
    </motion.div>
  );
}

// little connector stroke from the label down/up to the trail
function Tick() {
  return (
    <span
      aria-hidden
      className="my-1"
      style={{ width: 1, height: 14, background: "rgba(39,21,3,0.35)" }}
    />
  );
}
