/**
 * PI-ROM neural pressure-field metadata (Chapter 5).
 *
 * Master-spec states: CFD pressure fields in < 1 ms with **26.58×** speedup.
 * No mesh, weights, or fake CFD arrays — typed notes only for HUD / matrix.
 */
import { PI_ROM } from './vehicleConstants'

export interface PiRomMetadata {
  /** Inference budget [ms] from master-spec. */
  inferenceBudgetMs: number
  /** Reported speedup factor vs CFD (master-spec). */
  speedupFactor: number
  /** Human-readable claim for Chapter 5 matrix. */
  summary: string
  /**
   * Pressure-field payload intentionally absent — Phase 3/5 may attach a
   * real ROM; never invent nodal pressures here.
   */
  pressureField: null
  status: 'metadata-only'
}

export const PI_ROM_METADATA: PiRomMetadata = {
  inferenceBudgetMs: PI_ROM.inferenceBudgetMs,
  speedupFactor: PI_ROM.speedupFactor,
  summary:
    'PI-ROM: CFD pressure fields inferred in < 1 ms (26.58× speedup) — master-spec §2.',
  pressureField: null,
  status: 'metadata-only',
}
