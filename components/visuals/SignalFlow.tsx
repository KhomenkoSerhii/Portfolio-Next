const routes = [
  "M20 110 H118 V218 H278",
  "M20 258 H150 V285 H278",
  "M20 468 H104 V352 H278",
  "M482 218 H620 V116 H740",
  "M482 285 H680 V258 H740",
  "M482 352 H592 V500 H740",
] as const;

const nodes = [
  [118, 110],
  [118, 218],
  [150, 258],
  [150, 285],
  [104, 468],
  [104, 352],
  [620, 218],
  [620, 116],
  [680, 285],
  [680, 258],
  [592, 352],
  [592, 500],
] as const;

export default function SignalFlow() {
  return (
    <div className="signal-visual" aria-hidden>
      <svg
        viewBox="0 0 760 620"
        role="presentation"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="signal-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--line)" strokeWidth="1" />
          </pattern>
          <radialGradient id="signal-glow">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="1" y="1" width="758" height="618" fill="url(#signal-grid)" />
        <circle cx="380" cy="285" r="210" fill="url(#signal-glow)" />
        <rect
          x="20"
          y="30"
          width="720"
          height="540"
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1"
        />

        {routes.map((path, index) => (
          <g key={path}>
            <path d={path} className="signal-route" />
            <path
              d={path}
              pathLength="100"
              className={`signal-route signal-route-live signal-delay-${(index % 3) + 1}`}
            />
          </g>
        ))}

        {nodes.map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <rect
              x={x - 4}
              y={y - 4}
              width="8"
              height="8"
              fill="var(--background)"
              stroke="var(--line-strong)"
            />
            {index % 2 === 0 ? (
              <circle cx={x} cy={y} r="2" fill="var(--accent-strong)" />
            ) : null}
          </g>
        ))}

        <g className="signal-core-orbit">
          <circle
            cx="380"
            cy="285"
            r="102"
            fill="none"
            stroke="var(--line-strong)"
            strokeDasharray="3 10"
          />
          <circle
            cx="380"
            cy="285"
            r="84"
            fill="none"
            stroke="var(--accent-strong)"
            strokeDasharray="70 460"
            strokeWidth="2"
          />
        </g>
        <circle
          cx="380"
          cy="285"
          r="64"
          fill="var(--surface)"
          stroke="var(--foreground)"
          strokeWidth="1.5"
        />
        <path d="M338 285H422M380 243V327" stroke="var(--line-strong)" />
        <circle cx="380" cy="285" r="8" fill="var(--accent)" className="signal-core-dot" />

        <g
          fill="var(--muted)"
          fontFamily="var(--font-geist-mono)"
          fontSize="9"
          letterSpacing="2"
        >
          <text x="20" y="94">USER EVENT</text>
          <text x="20" y="242">LLM STREAM</text>
          <text x="20" y="452">SOCKET STATE</text>
          <text x="740" y="100" textAnchor="end">RANKED RESULT</text>
          <text x="740" y="242" textAnchor="end">PROGRESSIVE UI</text>
          <text x="740" y="522" textAnchor="end">SAFE FALLBACK</text>
          <text x="42" y="550">INPUT / 03</text>
          <text x="718" y="550" textAnchor="end">OUTPUT / STABLE</text>
        </g>

        <g
          fill="var(--foreground)"
          fontFamily="var(--font-geist-mono)"
          textAnchor="middle"
        >
          <text x="380" y="276" fontSize="11" fontWeight="700" letterSpacing="2.5">INTERFACE</text>
          <text x="380" y="300" fontSize="8" letterSpacing="2">CORE / LIVE</text>
        </g>

        <g transform="translate(42 52)">
          <circle cx="4" cy="4" r="4" fill="var(--accent)" className="signal-core-dot" />
          <text
            x="18"
            y="8"
            textLength="128"
            lengthAdjust="spacingAndGlyphs"
            fill="var(--muted)"
            fontFamily="var(--font-geist-mono)"
            fontSize="8"
          >
            LIVE SIGNAL MAP
          </text>
        </g>
      </svg>
    </div>
  );
}
