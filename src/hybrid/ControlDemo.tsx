import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAeroStore } from '@/store/aeroStore'
import type { AeroMode } from '@/types/aero'
import {
  ACTUATORS,
  AEROBRAKE_TRIGGERS,
  DRS_TRIGGERS,
} from '@/data/vehicleConstants'

const MODES: { id: AeroMode; label: string }[] = [
  { id: 'STANDARD', label: 'Standard' },
  { id: 'DRS', label: 'DRS' },
  { id: 'AEROBRAKE', label: 'Aerobrake' },
  { id: 'MAXP', label: 'MaxP' },
]

/** Sole interactive control surface — S1 state machine. */
export function ControlDemo() {
  const {
    requestedMode,
    mode,
    speedKmh,
    throttlePct,
    brakePct,
    ayG,
    aoaDegEffective,
    splitter,
    dragN,
    frontDownforceN,
    rearDownforceN,
    balanceFront,
    aerobrakeForced,
    drsDenied,
    applyModeSetpoints,
    setSpeedKmh,
    setThrottlePct,
    setBrakePct,
    setAyG,
  } = useAeroStore()

  // Sensible demo set-point once (Table 3 anchor speed).
  useEffect(() => {
    applyModeSetpoints('STANDARD')
    setSpeedKmh(160)
    setThrottlePct(40)
    setBrakePct(0)
    setAyG(0)
  }, [applyModeSetpoints, setSpeedKmh, setThrottlePct, setBrakePct, setAyG])

  return (
    <div
      className="mt-8 w-full max-w-lg border-t border-aero-signal/15 pt-6"
      data-testid="control-demo"
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            data-testid={`mode-${m.id}`}
            onClick={() => applyModeSetpoints(m.id)}
            className={cn(
              'font-ui px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase transition-colors',
              requestedMode === m.id
                ? 'bg-aero-amr text-aero-ivory'
                : 'bg-transparent text-aero-mist hover:text-aero-ivory',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Slider
          testId="speed"
          label="Viteză"
          value={speedKmh}
          min={0}
          max={300}
          step={5}
          unit="km/h"
          onChange={setSpeedKmh}
        />
        <Slider
          testId="throttle"
          label="Accelerație"
          value={throttlePct}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={setThrottlePct}
        />
        <Slider
          testId="brake"
          label="Frână"
          value={brakePct}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={setBrakePct}
        />
        <Slider
          testId="ay"
          label="|ay|"
          value={ayG}
          min={0}
          max={1.5}
          step={0.05}
          unit="g"
          onChange={setAyG}
        />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-sm">
        <Metric label="Mod efectiv" value={mode} testId="metric-mode" />
        <Metric
          label="AOA"
          value={`${aoaDegEffective.toFixed(1)}°`}
          testId="metric-aoa"
        />
        <Metric label="Splitter" value={splitter} testId="metric-splitter" />
        <Metric
          label="Balance F"
          value={balanceFront === null ? '—' : balanceFront.toFixed(3)}
          testId="metric-balance"
        />
        <Metric
          label="Drag @160"
          value={dragN === null ? '—' : `${dragN} N`}
          testId="metric-drag"
        />
        <Metric
          label="DF F/R @160"
          value={
            frontDownforceN === null || rearDownforceN === null
              ? '—'
              : `${frontDownforceN}/${rearDownforceN} N`
          }
          testId="metric-df"
        />
      </dl>

      <p className="font-ui mt-5 text-[11px] leading-relaxed tracking-wide text-aero-mist">
        DRS: accel. ≥ {DRS_TRIGGERS.minThrottlePct}% · |ay| ≤{' '}
        {DRS_TRIGGERS.maxAbsAyG} g · rampă aripă {DRS_TRIGGERS.minSpeedKmh}–
        {DRS_TRIGGERS.wingRampEndKmh} km/h. Aerobrake: v ≥{' '}
        {AEROBRAKE_TRIGGERS.minSpeedKmh} km/h · frână ≥{' '}
        {AEROBRAKE_TRIGGERS.minBrakePct}% · AOA {ACTUATORS.aerobrakeAoaDeg}°.
        {aerobrakeForced ? ' · Aerobrake forțat.' : ''}
        {drsDenied ? ' · DRS refuzat (condiții).' : ''} Forțele CFD doar la
        ancora Table 3 (160 km/h).
      </p>
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  testId,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (n: number) => void
  testId: string
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-ui text-[11px] tracking-[0.16em] text-aero-mist uppercase">
          {label}
        </span>
        <span className="font-mono text-xs text-aero-ivory tabular-nums">
          {Number.isInteger(step) ? value : value.toFixed(2)} {unit}
        </span>
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

function Metric({
  label,
  value,
  testId,
}: {
  label: string
  value: string
  testId: string
}) {
  return (
    <div data-testid={testId}>
      <dt className="font-ui text-[10px] tracking-[0.16em] text-aero-mist uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-aero-ivory">{value}</dd>
    </div>
  )
}
