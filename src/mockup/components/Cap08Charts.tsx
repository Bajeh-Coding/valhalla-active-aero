import type { Cap08ChartSpec, Cap08Series } from '../data/cap08Charts'

const IVORY = '#f8f7f4'
const MIST = '#8b929a'
const AMR = '#005949'
const AMR_BRIGHT = '#0a7a62'
const LIME = '#c4df00'
const GRID = 'rgb(232 228 220 / 0.08)'
const ZERO = 'rgb(232 228 220 / 0.28)'
const FONT = 'AstonMartinSans, sans-serif'

const SERIES_COLORS = [
  'rgb(139 146 154 / 0.72)',
  AMR,
  AMR_BRIGHT,
  'rgb(232 228 220 / 0.45)',
] as const

interface Cap08ChartsProps {
  charts: readonly Cap08ChartSpec[]
  chapterId: string
}

export function Cap08Charts({ charts, chapterId }: Cap08ChartsProps) {
  return (
    <div
      className="mt-14 max-w-[920px] space-y-16"
      data-testid={`chapter-${chapterId}-charts`}
    >
      {charts.map((spec) => (
        <figure
          key={spec.id}
          className="chapter-reveal border-t border-aero-ivory/10 pt-8"
          data-testid={`chart-${spec.id}`}
          data-chart-id={spec.id}
        >
          <figcaption className="mb-5 max-w-[640px]">
            <p className="font-ui text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
              {spec.lead}
            </p>
            <h3 className="font-display mt-2 text-lg font-normal tracking-normal text-aero-ivory md:text-xl">
              {spec.title}
            </h3>
          </figcaption>

          {spec.kind === 'kamm' ? (
            <KammDiagram spec={spec} />
          ) : spec.kind === 'step' ? (
            <StepChart spec={spec} />
          ) : (
            <BarChart spec={spec} />
          )}

          <div className="mt-4 flex flex-col gap-1 border-t border-aero-signal/10 pt-3">
            {spec.annotation ? (
              <p className="font-ui text-sm tracking-[0.35px] text-aero-mist/80">
                {spec.annotation}
              </p>
            ) : null}
            <p className="font-ui text-[10px] tracking-[0.18em] text-aero-signal/45 uppercase">
              {spec.locator}
            </p>
          </div>
        </figure>
      ))}
    </div>
  )
}

function niceMax(v: number): number {
  if (v === 0) return 1
  const abs = Math.abs(v)
  const mag = 10 ** Math.floor(Math.log10(abs))
  const n = abs / mag
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return Math.sign(v) * nice * mag
}

function niceStep(span: number): number {
  const raw = span / 4
  const mag = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-9)))
  const n = raw / mag
  if (n <= 1) return mag
  if (n <= 2) return 2 * mag
  if (n <= 5) return 5 * mag
  return 10 * mag
}

function barDomain(values: number[]): { yMin: number; yMax: number } {
  if (values.length === 0) return { yMin: 0, yMax: 1 }
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min >= 0) {
    const span = Math.max(max - min, Math.abs(max) * 0.05, 0.001)
    const step = niceStep(span)
    if (span / Math.max(max, 1e-9) < 0.25) {
      const yMin = Math.max(0, Math.floor((min - span * 0.6) / step) * step)
      const yMax = Math.ceil((max + span * 0.4) / step) * step
      return { yMin, yMax }
    }
    return { yMin: 0, yMax: Math.ceil((max * 1.12) / step) * step }
  }
  const extent = Math.max(Math.abs(min), Math.abs(max), 0.001)
  const step = niceStep(extent)
  const pad = Math.ceil((extent * 1.12) / step) * step
  return { yMin: -pad, yMax: pad }
}

function formatTick(n: number): string {
  if (Math.abs(n) >= 100) return n.toFixed(0)
  if (Math.abs(n) >= 10) return Number(n.toFixed(1)).toString()
  if (Math.abs(n) >= 1) return Number(n.toFixed(2)).toString()
  return Number(n.toFixed(4)).toString()
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

function collectCategories(series: Cap08Series[]): string[] {
  const cats: string[] = []
  for (const s of series) {
    for (const [x] of s.points) {
      const key = String(x)
      if (!cats.includes(key)) cats.push(key)
    }
  }
  return cats
}

function BarChart({ spec }: { spec: Cap08ChartSpec }) {
  const W = 920
  const H = 340
  const pad = { t: 28, r: 24, b: 64, l: 72 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const categories = collectCategories(spec.series)
  const vals = spec.series.flatMap((s) => s.points.map(([, y]) => y))
  const { yMin, yMax } = barDomain(vals)
  const yScale = (y: number) => pad.t + ih - ((y - yMin) / (yMax - yMin)) * ih
  const ticks = 5
  const yTicks = Array.from(
    { length: ticks + 1 },
    (_, i) => yMin + ((yMax - yMin) * i) / ticks,
  )
  const nSeries = spec.series.length
  const groupW = iw / Math.max(categories.length, 1)
  const barGap = 0.18
  const barW =
    nSeries > 0 ? (groupW * (1 - barGap)) / nSeries : groupW * 0.55

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={spec.title}
    >
      <title>{spec.title}</title>
      {yTicks.map((y) => (
        <line
          key={`g-${y}`}
          x1={pad.l}
          x2={pad.l + iw}
          y1={yScale(y)}
          y2={yScale(y)}
          stroke={y === 0 && yMin < 0 ? ZERO : GRID}
          strokeWidth={y === 0 && yMin < 0 ? 1.25 : 1}
        />
      ))}
      {yTicks.map((y) => (
        <text
          key={`yl-${y}`}
          x={pad.l - 10}
          y={yScale(y) + 4}
          textAnchor="end"
          fill={MIST}
          fontSize={12}
          fontFamily={FONT}
        >
          {formatTick(y)}
        </text>
      ))}
      <text
        x={18}
        y={pad.t + ih / 2}
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
        transform={`rotate(-90 18 ${pad.t + ih / 2})`}
        textAnchor="middle"
      >
        {spec.yLabel}
        {spec.units ? ` [${spec.units}]` : ''}
      </text>

      {categories.map((cat, ci) => {
        const cx = pad.l + ci * groupW + groupW / 2
        return (
          <g key={cat}>
            {spec.series.map((s, si) => {
              const pt = s.points.find(([x]) => String(x) === cat)
              if (!pt) return null
              const y = pt[1]
              const x0 =
                pad.l + ci * groupW + groupW * (barGap / 2) + si * barW
              const baseline = yMin >= 0 ? yMin : 0
              const y0 = yScale(Math.max(baseline, y))
              const y1 = yScale(Math.min(baseline, y))
              const bh = Math.max(1.5, Math.abs(y1 - y0))
              const fill =
                nSeries === 1
                  ? AMR
                  : SERIES_COLORS[si % SERIES_COLORS.length]
              const barTop = Math.min(y0, y1)
              return (
                <g key={`${cat}-${s.name}`}>
                  <rect
                    x={x0}
                    y={barTop}
                    width={Math.max(2, barW - 2)}
                    height={bh}
                    fill={fill}
                  >
                    <title>
                      {s.name}: {y} {spec.units}
                    </title>
                  </rect>
                  <text
                    x={x0 + Math.max(2, barW - 2) / 2}
                    y={barTop - 6}
                    textAnchor="middle"
                    fill={IVORY}
                    fontSize={11}
                    fontFamily={FONT}
                  >
                    {formatTick(y)}
                  </text>
                </g>
              )
            })}
            <text
              x={cx}
              y={H - 28}
              textAnchor="middle"
              fill={MIST}
              fontSize={11}
              fontFamily={FONT}
            >
              {truncate(cat, 14)}
            </text>
          </g>
        )
      })}

      {spec.series.map((s, si) => (
        <g
          key={`leg-${s.name}`}
          transform={`translate(${pad.l + si * 180}, 12)`}
        >
          <rect
            width={12}
            height={12}
            fill={
              nSeries === 1 ? AMR : SERIES_COLORS[si % SERIES_COLORS.length]
            }
          />
          <text
            x={18}
            y={10}
            fill={MIST}
            fontSize={11}
            fontFamily={FONT}
          >
            {truncate(s.name, 22)}
          </text>
        </g>
      ))}

      <text
        x={pad.l + iw / 2}
        y={H - 8}
        textAnchor="middle"
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
      >
        {spec.xLabel}
      </text>
    </svg>
  )
}

function StepChart({ spec }: { spec: Cap08ChartSpec }) {
  const W = 920
  const H = 320
  const pad = { t: 36, r: 28, b: 56, l: 64 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const series = spec.series[0]
  const pts = (series?.points ?? []).filter(
    (p): p is [number, number] => typeof p[0] === 'number',
  )
  const xMin = pts.length ? Math.min(...pts.map(([x]) => x)) : 0
  const xMax = pts.length ? Math.max(...pts.map(([x]) => x)) : 1
  const yMax = niceMax(Math.max(...pts.map(([, y]) => y), 1) * 1.15)
  const xScale = (x: number) => pad.l + ((x - xMin) / (xMax - xMin || 1)) * iw
  const yScale = (y: number) => pad.t + ih - (y / yMax) * ih

  let d = ''
  if (pts.length) {
    d = `M ${xScale(pts[0]![0])} ${yScale(pts[0]![1])}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]!
      const cur = pts[i]!
      d += ` L ${xScale(cur[0])} ${yScale(prev[1])}`
      d += ` L ${xScale(cur[0])} ${yScale(cur[1])}`
    }
  }

  const yTicks = [0, yMax / 2, yMax]
  const xTicks = [xMin, (xMin + xMax) / 2, xMax]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={spec.title}
    >
      <title>{spec.title}</title>
      {yTicks.map((y) => (
        <line
          key={`g-${y}`}
          x1={pad.l}
          x2={pad.l + iw}
          y1={yScale(y)}
          y2={yScale(y)}
          stroke={GRID}
        />
      ))}
      {yTicks.map((y) => (
        <text
          key={`yl-${y}`}
          x={pad.l - 10}
          y={yScale(y) + 4}
          textAnchor="end"
          fill={MIST}
          fontSize={12}
          fontFamily={FONT}
        >
          {formatTick(y)}
        </text>
      ))}
      <path
        d={d}
        fill="none"
        stroke={AMR}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={xScale(x)}
          cy={yScale(y)}
          r={3.2}
          fill={AMR}
        />
      ))}
      {spec.markers?.map((m) => (
        <g key={m.label}>
          <line
            x1={xScale(m.x)}
            x2={xScale(m.x)}
            y1={pad.t}
            y2={pad.t + ih}
            stroke={LIME}
            strokeWidth={1}
            strokeDasharray="3 5"
            opacity={0.85}
          />
          <text
            x={xScale(m.x) + 4}
            y={pad.t + 14}
            fill={LIME}
            fontSize={11}
            fontFamily={FONT}
          >
            {m.label}
          </text>
        </g>
      ))}
      {xTicks.map((x, i) => (
        <text
          key={`xt-${i}`}
          x={xScale(x)}
          y={H - 28}
          textAnchor="middle"
          fill={MIST}
          fontSize={12}
          fontFamily={FONT}
        >
          {formatTick(x)}
        </text>
      ))}
      <text
        x={pad.l + iw / 2}
        y={H - 8}
        textAnchor="middle"
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
      >
        {spec.xLabel} [{spec.units}]
      </text>
      <text
        x={18}
        y={pad.t + ih / 2}
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
        transform={`rotate(-90 18 ${pad.t + ih / 2})`}
        textAnchor="middle"
      >
        {spec.yLabel}
      </text>
    </svg>
  )
}

/** Conceptual Kamm friction circle — two radii (baseline vs +downforce), no μ numbers. */
function KammDiagram({ spec }: { spec: Cap08ChartSpec }) {
  const W = 720
  const H = 420
  const cx = 360
  const cy = 210
  const rBase = 96
  const rAero = 148

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full max-w-[720px]"
      role="img"
      aria-label={spec.title}
    >
      <title>{spec.title}</title>

      {/* Axes */}
      <line
        x1={cx - 200}
        x2={cx + 200}
        y1={cy}
        y2={cy}
        stroke={ZERO}
        strokeWidth={1.25}
      />
      <line
        x1={cx}
        x2={cx}
        y1={cy - 180}
        y2={cy + 180}
        stroke={ZERO}
        strokeWidth={1.25}
      />

      {/* Outer (+downforce) */}
      <circle
        cx={cx}
        cy={cy}
        r={rAero}
        fill="rgb(0 89 73 / 0.12)"
        stroke={AMR}
        strokeWidth={2}
      />
      {/* Inner (baseline Fz) */}
      <circle
        cx={cx}
        cy={cy}
        r={rBase}
        fill="transparent"
        stroke="rgb(139 146 154 / 0.85)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />

      {/* Example force vector inside expanded circle */}
      <line
        x1={cx}
        x2={cx + 88}
        y1={cy}
        y2={cy - 72}
        stroke={LIME}
        strokeWidth={1.75}
      />
      <circle cx={cx + 88} cy={cy - 72} r={4} fill={LIME} />

      <text
        x={cx + 210}
        y={cy + 4}
        fill={MIST}
        fontSize={12}
        fontFamily={FONT}
      >
        Fx · FL
      </text>
      <text
        x={cx + 8}
        y={cy - 168}
        fill={MIST}
        fontSize={12}
        fontFamily={FONT}
      >
        Fy
      </text>

      <g transform={`translate(${cx - 200}, ${H - 48})`}>
        <line
          x1={0}
          x2={28}
          y1={0}
          y2={0}
          stroke="rgb(139 146 154 / 0.85)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text x={36} y={4} fill={MIST} fontSize={11} fontFamily={FONT}>
          Fz baseline (pasiv)
        </text>
        <line
          x1={200}
          x2={228}
          y1={0}
          y2={0}
          stroke={AMR}
          strokeWidth={2}
        />
        <text x={236} y={4} fill={MIST} fontSize={11} fontFamily={FONT}>
          Fz + downforce (activ)
        </text>
      </g>

      <text
        x={cx}
        y={28}
        textAnchor="middle"
        fill={IVORY}
        fontSize={13}
        fontFamily={FONT}
      >
        √(Fx² + Fy²) ≤ μ · Fz
      </text>
    </svg>
  )
}
