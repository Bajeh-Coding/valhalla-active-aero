import { Grid } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

/** Dark futuristic wind-tunnel shell: fog, lights, reflective floor grid. */
export function TunnelEnvironment() {
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#020617',
        metalness: 0.92,
        roughness: 0.18,
        envMapIntensity: 0.6,
      }),
    [],
  )

  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 8, 28]} />

      <ambientLight intensity={0.18} color="#94a3b8" />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.15}
        color="#e2e8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-4, 3, -2]} intensity={1.4} color="#22d3ee" distance={18} />
      <pointLight position={[3, 2.5, 4]} intensity={0.7} color="#34d399" distance={14} />
      <spotLight
        position={[0, 8, 0]}
        angle={0.55}
        penumbra={0.6}
        intensity={1.2}
        color="#67e8f9"
        castShadow
      />

      {/* Reflective floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.001, 0]}
        receiveShadow
        material={floorMat}
      >
        <planeGeometry args={[40, 40]} />
      </mesh>

      <Grid
        position={[0, 0.002, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#1e293b"
        sectionSize={2}
        sectionThickness={1.1}
        sectionColor="#22d3ee"
        fadeDistance={22}
        fadeStrength={1.2}
        infiniteGrid
      />

      {/* Tunnel walls (subtle) */}
      <mesh position={[0, 3.5, -10]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.7} />
      </mesh>
      <mesh position={[-8, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.35}
          roughness={0.75}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh position={[8, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.35}
          roughness={0.75}
          transparent
          opacity={0.55}
        />
      </mesh>
    </>
  )
}
