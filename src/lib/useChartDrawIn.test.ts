import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { RefObject } from 'react'
import { useChartDrawIn } from './useChartDrawIn'

type IoCallback = (entries: IntersectionObserverEntry[]) => void

let ioCallback: IoCallback | null = null
let observed: Element[] = []

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

function fireIo(target: Element, ratio: number, intersecting = ratio > 0) {
  act(() => {
    ioCallback?.([
      {
        target,
        isIntersecting: intersecting,
        intersectionRatio: ratio,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: 0,
      },
    ])
  })
}

describe('useChartDrawIn', () => {
  beforeEach(() => {
    ioCallback = null
    observed = []

    class MockIO {
      constructor(cb: IoCallback) {
        ioCallback = cb
      }
      observe(el: Element) {
        observed.push(el)
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', MockIO)

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
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    document.body.replaceChildren()
  })

  it('marks root drawn immediately under reduced motion', () => {
    const root = makeLineFigure('chapter-reveal', 100)
    const ref = { current: root } as RefObject<HTMLElement | null>

    renderHook(() => useChartDrawIn(ref))

    expect(root.dataset.chartDrawn).toBe('1')
    expect(root.classList.contains('is-chart-drawn')).toBe(true)
  })

  it('does not play when is-revealed but still off-screen', () => {
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

    expect(root.dataset.chartDrawn).toBeUndefined()
    expect(observed).toContain(root)

    fireIo(root, 0, false)
    expect(root.dataset.chartDrawn).toBeUndefined()
  })

  it('plays draw-in when viewport ratio crosses enter threshold', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const root = makeLineFigure('chapter-reveal is-revealed', 50)
    const ref = { current: root } as RefObject<HTMLElement | null>
    const path = root.querySelector('[data-chart-line]') as SVGPathElement

    renderHook(() => useChartDrawIn(ref))

    // Armed: stroke hidden before play
    expect(path.style.strokeDashoffset).toBe('50')
    expect(root.dataset.chartDrawn).toBeUndefined()

    fireIo(root, 0.05, true)
    expect(root.dataset.chartDrawn).toBeUndefined()

    fireIo(root, 0.25, true)
    expect(root.dataset.chartDrawn).toBe('1')
  })

  it('resets and can replay after leaving the viewport', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const root = makeLineFigure('chapter-reveal is-revealed', 80)
    const ref = { current: root } as RefObject<HTMLElement | null>
    const path = root.querySelector('[data-chart-line]') as SVGPathElement

    renderHook(() => useChartDrawIn(ref))

    fireIo(root, 0.3, true)
    expect(root.dataset.chartDrawn).toBe('1')

    fireIo(root, 0, false)
    expect(root.dataset.chartDrawn).toBeUndefined()
    expect(root.classList.contains('is-chart-drawn')).toBe(false)
    expect(path.style.strokeDashoffset).toBe('80')

    fireIo(root, 0.4, true)
    expect(root.dataset.chartDrawn).toBe('1')
  })

  it('waits for chapter-reveal before playing while in view', async () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const root = makeLineFigure('chapter-reveal', 40)
    const ref = { current: root } as RefObject<HTMLElement | null>

    renderHook(() => useChartDrawIn(ref))

    fireIo(root, 0.4, true)
    expect(root.dataset.chartDrawn).toBeUndefined()

    act(() => {
      root.classList.add('is-revealed')
    })
    await waitFor(() => {
      expect(root.dataset.chartDrawn).toBe('1')
    })
  })
})
