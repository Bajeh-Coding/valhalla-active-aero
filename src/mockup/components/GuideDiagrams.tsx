/**
 * Guide-faithful diagrams recreated from Informatii_pentru_Prezentare
 * (Kamm, 14 DOF, state machine, mechatronic synergy, KPI). No invented numbers.
 */

/** Cap 02 — Cercul de frecare Kamm extins de FL. */
export function KammCircleDiagram() {
  return (
    <figure
      className="mt-10 max-w-[720px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-kamm"
    >
      <figcaption className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        Diagramă — Cercul de frecare Kamm (Fy,max = μ · Fz) + FL
      </figcaption>
      <svg
        viewBox="0 0 640 360"
        className="w-full text-aero-ivory"
        role="img"
        aria-label="Cercul de frecare Kamm: raza crește cu Fz când se adaugă downforce FL"
      >
        <rect width="640" height="360" fill="#0B0E14" rx="2" />
        {/* Axes */}
        <line x1="80" y1="180" x2="300" y2="180" stroke="#8A9099" strokeWidth="1" />
        <line x1="190" y1="70" x2="190" y2="290" stroke="#8A9099" strokeWidth="1" />
        <text x="305" y="184" fill="#8A9099" fontSize="11" fontFamily="ui-monospace, monospace">
          Fx
        </text>
        <text x="196" y="66" fill="#8A9099" fontSize="11" fontFamily="ui-monospace, monospace">
          Fy
        </text>

        {/* Inner circle — without FL */}
        <circle
          cx="190"
          cy="180"
          r="70"
          fill="none"
          stroke="#8A9099"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.7"
        />
        {/* Outer circle — with FL (larger Fz) */}
        <circle
          cx="190"
          cy="180"
          r="110"
          fill="none"
          stroke="#005949"
          strokeWidth="2.5"
        />
        <text x="78" y="320" fill="#8A9099" fontSize="11" fontFamily="ui-monospace, monospace">
          μ·Fz (pasiv)
        </text>
        <text x="200" y="320" fill="#005949" fontSize="11" fontFamily="ui-monospace, monospace">
          μ·(Fz + FL) cu downforce
        </text>

        {/* Equations HUD */}
        <text x="360" y="100" fill="#F5F2EA" fontSize="13" fontFamily="ui-monospace, monospace">
          Fy,max = μ · Fz
        </text>
        <text x="360" y="140" fill="#8A9099" fontSize="12" fontFamily="ui-monospace, monospace">
          FD = 0.5 · ρ · v² · A · CD
        </text>
        <text x="360" y="168" fill="#8A9099" fontSize="12" fontFamily="ui-monospace, monospace">
          FL = 0.5 · ρ · v² · A · |CL|
        </text>
        <text x="360" y="210" fill="#005949" fontSize="12" fontFamily="ui-monospace, monospace">
          FL ↑ → Fz ↑ → Fy,max ↑
        </text>
        <text x="360" y="236" fill="#8A9099" fontSize="11" fontFamily="ui-monospace, monospace">
          fără masă inerțială adăugată
        </text>
      </svg>
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
