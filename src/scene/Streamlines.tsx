import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useAeroStore } from '@/store'
import { pressureColorFromCd } from './modeVisuals'

const STREAM_COUNT = 48
const POINTS_PER = 28

/**
 * Tube/particle streamlines with pressure color from store C_D.
 * Cyan = low drag (DRS), amber/red = high stagnation (AEROBRAKE).
 * Motion speed scales with vehicle speed — no physics reimplementation.
 */
export function Streamlines() {
  const cd = useAeroStore((s) => s.cd)
  const speedKmh = useAeroStore((s) => s.speedKmh)
  const mode = useAeroStore((s) => s.mode)
  const group = useRef<THREE.Group>(null)

  const paths = useMemo(() => buildStreamPaths(), [])

  const color = useMemo(() => new THREE.Color(pressureColorFromCd(cd)), [cd])
  const turbulence = mode === 'AEROBRAKE' ? 0.35 : mode === 'DRS' ? 0.05 : 0.15

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    // Visual flow: always some motion for hero; scales with speed.
    const flow = (Math.max(speedKmh, 35) / 120) * delta
    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      const phase = (state.clock.elapsedTime * (0.4 + (i % 7) * 0.05) + i * 0.13) % 1
      const path = paths[i]
      if (!path || !mesh) return
      const idx = Math.min(POINTS_PER - 2, Math.floor(phase * (POINTS_PER - 1)))
      const localT = phase * (POINTS_PER - 1) - idx
      const a = path[idx]
      const b = path[idx + 1]
      if (!a || !b) return
      mesh.position.set(
        a.x + (b.x - a.x) * localT + Math.sin(state.clock.elapsedTime * 3 + i) * turbulence * 0.08,
        a.y + (b.y - a.y) * localT,
        a.z + (b.z - a.z) * localT - flow * 8,
      )
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.color.copy(color)
      mat.emissive.copy(color)
      mat.emissiveIntensity = 0.45 + turbulence * 0.4
    })
  })

  return (
    <group ref={group}>
      {paths.map((path, i) => (
        <mesh key={i} position={[path[0]!.x, path[0]!.y, path[0]!.z]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
      {paths.map((path, i) => (
        <StreamTube key={`tube-${i}`} points={path} color={color} opacity={0.22} />
      ))}
    </group>
  )
}

function StreamTube({
  points,
  color,
  opacity,
}: {
  points: THREE.Vector3[]
  color: THREE.Color
  opacity: number
}) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  return (
    <mesh>
      <tubeGeometry args={[curve, 40, 0.012, 5, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  )
}

function buildStreamPaths(): THREE.Vector3[][] {
  const paths: THREE.Vector3[][] = []
  for (let i = 0; i < STREAM_COUNT; i++) {
    const lane = (i % 8) - 3.5
    const height = 0.15 + (Math.floor(i / 8) % 6) * 0.22
    const sideBias = lane * 0.28
    const pts: THREE.Vector3[] = []
    for (let p = 0; p < POINTS_PER; p++) {
      const t = p / (POINTS_PER - 1)
      const z = 5.5 - t * 11
      // Gentle wrap around body / wing region
      let x = sideBias
      let y = height
      if (z < 2.5 && z > -2.5) {
        const body = 1 - Math.abs(z) / 2.5
        x += Math.sign(sideBias || 1) * body * 0.55
        y += body * 0.25
      }
      if (z < -1.5) {
        // Upwash near rear wing
        y += ((-1.5 - z) / 4) * 0.5
      }
      pts.push(new THREE.Vector3(x, y, z))
    }
    paths.push(pts)
  }
  return paths
}
