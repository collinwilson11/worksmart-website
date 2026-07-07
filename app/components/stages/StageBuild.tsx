"use client";

/**
 * Stage III,Build
 * Concrete: shows the three things we ship.
 *  1. A custom dashboard panel with KPIs + drawn line chart
 *  2. An AI agent chat interface with messages typing in
 *  3. A workflow automation diagram with nodes lighting in sequence
 * Each artifact is labeled and animates into place.
 */
import { motion } from "motion/react";

export default function StageBuild() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="block h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="b-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf3e6" />
          <stop offset="100%" stopColor="#efe5d3" />
        </linearGradient>
      </defs>

      {/* Notebook plate */}
      <rect x="20" y="20" width="560" height="560" rx="2" fill="url(#b-paper)" stroke="#75634d" strokeWidth="1" />
      <rect x="32" y="32" width="536" height="536" fill="none" stroke="#75634d" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="2 4" />

      <text x="44" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d">SHEET III · WHAT WE SHIP</text>
      <text x="556" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d" textAnchor="end">3 ARTEFACTS</text>

      <text x="44" y="92" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="22" fill="#271503">
        Built into the tools you already trust.
      </text>
      <line x1="44" y1="106" x2="556" y2="106" stroke="#271503" strokeOpacity="0.3" strokeWidth="0.8" />

      {/* === ARTEFACT 1: Custom dashboard === */}
      <motion.g
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        <text x="44" y="138" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2.5" fill="#de4c00">01 · DASHBOARD</text>
        <text x="44" y="158" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="14" fill="#271503">
          Real numbers, refreshed live, in your stack.
        </text>

        {/* Window chrome */}
        <rect x="44" y="170" width="240" height="160" rx="3" fill="#faf3e6" stroke="#271503" strokeWidth="1.2" />
        <rect x="44" y="170" width="240" height="20" rx="3" fill="#271503" />
        <circle cx="56" cy="180" r="2.5" fill="#de4c00" />
        <circle cx="64" cy="180" r="2.5" fill="#efa680" />
        <circle cx="72" cy="180" r="2.5" fill="#75634d" />
        <text x="160" y="184" fontFamily="var(--font-plex-mono), monospace" fontSize="8" letterSpacing="1.5" fill="#faf3e6" textAnchor="middle">ops · today</text>

        {/* KPI tiles */}
        {[
          { x: 54, y: 200, label: "HRS SAVED", v: "+38" },
          { x: 132, y: 200, label: "CYCLE", v: "−42%" },
          { x: 210, y: 200, label: "REVENUE", v: "+$47k" },
        ].map((k, i) => (
          <motion.g
            key={k.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 + i * 0.12, duration: 0.4 }}
          >
            <rect x={k.x} y={k.y} width="68" height="44" fill="#efe5d3" stroke="#75634d" strokeOpacity="0.4" strokeWidth="0.6" />
            <text x={k.x + 6} y={k.y + 13} fontFamily="var(--font-plex-mono), monospace" fontSize="6.5" letterSpacing="1.2" fill="#75634d">{k.label}</text>
            <text x={k.x + 6} y={k.y + 33} fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="15" fill="#271503">{k.v}</text>
          </motion.g>
        ))}

        {/* Line chart drawing */}
        <rect x="54" y="252" width="220" height="68" fill="#efe5d3" stroke="#75634d" strokeOpacity="0.4" strokeWidth="0.6" />
        <motion.path
          d="M 60 308 L 90 296 L 120 300 L 150 282 L 180 274 L 210 264 L 240 250 L 268 238"
          fill="none"
          stroke="#de4c00"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.0, duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
        />
        {/* Axis ticks */}
        {[60, 110, 160, 210, 260].map((x) => (
          <line key={x} x1={x} y1="316" x2={x} y2="320" stroke="#75634d" strokeOpacity="0.5" strokeWidth="0.6" />
        ))}
      </motion.g>

      {/* === ARTEFACT 2: Custom AI agent === */}
      <motion.g
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        <text x="316" y="138" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2.5" fill="#de4c00">02 · CUSTOM AGENT</text>
        <text x="316" y="158" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="14" fill="#271503">
          Trained on your work. Owned by your team.
        </text>

        <rect x="316" y="170" width="240" height="160" rx="3" fill="#faf3e6" stroke="#271503" strokeWidth="1.2" />
        <rect x="316" y="170" width="240" height="20" rx="3" fill="#271503" />
        <text x="436" y="184" fontFamily="var(--font-plex-mono), monospace" fontSize="8" letterSpacing="1.5" fill="#faf3e6" textAnchor="middle">intake-agent · v1</text>

        {/* Bubble: user */}
        <motion.g
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          <rect x="324" y="200" width="186" height="22" rx="11" fill="#efe5d3" />
          <text x="334" y="215" fontFamily="var(--font-fraunces), serif" fontSize="10.5" fill="#271503">
            New ticket from Acme · RFP.
          </text>
        </motion.g>

        {/* Bubble: agent */}
        <motion.g
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.15, duration: 0.4 }}
        >
          <rect x="332" y="232" width="218" height="48" rx="11" fill="#de4c00" />
          <text x="342" y="248" fontFamily="var(--font-fraunces), serif" fontSize="10.5" fill="#faf3e6">
            Routed to Marcus. Quote drafted.
          </text>
          <text x="342" y="264" fontFamily="var(--font-fraunces), serif" fontSize="10.5" fill="#faf3e6">
            Margin held at 31%. Ready to send.
          </text>
        </motion.g>

        {/* Typing indicator */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 1.55, duration: 2.0, repeat: Infinity, repeatDelay: 1 }}
        >
          <rect x="324" y="290" width="42" height="18" rx="9" fill="#efe5d3" />
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={332 + i * 7}
              cy={299}
              r="1.6"
              fill="#75634d"
              animate={{ y: [-1, 1, -1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </motion.g>
      </motion.g>

      {/* === ARTEFACT 3: Workflow automation === */}
      <motion.g
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        <text x="44" y="362" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2.5" fill="#de4c00">03 · WORKFLOW AUTOMATION</text>
        <text x="44" y="382" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="14" fill="#271503">
          The repetitive work, run on rails.
        </text>

        {/* Workflow nodes */}
        {[
          { x: 60, y: 410, label: "TRIGGER", desc: "new invoice", t: "circle" },
          { x: 180, y: 410, label: "EXTRACT", desc: "vendor + amount", t: "rect" },
          { x: 320, y: 410, label: "VALIDATE", desc: "PO match", t: "diamond" },
          { x: 460, y: 410, label: "ROUTE", desc: "approver queue", t: "rect" },
        ].map((n, i) => (
          <motion.g
            key={n.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 + i * 0.18, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            {n.t === "circle" && <circle cx={n.x + 40} cy={n.y + 24} r="22" fill="#faf3e6" stroke="#271503" strokeWidth="1.2" />}
            {n.t === "rect" && <rect x={n.x} y={n.y} width="80" height="48" rx="2" fill="#faf3e6" stroke="#271503" strokeWidth="1.2" />}
            {n.t === "diamond" && (
              <polygon
                points={`${n.x + 40},${n.y + 2} ${n.x + 78},${n.y + 24} ${n.x + 40},${n.y + 46} ${n.x + 2},${n.y + 24}`}
                fill="#faf3e6"
                stroke="#271503"
                strokeWidth="1.2"
              />
            )}
            <text x={n.x + 40} y={n.y + 22} fontFamily="var(--font-plex-mono), monospace" fontSize="8" letterSpacing="1.5" fill="#271503" textAnchor="middle">{n.label}</text>
            <text x={n.x + 40} y={n.y + 36} fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="9" fill="#75634d" textAnchor="middle">{n.desc}</text>
          </motion.g>
        ))}

        {/* Animated arrows between nodes */}
        {[140, 260, 400].map((x, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 + i * 0.18, duration: 0.4 }}
          >
            <line x1={x} y1="434" x2={x + 38} y2="434" stroke="#de4c00" strokeWidth="1.6" />
            <polygon points={`${x + 38},${434} ${x + 32},${430} ${x + 32},${438}`} fill="#de4c00" />
          </motion.g>
        ))}

        {/* Pulse showing flow */}
        <motion.circle
          cx="100"
          cy="434"
          r="3"
          fill="#de4c00"
          animate={{ cx: [100, 220, 360, 500, 100] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2, ease: "easeInOut" }}
        />

        <text x="44" y="490" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="12.5" fill="#271503">
          Built into your stack,Slack, HubSpot, Notion, QuickBooks.
        </text>
      </motion.g>

      {/* Bottom annotation */}
      <line x1="44" y1="510" x2="556" y2="510" stroke="#271503" strokeOpacity="0.2" strokeWidth="0.5" />
      <text x="44" y="536" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#75634d">SHIP CADENCE</text>
      <text x="44" y="556" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="13" fill="#271503">
        One component live every 5–7 working days.
      </text>
    </svg>
  );
}
