/**
 * 14-DOF vehicle-dynamics parameters from S1-F001 / S1-F002.
 * Do not mix with S2 Table 7 (1680 kg).
 */
import { VEHICLE, VEHICLE_CLASS } from './vehicleConstants'

/** Known mass / geometry inputs from S1 Table 1. */
export interface Vehicle14DofKnownParams {
  vehicleClass: typeof VEHICLE_CLASS
  /** Baseline DOF count (S1-F001). */
  dofBaseline: 14
  sprungMassKg: number
  unsprungMassKg: number
  totalMassKg: number
  wheelbaseMm: number
  cogToFrontMm: number
  cogHeightMm: number
  frontTrackMm: number
  rearTrackMm: number
  frontTireRadiusMm: number
  rearTireRadiusMm: number
  /** Derived from a, L (Table 1) — not the old 43/57 invent. */
  massDistributionFrontPct: number
  massDistributionRearPct: number
  totalSystemPowerKw: number
  frontalAreaM2: number
  /** CFD body shape reference (S1-F003). */
  cfdBodyShape: 'Aston Martin Vantage 2019'
}

/**
 * Remaining plant coefficients (tires, suspension rates, etc.) —
 * not enumerated numerically in science-facts beyond Table 1.
 */
export interface Vehicle14DofPendingParams {
  status: 'partial'
  note: string
}

export interface Vehicle14DofModel {
  known: Vehicle14DofKnownParams
  pending: Vehicle14DofPendingParams
}

export const VEHICLE_14DOF: Vehicle14DofModel = {
  known: {
    vehicleClass: VEHICLE_CLASS,
    dofBaseline: 14,
    sprungMassKg: VEHICLE.sprungMassKg,
    unsprungMassKg: VEHICLE.unsprungMassKg,
    totalMassKg: VEHICLE.totalMassKg,
    wheelbaseMm: VEHICLE.wheelbaseMm,
    cogToFrontMm: VEHICLE.cogToFrontMm,
    cogHeightMm: VEHICLE.cogHeightMm,
    frontTrackMm: VEHICLE.frontTrackMm,
    rearTrackMm: VEHICLE.rearTrackMm,
    frontTireRadiusMm: VEHICLE.frontTireRadiusMm,
    rearTireRadiusMm: VEHICLE.rearTireRadiusMm,
    massDistributionFrontPct: VEHICLE.massDistributionFrontPct,
    massDistributionRearPct: VEHICLE.massDistributionRearPct,
    totalSystemPowerKw: VEHICLE.totalSystemPowerKw,
    frontalAreaM2: VEHICLE.frontalAreaM2,
    cfdBodyShape: 'Aston Martin Vantage 2019',
  },
  pending: {
    status: 'partial',
    note:
      'S1 gives 14 DOF structure + Table 1 geometry/mass/power. Tire/suspension ' +
      'coefficients and Pacejka params are not in science-facts for the S1 plant. ' +
      'S2 Table 7 (1680 kg) must not fill these slots.',
  },
}
