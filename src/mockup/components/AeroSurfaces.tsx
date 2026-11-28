import type { MockAeroSurface } from '../data/chapters'

interface AeroSurfacesProps {
  surfaces: readonly MockAeroSurface[]
  chapterId: string
}

/**
 * Cap 07 — premium surface blocks (image + OEM name + RO role).
 * Visual rhythm via spacing / hairlines; no card chrome.
 */
export function AeroSurfaces({ surfaces, chapterId }: AeroSurfacesProps) {
  return (
    <div
      className="mt-16 space-y-0 border-t border-aero-ivory/10 pt-4 md:mt-20"
      data-testid={`chapter-${chapterId}-surfaces`}
      aria-label="Suprafețe aerodinamice Active Aero"
    >
      <p className="font-ui mb-10 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase md:mb-14">
        Suprafețe · Aston Martin official
      </p>

      <ul className="list-none space-y-0 p-0">
        {surfaces.map((surface, index) => {
          const n = String(index + 1).padStart(2, '0')
          const flip = index % 2 === 1

          return (
            <li
              key={surface.id}
              data-testid={`surface-${surface.id}`}
              className="chapter-reveal border-t border-aero-ivory/8 py-12 md:py-16"
            >
              <div
                className={`grid items-center gap-8 md:grid-cols-12 md:gap-12 ${
                  flip ? 'md:[direction:rtl]' : ''
                }`}
              >
                <div
                  className={`md:col-span-7 ${flip ? 'md:[direction:ltr]' : ''}`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-aero-ink">
                    <img
                      src={surface.image.src}
                      alt={surface.image.alt}
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition:
                          surface.image.objectPosition ?? '50% 45%',
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-aero-void/35 via-transparent to-transparent" />
                  </div>
                </div>

                <div
                  className={`md:col-span-5 ${flip ? 'md:[direction:ltr]' : ''}`}
                >
                  <p className="font-display text-sm font-normal tracking-normal text-aero-lime/85">
                    {n}
                  </p>
                  <h3 className="font-display mt-3 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.2] font-normal tracking-normal text-aero-ivory">
                    {surface.oemName}
                  </h3>
                  <p className="font-ui mt-5 text-[15px] leading-relaxed tracking-[0.55px] text-aero-mist/90 md:text-base">
                    {surface.roleRo}
                  </p>
                  {surface.facts?.length ? (
                    <ul className="mt-6 flex flex-col gap-2 border-t border-aero-ivory/8 pt-5">
                      {surface.facts.map((fact) => (
                        <li
                          key={fact}
                          className="font-ui text-[11px] tracking-[0.55px] text-aero-mist/55 uppercase"
                        >
                          {fact}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
