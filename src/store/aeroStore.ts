import { create } from 'zustand'
import { ACTUATORS } from '@/data/vehicleConstants'
import { aeroPhysics } from '@/math/aeroPhysics'
import type {
  AeroMode,
  FactId,
  SplitterState,
  TelemetryMetrics,
} from '@/types/aero'

export interface AeroStoreState {
  /** User-selected mode (before AEROBRAKE / DRS resolve). */
  requestedMode: AeroMode
  /** Wing AOA set-point / MaxP override [deg]. */
  aoaDeg: number
  /** Effective AOA after state machine [deg]. */
  aoaDegEffective: number
  /** Speed [km/h]. */
  speedKmh: number
  /** Throttle 0..100. */
  throttlePct: number
  /** Brake 0..100. */
  brakePct: number
  /** Lateral acceleration [g] for |ay|≤1 g gates. */
  ayG: number
  /** Effective mode after state machine. */
  mode: AeroMode
  /** Splitter OPEN | CLOSED. */
  splitter: SplitterState
  /** Drag [N] — Table 3 @160 km/h or null. */
  dragN: number | null
  /** Front downforce [N] — Table 3 @160 or null. */
  frontDownforceN: number | null
  /** Rear downforce [N] — Table 3 @160 or null. */
  rearDownforceN: number | null
  /** front DF / total DF; null if unavailable. */
  balanceFront: number | null
  aerobrakeForced: boolean
  drsDenied: boolean
  citations: FactId[]

  setAoaDeg: (aoaDeg: number) => void
  setSpeedKmh: (speedKmh: number) => void
  setThrottlePct: (throttlePct: number) => void
  setBrakePct: (brakePct: number) => void
  setAyG: (ayG: number) => void
  setMode: (mode: AeroMode) => void
  setSplitter: (splitter: SplitterState) => void
  applyModeSetpoints: (mode: AeroMode) => void
  recompute: () => void
  getTelemetry: () => TelemetryMetrics
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

interface ControlSlice {
  requestedMode: AeroMode
  speedKmh: number
  throttlePct: number
  brakePct: number
  ayG: number
  aoaDeg: number
}

function derivedFrom(controls: ControlSlice) {
  return aeroPhysics.computeTelemetry({
    requestedMode: controls.requestedMode,
    speedKmh: controls.speedKmh,
    throttlePct: controls.throttlePct,
    brakePct: controls.brakePct,
    ayG: controls.ayG,
    aoaDegOverride: controls.aoaDeg,
  })
}

const initialControls: ControlSlice = {
  requestedMode: 'STANDARD',
  speedKmh: 0,
  throttlePct: 0,
  brakePct: 0,
  ayG: 0,
  aoaDeg: ACTUATORS.standardAoaDeg,
}
const initialDerived = derivedFrom(initialControls)

export const useAeroStore = create<AeroStoreState>((set, get) => ({
  ...initialControls,
  mode: initialDerived.mode,
  splitter: initialDerived.splitter,
  aoaDegEffective: initialDerived.aoaDegEffective,
  dragN: initialDerived.dragN,
  frontDownforceN: initialDerived.frontDownforceN,
  rearDownforceN: initialDerived.rearDownforceN,
  balanceFront: initialDerived.balanceFront,
  aerobrakeForced: initialDerived.aerobrakeForced,
  drsDenied: initialDerived.drsDenied,
  citations: initialDerived.citations,

  setAoaDeg: (aoaDeg) => {
    const next = clamp(aoaDeg, ACTUATORS.aoaMinDeg, ACTUATORS.aoaMaxDeg)
    const s = get()
    const d = derivedFrom({ ...s, aoaDeg: next })
    set({ aoaDeg: next, ...packDerived(d) })
  },

  setSpeedKmh: (speedKmh) => {
    const next = clamp(speedKmh, 0, 400)
    const s = get()
    const d = derivedFrom({ ...s, speedKmh: next })
    set({ speedKmh: next, ...packDerived(d) })
  },

  setThrottlePct: (throttlePct) => {
    const next = clamp(throttlePct, 0, 100)
    const s = get()
    const d = derivedFrom({ ...s, throttlePct: next })
    set({ throttlePct: next, ...packDerived(d) })
  },

  setBrakePct: (brakePct) => {
    const next = clamp(brakePct, 0, 100)
    const s = get()
    const d = derivedFrom({ ...s, brakePct: next })
    set({ brakePct: next, ...packDerived(d) })
  },

  setAyG: (ayG) => {
    const next = clamp(ayG, -3, 3)
    const s = get()
    const d = derivedFrom({ ...s, ayG: next })
    set({ ayG: next, ...packDerived(d) })
  },

  setMode: (mode) => {
    const s = get()
    const d = derivedFrom({ ...s, requestedMode: mode })
    set({ requestedMode: mode, ...packDerived(d) })
  },

  setSplitter: (splitter) => {
    // Splitter is mode-driven; allow manual override for scene debug only.
    set({ splitter })
  },

  applyModeSetpoints: (mode) => {
    const s = get()
    let aoaDeg = s.aoaDeg
    if (mode === 'STANDARD') aoaDeg = ACTUATORS.standardAoaDeg
    if (mode === 'DRS') aoaDeg = ACTUATORS.drsAoaDeg
    if (mode === 'AEROBRAKE') aoaDeg = ACTUATORS.aerobrakeAoaDeg
    if (mode === 'MAXP') aoaDeg = aeroPhysics.maxpAoaDeg(s.speedKmh)
    const d = derivedFrom({ ...s, requestedMode: mode, aoaDeg })
    set({
      requestedMode: mode,
      aoaDeg,
      ...packDerived(d),
    })
  },

  recompute: () => {
    const s = get()
    const d = derivedFrom(s)
    set(packDerived(d))
  },

  getTelemetry: (): TelemetryMetrics => {
    const s = get()
    return {
      aoaDeg: s.aoaDeg,
      aoaDegEffective: s.aoaDegEffective,
      speedKmh: s.speedKmh,
      throttlePct: s.throttlePct,
      brakePct: s.brakePct,
      ayG: s.ayG,
      mode: s.mode,
      splitter: s.splitter,
      dragN: s.dragN,
      frontDownforceN: s.frontDownforceN,
      rearDownforceN: s.rearDownforceN,
      balanceFront: s.balanceFront,
      aerobrakeForced: s.aerobrakeForced,
      drsDenied: s.drsDenied,
      citations: s.citations,
    }
  },
}))

function packDerived(d: ReturnType<typeof derivedFrom>) {
  return {
    mode: d.mode,
    splitter: d.splitter,
    aoaDegEffective: d.aoaDegEffective,
    dragN: d.dragN,
    frontDownforceN: d.frontDownforceN,
    rearDownforceN: d.rearDownforceN,
    balanceFront: d.balanceFront,
    aerobrakeForced: d.aerobrakeForced,
    drsDenied: d.drsDenied,
    citations: d.citations,
  }
}
