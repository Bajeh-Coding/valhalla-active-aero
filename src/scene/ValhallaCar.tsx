import { useAeroStore } from '@/store'
import { MODE_COLORS } from './modeVisuals'

const BODY = '#1a1f2e'
const ACCENT = '#0e7490'
const GLASS = '#0f172a'

/**
 * Procedural stylized Valhalla-like hypercar.
 * Rear wing AOA and front splitter elevation driven exclusively by `useAeroStore`.
 */
export function ValhallaCar() {
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const splitter = useAeroStore((s) => s.splitter)
  const mode = useAeroStore((s) => s.mode)
  const colors = MODE_COLORS[mode]

  // Spec: CLOSED = max downforce (low), OPEN = low-drag undertray (raised).
  const splitterY = splitter === 'OPEN' ? 0.12 : 0.02
  const aoaRad = (aoaDeg * Math.PI) / 180

  return (
    <group position={[0, 0, 0]}>
      {/* Main body tub */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.85, 0.42, 4.2]} />
        <meshStandardMaterial color={BODY} metalness={0.85} roughness={0.28} />
      </mesh>

      {/* Cabin canopy */}
      <mesh position={[0, 0.72, 0.15]} castShadow>
        <boxGeometry args={[1.35, 0.38, 1.6]} />
        <meshStandardMaterial
          color={GLASS}
          metalness={0.4}
          roughness={0.15}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.32, 2.0]} castShadow>
        <boxGeometry args={[1.55, 0.28, 0.9]} />
        <meshStandardMaterial color={BODY} metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.28, 2.45]} castShadow>
        <boxGeometry args={[1.2, 0.18, 0.45]} />
        <meshStandardMaterial color={BODY} metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Rear deck */}
      <mesh position={[0, 0.48, -1.7]} castShadow>
        <boxGeometry args={[1.7, 0.22, 1.1]} />
        <meshStandardMaterial color={BODY} metalness={0.82} roughness={0.3} />
      </mesh>

      {/* Side pods */}
      <mesh position={[-0.95, 0.28, -0.2]} castShadow>
        <boxGeometry args={[0.28, 0.35, 2.4]} />
        <meshStandardMaterial color={ACCENT} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.95, 0.28, -0.2]} castShadow>
        <boxGeometry args={[0.28, 0.35, 2.4]} />
        <meshStandardMaterial color={ACCENT} metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Wheels */}
      <Wheel position={[-0.85, 0.32, 1.35]} />
      <Wheel position={[0.85, 0.32, 1.35]} />
      <Wheel position={[-0.9, 0.34, -1.45]} />
      <Wheel position={[0.9, 0.34, -1.45]} />

      {/* Front splitter — binary elevation */}
      <group position={[0, splitterY, 2.55]}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.04, 0.55]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.6}
            roughness={0.35}
            emissive={colors.emissive}
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0, 0.02, -0.15]}>
          <boxGeometry args={[1.55, 0.02, 0.2]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* Active rear wing — AOA about local X (pitch) */}
      <group position={[0, 0.78, -2.15]} rotation={[aoaRad, 0, 0]}>
        {/* Endplates */}
        <mesh position={[-0.85, 0.12, 0]} castShadow>
          <boxGeometry args={[0.05, 0.35, 0.45]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.85, 0.12, 0]} castShadow>
          <boxGeometry args={[0.05, 0.35, 0.45]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Main plane */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[1.7, 0.05, 0.4]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.55}
            roughness={0.3}
            emissive={colors.emissive}
            emissiveIntensity={0.35}
          />
        </mesh>
        {/* Struts */}
        <mesh position={[-0.45, -0.15, 0.05]}>
          <boxGeometry args={[0.06, 0.35, 0.06]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.45, -0.15, 0.05]}>
          <boxGeometry args={[0.06, 0.35, 0.06]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Underbody diffuser hint */}
      <mesh position={[0, 0.08, -1.9]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.8]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.45} />
      </mesh>
    </group>
  )
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.24, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  )
}
