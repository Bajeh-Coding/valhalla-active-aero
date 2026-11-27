import { describe, expect, it } from 'vitest'
import {
  ACTUATORS,
  AEROBRAKE_TRIGGERS,
  FRICTION_SATURATION,
  TABLE3_FORCES,
  TABLE3_SPEED_KMH,
} from '@/data/vehicleConstants'
import { aeroPhysics, TABLE3_NEW_PACK_BALANCE_FRONT } from './aeroPhysics'
import { useAeroStore } from '@/store/aeroStore'

const MODES = ['DRS', 'STANDARD', 'MAXP', 'AEROBRAKE'] as const

describe('aeroPhysics — Table 3 force anchor (no ½ρv²)', () => {
  it('returns exact New Pack forces only at 160 km/h', () => {
    const at = aeroPhysics.lookupTable3Forces(TABLE3_SPEED_KMH, 'newPack')
    expect(at.atTable3Anchor).toBe(true)
    expect(at.dragN).toBe(788)
    expect(at.frontDownforceN).toBe(470)
    expect(at.rearDownforceN).toBe(467)
    expect(at.balanceFront).toBeCloseTo(470 / (470 + 467), 12)
  })

  it('returns exact Original forces at 160 km/h', () => {
    const at = aeroPhysics.lookupTable3Forces(160, 'original')
    expect(at.dragN).toBe(752)
    expect(at.frontDownforceN).toBe(370)
    expect(at.rearDownforceN).toBe(-126)
    // total DF = 244 > 0
    expect(at.balanceFront).toBeCloseTo(370 / 244, 12)
  })

  it('returns null forces away from 160 km/h (no invented scaling)', () => {
    for (const v of [0, 100, 159, 161, 200, 300]) {
      const f = aeroPhysics.lookupTable3Forces(v, 'newPack')
      expect(f.dragN).toBeNull()
      expect(f.frontDownforceN).toBeNull()
      expect(f.rearDownforceN).toBeNull()
      expect(f.balanceFront).toBeNull()
      expect(f.atTable3Anchor).toBe(false)
    }
  })

  it('new-pack balance is near target 0.5', () => {
    expect(TABLE3_NEW_PACK_BALANCE_FRONT).toBeCloseTo(470 / 937, 12)
    expect(TABLE3_NEW_PACK_BALANCE_FRONT!).toBeGreaterThan(0.49)
    expect(TABLE3_NEW_PACK_BALANCE_FRONT!).toBeLessThan(0.51)
  })
})

describe('aeroPhysics — MaxP schedule (S1-F051)', () => {
  it('maps speed bands to 0° / 3° / 4.5°', () => {
    expect(aeroPhysics.maxpAoaDeg(99)).toBe(ACTUATORS.standardAoaDeg)
    expect(aeroPhysics.maxpAoaDeg(100)).toBe(0)
    expect(aeroPhysics.maxpAoaDeg(180)).toBe(0)
    expect(aeroPhysics.maxpAoaDeg(180.1)).toBe(3)
    expect(aeroPhysics.maxpAoaDeg(250)).toBe(3)
    expect(aeroPhysics.maxpAoaDeg(250.1)).toBe(4.5)
    expect(aeroPhysics.maxpAoaDeg(300)).toBe(4.5)
  })
})

describe('aeroPhysics — DRS wing ramp (S1-F034)', () => {
  it('ramps AOA 6°→0° on 70–120 km/h', () => {
    expect(aeroPhysics.drsWingAoaDeg(70)).toBeCloseTo(6, 10)
    expect(aeroPhysics.drsWingAoaDeg(95)).toBeCloseTo(3, 10)
    expect(aeroPhysics.drsWingAoaDeg(120)).toBe(0)
    expect(aeroPhysics.drsWingAoaDeg(150)).toBe(0)
  })
})

describe('aeroPhysics — state machine', () => {
  it('Brake ≥ 40% + v≥70 + |ay|≤1g forces AEROBRAKE @ 19°', () => {
    for (const requestedMode of MODES) {
      const resolved = aeroPhysics.resolveMode({
        requestedMode,
        speedKmh: 200,
        throttlePct: 100,
        brakePct: 40,
        ayG: 0.5,
      })
      expect(resolved.mode).toBe('AEROBRAKE')
      expect(resolved.aerobrakeForced).toBe(true)
      expect(resolved.splitter).toBe('CLOSED')
      expect(resolved.aoaDegEffective).toBe(19)
    }
  })

  it('Aerobrake denied when |ay| > 1 g', () => {
    const resolved = aeroPhysics.resolveMode({
      requestedMode: 'AEROBRAKE',
      speedKmh: 200,
      throttlePct: 0,
      brakePct: 50,
      ayG: 1.01,
    })
    expect(resolved.mode).toBe('STANDARD')
    expect(resolved.aoaDegEffective).toBe(6)
  })

  it('Aerobrake denied when v < 70', () => {
    const resolved = aeroPhysics.resolveMode({
      requestedMode: 'STANDARD',
      speedKmh: 69.9,
      throttlePct: 0,
      brakePct: 50,
      ayG: 0,
    })
    expect(resolved.mode).toBe('STANDARD')
    expect(resolved.aerobrakeForced).toBe(false)
  })

  it('DRS denied below paper gates → STANDARD', () => {
    const denied = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 69.9,
      throttlePct: 70,
      brakePct: 0,
      ayG: 0,
    })
    expect(denied.mode).toBe('STANDARD')
    expect(denied.drsDenied).toBe(true)
    expect(denied.aoaDegEffective).toBe(6)

    const throttleLow = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 120,
      throttlePct: 69.9,
      brakePct: 0,
      ayG: 0,
    })
    expect(throttleLow.drsDenied).toBe(true)
  })

  it('DRS engages with splitter@110 and wing ramp', () => {
    const mid = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 100,
      throttlePct: 70,
      brakePct: 0,
      ayG: 0,
    })
    expect(mid.mode).toBe('DRS')
    expect(mid.splitter).toBe('CLOSED') // < 110
    expect(mid.aoaDegEffective).toBeCloseTo(2.4, 10) // 6→0 over 70–120; at 100: 6*(1-30/50)=2.4

    const open = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 110,
      throttlePct: 70,
      brakePct: 0,
      ayG: 0,
    })
    expect(open.splitter).toBe('OPEN')
    expect(open.aoaDegEffective).toBeCloseTo(1.2, 10)

    const full = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 130,
      throttlePct: 80,
      brakePct: 0,
      ayG: 0,
    })
    expect(full.splitter).toBe('OPEN')
    expect(full.aoaDegEffective).toBe(0)
  })

  it('DRS denied when |ay| > 1 g', () => {
    const resolved = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 150,
      throttlePct: 100,
      brakePct: 0,
      ayG: -1.1,
    })
    expect(resolved.mode).toBe('STANDARD')
    expect(resolved.drsDenied).toBe(true)
  })

  it('AEROBRAKE overrides DRS when brake gates met', () => {
    const resolved = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 250,
      throttlePct: 100,
      brakePct: 50,
      ayG: 0,
    })
    expect(resolved.mode).toBe('AEROBRAKE')
    expect(resolved.aoaDegEffective).toBe(19)
  })

  it('MaxP uses schedule when DRS/Aerobrake off', () => {
    const r = aeroPhysics.resolveMode({
      requestedMode: 'MAXP',
      speedKmh: 200,
      throttlePct: 50,
      brakePct: 0,
      ayG: 0,
    })
    expect(r.mode).toBe('MAXP')
    expect(r.aoaDegEffective).toBe(3)
    expect(r.splitter).toBe('CLOSED')
  })

  it('STANDARD setup is AOA 6° closed splitter', () => {
    const r = aeroPhysics.resolveMode({
      requestedMode: 'STANDARD',
      speedKmh: 160,
      throttlePct: 0,
      brakePct: 0,
      ayG: 0,
    })
    expect(r.mode).toBe('STANDARD')
    expect(r.aoaDegEffective).toBe(6)
    expect(r.splitter).toBe('CLOSED')
  })
})

describe('aeroPhysics — Eq.25 saturation (S2-F015)', () => {
  it('uses printed factor 2', () => {
    expect(FRICTION_SATURATION.printedDenominatorFactor).toBe(2)
    expect(FRICTION_SATURATION.confidence).toBe('medium')
    // Fz=8000, Fx=1000, Fy=0 → 8000/(2*1000)=4
    expect(aeroPhysics.computeSaturationFactor(8000, 1000, 0)).toBe(4)
  })
})

describe('useAeroStore — paper-exact derived state', () => {
  it('exposes Table 3 forces at 160 km/h in STANDARD', () => {
    useAeroStore.setState({
      requestedMode: 'STANDARD',
      mode: 'STANDARD',
      speedKmh: 0,
      throttlePct: 0,
      brakePct: 0,
      ayG: 0,
      aoaDeg: 6,
    })
    useAeroStore.getState().recompute()
    useAeroStore.getState().setSpeedKmh(160)

    const s = useAeroStore.getState()
    expect(s.mode).toBe('STANDARD')
    expect(s.dragN).toBe(TABLE3_FORCES.newPack.dragN)
    expect(s.frontDownforceN).toBe(470)
    expect(s.rearDownforceN).toBe(467)
    expect(s.balanceFront).toBeCloseTo(470 / 937, 12)
    expect(s.aoaDegEffective).toBe(6)
    // no invented cd/cl on store
    expect(s).not.toHaveProperty('cd')
    expect(s).not.toHaveProperty('controlLoopHz')
  })

  it('forces null away from Table 3 anchor', () => {
    useAeroStore.getState().applyModeSetpoints('STANDARD')
    useAeroStore.getState().setSpeedKmh(200)
    const s = useAeroStore.getState()
    expect(s.dragN).toBeNull()
    expect(s.frontDownforceN).toBeNull()
  })

  it('Brake ≥ 40% forces AEROBRAKE 19° in the store', () => {
    useAeroStore.getState().applyModeSetpoints('MAXP')
    useAeroStore.getState().setSpeedKmh(150)
    useAeroStore.getState().setAyG(0)
    useAeroStore.getState().setBrakePct(40)

    const s = useAeroStore.getState()
    expect(s.mode).toBe('AEROBRAKE')
    expect(s.aerobrakeForced).toBe(true)
    expect(s.aoaDegEffective).toBe(19)
    expect(s.splitter).toBe('CLOSED')
  })

  it('ayG gate blocks DRS', () => {
    useAeroStore.getState().applyModeSetpoints('DRS')
    useAeroStore.getState().setSpeedKmh(150)
    useAeroStore.getState().setThrottlePct(80)
    useAeroStore.getState().setBrakePct(0)
    useAeroStore.getState().setAyG(1.2)

    const s = useAeroStore.getState()
    expect(s.mode).toBe('STANDARD')
    expect(s.drsDenied).toBe(true)
  })
})

describe('legacy invent guards', () => {
  it('does not use Aerobrake AOA 25 or DRS@90', () => {
    expect(ACTUATORS.aerobrakeAoaDeg).not.toBe(25)
    expect(AEROBRAKE_TRIGGERS.minBrakePct).toBe(40)
    const deniedAt90 = aeroPhysics.resolveMode({
      requestedMode: 'DRS',
      speedKmh: 90,
      throttlePct: 70.1,
      brakePct: 0,
      ayG: 0,
    })
    // 90 ≥ 70 → DRS engages under new paper rules (old invent was >90)
    expect(deniedAt90.mode).toBe('DRS')
  })
})
