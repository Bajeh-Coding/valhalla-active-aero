import { expect, test } from '@playwright/test'

/**
 * Desktop WebGL FPS / draw-ish sanity.
 * Reports measured averages — never claim 60 FPS without numbers.
 */
test.describe('WebGL performance probe', () => {
  test('measures rAF FPS during scroll scrub', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 30_000 })
    await page.waitForTimeout(1000)

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
        // Kick scroll during sampling
        const chapters = ['physics', 'control', 'dynamics', 'pi-rom', 'hero']
        let i = 0
        const scrollIv = window.setInterval(() => {
          const el = document.querySelector(`[data-chapter="${chapters[i % chapters.length]}"]`)
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

      // Draw-call proxy: count WebGL contexts + canvas pixels
      const canvas = document.querySelector('canvas')
      const gl =
        canvas &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
      return {
        sampleCount: samples.length,
        avgFps: Number(avg.toFixed(1)),
        minFps: Number(min.toFixed(1)),
        canvasWidth: canvas?.width ?? 0,
        canvasHeight: canvas?.height ?? 0,
        hasWebGl: Boolean(gl),
        // Context lost?
        contextLost: canvas
          ? (canvas as HTMLCanvasElement & { isContextLost?: () => boolean }).isContextLost?.() ===
            true
          : true,
      }
    })

    // Persist for qa-report consumption
    console.log(`PERF_JSON ${JSON.stringify(result)}`)

    expect(result.hasWebGl).toBe(true)
    expect(result.contextLost).toBe(false)
    expect(result.sampleCount).toBeGreaterThan(0)
    // Soft floor: headless Chromium/ANGLE often reports single-digit FPS.
    // Do NOT treat this as desktop 60 FPS proof — see qa-report.md for measured values.
    expect(result.avgFps).toBeGreaterThan(2)
  })
})
