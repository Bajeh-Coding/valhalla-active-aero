/**
 * Educational relative aero indices for Cap 05 simulator.
 * Derived only from SAE mode setpoints (AOA + splitter) — NOT absolute forces,
 * NOT Valhalla OEM numbers. Absolute N appear only via Table 3 @160 km/h.
 */
import { ACTUATORS } from '@/data/vehicleConstants'
import type { AeroMode, SplitterState } from '@/types/aero'

export interface EducationalIndices {
  /** 0…1 — higher AOA → higher relative drag tendency. */
  dragIndex: number
  /** 0…1 — educational front downforce tendency. */
  frontDfIndex: number
  /** 0…1 — educational rear downforce tendency. */
  rearDfIndex: number
  disclaimer: string
}

export const EDUCATIONAL_DISCLAIMER =
  'Indici educaționali relativi (0–1), derivați din AOA/splitter SAE — nu forțe absolute OEM Valhalla.'

/**
 * Map effective wing AOA + splitter to unitless educational indices.
 * Aerobrake AOA (19°) = drag reference 1.0; Standard 6° ≈ mid rear DF.
 */
export function educationalIndices(
  aoaDeg: number,
  splitter: SplitterState,
  mode: AeroMode,
): EducationalIndices {
  const aoaNorm = clamp01(aoaDeg / ACTUATORS.aerobrakeAoaDeg)
  // DRS + OPEN splitter → low-drag duct (educational: lower front DF tendency).
  const splitterFrontMul = splitter === 'OPEN' ? 0.55 : 1
  // MaxP / Standard keep more balanced DF; Aerobrake biases rear (wing high AOA).
  const rearBias =
    mode === 'AEROBRAKE' ? 1.15 : mode === 'DRS' ? 0.7 : mode === 'MAXP' ? 0.95 : 1

  const frontBase = clamp01(0.35 + aoaNorm * 0.55) * splitterFrontMul
  const rearBase = clamp01(0.25 + aoaNorm * 0.7) * rearBias

  return {
    dragIndex: clamp01(0.12 + aoaNorm * 0.88),
    frontDfIndex: clamp01(frontBase),
    rearDfIndex: clamp01(rearBase),
    disclaimer: EDUCATIONAL_DISCLAIMER,
  }
}

/** Sample AOA schedule for chart — paper-exact for DRS ramp / MaxP bands. */
export function scheduleAoaPoints(
  mode: AeroMode,
  maxpAoa: (v: number) => number,
  drsAoa: (v: number) => number,
): { speedKmh: number; aoaDeg: number }[] {
  const speeds = [
    0, 50, 70, 90, 110, 120, 140, 160, 180, 200, 250, 280, 300,
  ]
  return speeds.map((speedKmh) => {
    if (mode === 'DRS') {
      return { speedKmh, aoaDeg: drsAoa(speedKmh) }
    }
    if (mode === 'MAXP') {
      return { speedKmh, aoaDeg: maxpAoa(speedKmh) }
    }
    if (mode === 'AEROBRAKE') {
      return { speedKmh, aoaDeg: ACTUATORS.aerobrakeAoaDeg }
    }
    return { speedKmh, aoaDeg: ACTUATORS.standardAoaDeg }
  })
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}
