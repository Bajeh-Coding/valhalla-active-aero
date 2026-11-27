import { useEffect, useRef } from 'react'
import { CHAPTER_IDS } from './scrollStore'
import { useScrollTimeline } from './useScrollTimeline'
import { PhotoStage } from './PhotoStage'
import { useAeroStore } from '@/store'
import { ChapterContent } from '@/ui/chapters/ChapterContent'

/**
 * Photo-led cinematic stage:
 * full-bleed photography + soft vignette + sparse chapter typography.
 * No Spline, mesh hero, CFD overlays, or persistent HUD.
 */
export function ChapterScrollLayout() {
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollTimeline(rootRef)

  const applyModeSetpoints = useAeroStore((s) => s.applyModeSetpoints)
  const setSpeedKmh = useAeroStore((s) => s.setSpeedKmh)
  const setThrottlePct = useAeroStore((s) => s.setThrottlePct)

  useEffect(() => {
    applyModeSetpoints('STANDARD')
    setSpeedKmh(180)
    setThrottlePct(40)
  }, [applyModeSetpoints, setSpeedKmh, setThrottlePct])

  return (
    <div ref={rootRef} className="relative bg-aero-bg text-aero-text">
      <div className="pointer-events-none fixed inset-0 z-0">
        <PhotoStage />
      </div>

      <div className="pointer-events-none relative z-10">
        {CHAPTER_IDS.map((id) => (
          <section key={id} data-chapter={id} className="relative min-h-[100dvh]">
            <ChapterContent id={id} />
          </section>
        ))}
      </div>
    </div>
  )
}
