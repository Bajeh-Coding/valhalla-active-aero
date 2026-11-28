import type { MockChapter } from '../data/chapters'
import { ChapterMedia } from './ChapterMedia'

interface ChapterSectionProps {
  chapter: MockChapter
}

export function ChapterSection({ chapter }: ChapterSectionProps) {
  const n = String(chapter.number).padStart(2, '0')
  const hasNotes = Boolean(chapter.notes?.length)
  const hasSummary = Boolean(chapter.summary?.length)
  const titleWidth =
    chapter.number === 1 || chapter.number === 10
      ? 'max-w-[920px]'
      : 'max-w-[640px]'

  return (
    <section
      id={`chapter-${chapter.id}`}
      data-chapter-id={chapter.id}
      data-testid={`chapter-${chapter.id}`}
      className="chapter-section relative scroll-mt-16 border-t border-aero-ivory/6"
    >
      <ChapterMedia chapter={chapter} />

      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className={`chapter-reveal ${titleWidth}`}>
          <p className="font-ui text-[12px] font-medium tracking-[0.55px] text-aero-mist/55 uppercase">
            {chapter.kicker}
          </p>
          <p className="font-display mt-4 text-sm font-normal tracking-normal text-aero-lime/85">
            {n}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.75rem,3.8vw,3rem)] leading-[1.15] font-normal tracking-normal text-aero-ivory">
            {chapter.headline}
          </h2>
          <p className="font-ui mt-2 text-[12px] font-medium tracking-[0.55px] text-aero-mist/60 uppercase">
            {chapter.label}
          </p>
          <p className="font-ui mt-8 max-w-[640px] text-base leading-relaxed tracking-[0.55px] text-aero-mist/90 md:text-lg">
            {chapter.body}
          </p>

          {hasSummary ? (
            <ol
              className="mt-10 max-w-[720px] space-y-3"
              data-testid={`chapter-${chapter.id}-summary`}
            >
              {chapter.summary!.map((line, i) => (
                <li
                  key={i}
                  className="font-ui text-[13px] leading-relaxed tracking-[0.4px] text-aero-mist/75 md:text-sm"
                >
                  {line}
                </li>
              ))}
            </ol>
          ) : null}

          {hasNotes ? (
            <aside
              className="mt-12 max-w-[640px] border-t border-aero-ivory/10 pt-6"
              aria-label="Surse"
              data-testid={`chapter-${chapter.id}-notes`}
            >
              <p className="font-ui mb-4 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                Surse
              </p>
              <ol className="space-y-4">
                {chapter.notes!.map((note, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-ui shrink-0 text-[10px] tracking-[0.2em] text-aero-mist/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="font-ui text-[11px] leading-relaxed tracking-[0.35px] text-aero-mist/55">
                        {note.text}
                      </p>
                      {note.quote ? (
                        <blockquote className="font-ui mt-2 border-l border-aero-amr/50 pl-3 text-[11px] leading-relaxed tracking-[0.35px] text-aero-mist/70 italic">
                          &ldquo;{note.quote}&rdquo;
                        </blockquote>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  )
}
