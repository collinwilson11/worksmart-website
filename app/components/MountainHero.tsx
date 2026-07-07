"use client";

/**
 * Cinematic full-bleed mountain landscape hero.
 * Parallax layers, animated trail, twinkling stars, dawn sky, snowcaps.
 * Pure SVG — no canvas, no 3D libraries, no perf surprises.
 */
import { memo } from "react";

function MountainHero() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-deep">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="block h-full w-full"
        aria-hidden
      >
        <defs>
          {/* Dawn sky over mountains */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1410" />
            <stop offset="38%" stopColor="#0d1c16" />
            <stop offset="70%" stopColor="#1a160e" />
            <stop offset="100%" stopColor="#241405" />
          </linearGradient>

          {/* Sun / dawn glow */}
          <radialGradient id="dawn" cx="68%" cy="58%" r="34%">
            <stop offset="0%" stopColor="#ffb787" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#de4c00" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#de4c00" stopOpacity="0" />
          </radialGradient>

          {/* Far mountain hatch */}
          <pattern id="hfar" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#fffefb" strokeOpacity="0.07" strokeWidth="0.5" />
          </pattern>
          {/* Mid mountain hatch */}
          <pattern id="hmid" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#fffefb" strokeOpacity="0.13" strokeWidth="0.6" />
          </pattern>
          {/* Near mountain hatch */}
          <pattern id="hnear" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#fffefb" strokeOpacity="0.20" strokeWidth="0.7" />
          </pattern>

          {/* Foreground silhouette */}
          <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040c06" />
            <stop offset="100%" stopColor="#020805" />
          </linearGradient>

          {/* Vignette */}
          <radialGradient id="vig" cx="50%" cy="55%" r="75%">
            <stop offset="0%" stopColor="rgba(4,12,6,0)" />
            <stop offset="100%" stopColor="rgba(4,12,6,0.85)" />
          </radialGradient>

          {/* Mist/fog */}
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,254,251,0)" />
            <stop offset="100%" stopColor="rgba(180,200,210,0.10)" />
          </linearGradient>

          {/* Trail glow */}
          <filter id="glow-trail" x="-30%" y="-200%" width="160%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1920" height="1080" fill="url(#sky)" />
        {/* Dawn glow */}
        <rect width="1920" height="1080" fill="url(#dawn)" />

        {/* Topographic contour rings (subtle) */}
        <g stroke="#de4c00" strokeOpacity="0.06" fill="none" strokeWidth="0.8">
          <ellipse cx="1300" cy="620" rx="180" ry="36" />
          <ellipse cx="1300" cy="620" rx="260" ry="52" />
          <ellipse cx="1300" cy="620" rx="340" ry="68" />
          <ellipse cx="1300" cy="620" rx="420" ry="84" />
          <ellipse cx="1300" cy="620" rx="500" ry="100" />
          <ellipse cx="1300" cy="620" rx="580" ry="116" />
        </g>

        {/* Twinkling stars (sky) */}
        {[
          [180, 90], [340, 60], [520, 110], [690, 70], [870, 50], [1050, 90], [1240, 60],
          [1430, 100], [1610, 70], [1810, 110], [240, 180], [780, 160], [1380, 200],
          [1560, 240], [120, 280], [1850, 320], [560, 280], [1100, 220],
        ].map(([x, y], i) => (
          <circle key={`st${i}`} cx={x} cy={y} r={0.8 + (i % 3) * 0.5} fill="#fffefb">
            <animate
              attributeName="opacity"
              values={`${0.2 + (i % 5) * 0.1};${0.7 + (i % 5) * 0.1};${0.2 + (i % 5) * 0.1}`}
              dur={`${1.8 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Slow-drifting clouds */}
        <g style={{ animation: "cloud-drift 60s linear infinite" }}>
          <ellipse cx="500" cy="340" rx="180" ry="14" fill="#fffefb" opacity="0.04" />
          <ellipse cx="1100" cy="280" rx="220" ry="16" fill="#fffefb" opacity="0.05" />
          <ellipse cx="1700" cy="380" rx="160" ry="12" fill="#fffefb" opacity="0.035" />
        </g>

        {/* === FAR RANGE === */}
        <path
          d="M -20 620 L 60 580 L 130 600 L 220 540 L 310 580 L 390 510 L 480 555 L 580 490 L 680 530 L 800 470 L 920 510 L 1050 460 L 1170 500 L 1300 440 L 1430 480 L 1560 430 L 1700 470 L 1830 420 L 1960 450 L 1960 1080 L -20 1080 Z"
          fill="url(#hfar)"
          stroke="#fffefb"
          strokeOpacity="0.10"
          strokeWidth="0.7"
        />

        {/* === MID RANGE === */}
        <path
          d="M -20 720 L 80 680 L 160 700 L 250 640 L 350 680 L 430 600 L 540 660 L 660 580 L 790 640 L 920 560 L 1060 620 L 1210 540 L 1350 600 L 1490 510 L 1640 580 L 1790 500 L 1960 560 L 1960 1080 L -20 1080 Z"
          fill="url(#hmid)"
          stroke="#fffefb"
          strokeOpacity="0.20"
          strokeWidth="1"
        />

        {/* Mid range — peak highlights (golden hour edges) */}
        <g stroke="#de4c00" strokeOpacity="0.40" strokeWidth="0.8" fill="none">
          <path d="M 250 640 L 290 660" />
          <path d="M 430 600 L 470 620" />
          <path d="M 660 580 L 700 600" />
          <path d="M 920 560 L 960 580" />
          <path d="M 1210 540 L 1250 560" />
          <path d="M 1490 510 L 1530 530" />
          <path d="M 1790 500 L 1830 520" />
        </g>

        {/* === NEAR RANGE — the summit mountain === */}
        <path
          d="M -20 880 L 80 820 L 180 870 L 280 800 L 400 850 L 540 770 L 700 830 L 880 740 L 1020 810 L 1140 730 L 1240 600 L 1300 480 L 1360 600 L 1460 720 L 1580 760 L 1720 700 L 1860 760 L 1960 720 L 1960 1080 L -20 1080 Z"
          fill="url(#hnear)"
          stroke="#fffefb"
          strokeOpacity="0.30"
          strokeWidth="1.2"
        />

        {/* Snowcap on summit */}
        <path
          d="M 1300 480 L 1280 530 L 1295 540 L 1305 535 L 1318 545 L 1330 538 L 1340 545 L 1320 528 L 1300 480 Z"
          fill="#fffefb"
          fillOpacity="0.85"
        />
        {/* Secondary snow ridges */}
        <path
          d="M 1280 530 L 1265 565 L 1280 575 L 1295 568"
          fill="#fffefb"
          fillOpacity="0.55"
        />
        <path
          d="M 1320 528 L 1340 545 L 1355 555 L 1340 565"
          fill="#fffefb"
          fillOpacity="0.45"
        />

        {/* Ridge crease on near mountain */}
        <path
          d="M 1300 480 L 1240 600 L 1180 750 L 1100 850 L 1020 920"
          fill="none"
          stroke="#fffefb"
          strokeOpacity="0.22"
          strokeWidth="0.8"
        />
        <path
          d="M 1300 480 L 1360 600 L 1430 700 L 1520 800 L 1620 880"
          fill="none"
          stroke="#fffefb"
          strokeOpacity="0.18"
          strokeWidth="0.7"
        />

        {/* Pine forest in foreground */}
        {[
          ...Array.from({ length: 16 }, (_, i) => [60 + i * 28, 940 + (i % 3) * 8]),
          ...Array.from({ length: 14 }, (_, i) => [1500 + i * 28, 950 + (i % 3) * 8]),
          ...Array.from({ length: 20 }, (_, i) => [400 + i * 22, 980 + (i % 4) * 6]),
        ].map(([x, y], i) => (
          <g key={`tree${i}`}>
            <polygon
              points={`${x - 7},${y + 14} ${x + 7},${y + 14} ${x},${y - 12}`}
              fill="#040c06"
              stroke="#3a4f3e"
              strokeOpacity="0.7"
              strokeWidth="0.6"
            />
            <line x1={x} y1={y + 14} x2={x} y2={y + 22} stroke="#3a4f3e" strokeOpacity="0.6" strokeWidth="0.7" />
          </g>
        ))}

        {/* === ANIMATED TRAIL — base camp to summit === */}
        {/* Ghost trail (always faint) */}
        <path
          d="M 280 980 Q 380 950 460 920 Q 560 880 620 830 Q 700 780 760 740 Q 850 700 920 650 Q 1010 600 1090 560 Q 1180 520 1260 495 Q 1290 488 1300 480"
          fill="none"
          stroke="#de4c00"
          strokeOpacity="0.20"
          strokeWidth="2.5"
          strokeDasharray="3 9"
          strokeLinecap="round"
        />

        {/* Animated drawing trail */}
        <path
          d="M 280 980 Q 380 950 460 920 Q 560 880 620 830 Q 700 780 760 740 Q 850 700 920 650 Q 1010 600 1090 560 Q 1180 520 1260 495 Q 1290 488 1300 480"
          fill="none"
          stroke="#de4c00"
          strokeWidth="3"
          strokeDasharray="6 14"
          strokeLinecap="round"
          filter="url(#glow-trail)"
          style={{
            strokeDashoffset: 0,
            animation: "ws-trail-march 4s linear infinite",
          }}
        />

        {/* Base camp marker */}
        <g transform="translate(280, 980)">
          <polygon
            points="-12,4 0,-14 12,4"
            fill="#11201a"
            stroke="#fffefb"
            strokeOpacity="0.7"
            strokeWidth="1"
          />
          <circle r="22" fill="none" stroke="#de4c00" strokeOpacity="0.4" strokeDasharray="2 4">
            <animate attributeName="r" from="14" to="32" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="0.55" to="0" dur="3s" repeatCount="indefinite" />
          </circle>
          <text
            x="0"
            y="34"
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="10"
            letterSpacing="2"
            fill="#a49784"
            textAnchor="middle"
          >
            BASE CAMP
          </text>
        </g>

        {/* Mid waypoint */}
        <g transform="translate(760, 740)">
          <circle r="4" fill="#de4c00" filter="url(#glow-soft)" />
          <circle r="12" fill="none" stroke="#de4c00" strokeOpacity="0.5">
            <animate attributeName="r" from="6" to="22" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Summit flag */}
        <g transform="translate(1300, 480)">
          <line x1="0" y1="0" x2="0" y2="-46" stroke="#fffefb" strokeWidth="1.5" />
          <path d="M 0 -46 L 28 -40 L 0 -34 Z" fill="#de4c00" stroke="#fffefb" strokeWidth="0.8" />
          <circle r="5" fill="#de4c00" filter="url(#glow-soft)" />
          <circle r="12" fill="none" stroke="#de4c00" strokeOpacity="0.6">
            <animate attributeName="r" from="6" to="26" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="0.7" to="0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <text
            x="32"
            y="-42"
            fontFamily="var(--font-fraunces), serif"
            fontStyle="italic"
            fontSize="20"
            fill="#fffefb"
            opacity="0.9"
          >
            The Summit
          </text>
        </g>

        {/* Walking expedition figure (offset-path animation) */}
        <g
          style={{
            offsetPath:
              'path("M 280 980 Q 380 950 460 920 Q 560 880 620 830 Q 700 780 760 740 Q 850 700 920 650 Q 1010 600 1090 560 Q 1180 520 1260 495 Q 1290 488 1300 480")',
            offsetRotate: "0deg",
            animation: "ws-traveller 12s ease-in-out infinite",
          } as React.CSSProperties}
        >
          <circle r="4.5" fill="#de4c00" filter="url(#glow-soft)" />
          <circle r="2" fill="#fffefb" />
        </g>

        {/* Atmospheric mist */}
        <rect y="700" width="1920" height="380" fill="url(#mist)" />

        {/* Foreground vignette */}
        <rect width="1920" height="1080" fill="url(#vig)" />
      </svg>

      {/* Topographic contour overlay (CSS, layered above SVG) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 25% at 50% 60%, transparent 0%, rgba(255,254,251,0.4) 35%, transparent 60%), radial-gradient(ellipse 50% 20% at 50% 60%, transparent 0%, rgba(255,254,251,0.4) 50%, transparent 70%)",
          backgroundSize: "100% 100%, 100% 100%",
        }}
      />
    </div>
  );
}

export default memo(MountainHero);
