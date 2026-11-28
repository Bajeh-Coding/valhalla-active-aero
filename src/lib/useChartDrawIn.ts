import { type RefObject, useEffect } from 'react'

const LINE_MS = 1100
const STAGGER_MS = 100

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Measure paths/circles and animate stroke draw-in; bars/areas via CSS class. */
function playDrawIn(root: HTMLElement): void {
  if (root.dataset.chartDrawn === '1') return
  root.dataset.chartDrawn = '1'

  if (prefersReducedMotion()) {
    root.classList.add('is-chart-drawn')
    return
  }

  const lines = Array.from(
    root.querySelectorAll<SVGGeometryElement>('[data-chart-line]'),
  )

  lines.forEach((el, i) => {
    let len = 0
    try {
      len = el.getTotalLength()
    } catch {
      len = 0
    }
    if (len <= 0) return

    const decorative = el.getAttribute('stroke-dasharray')
    if (decorative) el.setAttribute('data-dash-final', decorative)

    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    el.style.transition = `stroke-dashoffset ${LINE_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * STAGGER_MS}ms`
  })

  // Two rAFs so the browser commits the "hidden" dash state before reveal.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.add('is-chart-drawn')
      lines.forEach((el) => {
        el.style.strokeDashoffset = '0'
      })
    })
  })

  const restoreAt = LINE_MS + lines.length * STAGGER_MS + 80
  window.setTimeout(() => {
    lines.forEach((el) => {
      const final = el.getAttribute('data-dash-final')
      el.style.transition = ''
      if (final) {
        el.style.strokeDasharray = final
        el.style.strokeDashoffset = ''
      } else {
        el.style.strokeDasharray = ''
        el.style.strokeDashoffset = ''
      }
      el.removeAttribute('data-dash-final')
    })
  }, restoreAt)
}

/**
 * When a chart figure enters view (or its `.chapter-reveal` host gets
 * `is-revealed`), draw lines via stroke-dashoffset and grow bars.
 * No-ops under prefers-reduced-motion (shows final state immediately).
 */
export function useChartDrawIn(
  rootRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (prefersReducedMotion()) {
      playDrawIn(root)
      return
    }

    const revealHost =
      (root.closest('.chapter-reveal') as HTMLElement | null) ?? root

    if (revealHost.classList.contains('is-revealed')) {
      playDrawIn(root)
      return
    }

    const mo = new MutationObserver(() => {
      if (revealHost.classList.contains('is-revealed')) {
        playDrawIn(root)
        mo.disconnect()
        io.disconnect()
      }
    })
    mo.observe(revealHost, { attributes: true, attributeFilter: ['class'] })

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting || e.intersectionRatio > 0)) {
          playDrawIn(root)
          io.disconnect()
          mo.disconnect()
        }
      },
      { threshold: [0, 0.01, 0.12], rootMargin: '0px 0px -4% 0px' },
    )
    io.observe(root)

    return () => {
      mo.disconnect()
      io.disconnect()
    }
  }, [rootRef])
}
