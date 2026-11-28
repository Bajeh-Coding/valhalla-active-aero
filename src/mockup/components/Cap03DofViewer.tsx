/**
 * Cap 03 only — fixed side-view Valhalla GLB for the 14 DOF diagram.
 * Reuses shared white-metallic body paint; does not edit Cap 05 Valhalla3D.
 */
import { ContactShadows, Environment, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import {
  Component,
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import * as THREE from 'three'
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js'
import { cn } from '@/lib/utils'
import { applyWhiteMetallicBodyPaint } from '@/mockup/lib/valhallaBodyPaint'

useGLTF.setDecoderPath('/draco/')

const MODEL_URL = '/models/valhalla/valhalla.glb'

/** Same Cap 05 side profile — camera on +X; locked (no orbit). */
const SIDE_CAM = {
  position: [6.85, 1.05, 0.05] as [number, number, number],
  target: [0, 0.55, 0] as [number, number, number],
  fov: 28,
}

export interface Cap03DofViewerProps {
  className?: string
}

export function Cap03DofViewer({ className }: Cap03DofViewerProps) {
  const [ready, setReady] = useState(false)
  const readyGate = useRef(false)
  const onReadyRef = useRef(() => {
    if (readyGate.current) return
    readyGate.current = true
    setReady(true)
  })

  return (
    <div
      className={cn('relative aspect-[940/360] w-full bg-aero-void', className)}
      data-testid="cap03-dof-viewer"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 55% 42%, rgba(0,102,94,0.14) 0%, transparent 55%), linear-gradient(165deg, #0a0e14 0%, #05070a 45%, #0c1218 100%)',
        }}
      />

      <CanvasErrorBoundary onFail={() => onReadyRef.current()}>
        <Canvas
          className="absolute inset-0"
          dpr={[1, 1.5]}
          frameloop="demand"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          camera={{
            position: SIDE_CAM.position,
            fov: SIDE_CAM.fov,
            near: 0.1,
            far: 80,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
        >
          <Suspense fallback={null}>
            <FixedSideCamera />
            <DofCarScene onReadyRef={onReadyRef} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>

      {!ready ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-ui text-[10px] tracking-[0.4em] text-aero-mist/40 uppercase">
            Loading Valhalla…
          </p>
        </div>
      ) : null}
    </div>
  )
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFail()
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-ui text-[10px] tracking-[0.35em] text-aero-mist/45 uppercase">
            3D unavailable
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

function FixedSideCamera() {
  const { camera, invalidate } = useThree()

  useLayoutEffect(() => {
    camera.position.set(...SIDE_CAM.position)
    camera.lookAt(...SIDE_CAM.target)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, invalidate])

  return null
}

function DofCarScene({
  onReadyRef,
}: {
  onReadyRef: MutableRefObject<() => void>
}) {
  const gltf = useGLTF(MODEL_URL)
  const { invalidate } = useThree()
  const scene = useMemo(() => cloneSkinned(gltf.scene), [gltf.scene])

  useLayoutEffect(() => {
    scene.position.set(0, -0.02, 0)
    scene.rotation.set(0, 0, 0)
    scene.traverse((obj: THREE.Object3D) => {
      obj.castShadow = false
      obj.receiveShadow = false
    })
    applyWhiteMetallicBodyPaint(scene)
    onReadyRef.current()
    invalidate()
  }, [scene, onReadyRef, invalidate])

  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[4.5, 6.5, 3]}
        intensity={1.15}
        color="#f4f1ea"
      />
      <directionalLight
        position={[-3.5, 2.5, -2]}
        intensity={0.4}
        color="#00665e"
      />
      <Environment preset="city" environmentIntensity={0.35} />
      <primitive object={scene} />
      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.5}
        scale={12}
        blur={2.4}
        far={4}
      />
    </>
  )
}

useGLTF.preload(MODEL_URL)
