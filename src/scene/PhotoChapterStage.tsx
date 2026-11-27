import { useCallback, useState } from 'react'
import {
  CHAPTER_PHOTO_KEYS,
  PHOTO_ASSETS,
  type PhotoKey,
} from '@/data/photoAssets'
import { useScrollStore } from './scrollStore'

/**
 * Full-bleed photo stage — crossfades chapter photography behind CFD / glass UI.
 * Local `/images/*` preferred; falls back to Unsplash CDN on load error.
 */
export function PhotoChapterStage() {
  const chapterIndex = useScrollStore((s) => s.chapterIndex)
  const chapterProgress = useScrollStore((s) => s.chapterProgress)
  const activeKey = CHAPTER_PHOTO_KEYS[Math.min(chapterIndex, 4)] ?? 'hero'

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {(Object.keys(PHOTO_ASSETS) as PhotoKey[]).map((key) => {
        const isActive = key === activeKey
        // Soft Ken Burns: scale with intra-chapter progress when active
        const scale = isActive ? 1 + chapterProgress * 0.04 : 1.02
        return (
          <PhotoLayer
            key={key}
            photoKey={key}
            active={isActive}
            scale={scale}
          />
        )
      })}
      {/* Obsidian vignette so Cinzel type + glass HUD stay legible */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 75% 60% at 50% 42%, transparent 18%, rgb(5 7 10 / 0.55) 100%),
            linear-gradient(to top, rgb(5 7 10 / 0.94) 0%, transparent 42%, rgb(5 7 10 / 0.5) 100%)
          `,
        }}
      />
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
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
      style={{
        opacity: active ? 1 : 0,
        transform: `scale(${scale})`,
        transition: 'opacity 700ms ease-out, transform 1.2s ease-out',
      }}
      data-photo={photoKey}
      data-active={active ? 'true' : 'false'}
    />
  )
}
