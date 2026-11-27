import { motion } from 'framer-motion'
import type { AeroMode } from '@/types/aero'
import { useAeroStore } from '@/store'

const MODES: AeroMode[] = ['DRS', 'PASSIVE', 'MAXP', 'AEROBRAKE']

/** Chapter 3 live aero control simulator — wired to Zustand store. */
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="glass-panel pointer-events-auto w-full max-w-lg rounded-xl p-5"
    >
      <p className="font-mono text-[10px] tracking-[0.2em] text-aero-cyan uppercase">
        Live control · Chapter 3
      </p>
      <h3 className="font-display mt-2 text-xl font-semibold tracking-tight">
        Mecatronic state machine
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-aero-muted">
        Mode buttons drive wing AOA and splitter. Brake &gt; 40% forces AEROBRAKE
        regardless of selection.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map((m) => {
          const active = mode === m
          return (
            <button
              key={m}
              type="button"
              data-testid={`mode-${m}`}
              onClick={() => selectMode(m)}
              className={`rounded-md border px-2 py-2 font-mono text-[11px] tracking-wide transition ${
                active
                  ? 'border-aero-cyan bg-cyan-950/50 text-aero-cyan shadow-[0_0_20px_rgb(34_211_238_/0.15)]'
                  : 'border-aero-border text-aero-muted hover:border-slate-600 hover:text-aero-text'
              }`}
            >
              {m}
            </button>
          )
        })}
      </div>

      <div className="mt-3 font-mono text-[10px] text-aero-muted">
        Effective <span className="text-aero-emerald">{mode}</span>
        {requestedMode !== mode ? (
          <>
            {' '}
            · requested <span className="text-aero-amber">{requestedMode}</span>
          </>
        ) : null}
        {aerobrakeForced ? ' · brake override' : null}
        {drsDenied ? ' · DRS denied' : null}
        {' · '}
        AOA {aoaDeg.toFixed(1)}° · splitter {splitter}
      </div>

      <Slider
        label="Speed"
        value={speedKmh}
        min={0}
        max={350}
        unit="km/h"
        onChange={setSpeedKmh}
        testId="speed-slider"
      />
      <Slider
        label="Throttle"
        value={throttlePct}
        min={0}
        max={100}
        unit="%"
        onChange={setThrottlePct}
        testId="throttle-slider"
      />
      <Slider
        label="Brake"
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
    <label className="mt-4 block">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase">
        <span className={warn ? 'text-aero-amber' : 'text-aero-muted'}>{label}</span>
        <span className="tabular-nums text-aero-text">
          {value.toFixed(0)} {unit}
        </span>
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
