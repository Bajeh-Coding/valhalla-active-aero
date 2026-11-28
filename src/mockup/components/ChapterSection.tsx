import type { MockChapter } from '../data/chapters'
import { ChapterMedia } from './ChapterMedia'

interface ChapterSectionProps {
  chapter: MockChapter
}

/**
 * One job per section: number + headline + short body + one visual plane.
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
          <p className="font-ui text-[10px] font-medium tracking-[0.32em] text-aero-mist/55 uppercase">
            {chapter.kicker}
          </p>
          <p className="font-ui mt-4 text-sm font-light tracking-[0.28em] text-aero-lime/85">
            {n}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.85rem,4.2vw,3.15rem)] leading-[1.02] font-light tracking-[0.04em] text-aero-ivory uppercase">
            {chapter.headline}
          </h2>
          <p className="font-ui mt-2 text-[11px] font-medium tracking-[0.28em] text-aero-mist/60 uppercase">
            {chapter.label}
          </p>
          <p className="font-sans mt-8 text-base font-light leading-relaxed text-aero-mist/90 md:text-lg">
            {chapter.body}
          </p>
        </div>
      </div>
    </section>
  )
}
