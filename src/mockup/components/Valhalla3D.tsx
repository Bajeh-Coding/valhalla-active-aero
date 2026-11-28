import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import type { AeroMode, SplitterState } from '@/types/aero'

useGLTF.setDecoderPath('/draco/')

const MODEL_URL = '/models/valhalla/valhalla.glb'

/** Aerobrake reference AOA — maps to fully deployed spoiler (SpoilerClose t→0). */
const AOA_DEPLOY_REF = 19

/** ~335 mm rolling radius — km/h → rad/s via v/r. */
const WHEEL_RADIUS_M = 0.335

const WHEEL_BONE_NAMES = [
  'Wheel Front L',
  'Wheel Front R',
  'Wheel Rear L',
  'Wheel Rear R',
] as const

/** Spoiler skeleton nodes driven by SpoilerClose (GLB has no front-wing / splitter bones). */
const SPOILER_TRACK_RE = /Spoiler/i
const SPOILER_EXCLUDE_RE =
  /Wheel|Steering|Door|Hood|Calliper|Body_lod|Root_Bone|Animate_Body|DoorRock/i

/** True side profile — camera on +X, car silhouette + rear wing AOA readable. */
const SIDE_CAM = {
  position: [6.85, 1.05, 0.05] as [number, number, number],
  target: [0, 0.55, 0] as [number, number, number],
  fov: 28,
  /** Keep orbit near the side (±~55°) so a drag doesn't jump to rear¾. */
  minAzimuth: Math.PI / 2 - 0.95,
  maxAzimuth: Math.PI / 2 + 0.95,
}

export interface Valhalla3DProps {
  aoaDeg: number
  splitter: SplitterState
  mode: AeroMode
  speedKmh: number
  dragIndex: number
  frontDfIndex: number
  rearDfIndex: number
  className?: string
}

/**
 * Cap 09 — luxury Three.js / R3F Valhalla stage.
 * Side-profile default, SpoilerClose scrubbed (lerped) by AOA, wheel bones spin
 * with speed. Splitter / front wing / air-dam are HUD-only — not separable in GLB.
 */
export function Valhalla3D({
  aoaDeg,
  splitter,
  mode,
  speedKmh,
  dragIndex,
  frontDfIndex,
  rearDfIndex,
  className,
}: Valhalla3DProps) {
  const aoaNorm = Math.min(1, Math.max(0, aoaDeg / AOA_DEPLOY_REF))
  const splitterOpen = splitter === 'OPEN'
  const [ready, setReady] = useState(false)
  const readyRef = useRef(false)
  const onReadyRef = useRef(() => {
    if (readyRef.current) return
    readyRef.current = true
    setReady(true)
  })

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-aero-ivory/8 bg-aero-void',
        className,
      )}
      data-testid="sim-visual"
      data-mode={mode}
      data-splitter={splitter}
      data-aoa={aoaDeg.toFixed(1)}
    >
      <div className="flex items-center justify-between gap-3 border-b border-aero-ivory/8 px-4 py-2.5 md:px-5">
        <p className="font-ui text-[10px] tracking-[0.55px] text-aero-mist/50 uppercase">
          Valhalla 3D · {mode} · AOA {aoaDeg.toFixed(1)}° · splitter {splitter}
        </p>
        <p className="font-mono text-[10px] tracking-[0.12em] text-aero-lime/75">
          {speedKmh} km/h
        </p>
      </div>

      <div className="valhalla-stage relative aspect-[16/10] w-full md:aspect-[21/11]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 55% 42%, rgba(0,102,94,0.18) 0%, transparent 55%), radial-gradient(ellipse 90% 80% at 50% 100%, rgba(5,7,10,0.95) 0%, transparent 50%), linear-gradient(165deg, #0a0e14 0%, #05070a 45%, #0c1218 100%)',
          }}
          aria-hidden
        />

        <Canvas
          className="absolute inset-0"
          dpr={[1, 1.75]}
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
            <ValhallaScene
              aoaDeg={aoaDeg}
              speedKmh={speedKmh}
              mode={mode}
              splitterOpen={splitterOpen}
              onReadyRef={onReadyRef}
            />
          </Suspense>
        </Canvas>

        {!ready ? (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <p className="font-ui text-[10px] tracking-[0.4em] text-aero-mist/40 uppercase">
              Loading Valhalla…
            </p>
          </div>
        ) : null}

        <div
          className="pointer-events-none absolute top-3 right-3 flex flex-col items-end gap-1.5 md:top-4 md:right-4"
          data-testid="sim-hud"
        >
          <HudPill
            testId="sim-surface-rear-wing"
            label="T-wing"
            value={`${aoaDeg.toFixed(1)}°`}
            hot={aoaNorm > 0.35}
          />
          <HudPill
            testId="sim-surface-splitter"
            label="Splitter"
            value={splitter}
            hot={splitterOpen}
          />
          <HudPill
            testId="sim-surface-front-wing"
            label="Front wing"
            value={
              mode === 'DRS' && splitterOpen
                ? 'bleed'
                : mode === 'AEROBRAKE'
                  ? 'max DF'
                  : 'SAE'
            }
            hot={mode !== 'DRS'}
          />
          <HudPill
            testId="sim-surface-airdam"
            label="Air-dam"
            value={
              mode === 'DRS' ? 'bleed' : mode === 'AEROBRAKE' ? 'max' : 'active'
            }
            hot={mode === 'AEROBRAKE' || mode === 'MAXP'}
          />
          <HudPill
            testId="sim-surface-diffuser"
            label="Diffuser"
            value={rearDfIndex.toFixed(2)}
            hot={rearDfIndex > 0.55}
          />
        </div>

        <p
          className="pointer-events-none absolute bottom-3 left-3 font-ui text-[9px] tracking-[0.35px] text-aero-mist/35 md:bottom-4 md:left-4"
          data-testid="sim-wheel-rear"
        >
          Side view · orbit near profile · wheels ∝ speed · spoiler ← AOA
        </p>
      </div>

      <ul
        className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-aero-ivory/8 px-4 py-3 md:grid-cols-5 md:px-5"
        data-testid="sim-surface-legend"
      >
        <LegendItem
          label="Front wing"
          value={
            mode === 'DRS' && splitterOpen
              ? 'bleed'
              : mode === 'AEROBRAKE'
                ? 'max DF'
                : 'SAE'
          }
          hot={mode !== 'DRS'}
        />
        <LegendItem
          label="T-wing AOA"
          value={`${aoaDeg.toFixed(1)}°`}
          hot={aoaNorm > 0.35}
        />
        <LegendItem label="Splitter" value={splitter} hot={splitterOpen} />
        <LegendItem
          label="Drag idx"
          value={dragIndex.toFixed(2)}
          hot={dragIndex > 0.55}
        />
        <LegendItem
          label="Front DF"
          value={frontDfIndex.toFixed(2)}
          hot={frontDfIndex > 0.55}
          className="col-span-2 md:col-span-1"
        />
      </ul>
    </div>
  )
}

function SideOrbitControls() {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.position.set(...SIDE_CAM.position)
    camera.lookAt(...SIDE_CAM.target)
    const c = controls.current
    if (!c) return
    c.target.set(...SIDE_CAM.target)
    c.minAzimuthAngle = SIDE_CAM.minAzimuth
    c.maxAzimuthAngle = SIDE_CAM.maxAzimuth
    // Force true side azimuth (π/2) on first frame — avoids rear¾ start.
    c.setAzimuthalAngle(Math.PI / 2)
    c.setPolarAngle(Math.PI * 0.42)
    c.update()
  }, [camera])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      minPolarAngle={Math.PI * 0.32}
      maxPolarAngle={Math.PI * 0.5}
      minDistance={5.2}
      maxDistance={9.5}
      target={SIDE_CAM.target}
      enableDamping
      dampingFactor={0.06}
      minAzimuthAngle={SIDE_CAM.minAzimuth}
      maxAzimuthAngle={SIDE_CAM.maxAzimuth}
    />
  )
}

function ValhallaScene({
  aoaDeg,
  speedKmh,
  mode,
  splitterOpen,
  onReadyRef,
}: {
  aoaDeg: number
  speedKmh: number
  mode: AeroMode
  splitterOpen: boolean
  onReadyRef: MutableRefObject<() => void>
}) {
  const gltf = useGLTF(MODEL_URL)
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const action = useRef<THREE.AnimationAction | null>(null)
  const wheels = useRef<THREE.Object3D[]>([])
  const clipDuration = useRef(1)
  const spoilerTime = useRef(0)
  const speedRef = useRef(speedKmh)
  const aoaRef = useRef(aoaDeg)

  useEffect(() => {
    speedRef.current = speedKmh
  }, [speedKmh])

  useEffect(() => {
    aoaRef.current = aoaDeg
  }, [aoaDeg])

  const spoilerClip = useMemo(() => {
    const source = gltf.animations[0]
    if (!source) return null
    const tracks = source.tracks.filter((t) => {
      const n = t.name
      return SPOILER_TRACK_RE.test(n) && !SPOILER_EXCLUDE_RE.test(n)
    })
    return new THREE.AnimationClip(
      'SpoilerAoa',
      source.duration,
      tracks.length ? tracks : source.tracks,
    )
  }, [gltf.animations])

  useLayoutEffect(() => {
    const root = gltf.scene
    root.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
      const mesh = obj as THREE.Mesh
      if (mesh.isMesh && mesh.material) {
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        for (const m of mats) {
          const std = m as THREE.MeshStandardMaterial
          if (std.isMeshStandardMaterial) {
            std.envMapIntensity = 0.85
            std.needsUpdate = true
          }
        }
      }
    })

    // Identity pose — side camera frames the silhouette.
    root.position.set(0, -0.02, 0)
    root.rotation.set(0, 0, 0)

    const found: THREE.Object3D[] = []
    for (const name of WHEEL_BONE_NAMES) {
      const bone = root.getObjectByName(name)
      if (bone) found.push(bone)
    }
    // Fallback: if bones missing, spin the Wheel1A_* mesh roots (skinned).
    if (found.length === 0) {
      for (const name of [
        'Wheel1A_LF',
        'Wheel1A_RF',
        'Wheel1A_LR',
        'Wheel1A_RR',
      ]) {
        const mesh = root.getObjectByName(name)
        if (mesh) found.push(mesh)
      }
    }
    wheels.current = found

    if (spoilerClip) {
      const mix = new THREE.AnimationMixer(root)
      const act = mix.clipAction(spoilerClip)
      act.enabled = true
      act.setLoop(THREE.LoopOnce, 1)
      act.clampWhenFinished = true
      act.play()
      act.paused = true
      mixer.current = mix
      action.current = act
      clipDuration.current = Math.max(spoilerClip.duration, 0.001)
      // Seed scrub from current AOA (deployed at t=0).
      const deploy = Math.min(1, Math.max(0, aoaRef.current / AOA_DEPLOY_REF))
      spoilerTime.current = (1 - deploy) * clipDuration.current
      act.time = spoilerTime.current
      mix.setTime(spoilerTime.current)
    }

    onReadyRef.current()
  }, [gltf.scene, spoilerClip, onReadyRef])

  useFrame((_, dt) => {
    const act = action.current
    const mix = mixer.current
    if (act && mix) {
      // SpoilerClose: t=0 deployed → t=end stowed. High AOA → early time.
      const deploy = Math.min(1, Math.max(0, aoaRef.current / AOA_DEPLOY_REF))
      const target = (1 - deploy) * clipDuration.current
      // Smooth exponential lerp — visible when switching modes / scrubbing speed.
      const alpha = 1 - Math.exp(-7.5 * Math.min(dt, 0.05))
      spoilerTime.current += (target - spoilerTime.current) * alpha
      act.time = spoilerTime.current
      mix.setTime(spoilerTime.current)
    }

    // Wheel spin — local X; ω = v / r (km/h → m/s → rad/s).
    const v = speedRef.current
    if (v > 0.5 && wheels.current.length > 0) {
      const radPerSec = v / 3.6 / WHEEL_RADIUS_M
      const step = radPerSec * dt
      for (const bone of wheels.current) {
        bone.rotateX(step)
      }
    }
  })

  const keyLightIntensity =
    mode === 'AEROBRAKE' ? 1.35 : mode === 'DRS' ? 0.95 : 1.15
  const accentColor = splitterOpen ? '#c4df00' : '#00665e'

  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[4.5, 6.5, 3]}
        intensity={keyLightIntensity}
        color="#f4f1ea"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-3.5, 2.5, -2]}
        intensity={0.45}
        color={accentColor}
      />
      <spotLight
        position={[0, 5, 2]}
        angle={0.45}
        penumbra={0.7}
        intensity={0.55}
        color="#e8e4dc"
      />

      <Environment preset="city" environmentIntensity={0.35} />

      <primitive object={gltf.scene} />

      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.55}
        scale={12}
        blur={2.4}
        far={4}
      />

      <SideOrbitControls />
    </>
  )
}

function HudPill({
  testId,
  label,
  value,
  hot,
}: {
  testId: string
  label: string
  value: string
  hot?: boolean
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        'font-ui flex min-w-[7.5rem] items-baseline justify-between gap-3 border px-2.5 py-1 text-[9px] tracking-[0.14em] uppercase backdrop-blur-sm',
        hot
          ? 'border-aero-lime/35 bg-aero-void/70 text-aero-lime'
          : 'border-aero-ivory/12 bg-aero-void/55 text-aero-mist/70',
      )}
    >
      <span>{label}</span>
      <span className="font-mono tracking-normal text-aero-ivory/90">
        {value}
      </span>
    </div>
  )
}

function LegendItem({
  label,
  value,
  hot,
  className,
}: {
  label: string
  value: string
  hot?: boolean
  className?: string
}) {
  return (
    <li className={cn('min-w-0', className)}>
      <p className="font-ui text-[9px] tracking-[0.4px] text-aero-mist/45 uppercase">
        {label}
      </p>
      <p
        className={cn(
          'font-mono mt-0.5 text-[12px]',
          hot ? 'text-aero-lime' : 'text-aero-ivory/80',
        )}
      >
        {value}
      </p>
    </li>
  )
}

useGLTF.preload(MODEL_URL)
