import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type GlassVariant = 'soft' | 'strong' | 'spotlight'

const variantClass: Record<GlassVariant, string> = {
  soft: 'bg-slate-950/45 border-white/10 shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.55),inset_0_1px_0_rgb(196_223_0_/0.05)]',
  strong:
    'bg-slate-950/70 border-aero-amr/40 shadow-[0_30px_60px_-15px_rgb(0_0_0_/0.65),inset_0_1px_0_rgb(0_240_255_/0.06)]',
  spotlight:
    'bg-gradient-to-br from-slate-950/70 via-slate-950/50 to-aero-amr-deep/30 border-white/10 shadow-[0_0_40px_-12px_rgb(0_89_73_/0.45)]',
}

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: GlassVariant
  hoverLift?: boolean
}

/** Aceternity-style glass panel — blurred surface, subtle border, optional lift. */
export function GlassCard({
  className,
  variant = 'soft',
  hoverLift = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverLift ? { y: -2, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={cn(
        'rounded-2xl border backdrop-blur-xl',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
