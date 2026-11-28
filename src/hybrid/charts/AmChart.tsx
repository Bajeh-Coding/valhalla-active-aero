import { useId, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useChartDrawIn } from '@/lib/useChartDrawIn'
import type { ChartSpec } from '../data/charts'
import { CHART_THEME, SERIES_COLORS } from './theme'

interface AmChartProps {
  spec: ChartSpec
  className?: string
  /** Highlight scrub x for line/step charts. */
  scrubX?: number | null
  height?: number
}

function isNumericPoint(
  p: [string | number, number | null],
): p is [number, number] {
  return typeof p[0] === 'number' && typeof p[1] === 'number'
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

/** Tight domain for bar charts — avoid 0→200 when data lives near 110. */
function barDomain(values: number[]): { yMin: number; yMax: number } {
  if (values.length === 0) return { yMin: 0, yMax: 1 }
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min >= 0) {
    const span = Math.max(max - min, Math.abs(max) * 0.05, 0.001)
    const step = niceStep(span)
    // Zoom when relative span is small (lap-times cluster)
    if (span / Math.max(max, 1e-9) < 0.25) {
      const yMin = Math.max(0, Math.floor((min - span * 0.6) / step) * step)
      const yMax = Math.ceil((max + span * 0.4) / step) * step
      return { yMin, yMax }
    }
    return { yMin: 0, yMax: Math.ceil((max * 1.08) / step) * step }
  }
  const extent = Math.max(Math.abs(min), Math.abs(max), 0.001)
  const step = niceStep(extent)
  const pad = Math.ceil((extent * 1.1) / step) * step
  return { yMin: -pad, yMax: pad }
}

export function AmChart({
  spec,
  className,
  scrubX = null,
  height = 380,
}: AmChartProps) {
  const uid = useId()
  const drawRef = useRef<HTMLElement>(null)
  useChartDrawIn(drawRef)
  const pad = { t: 28, r: 24, b: 64, l: 72 }
  const W = 920
  const H = height
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b

  const { categories, yMin, yMax, xMin, xMax, isCat } = useMemo(() => {
    if (spec.type === 'grouped_bar') {
      const cats: string[] = []
      for (const s of spec.series) {
        for (const [x] of s.points) {
          const key = String(x)
          if (!cats.includes(key)) cats.push(key)
        }
      }
      const vals: number[] = []
      for (const s of spec.series) {
        for (const [, y] of s.points) {
          if (y == null) continue
          vals.push(y)
        }
      }
      const { yMin: ymin, yMax: ymax } = barDomain(vals)
      return {
        categories: cats,
        yMin: ymin,
        yMax: ymax,
        xMin: 0,
        xMax: 1,
        isCat: true,
      }
    }

    let xmin = Infinity
    let xmax = -Infinity
    let ymin = 0
    let ymax = 0
    for (const s of spec.series) {
      for (const p of s.points) {
        if (!isNumericPoint(p)) continue
        xmin = Math.min(xmin, p[0])
        xmax = Math.max(xmax, p[0])
        ymin = Math.min(ymin, p[1])
        ymax = Math.max(ymax, p[1])
      }
    }
    if (!Number.isFinite(xmin)) {
      xmin = 0
      xmax = 1
    }
    const ySpan = Math.max(Math.abs(ymin), Math.abs(ymax), 0.001)
    return {
      categories: [] as string[],
      yMin: ymin < 0 ? -niceMax(ySpan) : 0,
      yMax: niceMax(ySpan * 1.12),
      xMin: xmin,
      xMax: xmax === xmin ? xmin + 1 : xmax,
      isCat: false,
    }
  }, [spec])

  const yScale = (y: number) => pad.t + ih - ((y - yMin) / (yMax - yMin)) * ih
  const xScaleNum = (x: number) =>
    pad.l + ((x - xMin) / (xMax - xMin || 1)) * iw

  const ticks = 5
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => {
    return yMin + ((yMax - yMin) * i) / ticks
  })

  const nSeries = spec.series.length
  const groupW = isCat ? iw / Math.max(categories.length, 1) : 0
  const barGap = 0.18
  const barW =
    isCat && nSeries > 0
      ? (groupW * (1 - barGap)) / nSeries
      : groupW * 0.55

  const scrubAoa = useMemo(() => {
    if (scrubX == null || isCat) return null
    const series = spec.series[0]
    if (!series) return null
    const pts = series.points.filter(isNumericPoint)
    if (pts.length === 0) return null
    // Piecewise linear / step readout
    if (spec.type === 'step') {
      let val = pts[0]![1]
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]!
        if (p[0] <= scrubX) val = p[1]
        else break
      }
      return val
    }
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]!
      const b = pts[i + 1]!
      if (scrubX >= a[0] && scrubX <= b[0]) {
        const t = (scrubX - a[0]) / (b[0] - a[0] || 1)
        return a[1] + t * (b[1] - a[1])
      }
    }
    if (scrubX <= pts[0]![0]) return pts[0]![1]
    return pts[pts.length - 1]![1]
  }, [scrubX, spec, isCat])

  return (
    <figure
      ref={drawRef}
      className={cn('relative w-full', className)}
      data-testid={`chart-${spec.chartId}`}
      data-chart-id={spec.chartId}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={spec.title}
      >
        <title>{spec.title}</title>

        {/* Grid */}
        {yTicks.map((y) => (
          <line
            key={`g-${y}`}
            x1={pad.l}
            x2={pad.l + iw}
            y1={yScale(y)}
            y2={yScale(y)}
            stroke={
              y === 0 && yMin < 0 ? CHART_THEME.zero : CHART_THEME.grid
            }
            strokeWidth={y === 0 && yMin < 0 ? 1.25 : 1}
          />
        ))}

        {/* Target line */}
        {spec.targetY ? (
          <g>
            <line
              x1={pad.l}
              x2={pad.l + iw}
              y1={yScale(spec.targetY.value)}
              y2={yScale(spec.targetY.value)}
              stroke={CHART_THEME.accent}
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.7}
            />
            <text
              x={pad.l + iw - 4}
              y={yScale(spec.targetY.value) - 6}
              textAnchor="end"
              fill={CHART_THEME.accent}
              fontSize={11}
              fontFamily={CHART_THEME.fontUi}
            >
              {spec.targetY.label}
            </text>
          </g>
        ) : null}

        {/* Axes labels */}
        {yTicks.map((y) => (
          <text
            key={`yl-${y}`}
            x={pad.l - 10}
            y={yScale(y) + 4}
            textAnchor="end"
            fill={CHART_THEME.axisLabel}
            fontSize={12}
            fontFamily={CHART_THEME.fontMono}
          >
            {formatTick(y)}
          </text>
        ))}

        <text
          x={18}
          y={pad.t + ih / 2}
          fill={CHART_THEME.mist}
          fontSize={11}
          fontFamily={CHART_THEME.fontUi}
          transform={`rotate(-90 18 ${pad.t + ih / 2})`}
          textAnchor="middle"
        >
          {spec.yLabel}
          {spec.units ? ` [${spec.units}]` : ''}
        </text>

        {/* Grouped bars */}
        {isCat
          ? categories.map((cat, ci) => {
              const cx = pad.l + ci * groupW + groupW / 2
              return (
                <g key={cat}>
                  {spec.series.map((s, si) => {
                    const pt = s.points.find(([x]) => String(x) === cat)
                    const y = pt?.[1]
                    if (y == null) return null
                    const x0 =
                      pad.l +
                      ci * groupW +
                      groupW * (barGap / 2) +
                      si * barW
                    const baseline = yMin >= 0 ? yMin : 0
                    const y0 = yScale(Math.max(baseline, y))
                    const y1 = yScale(Math.min(baseline, y))
                    const bh = Math.max(1.5, Math.abs(y1 - y0))
                    const fill =
                      nSeries === 1
                        ? CHART_THEME.seriesActive
                        : SERIES_COLORS[si % SERIES_COLORS.length]
                    return (
                      <rect
                        key={`${cat}-${s.name}`}
                        x={x0}
                        y={Math.min(y0, y1)}
                        width={Math.max(2, barW - 2)}
                        height={bh}
                        fill={fill}
                        rx={0}
                        data-chart-bar=""
                      >
                        <title>
                          {s.name}: {y} {spec.units}
                        </title>
                      </rect>
                    )
                  })}
                  <text
                    x={cx}
                    y={H - 28}
                    textAnchor="middle"
                    fill={CHART_THEME.axisLabel}
                    fontSize={11}
                    fontFamily={CHART_THEME.fontUi}
                  >
                    {truncate(cat, 14)}
                  </text>
                </g>
              )
            })
          : null}

        {/* Line / step paths */}
        {!isCat
          ? spec.series.map((s, si) => {
              const pts = s.points.filter(isNumericPoint)
              if (pts.length === 0) return null
              const d =
                spec.type === 'step'
                  ? buildStepPath(pts, xScaleNum, yScale)
                  : buildLinePath(pts, xScaleNum, yScale)
              return (
                <g key={s.name}>
                  <path
                    d={d}
                    fill="none"
                    stroke={SERIES_COLORS[si % SERIES_COLORS.length]}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    data-chart-line=""
                  />
                  {pts.map(([x, y], i) => (
                    <circle
                      key={`${s.name}-${i}`}
                      cx={xScaleNum(x)}
                      cy={yScale(y)}
                      r={3.2}
                      fill={SERIES_COLORS[si % SERIES_COLORS.length]}
                      data-chart-marker=""
                    />
                  ))}
                </g>
              )
            })
          : null}

        {/* Markers */}
        {spec.markers?.map((m) => (
          <g key={m.label}>
            <line
              x1={xScaleNum(m.x)}
              x2={xScaleNum(m.x)}
              y1={pad.t}
              y2={pad.t + ih}
              stroke={CHART_THEME.accent}
              strokeWidth={1}
              strokeDasharray="3 5"
              opacity={0.85}
            />
            <text
              x={xScaleNum(m.x) + 4}
              y={pad.t + 14}
              fill={CHART_THEME.accent}
              fontSize={11}
              fontFamily={CHART_THEME.fontUi}
            >
              {m.label}
            </text>
          </g>
        ))}

        {/* Scrub cursor */}
        {scrubX != null && !isCat ? (
          <g>
            <line
              x1={xScaleNum(scrubX)}
              x2={xScaleNum(scrubX)}
              y1={pad.t}
              y2={pad.t + ih}
              stroke={CHART_THEME.text}
              strokeWidth={1}
              opacity={0.45}
            />
            {scrubAoa != null ? (
              <g>
                <circle
                  cx={xScaleNum(scrubX)}
                  cy={yScale(scrubAoa)}
                  r={5}
                  fill={CHART_THEME.seriesActive}
                  stroke={CHART_THEME.text}
                  strokeWidth={1.5}
                />
                <rect
                  x={xScaleNum(scrubX) + 10}
                  y={yScale(scrubAoa) - 22}
                  width={88}
                  height={28}
                  fill="rgb(5 7 10 / 0.88)"
                />
                <text
                  x={xScaleNum(scrubX) + 18}
                  y={yScale(scrubAoa) - 4}
                  fill={CHART_THEME.text}
                  fontSize={12}
                  fontFamily={CHART_THEME.fontMono}
                >
                  {scrubX.toFixed(0)} · {scrubAoa.toFixed(1)}°
                </text>
              </g>
            ) : null}
          </g>
        ) : null}

        {/* X numeric ticks */}
        {!isCat
          ? [xMin, (xMin + xMax) / 2, xMax].map((x, i) => (
              <text
                key={`xt-${i}`}
                x={xScaleNum(x)}
                y={H - 28}
                textAnchor="middle"
                fill={CHART_THEME.axisLabel}
                fontSize={12}
                fontFamily={CHART_THEME.fontMono}
              >
                {formatTick(x)}
              </text>
            ))
          : null}

        <text
          x={pad.l + iw / 2}
          y={H - 8}
          textAnchor="middle"
          fill={CHART_THEME.mist}
          fontSize={11}
          fontFamily={CHART_THEME.fontUi}
        >
          {spec.xLabel}
        </text>

        {/* Legend */}
        {spec.series.map((s, si) => (
          <g
            key={`leg-${s.name}`}
            transform={`translate(${pad.l + si * 180}, ${12})`}
          >
            <rect
              width={12}
              height={12}
              fill={
                nSeries === 1
                  ? CHART_THEME.seriesActive
                  : SERIES_COLORS[si % SERIES_COLORS.length]
              }
            />
            <text
              x={18}
              y={10}
              fill={CHART_THEME.mist}
              fontSize={11}
              fontFamily={CHART_THEME.fontUi}
            >
              {truncate(s.name, 22)}
            </text>
          </g>
        ))}

        <defs>
          <clipPath id={`${uid}-plot`}>
            <rect x={pad.l} y={pad.t} width={iw} height={ih} />
          </clipPath>
        </defs>
      </svg>

      <figcaption className="mt-3 flex flex-col gap-1 border-t border-aero-signal/10 pt-3">
        <span className="font-ui text-[13px] tracking-wide text-aero-ivory/90">
          {spec.title}
        </span>
        {spec.annotation ? (
          <span className="font-serif text-sm text-aero-mist">
            {spec.annotation}
          </span>
        ) : null}
        <span className="font-ui text-[10px] tracking-[0.18em] text-aero-signal/45 uppercase">
          {spec.locator}
          {spec.factIds.length > 0 ? ` · ${spec.factIds.join(' · ')}` : ''}
          {spec.industrial
            ? ' · Sursă AM public · NU SAE 2020-36-0079'
            : ''}
        </span>
      </figcaption>
    </figure>
  )
}

function formatTick(n: number): string {
  if (Math.abs(n) >= 100) return n.toFixed(0)
  if (Math.abs(n) >= 10) return Number(n.toFixed(1)).toString()
  return Number(n.toFixed(2)).toString()
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

function buildLinePath(
  pts: Array<[number, number]>,
  xScale: (x: number) => number,
  yScale: (y: number) => number,
): string {
  return pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${xScale(x)} ${yScale(y)}`)
    .join(' ')
}

function buildStepPath(
  pts: Array<[number, number]>,
  xScale: (x: number) => number,
  yScale: (y: number) => number,
): string {
  if (pts.length === 0) return ''
  let d = `M ${xScale(pts[0]![0])} ${yScale(pts[0]![1])}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]!
    const cur = pts[i]!
    // Horizontal then vertical (step-after style at discontinuities)
    d += ` L ${xScale(cur[0])} ${yScale(prev[1])}`
    d += ` L ${xScale(cur[0])} ${yScale(cur[1])}`
  }
  return d
}
