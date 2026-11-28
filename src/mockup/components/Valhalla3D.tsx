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

/** ~335 mm rolling radius — physical ω = v/r (telemetry). */
const WHEEL_RADIUS_M = 0.335

/**
 * Display spin at 300 km/h (rev/s). True ω=v/r at highway speed is ~20+ rev/s —
 * at 60 fps that is >2 rad/frame and spokes strobe (wagon-wheel), which reads as
 * a frozen rim that only “blinks” when the speed slider moves. Cap the *visual*
 * rate so the rim continuously reads while staying proportional to speed.
 */
const VISUAL_REVS_PER_SEC_AT_300 = 2.75

/**
 * Bone name → skinned wheel mesh.
 * Runtime skeleton joints use underscores (`Wheel_Front_L`); gltf-transform may
 * show spaces — always normalize before compare.
 */
const WHEEL_ENTRIES = [
  { bone: 'Wheel_Front_L', mesh: 'Wheel1A_LF' },
  { bone: 'Wheel_Front_R', mesh: 'Wheel1A_RF' },
  { bone: 'Wheel_Rear_L', mesh: 'Wheel1A_LR' },
  { bone: 'Wheel_Rear_R', mesh: 'Wheel1A_RR' },
] as const

function normBoneName(n: string): string {
  return n.replace(/[\s_]+/g, '').toLowerCase()
}

/** Spoiler skeleton nodes driven by SpoilerClose (GLB has no front-wing / splitter bones). */
const SPOILER_TRACK_RE = /Spoiler/i
const SPOILER_EXCLUDE_RE =
  /Wheel|Steering|Door|Hood|Calliper|Body_lod|Root_Bone|Animate_Body|DoorRock/i

/** True side profile — camera on +X, car silhouette + rear wing AOA readable. */
const SIDE_CAM = {
  position: [6.85, 1.05, 0.05] as [number, number, number],
  target: [0, 0.55, 0] as [number, number, number],
  fov: 28,
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
 * Side-profile default. SpoilerClose scrubbed by AOA via paused Action.time +
 * mixer.update(0) — NEVER mixer.setTime (that zeros paused actions back to t=0).
 * Wheel bones (from each SkinnedMesh.skeleton) spin after the mixer pose;
 * visual ω is speed-proportional but display-scaled so rims don’t strobe at 60fps.
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
  /** DOM telemetry for Playwright — bone angles / spoiler scrub time. */
  const telemetryRef = useRef<HTMLDivElement>(null)

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
      data-speed={String(speedKmh)}
    >
      <div
        ref={telemetryRef}
        data-testid="sim-anim-telemetry"
        data-spoiler-time="0"
        data-spoiler-target="0"
        data-wheel-angle="0"
        data-wheel-count="0"
        data-spoiler-tracks="0"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden
      />

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
          frameloop="always"
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
              telemetryRef={telemetryRef}
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
          Side view · wheels ∝ speed (rim-readable) · rear spoiler ← AOA
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

type WheelSpinTarget = {
  bone: THREE.Bone
  skeleton: THREE.Skeleton | null
  /** Rest local quaternion (bind pose). */
  rest: THREE.Quaternion
  /** +1 / −1 — right-side bones have local +X flipped in world. */
  sign: number
}

function ValhallaScene({
  aoaDeg,
  speedKmh,
  mode,
  splitterOpen,
  onReadyRef,
  telemetryRef,
}: {
  aoaDeg: number
  speedKmh: number
  mode: AeroMode
  splitterOpen: boolean
  onReadyRef: MutableRefObject<() => void>
  telemetryRef: MutableRefObject<HTMLDivElement | null>
}) {
  const gltf = useGLTF(MODEL_URL)
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const action = useRef<THREE.AnimationAction | null>(null)
  const wheels = useRef<WheelSpinTarget[]>([])
  const skeletons = useRef<Set<THREE.Skeleton>>(new Set())
  const clipDuration = useRef(1)
  const spoilerTime = useRef(0)
  const wheelAngle = useRef(0)
  const spoilerTrackCount = useRef(0)
  const speedRef = useRef(speedKmh)
  const aoaRef = useRef(aoaDeg)
  const hingeBone = useRef<THREE.Object3D | null>(null)
  const qSpin = useMemo(() => new THREE.Quaternion(), [])
  const qOut = useMemo(() => new THREE.Quaternion(), [])
  /** Local +X is the hub axle on this Forza-style kit (world ±lateral). */
  const axle = useMemo(() => new THREE.Vector3(1, 0, 0), [])

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
    // Never fall back to the full Body clip — that rebinds wheel bones every frame.
    if (!tracks.length) return null
    return new THREE.AnimationClip('SpoilerAoa', source.duration, tracks)
  }, [gltf.animations])

  useLayoutEffect(() => {
    const root = gltf.scene
    spoilerTrackCount.current = spoilerClip?.tracks.length ?? 0
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

    root.position.set(0, -0.02, 0)
    root.rotation.set(0, 0, 0)

    hingeBone.current =
      (root.getObjectByName('Animate_Spoiler_Hinge_1') as THREE.Object3D) ??
      null

    // Wheel hub joints live on SkinnedMesh.skeleton.bones — in this GLB they are
    // NOT always reachable via scene traverse/getObjectByName after Draco load.
    const found: WheelSpinTarget[] = []
    const skelSet = new Set<THREE.Skeleton>()
    let skelBoneNames = ''
    for (const entry of WHEEL_ENTRIES) {
      const meshObj = root.getObjectByName(entry.mesh) as THREE.SkinnedMesh | undefined
      if (!meshObj || !meshObj.isSkinnedMesh || !meshObj.skeleton) continue
      const skeleton = meshObj.skeleton
      skelSet.add(skeleton)
      if (!skelBoneNames) {
        skelBoneNames = skeleton.bones
          .map((b) => b.name)
          .filter((n) => /wheel|calliper|caliper|steering/i.test(n))
          .join('|')
      }
      const want = normBoneName(entry.bone)
      const bone =
        skeleton.bones.find((b) => b.name === entry.bone) ??
        skeleton.bones.find((b) => normBoneName(b.name) === want) ??
        skeleton.getBoneByName?.(entry.bone) ??
        null
      if (!bone) continue
      found.push({
        bone,
        skeleton,
        rest: bone.quaternion.clone(),
        // Right-side bones: world local +X points −X; keep tread direction.
        sign: /_R$|R$/i.test(entry.bone) ? -1 : 1,
      })
    }
    wheels.current = found
    skeletons.current = skelSet
    wheelAngle.current = 0
    const telInit = telemetryRef.current
    if (telInit) {
      telInit.dataset.skelBones = skelBoneNames.slice(0, 500)
      telInit.dataset.wheelCount = String(found.length)
    }

    if (spoilerClip) {
      const mix = new THREE.AnimationMixer(root)
      const act = mix.clipAction(spoilerClip)
      act.enabled = true
      act.setLoop(THREE.LoopOnce, 1)
      act.clampWhenFinished = true
      act.play()
      act.paused = true
      act.weight = 1
      mixer.current = mix
      action.current = act
      clipDuration.current = Math.max(spoilerClip.duration, 0.001)
      const deploy = Math.min(1, Math.max(0, aoaRef.current / AOA_DEPLOY_REF))
      spoilerTime.current = (1 - deploy) * clipDuration.current
      // Apply pose without mixer.setTime (setTime zeros paused actions → t=0 forever).
      act.time = spoilerTime.current
      mix.update(0)
      for (const w of wheels.current) {
        w.rest.copy(w.bone.quaternion)
      }
    } else {
      mixer.current = null
      action.current = null
    }

    onReadyRef.current()
  }, [gltf.scene, spoilerClip, onReadyRef])

  useFrame((_, dt) => {
    const safeDt = Math.min(Math.max(dt, 0), 0.05)
    const act = action.current
    const mix = mixer.current

    // --- Spoiler scrub (AOA) ---
    let targetT = 0
    if (act && mix) {
      const deploy = Math.min(1, Math.max(0, aoaRef.current / AOA_DEPLOY_REF))
      // SpoilerClose: t≈0 deployed (high AOA) → t=end stowed (AOA 0°).
      targetT = (1 - deploy) * clipDuration.current
      const alpha = 1 - Math.exp(-8 * safeDt)
      spoilerTime.current += (targetT - spoilerTime.current) * alpha
      act.enabled = true
      act.paused = true
      act.time = spoilerTime.current
      // Critical: update(0) evaluates the paused action at action.time.
      // Do NOT call mix.setTime — it resets every paused action to t=0.
      mix.update(0)
    }

    // --- Wheel spin AFTER mixer (bones not in spoiler clip) ---
    const v = speedRef.current
    const physicalOmega = v > 0.5 ? v / 3.6 / WHEEL_RADIUS_M : 0
    // Display ω ∝ speed, capped so multi-spoke rims read continuously at ~60fps.
    const visualOmega =
      v > 0.5 ? (v / 300) * (Math.PI * 2 * VISUAL_REVS_PER_SEC_AT_300) : 0
    if (visualOmega > 0 && wheels.current.length > 0) {
      wheelAngle.current += visualOmega * safeDt
      for (const w of wheels.current) {
        qSpin.setFromAxisAngle(axle, w.sign * wheelAngle.current)
        // rest ⊗ spin — absolute set on the skeleton bone the mesh actually weights.
        qOut.copy(w.rest).multiply(qSpin)
        w.bone.quaternion.copy(qOut)
      }
      for (const sk of skeletons.current) {
        sk.update()
      }
    }

    // DOM telemetry for Playwright proofs
    const el = telemetryRef.current
    if (el) {
      el.dataset.spoilerTime = spoilerTime.current.toFixed(4)
      el.dataset.spoilerTarget = targetT.toFixed(4)
      el.dataset.wheelAngle = wheelAngle.current.toFixed(4)
      el.dataset.wheelOmegaVisual = visualOmega.toFixed(4)
      el.dataset.wheelOmegaPhysical = physicalOmega.toFixed(4)
      el.dataset.wheelCount = String(wheels.current.length)
      el.dataset.spoilerTracks = String(spoilerTrackCount.current)
      if (hingeBone.current) {
        el.dataset.hingeY = hingeBone.current.position.y.toFixed(4)
      }
      if (wheels.current[0]) {
        const b = wheels.current[0].bone
        el.dataset.boneQx = b.quaternion.x.toFixed(4)
        el.dataset.boneQw = b.quaternion.w.toFixed(4)
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
