/**
 * Ground-truth vehicle & aero constants.
 * Copied exclusively from `/cursor/stores/self/internal/master-spec.md`.
 * Do not invent or round beyond what the spec states.
 */
import type { ModeAeroCoefficients } from '@/types/aero'

/** Vehicle class label from master-spec §2. */
export const VEHICLE_CLASS =
  '4WD Electric/Hybrid Hypercar (Valhalla configuration)' as const

export const VEHICLE = {
  /** Sprung mass m_s [kg]. */
  sprungMassKg: 2050,
  /** Total mass [kg]. */
  totalMassKg: 2240,
  /** Total system power [kW] (integrated 4WD wheel motors). */
  totalSystemPowerKw: 1257,
  /** Frontal area A [m²]. */
  frontalAreaM2: 2.1,
  /** Wheelbase L [mm]. */
  wheelbaseMm: 2691,
  /** Static mass distribution front [%]. */
  massDistributionFrontPct: 43,
  /** Static mass distribution rear [%]. */
  massDistributionRearPct: 57,
  /** Air density ρ [kg/m³]. */
  airDensityKgPerM3: 1.225,
} as const

export const ACTUATORS = {
  /** Active rear wing AOA continuous range [deg]. */
  aoaMinDeg: 0,
  aoaMaxDeg: 25,
  /** Wing actuation speed [deg/s]. */
  aoaActuationSpeedDegPerS: 15,
} as const

/**
 * Mode coefficient table — master-spec §2 aerodynamic coefficient state engine.
 * MAXP AOA is a dynamic range; others are fixed set-points.
 */
export const MODE_COEFFICIENTS: readonly ModeAeroCoefficients[] = [
  {
    mode: 'DRS',
    aoaDeg: 0,
    splitter: 'OPEN',
    cd: 0.31,
    cl: -0.8,
    triggerNote: 'Speed > 90 km/h, Throttle > 70%',
  },
  {
    mode: 'PASSIVE',
    aoaDeg: 10,
    splitter: 'CLOSED',
    cd: 0.42,
    cl: -1.4,
  },
  {
    mode: 'MAXP',
    aoaDeg: { min: 5, max: 18 },
    splitter: 'CLOSED',
    cd: 0.48,
    cl: -1.9,
    triggerNote: 'Balances CoP over CoG',
  },
  {
    mode: 'AEROBRAKE',
    aoaDeg: 25,
    splitter: 'CLOSED',
    cd: 0.72,
    cl: -2.4,
    triggerNote: 'Brake pedal > 40%',
  },
] as const

/** Mode lookup helper (typed). */
export function getModeCoefficients(
  mode: ModeAeroCoefficients['mode'],
): ModeAeroCoefficients {
  const found = MODE_COEFFICIENTS.find((m) => m.mode === mode)
  if (!found) {
    throw new Error(`Unknown aero mode: ${mode}`)
  }
  return found
}

/** DRS engagement thresholds from master-spec. */
export const DRS_TRIGGERS = {
  minSpeedKmh: 90,
  minThrottlePct: 70,
} as const

/** AEROBRAKE engagement threshold from master-spec. */
export const AEROBRAKE_TRIGGERS = {
  minBrakePct: 40,
} as const

/**
 * CoP rear % formula constants — master-spec §2 eq. 3:
 * CoP_rear% = 50% + (AOA/25° × 12%)
 */
export const COP = {
  baselineRearPct: 50,
  aoaSpanDeg: 25,
  aoaGainPct: 12,
} as const

/** Nürburgring GP lap-time delta (VI-Grade DIL) — master-spec §2 eq. 4. */
export const LAP_TIME = {
  /** MaxP vs passive [s] (negative = faster). */
  maxPVsPassiveDeltaS: -2.55,
} as const

/** PI-ROM CFD pressure-field inference — master-spec §2 eq. 5. */
export const PI_ROM = {
  /** Inference budget [ms]. */
  inferenceBudgetMs: 1,
  /** Reported speedup factor. */
  speedupFactor: 26.58,
} as const

/** HUD / control-loop badge — master-spec Chapter 1. */
export const CONTROL_LOOP_HZ = 50 as const
