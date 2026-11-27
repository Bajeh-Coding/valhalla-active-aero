import { useEffect, useRef } from 'react'
import { CHAPTER_IDS } from './scrollStore'
import { useScrollTimeline } from './useScrollTimeline'
import { WindTunnelScene } from './WindTunnelScene'
import { CfdCanvasOverlay } from './CfdCanvasOverlay'
import { PhotoChapterStage } from './PhotoChapterStage'
import { PhotoForceVectors } from './PhotoForceVectors'
import { NeuralOverlay } from './NeuralOverlay'
import { useAeroStore } from '@/store'
import { TelemetryHud } from '@/ui/TelemetryHud'
import { ChapterContent } from '@/ui/chapters/ChapterContent'

/**
 * Photo-led cinematic stage:
 * full-bleed chapter photography + CFD streamlines + soft 3D depth + glass HUD.
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
        {/* Soft 3D Valhalla as depth layer over photography */}
        <div className="absolute inset-0 z-[1] opacity-45 mix-blend-lighten">
          <WindTunnelScene className="h-dvh w-full" />
        </div>
        <CfdCanvasOverlay />
        <PhotoForceVectors />
        <NeuralOverlay />
      </div>

      <TelemetryHud />

      <div className="relative z-10">
        {CHAPTER_IDS.map((id) => (
          <section key={id} data-chapter={id} className="relative min-h-[100dvh]">
            <ChapterContent id={id} />
          </section>
        ))}
      </div>
    </div>
  )
}
