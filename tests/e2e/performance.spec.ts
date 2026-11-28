import { expect, test } from '@playwright/test'

/**
 * Mockup rAF sanity during chapter scroll.
 * Reports measured averages — never claim 60 FPS without numbers.
 */
test.describe('Mockup performance probe', () => {
  test('measures rAF FPS during chapter scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('mockup-talk')).toBeVisible({
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
        const chapters = [
          'introducere',
          'control',
          'rezultate',
          'surse',
          'problema',
        ]
        let i = 0
        const scrollIv = window.setInterval(() => {
          const el = document.querySelector(
            `[data-testid="chapter-${chapters[i % chapters.length]}"]`,
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
        hasMockup: Boolean(
          document.querySelector('[data-testid="mockup-talk"]'),
        ),
        chapterCount: document.querySelectorAll('[data-chapter-id]').length,
        valhallaImgCount: document.querySelectorAll(
          'img[src*="/images/am-official/"]',
        ).length,
      }
    })

    console.log(`PERF_JSON ${JSON.stringify(result)}`)

    expect(result.hasMockup).toBe(true)
    expect(result.chapterCount).toBe(10)
    expect(result.valhallaImgCount).toBeGreaterThan(0)
    expect(result.sampleCount).toBeGreaterThan(0)
    expect(result.avgFps).toBeGreaterThan(2)
  })
})
