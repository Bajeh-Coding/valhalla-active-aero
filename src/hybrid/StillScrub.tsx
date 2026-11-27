import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { SCRUB_SEQUENCE, VALHALLA_ASSETS, type ValhallaAssetKey } from './assets'

interface StillScrubProps {
  /** 0…1 scroll progress through the talk. */
  progress: number
  /** Prefer chapter photo when active (snaps scrub to narrative beat). */
  activePhoto: ValhallaAssetKey
  className?: string
}

/**
 * Honest cinematic still scrub — crossfade local Commons frames.
 * No YouTube embed scrub, no AM CDN pirate rip.
 */
export function StillScrub({ progress, activePhoto, className }: StillScrubProps) {
  const frames = useMemo(
    () => SCRUB_SEQUENCE.map((key) => ({ key, asset: VALHALLA_ASSETS[key] })),
    [],
  )

  const scrubIndex = Math.min(
    frames.length - 1,
    Math.max(0, Math.floor(progress * frames.length)),
  )
  // Prefer narrative photo; blend with scrub index for continuity.
  const preferredKey = activePhoto
  const preferredIdx = frames.findIndex((f) => f.key === preferredKey)
  const activeIdx = preferredIdx >= 0 ? preferredIdx : scrubIndex

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
      data-testid="still-scrub"
    >
      {frames.map((frame, i) => {
        const dist = Math.abs(i - activeIdx)
        const opacity = dist === 0 ? 1 : dist === 1 ? 0.08 : 0
        const scale = dist === 0 ? 1 : 1.03
        return (
          <img
            key={frame.key}
            src={frame.asset.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out"
            style={{
              objectPosition: frame.asset.objectPosition,
              opacity,
              transform: `scale(${scale})`,
            }}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        )
      })}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgb(5_7_10/0.82)_0%,rgb(5_7_10/0.42)_48%,rgb(5_7_10/0.68)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(5_7_10/0.55)_100%)]" />
    </div>
  )
}
