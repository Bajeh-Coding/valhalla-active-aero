/**
 * Guide-faithful diagrams recreated from Informatii_pentru_Prezentare
 * (Kamm, 14 DOF, state machine, mechatronic synergy, KPI). No invented numbers.
 */

const VOID = '#05070a'
const INK = '#0b0e14'
const IVORY = '#f8f7f4'
const MIST = '#8b929a'
const AMR = '#0a7a62'
const LIME = '#c4df00'
const ZERO = 'rgb(232 228 220 / 0.28)'
const FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'

/** Cap 02 — Cercul de frecare Kamm extins de FL (Slide 2). */
export function KammCircleDiagram() {
  const W = 720
  const H = 400
  const cx = 210
  const cy = 190
  const rPasiv = 72
  const rActiv = 118

  return (
    <figure
      className="mt-12 max-w-[1000px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-kamm"
    >
      <figcaption className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        Diagramă — Cercul de frecare Kamm (Fy,max = μ · Fz) + FL
      </figcaption>
      <div className="overflow-hidden rounded-[2px] border border-aero-ivory/8 bg-aero-ink">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Cercul de frecare Kamm: raza crește cu Fz când se adaugă downforce FL"
        >
          <title>Cercul de frecare Kamm extins de downforce FL</title>
          <rect width={W} height={H} fill={INK} />
          <defs>
            <marker
              id="kamm-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 Z" fill={LIME} />
            </marker>
            <marker
              id="kamm-arrow-amr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 Z" fill={AMR} />
            </marker>
          </defs>

          {/* Axes */}
          <line
            x1={cx - 150}
            x2={cx + 150}
            y1={cy}
            y2={cy}
            stroke={ZERO}
            strokeWidth={1.25}
          />
          <line
            x1={cx}
            x2={cx}
            y1={cy - 150}
            y2={cy + 150}
            stroke={ZERO}
            strokeWidth={1.25}
          />
          <text x={cx + 158} y={cy + 4} fill={MIST} fontSize={12} fontFamily={FONT}>
            Fx
          </text>
          <text x={cx + 8} y={cy - 158} fill={MIST} fontSize={12} fontFamily={FONT}>
            Fy
          </text>

          {/* Outer circle — μ·(Fz + FL) */}
          <circle
            cx={cx}
            cy={cy}
            r={rActiv}
            fill="rgb(10 122 98 / 0.14)"
            stroke={AMR}
            strokeWidth={2.5}
          />
          {/* Inner circle — μ·Fz pasiv */}
          <circle
            cx={cx}
            cy={cy}
            r={rPasiv}
            fill={VOID}
            stroke="rgb(139 146 154 / 0.9)"
            strokeWidth={1.75}
            strokeDasharray="5 4"
          />

          {/* Passive radius marker (left-up) — stop at rim, label outside */}
          <line
            x1={cx}
            x2={cx - rPasiv * 0.7}
            y1={cy}
            y2={cy - rPasiv * 0.71}
            stroke="rgb(139 146 154 / 0.55)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={cx - rActiv - 8}
            y={cy - rPasiv * 0.35}
            textAnchor="end"
            fill={MIST}
            fontSize={11}
            fontFamily={FONT}
          >
            Fy,max = μ · Fz
          </text>

          {/* Active radius marker (right-up) */}
          <line
            x1={cx}
            x2={cx + rActiv * 0.78}
            y1={cy}
            y2={cy - rActiv * 0.62}
            stroke={AMR}
            strokeWidth={1.5}
            markerEnd="url(#kamm-arrow-amr)"
          />
          <text
            x={cx + rActiv * 0.78 + 12}
            y={cy - rActiv * 0.62}
            fill={AMR}
            fontSize={11}
            fontFamily={FONT}
          >
            μ · (Fz + FL)
          </text>

          {/* Example grip vector in expanded annulus (lower-right) */}
          <line
            x1={cx}
            x2={cx + 88}
            y1={cy}
            y2={cy + 48}
            stroke={LIME}
            strokeWidth={1.75}
            markerEnd="url(#kamm-arrow)"
          />
          <text
            x={cx + 108}
            y={cy + 62}
            fill={LIME}
            fontSize={11}
            fontFamily={FONT}
          >
            √(Fx² + Fy²)
          </text>

          {/* Legend under plot */}
          <text
            x={cx - 146}
            y={cy + rActiv + 32}
            fill={MIST}
            fontSize={11}
            fontFamily={FONT}
          >
            μ·Fz (pasiv)
          </text>
          <text
            x={cx + 8}
            y={cy + rActiv + 32}
            fill={AMR}
            fontSize={11}
            fontFamily={FONT}
          >
            μ·(Fz + FL) cu downforce
          </text>

          {/* HUD equations — Slide 2 */}
          <g transform="translate(430, 88)">
            <text x={0} y={0} fill={IVORY} fontSize={14} fontFamily={FONT}>
              Fy,max = μ · Fz
            </text>
            <text x={0} y={36} fill={MIST} fontSize={12} fontFamily={FONT}>
              FD = 0.5 · ρ · v² · A · CD
            </text>
            <text x={0} y={58} fill={MIST} fontSize={12} fontFamily={FONT}>
              FL = 0.5 · ρ · v² · A · |CL|
            </text>
            <text x={0} y={96} fill={AMR} fontSize={13} fontFamily={FONT}>
              FL ↑ → Fz ↑ → Fy,max ↑
            </text>
            <text x={0} y={122} fill={MIST} fontSize={11} fontFamily={FONT}>
              fără masă inerțială adăugată
            </text>
            <rect
              x={0}
              y={148}
              width={240}
              height={1}
              fill="rgb(232 228 220 / 0.12)"
            />
            <text x={0} y={176} fill={LIME} fontSize={11} fontFamily={FONT}>
              cercul Kamm se extinde cu FL
            </text>
            <text x={0} y={196} fill={MIST} fontSize={11} fontFamily={FONT}>
              fără a adăuga masă pe Fz static
            </text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/** Cap 03 — Schemă 14 DOF. */
export function Dof14Diagram() {
  return (
    <figure
      className="mt-10 max-w-[720px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-dof14"
    >
      <figcaption className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        Schemă — 14 grade de libertate (VI-CarRealTime)
      </figcaption>
      <svg
        viewBox="0 0 640 280"
        className="w-full"
        role="img"
        aria-label="14 DOF: 6 șasiu, 4 suspensii, 4 roți"
      >
        <rect width="640" height="280" fill="#0B0E14" rx="2" />
        {/* Chassis block */}
        <rect
          x="200"
          y="90"
          width="240"
          height="70"
          fill="none"
          stroke="#005949"
          strokeWidth="2"
          rx="2"
        />
        <text
          x="320"
          y="122"
          textAnchor="middle"
          fill="#F5F2EA"
          fontSize="14"
          fontFamily="ui-monospace, monospace"
        >
          6 DOF Șasiu
        </text>
        <text
          x="320"
          y="142"
          textAnchor="middle"
          fill="#8A9099"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
        >
          x y z · roll pitch yaw
        </text>

        {/* Four suspension DOF */}
        {[
          { x: 80, y: 40, label: 'Susp. FL' },
          { x: 460, y: 40, label: 'Susp. FR' },
          { x: 80, y: 200, label: 'Susp. RL' },
          { x: 460, y: 200, label: 'Susp. RR' },
        ].map((n) => (
          <g key={n.label}>
            <rect
              x={n.x}
              y={n.y}
              width="100"
              height="44"
              fill="none"
              stroke="#8A9099"
              strokeWidth="1.25"
              rx="2"
            />
            <text
              x={n.x + 50}
              y={n.y + 18}
              textAnchor="middle"
              fill="#F5F2EA"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              1 DOF
            </text>
            <text
              x={n.x + 50}
              y={n.y + 34}
              textAnchor="middle"
              fill="#8A9099"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Wheel rotation labels */}
        <text
          x="320"
          y="210"
          textAnchor="middle"
          fill="#005949"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
        >
          + 4 DOF rotație / alunecare longitudinală roți
        </text>
        <text
          x="320"
          y="250"
          textAnchor="middle"
          fill="#8A9099"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
        >
          Total = 6 + 4 + 4 = 14 DOF
        </text>
      </svg>
    </figure>
  )
}

/** Cap 05 — Diagrama de stări a controllerului. */
export function StateMachineDiagram() {
  return (
    <figure
      className="mt-10 max-w-[920px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-state-machine"
    >
      <figcaption className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        Diagramă stări — controller mecatronic (MATLAB/Simulink)
      </figcaption>
      <svg
        viewBox="0 0 720 220"
        className="w-full"
        role="img"
        aria-label="State machine: DRS, Aerobrake, MaxP pe baza semnalelor CAN"
      >
        <rect width="720" height="220" fill="#0B0E14" rx="2" />
        {/* Input */}
        <rect x="20" y="80" width="120" height="60" fill="none" stroke="#8A9099" strokeWidth="1.25" rx="2" />
        <text x="80" y="105" textAnchor="middle" fill="#8A9099" fontSize="10" fontFamily="ui-monospace, monospace">
          CAN-bus
        </text>
        <text x="80" y="122" textAnchor="middle" fill="#F5F2EA" fontSize="10" fontFamily="ui-monospace, monospace">
          v · pedale · G
        </text>
        <line x1="140" y1="110" x2="190" y2="110" stroke="#005949" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Modes */}
        {[
          { x: 200, label: 'DRS', sub: 'Low Drag', y: 30 },
          { x: 380, label: 'AEROBRAKE', sub: 'Frânare', y: 30 },
          { x: 560, label: 'MAXP', sub: 'Cornering', y: 30 },
        ].map((m) => (
          <g key={m.label}>
            <rect
              x={m.x}
              y={m.y}
              width="140"
              height="70"
              fill="none"
              stroke="#005949"
              strokeWidth="2"
              rx="2"
            />
            <text
              x={m.x + 70}
              y={m.y + 30}
              textAnchor="middle"
              fill="#F5F2EA"
              fontSize="13"
              fontFamily="ui-monospace, monospace"
            >
              {m.label}
            </text>
            <text
              x={m.x + 70}
              y={m.y + 50}
              textAnchor="middle"
              fill="#8A9099"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              {m.sub}
            </text>
          </g>
        ))}

        {/* Mutual transitions hint */}
        <text
          x="360"
          y="150"
          textAnchor="middle"
          fill="#8A9099"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
        >
          comutare automată pe praguri viteză / accelerație / frână / ay
        </text>
        <text
          x="360"
          y="180"
          textAnchor="middle"
          fill="#005949"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
        >
          AOA eleron + splitter binar
        </text>
      </svg>
    </figure>
  )
}

/** Cap 10 — Sinergie mecatronică. */
export function SynergyBlockDiagram() {
  return (
    <figure
      className="mt-10 max-w-[920px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-synergy"
    >
      <figcaption className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        Diagramă bloc — sinergie mecatronică Nivel 4
      </figcaption>
      <svg
        viewBox="0 0 720 260"
        className="w-full"
        role="img"
        aria-label="Interconectare: Active Aero, Powertrain, Torque Vectoring, Controller AI"
      >
        <rect width="720" height="260" fill="#0B0E14" rx="2" />
        {[
          { x: 40, y: 40, t1: 'Aerodinamică', t2: 'Activă' },
          { x: 280, y: 40, t1: 'Powertrain', t2: 'PHEV / EV' },
          { x: 520, y: 40, t1: 'Torque', t2: 'Vectoring' },
          { x: 280, y: 160, t1: 'Controller AI', t2: 'PI-ROM / NLP' },
        ].map((b) => (
          <g key={b.t1 + b.t2}>
            <rect
              x={b.x}
              y={b.y}
              width="160"
              height="64"
              fill="none"
              stroke="#005949"
              strokeWidth="2"
              rx="2"
            />
            <text
              x={b.x + 80}
              y={b.y + 28}
              textAnchor="middle"
              fill="#F5F2EA"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
            >
              {b.t1}
            </text>
            <text
              x={b.x + 80}
              y={b.y + 46}
              textAnchor="middle"
              fill="#8A9099"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              {b.t2}
            </text>
          </g>
        ))}
        {/* Links to AI hub */}
        <line x1="120" y1="104" x2="320" y2="160" stroke="#8A9099" strokeWidth="1.25" />
        <line x1="360" y1="104" x2="360" y2="160" stroke="#005949" strokeWidth="1.5" />
        <line x1="600" y1="104" x2="400" y2="160" stroke="#8A9099" strokeWidth="1.25" />
        <text
          x="360"
          y="250"
          textAnchor="middle"
          fill="#8A9099"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
        >
          Concurrent Engineering · șasiu + aero + software
        </text>
      </svg>
    </figure>
  )
}

export type GuideDiagramId =
  | 'kamm'
  | 'dof14'
  | 'state-machine'
  | 'synergy'

export function GuideDiagram({ id }: { id: GuideDiagramId }) {
  switch (id) {
    case 'kamm':
      return <KammCircleDiagram />
    case 'dof14':
      return <Dof14Diagram />
    case 'state-machine':
      return <StateMachineDiagram />
    case 'synergy':
      return <SynergyBlockDiagram />
    default:
      return null
  }
}
