"use client";

/**
 * Stage I,Diagnose
 * Concrete: an audit-report page with real-looking findings.
 * Three columns: TIME LEAKS, REVENUE LEAKS, KNOWLEDGE GAPS.
 * Highlighter pen sweeps over the top-impact rows.
 */
import { motion } from "motion/react";

const FINDINGS = [
  {
    head: "Time leaks",
    items: [
      ["Invoice approval, manual", "9.2 hrs/wk", true],
      ["Weekly report stitching", "4.5 hrs/wk", true],
      ["Sales-to-ops handoff", "3.0 hrs/wk", false],
      ["Onboarding emails", "2.6 hrs/wk", false],
    ],
  },
  {
    head: "Revenue leaks",
    items: [
      ["Slow quote turnaround", "−18% win rate", true],
      ["Missed renewals", "$84k at risk", true],
      ["Approvals over 24h", "−6% close", false],
    ],
  },
  {
    head: "Knowledge gaps",
    items: [
      ["Closing process: 1 owner", "single point of risk", true],
      ["Heuristics undocumented", "6-wk training", false],
      ["Vendor SLAs in sheets", "fragile, no audit", false],
    ],
  },
] as const;

export default function StageDiagnose() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="block h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="d-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf3e6" />
          <stop offset="100%" stopColor="#efe5d3" />
        </linearGradient>
      </defs>

      {/* Notebook page */}
      <rect x="20" y="20" width="560" height="560" rx="2" fill="url(#d-paper)" stroke="#75634d" strokeWidth="1" />
      <rect x="32" y="32" width="536" height="536" fill="none" stroke="#75634d" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="2 4" />

      {/* Plate header */}
      <text x="44" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d">FIELD AUDIT · SHEET I/V</text>
      <text x="556" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d" textAnchor="end">12 FINDINGS</text>

      {/* Title */}
      <text x="44" y="92" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="22" fill="#271503">
        Where the week leaks.
      </text>
      <line x1="44" y1="106" x2="556" y2="106" stroke="#271503" strokeOpacity="0.3" strokeWidth="0.8" />

      {/* Three finding columns */}
      {FINDINGS.map((col, ci) => {
        const colX = 44 + ci * 174;
        return (
          <g key={col.head}>
            {/* Column header */}
            <text
              x={colX}
              y="138"
              fontFamily="var(--font-plex-mono), monospace"
              fontSize="9"
              letterSpacing="2.5"
              fill="#de4c00"
            >
              {col.head.toUpperCase()}
            </text>
            <line x1={colX} y1="146" x2={colX + 154} y2="146" stroke="#de4c00" strokeOpacity="0.5" strokeWidth="0.7" />

            {/* Items */}
            {col.items.map((it, ii) => {
              const [label, value, hot] = it as [string, string, boolean];
              const y = 174 + ii * 64;
              return (
                <motion.g
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.25 + ci * 0.18 + ii * 0.12,
                    duration: 0.55,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  {/* Highlighter sweep on hot items */}
                  {hot && (
                    <motion.rect
                      x={colX - 4}
                      y={y - 18}
                      width="0"
                      height="36"
                      fill="#de4c00"
                      fillOpacity="0.18"
                      animate={{ width: [0, 162, 162, 162] }}
                      transition={{
                        delay: 0.45 + ci * 0.18 + ii * 0.12,
                        duration: 0.7,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                    />
                  )}
                  <text
                    x={colX}
                    y={y}
                    fontFamily="var(--font-fraunces), serif"
                    fontSize="12"
                    fill="#271503"
                  >
                    {label}
                  </text>
                  <text
                    x={colX}
                    y={y + 18}
                    fontFamily="var(--font-plex-mono), monospace"
                    fontSize="10"
                    letterSpacing="1.2"
                    fill={hot ? "#de4c00" : "#75634d"}
                  >
                    {value}
                  </text>
                  {/* Margin tick */}
                  <line
                    x1={colX - 10}
                    y1={y - 4}
                    x2={colX - 6}
                    y2={y - 4}
                    stroke={hot ? "#de4c00" : "#75634d"}
                    strokeWidth="1.2"
                  />
                </motion.g>
              );
            })}
          </g>
        );
      })}

      {/* Animated highlighter pen drifting */}
      <motion.g
        initial={{ x: -60, y: 0, rotate: -28 }}
        animate={{
          x: [-60, 110, 280, 110, -60],
          y: [0, 30, 12, 50, 0],
          rotate: [-28, -22, -30, -18, -28],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0 0" }}
      >
        <g transform="translate(180, 200)">
          <rect x="0" y="0" width="92" height="14" fill="#de4c00" stroke="#271503" strokeWidth="1" />
          <rect x="92" y="0" width="14" height="14" fill="#271503" />
          <polygon points="106,0 122,7 106,14" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
          <line x1="118" y1="7" x2="124" y2="7" stroke="#de4c00" strokeWidth="2" strokeLinecap="round" />
        </g>
      </motion.g>

      {/* Bottom summary */}
      <line x1="44" y1="496" x2="556" y2="496" stroke="#271503" strokeOpacity="0.2" strokeWidth="0.6" />

      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.7 }}
      >
        <text x="44" y="522" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2.5" fill="#75634d">RANKED OPPORTUNITY MAP</text>
        <text x="44" y="548" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="14" fill="#271503">
          Top 3 deliver ~70% of recovered hours.
        </text>
        <g transform="translate(390, 538)">
          <circle r="10" fill="none" stroke="#de4c00" strokeWidth="1.4" />
          <circle r="3.5" fill="#de4c00" />
          <text x="18" y="4" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#de4c00">START HERE</text>
        </g>
      </motion.g>
    </svg>
  );
}
