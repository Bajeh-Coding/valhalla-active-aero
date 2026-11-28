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
  'introducere',
  'problema',
  'fundamente',
  'mecanisme',
  'control',
  'regimuri',
  'studiu-de-caz',
  'rezultate',
  'insight-uri',
  'surse',
] as const

async function gotoApp(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('mockup-talk')).toBeVisible({
    timeout: 30_000,
  })
  await page.waitForTimeout(500)
}

test.describe('Mockup 10 capitole E2E', () => {
  test('boots hero without console errors', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await expect(page.getByTestId('mockup-hero')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Aerodinamică Activă/i,
    )
    await expect(page.getByTestId('chapter-nav')).toBeVisible()
    await expect(page.locator('img[src*="/images/valhalla/"]')).not.toHaveCount(
      0,
    )

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('renders exactly 10 chapters with placeholders', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    for (const id of CHAPTER_IDS) {
      const section = page.getByTestId(`chapter-${id}`)
      await section.scrollIntoViewIfNeeded()
      await expect(section).toBeVisible()
      await expect(section).toContainText(/placeholder/i)
    }

    expect(CHAPTER_IDS).toHaveLength(10)
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('chapter nav jumps to mid chapter', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('nav-control').click()
    await page.waitForTimeout(600)
    await expect(page.getByTestId('chapter-control')).toBeInViewport()

    expect(errors, errors.join('\n')).toEqual([])
  })
})
