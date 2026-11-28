import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { useChartDrawIn } from './useChartDrawIn'

function makeLineFigure(className: string, length: number): HTMLElement {
  const root = document.createElement('figure')
  root.className = className
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', `M0 0 L${length} 0`)
  path.setAttribute('data-chart-line', '')
  ;(path as SVGPathElement).getTotalLength = () => length
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.appendChild(path)
  root.appendChild(svg)
  document.body.appendChild(root)
  return root
}

describe('useChartDrawIn', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('marks root drawn immediately under reduced motion', () => {
    const root = makeLineFigure('chapter-reveal', 100)
    const ref = { current: root } as RefObject<HTMLElement | null>

    renderHook(() => useChartDrawIn(ref))

    expect(root.dataset.chartDrawn).toBe('1')
    expect(root.classList.contains('is-chart-drawn')).toBe(true)

    root.remove()
  })

  it('plays draw-in when chapter-reveal already has is-revealed', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const root = makeLineFigure('chapter-reveal is-revealed', 50)
    const ref = { current: root } as RefObject<HTMLElement | null>

    renderHook(() => useChartDrawIn(ref))

    expect(root.dataset.chartDrawn).toBe('1')

    root.remove()
  })
})