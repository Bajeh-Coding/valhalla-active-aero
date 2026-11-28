/**
 * Native dark-themed guide charts (Fig 4.1 / 6.1 / 7.1 / 8.1).
 * Obsidian ink + Aston Racing green — no white PNG backgrounds.
 */

import { useRef, type ReactNode } from 'react'
import { useChartDrawIn } from '@/lib/useChartDrawIn'
import type {
  GuideChartId,
  GuideChartSeries,
  GuideChartSpec,
} from '../data/guideCharts'
import { GUIDE_CHARTS } from '../data/guideCharts'

const VOID = '#05070a'
const INK = '#0b0e14'
const IVORY = '#f8f7f4'
const MIST = '#8b929a'
const AMR = '#005949'
const AMR_BRIGHT = '#0a7a62'
const LIME = '#c4df00'
const CYAN = '#2ec4b6'
const AMBER = '#e09a3e'
const GRID = 'rgb(232 228 220 / 0.08)'
const ZERO = 'rgb(232 228 220 / 0.28)'
const FONT = 'AstonMartinSans, sans-serif'

const COLOR: Record<GuideChartSeries['color'], string> = {
  cyan: CYAN,
  amber: AMBER,
  amr: AMR,
  mist: 'rgb(139 146 154 / 0.85)',
  lime: LIME,
}

interface GuideChartProps {
  id: GuideChartId
  caption: string
  chapterId: string
}

export function GuideChart({ id, caption, chapterId }: GuideChartProps) {
  const spec = GUIDE_CHARTS[id]
  const drawRef = useRef<HTMLElement>(null)
  useChartDrawIn(drawRef)

  return (
    <figure
      ref={drawRef}
      className="chapter-reveal mt-12 max-w-[1000px] border-t border-aero-ivory/10 pt-8"
      data-testid={`chapter-${chapterId}-figure`}
      data-chart-id={id}
    >
      <figcaption className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        {caption}
      </figcaption>
      <div className="overflow-hidden rounded-[2px] border border-aero-ivory/8 bg-aero-ink">
        {spec.kind === 'multi_line' ? (
          <MultiLineChart spec={spec} />
        ) : spec.kind === 'grouped_bar' ? (
          <GroupedBarChart spec={spec} />
        ) : spec.kind === 'area_line' ? (
          <AreaLineChart spec={spec} />
        ) : (
          <HorizontalBarChart spec={spec} />
        )}
      </div>
      {spec.annotation ? (
        <p className="font-ui mt-3 text-[10px] tracking-[0.18em] text-aero-signal/45 uppercase">
          {spec.annotation}
        </p>
      ) : null}
    </figure>
  )
}

function formatTick(n: number): string {
  if (Math.abs(n) >= 100) return n.toFixed(0)
  if (Math.abs(n) >= 10) return Number(n.toFixed(1)).toString()
  if (Math.abs(n) >= 1) return Number(n.toFixed(2)).toString()
  return Number(n.toFixed(4)).toString()
}

function dashAttr(dash: GuideChartSeries['dash']): string | undefined {
  if (dash === 'dashed') return '8 5'
  if (dash === 'dotted') return '2 4'
  return undefined
}

function Marker({
  kind,
  cx,
  cy,
  fill,
}: {
  kind: GuideChartSeries['marker']
  cx: number
  cy: number
  fill: string
}) {
  if (kind === 'square') {
    return <rect x={cx - 4.5} y={cy - 4.5} width={9} height={9} fill={fill} />
  }
  if (kind === 'triangle') {
    return (
      <polygon
        points={`${cx},${cy - 5.5} ${cx + 5.5},${cy + 4.5} ${cx - 5.5},${cy + 4.5}`}
        fill={fill}
      />
    )
  }
  return <circle cx={cx} cy={cy} r={4.5} fill={fill} />
}

function ChartFrame({
  W,
  H,
  title,
  children,
}: {
  W: number
  H: number
  title: string
  children: ReactNode
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width={W} height={H} fill={INK} />
      {children}
    </svg>
  )
}

/** Fig 4.1 — FL/FD vs AOA multi-series line. */
function MultiLineChart({ spec }: { spec: GuideChartSpec }) {
  const W = 960
  const H = 420
  const pad = { t: 48, r: 28, b: 64, l: 72 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const [xMin, xMax] = spec.xDomain ?? [0, 25]
  const [yMin, yMax] = spec.yDomain ?? [-400, 800]
  const xScale = (x: number) => pad.l + ((x - xMin) / (xMax - xMin)) * iw
  const yScale = (y: number) => pad.t + ih - ((y - yMin) / (yMax - yMin)) * ih
  const xTicks = [0, 5, 10, 15, 20, 25]
  const yTicks = [-400, -200, 0, 200, 400, 600, 800]

  return (
    <ChartFrame W={W} H={H} title={spec.title}>
      {yTicks.map((y) => (
        <line
          key={`yg-${y}`}
          x1={pad.l}
          x2={pad.l + iw}
          y1={yScale(y)}
          y2={yScale(y)}
          stroke={y === 0 ? ZERO : GRID}
          strokeWidth={y === 0 ? 1.25 : 1}
          strokeDasharray={y === 0 ? undefined : '3 4'}
        />
      ))}
      {xTicks.map((x) => (
        <line
          key={`xg-${x}`}
          x1={xScale(x)}
          x2={xScale(x)}
          y1={pad.t}
          y2={pad.t + ih}
          stroke={GRID}
          strokeDasharray="3 4"
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
      {xTicks.map((x) => (
        <text
          key={`xl-${x}`}
          x={xScale(x)}
          y={H - 32}
          textAnchor="middle"
          fill={MIST}
          fontSize={12}
          fontFamily={FONT}
        >
          {x}
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
        {spec.yLabel} [N]
      </text>
      <text
        x={pad.l + iw / 2}
        y={H - 10}
        textAnchor="middle"
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
      >
        {spec.xLabel} [°]
      </text>

      <text
        x={pad.l}
        y={22}
        fill={IVORY}
        fontSize={14}
        fontFamily={FONT}
      >
        {spec.title}
      </text>

      {spec.series.map((s, si) => {
        const color = COLOR[s.color]
        const pts = s.points.filter(
          (p): p is [number, number] => typeof p[0] === 'number',
        )
        const d = pts
          .map(
            ([x, y], i) =>
              `${i === 0 ? 'M' : 'L'} ${xScale(x)} ${yScale(y)}`,
          )
          .join(' ')
        return (
          <g key={s.name}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={2.25}
              strokeDasharray={dashAttr(s.dash)}
              strokeLinejoin="round"
              strokeLinecap="round"
              data-chart-line=""
            />
            {pts.map(([x, y]) => (
              <g key={`${s.name}-${x}`} data-chart-marker="">
                <Marker
                  kind={s.marker}
                  cx={xScale(x)}
                  cy={yScale(y)}
                  fill={color}
                />
              </g>
            ))}
            <g transform={`translate(${pad.l + si * 210}, ${pad.t + 8})`}>
              <line
                x1={0}
                x2={18}
                y1={0}
                y2={0}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={dashAttr(s.dash)}
              />
              <Marker kind={s.marker} cx={9} cy={0} fill={color} />
              <text x={26} y={4} fill={MIST} fontSize={11} fontFamily={FONT}>
                {s.shortName ?? s.name}
              </text>
            </g>
          </g>
        )
      })}
    </ChartFrame>
  )
}

/** Fig 6.1 — grouped lap-time bars. */
function GroupedBarChart({ spec }: { spec: GuideChartSpec }) {
  const W = 960
  const H = 400
  const pad = { t: 56, r: 24, b: 64, l: 64 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const cats = [
    ...new Set(spec.series.flatMap((s) => s.points.map(([x]) => String(x)))),
  ]
  const [yMin, yMax] = spec.yDomain ?? [105, 140]
  const yScale = (y: number) => pad.t + ih - ((y - yMin) / (yMax - yMin)) * ih
  const yTicks = [105, 110, 115, 120, 125, 130, 135, 140]
  const groupW = iw / Math.max(cats.length, 1)
  const nSeries = spec.series.length
  const barGap = 0.2
  const barW = (groupW * (1 - barGap)) / nSeries

  return (
    <ChartFrame W={W} H={H} title={spec.title}>
      {yTicks.map((y) => (
        <line
          key={`g-${y}`}
          x1={pad.l}
          x2={pad.l + iw}
          y1={yScale(y)}
          y2={yScale(y)}
          stroke={GRID}
          strokeDasharray="3 4"
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
        {spec.yLabel} [s]
      </text>
      <text x={pad.l} y={24} fill={IVORY} fontSize={14} fontFamily={FONT}>
        {spec.title}
      </text>
      <text x={pad.l} y={42} fill={AMR_BRIGHT} fontSize={12} fontFamily={FONT}>
        Câștig Uman Net: −2.55s
      </text>

      {cats.map((cat, ci) => {
        const cx = pad.l + ci * groupW + groupW / 2
        return (
          <g key={cat}>
            {spec.series.map((s, si) => {
              const pt = s.points.find(([x]) => String(x) === cat)
              if (!pt) return null
              const y = pt[1]
              const x0 =
                pad.l + ci * groupW + groupW * (barGap / 2) + si * barW
              const top = yScale(y)
              const bh = Math.max(1.5, yScale(yMin) - top)
              const fill = COLOR[s.color]
              return (
                <g key={`${cat}-${s.name}`}>
                  <rect
                    x={x0}
                    y={top}
                    width={Math.max(2, barW - 3)}
                    height={bh}
                    fill={fill}
                    data-chart-bar=""
                  >
                    <title>
                      {s.name}: {y} s
                    </title>
                  </rect>
                  <text
                    x={x0 + Math.max(2, barW - 3) / 2}
                    y={top - 6}
                    textAnchor="middle"
                    fill={IVORY}
                    fontSize={11}
                    fontFamily={FONT}
                    data-chart-label=""
                  >
                    {y.toFixed(2)}
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
              {cat}
            </text>
          </g>
        )
      })}

      {spec.series.map((s, si) => (
        <g
          key={`leg-${s.name}`}
          transform={`translate(${pad.l + 420 + si * 220}, 18)`}
        >
          <rect width={12} height={12} fill={COLOR[s.color]} />
          <text x={18} y={10} fill={MIST} fontSize={11} fontFamily={FONT}>
            {s.shortName ?? s.name}
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
    </ChartFrame>
  )
}

/** Fig 7.1 — downforce area/line with reference. */
function AreaLineChart({ spec }: { spec: GuideChartSpec }) {
  const W = 960
  const H = 400
  const pad = { t: 48, r: 36, b: 64, l: 64 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const [xMin, xMax] = spec.xDomain ?? [100, 350]
  const [yMin, yMax] = spec.yDomain ?? [0, 600]
  const xScale = (x: number) => pad.l + ((x - xMin) / (xMax - xMin)) * iw
  const yScale = (y: number) => pad.t + ih - ((y - yMin) / (yMax - yMin)) * ih
  const xTicks = [100, 150, 200, 240, 300, 350]
  const yTicks = [0, 100, 200, 300, 400, 500, 600]
  const s = spec.series[0]!
  const pts = s.points.filter(
    (p): p is [number, number] => typeof p[0] === 'number',
  )
  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${xScale(x)} ${yScale(y)}`)
    .join(' ')
  const areaPath =
    pts.length > 0
      ? `${linePath} L ${xScale(pts[pts.length - 1]![0])} ${yScale(0)} L ${xScale(pts[0]![0])} ${yScale(0)} Z`
      : ''
  const color = COLOR[s.color]

  return (
    <ChartFrame W={W} H={H} title={spec.title}>
      <defs>
        <linearGradient id="df-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={AMR} stopOpacity="0.45" />
          <stop offset="100%" stopColor={AMR} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {yTicks.map((y) => (
        <line
          key={`yg-${y}`}
          x1={pad.l}
          x2={pad.l + iw}
          y1={yScale(y)}
          y2={yScale(y)}
          stroke={GRID}
          strokeDasharray="3 4"
        />
      ))}
      {xTicks.map((x) => (
        <line
          key={`xg-${x}`}
          x1={xScale(x)}
          x2={xScale(x)}
          y1={pad.t}
          y2={pad.t + ih}
          stroke={GRID}
          strokeDasharray="3 4"
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
      {xTicks.map((x) => (
        <text
          key={`xl-${x}`}
          x={xScale(x)}
          y={H - 32}
          textAnchor="middle"
          fill={MIST}
          fontSize={12}
          fontFamily={FONT}
        >
          {x}
        </text>
      ))}

      {spec.refX ? (
        <g>
          <line
            x1={xScale(spec.refX.value)}
            x2={xScale(spec.refX.value)}
            y1={pad.t}
            y2={pad.t + ih}
            stroke="#c45c5c"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
        </g>
      ) : null}

      {areaPath ? (
        <path d={areaPath} fill="url(#df-fill)" data-chart-area="" />
      ) : null}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        data-chart-line=""
      />
      {pts.map(([x, y]) => (
        <circle
          key={`m-${x}`}
          cx={xScale(x)}
          cy={yScale(y)}
          r={5}
          fill={color}
          stroke={VOID}
          strokeWidth={1.5}
          data-chart-marker=""
        />
      ))}

      {spec.callout ? (
        <g data-chart-label="">
          <line
            x1={xScale(spec.callout.x)}
            y1={yScale(spec.callout.y) - 8}
            x2={xScale(spec.callout.x) - 28}
            y2={yScale(spec.callout.y) - 36}
            stroke={MIST}
            strokeWidth={1}
          />
          <text
            x={xScale(spec.callout.x) - 32}
            y={yScale(spec.callout.y) - 40}
            textAnchor="end"
            fill={IVORY}
            fontSize={11}
            fontFamily={FONT}
          >
            {spec.callout.label}
          </text>
        </g>
      ) : null}

      <text x={pad.l} y={24} fill={IVORY} fontSize={14} fontFamily={FONT}>
        {spec.title}
      </text>
      {spec.refX ? (
        <g transform={`translate(${pad.l}, ${pad.t + 14})`}>
          <line
            x1={0}
            x2={18}
            y1={0}
            y2={0}
            stroke="#c45c5c"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <text x={24} y={4} fill={MIST} fontSize={11} fontFamily={FONT}>
            {spec.refX.label}
          </text>
        </g>
      ) : null}

      <text
        x={18}
        y={pad.t + ih / 2}
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
        transform={`rotate(-90 18 ${pad.t + ih / 2})`}
        textAnchor="middle"
      >
        {spec.yLabel} [kg]
      </text>
      <text
        x={pad.l + iw / 2}
        y={H - 10}
        textAnchor="middle"
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
      >
        {spec.xLabel} [km/h]
      </text>
    </ChartFrame>
  )
}

/** Fig 8.1 — horizontal timing bars. */
function HorizontalBarChart({ spec }: { spec: GuideChartSpec }) {
  const W = 960
  const H = 280
  const pad = { t: 56, r: 100, b: 56, l: 220 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const [xMin, xMax] = spec.xDomain ?? [0, 2.5]
  const xScale = (x: number) => pad.l + ((x - xMin) / (xMax - xMin)) * iw
  const xTicks = [0, 0.5, 1, 1.5, 2, 2.5]
  const rows = spec.series[0]?.points ?? []
  const rowH = ih / Math.max(rows.length, 1)

  return (
    <ChartFrame W={W} H={H} title={spec.title}>
      {xTicks.map((x) => (
        <line
          key={`xg-${x}`}
          x1={xScale(x)}
          x2={xScale(x)}
          y1={pad.t}
          y2={pad.t + ih}
          stroke={GRID}
          strokeDasharray="3 4"
        />
      ))}
      {xTicks.map((x) => (
        <text
          key={`xl-${x}`}
          x={xScale(x)}
          y={H - 28}
          textAnchor="middle"
          fill={MIST}
          fontSize={12}
          fontFamily={FONT}
        >
          {x.toFixed(1)}
        </text>
      ))}

      <text x={pad.l} y={24} fill={IVORY} fontSize={14} fontFamily={FONT}>
        {spec.title}
      </text>
      <text x={pad.l} y={42} fill={AMR_BRIGHT} fontSize={12} fontFamily={FONT}>
        26.58× mai rapid
      </text>

      {rows.map(([label, value], i) => {
        const cy = pad.t + i * rowH + rowH / 2
        const barH = Math.min(36, rowH * 0.55)
        const isFast = typeof value === 'number' && value < 1
        const fill = isFast ? AMR : 'rgb(139 146 154 / 0.7)'
        const w = Math.max(2, xScale(value) - pad.l)
        return (
          <g key={String(label)}>
            <text
              x={pad.l - 14}
              y={cy + 4}
              textAnchor="end"
              fill={IVORY}
              fontSize={13}
              fontFamily={FONT}
            >
              {String(label)}
            </text>
            <rect
              x={pad.l}
              y={cy - barH / 2}
              width={w}
              height={barH}
              fill={fill}
              rx={1}
              data-chart-bar=""
              data-bar-dir="x"
            >
              <title>
                {String(label)}: {value} ms
              </title>
            </rect>
            <text
              x={pad.l + w + 10}
              y={cy + 4}
              fill={IVORY}
              fontSize={13}
              fontFamily={FONT}
              data-chart-label=""
            >
              {typeof value === 'number' ? value.toFixed(4) : value} ms
            </text>
          </g>
        )
      })}

      <text
        x={pad.l + iw / 2}
        y={H - 8}
        textAnchor="middle"
        fill={MIST}
        fontSize={11}
        fontFamily={FONT}
      >
        {spec.xLabel} [ms]
      </text>
    </ChartFrame>
  )
}
