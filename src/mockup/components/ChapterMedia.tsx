import type { MockChapter } from '../data/chapters'

interface ChapterMediaProps {
  chapter: MockChapter
}

/** Full-bleed cinematic Valhalla plane — one image per chapter. */
export function ChapterMedia({ chapter }: ChapterMediaProps) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
      <img
        src={chapter.image.src}
        alt=""
        className="chapter-parallax h-full w-full scale-105 object-cover"
        style={{ objectPosition: chapter.image.objectPosition ?? '50% 45%' }}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-aero-void via-aero-void/25 to-transparent" />
    </div>
  )
}
