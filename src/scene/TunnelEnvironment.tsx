import { Grid } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

/** Obsidian wind-tunnel shell — AMR green atmosphere, reflective floor. */
export function TunnelEnvironment() {
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#05070A',
        metalness: 0.95,
        roughness: 0.14,
        envMapIntensity: 0.7,
      }),
    [],
  )

  return (
    <>
      <color attach="background" args={['#05070A']} />
      <fog attach="fog" args={['#05070A', 7, 26]} />

      <ambientLight intensity={0.12} color="#94a3b8" />
      <directionalLight
        position={[5, 11, 3]}
        intensity={1.05}
        color="#e2e8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* AMR green key wash */}
      <pointLight position={[-3.5, 2.8, -1.5]} intensity={1.6} color="#005949" distance={20} />
      {/* Cyan rim */}
      <pointLight position={[4, 2.2, 4]} intensity={0.85} color="#00F0FF" distance={16} />
      {/* Lime accent */}
      <pointLight position={[0, 1.5, -4]} intensity={0.55} color="#C4DF00" distance={12} />
      <spotLight
        position={[0, 9, 1]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.35}
        color="#cbd5e1"
        castShadow
      />

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
        cellThickness={0.45}
        cellColor="#0f1f1c"
        sectionSize={2}
        sectionThickness={1.0}
        sectionColor="#005949"
        fadeDistance={20}
        fadeStrength={1.35}
        infiniteGrid
      />

      {/* Tunnel aperture — distant dark wall */}
      <mesh position={[0, 3.2, -12]}>
        <planeGeometry args={[28, 10]} />
        <meshStandardMaterial color="#0B0E14" metalness={0.35} roughness={0.8} />
      </mesh>
      <mesh position={[-9, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[28, 10]} />
        <meshStandardMaterial
          color="#0B0E14"
          metalness={0.3}
          roughness={0.85}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh position={[9, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[28, 10]} />
        <meshStandardMaterial
          color="#0B0E14"
          metalness={0.3}
          roughness={0.85}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Ceiling light bars */}
      {[-4, -1.5, 1.5, 4].map((z) => (
        <mesh key={z} position={[0, 5.8, z]}>
          <boxGeometry args={[10, 0.04, 0.08]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={0.35}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  )
}
