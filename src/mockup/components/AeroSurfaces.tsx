import type { MockAeroSurface } from '../data/chapters'

interface AeroSurfacesProps {
  surfaces: readonly MockAeroSurface[]
  chapterId: string
}

/**
 * Cap 07 — right-rail panel of official Valhalla active aero surfaces.
 * English copy + photos from astonmartin.com/en/models/valhalla (EN; RO later).
 * Compact vertical list; luxury dark theme; no card chrome.
 */
export function AeroSurfaces({ surfaces, chapterId }: AeroSurfacesProps) {
  return (
    <aside
      className="chapter-reveal border-t border-aero-ivory/10 pt-8 lg:border-t-0 lg:border-l lg:border-aero-ivory/10 lg:pt-0 lg:pl-8"
      data-testid={`chapter-${chapterId}-surfaces`}
      aria-label="Valhalla active aerodynamic surfaces"
    >
      <p className="font-ui text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        Aerodynamic Directives
      </p>
      <h3 className="font-display mt-3 text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.2] font-normal tracking-normal text-aero-ivory">
        Active aerodynamic surfaces
      </h3>
      <p className="font-ui mt-4 text-[13px] leading-relaxed tracking-[0.35px] text-aero-mist/80 md:text-sm">
        The silhouette of the Valhalla is a masterclass in airflow manipulation.
        Working hand-in-hand with Aston Martin Performance Technologies, our
        designers bypassed the traditional requirement for a giant, static wing
        by engineering an intricate network of active surfaces and underbody
        channels. Every contour of the predominantly carbon fibre body is
        designed to manage thermal energy and split the air, generating immense,
        balanced downforce that anchors Valhalla at speed without penalising
        drag.
      </p>

      <ul className="mt-8 list-none space-y-0 p-0">
        {surfaces.map((surface, index) => {
          const n = String(index + 1).padStart(2, '0')

          return (
            <li
              key={surface.id}
              data-testid={`surface-${surface.id}`}
              className="border-t border-aero-ivory/8 py-7 first:border-t-0 first:pt-0"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-aero-ink">
                <img
                  src={surface.image.src}
                  alt={surface.image.alt}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: surface.image.objectPosition ?? '50% 45%',
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-aero-void/40 via-transparent to-transparent" />
              </div>

              <p className="font-display mt-4 text-sm font-normal tracking-normal text-aero-lime/85">
                {n}
              </p>
              <h4 className="font-display mt-1.5 text-[1.05rem] leading-[1.25] font-normal tracking-normal text-aero-ivory md:text-[1.125rem]">
                {surface.oemName}
              </h4>
              <p className="font-ui mt-3 text-[13px] leading-relaxed tracking-[0.35px] text-aero-mist/85 md:text-sm">
                {surface.descriptionEn}
              </p>
              {surface.facts?.length ? (
                <ul className="mt-4 flex flex-col gap-1.5 border-t border-aero-ivory/8 pt-3">
                  {surface.facts.map((fact) => (
                    <li
                      key={fact}
                      className="font-ui text-[10px] tracking-[0.55px] text-aero-mist/50 uppercase"
                    >
                      {fact}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
