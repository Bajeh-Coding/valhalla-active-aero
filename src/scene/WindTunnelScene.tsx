import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { ForceVectors } from './ForceVectors'
import { ScrollCamera } from './ScrollCamera'
import { Streamlines } from './Streamlines'
import { TunnelEnvironment } from './TunnelEnvironment'
import { ValhallaCar } from './ValhallaCar'

export interface WindTunnelSceneProps {
  /** Optional className for the fixed canvas host. */
  className?: string
}

/**
 * Cinematic 3D wind-tunnel stage (hybrid with 2D CFD overlay in layout).
 * Camera pose from `useScrollStore`; aero meshes from `useAeroStore`.
 */
export function WindTunnelScene({ className }: WindTunnelSceneProps) {
  return (
    <div className={className ?? 'h-full w-full'}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
        camera={{ fov: 40, near: 0.1, far: 80, position: [4.2, 1.8, 5.5] }}
        style={{ background: '#05070A' }}
      >
        <Suspense fallback={null}>
          <TunnelEnvironment />
          <ValhallaCar />
          <Streamlines />
          <ForceVectors />
          <ScrollCamera />
        </Suspense>
      </Canvas>
    </div>
  )
}
