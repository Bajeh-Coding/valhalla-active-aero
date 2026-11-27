import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useAeroStore } from '@/store'
import { streamlineColorForMode } from './modeVisuals'

const STREAM_COUNT = 36
const POINTS_PER = 24

/**
 * Lightweight 3D stream tubes complementary to the 2D CFD overlay.
 * Mode colors: DRS cyan / MAXP lime / AEROBRAKE crimson.
 */
export function Streamlines() {
  const mode = useAeroStore((s) => s.mode)
  const speedKmh = useAeroStore((s) => s.speedKmh)
  const group = useRef<THREE.Group>(null)

  const paths = useMemo(() => buildStreamPaths(), [])
  const color = useMemo(() => new THREE.Color(streamlineColorForMode(mode)), [mode])
  const turbulence = mode === 'AEROBRAKE' ? 0.4 : mode === 'DRS' ? 0.04 : 0.14

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const flow = (Math.max(speedKmh, 35) / 120) * delta
    g.children.forEach((child, i) => {
      if (child.type !== 'Mesh' || !child.name.startsWith('particle')) return
      const mesh = child as THREE.Mesh
      const phase = (state.clock.elapsedTime * (0.45 + (i % 7) * 0.05) + i * 0.13) % 1
      const path = paths[i]
      if (!path) return
      const idx = Math.min(POINTS_PER - 2, Math.floor(phase * (POINTS_PER - 1)))
      const localT = phase * (POINTS_PER - 1) - idx
      const a = path[idx]
      const b = path[idx + 1]
      if (!a || !b) return
      mesh.position.set(
        a.x + (b.x - a.x) * localT + Math.sin(state.clock.elapsedTime * 3 + i) * turbulence * 0.1,
        a.y + (b.y - a.y) * localT,
        a.z + (b.z - a.z) * localT - flow * 6,
      )
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.color.copy(color)
      mat.emissive.copy(color)
      mat.emissiveIntensity = 0.55 + turbulence * 0.35
    })
  })

  return (
    <group ref={group}>
      {paths.map((path, i) => (
        <mesh
          key={i}
          name={`particle-${i}`}
          position={[path[0]!.x, path[0]!.y, path[0]!.z]}
        >
          <sphereGeometry args={[0.028, 6, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}
      {paths.map((path, i) => (
        <StreamTube key={`tube-${i}`} points={path} color={color} opacity={0.14} />
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
      <tubeGeometry args={[curve, 32, 0.01, 4, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function buildStreamPaths(): THREE.Vector3[][] {
  const paths: THREE.Vector3[][] = []
  for (let i = 0; i < STREAM_COUNT; i++) {
    const lane = (i % 6) - 2.5
    const height = 0.12 + (Math.floor(i / 6) % 6) * 0.2
    const sideBias = lane * 0.32
    const pts: THREE.Vector3[] = []
    for (let p = 0; p < POINTS_PER; p++) {
      const t = p / (POINTS_PER - 1)
      const z = 5.2 - t * 10.5
      let x = sideBias
      let y = height
      // Splitter region
      if (z > 2.0) {
        y = Math.min(y, 0.18 + height * 0.3)
      }
      // Body wrap
      if (z < 2.3 && z > -2.3) {
        const body = 1 - Math.abs(z) / 2.3
        x += Math.sign(sideBias || 1) * body * 0.5
        y += body * 0.28
      }
      // Roof rise
      if (z < 1.2 && z > -0.8) {
        y += 0.18
      }
      // Wing upwash
      if (z < -1.4) {
        y += ((-1.4 - z) / 3.5) * 0.55
      }
      pts.push(new THREE.Vector3(x, y, z))
    }
    paths.push(pts)
  }
  return paths
}
