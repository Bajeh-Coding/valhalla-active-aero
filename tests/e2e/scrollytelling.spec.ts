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
    await expect(
      page.locator('img[src*="/images/am-official/"]'),
    ).not.toHaveCount(0)
    const h1Font = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(h1Font).toMatch(/AstonMartinFlare/)

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('renders Cap 01 and Cap 08 content; other chapters stay placeholders', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    const intro = page.getByTestId('chapter-introducere')
    await intro.scrollIntoViewIfNeeded()
    await expect(intro).toBeVisible()
    await expect(intro).toContainText(
      /Aston Martin Valhalla — Active Aerodynamics & Mechatronic Control/i,
    )
    await expect(intro).toContainText(/Aston Martin Vantage/i)
    await expect(page.getByTestId('chapter-introducere-notes')).toContainText(
      /SAE Technical Paper 2020-36-0079/i,
    )
    await expect(page.getByTestId('chapter-introducere-notes')).toContainText(
      /Aston Martin Vantage 2019/i,
    )

    const rezultate = page.getByTestId('chapter-rezultate')
    await rezultate.scrollIntoViewIfNeeded()
    await expect(rezultate).toBeVisible()
    await expect(rezultate).toContainText(
      /Grafice relevante — de ce Active Aero/i,
    )
    await expect(rezultate).toContainText(/Cum funcționează/i)
    await expect(rezultate).toContainText(/De ce este necesar/i)
    await expect(rezultate).toContainText(/−2\.55/i)
    await expect(page.getByTestId('chapter-rezultate-charts')).toBeVisible()
    await expect(page.getByTestId('chart-ch08-table6-dil')).toBeVisible()
    await expect(page.getByTestId('chart-ch08-maxp-aoa')).toBeVisible()
    await expect(page.getByTestId('chart-ch08-pi-rom-xfoil')).toBeVisible()
    await expect(page.getByTestId('chart-ch08-kamm-fl')).toBeVisible()
    await expect(page.getByTestId('chapter-rezultate-notes')).toContainText(
      /Table 6/i,
    )
    await expect(
      rezultate.locator('img[src*="/images/am-official/am-ch08-rezultate"]'),
    ).toBeVisible()

    const authored = new Set(['introducere', 'rezultate'])
    for (const id of CHAPTER_IDS) {
      if (authored.has(id)) continue
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
