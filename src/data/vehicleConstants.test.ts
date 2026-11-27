import { describe, expect, it } from 'vitest'
import {
  ACTUATORS,
  AEROBRAKE_TRIGGERS,
  AERO_BALANCE_TARGET,
  DRS_TRIGGERS,
  FRICTION_SATURATION,
  LAP_TIME,
  MAXP_SCHEDULE,
  MODE_SURFACES,
  S2_SIM_VEHICLE,
  TABLE3_FORCES,
  TABLE3_SPEED_KMH,
  VEHICLE,
  getModeSurface,
} from './vehicleConstants'

describe('vehicleConstants — S1 Table 1 lock', () => {
  it('locks sprung/unsprung/power/geometry (S1-F002)', () => {
    expect(VEHICLE.sprungMassKg).toBe(2050)
    expect(VEHICLE.unsprungMassKg).toBe(190)
    expect(VEHICLE.totalMassKg).toBe(2240)
    expect(VEHICLE.totalSystemPowerKw).toBe(1257)
    expect(VEHICLE.frontalAreaM2).toBe(2.1)
    expect(VEHICLE.wheelbaseMm).toBe(2691)
    expect(VEHICLE.cogToFrontMm).toBe(1369)
    expect(VEHICLE.cogHeightMm).toBe(378)
    expect(VEHICLE.frontTrackMm).toBe(1700)
    expect(VEHICLE.rearTrackMm).toBe(1620)
    expect(VEHICLE.frontTireRadiusMm).toBe(352)
    expect(VEHICLE.rearTireRadiusMm).toBe(364)
  })

  it('derives mass distribution from a,L — not invent 43/57', () => {
    expect(VEHICLE.massDistributionFrontPct).toBeCloseTo((1322 / 2691) * 100, 10)
    expect(VEHICLE.massDistributionRearPct).toBeCloseTo((1369 / 2691) * 100, 10)
    expect(VEHICLE.massDistributionFrontPct).not.toBe(43)
  })

  it('never mixes S2 Table 7 into VEHICLE (S2-F040)', () => {
    expect(VEHICLE.sprungMassKg).not.toBe(S2_SIM_VEHICLE.massKg)
    expect(S2_SIM_VEHICLE.massKg).toBe(1680)
    expect(S2_SIM_VEHICLE.yawInertiaKgM2).toBe(2600)
  })
})

describe('vehicleConstants — Table 3 + actuators + triggers', () => {
  it('locks Table 3 @160 km/h (S1-F011)', () => {
    expect(TABLE3_SPEED_KMH).toBe(160)
    expect(TABLE3_FORCES.original).toEqual({
      dragN: 752,
      frontDownforceN: 370,
      rearDownforceN: -126,
    })
    expect(TABLE3_FORCES.newPack).toEqual({
      dragN: 788,
      frontDownforceN: 470,
      rearDownforceN: 467,
    })
    expect(AERO_BALANCE_TARGET).toBe(0.5)
  })

  it('locks AOA set-points (S1-F021/032/040)', () => {
    expect(ACTUATORS.aoaMinDeg).toBe(0)
    expect(ACTUATORS.aoaMaxDeg).toBe(25)
    expect(ACTUATORS.standardAoaDeg).toBe(6)
    expect(ACTUATORS.drsAoaDeg).toBe(0)
    expect(ACTUATORS.aerobrakeAoaDeg).toBe(19)
  })

  it('locks DRS / Aerobrake paper triggers (not DRS@90)', () => {
    expect(DRS_TRIGGERS.minSpeedKmh).toBe(70)
    expect(DRS_TRIGGERS.splitterOpenKmh).toBe(110)
    expect(DRS_TRIGGERS.wingRampEndKmh).toBe(120)
    expect(DRS_TRIGGERS.minThrottlePct).toBe(70)
    expect(DRS_TRIGGERS.maxAbsAyG).toBe(1)
    expect(AEROBRAKE_TRIGGERS.minSpeedKmh).toBe(70)
    expect(AEROBRAKE_TRIGGERS.minBrakePct).toBe(40)
    expect(AEROBRAKE_TRIGGERS.maxAbsAyG).toBe(1)
  })

  it('locks mode surfaces without C_D/C_L', () => {
    expect(MODE_SURFACES).toHaveLength(4)
    expect(getModeSurface('DRS')).toMatchObject({
      aoaDeg: 0,
      splitter: 'OPEN',
    })
    expect(getModeSurface('STANDARD')).toMatchObject({
      aoaDeg: 6,
      splitter: 'CLOSED',
    })
    expect(getModeSurface('MAXP')).toMatchObject({
      aoaDeg: 'schedule',
      splitter: 'CLOSED',
    })
    expect(getModeSurface('AEROBRAKE')).toMatchObject({
      aoaDeg: 19,
      splitter: 'CLOSED',
    })
    for (const m of MODE_SURFACES) {
      expect(m).not.toHaveProperty('cd')
      expect(m).not.toHaveProperty('cl')
    }
  })

  it('locks MaxP schedule bands (S1-F051)', () => {
    expect(MAXP_SCHEDULE).toEqual([
      { minKmh: 100, maxKmh: 180, aoaDeg: 0 },
      { minKmh: 180, maxKmh: 250, aoaDeg: 3, exclusiveMin: true },
      { minKmh: 250, maxKmh: 300, aoaDeg: 4.5, exclusiveMin: true },
    ])
  })

  it('locks lap deltas with DIL step label (S1-F071)', () => {
    expect(LAP_TIME.maxPVsPassiveDeltaS).toBe(-2.55)
    expect(LAP_TIME.gripMaxPVsPassiveOriginalDeltaS).toBe(-3.114)
    expect(LAP_TIME.dilMaxPVsPassiveOriginalDeltaS).toBe(-5.76)
  })

  it('flags Eq.25 factor 2 as medium confidence (S2-F015)', () => {
    expect(FRICTION_SATURATION.printedDenominatorFactor).toBe(2)
    expect(FRICTION_SATURATION.confidence).toBe('medium')
    expect(FRICTION_SATURATION.factId).toBe('S2-F015')
  })
})

describe('S1 vehicle vs S2 sim — never mix', () => {
  it('keeps S1 sprung mass distinct from S2 Table 7', () => {
    expect(VEHICLE.sprungMassKg).toBe(2050)
    expect(S2_SIM_VEHICLE.massKg).toBe(1680)
    expect(VEHICLE.sprungMassKg).not.toBe(S2_SIM_VEHICLE.massKg)
  })
})
