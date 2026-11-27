import { useEffect, useRef } from 'react'
import { CHAPTER_IDS } from './scrollStore'
import { useScrollTimeline } from './useScrollTimeline'
import { WindTunnelScene } from './WindTunnelScene'
import { useAeroStore } from '@/store'
import { TelemetryHud } from '@/ui/TelemetryHud'
import { ChapterContent } from '@/ui/chapters/ChapterContent'

/**
 * Fixed WebGL stage + scroll chapters + glass HUD.
 * Scroll progress via `useScrollStore`; aero via `useAeroStore`.
 */
export function ChapterScrollLayout() {
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollTimeline(rootRef)

  const applyModeSetpoints = useAeroStore((s) => s.applyModeSetpoints)
  const setSpeedKmh = useAeroStore((s) => s.setSpeedKmh)
  const setThrottlePct = useAeroStore((s) => s.setThrottlePct)

  useEffect(() => {
    applyModeSetpoints('PASSIVE')
    setSpeedKmh(180)
    setThrottlePct(40)
  }, [applyModeSetpoints, setSpeedKmh, setThrottlePct])

  return (
    <div ref={rootRef} className="relative bg-aero-bg text-aero-text">
      <div className="pointer-events-none fixed inset-0 z-0">
        <WindTunnelScene className="h-dvh w-full" />
        {/* Soft vignette so brand type reads over the tunnel */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-aero-bg via-transparent to-aero-bg/50"
          aria-hidden
        />
      </div>

      <TelemetryHud />

      <div className="relative z-10">
        {CHAPTER_IDS.map((id) => (
          <section key={id} data-chapter={id} className="relative">
            <ChapterContent id={id} />
          </section>
        ))}
      </div>
    </div>
  )
}
