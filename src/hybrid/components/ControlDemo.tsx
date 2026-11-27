import { cn } from '@/lib/utils'
import { useAeroStore } from '@/store/aeroStore'
import type { AeroMode } from '@/types/aero'
import { ACTUATORS, AEROBRAKE_TRIGGERS, DRS_TRIGGERS } from '@/data/vehicleConstants'

const MODES: { id: AeroMode; label: string }[] = [
  { id: 'STANDARD', label: 'Standard' },
  { id: 'DRS', label: 'DRS' },
  { id: 'AEROBRAKE', label: 'Aerobrake' },
  { id: 'MAXP', label: 'MaxP' },
]

/** Paper state machine demo — sole interactive control surface. */
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

  return (
    <div
      className="mt-6 w-full max-w-xl border-t border-aero-signal/15 pt-5"
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
                : 'text-aero-mist hover:text-aero-ivory',
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

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        <Metric testId="metric-mode" label="Mode" value={mode} />
        <Metric
          testId="metric-aoa"
          label="AOA"
          value={`${aoaDegEffective.toFixed(1)}°`}
        />
        <Metric testId="metric-splitter" label="Splitter" value={splitter} />
        <Metric
          testId="metric-drag"
          label="Drag"
          value={dragN != null ? `${dragN} N` : '— (@160)'}
        />
        <Metric
          testId="metric-fdf"
          label="Front DF"
          value={frontDownforceN != null ? `${frontDownforceN} N` : '—'}
        />
        <Metric
          testId="metric-rdf"
          label="Rear DF"
          value={rearDownforceN != null ? `${rearDownforceN} N` : '—'}
        />
      </dl>

      <p className="font-ui mt-4 text-[10px] leading-relaxed tracking-wide text-aero-mist/70">
        Gates: DRS throttle ≥{DRS_TRIGGERS.minThrottlePct}% · |ay| ≤
        {DRS_TRIGGERS.maxAbsAyG} g · Aerobrake brake ≥
        {AEROBRAKE_TRIGGERS.minBrakePct}% · AOA ∈ [
        {ACTUATORS.aoaMinDeg}°, {ACTUATORS.aoaMaxDeg}°]
        {aerobrakeForced ? ' · AEROBRAKE forced' : ''}
        {drsDenied ? ' · DRS denied' : ''}
        {balanceFront != null
          ? ` · balance ${balanceFront.toFixed(3)}`
          : ''}
      </p>
    </div>
  )
}

function Slider({
  testId,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  testId: string
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="font-ui mb-1.5 flex justify-between text-[10px] tracking-[0.16em] text-aero-mist uppercase">
        <span>{label}</span>
        <span className="font-mono text-aero-ivory/80">
          {value}
          {unit}
        </span>
      </span>
      <input
        data-testid={testId}
        type="range"
        className="aero-range w-full"
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
  testId,
  label,
  value,
}: {
  testId: string
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="font-ui text-[9px] tracking-[0.18em] text-aero-mist/70 uppercase">
        {label}
      </dt>
      <dd
        data-testid={testId}
        className="font-mono mt-0.5 text-sm text-aero-ivory"
      >
        {value}
      </dd>
    </div>
  )
}
