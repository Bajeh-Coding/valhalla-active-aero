import { useCallback, useEffect, useState } from 'react'
import {
  CHAPTER_PHOTO_KEYS,
  PHOTO_ASSETS,
  type PhotoKey,
} from '@/data/photoAssets'
import { useAeroStore } from '@/store'
import { useScrollStore } from './scrollStore'

/**
 * Full-bleed photo stage — dominant edge-to-edge plane.
 * Soft vignette for type readability; optional mode data-attr for CSS cues.
 * No Spline, no mesh hero, no force/CFD overlays.
 */
export function PhotoStage() {
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const chapterProgress = useScrollStore((s) => s.chapterProgress)
  const mode = useAeroStore((s) => s.mode)
  const [reduced, setReduced] = useState(false)
  const activeKey =
    CHAPTER_PHOTO_KEYS[Math.min(chapterIndex, CHAPTER_PHOTO_KEYS.length - 1)] ??
    'hero'

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[var(--void,#05070A)]"
      aria-hidden
      data-testid="photo-stage"
      data-aero-mode={mode}
      data-chapter-index={chapterIndex}
    >
      {(Object.keys(PHOTO_ASSETS) as PhotoKey[]).map((key) => {
        const isActive = key === activeKey
        // Subtle scrub scale — art-direction gesture #1; static when reduced motion
        const scale =
          reduced || !isActive ? 1 : 1 + chapterProgress * 0.035
        return (
          <PhotoLayer
            key={key}
            photoKey={key}
            active={isActive}
            scale={scale}
          />
        )
      })}

      {/* Soft cinematic vignette — photo stays dominant (≥85% void+photo) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 78% 62% at 50% 38%, transparent 28%, rgb(5 7 10 / 0.42) 100%),
            linear-gradient(to top, rgb(5 7 10 / 0.82) 0%, transparent 36%, rgb(5 7 10 / 0.28) 100%)
          `,
        }}
      />

      {/* Mode cue — hairline only on A3, no HUD chrome */}
      {chapterIndex === 3 ? (
        <div
          className="absolute inset-x-0 bottom-0 h-px opacity-40"
          style={{
            background:
              mode === 'MAXP'
                ? 'linear-gradient(90deg, transparent, #C4DF00, transparent)'
                : mode === 'DRS'
                  ? 'linear-gradient(90deg, transparent, #8B929A, transparent)'
                  : mode === 'AEROBRAKE'
                    ? 'linear-gradient(90deg, transparent, #E8E4DC, transparent)'
                    : 'linear-gradient(90deg, transparent, #005949, transparent)',
          }}
          data-mode-cue={mode}
        />
      ) : null}
    </div>
  )
}

function PhotoLayer({
  photoKey,
  active,
  scale,
}: {
  photoKey: PhotoKey
  active: boolean
  scale: number
}) {
  const asset = PHOTO_ASSETS[photoKey]
  const [src, setSrc] = useState<string>(asset.local)

  const onError = useCallback(() => {
    setSrc((prev) => (prev === asset.cdn ? prev : asset.cdn))
  }, [asset.cdn])

  return (
    <img
      src={src}
      alt=""
      onError={onError}
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        opacity: active ? 1 : 0,
        transform: `scale(${scale})`,
        transition: 'opacity 700ms ease-out, transform 1.2s ease-out',
        objectPosition: photoKey === 'side' ? '40% 50%' : '50% 45%',
      }}
      data-photo={photoKey}
      data-active={active ? 'true' : 'false'}
    />
  )
}
