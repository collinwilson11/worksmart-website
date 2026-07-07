"use client";

import { motion, useInView, useScroll, useTransform, type MotionProps } from "motion/react";
import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import Image from "next/image";

/* A reveal that is guaranteed to resolve: it triggers on scroll-into-view, but
   a timeout fallback forces the visible state even if the IntersectionObserver
   never fires (which framer's whileInView can miss on staggered elements). No
   text can ever stay stuck hidden. */
function useReveal<T extends HTMLElement = HTMLElement>(
  margin = "0px 0px -10% 0px"
) {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref, { once: true, margin } as Parameters<typeof useInView>[1]);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFallback(true), 900);
    return () => clearTimeout(t);
  }, []);
  return [ref, inView || fallback] as const;
}

export function Reveal({
  children,
  y = 22,
  delay = 0,
  className,
  style,
  whileHover,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  whileHover?: MotionProps["whileHover"];
}) {
  const [ref, show] = useReveal<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease }}
      whileHover={whileHover}
    >
      {children}
    </motion.div>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

/* Gentle outer-ring feathers: the subject stays fully solid (out to ~66% of
   the radius) and only the illustration's own paper edge melts into the
   parchment. No erasing of the scene, no hard rectangle. */
const FADE_SQUARISH =
  "radial-gradient(122% 122% at 50% 48%, #000 66%, rgba(0,0,0,0) 100%)";

/* ─────────── shared ─────────── */
export function RunningHead({
  left,
  right,
  tone = "dark",
}: {
  left: string;
  right: string;
  tone?: "dark" | "light";
}) {
  const label = tone === "light" ? "rgba(247,235,208,0.62)" : "var(--text-3)";
  const rule =
    tone === "light" ? "rgba(247,235,208,0.22)" : "rgba(39,21,3,0.14)";
  return (
    <div className="mx-auto max-w-[1320px] px-6 md:px-16 flex items-center gap-5">
      <span
        className="font-mono text-[0.6rem] tracking-[0.32em] uppercase"
        style={{ color: label }}
      >
        {left}
      </span>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.3, ease }}
        className="flex-1 h-px origin-left"
        style={{ background: rule }}
      />
      <span
        className="font-mono text-[0.6rem] tracking-[0.32em] uppercase"
        style={{ color: label }}
      >
        {right}
      </span>
    </div>
  );
}

/* Masked line-rise headline: each authored line lifts out of its own
   overflow mask, the way print comes off a press. The mask carries a touch
   of bottom padding so Fell's long descenders never get clipped at rest. */
export function RiseLines({
  lines,
  className,
  style,
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const [ref, show] = useReveal<HTMLHeadingElement>();
  return (
    <h2 ref={ref} className={className} style={style}>
      {lines.map((ln, i) => (
        <span key={i} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={show ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 0.95, delay: delay + i * 0.13, ease }}
          >
            {ln}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ─────────── OUTCOMES — text overlaid on the summit panorama ─────────── */
const OUTCOMES = [
  {
    lead: "20 to 30 hours",
    unit: "back, every week",
    body: "The repetitive work, the status-chasing, the report stitching, now running itself.",
  },
  {
    lead: "Days down to minutes",
    unit: "on the work that used to wait",
    body: "Quotes, drafts, summaries, and replies that once sat in a queue land while the question is still warm.",
  },
  {
    lead: "One standard",
    unit: "on every job",
    body: "The same quality at 6pm Friday as 9am Monday, no matter who is at the desk.",
  },
  {
    lead: "Out of one head",
    unit: "and into the system",
    body: "The know-how the business quietly depends on, finally written down and usable by the whole team.",
  },
  {
    lead: "More volume",
    unit: "without more headcount",
    body: "Take on the next tier of work without the next round of hiring, or the burnout that usually comes with it.",
  },
];

export function Outcomes() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  /* the dusk panorama breathes: a slow Ken Burns drift tied to scroll */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const panoScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const panoY = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);

  return (
    <section
      id="outcomes"
      ref={ref}
      className="relative overflow-hidden py-24 md:py-36"
      style={{ background: "#15100a" }}
    >
      {/* full-bleed summit panorama at dusk — the section IS the view */}
      <motion.div
        aria-hidden
        className="absolute inset-0 select-none"
        style={{ scale: panoScale, y: panoY }}
      >
        <Image
          src="/illustrations/summit-pano.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>
      {/* night-wash overlays: heavy on the left under the copy, opening to the
          painted peaks; the top and bottom melt into the neighbouring chapters */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(21,16,10,0.94) 0%, rgba(21,16,10,0.84) 30%, rgba(21,16,10,0.5) 58%, rgba(21,16,10,0.18) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-36"
        style={{
          background:
            "linear-gradient(to bottom, #1A130C 0%, rgba(26,19,12,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-44"
        style={{
          background:
            "linear-gradient(to top, #15100a 0%, rgba(21,16,10,0) 100%)",
        }}
      />

      <div className="relative">
        <RunningHead left="Volume III" right="From The Summit" tone="light" />

        <div className="mx-auto max-w-[1320px] px-6 md:px-16 mt-10 md:mt-14">
          <div>
            <div style={{ maxWidth: "min(66%, 50rem)" }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.12, ease }}
                className="font-mono uppercase mb-5"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.34em",
                  color: "var(--ember)",
                }}
              >
                What changes when it works
              </motion.div>
              <RiseLines
                delay={0.12}
                className="font-serif font-light leading-[0.98] tracking-[-0.01em] text-balance"
                style={{
                  fontSize: "clamp(2.6rem, 5vw, 5rem)",
                  color: "var(--card-cream)",
                }}
                lines={[
                  <span key="a">The point was never</span>,
                  <span key="b">
                    the{" "}
                    <em
                      className="not-italic"
                      style={{ color: "var(--ember)", fontStyle: "italic" }}
                    >
                      AI.
                    </em>
                  </span>,
                ]}
              />
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.26, ease }}
                className="mt-6 font-serif italic text-pretty"
                style={{
                  fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)",
                  lineHeight: 1.5,
                  color: "rgba(247,235,208,0.82)",
                  maxWidth: "42ch",
                }}
              >
                It is what a business looks like once the machine is running.
                Here is what teams feel within a quarter or two of going live.
              </motion.p>
            </div>

            {/* results — two columns over the dark wash */}
            <div
              className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-x-12"
              style={{ maxWidth: "min(80%, 60rem)" }}
            >
              {OUTCOMES.map((o, i) => (
                <motion.div
                  key={o.lead}
                  initial={{ opacity: 0, y: 22 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.34 + i * 0.08, ease }}
                  className="grid grid-cols-[2.2rem_1fr] gap-x-4 py-5"
                  style={{ borderTop: "1px solid rgba(247,235,208,0.18)" }}
                >
                  <span
                    className="font-mono text-[0.64rem] tracking-[0.2em] pt-2"
                    style={{ color: "var(--ember)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className="font-serif font-light leading-[1.08] tracking-[-0.006em] text-balance"
                      style={{
                        fontSize: "clamp(1.4rem, 2.1vw, 2.1rem)",
                        color: "var(--card-cream)",
                      }}
                    >
                      {o.lead}{" "}
                      <span
                        className="font-serif italic font-light"
                        style={{
                          fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)",
                          color: "rgba(247,235,208,0.66)",
                        }}
                      >
                        {o.unit}
                      </span>
                    </h3>
                    <p
                      className="mt-2 text-pretty"
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: 1.55,
                        color: "rgba(247,235,208,0.74)",
                        maxWidth: "44ch",
                      }}
                    >
                      {o.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── WHO — field-note cards laid over the companions scene ─────────── */
const WHO_TYPES = [
  {
    name: "Growth-stage companies",
    note: "$5M to $50M in revenue. Enough scale to feel the drag of manual work, enough room to compound a real advantage. This is our core.",
  },
  {
    name: "Operators who decide",
    note: "Leadership that can say yes in the room. We build fastest with teams who move, not ones who route it to a committee.",
  },
  {
    name: "Real operational depth",
    note: "Genuine process and proprietary know-how, the kind worth turning into a moat. The complexity is the point, not the obstacle.",
  },
  {
    name: "A few local businesses",
    note: "We keep a handful of seats for small Greenville-area teams doing remarkable work. Limited by design, and worth asking.",
  },
];

export function Who() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="who"
      ref={ref}
      className="relative overflow-hidden py-28 md:py-40"
      style={{
        background:
          "linear-gradient(168deg, var(--forest-2) 0%, var(--forest) 46%, #243a2b 100%)",
      }}
    >
      {/* faint topographic warmth in the green field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 82% 8%, rgba(222,76,0,0.10), rgba(222,76,0,0) 55%)",
        }}
      />

      {/* seam blends: the summit's night dissolves into the forest above, and
          the forest sinks into slate twilight below. no hard chapter lines. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-40"
        style={{
          background:
            "linear-gradient(to bottom, #15100a 0%, rgba(60,92,70,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-40"
        style={{
          background:
            "linear-gradient(to top, #2A3A40 0%, rgba(36,58,43,0) 100%)",
        }}
      />

      <div className="relative">
        <RunningHead left="Volume IV" right="Companions" tone="light" />

        <div className="mx-auto max-w-[1320px] px-6 md:px-16 mt-12">
          {/* balanced editorial header — headline left, the selection note
              right, so the spread reads full rather than a left-pinned column */}
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <RiseLines
              className="font-serif font-light leading-[0.94] tracking-[-0.01em] text-balance"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 6.4rem)",
                color: "var(--card-cream)",
                maxWidth: "15ch",
              }}
              lines={[
                <span key="a">We choose our</span>,
                <em
                  key="b"
                  className="not-italic"
                  style={{ color: "var(--ember)", fontStyle: "italic" }}
                >
                  companions.
                </em>,
              ]}
            />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.12, ease }}
              className="lg:pb-3"
            >
              <p
                className="font-serif italic text-pretty"
                style={{
                  fontSize: "clamp(1.05rem, 1.35vw, 1.3rem)",
                  lineHeight: 1.5,
                  color: "rgba(247,235,208,0.84)",
                  maxWidth: "40ch",
                }}
              >
                We take a small number of teams at a time, so every engagement
                gets our full attention. Growth-stage companies are our core,
                with room for a few local businesses we love.{" "}
                <em
                  className="not-italic"
                  style={{ color: "var(--ember)", fontStyle: "italic" }}
                >
                  Selective, because depth beats volume.
                </em>
              </p>
              <div
                className="mt-6 font-mono uppercase"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  color: "rgba(247,235,208,0.5)",
                }}
              >
                Who travels well
              </div>
            </motion.div>
          </div>

          {/* four big dark specimen cards on the green field */}
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {WHO_TYPES.map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease }}
                whileHover={{ y: -6, rotate: i % 2 ? 0.45 : -0.45 }}
                className="card-grain shadow-plate flex flex-col justify-between p-6 md:p-7"
                style={{
                  minHeight: "clamp(13rem, 19vw, 16.5rem)",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(158deg, var(--espresso) 0%, var(--espresso-2) 100%)",
                  border: "1px solid rgba(247,235,208,0.12)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-serif italic"
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--ember)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.5rem",
                      letterSpacing: "0.28em",
                      color: "rgba(247,235,208,0.4)",
                    }}
                  >
                    Specimen
                  </span>
                </div>

                <div className="mt-6">
                  <div
                    className="font-serif leading-[1.08]"
                    style={{
                      fontSize: "clamp(1.25rem, 1.55vw, 1.5rem)",
                      color: "var(--card-cream)",
                    }}
                  >
                    {w.name}
                  </div>
                  <p
                    className="mt-3 text-pretty"
                    style={{
                      fontSize: "0.86rem",
                      lineHeight: 1.55,
                      color: "rgba(247,235,208,0.7)",
                    }}
                  >
                    {w.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── URGENCY — slate twilight, the grey hour before dark ─────────── */
export function Urgency() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  /* the horizon drifts sideways as you pass it, like landscape from a trail */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const horizonX = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);

  return (
    <section
      id="urgency"
      ref={ref}
      className="relative overflow-hidden py-28 md:py-40"
      style={{
        background:
          "linear-gradient(172deg, #2A3A40 0%, #243338 55%, #1E2B30 100%)",
      }}
    >
      {/* a cold thin light along the horizon line of the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(110% 70% at 80% 100%, rgba(143,166,172,0.14), rgba(143,166,172,0) 55%)",
        }}
      />

      <div className="relative">
        <RunningHead left="Volume V" right="The Clock" tone="light" />

        <div className="mx-auto max-w-[1320px] px-6 md:px-16 mt-14">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-16 items-center">
            {/* LEFT — the argument */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease }}
                className="font-mono uppercase mb-5 flex items-center gap-2.5"
                style={{ fontSize: "0.62rem", letterSpacing: "0.32em", color: "#9FB6BC" }}
              >
                <span aria-hidden className="block h-1.5 w-1.5 rounded-full" style={{ background: "#9FB6BC" }} />
                The window is open
              </motion.div>
              <RiseLines
                className="font-serif font-light leading-[0.98] tracking-[-0.01em] text-balance"
                style={{ fontSize: "clamp(2.8rem, 5.2vw, 5.6rem)", color: "var(--card-cream)", maxWidth: "13ch" }}
                lines={[
                  <span key="a">The trail won&apos;t</span>,
                  <span key="b">
                    stay{" "}
                    <em className="not-italic" style={{ color: "var(--ember)", fontStyle: "italic" }}>
                      empty.
                    </em>
                  </span>,
                ]}
              />

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.12, ease }}
                className="mt-8 font-serif italic text-pretty"
                style={{ fontSize: "clamp(1.2rem, 1.55vw, 1.5rem)", lineHeight: 1.5, color: "rgba(247,235,208,0.92)", maxWidth: "40ch" }}
              >
                Two years from now, every mid-market business will be running some
                version of this engagement, with someone.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.2, ease }}
                className="mt-5 text-pretty"
                style={{ fontSize: "0.98rem", lineHeight: 1.7, color: "rgba(247,235,208,0.68)", maxWidth: "52ch" }}
              >
                Teams that start now will be operating their second and third
                generation of systems by the time their competitors run their
                first audit. The window to be early is open, and it is closing on
                a schedule no one will announce.
              </motion.p>
            </div>

            {/* RIGHT — the horizon artifact, parchment glowing against the dusk */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.05, delay: 0.28, ease }}
            >
              <div
                className="shadow-plate relative w-full overflow-hidden"
                style={{
                  aspectRatio: "2688 / 1480",
                  borderRadius: "16px",
                  border: "1px solid rgba(20,15,9,0.55)",
                  padding: "7px",
                  background: "var(--map-panel)",
                }}
              >
                <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: "10px" }}>
                  <motion.div
                    className="absolute inset-0"
                    style={{ x: horizonX, scale: 1.08 }}
                  >
                    <Image
                      src="/illustrations/horizon.png"
                      alt="Travelers approaching from the horizon"
                      fill
                      className="object-cover object-center select-none"
                      sizes="(min-width: 1024px) 56vw, 100vw"
                    />
                  </motion.div>
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[7px] rounded-[10px]"
                  style={{ border: "1px solid rgba(247,235,208,0.18)" }}
                />
              </div>
              <p
                className="mt-6 font-serif italic text-pretty"
                style={{ fontSize: "clamp(1.5rem, 2vw, 2.2rem)", lineHeight: 1.3, color: "var(--ember)", maxWidth: "18ch" }}
              >
                Get on the trail before it crowds.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── FINAL — a seat at the fire, centered invitation ─────────── */
/* ember motes drifting up from the fire. deterministic values (no Math.random
   in render) so server and client agree. left %, bottom %, size px, duration s,
   delay s, sideways drift px, rise vh, peak opacity. */
const EMBERS = [
  { l: 38, b: 10, s: 3, d: 9.5, de: 0.0, dx: 26, r: -44, o: 0.85 },
  { l: 44, b: 14, s: 2, d: 7.8, de: 1.6, dx: -18, r: -38, o: 0.7 },
  { l: 50, b: 8, s: 4, d: 11.2, de: 0.8, dx: 12, r: -50, o: 0.9 },
  { l: 55, b: 12, s: 2, d: 8.4, de: 2.9, dx: -24, r: -36, o: 0.65 },
  { l: 60, b: 9, s: 3, d: 10.1, de: 1.2, dx: 30, r: -46, o: 0.8 },
  { l: 47, b: 16, s: 2, d: 7.2, de: 3.8, dx: 8, r: -32, o: 0.6 },
  { l: 41, b: 7, s: 2, d: 12.0, de: 2.2, dx: -14, r: -52, o: 0.75 },
  { l: 58, b: 15, s: 3, d: 8.9, de: 4.5, dx: 20, r: -40, o: 0.7 },
  { l: 52, b: 11, s: 2, d: 9.8, de: 5.4, dx: -28, r: -42, o: 0.65 },
  { l: 35, b: 13, s: 2, d: 10.6, de: 3.1, dx: 16, r: -34, o: 0.55 },
  { l: 64, b: 10, s: 2, d: 11.5, de: 6.2, dx: -10, r: -48, o: 0.6 },
  { l: 49, b: 6, s: 3, d: 8.0, de: 7.0, dx: 22, r: -44, o: 0.8 },
];

export function Final() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative isolate overflow-hidden pt-28 md:pt-36 pb-28 md:pb-36"
      style={{
        background:
          "linear-gradient(to bottom, var(--espresso-2) 0%, var(--espresso) 54%, #18110a 100%)",
      }}
    >
      {/* seam blend: the slate dusk settles into firelit night at the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-44"
        style={{
          zIndex: -5,
          background:
            "linear-gradient(to bottom, #1E2B30 0%, rgba(28,21,13,0) 100%)",
        }}
      />

      {/* campfire — a warm glow rising from the foot of the section, not a
          panel beside the text. The scene is the atmosphere; the words sit in
          its light. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 1.06 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease }}
        className="absolute inset-x-0 bottom-0 -z-10 select-none mx-auto"
        style={{
          width: "min(60rem, 96vw)",
          aspectRatio: "2336 / 1744",
          maskImage: FADE_SQUARISH,
          WebkitMaskImage: FADE_SQUARISH,
        }}
      >
        <Image
          src="/illustrations/campfire.png"
          alt=""
          fill
          className="object-contain object-bottom"
          sizes="(min-width: 1024px) 60vw, 96vw"
        />
        {/* settle the painting into the night ground above it */}
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: "linear-gradient(to bottom, var(--espresso-2), rgba(27,21,13,0))" }}
        />
      </motion.div>

      {/* embers rising off the fire, carried on the night air */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] overflow-hidden"
      >
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={
              {
                left: `${e.l}%`,
                bottom: `${e.b}%`,
                width: e.s,
                height: e.s,
                background: i % 3 === 0 ? "#F2A65A" : "#E8742C",
                boxShadow: "0 0 6px 1px rgba(232,116,44,0.5)",
                opacity: 0,
                "--dx": `${e.dx}px`,
                "--rise": `${e.r}vh`,
                "--o": e.o,
                animation: `ember-rise ${e.d}s linear ${e.de}s infinite`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <RunningHead left="Volume VI" right="Begin" tone="light" />

      <div className="relative mx-auto max-w-[52rem] px-6 text-center mt-20 md:mt-28">
        {/* warm-dark scrim so the invitation stays legible in the fire's glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "138%",
            height: "156%",
            background:
              "radial-gradient(60% 56% at 50% 46%, rgba(20,14,8,0.78), rgba(20,14,8,0) 72%)",
          }}
        />
        <div className="relative">
        <RiseLines
          className="font-serif font-light leading-[1.0] tracking-[-0.01em] text-balance mx-auto"
          style={{ fontSize: "clamp(2.6rem, 5vw, 5.4rem)", color: "var(--card-cream)", maxWidth: "18ch" }}
          lines={[
            <span key="a">This is the part most shops skip.</span>,
            <em
              key="b"
              className="not-italic"
              style={{ color: "var(--ember)", fontStyle: "italic" }}
            >
              It is the only part we care about.
            </em>,
          ]}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.12, ease }}
          className="mt-7 font-serif italic mx-auto text-pretty"
          style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.28rem)", lineHeight: 1.55, color: "rgba(247,235,208,0.8)", maxWidth: "46ch" }}
        >
          If the practice resonates, the next step is a thirty-minute
          conversation. No deck. We walk through your business and tell you
          whether we can help.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.22, ease }}
          className="mt-10 flex justify-center"
        >
          <motion.a
            href="mailto:hello@worksmartsc.com"
            className="group inline-flex w-fit items-center gap-3 rounded-full px-8 py-4 font-sans font-semibold tracking-wide"
            style={{
              background: "var(--ember)",
              color: "var(--cream)",
              fontSize: "0.98rem",
              boxShadow: "0 4px 18px rgba(222,76,0,0.25)",
            }}
            whileHover={{ scale: 1.04, boxShadow: "0 10px 34px rgba(222,76,0,0.42)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            Start the conversation
            <span
              className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5"
              style={{ background: "rgba(0,0,0,0.18)" }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11">
                <path
                  d="M1 5.5h9M5.5 1l4.5 4.5L5.5 10"
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
        </div>
      </div>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */
export function Footer() {
  const muted = "rgba(247,235,208,0.55)";
  return (
    <footer style={{ background: "#18110a" }}>
      <div
        className="border-t mx-auto px-6 md:px-16 py-10 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center text-center md:text-left"
        style={{
          borderColor: "rgba(247,235,208,0.12)",
          maxWidth: "1320px",
        }}
      >
        <span
          className="font-mono text-[0.62rem] tracking-[0.28em] uppercase"
          style={{ color: muted }}
        >
          WorkSmart SC · Greenville, SC
        </span>
        <span
          className="font-serif italic"
          style={{ fontSize: "0.95rem", color: "rgba(247,235,208,0.72)" }}
        >
          A field guide · Volume I
        </span>
        <div
          className="flex justify-center md:justify-end gap-7 font-mono text-[0.62rem] tracking-[0.28em] uppercase"
          style={{ color: muted }}
        >
          <a
            href="mailto:hello@worksmartsc.com"
            className="transition-colors"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--ember)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = muted)
            }
          >
            Email
          </a>
          <a
            href="#top"
            className="transition-colors"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--ember)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = muted)
            }
          >
            Top
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Sections() {
  return (
    <>
      <Outcomes />
      <Who />
      <Urgency />
      <Final />
      <Footer />
    </>
  );
}
