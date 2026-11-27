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

const CHAPTER_IDS = [
  'title',
  'takeaways',
  'intro-active',
  'intro-forces',
  'intro-cop',
  'mecha-actuators',
  'mecha-control',
  'sim-cosim',
  'sim-dil',
  'results-grip',
  'results-stability',
  'results-synthesis',
  'valhalla-aero',
  'graphs',
  'recap',
] as const

async function gotoApp(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('hybrid-talk')).toBeVisible({
    timeout: 30_000,
  })
  await page.waitForTimeout(500)
}

test.describe('Hybrid AM science E2E', () => {
  test('boots title chapter without console errors', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await expect(page.getByTestId('chapter-title')).toBeVisible()
    await expect(page.getByText(/Aston Martin/i).first()).toBeVisible()
    await expect(page.getByText(/Valhalla/i).first()).toBeVisible()
    // Paper id must stay SAE 2020-36-0079 (never 2020-01-0079)
    await expect(page.getByTestId('chapter-title')).toContainText(
      'SAE 2020-36-0079',
    )
    await expect(page.getByTestId('chapter-title')).not.toContainText(
      '2020-01-0079',
    )
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.locator('img[src*="unsplash"]')).toHaveCount(0)
    await expect(page.locator('img[src*="/images/valhalla/"]')).not.toHaveCount(
      0,
    )
    await expect(page.getByTestId('still-scrub')).toBeVisible()

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('scrolls all hybrid chapters without console errors', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    for (const id of CHAPTER_IDS) {
      await page.getByTestId(`chapter-${id}`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(220)
      await expect(page.getByTestId(`chapter-${id}`)).toBeVisible()
    }

    await page.getByTestId('chapter-title').scrollIntoViewIfNeeded()
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('control demo modes update AOA', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('chapter-mecha-control').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    const demo = page.getByTestId('control-demo')
    await expect(demo).toBeVisible()

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

    await page.getByTestId('chapter-mecha-control').scrollIntoViewIfNeeded()
    await page.getByTestId('mode-STANDARD').click()
    await page.getByTestId('speed').fill('150')
    await page.getByTestId('brake').fill('45')
    await expect(page.getByTestId('metric-mode')).toContainText('AEROBRAKE')
    await expect(page.getByTestId('metric-aoa')).toContainText('19.0°')

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('Valhalla industrial chapter is labeled separate from SAE', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('chapter-valhalla-aero').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('industrial-banner')).toBeVisible()
    await expect(page.getByTestId('industrial-banner')).toContainText(
      /industrială|publică|SAE/i,
    )
    await expect(page.getByTestId('industrial-facts')).toContainText('600 kg')
    await expect(page.getByTestId('industrial-facts')).toContainText('255 mm')

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('graphs chapter exposes paper-sourced panels', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('chapter-graphs').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('graphs-chapter')).toBeVisible()
    await page.getByTestId('graph-forces').click()
    await expect(page.getByTestId('graph-panel-forces')).toBeVisible()
    await page.getByTestId('graph-maxp').click()
    await expect(page.getByTestId('graph-panel-maxp')).toBeVisible()

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('recap shows three takeaways and references', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('chapter-recap').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('takeaways-recap')).toBeVisible()
    await expect(page.getByTestId('references')).toContainText('SAE 2020-36-0079')
    await expect(page.getByTestId('references')).toContainText('Machines 2024')
    await expect(page.getByTestId('references')).toContainText('Aston Martin')

    expect(errors, errors.join('\n')).toEqual([])
  })
})
