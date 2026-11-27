import { motion } from 'framer-motion'
import { useAeroStore } from '@/store'
import { useScrollStore } from '@/scene'

/** Fixed luxury glass telemetry HUD — master-spec §4. */
export function TelemetryHud() {
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const speedKmh = useAeroStore((s) => s.speedKmh)
  const downforceN = useAeroStore((s) => s.downforceN)
  const dragN = useAeroStore((s) => s.dragN)
  const clOverCd = useAeroStore((s) => s.clOverCd)
  const throttlePct = useAeroStore((s) => s.throttlePct)
  const brakePct = useAeroStore((s) => s.brakePct)
  const mode = useAeroStore((s) => s.mode)
  const controlLoopHz = useAeroStore((s) => s.controlLoopHz)
  const aerobrakeForced = useAeroStore((s) => s.aerobrakeForced)
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const progress = useScrollStore((s) => s.progress)
  const chapter3Pinned = useScrollStore((s) => s.chapter3Pinned)

  const aoaPct = Math.min(100, Math.max(0, (aoaDeg / 25) * 100))

  return (
    <motion.aside
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed top-0 right-0 left-0 z-30 flex justify-end p-3 md:p-5"
      aria-label="Telemetry HUD"
    >
      <div className="glass-panel pointer-events-none w-full max-w-md rounded-xl px-4 py-3.5 md:max-w-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] tracking-[0.22em] text-aero-lime uppercase">
            System online · {controlLoopHz} Hz
          </div>
          <div className="font-mono text-[10px] text-aero-muted">
            CH {chapterIndex + 1}/5 · {(progress * 100).toFixed(0)}%
            {chapter3Pinned ? ' · PIN' : ''}
          </div>
        </div>

        <div className="luxury-rule my-3" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric
            label="Mode"
            value={mode}
            accent={aerobrakeForced ? 'crimson' : 'lime'}
          />
          <Metric label="Speed" value={`${speedKmh.toFixed(0)}`} unit="km/h" accent="cyan" />
          <Metric label="C_L / C_D" value={clOverCd.toFixed(2)} accent="cyan" />
          <Metric label="Downforce" value={formatForce(downforceN)} unit="N" accent="cyan" />
          <Metric label="Drag" value={formatForce(dragN)} unit="N" accent="crimson" />
          <div>
            <div className="font-mono text-[9px] tracking-wider text-aero-muted uppercase">
              AOA 0–25°
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-lg font-medium text-aero-cyan tabular-nums">
                {aoaDeg.toFixed(1)}°
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-aero-bg-deep">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-aero-cyan to-aero-lime"
                animate={{ width: `${aoaPct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-3">
          <Pedal label="Throttle" pct={throttlePct} color="bg-aero-lime" />
          <Pedal label="Brake" pct={brakePct} color="bg-aero-crimson" />
        </div>
      </div>
    </motion.aside>
  )
}

function Metric({
  label,
  value,
  unit,
  accent,
}: {
  label: string
  value: string
  unit?: string
  accent: 'cyan' | 'lime' | 'crimson'
}) {
  const color =
    accent === 'cyan'
      ? 'text-aero-cyan'
      : accent === 'lime'
        ? 'text-aero-lime'
        : 'text-aero-crimson'
  return (
    <div>
      <div className="font-mono text-[9px] tracking-wider text-aero-muted uppercase">
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className={`font-mono text-lg font-medium tabular-nums ${color}`}>
          {value}
        </span>
        {unit ? (
          <span className="font-mono text-[10px] text-aero-muted">{unit}</span>
        ) : null}
      </div>
    </div>
  )
}

function Pedal({
  label,
  pct,
  color,
}: {
  label: string
  pct: number
  color: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[9px] tracking-wider text-aero-muted uppercase">
        <span>{label}</span>
        <span className="tabular-nums text-aero-text">{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-aero-bg-deep">
        <motion.div
          className={`h-full rounded-full ${color}`}
          animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        />
      </div>
    </div>
  )
}

function formatForce(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(2) + 'k'
  return n.toFixed(0)
}
