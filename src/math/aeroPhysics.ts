/**
 * Phase 2 math engine — stubs / interfaces only.
 * Implement equations from master-spec §2; do not invent constants.
 */
import type { AeroMode, ModeAeroCoefficients, SplitterState } from '@/types/aero'

export interface AeroForces {
  dragN: number
  downforceN: number
}

export interface CopResult {
  /** Center of pressure rear share [%]. */
  copRearPct: number
}

export interface AeroPhysicsEngine {
  /** F_D = ½ ρ v² A C_D  (v in m/s). */
  computeDragN: (speedKmh: number, cd: number) => number
  /** F_L = ½ ρ v² A |C_L|. */
  computeDownforceN: (speedKmh: number, cl: number) => number
  /** CoP_rear% = 50% + (AOA/25° × 12%). */
  computeCopRearPct: (aoaDeg: number) => number
  /** Resolve mode coefficients for current inputs (incl. AEROBRAKE override). */
  resolveMode: (input: {
    requestedMode: AeroMode
    speedKmh: number
    throttlePct: number
    brakePct: number
  }) => { mode: AeroMode; coefficients: ModeAeroCoefficients; splitter: SplitterState }
  /** Bundle forces for a speed + coefficient pair. */
  computeForces: (speedKmh: number, cd: number, cl: number) => AeroForces
}

/**
 * Placeholder — Phase 2 replaces with paper-exact implementations.
 * Methods throw to prevent accidental use of fabricated results.
 */
export const aeroPhysicsStub: AeroPhysicsEngine = {
  computeDragN() {
    throw new Error('Phase 2: implement computeDragN per master-spec eq. 1')
  },
  computeDownforceN() {
    throw new Error('Phase 2: implement computeDownforceN per master-spec eq. 2')
  },
  computeCopRearPct() {
    throw new Error('Phase 2: implement computeCopRearPct per master-spec eq. 3')
  },
  resolveMode() {
    throw new Error('Phase 2: implement resolveMode (AEROBRAKE if brake > 40%)')
  },
  computeForces() {
    throw new Error('Phase 2: implement computeForces')
  },
}
