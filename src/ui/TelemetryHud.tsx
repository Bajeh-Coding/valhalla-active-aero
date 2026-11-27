import { AnimatePresence, motion } from 'framer-motion'
import { useAeroStore } from '@/store'
import { useScrollStore } from '@/scene'

/**
 * Discreet corner telemetry — fades in from chapter 3 (control) pin onward.
 * Single compact cluster; no glass card stacks or metric grids.
 */
export function TelemetryHud() {
  const aoaDeg = useAeroStore((s) => s.aoaDegEffective)
  const speedKmh = useAeroStore((s) => s.speedKmh)
  const frontDownforceN = useAeroStore((s) => s.frontDownforceN)
  const rearDownforceN = useAeroStore((s) => s.rearDownforceN)
  const dragN = useAeroStore((s) => s.dragN)
  const balanceFront = useAeroStore((s) => s.balanceFront)
  const throttlePct = useAeroStore((s) => s.throttlePct)
  const brakePct = useAeroStore((s) => s.brakePct)
  const mode = useAeroStore((s) => s.mode)
  const aerobrakeForced = useAeroStore((s) => s.aerobrakeForced)
  const totalDf =
    frontDownforceN != null && rearDownforceN != null
      ? frontDownforceN + rearDownforceN
      : null
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const chapter3Pinned = useScrollStore((s) => s.chapter3Pinned)

  const visible = chapterIndex >= 2 || chapter3Pinned

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          key="telemetry-hud"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed top-0 right-0 z-30 p-4 md:p-6"
          aria-label="Telemetry HUD"
        >
          <div className="min-w-[11.5rem] border-l border-aero-lime/25 bg-aero-bg/55 py-3 pl-4 backdrop-blur-md">
            <p className="font-mono text-[9px] tracking-[0.28em] text-aero-muted uppercase">
              Telemetrie A3 · Table 3 @160
            </p>
            <p
              className={`mt-2 font-mono text-xs tracking-[0.18em] uppercase ${
                aerobrakeForced ? 'text-aero-crimson' : 'text-aero-lime'
              }`}
            >
              {mode}
            </p>
            <dl className="mt-3 space-y-1.5 font-mono text-[11px] tabular-nums text-aero-champagne/90">
              <Row label="AOA" value={`${aoaDeg.toFixed(1)}°`} />
              <Row label="SPD" value={`${speedKmh.toFixed(0)} km/h`} />
              <Row
                label="BAL"
                value={
                  balanceFront != null ? balanceFront.toFixed(3) : '—'
                }
              />
              <Row
                label="DF"
                value={totalDf != null ? `${formatForce(totalDf)} N` : '—'}
              />
              <Row
                label="DRG"
                value={dragN != null ? `${formatForce(dragN)} N` : '—'}
              />
              <Row label="THR" value={`${throttlePct.toFixed(0)}%`} />
              <Row label="BRK" value={`${brakePct.toFixed(0)}%`} />
            </dl>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-[9px] tracking-wider text-aero-muted uppercase">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function formatForce(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(2) + 'k'
  return n.toFixed(0)
}
