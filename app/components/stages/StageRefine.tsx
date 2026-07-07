"use client";

/**
 * Stage V,Refine
 * Concrete: a live operations dashboard with KPIs ticking up,
 * a chart drawing itself, status checks, monthly review pulse.
 * The "ongoing" stage made tangible.
 */
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

function Counter({ to, duration = 2, prefix = "", suffix = "" }: { to: number; duration?: number; prefix?: string; suffix?: string }) {
  const v = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const ctrl = animate(v, to, {
      duration,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (val) => setDisplay(Math.round(val).toLocaleString()),
    });
    return () => ctrl.stop();
  }, [to, duration, v]);
  return (
    <tspan>
      {prefix}
      {display}
      {suffix}
    </tspan>
  );
}

export default function StageRefine() {
  return (
    <svg viewBox="0 0 600 600" className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="r-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf3e6" />
          <stop offset="100%" stopColor="#efe5d3" />
        </linearGradient>
      </defs>

      <rect x="20" y="20" width="560" height="560" rx="2" fill="url(#r-paper)" stroke="#75634d" strokeWidth="1" />
      <rect x="32" y="32" width="536" height="536" fill="none" stroke="#75634d" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="2 4" />

      <text x="44" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d">SHEET V · LIVE OPERATIONS</text>
      <text x="556" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d" textAnchor="end">QTR 4 · 2024</text>

      <text x="44" y="92" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="22" fill="#271503">
        The dials your team watches.
      </text>
      <line x1="44" y1="106" x2="556" y2="106" stroke="#271503" strokeOpacity="0.3" strokeWidth="0.8" />

      {/* === KPI grid (4 cards) === */}
      {[
        { x: 44,  y: 130, label: "HOURS · YTD",      prefix: "",   suffix: "h",    to: 1240 },
        { x: 200, y: 130, label: "REVENUE",          prefix: "$",  suffix: "k",    to: 387 },
        { x: 356, y: 130, label: "COMPONENTS",       prefix: "",   suffix: "/7",   to: 7 },
        { x: 44,  y: 230, label: "CYCLE TIME",       prefix: "−",  suffix: "%",    to: 42 },
        { x: 200, y: 230, label: "TICKETS / WK",     prefix: "",   suffix: "",     to: 247 },
        { x: 356, y: 230, label: "UPTIME · 90D",     prefix: "",   suffix: "%",    to: 99 },
      ].map((k, i) => (
        <motion.g
          key={k.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.1, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        >
          <rect x={k.x} y={k.y} width="140" height="80" rx="2" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
          <line x1={k.x} y1={k.y + 16} x2={k.x + 140} y2={k.y + 16} stroke="#271503" strokeOpacity="0.2" strokeWidth="0.5" />
          <text
            x={k.x + 8}
            y={k.y + 12}
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="7.5"
            letterSpacing="1.4"
            fill="#75634d"
          >
            {k.label}
          </text>
          <text
            x={k.x + 8}
            y={k.y + 50}
            fontFamily="var(--font-fraunces), serif"
            fontStyle="italic"
            fontSize="26"
            fill="#271503"
          >
            <Counter to={k.to} prefix={k.prefix} suffix={k.suffix} duration={1.6} />
          </text>
          {/* Tiny sparkline */}
          <motion.path
            d={`M ${k.x + 8} ${k.y + 70} L ${k.x + 30} ${k.y + 66} L ${k.x + 52} ${k.y + 68} L ${k.x + 74} ${k.y + 60} L ${k.x + 96} ${k.y + 56} L ${k.x + 118} ${k.y + 50} L ${k.x + 132} ${k.y + 46}`}
            fill="none"
            stroke="#de4c00"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 1.2 }}
          />
        </motion.g>
      ))}

      {/* === Big chart === */}
      <motion.g
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
      >
        <rect x="44" y="334" width="452" height="142" rx="2" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
        <text x="56" y="354" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#75634d">HRS/WK RECLAIMED · LAST 12 WEEKS</text>
        {/* Grid */}
        {[1, 2, 3].map((i) => (
          <line key={i} x1="56" y1={372 + i * 28} x2="488" y2={372 + i * 28} stroke="#271503" strokeOpacity="0.07" strokeWidth="0.5" />
        ))}
        {/* Axis */}
        <line x1="56" y1="464" x2="488" y2="464" stroke="#271503" strokeOpacity="0.3" strokeWidth="0.6" />
        {/* Animated chart path */}
        <motion.path
          d="M 56 460 L 92 452 L 128 444 L 164 436 L 200 426 L 236 418 L 272 404 L 308 394 L 344 384 L 380 372 L 416 360 L 452 348 L 488 340"
          fill="none"
          stroke="#de4c00"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.0, duration: 1.6, ease: [0.32, 0.72, 0, 1] }}
        />
        {/* Animated dot at end */}
        <motion.circle
          cx="488"
          cy="340"
          r="4"
          fill="#de4c00"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, r: [4, 7, 4] }}
          transition={{ delay: 2.4, duration: 2, repeat: Infinity }}
        />
      </motion.g>

      {/* === Right side: status checks === */}
      <motion.g
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <text x="500" y="354" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#75634d">STATUS</text>
        {["INTAKE", "TRIAGE", "QUOTE", "APPROVE", "REPORT"].map((s, i) => (
          <g key={s} transform={`translate(500, ${374 + i * 18})`}>
            <motion.circle
              r="4"
              fill="#5b6e4f"
              animate={{ opacity: [1, 0.45, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
            />
            <text x="11" y="4" fontFamily="var(--font-plex-mono), monospace" fontSize="8" letterSpacing="1.5" fill="#271503">{s}</text>
          </g>
        ))}
      </motion.g>

      {/* === Monthly review row === */}
      <line x1="44" y1="500" x2="556" y2="500" stroke="#271503" strokeOpacity="0.2" strokeWidth="0.5" />
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <text x="44" y="524" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#75634d">MONTHLY REVIEWS</text>
        <g transform="translate(44, 540)">
          {[
            { m: "JUL", done: true },
            { m: "AUG", done: true },
            { m: "SEP", done: true },
            { m: "OCT", done: true },
            { m: "NOV", done: false, current: true },
            { m: "DEC", done: false },
          ].map((p, i) => (
            <g key={p.m} transform={`translate(${i * 80}, 0)`}>
              {p.done ? (
                <>
                  <circle cx="10" cy="10" r="9" fill="#de4c00" />
                  <path d="M 6 10 L 9 13 L 14 7" fill="none" stroke="#faf3e6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : p.current ? (
                <>
                  <circle cx="10" cy="10" r="9" fill="none" stroke="#de4c00" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="10" cy="10" r="3" fill="#de4c00">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                </>
              ) : (
                <circle cx="10" cy="10" r="9" fill="none" stroke="#75634d" strokeOpacity="0.4" strokeWidth="1" />
              )}
              <text
                x="28"
                y="14"
                fontFamily="var(--font-plex-mono), monospace"
                fontSize="9"
                letterSpacing="1.5"
                fill={p.current ? "#de4c00" : p.done ? "#271503" : "#75634d"}
              >
                {p.m}
              </text>
            </g>
          ))}
        </g>
      </motion.g>
    </svg>
  );
}
