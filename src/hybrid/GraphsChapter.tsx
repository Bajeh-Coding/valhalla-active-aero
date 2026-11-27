import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LAP_TIME,
  MAXP_SCHEDULE,
  TABLE3_FORCES,
} from '@/data/vehicleConstants'

type GraphId = 'lap' | 'forces' | 'maxp' | 'accel'

/**
 * Re-plots from tabulated S1 facts only — discrete points/bars, no invented curves.
 */
export function GraphsChapter() {
  const [graph, setGraph] = useState<GraphId>('lap')
  const [speedKmh, setSpeedKmh] = useState(200)

  const maxpAoa = useMemo(() => {
    for (const row of MAXP_SCHEDULE) {
      const exclusive = 'exclusiveMin' in row && row.exclusiveMin
      const minOk = exclusive ? speedKmh > row.minKmh : speedKmh >= row.minKmh
      if (minOk && speedKmh <= row.maxKmh) return row.aoaDeg
    }
    if (speedKmh < 100) return 6 // outside schedule → Standard baseline note
    return null
  }, [speedKmh])

  return (
    <div
      className="mt-8 w-full max-w-xl border-t border-aero-signal/15 pt-6"
      data-testid="graphs-chapter"
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ['lap', 'Lap GRIP'],
            ['forces', 'Table 3'],
            ['maxp', 'MaxP AOA'],
            ['accel', '0→300'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            data-testid={`graph-${id}`}
            onClick={() => setGraph(id)}
            className={cn(
              'font-ui px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase transition-colors',
              graph === id
                ? 'bg-aero-amr text-aero-ivory'
                : 'text-aero-mist hover:text-aero-ivory',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {graph === 'lap' ? <LapGraph /> : null}
      {graph === 'forces' ? <ForcesGraph /> : null}
      {graph === 'maxp' ? (
        <MaxpGraph
          speedKmh={speedKmh}
          aoa={maxpAoa}
          onSpeed={setSpeedKmh}
        />
      ) : null}
      {graph === 'accel' ? <AccelGraph /> : null}
    </div>
  )
}

function LapGraph() {
  const rows = [
    { label: 'Passive–Original', s: LAP_TIME.gripPassiveOriginalS },
    { label: 'Passive–New', s: LAP_TIME.gripPassiveNewS },
    { label: 'DRS', s: LAP_TIME.gripDrsS },
    { label: 'DRS+Aerobrake', s: LAP_TIME.gripDrsAerobrakeS },
    { label: 'MaxP', s: LAP_TIME.gripMaxPS, hi: true },
  ]
  const max = Math.max(...rows.map((r) => r.s))
  const min = Math.min(...rows.map((r) => r.s))
  const span = max - min

  return (
    <div data-testid="graph-panel-lap">
      <p className="font-serif mb-4 text-sm text-aero-mist">
        Table 5 — lap-times GRIP (s). Bare proporționale cu câștigul față de cel mai lent.
      </p>
      <svg viewBox="0 0 400 180" className="w-full" role="img">
        {rows.map((r, i) => {
          const y = 20 + i * 30
          const w = 40 + ((max - r.s) / span) * 280
          return (
            <g key={r.label}>
              <text
                x="0"
                y={y + 4}
                fill={r.hi ? '#C4DF00' : '#8B929A'}
                fontSize="9"
                fontFamily="monospace"
              >
                {r.label}
              </text>
              <rect
                x="110"
                y={y - 6}
                width={w}
                height="8"
                fill={r.hi ? '#C4DF00' : '#E8E4DC'}
                fillOpacity={r.hi ? 0.9 : 0.35}
              />
              <text
                x={120 + w}
                y={y + 4}
                fill="#F2F0EA"
                fontSize="10"
                fontFamily="monospace"
              >
                {r.s.toFixed(3)}
              </text>
            </g>
          )
        })}
      </svg>
      <Cite>S1-F060</Cite>
    </div>
  )
}

function ForcesGraph() {
  const pairs = [
    {
      label: 'Drag',
      a: TABLE3_FORCES.original.dragN,
      b: TABLE3_FORCES.newPack.dragN,
    },
    {
      label: 'Front DF',
      a: TABLE3_FORCES.original.frontDownforceN,
      b: TABLE3_FORCES.newPack.frontDownforceN,
    },
    {
      label: 'Rear DF',
      a: TABLE3_FORCES.original.rearDownforceN,
      b: TABLE3_FORCES.newPack.rearDownforceN,
    },
  ]
  const maxAbs = Math.max(
    ...pairs.flatMap((p) => [Math.abs(p.a), Math.abs(p.b)]),
  )

  return (
    <div data-testid="graph-panel-forces">
      <p className="font-serif mb-4 text-sm text-aero-mist">
        Table 3 — forțe @ 160 km/h. Original (gri) vs New pack (AMR).
      </p>
      <svg viewBox="0 0 400 160" className="w-full" role="img">
        {pairs.map((p, i) => {
          const y = 28 + i * 42
          const wa = (Math.abs(p.a) / maxAbs) * 140
          const wb = (Math.abs(p.b) / maxAbs) * 140
          return (
            <g key={p.label}>
              <text x="0" y={y} fill="#8B929A" fontSize="10" fontFamily="monospace">
                {p.label}
              </text>
              <rect x="80" y={y - 14} width={wa} height="8" fill="#E8E4DC" fillOpacity="0.35" />
              <text x={88 + wa} y={y - 7} fill="#8B929A" fontSize="9" fontFamily="monospace">
                {p.a} N
              </text>
              <rect x="80" y={y} width={wb} height="8" fill="#005949" />
              <text x={88 + wb} y={y + 7} fill="#F2F0EA" fontSize="9" fontFamily="monospace">
                {p.b} N
              </text>
            </g>
          )
        })}
      </svg>
      <Cite>S1-F011</Cite>
    </div>
  )
}

function MaxpGraph({
  speedKmh,
  aoa,
  onSpeed,
}: {
  speedKmh: number
  aoa: number | null
  onSpeed: (n: number) => void
}) {
  const segments = MAXP_SCHEDULE.map((row) => ({
    label: `${row.minKmh}–${row.maxKmh}`,
    aoa: row.aoaDeg,
  }))

  return (
    <div data-testid="graph-panel-maxp">
      <p className="font-serif mb-4 text-sm text-aero-mist">
        Schedule MaxP (Figure 13 text) — trepte discrete, nu interpolare inventată.
      </p>
      <label className="mb-4 block">
        <div className="mb-1.5 flex justify-between">
          <span className="font-ui text-[11px] tracking-[0.16em] text-aero-mist uppercase">
            Viteză scrub
          </span>
          <span className="font-mono text-xs text-aero-ivory">{speedKmh} km/h</span>
        </div>
        <input
          data-testid="graph-speed"
          className="aero-range w-full"
          type="range"
          min={80}
          max={300}
          step={5}
          value={speedKmh}
          onChange={(e) => onSpeed(Number(e.target.value))}
        />
      </label>
      <p className="font-display text-3xl text-aero-ivory">
        {aoa === null ? '—' : `${aoa}°`}
        <span className="font-serif ml-2 text-base text-aero-mist">AOA MaxP</span>
      </p>
      <ul className="mt-4 space-y-2">
        {segments.map((s) => (
          <li
            key={s.label}
            className="font-mono flex justify-between text-sm text-aero-mist"
          >
            <span>{s.label} km/h</span>
            <span className="text-aero-ivory">{s.aoa}°</span>
          </li>
        ))}
      </ul>
      <Cite>S1-F051</Cite>
    </div>
  )
}

function AccelGraph() {
  return (
    <div data-testid="graph-panel-accel">
      <p className="font-serif mb-4 text-sm text-aero-mist">
        Accelerație 0→300 km/h — două puncte discrete (S1-F035).
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="font-ui text-[10px] tracking-[0.2em] text-aero-mist uppercase">
            Passive
          </p>
          <p className="font-display mt-2 text-3xl text-aero-ivory">10.728 s</p>
        </div>
        <div>
          <p className="font-ui text-[10px] tracking-[0.2em] text-aero-lime uppercase">
            DRS
          </p>
          <p className="font-display mt-2 text-3xl text-aero-ivory">10.650 s</p>
        </div>
      </div>
      <Cite>S1-F035</Cite>
    </div>
  )
}

function Cite({ children }: { children: string }) {
  return (
    <p className="font-ui mt-4 text-[10px] tracking-[0.2em] text-aero-signal/50 uppercase">
      {children}
    </p>
  )
}
