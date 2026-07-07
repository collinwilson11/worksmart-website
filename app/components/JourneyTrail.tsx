"use client";

/**
 * Big cinematic horizontal mountain panorama.
 * 5 landmark peaks, glowing trail, atmospheric layers.
 * Designed to fill 100vh on the right side and dominate the viewport.
 */
import { memo, useEffect, useRef, useState } from "react";

// Tall enough to feel like a real mountain panorama
const W = 4800;
const H = 1400;

const TRAIL =
  "M 120 1180 Q 280 1150 460 1080 Q 640 990 760 920 Q 880 850 1080 800 Q 1280 760 1420 700 Q 1620 620 1860 580 Q 2080 540 2300 520 Q 2520 500 2680 460 Q 2880 420 3120 360 Q 3340 310 3520 290 Q 3720 270 3940 240 Q 4140 220 4320 200 Q 4500 200 4700 200";

export const LANDMARKS = [
  { id: "diagnose", x: 460, y: 1080, num: "I", name: "Diagnose", sub: "The Trailhead" },
  { id: "design", x: 1420, y: 700, num: "II", name: "Design", sub: "The Drafting Stones" },
  { id: "build", x: 2300, y: 520, num: "III", name: "Build", sub: "The Workshop" },
  { id: "train", x: 3120, y: 360, num: "IV", name: "Train", sub: "The Crossing" },
  { id: "refine", x: 4320, y: 200, num: "V", name: "Refine", sub: "The Summit" },
] as const;

const STAGE_PCT = [0.07, 0.30, 0.52, 0.74, 0.97];

function JourneyTrail({ stage }: { stage: number }) {
  const litRef = useRef<SVGPathElement | null>(null);
  const [trailLen, setTrailLen] = useState(0);

  useEffect(() => {
    if (litRef.current) setTrailLen(litRef.current.getTotalLength());
  }, []);

  const safeStage = Math.max(0, Math.min(4, stage));
  const pct = STAGE_PCT[safeStage];
  const litLen = trailLen * pct;
  const darkLen = Math.max(0, trailLen - litLen);
  const dashArray = trailLen > 0 ? `${litLen} ${darkLen + 1}` : "0 99999";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="jt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1410" />
          <stop offset="35%" stopColor="#0d1c16" />
          <stop offset="68%" stopColor="#1a160e" />
          <stop offset="100%" stopColor="#28150a" />
        </linearGradient>
        <radialGradient id="jt-dawn" cx="80%" cy="22%" r="35%">
          <stop offset="0%" stopColor="#ffb787" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#de4c00" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#de4c00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="jt-vig" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="rgba(4,12,6,0)" />
          <stop offset="100%" stopColor="rgba(4,12,6,0.7)" />
        </radialGradient>
        <linearGradient id="jt-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,254,251,0)" />
          <stop offset="100%" stopColor="rgba(180,200,210,0.10)" />
        </linearGradient>
        <pattern id="jt-hfar" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#fffefb" strokeOpacity="0.08" strokeWidth="0.5" />
        </pattern>
        <pattern id="jt-hmid" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#fffefb" strokeOpacity="0.14" strokeWidth="0.6" />
        </pattern>
        <pattern id="jt-hnear" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#fffefb" strokeOpacity="0.20" strokeWidth="0.7" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="url(#jt-sky)" />
      <rect width={W} height={H} fill="url(#jt-dawn)" />

      {/* Stars */}
      {[
        [220, 60], [540, 40], [820, 80], [1140, 50], [1480, 30], [1820, 70], [2180, 50],
        [2520, 80], [2880, 40], [3220, 60], [3580, 30], [3940, 70], [4280, 50], [4620, 80],
        [340, 140], [980, 120], [1660, 160], [2360, 100], [3060, 140], [3760, 120], [4440, 100],
        [120, 200], [780, 240], [1380, 180], [2080, 220], [2780, 200], [3480, 240], [4180, 180],
      ].map(([x, y], i) => (
        <circle key={`st${i}`} cx={x} cy={y} r={0.8 + (i % 3) * 0.5} fill="#fffefb">
          <animate
            attributeName="opacity"
            values={`${0.15 + (i % 5) * 0.08};${0.6 + (i % 5) * 0.1};${0.15 + (i % 5) * 0.08}`}
            dur={`${1.8 + i * 0.35}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Far range — distant, soft */}
      <path
        d="M -20 800 L 80 740 L 200 780 L 340 700 L 480 760 L 640 680 L 800 740 L 980 660 L 1160 730 L 1340 640 L 1520 720 L 1720 620 L 1900 700 L 2100 600 L 2300 680 L 2500 580 L 2700 660 L 2900 560 L 3100 640 L 3300 540 L 3500 620 L 3700 520 L 3900 600 L 4100 500 L 4300 580 L 4500 480 L 4700 560 L 4820 460 L 4820 1400 L -20 1400 Z"
        fill="url(#jt-hfar)"
        stroke="#fffefb"
        strokeOpacity="0.10"
        strokeWidth="0.7"
      />

      {/* Mid range */}
      <path
        d="M -20 940 L 100 880 L 240 920 L 380 840 L 540 900 L 700 800 L 880 880 L 1060 760 L 1240 850 L 1440 720 L 1640 820 L 1840 680 L 2060 800 L 2280 640 L 2520 760 L 2740 600 L 2980 720 L 3220 560 L 3460 680 L 3700 520 L 3960 640 L 4220 480 L 4480 600 L 4720 440 L 4820 480 L 4820 1400 L -20 1400 Z"
        fill="url(#jt-hmid)"
        stroke="#fffefb"
        strokeOpacity="0.20"
        strokeWidth="1.0"
      />
      {/* Mid range golden-hour ridge highlights */}
      <g stroke="#de4c00" strokeOpacity="0.4" strokeWidth="0.9" fill="none">
        <path d="M 380 840 L 430 870" />
        <path d="M 700 800 L 750 830" />
        <path d="M 1060 760 L 1110 790" />
        <path d="M 1440 720 L 1490 750" />
        <path d="M 1840 680 L 1890 710" />
        <path d="M 2280 640 L 2330 670" />
        <path d="M 2740 600 L 2790 630" />
        <path d="M 3220 560 L 3270 590" />
        <path d="M 3700 520 L 3750 550" />
        <path d="M 4220 480 L 4270 510" />
        <path d="M 4720 440 L 4770 470" />
      </g>

      {/* Range names */}
      <text x="900" y="540" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="34" fill="#a49784" fillOpacity="0.55">
        Range of Friction
      </text>
      <text x="2700" y="380" fontFamily="var(--font-fraunces), serif" fontStyle="italic" fontSize="34" fill="#a49784" fillOpacity="0.55">
        Handoff Heights
      </text>

      {/* Near range */}
      <path
        d="M -20 1180 L 120 1100 L 280 1180 L 460 1080 L 640 1180 L 820 1060 L 1020 1140 L 1240 1020 L 1420 1100 L 1620 980 L 1840 1050 L 2080 920 L 2300 1000 L 2540 880 L 2780 960 L 3020 820 L 3260 900 L 3520 760 L 3780 840 L 4060 700 L 4320 780 L 4600 640 L 4820 720 L 4820 1400 L -20 1400 Z"
        fill="url(#jt-hnear)"
        stroke="#fffefb"
        strokeOpacity="0.30"
        strokeWidth="1.2"
      />

      {/* Snowcaps on prominent peaks */}
      {[[1240, 1020], [2080, 920], [3020, 820], [4060, 700], [4600, 640]].map(([x, y], i) => (
        <ellipse key={`sc${i}`} cx={x} cy={y + 8} rx={32} ry={9} fill="#fffefb" fillOpacity="0.30" />
      ))}

      {/* Pine forest in foreground (distant) */}
      {[
        ...Array.from({ length: 24 }, (_, i) => [80 + i * 40, 1280 + (i % 3) * 10]),
        ...Array.from({ length: 22 }, (_, i) => [1200 + i * 38, 1260 + (i % 3) * 10]),
        ...Array.from({ length: 20 }, (_, i) => [2400 + i * 38, 1240 + (i % 3) * 10]),
        ...Array.from({ length: 18 }, (_, i) => [3600 + i * 38, 1220 + (i % 3) * 10]),
      ].map(([x, y], i) => (
        <g key={`tr${i}`}>
          <polygon
            points={`${x - 8},${y + 14} ${x + 8},${y + 14} ${x},${y - 14}`}
            fill="#040c06"
            stroke="#3a4f3e"
            strokeOpacity="0.6"
            strokeWidth="0.6"
          />
          <line x1={x} y1={y + 14} x2={x} y2={y + 22} stroke="#3a4f3e" strokeOpacity="0.5" strokeWidth="0.6" />
        </g>
      ))}

      {/* === GHOST TRAIL === */}
      <path
        d={TRAIL}
        fill="none"
        stroke="#de4c00"
        strokeOpacity="0.18"
        strokeWidth="4"
        strokeDasharray="5 16"
        strokeLinecap="round"
      />

      {/* === LIT TRAIL (grows with stage) === */}
      <path
        ref={litRef}
        d={TRAIL}
        fill="none"
        stroke="#de4c00"
        strokeOpacity={trailLen > 0 ? 0.95 : 0}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={dashArray}
        style={{
          filter:
            "drop-shadow(0 0 12px rgba(222,76,0,0.85)) drop-shadow(0 0 4px rgba(239,166,128,0.6))",
          transition: "stroke-dasharray 1.4s cubic-bezier(0.65,0,0.35,1)",
        }}
      />

      {/* === LANDMARK ICONS === */}
      {LANDMARKS.map((lm, i) => {
        const isActive = safeStage === i;
        const isPast = safeStage > i;
        const opacity = isActive ? 1 : isPast ? 0.85 : 0.55;

        return (
          <g key={lm.id} transform={`translate(${lm.x},${lm.y})`} opacity={opacity}>
            {isActive && (
              <circle r="100" fill="#de4c00" fillOpacity="0.06">
                <animate attributeName="r" from="60" to="130" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" from="0.08" to="0" dur="2.4s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Phase-specific icon, scaled up 2x for visibility */}
            <g transform="scale(1.7)">
              {i === 0 && (
                <g>
                  <polygon points="-18,4 0,-22 18,4" fill="#11201a" stroke="#fffefb" strokeOpacity="0.7" strokeWidth="1.4" />
                  <line x1="-2" y1="-3" x2="-2" y2="0" stroke="#fffefb" strokeOpacity="0.5" strokeWidth="0.8" />
                  <circle r="5" fill="#de4c00" filter="url(#glow-soft)" />
                </g>
              )}
              {i === 1 && (
                <g>
                  <circle r="26" fill="none" stroke="#fffefb" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="3.5 2.5" />
                  <rect x="-25" y="-7" width="50" height="14" fill="#11201a" stroke="#fffefb" strokeOpacity="0.7" strokeWidth="1.4" />
                  <line x1="-16" y1="-5" x2="0" y2="-42" stroke="#fffefb" strokeOpacity="0.75" strokeWidth="1.4" />
                  <line x1="16" y1="-5" x2="0" y2="-42" stroke="#fffefb" strokeOpacity="0.75" strokeWidth="1.4" />
                  <circle r="4.5" fill="#de4c00" stroke="#fffefb" strokeWidth="1.1" />
                </g>
              )}
              {i === 2 && (
                <g>
                  <rect x="-32" y="-18" width="64" height="34" fill="#11201a" stroke="#fffefb" strokeOpacity="0.7" strokeWidth="1.4" />
                  <rect x="-10" y="-54" width="20" height="36" fill="#de4c00" fillOpacity="0.4" stroke="#fffefb" strokeOpacity="0.7" strokeWidth="1.2" />
                  <polygon points="-12,-54 0,-68 12,-54" fill="#de4c00" stroke="#fffefb" strokeOpacity="0.7" strokeWidth="1" />
                  {[-18, -2, 14].map((xv, j) => (
                    <line key={`bw${j}`} x1={xv} y1="-18" x2={xv} y2="16" stroke="#fffefb" strokeOpacity="0.25" strokeWidth="0.8" />
                  ))}
                </g>
              )}
              {i === 3 && (
                <g>
                  <rect x="-50" y="6" width="22" height="26" fill="#11201a" stroke="#fffefb" strokeOpacity="0.55" strokeWidth="1.3" />
                  <rect x="28" y="6" width="22" height="26" fill="#11201a" stroke="#fffefb" strokeOpacity="0.55" strokeWidth="1.3" />
                  <path d="M -50 6 Q 0 -34 50 6" fill="none" stroke="#fffefb" strokeOpacity="0.75" strokeWidth="2.2" />
                  <line x1="-25" y1="6" x2="-15" y2="-15" stroke="#fffefb" strokeOpacity="0.4" strokeWidth="0.9" />
                  <line x1="0" y1="6" x2="0" y2="-22" stroke="#fffefb" strokeOpacity="0.4" strokeWidth="0.9" />
                  <line x1="25" y1="6" x2="15" y2="-15" stroke="#fffefb" strokeOpacity="0.4" strokeWidth="0.9" />
                  <rect x="-4" y="-36" width="8" height="14" fill="#de4c00" stroke="#fffefb" strokeOpacity="0.7" strokeWidth="0.9" />
                </g>
              )}
              {i === 4 && (
                <g>
                  {/* Mountain summit with planted flag */}
                  <line x1="0" y1="0" x2="0" y2="-72" stroke="#fffefb" strokeWidth="2" />
                  <path d="M 0 -72 L 36 -64 L 0 -56 Z" fill="#de4c00" stroke="#fffefb" strokeOpacity="0.85" strokeWidth="1" />
                  <circle r="7" fill="#de4c00" filter="url(#glow-soft)" />
                  <circle r="3" fill="#fffefb" />
                </g>
              )}
            </g>

            {isActive && (
              <>
                <circle r="60" fill="none" stroke="#de4c00">
                  <animate attributeName="r" from="40" to="90" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle r="30" fill="none" stroke="#de4c00">
                  <animate attributeName="r" from="22" to="50" dur="2.2s" begin="0.55s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2.2s" begin="0.55s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            {/* Big landmark labels */}
            <text
              x="0"
              y={i === 4 ? -110 : 100}
              fontFamily="var(--font-fraunces), serif"
              fontStyle="italic"
              fontSize="42"
              textAnchor="middle"
              fill={isActive ? "#fffefb" : "#c1bdba"}
            >
              {lm.sub}
            </text>
            <text
              x="0"
              y={i === 4 ? -78 : 132}
              fontFamily="var(--font-plex-mono), monospace"
              fontSize="18"
              letterSpacing="4"
              textAnchor="middle"
              fill={isActive ? "#de4c00" : "#a49784"}
            >
              {lm.name.toUpperCase()} · {lm.num}
            </text>
          </g>
        );
      })}

      {/* Filters */}
      <defs>
        <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Mist overlay */}
      <rect y="900" width={W} height={H - 900} fill="url(#jt-mist)" />
      {/* Vignette */}
      <rect width={W} height={H} fill="url(#jt-vig)" />
    </svg>
  );
}

export default memo(JourneyTrail);
export const JOURNEY_W = W;
export const JOURNEY_H = H;
