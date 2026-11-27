import { cn } from '@/lib/utils'

interface Bar {
  label: string
  seconds: number
  highlight?: boolean
}

interface ResultsBarsProps {
  bars: readonly Bar[]
}

/** Simplified figure — one comparison axis, not a dense table. */
export function ResultsBars({ bars }: ResultsBarsProps) {
  const max = Math.max(...bars.map((b) => b.seconds))
  const min = Math.min(...bars.map((b) => b.seconds))
  const span = Math.max(max - min, 0.001)

  return (
    <div
      className="mt-10 w-full max-w-xl space-y-3"
      data-testid="results-bars"
      role="img"
      aria-label="Comparație timp pe tur GRIP"
    >
      {bars.map((bar) => {
        // Invert: faster (lower s) → longer visual bar toward left of delta scale.
        const gain = (max - bar.seconds) / span
        const widthPct = 28 + gain * 72
        return (
          <div key={bar.label} className="grid grid-cols-[7.5rem_1fr_4.5rem] items-center gap-3">
            <span
              className={cn(
                'font-ui text-right text-[11px] tracking-wide',
                bar.highlight ? 'text-aero-lime' : 'text-aero-mist',
              )}
            >
              {bar.label}
            </span>
            <div className="h-px bg-aero-signal/10">
              <div
                className={cn(
                  'h-px transition-[width] duration-700',
                  bar.highlight ? 'bg-aero-lime' : 'bg-aero-signal/45',
                )}
                style={{ width: `${widthPct}%` }}
              />
            </div>
            <span
              className={cn(
                'font-mono text-right text-sm tabular-nums',
                bar.highlight ? 'text-aero-ivory' : 'text-aero-mist',
              )}
            >
              {bar.seconds.toFixed(3)}
              <span className="ml-1 text-[10px] text-aero-mist">s</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
