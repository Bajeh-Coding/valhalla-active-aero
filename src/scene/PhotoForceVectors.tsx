import { motion } from 'framer-motion'
import { useAeroStore } from '@/store'
import { useScrollStore } from './scrollStore'

/**
 * Chapter 2 — FL / FD vector callouts over the side-aero photo.
 * Magnitudes from live store (paper-exact engine); no fabricated numbers.
 */
export function PhotoForceVectors() {
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const dragN = useAeroStore((s) => s.dragN)
  const downforceN = useAeroStore((s) => s.downforceN)
  const visible = chapterIndex === 1

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      {/* F_L — vertical downforce */}
      <motion.div
        className="absolute left-[18%] top-[38%] md:left-[22%]"
        initial={false}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5 }}
      >
        <VectorBadge
          label="F_L"
          value={`${formatN(downforceN)} N`}
          color="text-aero-cyan"
          direction="down"
        />
      </motion.div>

      {/* F_D — longitudinal drag */}
      <motion.div
        className="absolute top-[52%] right-[16%] md:right-[22%]"
        initial={false}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <VectorBadge
          label="F_D"
          value={`${formatN(dragN)} N`}
          color="text-aero-crimson"
          direction="back"
        />
      </motion.div>
    </div>
  )
}

function VectorBadge({
  label,
  value,
  color,
  direction,
}: {
  label: string
  value: string
  color: string
  direction: 'down' | 'back'
}) {
  return (
    <div className="glass-panel rounded-lg px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={`font-mono text-[10px] tracking-wider ${color}`}>{label}</span>
        {direction === 'down' ? (
          <svg width="14" height="28" viewBox="0 0 14 28" className="text-aero-cyan" aria-hidden>
            <path d="M7 2 v20 M7 22 l-4 -5 M7 22 l4 -5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ) : (
          <svg width="28" height="14" viewBox="0 0 28 14" className="text-aero-crimson" aria-hidden>
            <path d="M26 7 H6 M6 7 l5 -4 M6 7 l5 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </div>
      <div className={`font-display mt-0.5 text-lg font-semibold tabular-nums ${color}`}>
        {value}
      </div>
    </div>
  )
}

function formatN(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(2) + 'k'
  return n.toFixed(0)
}
