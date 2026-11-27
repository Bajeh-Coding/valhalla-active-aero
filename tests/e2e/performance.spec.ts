import { expect, test } from '@playwright/test'

/**
 * Photo-led stage rAF sanity (no WebGL hero).
 * Reports measured averages — never claim 60 FPS without numbers.
 */
test.describe('Photo stage performance probe', () => {
  test('measures rAF FPS during scroll scrub', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('photo-stage')).toBeVisible({ timeout: 30_000 })
    await page.waitForTimeout(800)

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
        const chapters = [
          'a1-limita',
          'a3-control',
          'a4-rezultat',
          'a5-inchidere',
          'a0-hero',
        ]
        let i = 0
        const scrollIv = window.setInterval(() => {
          const el = document.querySelector(
            `[data-chapter="${chapters[i % chapters.length]}"]`,
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
      const stage = document.querySelector('[data-testid="photo-stage"]')
      const imgs = stage?.querySelectorAll('img[data-active="true"]') ?? []

      return {
        sampleCount: samples.length,
        avgFps: Number(avg.toFixed(1)),
        minFps: Number(min.toFixed(1)),
        hasPhotoStage: Boolean(stage),
        activePhotoCount: imgs.length,
        canvasCount: document.querySelectorAll('canvas').length,
      }
    })

    console.log(`PERF_JSON ${JSON.stringify(result)}`)

    expect(result.hasPhotoStage).toBe(true)
    expect(result.canvasCount).toBe(0)
    expect(result.sampleCount).toBeGreaterThan(0)
    expect(result.avgFps).toBeGreaterThan(2)
  })
})
