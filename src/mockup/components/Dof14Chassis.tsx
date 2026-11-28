import { useEffect, useId, useRef, useState } from 'react'
import { Cap03DofViewer } from './Cap03DofViewer'

type HotspotId =
  | 'monocoque'
  | 'susp-front'
  | 'susp-rear'
  | 'wheel-front'
  | 'wheel-rear'

interface Hotspot {
  id: HotspotId
  /** Percent of viewer width (0–100). Fixed Cap3 side cam: nose toward screen left. */
  x: number
  /** Percent of viewer height (0–100). */
  y: number
  label: string
  dof: string
  detail: string
  photo: string
  photoAlt: string
}

/**
 * Hotspot layout for fixed Cap 03 side profile (camera on +X; GLB nose screen-left).
 * Guide fidelity only — 6 / 4 / 4 DOF copy unchanged from Slide 3.
 */
const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'monocoque',
    x: 50,
    y: 42,
    label: 'Monococă',
    dof: '6 DOF',
    detail: 'Șasiu — translații x, y, z + rotații roll, pitch, yaw',
    photo: '/images/am-official/am-ch07-doors.jpg',
    photoAlt: 'Monococă Valhalla — cabină carbon cu uși deschise',
  },
  {
    id: 'susp-front',
    x: 29,
    y: 50,
    label: 'Suspensie față',
    dof: '4 DOF',
    detail: 'Cursa verticală a suspensiilor la fiecare roată (1 DOF × 4)',
    photo: '/images/am-official/am-ch07-side.jpg',
    photoAlt: 'Pasaj roată față Valhalla — zonă suspensie',
  },
  {
    id: 'susp-rear',
    x: 71,
    y: 52,
    label: 'Suspensie spate',
    dof: '4 DOF',
    detail: 'Cursa verticală a suspensiilor la fiecare roată (1 DOF × 4)',
    photo: '/images/am-official/am-ch07-aero-under.jpg',
    photoAlt: 'Underbody Valhalla — structură punte spate',
  },
  {
    id: 'wheel-front',
    x: 26,
    y: 64,
    label: 'Roată față',
    dof: '4 DOF',
    detail: 'Dinamica de rotație și alunecarea longitudinală a roților (1 DOF × 4)',
    photo: '/images/am-official/am-ch07-front.jpg',
    photoAlt: 'Detaliu față Valhalla — roată și caroserie',
  },
  {
    id: 'wheel-rear',
    x: 74,
    y: 64,
    label: 'Roată spate',
    dof: '4 DOF',
    detail: 'Dinamica de rotație și alunecarea longitudinală a roților (1 DOF × 4)',
    photo: '/images/am-official/am-ch03-fundamente.jpg',
    photoAlt: 'Profil lateral Valhalla — roți și siluetă',
  },
] as const

function HotspotButton({
  hotspot,
  active,
  onToggle,
}: {
  hotspot: Hotspot
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      data-testid={`dof-hotspot-${hotspot.id}`}
      aria-expanded={active}
      aria-controls={`dof-popover-${hotspot.id}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={[
        'font-ui absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center',
        'rounded-full border text-[15px] leading-none tracking-normal transition-all duration-300',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aero-lime',
        active
          ? 'border-aero-lime bg-aero-lime text-aero-void scale-110'
          : 'border-aero-amr/70 bg-aero-ink/90 text-aero-ivory hover:border-aero-lime hover:text-aero-lime',
      ].join(' ')}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
      }}
      aria-label={`${hotspot.label}: ${hotspot.dof}`}
    >
      <span aria-hidden>{active ? '×' : '+'}</span>
    </button>
  )
}

function HotspotPopover({
  hotspot,
  onClose,
}: {
  hotspot: Hotspot
  onClose: () => void
}) {
  const titleId = useId()
  const preferAbove = hotspot.y > 55
  const clampLeft = Math.min(72, Math.max(18, hotspot.x))

  let transform = preferAbove
    ? 'translate(-50%, calc(-100% - 12px))'
    : 'translate(-50%, 16px)'

  if (hotspot.x < 28) {
    transform = preferAbove
      ? 'translate(-8%, calc(-100% - 12px))'
      : 'translate(-8%, 16px)'
  } else if (hotspot.x > 72) {
    transform = preferAbove
      ? 'translate(-92%, calc(-100% - 12px))'
      : 'translate(-92%, 16px)'
  }

  return (
    <div
      id={`dof-popover-${hotspot.id}`}
      role="dialog"
      aria-labelledby={titleId}
      data-testid={`dof-popover-${hotspot.id}`}
      className="absolute z-30 w-[min(220px,70vw)] overflow-hidden border border-aero-ivory/12 bg-aero-ink/96 shadow-[0_16px_40px_rgb(0_0_0_/0.55)] backdrop-blur-md"
      style={{
        left: `${clampLeft}%`,
        top: `${hotspot.y}%`,
        transform,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative h-[72px] overflow-hidden bg-aero-void">
        <img
          src={hotspot.photo}
          alt={hotspot.photoAlt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-aero-ink/75 via-transparent to-transparent" />
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <p
            id={titleId}
            className="font-ui text-[9px] font-medium tracking-[0.4px] text-aero-mist/70 uppercase"
          >
            {hotspot.label}
          </p>
          <p className="font-display shrink-0 text-[13px] tracking-normal text-aero-lime">
            {hotspot.dof}
          </p>
        </div>
        <p className="font-ui mt-1 text-[11px] leading-snug tracking-[0.3px] text-aero-ivory/90">
          {hotspot.detail}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="font-ui mt-2 text-[9px] tracking-[0.35em] text-aero-mist/50 uppercase transition-colors hover:text-aero-ivory"
        >
          Închide
        </button>
      </div>
    </div>
  )
}

/** Cap 03 — Schemă 14 DOF pe Valhalla GLB (side view fix), cu hotspots interactive. */
export function Dof14Diagram() {
  const [activeId, setActiveId] = useState<HotspotId | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const active = HOTSPOTS.find((h) => h.id === activeId) ?? null

  useEffect(() => {
    if (!activeId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId])

  return (
    <figure
      ref={rootRef}
      className="mt-10 max-w-[960px] border-t border-aero-ivory/10 pt-8"
      data-testid="diagram-dof14"
      onClick={() => setActiveId(null)}
    >
      <figcaption className="font-ui mb-5 flex flex-wrap items-end justify-between gap-3 text-[10px] font-medium tracking-[0.55px] text-aero-mist/45 uppercase">
        <span>Schemă — 14 grade de libertate (VI-CarRealTime)</span>
        <span className="tracking-[0.35px] text-aero-amr/80 normal-case">
          6 șasiu + 4 suspensii + 4 roți
        </span>
      </figcaption>

      <div className="relative overflow-visible border border-aero-ivory/8 bg-gradient-to-b from-aero-ink to-aero-void">
        <Cap03DofViewer />

        {HOTSPOTS.map((h) => (
          <HotspotButton
            key={h.id}
            hotspot={h}
            active={activeId === h.id}
            onToggle={() => setActiveId((cur) => (cur === h.id ? null : h.id))}
          />
        ))}

        {active ? (
          <HotspotPopover hotspot={active} onClose={() => setActiveId(null)} />
        ) : null}
      </div>

      <p className="font-ui mt-4 text-[11px] tracking-[0.35px] text-aero-mist/50">
        Apasă «+» pe monococă, suspensii sau roți — Total = 6 + 4 + 4 = 14 DOF
      </p>
    </figure>
  )
}
