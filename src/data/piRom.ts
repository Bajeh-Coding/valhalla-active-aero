/**
 * LEGACY non-paper stub — PI-ROM is NOT in science-facts (S1/S2).
 * Kept so old UI chapters compile until Visual/UI agents delete Neural/PI-ROM.
 * Do not treat these numbers as S1/S2 ground truth.
 */
export interface PiRomMetadata {
  inferenceBudgetMs: number
  speedupFactor: number
  summary: string
  pressureField: null
  status: 'metadata-only-non-paper'
}

/** @deprecated Non-paper — scheduled for DELETE with NeuralOverlay / PI-ROM chapter. */
export const PI_ROM = {
  inferenceBudgetMs: 1,
  speedupFactor: 26.58,
} as const

export const PI_ROM_METADATA: PiRomMetadata = {
  inferenceBudgetMs: PI_ROM.inferenceBudgetMs,
  speedupFactor: PI_ROM.speedupFactor,
  summary:
    'NON-PAPER legacy: PI-ROM not in S1/S2 science-facts — UI agent must remove.',
  pressureField: null,
  status: 'metadata-only-non-paper',
}
