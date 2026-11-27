import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useScrollStore } from './scrollStore'
import { PI_ROM } from '@/data/piRom'

/**
 * Chapter 5 — soft neural / nodal pressure-field overlay on the photo stage.
 * Decorative topology only; speedup figure from master-spec PI_ROM constant.
 */
export function NeuralOverlay() {
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const visible = chapterIndex === 4
  const nodes = useMemo(() => buildNodes(36), [])

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((n, i) => {
          const next = nodes[(i + 7) % nodes.length]!
          return (
            <line
              key={`e-${i}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="rgb(0 240 255 / 0.18)"
              strokeWidth="0.08"
            />
          )
        })}
        {nodes.map((n, i) => (
          <motion.circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.hue}
            initial={false}
            animate={
              visible
                ? { opacity: [0.35, 0.85, 0.35], r: [n.r, n.r * 1.35, n.r] }
                : { opacity: 0 }
            }
            transition={{
              duration: 2.4 + (i % 5) * 0.25,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 8) * 0.12,
            }}
          />
        ))}
      </svg>
      <div className="absolute top-[28%] right-[8%] md:right-[14%]">
        <div className="glass-panel rounded-lg px-4 py-3">
          <p className="font-mono text-[9px] tracking-[0.28em] text-aero-lime uppercase">
            PI-ROM field
          </p>
          <p className="font-display mt-1 text-2xl font-semibold text-aero-cyan">
            {PI_ROM.speedupFactor}×
          </p>
          <p className="font-mono text-[10px] text-aero-muted">
            &lt; {PI_ROM.inferenceBudgetMs} ms
          </p>
        </div>
      </div>
    </div>
  )
}

function buildNodes(count: number) {
  const nodes: { x: number; y: number; r: number; hue: string }[] = []
  for (let i = 0; i < count; i++) {
    const t = i / count
    const x = 18 + (i * 17.3) % 64
    const y = 28 + ((i * 11.7) % 44) + Math.sin(t * Math.PI * 2) * 4
    const r = 0.35 + (i % 4) * 0.12
    const hue =
      i % 3 === 0
        ? 'rgb(0 240 255 / 0.7)'
        : i % 3 === 1
          ? 'rgb(196 223 0 / 0.55)'
          : 'rgb(0 89 73 / 0.65)'
    nodes.push({ x, y, r, hue })
  }
  return nodes
}
