/** Schematic CoP vs CoG — pedagogical; CoG height from S1-F002, balance target S1-F012. */
export function CopCogDiagram() {
  return (
    <div
      className="mt-8 max-w-lg border-t border-aero-signal/15 pt-6"
      data-testid="cop-cog-diagram"
      role="img"
      aria-label="Schematic CoP versus CoG pe axa longitudinală"
    >
      <svg viewBox="0 0 420 120" className="w-full text-aero-ivory" fill="none">
        {/* Vehicle silhouette bar */}
        <rect
          x="40"
          y="48"
          width="340"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeOpacity="0.35"
        />
        <text x="40" y="40" className="fill-aero-mist" fontSize="10" fontFamily="monospace">
          față
        </text>
        <text
          x="380"
          y="40"
          textAnchor="end"
          className="fill-aero-mist"
          fontSize="10"
          fontFamily="monospace"
        >
          spate
        </text>

        {/* CoG */}
        <circle cx="210" cy="57" r="6" fill="#005949" />
        <line
          x1="210"
          y1="63"
          x2="210"
          y2="88"
          stroke="#005949"
          strokeWidth="1"
        />
        <text x="210" y="102" textAnchor="middle" fill="#F2F0EA" fontSize="11" fontFamily="monospace">
          CoG
        </text>

        {/* CoP — rearward under aerobrake narrative */}
        <circle cx="268" cy="57" r="5" fill="#C4DF00" />
        <line
          x1="268"
          y1="63"
          x2="268"
          y2="88"
          stroke="#C4DF00"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <text x="268" y="102" textAnchor="middle" fill="#C4DF00" fontSize="11" fontFamily="monospace">
          CoP
        </text>

        <text x="40" y="118" fill="#8B929A" fontSize="9" fontFamily="sans-serif">
          Aerobrake: CoP spre spate · stabilitate (S1-F042) · schematic
        </text>
      </svg>
    </div>
  )
}
