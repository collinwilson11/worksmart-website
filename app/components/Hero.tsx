"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";

/**
 * OPENING SEQUENCE — one continuous pinned shot.
 *
 *   1. The very first thing painted is the actual first video frame.
 *   2. Hero frames scrub: traveler at the vista raises + unfolds a map,
 *      the camera settles on blank parchment.
 *   3. On that parchment, the hand-drawn field map *draws itself* — a
 *      diagonal ink wipe sweeps along the trail. The map is transparent
 *      PNG art (colored mountains, the trail, the trailhead X) and the
 *      page parchment is colour-matched to its paper, so it reads as the
 *      very map the traveler unfolded, not an image on a panel.
 *   4. In the map's open left margin, a single "You are here" field note
 *      names where the reader stands and the handful of things that are
 *      true of almost everyone who stands there.
 *
 * Frames: /public/sequences/hero-out/frame-001.jpg ... frame-145.jpg
 * Overlay: /public/illustrations/you-are-here-map.jpg  (a complete vintage
 *          map painted on its own warm paper; its open left margin holds the
 *          field note, the painted range anchors the right of the stage)
 */

const ease = [0.22, 1, 0.36, 1] as const;

const HERO_COUNT = 145;
const HERO_SRC = (i: number) =>
  `/sequences/hero-out/frame-${String(i).padStart(3, "0")}.jpg`;

// What's true of almost everyone standing at the trailhead.
const ISSUES = [
  "AI is in every conversation, and nowhere in the actual work.",
  "Pilots and demos pile up. The daily operation looks the same.",
  "The team is buried, and the bottlenecks have not moved in a year.",
  "The business still runs out of one or two people's heads.",
  "Plenty of ideas, no clear first step, and no time to find one.",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawn = useRef<number>(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 28,
    restDelta: 0.001,
  });

  /* ── cursor parallax: the scene drifts a few px against the pointer ── */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(pointerY, { stiffness: 60, damping: 18, mass: 0.6 });
  const canvasX = useTransform(px, [-0.5, 0.5], [-10, 10]);
  const canvasY = useTransform(py, [-0.5, 0.5], [-7, 7]);
  const mapX = useTransform(px, [-0.5, 0.5], [-20, 20]);
  const mapY = useTransform(py, [-0.5, 0.5], [-13, 13]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5);
      pointerY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY]);

  /* ── hero headline fades out as the scrub begins ── */
  const copyOpacity = useTransform(p, [0, 0.05, 0.13], [1, 1, 0]);
  const copyY = useTransform(p, [0, 0.13], ["0%", "-7%"]);

  /* ── the trail draws itself: a 35° ink wipe swept along the trail axis,
        revealing the trailhead first and the summit last. the wipe begins
        WHILE the filmed sheet is still on screen, and the canvas lingers
        underneath until the ink is established, so the handoff never passes
        through a blank parchment frame ── */
  const canvasOpacity = useTransform(p, [0.62, 0.72], [1, 0]);
  const drawSolid = useTransform(p, [0.56, 0.88], [-32, 100]);
  const drawEdge = useTransform(p, [0.56, 0.88], [0, 132]);
  const trailMask = useMotionTemplate`linear-gradient(35deg, #000 ${drawSolid}%, transparent ${drawEdge}%)`;
  const mapOpacity = useTransform(p, [0.56, 0.6], [0, 1]);

  /* ── the "you are here" field note, choreographed to the ink ── */
  const noteOpacity = useTransform(p, [0.66, 0.74], [0, 1]);
  const noteY = useTransform(p, [0.66, 0.74], [22, 0]);
  const cueOpacity = useTransform(p, [0.92, 0.99], [0, 1]);

  /* ── preload every hero frame ── */
  useEffect(() => {
    let mounted = true;
    const imgs: HTMLImageElement[] = new Array(HERO_COUNT);
    for (let i = 0; i < HERO_COUNT; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = HERO_SRC(i + 1);
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
    const clamped = Math.max(0, Math.min(HERO_COUNT - 1, Math.round(idx)));
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
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawn.current = clamped;
  }

  const frameProgress = useTransform(p, [0.05, 0.6], [0, HERO_COUNT - 1]);
  useMotionValueEvent(frameProgress, "change", (v) => drawFrame(v));

  return (
    <div ref={containerRef} style={{ height: "360vh", position: "relative" }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* the scrubbed hero sequence — first paint is frame 001, no poster swap */}
        <motion.canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 z-0 will-change-transform"
          style={{ opacity: canvasOpacity, x: canvasX, y: canvasY, scale: 1.04 }}
        />

        {/* the hand-drawn field map, drawing itself onto the parchment.
            this is a complete vintage map painted on its own warm paper, so
            it reads as the very sheet the traveler unfolded. object-cover
            fills the frame; the ink-wipe mask sweeps the map into existence
            along the trail axis (trailhead first, summit last). the right
            ~60% carries the mountains + plotted route; the left margin is the
            map's own open parchment, where the field note sits. */}
        {/* on desktop the painted sheet is pushed into the right region so its
            trailhead X stays clear of the dark field-note card; on mobile it is
            full-bleed (object-cover center-crops the painting's middle, so the
            X falls off-frame and the card can overlay freely). */}
        <motion.div
          aria-hidden
          className="absolute inset-y-0 right-0 left-0 md:left-[25vw] z-10"
          style={{
            opacity: mapOpacity,
            x: mapX,
            y: mapY,
            maskImage: trailMask,
            WebkitMaskImage: trailMask,
          }}
        >
          <Image
            src="/illustrations/you-are-here-map-clean.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover select-none"
            style={{ objectPosition: "center center" }}
          />
        </motion.div>

        {/* ── HERO HEADLINE — over a soft parchment glow so the line + the
              subtext stay readable above the painted vista ── */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY, top: "17vh" }}
          className="absolute inset-x-0 z-30 flex flex-col items-center text-center px-6"
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
            style={{
              width: "min(60rem, 92vw)",
              height: "30rem",
              background:
                "radial-gradient(60% 58% at 50% 42%, rgba(244,227,194,0.92) 0%, rgba(244,227,194,0.7) 42%, rgba(244,227,194,0) 78%)",
            }}
          />
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-serif font-light leading-[0.96] tracking-[-0.01em] max-w-[18ch] text-balance"
            style={{
              fontSize: "clamp(2.8rem, 6.4vw, 6rem)",
              color: "var(--text-1)",
            }}
          >
            Your guide into the{" "}
            <em style={{ color: "var(--ember)", fontStyle: "italic" }}>
              AI wilderness.
            </em>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mt-10"
          >
            <motion.a
              href="#journey"
              className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-sans font-semibold tracking-wide"
              style={{
                background: "var(--ember)",
                color: "var(--cream)",
                fontSize: "0.9375rem",
                boxShadow: "0 4px 18px rgba(222,76,0,0.25)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 10px 34px rgba(222,76,0,0.42)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              See where you stand
              <span
                className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-500 group-hover:translate-y-0.5"
                style={{ background: "rgba(0,0,0,0.18)" }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11">
                  <path
                    d="M5.5 1v9M1 5.5l4.5 4.5L10 5.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ── YOU ARE HERE — a true dark field-note card, anchored to the left
              edge and running the full height of the stage. it does not try to
              blend into the parchment; it reads as a deliberate panel, with the
              painted map sitting clear to its right (the trailhead X stays
              uncovered). ── */}
        <motion.div
          style={{ opacity: noteOpacity, y: noteY }}
          className="absolute inset-y-0 left-0 z-20 flex pointer-events-none"
        >
          <div
            className="card-grain shadow-plate flex w-[80vw] max-w-[30rem] flex-col justify-center pl-[8vw] pr-9 md:w-[36vw] md:pl-[4.5vw]"
            style={{
              background:
                "linear-gradient(158deg, var(--espresso) 0%, var(--espresso-2) 100%)",
              borderRight: "1px solid rgba(255,254,251,0.12)",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="block w-2.5 h-2.5 rounded-full"
                style={{
                  background: "var(--ember)",
                  boxShadow: "0 0 0 5px rgba(222,76,0,0.22)",
                  animation: "pulse-dot 2.4s ease-in-out infinite",
                }}
              />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "0.64rem",
                  letterSpacing: "0.34em",
                  color: "var(--ember)",
                }}
              >
                You are here
              </span>
            </div>

            <h2
              className="font-serif font-light leading-[1.04] tracking-[-0.008em]"
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                color: "var(--cream)",
              }}
            >
              You know the{" "}
              <em style={{ color: "var(--ember)", fontStyle: "italic" }}>
                destination.
              </em>{" "}
              The route is the hard part.
            </h2>

            <p
              className="mt-5 font-serif italic font-light"
              style={{
                fontSize: "clamp(0.98rem, 1.2vw, 1.1rem)",
                lineHeight: 1.5,
                color: "rgba(247,235,208,0.72)",
                maxWidth: "34ch",
              }}
            >
              Almost every team we meet is standing in the same spot:
            </p>

            <ul className="mt-5 space-y-0">
              {ISSUES.map((line, i) => (
                <li
                  key={line}
                  className="grid grid-cols-[1.7rem_1fr] items-baseline gap-x-3 py-2.5"
                  style={{
                    borderTop:
                      i === 0
                        ? "1px solid rgba(255,254,251,0.18)"
                        : "1px solid rgba(255,254,251,0.10)",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      color: "var(--ember)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-pretty"
                    style={{
                      fontSize: "clamp(0.86rem, 1vw, 0.97rem)",
                      lineHeight: 1.45,
                      color: "rgba(255,254,251,0.9)",
                    }}
                  >
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* keep scrolling cue */}
        <motion.div
          style={{ opacity: cueOpacity, bottom: "4vh" }}
          className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.34em",
              color: "var(--text-2)",
            }}
          >
            Keep scrolling to begin the journey
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
  );
}
