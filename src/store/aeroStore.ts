import { create } from 'zustand'
import { CONTROL_LOOP_HZ, getModeCoefficients } from '@/data/vehicleConstants'
import type { AeroMode, SplitterState, TelemetryMetrics } from '@/types/aero'

export interface AeroStoreState {
  /** Wing AOA [deg] 0..25. */
  aoaDeg: number
  /** Speed [km/h]. */
  speedKmh: number
  /** Throttle 0..100. */
  throttlePct: number
  /** Brake 0..100. */
  brakePct: number
  /** Active / selected mode. */
  mode: AeroMode
  /** Splitter OPEN | CLOSED. */
  splitter: SplitterState
  /**
   * Derived telemetry placeholders (zeros until Phase 2 math engine).
   * Coefficients mirror the selected mode table for HUD wiring.
   */
  dragN: number
  downforceN: number
  cd: number
  cl: number
  copRearPct: number
  controlLoopHz: number

  setAoaDeg: (aoaDeg: number) => void
  setSpeedKmh: (speedKmh: number) => void
  setThrottlePct: (throttlePct: number) => void
  setBrakePct: (brakePct: number) => void
  setMode: (mode: AeroMode) => void
  setSplitter: (splitter: SplitterState) => void
  /** Apply mode set-points from the coefficient table (AOA + splitter). */
  applyModeSetpoints: (mode: AeroMode) => void
  /** Snapshot for HUD / consumers. */
  getTelemetry: () => TelemetryMetrics
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

const passive = getModeCoefficients('PASSIVE')

export const useAeroStore = create<AeroStoreState>((set, get) => ({
  aoaDeg: typeof passive.aoaDeg === 'number' ? passive.aoaDeg : 10,
  speedKmh: 0,
  throttlePct: 0,
  brakePct: 0,
  mode: 'PASSIVE',
  splitter: passive.splitter,
  dragN: 0,
  downforceN: 0,
  cd: passive.cd,
  cl: passive.cl,
  copRearPct: 50,
  controlLoopHz: CONTROL_LOOP_HZ,

  setAoaDeg: (aoaDeg) => set({ aoaDeg: clamp(aoaDeg, 0, 25) }),
  setSpeedKmh: (speedKmh) => set({ speedKmh: clamp(speedKmh, 0, 400) }),
  setThrottlePct: (throttlePct) => set({ throttlePct: clamp(throttlePct, 0, 100) }),
  setBrakePct: (brakePct) => set({ brakePct: clamp(brakePct, 0, 100) }),

  setMode: (mode) => {
    const coeffs = getModeCoefficients(mode)
    set({
      mode,
      cd: coeffs.cd,
      cl: coeffs.cl,
    })
  },

  setSplitter: (splitter) => set({ splitter }),

  applyModeSetpoints: (mode) => {
    const coeffs = getModeCoefficients(mode)
    const aoaDeg =
      typeof coeffs.aoaDeg === 'number'
        ? coeffs.aoaDeg
        : (coeffs.aoaDeg.min + coeffs.aoaDeg.max) / 2
    set({
      mode,
      aoaDeg,
      splitter: coeffs.splitter,
      cd: coeffs.cd,
      cl: coeffs.cl,
      // Forces remain 0 until Phase 2 implements F_D / F_L.
      dragN: 0,
      downforceN: 0,
    })
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
      copRearPct: s.copRearPct,
      controlLoopHz: s.controlLoopHz,
    }
  },
}))
