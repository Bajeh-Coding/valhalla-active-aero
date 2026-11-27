import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type ShineButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  active?: boolean
  children?: ReactNode
}

/** Magical hover button with shine sweep — for mode / CTA interactions. */
export function ShineButton({
  className,
  active,
  children,
  ...props
}: ShineButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group relative overflow-hidden rounded-lg border px-2 py-2.5 font-mono text-[11px] tracking-wide transition',
        active
          ? 'border-aero-lime/70 bg-aero-amr-deep/55 text-aero-lime shadow-[0_0_24px_rgb(196_223_0_/0.18)]'
          : 'border-white/10 bg-slate-950/40 text-aero-muted hover:border-aero-amr hover:text-aero-champagne',
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        aria-hidden
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
