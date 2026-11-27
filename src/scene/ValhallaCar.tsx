import { useAeroStore } from '@/store'
import { MODE_COLORS } from './modeVisuals'

const BODY = '#0a0c10'
const BODY_HIGHLIGHT = '#12161e'
const GLASS = '#0b1620'
const AMR = '#005949'
const AMR_DEEP = '#004225'
const LIME = '#C4DF00'
const TITANIUM = '#8a93a0'

/**
 * Cinematic Valhalla silhouette — refined hypercar proportions,
 * AMR green accents, active wing/splitter from `useAeroStore` only.
 */
export function ValhallaCar() {
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const splitter = useAeroStore((s) => s.splitter)
  const mode = useAeroStore((s) => s.mode)
  const colors = MODE_COLORS[mode]

  const splitterY = splitter === 'OPEN' ? 0.12 : 0.02
  const aoaRad = (aoaDeg * Math.PI) / 180

  return (
    <group position={[0, 0, 0]}>
      {/* Underbody shadow disc */}
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.4, 2.4, 1]}
        receiveShadow
      >
        <circleGeometry args={[1, 48]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* Main body tub — elongated */}
      <mesh position={[0, 0.36, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.78, 0.38, 4.35]} />
        <meshStandardMaterial
          color={BODY}
          metalness={0.92}
          roughness={0.22}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Sculpted upper deck */}
      <mesh position={[0, 0.58, 0.05]} castShadow>
        <boxGeometry args={[1.55, 0.16, 3.6]} />
        <meshStandardMaterial color={BODY_HIGHLIGHT} metalness={0.9} roughness={0.18} />
      </mesh>

      {/* Cabin canopy — low glasshouse */}
      <mesh position={[0, 0.78, 0.2]} castShadow>
        <boxGeometry args={[1.22, 0.32, 1.55]} />
        <meshPhysicalMaterial
          color={GLASS}
          metalness={0.15}
          roughness={0.08}
          transmission={0.35}
          thickness={0.4}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Windscreen rake hint */}
      <mesh position={[0, 0.72, 0.95]} rotation={[-0.35, 0, 0]} castShadow>
        <boxGeometry args={[1.15, 0.04, 0.55]} />
        <meshStandardMaterial
          color="#0e1a24"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0.3, 2.05]} castShadow>
        <boxGeometry args={[1.48, 0.26, 0.85]} />
        <meshStandardMaterial color={BODY} metalness={0.94} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.26, 2.48]} castShadow>
        <boxGeometry args={[1.1, 0.16, 0.42]} />
        <meshStandardMaterial color={BODY} metalness={0.95} roughness={0.18} />
      </mesh>

      {/* AMR green accent stripe — brand signal */}
      <mesh position={[0, 0.56, 0.1]}>
        <boxGeometry args={[0.06, 0.02, 3.8]} />
        <meshStandardMaterial
          color={LIME}
          emissive={AMR}
          emissiveIntensity={0.55}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>

      {/* Rear deck */}
      <mesh position={[0, 0.5, -1.75]} castShadow>
        <boxGeometry args={[1.62, 0.2, 1.05]} />
        <meshStandardMaterial color={BODY_HIGHLIGHT} metalness={0.88} roughness={0.24} />
      </mesh>

      {/* Side pods — AMR deep green */}
      <mesh position={[-0.92, 0.28, -0.15]} castShadow>
        <boxGeometry args={[0.26, 0.34, 2.5]} />
        <meshStandardMaterial
          color={AMR_DEEP}
          metalness={0.75}
          roughness={0.32}
          emissive={AMR}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0.92, 0.28, -0.15]} castShadow>
        <boxGeometry args={[0.26, 0.34, 2.5]} />
        <meshStandardMaterial
          color={AMR_DEEP}
          metalness={0.75}
          roughness={0.32}
          emissive={AMR}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Side intake lips */}
      <mesh position={[-0.95, 0.42, 0.6]}>
        <boxGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color={TITANIUM} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.95, 0.42, 0.6]}>
        <boxGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color={TITANIUM} metalness={0.85} roughness={0.25} />
      </mesh>

      <Wheel position={[-0.82, 0.32, 1.4]} />
      <Wheel position={[0.82, 0.32, 1.4]} />
      <Wheel position={[-0.88, 0.34, -1.5]} />
      <Wheel position={[0.88, 0.34, -1.5]} />

      {/* Front splitter — binary elevation */}
      <group position={[0, splitterY, 2.58]}>
        <mesh castShadow>
          <boxGeometry args={[1.72, 0.035, 0.58]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.65}
            roughness={0.28}
            emissive={colors.emissive}
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0.02, -0.18]}>
          <boxGeometry args={[1.5, 0.018, 0.18]} />
          <meshStandardMaterial color="#1a2332" metalness={0.55} roughness={0.4} />
        </mesh>
      </group>

      {/* Active rear wing */}
      <group position={[0, 0.82, -2.2]} rotation={[aoaRad, 0, 0]}>
        <mesh position={[-0.88, 0.14, 0]} castShadow>
          <boxGeometry args={[0.045, 0.38, 0.48]} />
          <meshStandardMaterial color="#0a0c10" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0.88, 0.14, 0]} castShadow>
          <boxGeometry args={[0.045, 0.38, 0.48]} />
          <meshStandardMaterial color="#0a0c10" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.72, 0.045, 0.42]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.6}
            roughness={0.22}
            emissive={colors.emissive}
            emissiveIntensity={0.45}
          />
        </mesh>
        {/* Gurney lip */}
        <mesh position={[0, 0.24, -0.2]}>
          <boxGeometry args={[1.65, 0.04, 0.02]} />
          <meshStandardMaterial
            color={colors.secondary}
            emissive={colors.emissive}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.42, -0.18, 0.04]}>
          <boxGeometry args={[0.05, 0.38, 0.05]} />
          <meshStandardMaterial color={TITANIUM} metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.42, -0.18, 0.04]}>
          <boxGeometry args={[0.05, 0.38, 0.05]} />
          <meshStandardMaterial color={TITANIUM} metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* Diffuser */}
      <mesh position={[0, 0.07, -1.95]} castShadow>
        <boxGeometry args={[1.35, 0.07, 0.85]} />
        <meshStandardMaterial color="#151a24" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Rear light bar — lime brand cue */}
      <mesh position={[0, 0.55, -2.28]}>
        <boxGeometry args={[1.1, 0.03, 0.04]} />
        <meshStandardMaterial
          color={LIME}
          emissive={LIME}
          emissiveIntensity={0.85}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.33, 0.33, 0.24, 28]} />
        <meshStandardMaterial color="#050505" metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.17, 0.26, 18]} />
        <meshStandardMaterial color="#5c6570" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.03, 8, 28]} />
        <meshStandardMaterial color="#2a3038" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  )
}
