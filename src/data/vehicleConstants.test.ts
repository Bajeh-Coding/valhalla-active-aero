import { describe, expect, it } from 'vitest'
import {
  ACTUATORS,
  AEROBRAKE_TRIGGERS,
  COP,
  DRS_TRIGGERS,
  getModeCoefficients,
  LAP_TIME,
  MODE_COEFFICIENTS,
  PI_ROM,
  VEHICLE,
} from './vehicleConstants'

/** Guard: master-spec constants must not drift. */
describe('vehicleConstants — master-spec lock', () => {
  it('locks vehicle / atmosphere numbers', () => {
    expect(VEHICLE.sprungMassKg).toBe(2050)
    expect(VEHICLE.totalMassKg).toBe(2240)
    expect(VEHICLE.totalSystemPowerKw).toBe(1257)
    expect(VEHICLE.frontalAreaM2).toBe(2.1)
    expect(VEHICLE.wheelbaseMm).toBe(2691)
    expect(VEHICLE.massDistributionFrontPct).toBe(43)
    expect(VEHICLE.massDistributionRearPct).toBe(57)
    expect(VEHICLE.airDensityKgPerM3).toBe(1.225)
  })

  it('locks actuator and trigger thresholds', () => {
    expect(ACTUATORS.aoaMinDeg).toBe(0)
    expect(ACTUATORS.aoaMaxDeg).toBe(25)
    expect(ACTUATORS.aoaActuationSpeedDegPerS).toBe(15)
    expect(DRS_TRIGGERS.minSpeedKmh).toBe(90)
    expect(DRS_TRIGGERS.minThrottlePct).toBe(70)
    expect(AEROBRAKE_TRIGGERS.minBrakePct).toBe(40)
  })

  it('locks mode coefficient table', () => {
    expect(MODE_COEFFICIENTS).toHaveLength(4)
    expect(getModeCoefficients('DRS')).toMatchObject({
      aoaDeg: 0,
      splitter: 'OPEN',
      cd: 0.31,
      cl: -0.8,
    })
    expect(getModeCoefficients('PASSIVE')).toMatchObject({
      aoaDeg: 10,
      splitter: 'CLOSED',
      cd: 0.42,
      cl: -1.4,
    })
    expect(getModeCoefficients('MAXP')).toMatchObject({
      aoaDeg: { min: 5, max: 18 },
      splitter: 'CLOSED',
      cd: 0.48,
      cl: -1.9,
    })
    expect(getModeCoefficients('AEROBRAKE')).toMatchObject({
      aoaDeg: 25,
      splitter: 'CLOSED',
      cd: 0.72,
      cl: -2.4,
    })
  })

  it('locks CoP, lap delta, PI-ROM', () => {
    expect(COP).toEqual({
      baselineRearPct: 50,
      aoaSpanDeg: 25,
      aoaGainPct: 12,
    })
    expect(LAP_TIME.maxPVsPassiveDeltaS).toBe(-2.55)
    expect(PI_ROM.inferenceBudgetMs).toBe(1)
    expect(PI_ROM.speedupFactor).toBe(26.58)
  })
})
