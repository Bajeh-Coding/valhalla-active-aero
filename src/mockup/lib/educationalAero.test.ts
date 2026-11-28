import { describe, expect, it } from 'vitest'
import { ACTUATORS } from '@/data/vehicleConstants'
import { aeroPhysics } from '@/math/aeroPhysics'
import { educationalIndices, scheduleAoaPoints } from './educationalAero'

describe('educationalIndices', () => {
  it('keeps indices in 0…1 and Aerobrake drag higher than DRS', () => {
    const aero = educationalIndices(
      ACTUATORS.aerobrakeAoaDeg,
      'CLOSED',
      'AEROBRAKE',
    )
    const drs = educationalIndices(ACTUATORS.drsAoaDeg, 'OPEN', 'DRS')
    expect(aero.dragIndex).toBeGreaterThan(drs.dragIndex)
    expect(aero.dragIndex).toBeLessThanOrEqual(1)
    expect(drs.frontDfIndex).toBeLessThan(aero.frontDfIndex)
  })

  it('does not invent absolute Newton forces', () => {
    const idx = educationalIndices(6, 'CLOSED', 'STANDARD')
    expect(idx.disclaimer).toMatch(/nu forțe absolute OEM/i)
    expect(Object.values(idx).every((v) => typeof v !== 'number' || v <= 1)).toBe(
      true,
    )
  })
})

describe('scheduleAoaPoints', () => {
  it('follows MaxP paper bands', () => {
    const pts = scheduleAoaPoints(
      'MAXP',
      aeroPhysics.maxpAoaDeg,
      aeroPhysics.drsWingAoaDeg,
    )
    const at200 = pts.find((p) => p.speedKmh === 200)
    expect(at200?.aoaDeg).toBe(3)
  })
})
