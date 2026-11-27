import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const accentText = {
  cyan: 'text-aero-cyan',
  lime: 'text-aero-lime',
  crimson: 'text-aero-crimson',
  muted: 'text-aero-muted',
} as const

export function MetricChip({
  label,
  value,
  unit,
  accent = 'cyan',
  icon: Icon,
  className,
}: {
  label: string
  value: string
  unit?: string
  accent?: keyof typeof accentText
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-aero-muted uppercase">
        {Icon ? <Icon className="size-3 opacity-70" aria-hidden /> : null}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span
          className={cn(
            'font-mono text-lg font-medium tabular-nums',
            accentText[accent],
          )}
        >
          {value}
        </span>
        {unit ? (
          <span className="font-mono text-[10px] text-aero-muted">{unit}</span>
        ) : null}
      </div>
    </div>
  )
}
