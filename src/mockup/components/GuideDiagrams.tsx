/**
 * Guide-faithful diagrams recreated from Informatii_pentru_Prezentare
 * (Kamm, 14 DOF, state machine, mechatronic synergy, KPI). No invented numbers.
 */

import { useState } from 'react'

type StateDiagramVariant = 'cards' | 'circular' | 'hud'

const STATE_DIAGRAM_VARIANTS: {
  id: StateDiagramVariant
  letter: 'A' | 'B' | 'C'
  label: string
}[] = [
  { id: 'cards', letter: 'A', label: 'Mode cards' },
  { id: 'circular', letter: 'B', label: 'Circular' },
  { id: 'hud', letter: 'C', label: 'HUD table' },
]

/** Default for Cap 05 until Bajeh picks — Variant A (horizontal mode cards). */
export const DEFAULT_STATE_DIAGRAM_VARIANT: StateDiagramVariant = 'cards'

const MODE_ROWS = [
  {
    id: 'drs',
    title: 'DRS',
    sub: 'Low Drag',
    hardware: 'AOA 0° · Splitter DESCHIS',
    trigger: 'v > 110 km/h · accel > 70% · |ay| < 1g',
    effect: 'CD = 0.31 · 0–300 în 10.650s',
  },
  {
    id: 'aerobrake',
    title: 'AEROBRAKE',
    sub: 'Frânare',
    hardware: 'AOA 19°–25° · Splitter ÎNCHIS',
    trigger: 'v > 70 km/h · frână > 40% · |ay| < 1g',
    effect: 'Decelerație + downforce spate',
  },
  {
    id: 'maxp',
    title: 'MAXP',
    sub: 'Cornering',
    hardware: 'AOA 0°–4.5° dinamic · Splitter ÎNCHIS',
    trigger: 'Viraj stabil · 100–300 km/h · CoP↔CoG',
    effect: 'Aero-balance · max ay',
  },
] as const

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

/** Cap 05 — Diagrama de stări (3 luxury variants; A = default). */
export function StateMachineDiagram() {
  const [variant, setVariant] = useState<StateDiagramVariant>(
    DEFAULT_STATE_DIAGRAM_VARIANT,
  )

  return (
    <figure
      className="state-diagram mt-10 max-w-[1000px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-state-machine"
      data-variant={variant}
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <figcaption className="font-ui text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
          Diagramă stări — controller mecatronic (MATLAB/Simulink)
        </figcaption>
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Variantă diagramă stări"
          data-testid="diagram-state-machine-variants"
        >
          {STATE_DIAGRAM_VARIANTS.map((v) => {
            const active = variant === v.id
            return (
              <button
                key={v.id}
                type="button"
                data-testid={`diagram-state-variant-${v.letter}`}
                aria-pressed={active}
                onClick={() => setVariant(v.id)}
                className={`font-ui px-3 py-1.5 text-[10px] font-medium tracking-[0.45px] uppercase transition-colors ${
                  active
                    ? 'bg-aero-amr/25 text-aero-ivory ring-1 ring-aero-amr/60'
                    : 'text-aero-mist/55 hover:text-aero-ivory/80'
                }`}
              >
                {v.letter}
                <span className="ml-1.5 text-aero-mist/40">{v.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {variant === 'cards' ? <StateVariantCards /> : null}
      {variant === 'circular' ? <StateVariantCircular /> : null}
      {variant === 'hud' ? <StateVariantHud /> : null}
    </figure>
  )
}

/** Variant A — horizontal mode cards (default). */
function StateVariantCards() {
  return (
    <div
      className="state-var-cards overflow-hidden bg-aero-ink/80"
      data-testid="diagram-state-variant-view-A"
      role="img"
      aria-label="State machine: carduri orizontale DRS, Aerobrake, MaxP din CAN-bus"
    >
      <div className="flex flex-col gap-0 border border-aero-ivory/8 md:flex-row md:items-stretch">
        <div className="flex shrink-0 flex-col justify-center border-b border-aero-ivory/8 px-5 py-6 md:w-[148px] md:border-r md:border-b-0">
          <p className="font-ui text-[9px] font-medium tracking-[0.6px] text-aero-mist/45 uppercase">
            Intrare
          </p>
          <p className="font-display mt-2 text-base tracking-normal text-aero-ivory">
            CAN-bus
          </p>
          <p className="font-ui mt-2 text-[11px] leading-relaxed tracking-[0.35px] text-aero-mist/70">
            v · pedale · G
          </p>
          <div
            className="mt-4 hidden h-px w-10 bg-aero-amr md:block"
            aria-hidden
          />
        </div>

        <div className="grid flex-1 md:grid-cols-3">
          {MODE_ROWS.map((m, i) => (
            <div
              key={m.id}
              className={`state-var-card relative px-5 py-6 ${
                i < MODE_ROWS.length - 1
                  ? 'border-b border-aero-ivory/8 md:border-r md:border-b-0'
                  : ''
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-xl tracking-normal text-aero-ivory">
                  {m.title}
                </p>
                <span className="font-ui text-[9px] tracking-[0.55px] text-aero-amr uppercase">
                  {m.sub}
                </span>
              </div>
              <p className="font-ui mt-4 text-[10px] font-medium tracking-[0.55px] text-aero-mist/40 uppercase">
                Hardware
              </p>
              <p className="font-ui mt-1 text-[12px] leading-snug tracking-[0.3px] text-aero-mist/85">
                {m.hardware}
              </p>
              <p className="font-ui mt-3 text-[10px] font-medium tracking-[0.55px] text-aero-mist/40 uppercase">
                Activare
              </p>
              <p className="font-ui mt-1 text-[12px] leading-snug tracking-[0.3px] text-aero-mist/85">
                {m.trigger}
              </p>
              <p className="font-ui mt-4 border-t border-aero-amr/30 pt-3 text-[12px] leading-snug tracking-[0.3px] text-aero-signal/90">
                {m.effect}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="font-ui mt-3 px-1 text-[11px] tracking-[0.35px] text-aero-mist/50">
        Comutare automată · AOA eleron + splitter binar
      </p>
    </div>
  )
}

/** Variant B — circular state machine. */
function StateVariantCircular() {
  const cx = 360
  const cy = 200
  const r = 118
  const nodes = [
    { ...MODE_ROWS[0], angle: -90 },
    { ...MODE_ROWS[1], angle: 30 },
    { ...MODE_ROWS[2], angle: 150 },
  ].map((n) => {
    const rad = (n.angle * Math.PI) / 180
    return {
      ...n,
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    }
  })

  return (
    <div
      className="state-var-circular overflow-hidden border border-aero-ivory/8 bg-aero-ink/80"
      data-testid="diagram-state-variant-view-B"
    >
      <svg
        viewBox="0 0 720 400"
        className="w-full"
        role="img"
        aria-label="State machine circular: DRS, Aerobrake, MaxP cu tranziții pe CAN"
      >
        <defs>
          <radialGradient id="sm-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#005949" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0B0E14" stopOpacity="0" />
          </radialGradient>
          <marker
            id="sm-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#005949" />
          </marker>
        </defs>
        <rect width="720" height="400" fill="#0B0E14" />
        <circle cx={cx} cy={cy} r="150" fill="url(#sm-hub)" />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#8A9099"
          strokeWidth="0.75"
          strokeDasharray="3 6"
          opacity="0.45"
        />
        {/* Transition arcs */}
        {nodes.map((from, i) => {
          const to = nodes[(i + 1) % nodes.length]!
          const mx = (from.x + to.x) / 2
          const my = (from.y + to.y) / 2
          const midR = Math.hypot(mx - cx, my - cy)
          const pull = midR > 0 ? 28 / midR : 0
          const qx = mx + (mx - cx) * pull
          const qy = my + (my - cy) * pull
          return (
            <path
              key={`arc-${from.id}`}
              d={`M ${from.x} ${from.y} Q ${qx} ${qy} ${to.x} ${to.y}`}
              fill="none"
              stroke="#005949"
              strokeWidth="1.5"
              markerEnd="url(#sm-arrow)"
              opacity="0.85"
            />
          )
        })}
        {/* Hub */}
        <circle
          cx={cx}
          cy={cy}
          r="42"
          fill="#05070a"
          stroke="#005949"
          strokeWidth="1.5"
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="#F5F2EA"
          fontSize="12"
          fontFamily="AstonMartinSans, sans-serif"
        >
          CAN
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#8A9099"
          fontSize="9"
          fontFamily="AstonMartinSans, sans-serif"
        >
          v · pedale · G
        </text>
        {nodes.map((n) => (
          <g key={n.id} className="state-var-node">
            <rect
              x={n.x - 70}
              y={n.y - 28}
              width="140"
              height="56"
              fill="#05070a"
              stroke="#005949"
              strokeWidth="1.75"
            />
            <text
              x={n.x}
              y={n.y - 4}
              textAnchor="middle"
              fill="#F5F2EA"
              fontSize="14"
              fontFamily="AstonMartinFlare, sans-serif"
            >
              {n.title}
            </text>
            <text
              x={n.x}
              y={n.y + 14}
              textAnchor="middle"
              fill="#8A9099"
              fontSize="10"
              fontFamily="AstonMartinSans, sans-serif"
            >
              {n.sub}
            </text>
          </g>
        ))}
        <text
          x={cx}
          y={372}
          textAnchor="middle"
          fill="#8A9099"
          fontSize="11"
          fontFamily="AstonMartinSans, sans-serif"
        >
          Comutare automată pe praguri · AOA + splitter binar
        </text>
      </svg>
    </div>
  )
}

/** Variant C — HUD telemetry table. */
function StateVariantHud() {
  return (
    <div
      className="state-var-hud overflow-hidden border border-aero-ivory/8 bg-aero-ink/90"
      data-testid="diagram-state-variant-view-C"
      role="img"
      aria-label="HUD telemetry: tabel stări DRS, Aerobrake, MaxP"
    >
      <div className="flex items-center justify-between border-b border-aero-amr/40 px-4 py-2.5">
        <p className="font-ui text-[9px] font-medium tracking-[0.7px] text-aero-amr uppercase">
          Telemetry · S1 controller
        </p>
        <p className="font-ui text-[9px] tracking-[0.55px] text-aero-mist/45 uppercase">
          CAN · live thresholds
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-aero-ivory/10">
              {['Mod', 'Hardware', 'Activare', 'Efect'].map((h) => (
                <th
                  key={h}
                  className="font-ui px-4 py-2.5 text-[9px] font-medium tracking-[0.55px] text-aero-mist/40 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODE_ROWS.map((m, i) => (
              <tr
                key={m.id}
                className={`state-var-hud-row border-b border-aero-ivory/6 last:border-b-0 ${
                  i % 2 === 0 ? 'bg-aero-void/40' : ''
                }`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <td className="px-4 py-3.5 align-top">
                  <p className="font-display text-base tracking-normal text-aero-ivory">
                    {m.title}
                  </p>
                  <p className="font-ui mt-0.5 text-[10px] tracking-[0.45px] text-aero-amr uppercase">
                    {m.sub}
                  </p>
                </td>
                <td className="font-ui px-4 py-3.5 align-top text-[12px] leading-snug tracking-[0.3px] text-aero-mist/85">
                  {m.hardware}
                </td>
                <td className="font-ui px-4 py-3.5 align-top text-[12px] leading-snug tracking-[0.3px] text-aero-mist/85">
                  {m.trigger}
                </td>
                <td className="font-ui px-4 py-3.5 align-top text-[12px] leading-snug tracking-[0.3px] text-aero-signal/90">
                  {m.effect}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 border-t border-aero-ivory/8 px-4 py-2">
        <span className="inline-block h-1.5 w-1.5 bg-aero-lime" aria-hidden />
        <p className="font-ui text-[10px] tracking-[0.4px] text-aero-mist/50">
          Intrare CAN: viteză · pedale · senzori G → AOA eleron + splitter binar
        </p>
      </div>
    </div>
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
