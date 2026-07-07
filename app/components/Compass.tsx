/**
 * Hand-drawn compass illustration — vintage field-guide aesthetic.
 * Used as decorative centerpiece in hero / dividers.
 */
export default function Compass({ size = 180 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="block"
    >
      {/* Outer ring */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="#271503" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#271503" strokeWidth="0.6" strokeDasharray="2 3" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="#271503" strokeWidth="0.6" />

      {/* Tick marks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 10 * Math.PI) / 180;
        const major = i % 9 === 0;
        const r1 = 86;
        const r2 = 86 + (major ? 8 : 4);
        return (
          <line
            key={i}
            x1={100 + r1 * Math.sin(a)}
            y1={100 - r1 * Math.cos(a)}
            x2={100 + r2 * Math.sin(a)}
            y2={100 - r2 * Math.cos(a)}
            stroke="#271503"
            strokeWidth={major ? 1.2 : 0.6}
          />
        );
      })}

      {/* Cardinal letters */}
      {[
        { x: 100, y: 22, l: "N" },
        { x: 178, y: 104, l: "E" },
        { x: 100, y: 188, l: "S" },
        { x: 22, y: 104, l: "W" },
      ].map(({ x, y, l }) => (
        <text
          key={l}
          x={x}
          y={y}
          fontFamily="var(--font-fraunces), serif"
          fontStyle="italic"
          fontSize="14"
          fill="#271503"
          textAnchor="middle"
        >
          {l}
        </text>
      ))}

      {/* Inner star/rose lines */}
      {[0, 45, 90, 135].map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="100"
          x2={100 + 60 * Math.sin((deg * Math.PI) / 180)}
          y2={100 - 60 * Math.cos((deg * Math.PI) / 180)}
          stroke="#271503"
          strokeOpacity="0.25"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      ))}

      {/* Compass needle */}
      <g
        style={{
          transformOrigin: "100px 100px",
          animation: "ws-needle-sway 5s ease-in-out infinite",
        }}
      >
        {/* North half (red) */}
        <polygon points="100,40 96,100 104,100" fill="#de4c00" stroke="#271503" strokeWidth="0.8" />
        {/* South half (cream) */}
        <polygon points="100,160 96,100 104,100" fill="#f3ece0" stroke="#271503" strokeWidth="0.8" />
        {/* Pivot */}
        <circle cx="100" cy="100" r="4" fill="#271503" />
        <circle cx="100" cy="100" r="2" fill="#f3ece0" />
      </g>
    </svg>
  );
}
