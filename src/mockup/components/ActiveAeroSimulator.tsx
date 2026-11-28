import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  ACTUATORS,
  AEROBRAKE_TRIGGERS,
  DRS_TRIGGERS,
  TABLE3_FORCES,
  TABLE3_SPEED_KMH,
} from '@/data/vehicleConstants'
import { aeroPhysics } from '@/math/aeroPhysics'
import { useAeroStore } from '@/store/aeroStore'
import type { AeroMode } from '@/types/aero'
import {
  educationalIndices,
  scheduleAoaPoints,
} from '../lib/educationalAero'
import { Valhalla25D } from './Valhalla25D'

const PROGRAMS: { id: AeroMode; label: string; hint: string }[] = [
  {
    id: 'DRS',
    label: 'DRS',
    hint: `Throttle ≥${DRS_TRIGGERS.minThrottlePct}% · |ay|≤${DRS_TRIGGERS.maxAbsAyG} g`,
  },
  {
    id: 'AEROBRAKE',
    label: 'Aerobrake',
    hint: `Brake ≥${AEROBRAKE_TRIGGERS.minBrakePct}% · v≥${AEROBRAKE_TRIGGERS.minSpeedKmh}`,
  },
  {
    id: 'MAXP',
    label: 'MaxP',
    hint: 'AOA schedule 0° / 3° / 4.5° by speed',
  },
  {
    id: 'STANDARD',
    label: 'Standard',
    hint: `AOA ${ACTUATORS.standardAoaDeg}° · splitter CLOSED`,
  },
]

/**
 * Cap 09 — interactive Active Aero simulator (SAE state machine + educational indices).
 * Absolute forces only at Table 3 @160 km/h; otherwise relative indices, not OEM N.
 */
export function ActiveAeroSimulator() {
  const {
    requestedMode,
    mode,
    speedKmh,
    throttlePct,
    brakePct,
    ayG,
    aoaDeg,
    aoaDegEffective,
    splitter,
    dragN,
    frontDownforceN,
    rearDownforceN,
    balanceFront,
    aerobrakeForced,
    drsDenied,
    citations,
    applyModeSetpoints,
    setSpeedKmh,
    setThrottlePct,
    setBrakePct,
    setAyG,
    setAoaDeg,
  } = useAeroStore()

  const edu = useMemo(
    () => educationalIndices(aoaDegEffective, splitter, mode),
    [aoaDegEffective, splitter, mode],
  )

  const schedule = useMemo(
    () =>
      scheduleAoaPoints(
        requestedMode,
        aeroPhysics.maxpAoaDeg,
        aeroPhysics.drsWingAoaDeg,
      ),
    [requestedMode],
  )

  const showTable3 = speedKmh === TABLE3_SPEED_KMH
  const showMaxpAoa =
    requestedMode === 'MAXP' && mode === 'MAXP' && !aerobrakeForced
  const showThrottle = requestedMode === 'DRS' || mode === 'DRS'
  const showBrake =
    requestedMode === 'AEROBRAKE' || mode === 'AEROBRAKE' || aerobrakeForced

  const onSpeedChange = (v: number) => {
    setSpeedKmh(v)
    // Keep MaxP AOA on the paper schedule unless the user is about to override
    // via the dedicated slider (that calls setAoaDeg directly).
    if (requestedMode === 'MAXP' && !aerobrakeForced) {
      setAoaDeg(aeroPhysics.maxpAoaDeg(v))
    }
  }

  return (
    <div
      className="mt-12 w-full max-w-[1100px] border-t border-aero-ivory/10 pt-10"
      data-testid="active-aero-simulator"
    >
      <p className="font-ui mb-6 max-w-[720px] text-[11px] leading-relaxed tracking-[0.35px] text-aero-mist/55">
        Simulator educațional pe state machine SAE (DRS / Aerobrake / MaxP /
        Standard). Indicii relativi nu sunt forțe OEM Valhalla; forțe absolute
        (N) apar doar la ancora Table 3 @ {TABLE3_SPEED_KMH} km/h.
      </p>

      {/* Program picker */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Program Active Aero"
      >
        {PROGRAMS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`sim-mode-${p.id}`}
            title={p.hint}
            onClick={() => {
              applyModeSetpoints(p.id)
              // Seed gates so the selected program can engage when relevant.
              if (p.id === 'DRS') {
                setThrottlePct(Math.max(throttlePct, DRS_TRIGGERS.minThrottlePct))
                setBrakePct(0)
                if (speedKmh < DRS_TRIGGERS.minSpeedKmh) {
                  setSpeedKmh(DRS_TRIGGERS.wingRampEndKmh)
                }
              }
              if (p.id === 'AEROBRAKE') {
                setBrakePct(
                  Math.max(brakePct, AEROBRAKE_TRIGGERS.minBrakePct),
                )
                if (speedKmh < AEROBRAKE_TRIGGERS.minSpeedKmh) {
                  setSpeedKmh(160)
                }
              }
              if (p.id === 'MAXP' || p.id === 'STANDARD') {
                setBrakePct(0)
              }
            }}
            className={cn(
              'font-ui px-3 py-2 text-[11px] tracking-[0.14em] uppercase transition-colors',
              requestedMode === p.id
                ? 'bg-aero-amr text-aero-ivory'
                : 'text-aero-mist/60 hover:text-aero-ivory',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Controls */}
        <div className="space-y-5">
          <Slider
            testId="sim-speed"
            label="Viteză"
            value={speedKmh}
            min={0}
            max={300}
            step={5}
            unit=" km/h"
            onChange={onSpeedChange}
          />
          {showThrottle ? (
            <Slider
              testId="sim-throttle"
              label="Accelerație (DRS)"
              value={throttlePct}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={setThrottlePct}
            />
          ) : null}
          {showBrake ? (
            <Slider
              testId="sim-brake"
              label="Frână (Aerobrake)"
              value={brakePct}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={setBrakePct}
            />
          ) : null}
          <Slider
            testId="sim-ay"
            label="|ay|"
            value={ayG}
            min={0}
            max={1.5}
            step={0.05}
            unit=" g"
            onChange={setAyG}
          />
          {showMaxpAoa ? (
            <Slider
              testId="sim-aoa"
              label="AOA override (MaxP)"
              value={aoaDeg}
              min={ACTUATORS.aoaMinDeg}
              max={ACTUATORS.aoaMaxDeg}
              step={0.5}
              unit="°"
              onChange={setAoaDeg}
            />
          ) : null}

          <dl className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-aero-ivory/8 pt-5 sm:grid-cols-3">
            <Metric testId="sim-metric-mode" label="Mode efectiv" value={mode} />
            <Metric
              testId="sim-metric-aoa"
              label="AOA"
              value={`${aoaDegEffective.toFixed(1)}°`}
            />
            <Metric
              testId="sim-metric-splitter"
              label="Splitter"
              value={splitter}
            />
            <Metric
              testId="sim-metric-drag-idx"
              label="Drag idx"
              value={edu.dragIndex.toFixed(2)}
            />
            <Metric
              testId="sim-metric-fdf-idx"
              label="Front DF idx"
              value={edu.frontDfIndex.toFixed(2)}
            />
            <Metric
              testId="sim-metric-rdf-idx"
              label="Rear DF idx"
              value={edu.rearDfIndex.toFixed(2)}
            />
          </dl>

          {showTable3 ? (
            <div
              className="border border-aero-amr/40 bg-aero-amr/10 px-4 py-3"
              data-testid="sim-table3-anchor"
            >
              <p className="font-ui text-[10px] tracking-[0.55px] text-aero-lime/80 uppercase">
                Table 3 @ {TABLE3_SPEED_KMH} km/h (New Pack) — forțe absolute
              </p>
              <p className="font-ui mt-2 text-[12px] tracking-[0.35px] text-aero-ivory/90">
                Drag {dragN ?? TABLE3_FORCES.newPack.dragN} N · Front DF{' '}
                {frontDownforceN ?? TABLE3_FORCES.newPack.frontDownforceN} N ·
                Rear DF {rearDownforceN ?? TABLE3_FORCES.newPack.rearDownforceN}{' '}
                N
                {balanceFront != null
                  ? ` · balance ${balanceFront.toFixed(3)}`
                  : ''}
              </p>
            </div>
          ) : (
            <p className="font-ui text-[10px] leading-relaxed tracking-[0.35px] text-aero-mist/45">
              Forțe absolute (N): setați viteza la {TABLE3_SPEED_KMH} km/h pentru
              ancora SAE Table 3. Altfel doar indici relativi.
            </p>
          )}

          <p className="font-ui text-[10px] leading-relaxed tracking-[0.35px] text-aero-mist/50">
            {edu.disclaimer}
            {aerobrakeForced ? ' · AEROBRAKE forțat de frână' : ''}
            {drsDenied ? ' · DRS refuzat (gate-uri)' : ''}
            {' · '}
            {citations.slice(0, 4).join(' · ')}
          </p>
        </div>

        {/* Visual + chart */}
        <div className="space-y-6">
          <Valhalla25D
            aoaDeg={aoaDegEffective}
            splitter={splitter}
            mode={mode}
            speedKmh={speedKmh}
            dragIndex={edu.dragIndex}
            frontDfIndex={edu.frontDfIndex}
            rearDfIndex={edu.rearDfIndex}
          />
          <SimulatorChart
            schedule={schedule}
            speedKmh={speedKmh}
            aoaDeg={aoaDegEffective}
            dragIndex={edu.dragIndex}
            frontDfIndex={edu.frontDfIndex}
            rearDfIndex={edu.rearDfIndex}
          />
        </div>
      </div>
    </div>
  )
}

function SimulatorChart({
  schedule,
  speedKmh,
  aoaDeg,
  dragIndex,
  frontDfIndex,
  rearDfIndex,
}: {
  schedule: { speedKmh: number; aoaDeg: number }[]
  speedKmh: number
  aoaDeg: number
  dragIndex: number
  frontDfIndex: number
  rearDfIndex: number
}) {
  const W = 520
  const H = 200
  const pad = { t: 24, r: 16, b: 36, l: 40 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const xMax = 300
  const yMax = 25
  const x = (v: number) => pad.l + (v / xMax) * iw
  const y = (a: number) => pad.t + ih - (a / yMax) * ih
  const path = schedule
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.speedKmh)} ${y(p.aoaDeg)}`)
    .join(' ')

  const bars = [
    { label: 'Drag', v: dragIndex, color: '#e8e4dc' },
    { label: 'F-DF', v: frontDfIndex, color: '#00665e' },
    { label: 'R-DF', v: rearDfIndex, color: '#c4df00' },
  ]

  return (
    <div
      className="border border-aero-ivory/8 bg-aero-ink/60 p-4 md:p-5"
      data-testid="sim-chart"
    >
      <p className="font-ui mb-3 text-[10px] tracking-[0.55px] text-aero-mist/45 uppercase">
        AOA vs viteză (program) + indici relativi
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        {/* grid */}
        {[0, 6, 12, 19, 25].map((a) => (
          <g key={a}>
            <line
              x1={pad.l}
              y1={y(a)}
              x2={W - pad.r}
              y2={y(a)}
              stroke="rgba(248,247,244,0.06)"
            />
            <text
              x={pad.l - 6}
              y={y(a) + 3}
              fill="#8b929a"
              fontSize="8"
              textAnchor="end"
              fontFamily="AstonMartinSans, sans-serif"
            >
              {a}°
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke="#00665e" strokeWidth="2" />
        <circle
          cx={x(Math.min(speedKmh, xMax))}
          cy={y(aoaDeg)}
          r="5"
          fill="#c4df00"
          data-testid="sim-chart-point"
        />
        <text
          x={W / 2}
          y={H - 8}
          fill="#8b929a"
          fontSize="9"
          textAnchor="middle"
          fontFamily="AstonMartinSans, sans-serif"
        >
          viteză km/h
        </text>
      </svg>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {bars.map((b) => (
          <div key={b.label}>
            <p className="font-ui mb-1.5 flex justify-between text-[9px] tracking-[0.4px] text-aero-mist/55 uppercase">
              <span>{b.label}</span>
              <span className="text-aero-ivory/70">{b.v.toFixed(2)}</span>
            </p>
            <div className="h-1.5 w-full bg-aero-ivory/8">
              <div
                className="h-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${Math.round(b.v * 100)}%`,
                  backgroundColor: b.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
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
