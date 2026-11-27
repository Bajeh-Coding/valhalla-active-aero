import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
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
 * R3F wind-tunnel canvas. Camera pose comes from `useScrollStore`
 * (GSAP ScrollTrigger). Aero meshes read `useAeroStore` only.
 */
export function WindTunnelScene({ className }: WindTunnelSceneProps) {
  return (
    <div className={className ?? 'h-full w-full'}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ fov: 42, near: 0.1, far: 80, position: [4.2, 1.8, 5.5] }}
        style={{ background: '#020617' }}
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
