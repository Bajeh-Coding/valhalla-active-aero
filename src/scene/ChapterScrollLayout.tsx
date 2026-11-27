import { useEffect, useRef } from 'react'
import { CHAPTER_IDS } from './scrollStore'
import { useScrollTimeline } from './useScrollTimeline'
import { WindTunnelScene } from './WindTunnelScene'
import { CfdCanvasOverlay } from './CfdCanvasOverlay'
import { PhotoChapterStage } from './PhotoChapterStage'
import { PhotoForceVectors } from './PhotoForceVectors'
import { NeuralOverlay } from './NeuralOverlay'
import { SplineCarCanvas } from './SplineCarCanvas'
import { useAeroStore } from '@/store'
import { TelemetryHud } from '@/ui/TelemetryHud'
import { ChapterContent } from '@/ui/chapters/ChapterContent'

/**
 * Premium cinematic stage:
 * photo atmosphere + Spline interactive 3D (hero/tunnel) + CFD + glass HUD.
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
        <PhotoChapterStage />
        {/* Soft R3F Valhalla depth layer */}
        <div className="absolute inset-0 z-[1] opacity-40 mix-blend-lighten">
          <WindTunnelScene className="h-dvh w-full" />
        </div>
        {/* Interactive Spline panel — hero + wind-tunnel chapters */}
        <SplineCarCanvas />
        <CfdCanvasOverlay />
        <PhotoForceVectors />
        <NeuralOverlay />
      </div>

      <TelemetryHud />

      {/* Pass-through so Spline orbit works; interactive UI re-enables pointer-events */}
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
