import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'

/** Three.js / WebGL deprecations that are noise, not app bugs. */
const KNOWN_BENIGN = [
  /THREE\.Clock: This module has been deprecated/i,
  /THREE\.WebGLShadowMap: PCFSoftShadowMap has been removed/i,
  /Download the React DevTools/i,
]

function isBenignConsole(msg: ConsoleMessage): boolean {
  const text = msg.text()
  return KNOWN_BENIGN.some((re) => re.test(text))
}

async function attachErrorTrap(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`)
  })
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isBenignConsole(msg)) {
      errors.push(`console.error: ${msg.text()}`)
    }
  })
  return errors
}

async function gotoApp(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 30_000 })
  // Allow R3F + GSAP + demo store hydrate
  await page.waitForTimeout(800)
}

test.describe('Valhalla scrollytelling E2E', () => {
  test('boots HUD + hero without console/page errors', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await expect(page.getByText('ASTON MARTIN')).toBeVisible()
    await expect(page.getByText('VALHALLA')).toBeVisible()
    await expect(page.getByLabel('Telemetry HUD')).toBeVisible()
    await expect(page.getByText('System online', { exact: false }).first()).toBeVisible()

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('ScrollTrigger timeline: scroll chapters without console errors', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    const chapters = ['hero', 'physics', 'control', 'dynamics', 'pi-rom'] as const
    for (const id of chapters) {
      await page.locator(`[data-chapter="${id}"]`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(400)
      await expect(page.locator(`[data-chapter="${id}"]`)).toBeVisible()
    }

    // Back to hero — scrub reverse
    await page.locator('[data-chapter="hero"]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('mode buttons update AOA in HUD', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.locator('[data-chapter="control"]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await page.getByTestId('mode-DRS').click()
    await expect(page.getByLabel('Telemetry HUD')).toContainText(/0\.0°/)
    await expect(page.getByLabel('Telemetry HUD')).toContainText('DRS')

    await page.getByTestId('mode-PASSIVE').click()
    await expect(page.getByLabel('Telemetry HUD')).toContainText(/10\.0°/)
    await expect(page.getByLabel('Telemetry HUD')).toContainText('PASSIVE')

    await page.getByTestId('mode-AEROBRAKE').click()
    await expect(page.getByLabel('Telemetry HUD')).toContainText(/25\.0°/)
    await expect(page.getByLabel('Telemetry HUD')).toContainText('AEROBRAKE')

    await page.getByTestId('mode-MAXP').click()
    // Prior AEROBRAKE AOA=25 clamps into MAXP range [5, 18] → 18°
    await expect(page.getByLabel('Telemetry HUD')).toContainText('MAXP')
    await expect(page.getByLabel('Telemetry HUD')).toContainText(/18\.0°/)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('brake > 40% forces AEROBRAKE regardless of mode', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.locator('[data-chapter="control"]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    await page.getByTestId('mode-PASSIVE').click()
    await page.getByTestId('brake-slider').fill('45')
    await expect(page.getByLabel('Telemetry HUD')).toContainText('AEROBRAKE')
    await expect(page.getByLabel('Telemetry HUD')).toContainText(/25\.0°/)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('HUD / controls smoke: speed slider updates HUD', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.locator('[data-chapter="control"]').scrollIntoViewIfNeeded()
    await page.getByTestId('speed-slider').fill('220')
    await expect(page.getByLabel('Telemetry HUD')).toContainText('220')
    await page.getByTestId('throttle-slider').fill('80')
    await expect(page.getByLabel('Telemetry HUD')).toContainText(/80%/)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('basic CLS / layout stability during scroll (no huge shifts)', async ({
    page,
  }) => {
    await gotoApp(page)

    await page.evaluate(() => {
      ;(window as unknown as { __cls: number }).__cls = 0
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const ls = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
          if (ls.hadRecentInput) continue
          ;(window as unknown as { __cls: number }).__cls += ls.value ?? 0
        }
      })
      po.observe({ type: 'layout-shift', buffered: true })
      ;(window as unknown as { __clsPo: PerformanceObserver }).__clsPo = po
    })

    for (const id of ['physics', 'control', 'dynamics', 'pi-rom', 'hero']) {
      await page.locator(`[data-chapter="${id}"]`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(350)
    }

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls)
    // Fixed canvas + absolute HUD should keep cumulative CLS modest.
    expect(cls).toBeLessThan(0.25)
  })
})
