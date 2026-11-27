import { describe, expect, it } from 'vitest'
import { aeroPhysicsStub } from './aeroPhysics'

/** Smoke: stub is exported and refuses fabricated results until Phase 2. */
describe('aeroPhysicsStub', () => {
  it('throws on computeDragN until Phase 2 implements it', () => {
    expect(() => aeroPhysicsStub.computeDragN(100, 0.42)).toThrow(/Phase 2/)
  })
})
