import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'

/** Benign console noise — not app bugs. */
const KNOWN_BENIGN = [
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
  await expect(page.getByTestId('photo-stage')).toBeVisible({ timeout: 30_000 })
  await page.waitForTimeout(600)
}

const ACTS = [
  'a0-hero',
  'a1-limita',
  'a2-actuatoare',
  'a3-control',
  'a4-rezultat',
  'a5-inchidere',
] as const

test.describe('Valhalla scrollytelling E2E', () => {
  test('boots photo-led hero without console/page errors', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    // exact: A5 also mentions "Aston Martin Valhalla" in brand footnote
    await expect(page.getByText('ASTON MARTIN', { exact: true })).toBeVisible()
    await expect(page.getByText('VALHALLA', { exact: true })).toBeVisible()
    await expect(page.getByTestId('photo-stage')).toBeVisible()
    // No Spline / WebGL hero canvas
    await expect(page.locator('canvas')).toHaveCount(0)
    // No persistent telemetry HUD on hero
    await expect(page.getByLabel('Telemetry HUD')).toHaveCount(0)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('ScrollTrigger timeline: scroll A0–A5 without console errors', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    for (const id of ACTS) {
      await page.locator(`[data-chapter="${id}"]`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(350)
      await expect(page.locator(`[data-chapter="${id}"]`)).toBeVisible()
    }

    await page.locator('[data-chapter="a0-hero"]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('mode buttons update AOA in A3 panel', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.locator('[data-chapter="a3-control"]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    const panel = page.getByTestId('a3-control-panel')
    await expect(panel).toBeVisible()

    await page.getByTestId('mode-DRS').click()
    await expect(panel).toContainText(/0\.0°/)
    await expect(panel).toContainText('DRS')

    await page.getByTestId('mode-STANDARD').click()
    await expect(panel).toContainText(/6\.0°/)
    await expect(panel).toContainText('STANDARD')

    await page.getByTestId('mode-AEROBRAKE').click()
    await expect(panel).toContainText(/19\.0°/)
    await expect(panel).toContainText('AEROBRAKE')

    await page.getByTestId('mode-MAXP').click()
    await expect(panel).toContainText('MAXP')

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('brake ≥ 40% forces AEROBRAKE regardless of mode', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.locator('[data-chapter="a3-control"]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    const panel = page.getByTestId('a3-control-panel')
    await page.getByTestId('mode-STANDARD').click()
    await page.getByTestId('speed-slider').fill('150')
    await page.getByTestId('brake-slider').fill('45')
    await expect(panel).toContainText('AEROBRAKE')
    await expect(panel).toContainText(/19\.0°/)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('A3 controls smoke: speed / throttle sliders', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.locator('[data-chapter="a3-control"]').scrollIntoViewIfNeeded()
    const panel = page.getByTestId('a3-control-panel')
    await page.getByTestId('speed-slider').fill('220')
    await expect(panel).toContainText('220')
    await page.getByTestId('throttle-slider').fill('80')
    // Slider readout is "{value} {unit}" → "80 %"
    await expect(panel).toContainText(/80\s*%/)

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
          const ls = entry as PerformanceEntry & {
            value?: number
            hadRecentInput?: boolean
          }
          if (ls.hadRecentInput) continue
          ;(window as unknown as { __cls: number }).__cls += ls.value ?? 0
        }
      })
      po.observe({ type: 'layout-shift', buffered: true })
      ;(window as unknown as { __clsPo: PerformanceObserver }).__clsPo = po
    })

    for (const id of [
      'a1-limita',
      'a3-control',
      'a4-rezultat',
      'a5-inchidere',
      'a0-hero',
    ]) {
      await page.locator(`[data-chapter="${id}"]`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(350)
    }

    const cls = await page.evaluate(
      () => (window as unknown as { __cls: number }).__cls,
    )
    expect(cls).toBeLessThan(0.25)
  })
})
