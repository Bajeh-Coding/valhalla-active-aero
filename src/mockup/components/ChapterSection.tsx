import type { MockChapter } from '../data/chapters'
import { ChapterMedia } from './ChapterMedia'

interface ChapterSectionProps {
  chapter: MockChapter
}

/**
 * One job per section: number + headline + short body + one visual plane.
 * No decorative card grids.
 */
export function ChapterSection({ chapter }: ChapterSectionProps) {
  const n = String(chapter.number).padStart(2, '0')

  return (
    <section
      id={`chapter-${chapter.id}`}
      data-chapter-id={chapter.id}
      data-testid={`chapter-${chapter.id}`}
      className="chapter-section relative scroll-mt-16 border-t border-aero-ivory/6"
    >
      <ChapterMedia chapter={chapter} />

      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="chapter-reveal max-w-[640px]">
          <p className="font-ui text-[10px] tracking-[0.32em] text-aero-mist/55 uppercase">
            {chapter.kicker}
          </p>
          <p className="font-mono mt-4 text-aero-lime/80 text-sm tracking-[0.2em]">
            {n}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] tracking-[0.06em] text-aero-ivory uppercase">
            {chapter.headline}
          </h2>
          <p className="font-ui mt-2 text-[11px] tracking-[0.28em] text-aero-mist/60 uppercase">
            {chapter.label}
          </p>
          <p className="font-serif mt-8 text-lg leading-relaxed text-aero-mist/90 md:text-xl">
            {chapter.body}
          </p>
        </div>
      </div>
    </section>
  )
}
