import { create } from 'zustand'
import { CONTROL_LOOP_HZ, getModeCoefficients } from '@/data/vehicleConstants'
import { aeroPhysics } from '@/math/aeroPhysics'
import type { AeroMode, SplitterState, TelemetryMetrics } from '@/types/aero'

export interface AeroStoreState {
  /** User-selected mode (before AEROBRAKE / DRS resolve). */
  requestedMode: AeroMode
  /** Wing AOA [deg] 0..25. */
  aoaDeg: number
  /** Speed [km/h]. */
  speedKmh: number
  /** Throttle 0..100. */
  throttlePct: number
  /** Brake 0..100. */
  brakePct: number
  /** Effective mode after state machine. */
  mode: AeroMode
  /** Splitter OPEN | CLOSED. */
  splitter: SplitterState
  /** Drag force F_D [N] — derived. */
  dragN: number
  /** Downforce F_L [N] — derived. */
  downforceN: number
  /** Drag coefficient C_D. */
  cd: number
  /** Lift coefficient C_L (negative = downforce). */
  cl: number
  /** C_L / C_D. */
  clOverCd: number
  /** Center of pressure rear share [%]. */
  copRearPct: number
  /** True when brake > 40% forced AEROBRAKE. */
  aerobrakeForced: boolean
  /** True when DRS was requested but triggers unmet. */
  drsDenied: boolean
  controlLoopHz: number

  setAoaDeg: (aoaDeg: number) => void
  setSpeedKmh: (speedKmh: number) => void
  setThrottlePct: (throttlePct: number) => void
  setBrakePct: (brakePct: number) => void
  setMode: (mode: AeroMode) => void
  setSplitter: (splitter: SplitterState) => void
  /** Apply mode set-points from the coefficient table, then re-resolve. */
  applyModeSetpoints: (mode: AeroMode) => void
  /** Recompute derived aero from current inputs (idempotent). */
  recompute: () => void
  /** Snapshot for HUD / consumers. */
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
  aoaDeg: number
}

function derivedFrom(controls: ControlSlice) {
  return aeroPhysics.computeTelemetry({
    requestedMode: controls.requestedMode,
    speedKmh: controls.speedKmh,
    throttlePct: controls.throttlePct,
    brakePct: controls.brakePct,
    aoaDegOverride: controls.aoaDeg,
  })
}

const passive = getModeCoefficients('PASSIVE')
const initialControls: ControlSlice = {
  requestedMode: 'PASSIVE',
  speedKmh: 0,
  throttlePct: 0,
  brakePct: 0,
  aoaDeg: typeof passive.aoaDeg === 'number' ? passive.aoaDeg : 10,
}
const initialDerived = derivedFrom(initialControls)

export const useAeroStore = create<AeroStoreState>((set, get) => ({
  ...initialControls,
  mode: initialDerived.mode,
  splitter: initialDerived.splitter,
  dragN: initialDerived.dragN,
  downforceN: initialDerived.downforceN,
  cd: initialDerived.cd,
  cl: initialDerived.cl,
  clOverCd: initialDerived.clOverCd,
  copRearPct: initialDerived.copRearPct,
  aerobrakeForced: initialDerived.aerobrakeForced,
  drsDenied: initialDerived.drsDenied,
  controlLoopHz: CONTROL_LOOP_HZ,

  setAoaDeg: (aoaDeg) => {
    const next = clamp(aoaDeg, 0, 25)
    const s = get()
    const d = derivedFrom({ ...s, aoaDeg: next })
    set(packDerived(d))
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
    const d = derivedFrom({ ...s, requestedMode: mode })
    set({
      requestedMode: mode,
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
      speedKmh: s.speedKmh,
      throttlePct: s.throttlePct,
      brakePct: s.brakePct,
      mode: s.mode,
      splitter: s.splitter,
      dragN: s.dragN,
      downforceN: s.downforceN,
      cd: s.cd,
      cl: s.cl,
      clOverCd: s.clOverCd,
      copRearPct: s.copRearPct,
      controlLoopHz: s.controlLoopHz,
    }
  },
}))

function packDerived(d: ReturnType<typeof derivedFrom>) {
  return {
    mode: d.mode,
    splitter: d.splitter,
    aoaDeg: d.aoaDeg,
    cd: d.cd,
    cl: d.cl,
    clOverCd: d.clOverCd,
    dragN: d.dragN,
    downforceN: d.downforceN,
    copRearPct: d.copRearPct,
    aerobrakeForced: d.aerobrakeForced,
    drsDenied: d.drsDenied,
  }
}
