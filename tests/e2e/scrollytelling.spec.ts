import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'

const KNOWN_BENIGN = [/Download the React DevTools/i]

function isBenignConsole(msg: ConsoleMessage): boolean {
  return KNOWN_BENIGN.some((re) => re.test(msg.text()))
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

const BEAT_IDS = [
  'title',
  'problem',
  'takeaways',
  'sota',
  'method-vehicle',
  'method-control',
  'results-grip',
  'results-dil',
  'implications',
  'recap',
] as const

async function gotoApp(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('congress-talk')).toBeVisible({
    timeout: 30_000,
  })
  await page.waitForTimeout(500)
}

test.describe('Congress talk E2E', () => {
  test('boots title beat without console errors', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await expect(page.getByTestId('beat-title')).toBeVisible()
    await expect(page.getByText(/Aston Martin/i).first()).toBeVisible()
    await expect(page.getByText(/Valhalla/i).first()).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
    // No Unsplash leftovers
    await expect(page.locator('img[src*="unsplash"]')).toHaveCount(0)
    await expect(page.locator('img[src*="/images/valhalla/"]')).not.toHaveCount(
      0,
    )

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('scrolls all congress beats without console errors', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    for (const id of BEAT_IDS) {
      await page.getByTestId(`beat-${id}`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(280)
      await expect(page.getByTestId(`beat-${id}`)).toBeVisible()
    }

    await page.getByTestId('beat-title').scrollIntoViewIfNeeded()
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('control demo modes update AOA', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('beat-method-control').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    const demo = page.getByTestId('control-demo')
    await expect(demo).toBeVisible()

    // DRS gates: v ≥ 70, throttle ≥ 70%, |ay| ≤ 1 g
    await page.getByTestId('speed').fill('130')
    await page.getByTestId('throttle').fill('80')
    await page.getByTestId('brake').fill('0')
    await page.getByTestId('mode-DRS').click()
    await expect(page.getByTestId('metric-mode')).toContainText('DRS')
    await expect(page.getByTestId('metric-aoa')).toContainText('0.0°')

    await page.getByTestId('mode-STANDARD').click()
    await expect(page.getByTestId('metric-aoa')).toContainText('6.0°')

    await page.getByTestId('mode-AEROBRAKE').click()
    await page.getByTestId('brake').fill('45')
    await expect(page.getByTestId('metric-mode')).toContainText('AEROBRAKE')
    await expect(page.getByTestId('metric-aoa')).toContainText('19.0°')

    await page.getByTestId('brake').fill('0')
    await page.getByTestId('mode-MAXP').click()
    await expect(page.getByTestId('metric-mode')).toContainText('MAXP')

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('brake ≥ 40% forces AEROBRAKE', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('beat-method-control').scrollIntoViewIfNeeded()
    await page.getByTestId('mode-STANDARD').click()
    await page.getByTestId('speed').fill('150')
    await page.getByTestId('brake').fill('45')
    await expect(page.getByTestId('metric-mode')).toContainText('AEROBRAKE')
    await expect(page.getByTestId('metric-aoa')).toContainText('19.0°')

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('recap shows three takeaways and references', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('beat-recap').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('takeaways-recap')).toBeVisible()
    await expect(page.getByTestId('references')).toContainText('SAE 2020-36-0079')
    await expect(page.getByTestId('references')).toContainText('Machines 2024')

    expect(errors, errors.join('\n')).toEqual([])
  })
})
