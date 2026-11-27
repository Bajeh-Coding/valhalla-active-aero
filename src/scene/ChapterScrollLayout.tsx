import { useEffect, useRef } from 'react'
import { CHAPTER_IDS } from './scrollStore'
import { useScrollTimeline } from './useScrollTimeline'
import { WindTunnelScene } from './WindTunnelScene'
import { CfdCanvasOverlay } from './CfdCanvasOverlay'
import { useAeroStore } from '@/store'
import { TelemetryHud } from '@/ui/TelemetryHud'
import { ChapterContent } from '@/ui/chapters/ChapterContent'

/**
 * Fixed cinematic stage (3D + 2D CFD) + scroll chapters + luxury glass HUD.
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
        <CfdCanvasOverlay />
        {/* Editorial vignette — brand type readability */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 45%, transparent 30%, rgb(5 7 10 / 0.55) 100%),
              linear-gradient(to top, rgb(5 7 10 / 0.92) 0%, transparent 38%, rgb(5 7 10 / 0.45) 100%)
            `,
          }}
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
