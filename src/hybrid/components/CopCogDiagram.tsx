/** Longitudinal CoP–CoG schematic from S1 Table 1 + Table 3 (pack ch01). */
export function CopCogDiagram() {
  const L = 2691
  const cog = 1369
  const W = 640
  const pad = 48
  const scale = (W - pad * 2) / L
  const y = 70

  return (
    <svg
      viewBox="0 0 640 160"
      className="mt-6 w-full max-w-2xl"
      role="img"
      aria-label="Schematic CoG vs CoP pe wheelbase"
      data-testid="cop-cog-diagram"
    >
      <line
        x1={pad}
        x2={pad + L * scale}
        y1={y}
        y2={y}
        stroke="rgb(232 228 220 / 0.35)"
        strokeWidth={2}
      />
      {/* Axles */}
      <circle cx={pad} cy={y} r={8} fill="none" stroke="#8b929a" strokeWidth={1.5} />
      <circle
        cx={pad + L * scale}
        cy={y}
        r={8}
        fill="none"
        stroke="#8b929a"
        strokeWidth={1.5}
      />
      {/* CoG */}
      <circle
        cx={pad + cog * scale}
        cy={y}
        r={7}
        fill="#005949"
        stroke="#f2f0ea"
        strokeWidth={1.5}
      />
      <text
        x={pad + cog * scale}
        y={y - 18}
        textAnchor="middle"
        fill="#f2f0ea"
        fontSize={12}
        fontFamily='"Plus Jakarta Sans", sans-serif'
      >
        CoG
      </text>
      <text
        x={pad + cog * scale}
        y={y + 32}
        textAnchor="middle"
        fill="#8b929a"
        fontSize={11}
        fontFamily='"JetBrains Mono", monospace'
      >
        1369 mm
      </text>
      {/* DF arrows New pack */}
      <path
        d={`M ${pad + 80} ${y + 8} L ${pad + 80} ${y + 48}`}
        stroke="#005949"
        strokeWidth={2}
        markerEnd="url(#arrow)"
      />
      <text
        x={pad + 80}
        y={y + 62}
        textAnchor="middle"
        fill="#8b929a"
        fontSize={10}
        fontFamily='"Plus Jakarta Sans", sans-serif'
      >
        Front DF 470 N
      </text>
      <path
        d={`M ${pad + L * scale - 80} ${y + 8} L ${pad + L * scale - 80} ${y + 48}`}
        stroke="#005949"
        strokeWidth={2}
      />
      <text
        x={pad + L * scale - 80}
        y={y + 62}
        textAnchor="middle"
        fill="#8b929a"
        fontSize={10}
        fontFamily='"Plus Jakarta Sans", sans-serif'
      >
        Rear DF 467 N
      </text>
      <text
        x={pad}
        y={24}
        fill="#8b929a"
        fontSize={11}
        fontFamily='"Plus Jakarta Sans", sans-serif'
      >
        Wheelbase 2691 mm · New pack balance ≈ 0.502 · S1-F002 / S1-F011
      </text>
      <defs>
        <marker
          id="arrow"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#005949" />
        </marker>
      </defs>
    </svg>
  )
}
