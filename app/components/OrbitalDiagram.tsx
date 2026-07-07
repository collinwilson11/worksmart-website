"use client";

import { memo } from "react";

/**
 * Mission-control style radar / orbital diagram.
 * 5 phase nodes orbit "Your Business" at the centre.
 * Pure SVG with CSS keyframe rotations — no React state, no re-renders.
 */
function OrbitalDiagram() {
  const cx = 230;
  const cy = 245;
  const R = 148;
  const toRad = (a: number) => (a * Math.PI) / 180;

  const phases = [
    { num: "I", name: "Diagnose", angle: -90 },
    { num: "II", name: "Design", angle: -18 },
    { num: "III", name: "Build", angle: 54 },
    { num: "IV", name: "Train", angle: 126 },
    { num: "V", name: "Refine", angle: 198 },
  ];

  const nodes = phases.map((p) => ({
    ...p,
    x: cx + R * Math.cos(toRad(p.angle)),
    y: cy + R * Math.sin(toRad(p.angle)),
  }));

  // Sweep wedge geometry
  const r = R + 24;
  const a1 = toRad(-90 - 52);
  const a2 = toRad(-90);
  const sweepFan =
    `M ${cx} ${cy} ` +
    `L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} ` +
    `A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z`;

  return (
    <div className="relative aspect-[460/490] w-full max-w-[480px] border border-white/[0.08] bg-gradient-to-b from-deep-2 to-deep">
      {/* Corner meta */}
      <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.28em] uppercase text-stone/80">SYSTEM · OVERVIEW</span>
      <span className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.28em] uppercase text-stone/80">FIVE PHASES</span>
      <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.28em] uppercase text-stone/80">GVL · 34.85°N</span>
      <span className="absolute bottom-3 right-3 font-mono text-[9px] tracking-[0.28em] uppercase text-stone/80">FIG. A</span>

      <svg
        viewBox="0 0 460 490"
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="hd-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d1a14" />
            <stop offset="100%" stopColor="#040c06" />
          </radialGradient>
          <radialGradient id="hd-core-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#de4c00" stopOpacity="0.30" />
            <stop offset="45%" stopColor="#de4c00" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#de4c00" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hd-node-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#de4c00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#de4c00" stopOpacity="0" />
          </radialGradient>
          <filter id="hd-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hd-glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="460" height="490" fill="url(#hd-bg)" />

        {/* Fine grid */}
        <g stroke="#fffefb" strokeOpacity="0.022" strokeWidth="0.4">
          {Array.from({ length: 24 }).map((_, i) => (
            <g key={i}>
              <line x1="0" y1={i * 21} x2="460" y2={i * 21} />
              <line x1={i * 20} y1="0" x2={i * 20} y2="490" />
            </g>
          ))}
        </g>

        <circle cx={cx} cy={cy} r={R + 52} fill="none" stroke="#fffefb" strokeOpacity="0.035" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r={R + 28} fill="none" stroke="#fffefb" strokeOpacity="0.055" strokeWidth="0.4" />

        {/* Tick marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = toRad(i * 15);
          const major = i % 3 === 0;
          const r1 = R + 25;
          const r2 = R + 25 + (major ? 9 : 4);
          return (
            <line
              key={`tk${i}`}
              x1={cx + r1 * Math.cos(a)}
              y1={cy + r1 * Math.sin(a)}
              x2={cx + r2 * Math.cos(a)}
              y2={cy + r2 * Math.sin(a)}
              stroke="#fffefb"
              strokeOpacity={major ? 0.32 : 0.11}
              strokeWidth={major ? 0.9 : 0.45}
            />
          );
        })}

        {/* Compass rose */}
        {[
          { a: -90, l: "N" },
          { a: 0, l: "E" },
          { a: 90, l: "S" },
          { a: 180, l: "W" },
        ].map(({ a, l }) => {
          const rr = R + 48;
          return (
            <text
              key={l}
              x={cx + rr * Math.cos(toRad(a))}
              y={cy + rr * Math.sin(toRad(a)) + 3.5}
              fontFamily="var(--font-plex-mono), monospace"
              fontSize="9"
              letterSpacing="1.5"
              fill="#a49784"
              fillOpacity="0.75"
              textAnchor="middle"
            >
              {l}
            </text>
          );
        })}

        {/* Core halo */}
        <circle cx={cx} cy={cy} r={R + 18} fill="url(#hd-core-halo)" />

        {/* Concentric rings */}
        {[R, 96, 56, 22].map((rr, i) => (
          <circle
            key={`ir${i}`}
            cx={cx}
            cy={cy}
            r={rr}
            fill="none"
            stroke={i === 0 ? "#de4c00" : "#fffefb"}
            strokeOpacity={i === 0 ? 0.28 : i === 1 ? 0.06 : 0.04}
            strokeWidth={i === 0 ? 0.9 : 0.4}
            strokeDasharray={i === 0 ? "5 14" : undefined}
          />
        ))}

        {/* Rotating radar sweep — pure CSS rotation */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: "ws-radar 7s linear infinite",
          }}
        >
          <path d={sweepFan} fill="#de4c00" fillOpacity="0.07" />
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - (R + 24)}
            stroke="#de4c00"
            strokeOpacity="0.8"
            strokeWidth="1.4"
            strokeLinecap="round"
            filter="url(#hd-glow-line)"
          />
          <circle
            cx={cx}
            cy={cy - (R + 24)}
            r="3.2"
            fill="#de4c00"
            fillOpacity="0.95"
            filter="url(#hd-glow)"
          />
        </g>

        {/* Spokes */}
        {nodes.map((n, i) => (
          <line
            key={`sp${i}`}
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke="#de4c00"
            strokeOpacity="0.09"
            strokeWidth="0.7"
            strokeDasharray="3 9"
          />
        ))}

        {/* Phase nodes */}
        {nodes.map((n, i) => {
          const dx = n.x - cx;
          const dy = n.y - cy;
          const mag = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / mag;
          const uy = dy / mag;
          const lDist = 28;
          const lx = n.x + ux * lDist;
          const ly = n.y + uy * lDist;
          const anchor = ux > 0.35 ? "start" : ux < -0.35 ? "end" : "middle";

          return (
            <g key={`nd${i}`}>
              <circle cx={n.x} cy={n.y} r="20" fill="url(#hd-node-halo)" />
              <circle
                cx={n.x}
                cy={n.y}
                r="8.5"
                fill="#040c06"
                stroke="#de4c00"
                strokeOpacity="0.65"
                strokeWidth="1.3"
              />
              <circle cx={n.x} cy={n.y} r="3.5" fill="#de4c00" filter="url(#hd-glow)" />
              <circle cx={n.x} cy={n.y} r="8.5" fill="none" stroke="#de4c00">
                <animate
                  attributeName="r"
                  from="8.5"
                  to="24"
                  dur={`${2.0 + i * 0.32}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  from="0.45"
                  to="0"
                  dur={`${2.0 + i * 0.32}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x={n.x}
                y={n.y - 15}
                fontFamily="var(--font-fraunces), serif"
                fontStyle="italic"
                fontSize="13"
                fill="#de4c00"
                textAnchor="middle"
              >
                {n.num}
              </text>
              <text
                x={lx}
                y={ly + 4}
                fontFamily="var(--font-plex-mono), monospace"
                fontSize="8.5"
                letterSpacing="1.8"
                fill="#fffefb"
                fillOpacity="0.6"
                textAnchor={anchor}
              >
                {n.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Orbiting particles */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: "ws-orbit-cw 9s linear infinite",
          }}
        >
          <circle cx={cx} cy={cy - R} r="3.8" fill="#de4c00" fillOpacity="0.95" filter="url(#hd-glow)" />
        </g>
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: "ws-orbit-ccw 16s linear infinite",
          }}
        >
          <circle cx={cx} cy={cy - 78} r="2.4" fill="#efa680" fillOpacity="0.75" />
        </g>
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: "ws-orbit-cw 24s linear infinite",
          }}
        >
          <circle cx={cx + 54} cy={cy} r="1.6" fill="#fffefb" fillOpacity="0.35" />
        </g>

        {/* Centre core */}
        <circle cx={cx} cy={cy} r="24" fill="#040c06" stroke="#de4c00" strokeOpacity="0.18" strokeWidth="0.7" />
        <circle cx={cx} cy={cy} r="11" fill="#de4c00" fillOpacity="0.09" stroke="#de4c00" strokeOpacity="0.42" strokeWidth="0.9" />
        <circle cx={cx} cy={cy} r="4.5" fill="#de4c00" filter="url(#hd-glow)" />

        {/* Crosshair */}
        <g stroke="#fffefb" strokeOpacity="0.15" strokeWidth="0.5">
          <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} />
          <line x1={cx} y1={cy - 14} x2={cx} y2={cy + 14} />
        </g>

        <text
          x={cx}
          y={cy + 42}
          fontFamily="var(--font-plex-mono), monospace"
          fontSize="8"
          letterSpacing="3"
          fill="#a49784"
          fillOpacity="0.8"
          textAnchor="middle"
        >
          YOUR BUSINESS
        </text>

        {/* Twinkling stars */}
        {[
          [24, 22],
          [70, 14],
          [128, 36],
          [338, 18],
          [408, 28],
          [445, 12],
          [36, 458],
          [432, 468],
          [198, 10],
          [288, 7],
          [52, 200],
          [420, 190],
        ].map(([x, y], i) => (
          <circle key={`st${i}`} cx={x} cy={y} r={0.55 + (i % 3) * 0.38} fill="#fffefb">
            <animate
              attributeName="opacity"
              values={`${0.18 + (i % 5) * 0.08};${0.55 + (i % 5) * 0.12};${0.18 + (i % 5) * 0.08}`}
              dur={`${2.0 + i * 0.55}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}

export default memo(OrbitalDiagram);
