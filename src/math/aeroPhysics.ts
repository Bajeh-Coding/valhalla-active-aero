/**
 * Paper-exact aerodynamic physics engine (master-spec §2).
 * All constants imported from `@/data/vehicleConstants` — no fabricated numbers.
 */
import {
  AEROBRAKE_TRIGGERS,
  ACTUATORS,
  COP,
  DRS_TRIGGERS,
  getModeCoefficients,
  VEHICLE,
} from '@/data/vehicleConstants'
import type { AeroMode, ModeAeroCoefficients, SplitterState } from '@/types/aero'

export interface AeroForces {
  dragN: number
  downforceN: number
}

export interface CopResult {
  /** Center of pressure rear share [%]. */
  copRearPct: number
}

export interface ResolvedAeroMode {
  mode: AeroMode
  coefficients: ModeAeroCoefficients
  splitter: SplitterState
  /** AOA set-point for the resolved mode [deg]. MAXP uses midpoint of [5, 18]. */
  aoaDeg: number
  /** True when AEROBRAKE was forced by brake > 40%. */
  aerobrakeForced: boolean
  /** True when requested DRS but speed/throttle triggers were not met. */
  drsDenied: boolean
}

export interface AeroPhysicsEngine {
  /** Convert km/h → m/s. */
  kmhToMs: (speedKmh: number) => number
  /** F_D = ½ ρ v² A C_D  (v from km/h). */
  computeDragN: (speedKmh: number, cd: number) => number
  /** F_L = ½ ρ v² A |C_L|. */
  computeDownforceN: (speedKmh: number, cl: number) => number
  /** CoP_rear% = 50% + (AOA/25° × 12%). */
  computeCopRearPct: (aoaDeg: number) => number
  /** C_L / C_D (signed; C_L negative = downforce). */
  computeClOverCd: (cl: number, cd: number) => number
  /**
   * Resolve effective mode.
   * - Brake > 40% → AEROBRAKE regardless of requested mode.
   * - Requested DRS only engages when speed > 90 km/h AND throttle > 70%;
   *   otherwise falls back to PASSIVE.
   */
  resolveMode: (input: {
    requestedMode: AeroMode
    speedKmh: number
    throttlePct: number
    brakePct: number
  }) => ResolvedAeroMode
  /** Bundle forces for a speed + coefficient pair. */
  computeForces: (speedKmh: number, cd: number, cl: number) => AeroForces
  /** Full derived telemetry snapshot from control inputs. */
  computeTelemetry: (input: {
    requestedMode: AeroMode
    speedKmh: number
    throttlePct: number
    brakePct: number
    /** Optional AOA override (e.g. MAXP modulation within [5, 18]). */
    aoaDegOverride?: number
  }) => {
    mode: AeroMode
    splitter: SplitterState
    aoaDeg: number
    cd: number
    cl: number
    clOverCd: number
    dragN: number
    downforceN: number
    copRearPct: number
    aerobrakeForced: boolean
    drsDenied: boolean
  }
}

function modeAoaSetpoint(coeffs: ModeAeroCoefficients): number {
  if (typeof coeffs.aoaDeg === 'number') {
    return coeffs.aoaDeg
  }
  return (coeffs.aoaDeg.min + coeffs.aoaDeg.max) / 2
}

function clampAoa(aoaDeg: number): number {
  return Math.min(ACTUATORS.aoaMaxDeg, Math.max(ACTUATORS.aoaMinDeg, aoaDeg))
}

function clampMaxpAoa(aoaDeg: number): number {
  const coeffs = getModeCoefficients('MAXP')
  if (typeof coeffs.aoaDeg === 'number') {
    return clampAoa(aoaDeg)
  }
  return Math.min(coeffs.aoaDeg.max, Math.max(coeffs.aoaDeg.min, aoaDeg))
}

export const aeroPhysics: AeroPhysicsEngine = {
  kmhToMs(speedKmh) {
    return speedKmh / 3.6
  },

  computeDragN(speedKmh, cd) {
    const v = speedKmh / 3.6
    return 0.5 * VEHICLE.airDensityKgPerM3 * v * v * VEHICLE.frontalAreaM2 * cd
  },

  computeDownforceN(speedKmh, cl) {
    const v = speedKmh / 3.6
    return (
      0.5 *
      VEHICLE.airDensityKgPerM3 *
      v *
      v *
      VEHICLE.frontalAreaM2 *
      Math.abs(cl)
    )
  },

  computeCopRearPct(aoaDeg) {
    const aoa = clampAoa(aoaDeg)
    return (
      COP.baselineRearPct + (aoa / COP.aoaSpanDeg) * COP.aoaGainPct
    )
  },

  computeClOverCd(cl, cd) {
    if (cd === 0) {
      throw new Error('C_D must be non-zero to compute C_L/C_D')
    }
    return cl / cd
  },

  resolveMode({ requestedMode, speedKmh, throttlePct, brakePct }) {
    // Master-spec QA: Brake > 40% forces AEROBRAKE regardless of mode.
    if (brakePct > AEROBRAKE_TRIGGERS.minBrakePct) {
      const coefficients = getModeCoefficients('AEROBRAKE')
      return {
        mode: 'AEROBRAKE',
        coefficients,
        splitter: coefficients.splitter,
        aoaDeg: modeAoaSetpoint(coefficients),
        aerobrakeForced: true,
        drsDenied: false,
      }
    }

    let mode = requestedMode
    let drsDenied = false

    if (requestedMode === 'DRS') {
      const drsOk =
        speedKmh > DRS_TRIGGERS.minSpeedKmh &&
        throttlePct > DRS_TRIGGERS.minThrottlePct
      if (!drsOk) {
        mode = 'PASSIVE'
        drsDenied = true
      }
    }

    const coefficients = getModeCoefficients(mode)
    return {
      mode,
      coefficients,
      splitter: coefficients.splitter,
      aoaDeg: modeAoaSetpoint(coefficients),
      aerobrakeForced: false,
      drsDenied,
    }
  },

  computeForces(speedKmh, cd, cl) {
    return {
      dragN: aeroPhysics.computeDragN(speedKmh, cd),
      downforceN: aeroPhysics.computeDownforceN(speedKmh, cl),
    }
  },

  computeTelemetry(input) {
    const resolved = aeroPhysics.resolveMode(input)
    const { coefficients, mode, splitter, aerobrakeForced, drsDenied } = resolved

    let aoaDeg = resolved.aoaDeg
    if (
      input.aoaDegOverride !== undefined &&
      mode === 'MAXP' &&
      !aerobrakeForced
    ) {
      aoaDeg = clampMaxpAoa(input.aoaDegOverride)
    }

    const { cd, cl } = coefficients
    const forces = aeroPhysics.computeForces(input.speedKmh, cd, cl)

    return {
      mode,
      splitter,
      aoaDeg,
      cd,
      cl,
      clOverCd: aeroPhysics.computeClOverCd(cl, cd),
      dragN: forces.dragN,
      downforceN: forces.downforceN,
      copRearPct: aeroPhysics.computeCopRearPct(aoaDeg),
      aerobrakeForced,
      drsDenied,
    }
  },
}

/** @deprecated Use `aeroPhysics` — stub retained name removed in Phase 2. */
export const aeroPhysicsStub = aeroPhysics
