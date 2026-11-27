import { motion } from 'framer-motion'
import { Cpu, Gauge } from 'lucide-react'
import type { AeroMode } from '@/types/aero'
import { useAeroStore } from '@/store'
import { cn } from '@/lib/utils'
import { BorderBeam, GlassCard, ShineButton } from '@/ui/primitives'

const MODES: AeroMode[] = ['DRS', 'PASSIVE', 'MAXP', 'AEROBRAKE']

const MODE_ACTIVE: Record<AeroMode, string> = {
  DRS: 'border-aero-cyan/80 bg-cyan-950/45 text-aero-cyan shadow-[0_0_24px_rgb(0_240_255_/0.18)]',
  PASSIVE:
    'border-slate-400/40 bg-slate-900/45 text-aero-champagne shadow-[0_0_16px_rgb(148_163_184_/0.12)]',
  MAXP: 'border-aero-lime/80 bg-aero-amr-deep/55 text-aero-lime shadow-[0_0_24px_rgb(196_223_0_/0.2)]',
  AEROBRAKE:
    'border-aero-crimson/80 bg-red-950/45 text-aero-crimson shadow-[0_0_24px_rgb(255_59_48_/0.2)]',
}

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
    <GlassCard
      variant="strong"
      className="pointer-events-auto relative w-full max-w-lg overflow-hidden p-6"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <BorderBeam duration={9} />
      <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-aero-lime uppercase">
        <Cpu className="size-3.5" aria-hidden />
        Live control · Chapter 03 · Wind tunnel
      </p>
      <h3 className="font-display mt-2 text-2xl font-semibold tracking-[0.03em]">
        Mecatronic state machine
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-aero-muted">
        DRS / MAXP / AEROBRAKE / PASSIVE drive wing AOA and splitter. Streamline
        color follows mode. Brake &gt; 40% forces AEROBRAKE regardless of selection.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map((m) => {
          const active = mode === m
          return (
            <ShineButton
              key={m}
              data-testid={`mode-${m}`}
              onClick={() => selectMode(m)}
              active={active}
              className={cn(active && MODE_ACTIVE[m])}
            >
              {m}
            </ShineButton>
          )
        })}
      </div>

      <div className="mt-3.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-aero-muted">
        <Gauge className="size-3 text-aero-lime" aria-hidden />
        Effective <span className="text-aero-lime">{mode}</span>
        {requestedMode !== mode ? (
          <>
            {' '}
            · requested <span className="text-aero-crimson">{requestedMode}</span>
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
    </GlassCard>
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
