/**
 * 14-DOF vehicle-dynamics parameter stub (Chapter 4).
 *
 * Master-spec names a 14-DOF model and gives sprung/total mass, wheelbase,
 * and mass distribution — but does **not** enumerate the 14 DOFs or tire /
 * suspension coefficients. This module holds only verified constants and a
 * typed slot for a future paper-backed fill-in. Do not invent DOF counts
 * or missing coefficients.
 */
import { VEHICLE, VEHICLE_CLASS } from './vehicleConstants'

/** Known mass / geometry inputs that feed a future 14-DOF plant. */
export interface Vehicle14DofKnownParams {
  vehicleClass: typeof VEHICLE_CLASS
  sprungMassKg: number
  totalMassKg: number
  /** Unsprung estimate = total − sprung (derived from master-spec masses). */
  unsprungMassKg: number
  wheelbaseMm: number
  massDistributionFrontPct: number
  massDistributionRearPct: number
  totalSystemPowerKw: number
}

/**
 * Placeholder for the remaining 14-DOF parameterization
 * (suspension, tires, unsprung corners, etc.) — intentionally empty
 * until filled from SAE / paper sources.
 */
export interface Vehicle14DofPendingParams {
  /** Dataset completeness — never claim 'complete' without paper values. */
  status: 'stub'
  note: string
}

export interface Vehicle14DofModel {
  known: Vehicle14DofKnownParams
  pending: Vehicle14DofPendingParams
}

export const VEHICLE_14DOF: Vehicle14DofModel = {
  known: {
    vehicleClass: VEHICLE_CLASS,
    sprungMassKg: VEHICLE.sprungMassKg,
    totalMassKg: VEHICLE.totalMassKg,
    unsprungMassKg: VEHICLE.totalMassKg - VEHICLE.sprungMassKg,
    wheelbaseMm: VEHICLE.wheelbaseMm,
    massDistributionFrontPct: VEHICLE.massDistributionFrontPct,
    massDistributionRearPct: VEHICLE.massDistributionRearPct,
    totalSystemPowerKw: VEHICLE.totalSystemPowerKw,
  },
  pending: {
    status: 'stub',
    note:
      '14-DOF DOF list and tire/suspension coefficients are not specified in ' +
      'master-spec beyond mass, wheelbase, and distribution. Do not fabricate; ' +
      'populate from SAE 2020-36-0079 / named papers before Chapter 4 sim.',
  },
}
