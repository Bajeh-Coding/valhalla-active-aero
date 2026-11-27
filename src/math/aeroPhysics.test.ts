import { describe, expect, it } from 'vitest'
import {
  AEROBRAKE_TRIGGERS,
  getModeCoefficients,
  VEHICLE,
} from '@/data/vehicleConstants'
import { aeroPhysics } from './aeroPhysics'
import { useAeroStore } from '@/store/aeroStore'

/** Reference F_D from master-spec eq. 1. */
function refDragN(speedKmh: number, cd: number): number {
  const v = speedKmh / 3.6
  return 0.5 * VEHICLE.airDensityKgPerM3 * v * v * VEHICLE.frontalAreaM2 * cd
}

/** Reference F_L from master-spec eq. 2. */
function refDownforceN(speedKmh: number, cl: number): number {
  const v = speedKmh / 3.6
  return (
    0.5 *
    VEHICLE.airDensityKgPerM3 *
    v *
    v *
    VEHICLE.frontalAreaM2 *
    Math.abs(cl)
  )
}

const SPEEDS = [100, 200, 300] as const
const MODES = ['DRS', 'PASSIVE', 'MAXP', 'AEROBRAKE'] as const

describe('aeroPhysics — F_D / F_L at 100 / 200 / 300 km/h', () => {
  for (const mode of MODES) {
    const coeffs = getModeCoefficients(mode)
    for (const speedKmh of SPEEDS) {
      it(`${mode} @ ${speedKmh} km/h: exact F_D and F_L`, () => {
        const expectedFd = refDragN(speedKmh, coeffs.cd)
        const expectedFl = refDownforceN(speedKmh, coeffs.cl)

        expect(aeroPhysics.computeDragN(speedKmh, coeffs.cd)).toBe(expectedFd)
        expect(aeroPhysics.computeDownforceN(speedKmh, coeffs.cl)).toBe(
          expectedFl,
        )

        const forces = aeroPhysics.computeForces(
          speedKmh,
          coeffs.cd,
          coeffs.cl,
        )
        expect(forces.dragN).toBe(expectedFd)
        expect(forces.downforceN).toBe(expectedFl)
      })
    }
  }

  it('PASSIVE @ 100 km/h matches known reference magnitudes', () => {
    // ρ=1.225, A=2.1, C_D=0.42, C_L=-1.4
    expect(aeroPhysics.computeDragN(100, 0.42)).toBeCloseTo(416.8402777777778, 10)
    expect(aeroPhysics.computeDownforceN(100, -1.4)).toBeCloseTo(
      1389.4675925925926,
      10,
    )
  })
})

describe('aeroPhysics — CoP and C_L/C_D', () => {
  it('CoP_rear% = 50% + (AOA/25 × 12%)', () => {
    expect(aeroPhysics.computeCopRearPct(0)).toBe(50)
    expect(aeroPhysics.computeCopRearPct(10)).toBe(54.8)
    expect(aeroPhysics.computeCopRearPct(25)).toBe(62)
  })

  it('C_L/C_D for PASSIVE', () => {
    expect(aeroPhysics.computeClOverCd(-1.4, 0.42)).toBeCloseTo(-1.4 / 0.42, 12)
  })
})

describe('aeroPhysics — mode state machine', () => {
  it('Brake > 40% forces AEROBRAKE regardless of requested mode', () => {
    for (const requestedMode of MODES) {
      const resolved = aeroPhysics.resolveMode({
        requestedMode,
        speedKmh: 200,
        throttlePct: 100,
        brakePct: 40.1,
      })
      expect(resolved.mode).toBe('AEROBRAKE')
      expect(resolved.aerobrakeForced).toBe(true)
      expect(resolved.coefficients.cd).toBe(0.72)
      expect(resolved.coefficients.cl).toBe(-2.4)
      expect(resolved.splitter).toBe('CLOSED')
      expect(resolved.aoaDeg).toBe(25)
    }
  })

  it('Brake == 40% does not force AEROBRAKE (spec: > 40%)', () => {
    const resolved = aeroPhysics.resolveMode({
      requestedMode: 'PASSIVE',
      speedKmh: 100,
      throttlePct: 0,
      brakePct: AEROBRAKE_TRIGGERS.minBrakePct,
    })
    expect(resolved.mode).toBe('PASSIVE')
    expect(resolved.aerobrakeForced).toBe(false)
  })

  it('DRS engages only when speed > 90 and throttle > 70', () => {
    const denied = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 90,
      throttlePct: 70,
      brakePct: 0,
    })
    expect(denied.mode).toBe('PASSIVE')
    expect(denied.drsDenied).toBe(true)

    const ok = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 90.1,
      throttlePct: 70.1,
      brakePct: 0,
    })
    expect(ok.mode).toBe('DRS')
    expect(ok.coefficients.cd).toBe(0.31)
    expect(ok.splitter).toBe('OPEN')
    expect(ok.aoaDeg).toBe(0)
  })

  it('AEROBRAKE overrides DRS even when DRS triggers are met', () => {
    const resolved = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 250,
      throttlePct: 100,
      brakePct: 50,
    })
    expect(resolved.mode).toBe('AEROBRAKE')
    expect(resolved.aerobrakeForced).toBe(true)
  })
})

describe('useAeroStore — derived forces on input change', () => {
  it('updates F_D / F_L when speed changes in PASSIVE', () => {
    useAeroStore.setState({
      requestedMode: 'PASSIVE',
      mode: 'PASSIVE',
      speedKmh: 0,
      throttlePct: 0,
      brakePct: 0,
      aoaDeg: 10,
    })
    useAeroStore.getState().recompute()

    useAeroStore.getState().setSpeedKmh(200)
    const s = useAeroStore.getState()
    expect(s.mode).toBe('PASSIVE')
    expect(s.dragN).toBe(refDragN(200, 0.42))
    expect(s.downforceN).toBe(refDownforceN(200, -1.4))
    expect(s.copRearPct).toBe(54.8)
  })

  it('Brake > 40% forces AEROBRAKE in the store', () => {
    useAeroStore.getState().applyModeSetpoints('MAXP')
    useAeroStore.getState().setSpeedKmh(150)
    useAeroStore.getState().setBrakePct(41)

    const s = useAeroStore.getState()
    expect(s.mode).toBe('AEROBRAKE')
    expect(s.aerobrakeForced).toBe(true)
    expect(s.cd).toBe(0.72)
    expect(s.cl).toBe(-2.4)
    expect(s.aoaDeg).toBe(25)
    expect(s.splitter).toBe('CLOSED')
    expect(s.dragN).toBe(refDragN(150, 0.72))
  })
})
