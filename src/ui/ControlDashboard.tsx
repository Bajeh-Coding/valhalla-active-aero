import { motion } from 'framer-motion'
import type { AeroMode } from '@/types/aero'
import { useAeroStore } from '@/store'
import { cn } from '@/lib/utils'

const MODES: AeroMode[] = ['DRS', 'STANDARD', 'MAXP', 'AEROBRAKE']

/** Sparse mode accent — AMR/lime rare; no cyan/crimson neon. */
const MODE_ACTIVE: Record<AeroMode, string> = {
  DRS: 'border-aero-mist/55 text-aero-champagne',
  STANDARD: 'border-aero-amr/70 text-aero-ivory',
  MAXP: 'border-aero-lime/60 text-aero-lime',
  AEROBRAKE: 'border-aero-signal/50 text-aero-signal',
}

/**
 * A3 Control — sole panel-like surface.
 * Interaction only; no glass stacks / MetricChip grids / neon chrome.
 */
export function ControlDashboard() {
  const mode = useAeroStore((s) => s.mode)
  const requestedMode = useAeroStore((s) => s.requestedMode)
  const speedKmh = useAeroStore((s) => s.speedKmh)
  const throttlePct = useAeroStore((s) => s.throttlePct)
  const brakePct = useAeroStore((s) => s.brakePct)
  const ayG = useAeroStore((s) => s.ayG)
  const aerobrakeForced = useAeroStore((s) => s.aerobrakeForced)
  const drsDenied = useAeroStore((s) => s.drsDenied)
  const splitter = useAeroStore((s) => s.splitter)
  const aoaDeg = useAeroStore((s) => s.aoaDegEffective)
  const applyModeSetpoints = useAeroStore((s) => s.applyModeSetpoints)
  const setSpeedKmh = useAeroStore((s) => s.setSpeedKmh)
  const setThrottlePct = useAeroStore((s) => s.setThrottlePct)
  const setBrakePct = useAeroStore((s) => s.setBrakePct)
  const setAyG = useAeroStore((s) => s.setAyG)

  function selectMode(m: AeroMode) {
    applyModeSetpoints(m)
    if (m === 'DRS') {
      setSpeedKmh(Math.max(speedKmh, 120))
      setThrottlePct(Math.max(throttlePct, 75))
      setBrakePct(0)
      setAyG(Math.min(ayG, 0.8))
    } else if (m === 'AEROBRAKE') {
      setBrakePct(Math.max(brakePct, 45))
      setAyG(Math.min(ayG, 0.8))
    } else {
      setBrakePct(0)
    }
  }

  return (
    <motion.div
      data-testid="a3-control-panel"
      className="w-full max-w-md border border-aero-signal/12 bg-aero-ink/90 p-5 md:p-6"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map((m) => {
          const active = mode === m
          return (
            <button
              key={m}
              type="button"
              data-testid={`mode-${m}`}
              onClick={() => selectMode(m)}
              className={cn(
                'border bg-transparent px-2 py-2.5 font-mono text-[11px] tracking-[0.12em] transition-colors',
                active
                  ? MODE_ACTIVE[m]
                  : 'border-aero-signal/12 text-aero-mist hover:border-aero-signal/28 hover:text-aero-champagne',
              )}
            >
              {m}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-wide text-aero-mist">
        <span data-testid="telemetry-mode">
          Efectiv{' '}
          <span className="text-aero-ivory">{mode}</span>
          {requestedMode !== mode ? (
            <>
              {' '}
              · cerut <span className="text-aero-champagne/80">{requestedMode}</span>
            </>
          ) : null}
          {aerobrakeForced ? ' · override frână' : null}
          {drsDenied ? ' · DRS refuzat' : null}
        </span>
        <span data-testid="telemetry-aoa">AOA {aoaDeg.toFixed(1)}°</span>
        <span data-testid="telemetry-splitter">splitter {splitter}</span>
      </div>

      <Slider
        label="Viteză"
        value={speedKmh}
        min={0}
        max={350}
        unit="km/h"
        onChange={setSpeedKmh}
        testId="speed-slider"
      />
      <Slider
        label="Accelerație"
        value={throttlePct}
        min={0}
        max={100}
        unit="%"
        onChange={setThrottlePct}
        testId="throttle-slider"
      />
      <Slider
        label="Frână"
        value={brakePct}
        min={0}
        max={100}
        unit="%"
        onChange={setBrakePct}
        testId="brake-slider"
        accent={brakePct >= 40}
      />
      <Slider
        label="|ay|"
        value={ayG}
        min={0}
        max={1.5}
        step={0.05}
        unit="g"
        onChange={setAyG}
        testId="ay-slider"
        accent={ayG > 1}
      />
    </motion.div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  testId,
  accent,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit: string
  onChange: (n: number) => void
  testId: string
  accent?: boolean
}) {
  const display =
    step < 1 ? value.toFixed(2) : value.toFixed(0)
  return (
    <label className="mt-5 block">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase">
        <span className={accent ? 'text-aero-lime' : 'text-aero-mist'}>{label}</span>
        <motion.span
          key={display}
          initial={{ opacity: 0.4, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="tabular-nums text-aero-ivory"
        >
          {display} {unit}
        </motion.span>
      </div>
      <input
        data-testid={testId}
        className="aero-range w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}
