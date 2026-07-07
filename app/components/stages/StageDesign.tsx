"use client";

/**
 * Stage II,Design
 * Concrete: a system-architecture blueprint.
 * Real labeled components ("Quote Generator Agent", "Approval Workflow")
 * connected with drawn lines via motion pathLength.
 * Owners + metrics appear after lines connect.
 */
import { motion } from "motion/react";

const NODES = [
  { id: "intake",    x: 100, y: 180, w: 130, h: 64, name: "Intake Agent",      sub: "Customer email → ticket" },
  { id: "triage",    x: 280, y: 180, w: 130, h: 64, name: "Triage + Routing",  sub: "Tag · prioritise · assign" },
  { id: "quote",     x: 460, y: 130, w: 130, h: 64, name: "Quote Generator",   sub: "Catalogue + margin guard" },
  { id: "approve",   x: 460, y: 240, w: 130, h: 64, name: "Approval Workflow", sub: "Sign-off · audit · notify" },
  { id: "report",    x: 280, y: 360, w: 130, h: 64, name: "Reporting Layer",   sub: "Live dashboards · weekly digest" },
] as const;

const CONNECTIONS: Array<{ from: string; to: string; d: string; delay: number }> = [
  { from: "intake",  to: "triage",  d: "M 230 212 L 280 212",                        delay: 1.7 },
  { from: "triage",  to: "quote",   d: "M 410 200 L 460 162",                        delay: 1.9 },
  { from: "triage",  to: "approve", d: "M 410 224 L 460 272",                        delay: 2.05 },
  { from: "quote",   to: "report",  d: "M 525 194 Q 525 360 410 392",                delay: 2.25 },
  { from: "approve", to: "report",  d: "M 525 304 Q 525 392 410 392",                delay: 2.4 },
];

export default function StageDesign() {
  return (
    <svg viewBox="0 0 600 600" className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <pattern id="grid-fine" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#75634d" strokeOpacity="0.12" strokeWidth="0.4" />
        </pattern>
        <pattern id="grid-coarse" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#75634d" strokeOpacity="0.24" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* Blueprint paper */}
      <rect x="20" y="20" width="560" height="560" rx="2" fill="#faf3e6" stroke="#75634d" strokeWidth="1" />
      <rect x="20" y="20" width="560" height="560" fill="url(#grid-fine)" />
      <rect x="20" y="20" width="560" height="560" fill="url(#grid-coarse)" />

      {/* Title block */}
      <rect x="40" y="40" width="240" height="50" fill="#faf3e6" stroke="#271503" strokeWidth="0.8" />
      <text x="50" y="58" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="3" fill="#75634d">SHEET II · SYSTEM PLAN</text>
      <text x="50" y="78" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="16" fill="#271503">Quote-to-Cash · v0.3</text>
      <text x="270" y="58" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="3" fill="#75634d" textAnchor="end">REV 02</text>
      <text x="270" y="78" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#de4c00" textAnchor="end">SIGN-OFF · PENDING</text>

      {/* Components,drawn with motion */}
      {NODES.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.22, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Box */}
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx="2"
            fill="#faf3e6"
            stroke="#271503"
            strokeWidth="1.4"
          />
          {/* Top tab */}
          <rect x={n.x} y={n.y - 12} width={Math.min(72, n.w - 6)} height="12" fill="#271503" />
          <text
            x={n.x + 6}
            y={n.y - 3}
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="8"
            letterSpacing="2"
            fill="#faf3e6"
          >
            COMPONENT {String(i + 1).padStart(2, "0")}
          </text>
          {/* Title */}
          <text
            x={n.x + 12}
            y={n.y + 26}
            fontFamily="var(--font-fraunces), serif"
            fontSize="14"
            fill="#271503"
          >
            {n.name}
          </text>
          {/* Sub */}
          <text
            x={n.x + 12}
            y={n.y + 46}
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="9"
            letterSpacing="1.4"
            fill="#75634d"
          >
            {n.sub}
          </text>
          {/* Endpoint dot */}
          <circle cx={n.x + n.w} cy={n.y + n.h / 2} r="2.5" fill="#de4c00" />
          <circle cx={n.x} cy={n.y + n.h / 2} r="2.5" fill="#de4c00" />
        </motion.g>
      ))}

      {/* Connection lines drawing themselves */}
      <g stroke="#de4c00" fill="none" strokeWidth="1.6" strokeLinecap="round">
        {CONNECTIONS.map((c) => (
          <motion.path
            key={`${c.from}-${c.to}`}
            d={c.d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: c.delay, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          />
        ))}
      </g>

      {/* Owner / metric callouts (after lines drawn) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.6 }}
      >
        <CalloutLine x1={165} y1={244} x2={165} y2={300} />
        <text x="165" y="316" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="1.5" fill="#75634d" textAnchor="middle">OWNER</text>
        <text x="165" y="332" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="13" fill="#271503" textAnchor="middle">Tasha Reyes</text>

        <CalloutLine x1={525} y1={194} x2={525} y2={110} />
        <text x="525" y="100" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="1.5" fill="#75634d" textAnchor="middle">METRIC</text>
        <text x="525" y="86" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="13" fill="#271503" textAnchor="middle">quote &lt; 1h</text>

        <CalloutLine x1={525} y1={304} x2={525} y2={420} />
        <text x="525" y="436" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="1.5" fill="#75634d" textAnchor="middle">OWNER</text>
        <text x="525" y="452" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="13" fill="#271503" textAnchor="middle">Marcus Wei</text>
      </motion.g>

      {/* Legend at bottom */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0, duration: 0.6 }}
      >
        <line x1="40" y1="480" x2="560" y2="480" stroke="#271503" strokeOpacity="0.2" strokeWidth="0.5" />
        <g transform="translate(40, 510)">
          <text fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#75634d">LEGEND</text>
          <g transform="translate(0, 18)">
            <rect x="0" y="-8" width="16" height="10" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
            <text x="22" y="0" fontFamily="var(--font-plex-mono), monospace" fontSize="9" fill="#271503">component</text>
            <line x1="120" y1="-3" x2="148" y2="-3" stroke="#de4c00" strokeWidth="1.6" />
            <text x="156" y="0" fontFamily="var(--font-plex-mono), monospace" fontSize="9" fill="#271503">data flow</text>
            <circle cx="232" cy="-3" r="2.5" fill="#de4c00" />
            <text x="240" y="0" fontFamily="var(--font-plex-mono), monospace" fontSize="9" fill="#271503">interface</text>
          </g>
        </g>
        <text x="556" y="528" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="12" fill="#271503" textAnchor="end">
          5 components · 5 connections · 1 owner each
        </text>
      </motion.g>
    </svg>
  );
}

function CalloutLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#75634d" strokeOpacity="0.65" strokeWidth="0.7" strokeDasharray="2 3" />;
}
