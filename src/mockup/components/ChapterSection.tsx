import type { MockChapter } from '../data/chapters'
import { ActiveAeroSimulator } from './ActiveAeroSimulator'
import { GuideChart } from './GuideCharts'
import { GuideDiagram } from './GuideDiagrams'
import { ChapterMedia } from './ChapterMedia'

interface ChapterSectionProps {
  chapter: MockChapter
}

export function ChapterSection({ chapter }: ChapterSectionProps) {
  const n = String(chapter.number).padStart(2, '0')
  const hasDof = Boolean(chapter.dofBreakdown?.length)
  const hasSpecs = Boolean(chapter.specs?.rows.length)
  const hasModeColumns = Boolean(chapter.modeColumns?.length)
  const hasEquations = Boolean(chapter.equations?.length)
  const hasFigure = Boolean(chapter.figure)
  const hasDiagrams = Boolean(chapter.diagrams?.length)
  const hasKpi = Boolean(chapter.kpiTable?.rows.length)
  const hasRefs = Boolean(chapter.references?.length)
  const hasSimulator = Boolean(chapter.simulator)
  const hasSummary = Boolean(chapter.summary?.length)
  const hasBullets = Boolean(chapter.bullets?.length)
  const titleWidth =
    chapter.number >= 1 && chapter.number <= 11
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
          {chapter.subtitle ? (
            <p
              className="chapter-subtitle chapter-subtitle--neon font-ui mt-4 max-w-[720px] text-base leading-snug tracking-[0.35px] md:text-lg"
              data-testid={`chapter-${chapter.id}-subtitle`}
            >
              {chapter.subtitle}
            </p>
          ) : null}
          <p className="font-ui mt-3 max-w-[720px] text-[13px] font-medium leading-snug tracking-[0.35px] text-aero-amr/90 md:text-sm">
            {chapter.actionTitle}
          </p>
          <p className="font-ui mt-4 text-[12px] font-medium tracking-[0.55px] text-aero-mist/60 uppercase">
            {chapter.label}
          </p>

          {hasBullets ? (
            <ul
              className="mt-8 max-w-[720px] space-y-3"
              data-testid={`chapter-${chapter.id}-bullets`}
            >
              {chapter.bullets.map((line) => (
                <li
                  key={line.slice(0, 64)}
                  className="font-ui flex gap-3 text-base leading-relaxed tracking-[0.35px] text-aero-mist/90 md:text-lg"
                >
                  <span
                    className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-aero-amr"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {hasEquations ? (
            <ul
              className="mt-8 max-w-[640px] space-y-2 border-t border-aero-ivory/10 pt-6"
              data-testid={`chapter-${chapter.id}-equations`}
              aria-label="Ecuații"
            >
              {chapter.equations!.map((eq) => (
                <li
                  key={eq}
                  className="font-mono text-sm tracking-normal text-aero-lime/90 md:text-base"
                >
                  {eq}
                </li>
              ))}
            </ul>
          ) : null}

          {hasSummary && !hasBullets ? (
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

          {hasDof ? (
            <ul
              className="mt-10 max-w-[640px] space-y-3 border-t border-aero-ivory/10 pt-8"
              aria-label="Distribuție 14 DOF"
              data-testid={`chapter-${chapter.id}-dof`}
            >
              {chapter.dofBreakdown!.map((item) => (
                <li
                  key={item.dof + item.detail}
                  className="flex gap-4 items-baseline"
                >
                  <span className="font-display shrink-0 text-sm tracking-normal text-aero-lime/85">
                    {item.dof}
                  </span>
                  <span className="font-ui text-sm leading-relaxed tracking-[0.55px] text-aero-mist/80">
                    {item.detail}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {hasSpecs ? (
            <div
              className="mt-10 max-w-[720px] border-t border-aero-ivory/10 pt-8"
              data-testid={`chapter-${chapter.id}-specs`}
            >
              <p className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                {chapter.specs!.caption}
              </p>
              <table className="w-full border-collapse text-left">
                <tbody>
                  {chapter.specs!.rows.map((row) => (
                    <tr
                      key={row.parameter}
                      className="border-b border-aero-ivory/8 last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="font-ui py-2.5 pr-4 text-[12px] font-medium tracking-[0.55px] text-aero-mist/65"
                      >
                        {row.parameter}
                      </th>
                      <td className="font-display py-2.5 text-sm font-normal tracking-normal text-aero-ivory">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {hasModeColumns ? (
            <div
              className="mt-12 max-w-[1000px] border-t border-aero-ivory/10 pt-8"
              data-testid={`chapter-${chapter.id}-modes`}
            >
              <p className="font-ui mb-6 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                Tabel comparativ — 3 moduri de funcționare
              </p>
              <div className="grid gap-8 md:grid-cols-3">
                {chapter.modeColumns!.map((col) => (
                  <div key={col.id} className="min-w-0">
                    <p className="font-display text-lg font-normal tracking-normal text-aero-ivory">
                      {col.title}
                    </p>
                    <p className="font-ui mt-4 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                      Configurație Hardware
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {col.hardware.map((line) => (
                        <li
                          key={line}
                          className="font-ui text-sm leading-relaxed tracking-[0.35px] text-aero-mist/85"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="font-ui mt-4 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                      Condiții Activare
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {col.activation.map((line) => (
                        <li
                          key={line}
                          className="font-ui text-sm leading-relaxed tracking-[0.35px] text-aero-mist/85"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="font-ui mt-4 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                      Efect Dinamic
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {col.effect.map((line) => (
                        <li
                          key={line}
                          className="font-ui text-sm leading-relaxed tracking-[0.35px] text-aero-mist/85"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {hasKpi ? (
            <div
              className="mt-10 max-w-[800px] border-t border-aero-ivory/10 pt-8"
              data-testid={`chapter-${chapter.id}-kpi`}
            >
              <p className="font-ui mb-5 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                {chapter.kpiTable!.caption}
              </p>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-aero-ivory/15">
                    <th className="font-ui py-2 pr-4 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                      Indicator
                    </th>
                    <th className="font-ui py-2 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                      Valoare
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chapter.kpiTable!.rows.map((row) => (
                    <tr
                      key={row.indicator}
                      className="border-b border-aero-ivory/8 last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="font-ui py-2.5 pr-4 text-[12px] font-medium tracking-[0.55px] text-aero-mist/65"
                      >
                        {row.indicator}
                      </th>
                      <td className="font-display py-2.5 text-sm font-normal tracking-normal text-aero-ivory">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {hasRefs ? (
            <div
              className="mt-10 max-w-[720px] border-t border-aero-ivory/10 pt-8"
              data-testid={`chapter-${chapter.id}-references`}
            >
              <p className="font-ui mb-4 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
                Referințe Cheie
              </p>
              <ul className="space-y-2">
                {chapter.references!.map((ref) => (
                  <li
                    key={ref}
                    className="font-ui text-[13px] leading-relaxed tracking-[0.35px] text-aero-mist/75"
                  >
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {hasDiagrams
          ? chapter.diagrams!.map((id) => <GuideDiagram key={id} id={id} />)
          : null}

        {hasFigure ? (
          <GuideChart
            id={chapter.figure!.chartId}
            caption={chapter.figure!.caption}
            chapterId={chapter.id}
          />
        ) : null}

        {hasSimulator ? (
          <div className="chapter-reveal is-revealed">
            <ActiveAeroSimulator />
          </div>
        ) : null}
      </div>
    </section>
  )
}
