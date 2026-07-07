"use client";

/**
 * Stage IV,Train
 * Concrete: knowledge transfer card.
 * Left: components with named owners
 * Right: handoff artefacts (runbook, recorded session, parallel-run log)
 * Animated arrows from "us" → "your team"
 */
import { motion } from "motion/react";

const HANDOFF = [
  { component: "Quote-to-Cash", owner: "Marcus Wei", title: "Head of Ops" },
  { component: "Customer Intake", owner: "Tasha Reyes", title: "Account Lead" },
  { component: "Reporting Layer", owner: "Jamie Park", title: "Finance Manager" },
  { component: "Approval Workflow", owner: "Devin Larkin", title: "VP, Sales" },
] as const;

const ARTEFACTS = [
  { tag: "Runbook", body: "12-page operator's manual · screenshots · exception paths" },
  { tag: "Recorded sessions", body: "Two 90-min walkthroughs · per component · re-watchable" },
  { tag: "Parallel run", body: "10 days, humans + agents in tandem · variance log" },
  { tag: "Office hours", body: "Weekly standing channel · 60 days post-handoff" },
] as const;

export default function StageTrain() {
  return (
    <svg viewBox="0 0 600 600" className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="t-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf3e6" />
          <stop offset="100%" stopColor="#efe5d3" />
        </linearGradient>
      </defs>

      <rect x="20" y="20" width="560" height="560" rx="2" fill="url(#t-paper)" stroke="#75634d" strokeWidth="1" />
      <rect x="32" y="32" width="536" height="536" fill="none" stroke="#75634d" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="2 4" />

      <text x="44" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d">SHEET IV · HANDOVER</text>
      <text x="556" y="56" fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="3" fill="#75634d" textAnchor="end">A NAME ON EVERY PART</text>

      <text x="44" y="92" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="22" fill="#271503">
        We hand over the keys, room by room.
      </text>
      <line x1="44" y1="106" x2="556" y2="106" stroke="#271503" strokeOpacity="0.3" strokeWidth="0.8" />

      {/* Two columns: components → owners (left)  |  artefacts (right) */}

      {/* Left column: components owned */}
      <text x="44" y="138" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2.5" fill="#de4c00">COMPONENT · OWNER</text>
      {HANDOFF.map((h, i) => {
        const y = 156 + i * 76;
        return (
          <motion.g
            key={h.component}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.18, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Component card */}
            <rect x="44" y={y} width="216" height="56" rx="2" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
            <rect x="44" y={y} width="216" height="14" fill="#271503" />
            <text x="52" y={y + 10} fontFamily="var(--font-plex-mono), monospace" fontSize="7.5" letterSpacing="1.4" fill="#faf3e6">COMPONENT {String(i + 1).padStart(2, "0")}</text>
            <text x="52" y={y + 32} fontFamily="var(--font-fraunces), serif" fontSize="13" fill="#271503">{h.component}</text>
            <text x="52" y={y + 48} fontFamily="var(--font-plex-mono), monospace" fontSize="8" letterSpacing="1.3" fill="#75634d">OWNER · {h.owner.toUpperCase()}</text>

            {/* Avatar */}
            <g transform={`translate(232, ${y + 28})`}>
              <circle r="14" fill="#efa680" stroke="#271503" strokeWidth="1" />
              <text fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="13" fill="#271503" textAnchor="middle" y="5">
                {h.owner
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </text>
            </g>

            {/* Handoff arrow → */}
            <motion.g
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.18, duration: 0.4 }}
            >
              <line x1="262" y1={y + 28} x2="316" y2={y + 28} stroke="#de4c00" strokeWidth="1.6" strokeDasharray="3 3" />
              <polygon
                points={`316,${y + 28} 308,${y + 24} 308,${y + 32}`}
                fill="#de4c00"
              />
            </motion.g>

            {/* Pulse traveling along arrow */}
            <motion.circle
              cx="260"
              cy={y + 28}
              r="2.5"
              fill="#de4c00"
              animate={{ cx: [262, 316, 262] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            />
          </motion.g>
        );
      })}

      {/* Right column: handoff artefacts */}
      <text x="320" y="138" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2.5" fill="#de4c00">WHAT YOU GET</text>
      {ARTEFACTS.map((a, i) => {
        const y = 156 + i * 76;
        return (
          <motion.g
            key={a.tag}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.16, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Tag glyph */}
            <g transform={`translate(320, ${y + 6})`}>
              {i === 0 && (
                // Runbook icon
                <g>
                  <rect x="0" y="0" width="22" height="28" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
                  <line x1="4" y1="8" x2="18" y2="8" stroke="#75634d" strokeWidth="0.8" />
                  <line x1="4" y1="14" x2="18" y2="14" stroke="#75634d" strokeWidth="0.8" />
                  <line x1="4" y1="20" x2="14" y2="20" stroke="#75634d" strokeWidth="0.8" />
                </g>
              )}
              {i === 1 && (
                // Play icon (recorded session)
                <g>
                  <rect x="0" y="2" width="28" height="20" rx="2" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
                  <polygon points="10,8 10,16 18,12" fill="#de4c00" />
                </g>
              )}
              {i === 2 && (
                // Parallel-run icon (two paths)
                <g fill="none" stroke="#271503" strokeWidth="1.2">
                  <path d="M 0 4 Q 14 12 28 4" />
                  <path d="M 0 18 Q 14 26 28 18" />
                  <circle cx="0" cy="4" r="1.6" fill="#75634d" stroke="none" />
                  <circle cx="28" cy="4" r="1.6" fill="#de4c00" stroke="none" />
                  <circle cx="0" cy="18" r="1.6" fill="#75634d" stroke="none" />
                  <circle cx="28" cy="18" r="1.6" fill="#de4c00" stroke="none" />
                </g>
              )}
              {i === 3 && (
                // Channel/chat icon
                <g>
                  <rect x="0" y="2" width="26" height="20" rx="3" fill="#faf3e6" stroke="#271503" strokeWidth="1" />
                  <line x1="4" y1="10" x2="22" y2="10" stroke="#75634d" strokeWidth="0.8" />
                  <line x1="4" y1="16" x2="16" y2="16" stroke="#75634d" strokeWidth="0.8" />
                </g>
              )}
            </g>

            <text x="358" y={y + 14} fontFamily="var(--font-fraunces), serif" fontSize="14" fill="#271503">{a.tag}</text>
            <text x="358" y={y + 32} fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="11" fill="#75634d">{a.body}</text>
            <line x1="358" y1={y + 44} x2="552" y2={y + 44} stroke="#271503" strokeOpacity="0.15" strokeWidth="0.5" />
          </motion.g>
        );
      })}

      {/* Bottom: success metric */}
      <line x1="44" y1="492" x2="556" y2="492" stroke="#271503" strokeOpacity="0.2" strokeWidth="0.5" />
      <text x="44" y="520" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2" fill="#75634d">EXIT CRITERIA</text>
      <motion.text
        x="44"
        y="544"
        fontFamily="var(--font-fraunces), serif"
        fontStyle="italic"
        fontSize="14"
        fill="#271503"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        Your team runs the system for two weeks without us touching it.
      </motion.text>
      <text x="556" y="544" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="12" fill="#de4c00" textAnchor="end">
        then we step out of the room
      </text>
    </svg>
  );
}
