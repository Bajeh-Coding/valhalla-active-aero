/**
 * Paper-exact aerodynamic physics (S1 state machine + Table 3 force anchor).
 * No ½ρv² / invented C_D·C_L. Facts: docs/science-facts.md.
 */
import {
  ACTUATORS,
  AEROBRAKE_TRIGGERS,
  AERO_BALANCE_TARGET,
  DRS_TRIGGERS,
  FRICTION_SATURATION,
  TABLE3_FORCES,
  TABLE3_SPEED_KMH,
  getModeSurface,
} from '@/data/vehicleConstants'
import type { AeroMode, FactId, SplitterState } from '@/types/aero'

export interface AeroForces {
  dragN: number | null
  frontDownforceN: number | null
  rearDownforceN: number | null
  /** front / (front+rear); null if forces missing or total ≤ 0. */
  balanceFront: number | null
  /** True only when returning exact Table 3 @160 km/h values. */
  atTable3Anchor: boolean
}

export interface ResolvedAeroMode {
  mode: AeroMode
  splitter: SplitterState
  /** Effective AOA after schedule / ramp [deg]. */
  aoaDegEffective: number
  aerobrakeForced: boolean
  drsDenied: boolean
  citations: FactId[]
}

export interface TelemetryInput {
  requestedMode: AeroMode
  speedKmh: number
  throttlePct: number
  brakePct: number
  /** Lateral accel in g (for |ay| ≤ 1 g gates). */
  ayG: number
  /** Optional MaxP AOA override within [0, 25]. */
  aoaDegOverride?: number
}

export interface TelemetrySnapshot extends ResolvedAeroMode {
  aoaDeg: number
  dragN: number | null
  frontDownforceN: number | null
  rearDownforceN: number | null
  balanceFront: number | null
}

export interface AeroPhysicsEngine {
  kmhToMs: (speedKmh: number) => number
  /** Exact Table 3 forces only at 160 km/h; otherwise null (S1-F011 / S1-F022). */
  lookupTable3Forces: (
    speedKmh: number,
    pack?: 'original' | 'newPack',
  ) => AeroForces
  /** Aero balance = front DF / total DF (S1-F013). */
  computeBalanceFront: (
    frontDownforceN: number,
    rearDownforceN: number,
  ) => number | null
  /**
   * S2 Eq. (25) — satt,i = Fz / (2 √(Fx²+Fy²)). Medium confidence on factor 2.
   */
  computeSaturationFactor: (fzN: number, fxN: number, fyN: number) => number
  /** MaxP AOA schedule (S1-F051). */
  maxpAoaDeg: (speedKmh: number) => number
  /** DRS wing ramp AOA 6°→0° on 70–120 km/h (S1-F034). */
  drsWingAoaDeg: (speedKmh: number) => number
  resolveMode: (input: TelemetryInput) => ResolvedAeroMode
  computeTelemetry: (input: TelemetryInput) => TelemetrySnapshot
}

function clampAoa(aoaDeg: number): number {
  return Math.min(ACTUATORS.aoaMaxDeg, Math.max(ACTUATORS.aoaMinDeg, aoaDeg))
}

function absAyOk(ayG: number, maxAbs: number): boolean {
  return Math.abs(ayG) <= maxAbs
}

function balanceFront(
  frontDownforceN: number,
  rearDownforceN: number,
): number | null {
  const total = frontDownforceN + rearDownforceN
  if (total <= 0) return null
  return frontDownforceN / total
}

export const aeroPhysics: AeroPhysicsEngine = {
  kmhToMs(speedKmh) {
    return speedKmh / 3.6
  },

  lookupTable3Forces(speedKmh, pack = 'newPack') {
    const row = TABLE3_FORCES[pack]
    if (speedKmh !== TABLE3_SPEED_KMH) {
      return {
        dragN: null,
        frontDownforceN: null,
        rearDownforceN: null,
        balanceFront: null,
        atTable3Anchor: false,
      }
    }
    return {
      dragN: row.dragN,
      frontDownforceN: row.frontDownforceN,
      rearDownforceN: row.rearDownforceN,
      balanceFront: balanceFront(row.frontDownforceN, row.rearDownforceN),
      atTable3Anchor: true,
    }
  },

  computeBalanceFront(frontDownforceN, rearDownforceN) {
    return balanceFront(frontDownforceN, rearDownforceN)
  },

  computeSaturationFactor(fzN, fxN, fyN) {
    const plane = Math.hypot(fxN, fyN)
    if (plane === 0) {
      return Number.POSITIVE_INFINITY
    }
    return fzN / (FRICTION_SATURATION.printedDenominatorFactor * plane)
  },

  maxpAoaDeg(speedKmh) {
    // S1-F051: V∈[100,180]→0°; (180,250]→3°; (250,300]→4.5°.
    // Below 100 km/h: paper silent → Standard 6° (gap flagged in handoff).
    if (speedKmh < 100) return ACTUATORS.standardAoaDeg
    if (speedKmh <= 180) return 0
    if (speedKmh <= 250) return 3
    if (speedKmh <= 300) return 4.5
    // Above 300: last defined MaxP band; paper hints baseline 6° may win (gap).
    return 4.5
  },

  drsWingAoaDeg(speedKmh) {
    const { minSpeedKmh, wingRampEndKmh } = DRS_TRIGGERS
    if (speedKmh < minSpeedKmh) return ACTUATORS.standardAoaDeg
    if (speedKmh >= wingRampEndKmh) return ACTUATORS.drsAoaDeg
    const t =
      (speedKmh - minSpeedKmh) / (wingRampEndKmh - minSpeedKmh)
    return ACTUATORS.standardAoaDeg + (ACTUATORS.drsAoaDeg - ACTUATORS.standardAoaDeg) * t
  },

  resolveMode({ requestedMode, speedKmh, throttlePct, brakePct, ayG }) {
    const citations: FactId[] = []

    // AEROBRAKE priority when paper conditions met (S1-F040/041).
    const aerobrakeOk =
      speedKmh >= AEROBRAKE_TRIGGERS.minSpeedKmh &&
      brakePct >= AEROBRAKE_TRIGGERS.minBrakePct &&
      absAyOk(ayG, AEROBRAKE_TRIGGERS.maxAbsAyG)

    if (aerobrakeOk) {
      citations.push('S1-F040', 'S1-F041')
      return {
        mode: 'AEROBRAKE',
        splitter: 'CLOSED',
        aoaDegEffective: ACTUATORS.aerobrakeAoaDeg,
        aerobrakeForced: brakePct >= AEROBRAKE_TRIGGERS.minBrakePct,
        drsDenied: false,
        citations,
      }
    }

    if (requestedMode === 'DRS') {
      const drsOk =
        speedKmh >= DRS_TRIGGERS.minSpeedKmh &&
        throttlePct >= DRS_TRIGGERS.minThrottlePct &&
        absAyOk(ayG, DRS_TRIGGERS.maxAbsAyG)

      if (!drsOk) {
        citations.push('S1-F033', 'S1-F021')
        return {
          mode: 'STANDARD',
          splitter: 'CLOSED',
          aoaDegEffective: ACTUATORS.standardAoaDeg,
          aerobrakeForced: false,
          drsDenied: true,
          citations,
        }
      }

      citations.push('S1-F032', 'S1-F033', 'S1-F034')
      const splitter: SplitterState =
        speedKmh >= DRS_TRIGGERS.splitterOpenKmh ? 'OPEN' : 'CLOSED'
      return {
        mode: 'DRS',
        splitter,
        aoaDegEffective: aeroPhysics.drsWingAoaDeg(speedKmh),
        aerobrakeForced: false,
        drsDenied: false,
        citations,
      }
    }

    if (requestedMode === 'MAXP') {
      citations.push('S1-F050', 'S1-F051')
      return {
        mode: 'MAXP',
        splitter: 'CLOSED',
        aoaDegEffective: aeroPhysics.maxpAoaDeg(speedKmh),
        aerobrakeForced: false,
        drsDenied: false,
        citations,
      }
    }

    if (requestedMode === 'AEROBRAKE') {
      // Requested but gates failed → STANDARD (do not invent engagement).
      citations.push('S1-F041', 'S1-F021')
      return {
        mode: 'STANDARD',
        splitter: 'CLOSED',
        aoaDegEffective: ACTUATORS.standardAoaDeg,
        aerobrakeForced: false,
        drsDenied: false,
        citations,
      }
    }

    // STANDARD
    citations.push('S1-F021', 'S1-F020')
    const surface = getModeSurface('STANDARD')
    return {
      mode: 'STANDARD',
      splitter: surface.splitter,
      aoaDegEffective: ACTUATORS.standardAoaDeg,
      aerobrakeForced: false,
      drsDenied: false,
      citations,
    }
  },

  computeTelemetry(input) {
    const resolved = aeroPhysics.resolveMode(input)
    let aoaDegEffective = resolved.aoaDegEffective

    if (
      input.aoaDegOverride !== undefined &&
      resolved.mode === 'MAXP' &&
      !resolved.aerobrakeForced
    ) {
      aoaDegEffective = clampAoa(input.aoaDegOverride)
    }

    // Active surfaces use New Aero Pack; forces only at Table 3 anchor speed.
    const forces = aeroPhysics.lookupTable3Forces(input.speedKmh, 'newPack')
    const citations = [...resolved.citations, 'S1-F011', 'S1-F022'] as FactId[]
    if (forces.atTable3Anchor) {
      citations.push('S1-F013')
    }

    return {
      ...resolved,
      aoaDegEffective,
      aoaDeg: aoaDegEffective,
      dragN: forces.dragN,
      frontDownforceN: forces.frontDownforceN,
      rearDownforceN: forces.rearDownforceN,
      balanceFront: forces.balanceFront,
      citations,
    }
  },
}

/** New-pack balance at Table 3 (sanity for tests / UI footnotes). */
export const TABLE3_NEW_PACK_BALANCE_FRONT =
  aeroPhysics.computeBalanceFront(
    TABLE3_FORCES.newPack.frontDownforceN,
    TABLE3_FORCES.newPack.rearDownforceN,
  )

export { AERO_BALANCE_TARGET }
