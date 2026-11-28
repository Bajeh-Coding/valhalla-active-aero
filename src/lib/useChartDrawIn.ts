import { type RefObject, useEffect } from 'react'

const LINE_MS = 1100
const STAGGER_MS = 100
/** Require a meaningful slice of the chart in view before draw-in starts. */
const ENTER_RATIO = 0.22

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function lineElements(root: HTMLElement): SVGGeometryElement[] {
  return Array.from(
    root.querySelectorAll<SVGGeometryElement>('[data-chart-line]'),
  )
}

/** Hide stroke geometry until playDrawIn runs (avoids full-chart flash). */
function armLines(root: HTMLElement): void {
  lineElements(root).forEach((el) => {
    let len = 0
    try {
      len = el.getTotalLength()
    } catch {
      len = 0
    }
    if (len <= 0) return

    const decorative = el.getAttribute('stroke-dasharray')
    if (decorative && !el.getAttribute('data-dash-final')) {
      el.setAttribute('data-dash-final', decorative)
    }

    el.style.transition = 'none'
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
  })
}

function clearLineInlineStyles(root: HTMLElement): void {
  lineElements(root).forEach((el) => {
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
}

/** Put chart back to pre-draw state so a later enter can replay. */
function resetDrawIn(root: HTMLElement): void {
  delete root.dataset.chartDrawn
  root.classList.remove('is-chart-drawn')
  armLines(root)
}

/** Measure paths/circles and animate stroke draw-in; bars/areas via CSS class. */
function playDrawIn(root: HTMLElement): void {
  if (root.dataset.chartDrawn === '1') return
  root.dataset.chartDrawn = '1'

  if (prefersReducedMotion()) {
    clearLineInlineStyles(root)
    root.classList.add('is-chart-drawn')
    return
  }

  const lines = lineElements(root)

  lines.forEach((el, i) => {
    let len = 0
    try {
      len = el.getTotalLength()
    } catch {
      len = 0
    }
    if (len <= 0) return

    const decorative =
      el.getAttribute('data-dash-final') ?? el.getAttribute('stroke-dasharray')
    if (decorative) el.setAttribute('data-dash-final', decorative)

    el.style.transition = 'none'
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    // Force layout so the "hidden" dash commits before the transition.
    void el.getBoundingClientRect()
    el.style.transition = `stroke-dashoffset ${LINE_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * STAGGER_MS}ms`
  })

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (root.dataset.chartDrawn !== '1') return
      root.classList.add('is-chart-drawn')
      lines.forEach((el) => {
        el.style.strokeDashoffset = '0'
      })
    })
  })

  const restoreAt = LINE_MS + lines.length * STAGGER_MS + 80
  window.setTimeout(() => {
    if (root.dataset.chartDrawn !== '1') return
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

function revealReady(root: HTMLElement): boolean {
  const host = root.closest('.chapter-reveal') as HTMLElement | null
  if (!host) return true
  return host.classList.contains('is-revealed')
}

/**
 * When a chart figure enters the viewport (and its `.chapter-reveal` host is
 * revealed), draw lines via stroke-dashoffset and grow bars. Leaving the
 * viewport resets so scroll-back replays. prefers-reduced-motion → final state.
 */
export function useChartDrawIn(
  rootRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (prefersReducedMotion()) {
      root.dataset.chartDrawn = '1'
      root.classList.add('is-chart-drawn')
      clearLineInlineStyles(root)
      return
    }

    armLines(root)

    const tryPlay = () => {
      if (!revealReady(root)) return
      playDrawIn(root)
    }

    const onLeave = () => {
      resetDrawIn(root)
    }

    const mo = new MutationObserver(() => {
      // Nav force-reveal can add is-revealed while still off-screen — only
      // play once a real intersection lands (IO callback). If already in view,
      // re-check via a microtask after class change.
      if (revealReady(root) && root.dataset.chartInView === '1') {
        tryPlay()
      }
    })
    const revealHost =
      (root.closest('.chapter-reveal') as HTMLElement | null) ?? root
    mo.observe(revealHost, { attributes: true, attributeFilter: ['class'] })

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        const deepEnough =
          entry.isIntersecting && entry.intersectionRatio >= ENTER_RATIO

        if (deepEnough) {
          root.dataset.chartInView = '1'
          tryPlay()
        } else if (!entry.isIntersecting || entry.intersectionRatio === 0) {
          root.dataset.chartInView = '0'
          onLeave()
        }
      },
      {
        threshold: [0, ENTER_RATIO, 0.35, 0.5, 0.75],
        // Keep a small bottom inset so play starts when the chart is actually
        // readable, not when a single pixel peeks under the nav.
        rootMargin: '0px 0px -10% 0px',
      },
    )
    io.observe(root)

    return () => {
      mo.disconnect()
      io.disconnect()
      delete root.dataset.chartInView
    }
  }, [rootRef])
}
