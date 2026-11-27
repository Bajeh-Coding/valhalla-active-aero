import { useEffect, useRef } from 'react'
import { CHAPTER_META, useScrollStore } from './scrollStore'
import { useScrollTimeline } from './useScrollTimeline'
import { WindTunnelScene } from './WindTunnelScene'
import { useAeroStore } from '@/store'

/**
 * Scroll root + pinned WebGL stage.
 * Chapter copy is stubbed for Phase 4; exposes scroll progress via store.
 */
export function ChapterScrollLayout() {
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollTimeline(rootRef)

  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const progress = useScrollStore((s) => s.progress)
  const chapter3Pinned = useScrollStore((s) => s.chapter3Pinned)
  const mode = useAeroStore((s) => s.mode)
  const aoaDeg = useAeroStore((s) => s.aoaDeg)
  const splitter = useAeroStore((s) => s.splitter)
  const speedKmh = useAeroStore((s) => s.speedKmh)
  const applyModeSetpoints = useAeroStore((s) => s.applyModeSetpoints)
  const setSpeedKmh = useAeroStore((s) => s.setSpeedKmh)
  const setThrottlePct = useAeroStore((s) => s.setThrottlePct)
  const setBrakePct = useAeroStore((s) => s.setBrakePct)

  // Demo motion so streamlines / forces are visible in Phase 3 screenshots.
  useEffect(() => {
    applyModeSetpoints('PASSIVE')
    setSpeedKmh(180)
    setThrottlePct(40)
  }, [applyModeSetpoints, setSpeedKmh, setThrottlePct])

  return (
    <div ref={rootRef} className="relative bg-aero-bg text-aero-text">
      {/* Fixed WebGL stage */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <WindTunnelScene className="h-dvh w-full" />
      </div>

      {/* Minimal status chip — full glass HUD is Phase 4 */}
      <div className="pointer-events-none fixed top-4 right-4 z-20 rounded-md border border-aero-border bg-aero-panel px-3 py-2 font-mono text-[11px] backdrop-blur-md">
        <div className="text-aero-cyan">
          CH {chapterIndex + 1}/5 · {(progress * 100).toFixed(0)}%
          {chapter3Pinned ? ' · PIN' : ''}
        </div>
        <div className="mt-1 text-aero-muted">
          {mode} · AOA {aoaDeg.toFixed(1)}° · {splitter} · {speedKmh.toFixed(0)} km/h
        </div>
      </div>

      {/* Tall scroll chapters (stub copy) */}
      <div className="relative z-10">
        {CHAPTER_META.map((ch) => (
          <section
            key={ch.id}
            data-chapter={ch.id}
            className="flex min-h-[100dvh] items-end px-6 pb-16 pt-24 md:px-12"
          >
            <div className="pointer-events-auto max-w-md rounded-lg border border-aero-border bg-aero-panel/80 p-5 backdrop-blur-md">
              <p className="font-mono text-[10px] tracking-[0.2em] text-aero-cyan uppercase">
                Chapter {ch.index + 1}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">{ch.title}</h2>
              <p className="mt-2 text-sm text-aero-muted">
                Phase 4 will replace this stub with full narrative + HUD controls.
              </p>

              {ch.id === 'control' && (
                <div className="pointer-events-auto mt-4 flex flex-wrap gap-2">
                  {(['DRS', 'PASSIVE', 'MAXP', 'AEROBRAKE'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`rounded border px-2 py-1 font-mono text-[10px] ${
                        mode === m
                          ? 'border-aero-cyan text-aero-cyan'
                          : 'border-aero-border text-aero-muted'
                      }`}
                      onClick={() => {
                        applyModeSetpoints(m)
                        if (m === 'DRS') {
                          setSpeedKmh(200)
                          setThrottlePct(80)
                          setBrakePct(0)
                        } else if (m === 'AEROBRAKE') {
                          setBrakePct(50)
                        } else {
                          setBrakePct(0)
                          setThrottlePct(40)
                        }
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
