import { motion } from 'framer-motion'
import type { AeroMode } from '@/types/aero'
import { PRESENTATION_COPY } from '@/data/presentationCopy'
import { useAeroStore } from '@/store'
import { cn } from '@/lib/utils'

const MODES: AeroMode[] = ['DRS', 'PASSIVE', 'MAXP', 'AEROBRAKE']

const MODE_ACTIVE: Record<AeroMode, string> = {
  DRS: 'border-aero-cyan/60 text-aero-cyan',
  PASSIVE: 'border-aero-champagne/40 text-aero-champagne',
  MAXP: 'border-aero-lime/70 text-aero-lime',
  AEROBRAKE: 'border-aero-crimson/60 text-aero-crimson',
}

/** Chapter 3 live aero controls — interaction surface only, no neon chrome. */
export function ControlDashboard() {
  const mode = useAeroStore((s) => s.mode)
  const requestedMode = useAeroStore((s) => s.requestedMode)
  const speedKmh = useAeroStore((s) => s.speedKmh)
  const throttlePct = useAeroStore((s) => s.throttlePct)
  const brakePct = useAeroStore((s) => s.brakePct)
  const aerobrakeForced = useAeroStore((s) => s.aerobrakeForced)
  const drsDenied = useAeroStore((s) => s.drsDenied)
  const splitter = useAeroStore((s) => s.splitter)
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const applyModeSetpoints = useAeroStore((s) => s.applyModeSetpoints)
  const setSpeedKmh = useAeroStore((s) => s.setSpeedKmh)
  const setThrottlePct = useAeroStore((s) => s.setThrottlePct)
  const setBrakePct = useAeroStore((s) => s.setBrakePct)

  function selectMode(m: AeroMode) {
    applyModeSetpoints(m)
    if (m === 'DRS') {
      setSpeedKmh(Math.max(speedKmh, 120))
      setThrottlePct(Math.max(throttlePct, 75))
      setBrakePct(0)
    } else if (m === 'AEROBRAKE') {
      setBrakePct(Math.max(brakePct, 45))
    } else {
      setBrakePct(0)
    }
  }

  return (
    <motion.div
      className="pointer-events-auto w-full max-w-md border border-white/10 bg-aero-bg/70 p-6 backdrop-blur-xl"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="font-display text-2xl font-semibold tracking-[0.04em]">
        {PRESENTATION_COPY.control.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-aero-muted">
        {PRESENTATION_COPY.control.body}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                  : 'border-white/10 text-aero-muted hover:border-white/25 hover:text-aero-champagne',
              )}
            >
              {m}
            </button>
          )
        })}
      </div>

      <p className="mt-3 font-mono text-[10px] text-aero-muted">
        Efectiv <span className="text-aero-lime">{mode}</span>
        {requestedMode !== mode ? (
          <>
            {' '}
            · cerut <span className="text-aero-crimson">{requestedMode}</span>
          </>
        ) : null}
        {aerobrakeForced ? ' · override frână' : null}
        {drsDenied ? ' · DRS refuzat' : null}
        {' · '}
        AOA {aoaDeg.toFixed(1)}° · splitter {splitter}
      </p>

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
        warn={brakePct > 40}
      />
    </motion.div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  testId,
  warn,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (n: number) => void
  testId: string
  warn?: boolean
}) {
  return (
    <label className="mt-5 block">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase">
        <span className={warn ? 'text-aero-crimson' : 'text-aero-muted'}>{label}</span>
        <motion.span
          key={value.toFixed(0)}
          initial={{ opacity: 0.4, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="tabular-nums text-aero-text"
        >
          {value.toFixed(0)} {unit}
        </motion.span>
      </div>
      <input
        data-testid={testId}
        className="aero-range w-full"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}
