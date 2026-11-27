import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Magic UI–inspired animated border beam along the card edge. */
export function BorderBeam({
  className,
  duration = 8,
  colorFrom = '#00F0FF',
  colorTo = '#C4DF00',
}: {
  className?: string
  duration?: number
  colorFrom?: string
  colorTo?: string
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="absolute top-0 left-0 h-[2px] w-1/3 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
        }}
        animate={{ left: ['-35%', '100%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        className="absolute right-0 bottom-0 h-[2px] w-1/3 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colorTo}, ${colorFrom}, transparent)`,
        }}
        animate={{ right: ['-35%', '100%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity, delay: duration / 2 }}
      />
    </div>
  )
}
