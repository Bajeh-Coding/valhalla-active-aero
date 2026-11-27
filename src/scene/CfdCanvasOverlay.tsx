import { useEffect, useRef } from 'react'
import { useAeroStore } from '@/store'
import { useScrollStore } from './scrollStore'
import { streamlineColorForMode } from './modeVisuals'
import type { AeroMode } from '@/types/aero'

interface StreamPath {
  pts: { x: number; y: number }[]
  width: number
  phase: number
}

const PATH_COUNT = 28

/**
 * High-performance 2D CFD streamline overlay.
 * Paths: splitter → roof → wing. Color by mode (DRS cyan / MAXP lime / AEROBRAKE crimson).
 */
export function CfdCanvasOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathsRef = useRef<StreamPath[]>([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pathsRef.current = buildPaths(w, h)
    }

    resize()
    window.addEventListener('resize', resize)

    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const { mode, speedKmh } = useAeroStore.getState()
      const { chapterIndex } = useScrollStore.getState()
      drawFrame(ctx, canvas.clientWidth, canvas.clientHeight, pathsRef.current, {
        mode,
        speedKmh,
        chapterIndex,
        dt,
        time: now / 1000,
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
      aria-hidden
    />
  )
}

function buildPaths(w: number, h: number): StreamPath[] {
  const paths: StreamPath[] = []
  const cy = h * 0.52

  for (let i = 0; i < PATH_COUNT; i++) {
    const lane = (i / (PATH_COUNT - 1)) * 2 - 1
    const yBias = lane * h * 0.12
    const pts: { x: number; y: number }[] = []
    const steps = 36
    for (let s = 0; s < steps; s++) {
      const t = s / (steps - 1)
      // splitter (front) → roof → wing (rear)
      const x = w * 0.08 + t * w * 0.84 + Math.sin(lane * 1.2) * 18
      let y = cy + yBias * (0.35 + t * 0.65)
      if (t > 0.28 && t < 0.62) {
        const roof = Math.sin(((t - 0.28) / 0.34) * Math.PI)
        y -= roof * h * 0.07 * (1 - Math.abs(lane) * 0.35)
      }
      if (t > 0.68) {
        y -= ((t - 0.68) / 0.32) * h * 0.05 * (0.6 + Math.abs(lane) * 0.4)
        y += Math.sin(lane * 3 + t * 4) * 6
      }
      const body = Math.exp(-Math.pow((t - 0.45) * 3.2, 2))
      y += Math.sign(lane || 1) * body * 14
      pts.push({ x, y })
    }
    paths.push({
      pts,
      width: 0.8 + Math.abs(lane) * 0.6,
      phase: Math.random(),
    })
  }
  return paths
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  paths: StreamPath[],
  state: {
    mode: AeroMode
    speedKmh: number
    chapterIndex: number
    dt: number
    time: number
  },
) {
  ctx.clearRect(0, 0, w, h)
  if (paths.length === 0) return

  // Chapter 1 hero: cyan airflow; elsewhere streamline by aero mode.
  const color =
    state.chapterIndex === 0 ? '#00F0FF' : streamlineColorForMode(state.mode)
  const speedFactor = Math.max(0.35, state.speedKmh / 180)
  const turb =
    state.mode === 'AEROBRAKE' ? 1 : state.mode === 'DRS' ? 0.15 : 0.4
  const alpha =
    state.chapterIndex === 0 ? 0.72 : state.chapterIndex === 2 ? 0.9 : 0.55

  const glow = ctx.createRadialGradient(
    w * 0.55,
    h * 0.5,
    20,
    w * 0.55,
    h * 0.5,
    w * 0.45,
  )
  glow.addColorStop(0, hexAlpha(color, 0.06 * alpha))
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]!
    path.phase = (path.phase + state.dt * speedFactor * (0.35 + (i % 5) * 0.04)) % 1

    ctx.beginPath()
    for (let p = 0; p < path.pts.length; p++) {
      const pt = path.pts[p]!
      const jitter = Math.sin(state.time * (2 + turb) + i + p * 0.3) * turb * 3.5
      if (p === 0) ctx.moveTo(pt.x, pt.y + jitter)
      else ctx.lineTo(pt.x, pt.y + jitter)
    }
    ctx.strokeStyle = hexAlpha(color, 0.18 * alpha)
    ctx.lineWidth = path.width
    ctx.lineCap = 'round'
    ctx.stroke()

    const idx = Math.min(
      path.pts.length - 2,
      Math.floor(path.phase * (path.pts.length - 1)),
    )
    const localT = path.phase * (path.pts.length - 1) - idx
    const a = path.pts[idx]!
    const b = path.pts[idx + 1]!
    const px = a.x + (b.x - a.x) * localT
    const py = a.y + (b.y - a.y) * localT

    const g = ctx.createRadialGradient(px, py, 0, px, py, 10)
    g.addColorStop(0, hexAlpha(color, 0.95 * alpha))
    g.addColorStop(0.4, hexAlpha(color, 0.35 * alpha))
    g.addColorStop(1, 'transparent')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(px, py, 10, 0, Math.PI * 2)
    ctx.fill()
  }

  if (state.mode === 'AEROBRAKE') {
    ctx.globalCompositeOperation = 'lighter'
    for (let r = 0; r < 6; r++) {
      const ox = w * 0.72 + r * 18
      const oy = h * 0.48 + Math.sin(state.time * 2 + r) * 40
      ctx.beginPath()
      ctx.ellipse(ox, oy, 28 + r * 6, 14 + r * 3, state.time + r, 0, Math.PI * 2)
      ctx.strokeStyle = hexAlpha('#FF3B30', 0.12)
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    ctx.globalCompositeOperation = 'source-over'
  }
}

function hexAlpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`
}
