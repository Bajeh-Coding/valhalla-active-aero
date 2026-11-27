import { expect, test } from '@playwright/test'

/**
 * Hybrid AM rAF sanity (photo still-scrub, no WebGL).
 * Reports measured averages — never claim 60 FPS without numbers.
 */
test.describe('Hybrid AM performance probe', () => {
  test('measures rAF FPS during chapter scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('hybrid-talk')).toBeVisible({
      timeout: 30_000,
    })
    await page.waitForTimeout(600)

    const result = await page.evaluate(async () => {
      const samples: number[] = []
      let frames = 0
      let last = performance.now()
      let windowStart = last

      await new Promise<void>((resolve) => {
        const tick = (now: number) => {
          frames += 1
          if (now - windowStart >= 500) {
            samples.push((frames * 1000) / (now - windowStart))
            frames = 0
            windowStart = now
          }
          if (now - last < 4000) {
            requestAnimationFrame(tick)
          } else {
            resolve()
          }
        }
        const beats = [
          'intro-cop',
          'mecha-control',
          'results-grip',
          'valhalla-aero',
          'graphs',
          'recap',
          'title',
        ]
        let i = 0
        const scrollIv = window.setInterval(() => {
          const el = document.querySelector(
            `[data-testid="chapter-${beats[i % beats.length]}"]`,
          )
          el?.scrollIntoView({ behavior: 'instant', block: 'start' })
          i += 1
        }, 700)
        requestAnimationFrame(tick)
        window.setTimeout(() => clearInterval(scrollIv), 3800)
      })

      const avg =
        samples.length === 0
          ? 0
          : samples.reduce((a, b) => a + b, 0) / samples.length
      const min = samples.length ? Math.min(...samples) : 0

      return {
        sampleCount: samples.length,
        avgFps: Number(avg.toFixed(1)),
        minFps: Number(min.toFixed(1)),
        hasHybrid: Boolean(
          document.querySelector('[data-testid="hybrid-talk"]'),
        ),
        valhallaImgCount: document.querySelectorAll(
          'img[src*="/images/valhalla/"]',
        ).length,
        canvasCount: document.querySelectorAll('canvas').length,
        unsplashCount: document.querySelectorAll('img[src*="unsplash"]').length,
      }
    })

    console.log(`PERF_JSON ${JSON.stringify(result)}`)

    expect(result.hasHybrid).toBe(true)
    expect(result.canvasCount).toBe(0)
    expect(result.unsplashCount).toBe(0)
    expect(result.valhallaImgCount).toBeGreaterThan(0)
    expect(result.sampleCount).toBeGreaterThan(0)
    expect(result.avgFps).toBeGreaterThan(2)
  })
})
