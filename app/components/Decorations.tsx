/**
 * Decorative SVG marginalia, dividers, stamps — vintage field-guide flavor.
 */

export function TopoDivider() {
  return (
    <div aria-hidden className="my-8 flex items-center justify-center gap-4 text-ink-soft">
      <span className="h-px flex-1 bg-rule" />
      <svg viewBox="0 0 80 24" className="h-4 w-20 text-ink-3">
        <ellipse cx="20" cy="12" rx="16" ry="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <ellipse cx="20" cy="12" rx="11" ry="2.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <ellipse cx="20" cy="12" rx="6" ry="1.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <ellipse cx="60" cy="12" rx="16" ry="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <ellipse cx="60" cy="12" rx="11" ry="2.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <ellipse cx="60" cy="12" rx="6" ry="1.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="40" cy="12" r="2" fill="#de4c00" />
      </svg>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}

export function MountainDivider() {
  return (
    <div aria-hidden className="relative w-full overflow-hidden h-32 -mt-4">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full">
        {/* Far range */}
        <path
          d="M 0 90 L 80 70 L 140 80 L 220 55 L 300 70 L 380 50 L 470 65 L 560 45 L 660 60 L 770 40 L 880 55 L 990 38 L 1110 52 L 1220 35 L 1340 50 L 1440 38 L 1440 120 L 0 120 Z"
          fill="#e7dcc8"
          opacity="0.85"
        />
        <path
          d="M 0 90 L 80 70 L 140 80 L 220 55 L 300 70 L 380 50 L 470 65 L 560 45 L 660 60 L 770 40 L 880 55 L 990 38 L 1110 52 L 1220 35 L 1340 50 L 1440 38"
          fill="none"
          stroke="#75634d"
          strokeOpacity="0.25"
          strokeWidth="0.7"
        />
        {/* Near range */}
        <path
          d="M 0 110 L 100 90 L 180 105 L 260 80 L 360 100 L 470 75 L 580 95 L 700 70 L 820 92 L 940 68 L 1080 88 L 1200 65 L 1320 86 L 1440 70 L 1440 120 L 0 120 Z"
          fill="#d6c8ae"
          opacity="0.7"
        />
        <path
          d="M 0 110 L 100 90 L 180 105 L 260 80 L 360 100 L 470 75 L 580 95 L 700 70 L 820 92 L 940 68 L 1080 88 L 1200 65 L 1320 86 L 1440 70"
          fill="none"
          stroke="#75634d"
          strokeOpacity="0.4"
          strokeWidth="0.9"
        />
        {/* Pine forest dots */}
        {Array.from({ length: 60 }).map((_, i) => {
          const x = i * 24 + (i % 2) * 8;
          const y = 100 + (i % 3) * 4;
          return (
            <polygon
              key={i}
              points={`${x - 3},${y + 4} ${x + 3},${y + 4} ${x},${y - 4}`}
              fill="#271503"
              opacity="0.7"
            />
          );
        })}
      </svg>
    </div>
  );
}

export function StampBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="inline-flex items-center gap-3 border border-ink/40 bg-paper-warm/60 px-4 py-2 backdrop-blur-sm">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-ember">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
      <div className="flex items-baseline gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-ink">
        <span>{label}</span>
        <span className="text-ink-3">·</span>
        <span className="text-ink-3">{sub}</span>
      </div>
    </div>
  );
}

export function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const map: Record<string, string> = {
    tl: "top-6 left-6",
    tr: "top-6 right-6 [&_svg]:scale-x-[-1]",
    bl: "bottom-6 left-6 [&_svg]:scale-y-[-1]",
    br: "bottom-6 right-6 [&_svg]:scale-x-[-1] [&_svg]:scale-y-[-1]",
  };
  return (
    <div aria-hidden className={`pointer-events-none absolute ${map[position]} text-ink-3`}>
      <svg viewBox="0 0 60 60" className="h-12 w-12">
        <path d="M 4 24 L 4 4 L 24 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 4 14 L 14 14 L 14 4" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2" />
        <circle cx="14" cy="14" r="1.4" fill="#de4c00" />
      </svg>
    </div>
  );
}
