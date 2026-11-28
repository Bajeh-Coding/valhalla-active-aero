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

const KEY_BEATS = [
  'title',
  'cl-cd-compromise',
  'ch02-state-machine',
  'dil-nurburgring',
  'lap-grip-algorithms',
  'ch05-firewall',
  'g1-table3-forces',
  'recap',
] as const

async function gotoApp(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('hybrid-talk')).toBeVisible({
    timeout: 30_000,
  })
  await page.waitForTimeout(500)
}

test.describe('Hybrid AM talk E2E', () => {
  test('boots title without console errors', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await expect(page.getByTestId('beat-title')).toBeVisible()
    await expect(page.getByText(/Aston Martin/i).first()).toBeVisible()
    await expect(page.getByText(/Valhalla/i).first()).toBeVisible()
    await expect(page.getByText(/SAE 2020-36-0079/i).first()).toBeVisible()
    await expect(page.locator('img[src*="unsplash"]')).toHaveCount(0)
    await expect(page.locator('img[src*="/images/valhalla/"]')).not.toHaveCount(
      0,
    )

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('scrolls key hybrid beats without console errors', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    for (const id of KEY_BEATS) {
      await page.getByTestId(`beat-${id}`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(220)
      await expect(page.getByTestId(`beat-${id}`)).toBeVisible()
    }

    await page.getByTestId('beat-title').scrollIntoViewIfNeeded()
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('intro shows Table 3 chart', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)
    const beat = page.getByTestId('beat-cl-cd-compromise')
    await beat.scrollIntoViewIfNeeded()
    await expect(beat.getByTestId('chart-table3-forces')).toBeVisible()
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('control demo modes update AOA', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('beat-ch02-state-machine').scrollIntoViewIfNeeded()
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

  test('Valhalla chapter shows industrial firewall', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)
    await page.getByTestId('beat-ch05-firewall').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('industrial-firewall').first()).toBeVisible()
    await expect(page.getByTestId('industrial-firewall').first()).toContainText(
      /NU sunt rezultate SAE 2020-36-0079/i,
    )
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('graphs gallery renders multiple charts', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)
    const g1 = page.getByTestId('beat-g1-table3-forces')
    await g1.scrollIntoViewIfNeeded()
    await expect(g1.getByTestId('chart-table3-forces')).toBeVisible()
    const g4 = page.getByTestId('beat-g4-grip-balance')
    await g4.scrollIntoViewIfNeeded()
    await expect(g4.getByTestId('chart-table5-grip-lap-times')).toBeVisible()
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('recap shows takeaways and references', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('beat-recap').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('takeaways-recap')).toBeVisible()
    await expect(page.getByTestId('references')).toContainText('SAE 2020-36-0079')
    await expect(page.getByTestId('references')).toContainText('Machines 2024')

    expect(errors, errors.join('\n')).toEqual([])
  })
})
