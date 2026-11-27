import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useAeroStore } from '@/store'

/**
 * Visual F_D (crimson, rearward +Z) / F_L (cyan, downward −Y) from store forces.
 * Magnitudes for display only — values come from Phase 2 engine.
 */
export function ForceVectors() {
  const dragN = useAeroStore((s) => s.dragN) ?? 0
  const frontDf = useAeroStore((s) => s.frontDownforceN)
  const rearDf = useAeroStore((s) => s.rearDownforceN)
  const downforceN =
    frontDf != null && rearDf != null ? frontDf + rearDf : 0

  const dragLen = useMemo(() => Math.min(2.4, dragN / 2800), [dragN])
  const liftLen = useMemo(() => Math.min(2.4, downforceN / 4500), [downforceN])

  if (dragN < 1 && downforceN < 1) return null

  return (
    <group>
      <OrientedArrow
        origin={[1.35, 0.85, -0.2]}
        direction={[0, 0, 1]}
        length={Math.max(0.25, dragLen)}
        color="#FF3B30"
      />
      <OrientedArrow
        origin={[-1.35, 1.15, 0.2]}
        direction={[0, -1, 0]}
        length={Math.max(0.25, liftLen)}
        color="#00F0FF"
      />
    </group>
  )
}

function OrientedArrow({
  origin,
  direction,
  length,
  color,
}: {
  origin: [number, number, number]
  direction: [number, number, number]
  length: number
  color: string
}) {
  const group = useRef<THREE.Group>(null)
  const dir = useMemo(() => new THREE.Vector3(...direction).normalize(), [direction])

  useLayoutEffect(() => {
    if (!group.current) return
    const quat = new THREE.Quaternion()
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    group.current.quaternion.copy(quat)
  }, [dir])

  const shaft = Math.max(0.05, length - 0.18)

  return (
    <group position={origin}>
      <group ref={group}>
        <mesh position={[0, shaft / 2, 0]}>
          <cylinderGeometry args={[0.028, 0.028, shaft, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.65}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, shaft + 0.09, 0]}>
          <coneGeometry args={[0.075, 0.18, 10]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.75}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}
