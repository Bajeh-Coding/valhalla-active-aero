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

  test('renders Cap 01–07 content and remaining placeholders', async ({
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
    await expect(intro).not.toContainText(/14 DOF/i)

    const modelare = page.getByTestId('chapter-problema')
    await modelare.scrollIntoViewIfNeeded()
    await expect(modelare).toBeVisible()
    await expect(modelare).toContainText(
      /Modelarea Dinamică Multicorp \(14 DOF\)/i,
    )
    await expect(modelare).toContainText(/VI-CarRealTime/i)
    await expect(page.getByTestId('chapter-problema-dof')).toContainText(
      /6 DOF/i,
    )
    await expect(page.getByTestId('chapter-problema-dof')).toContainText(
      /4 DOF/i,
    )
    await expect(page.getByTestId('chapter-problema-specs')).toContainText(
      /2050 kg/i,
    )
    await expect(page.getByTestId('chapter-problema-specs')).toContainText(
      /1257 kW/i,
    )
    await expect(page.getByTestId('chapter-problema-specs')).toContainText(
      /2691 mm/i,
    )
    await expect(page.getByTestId('chapter-problema-specs')).toContainText(
      /2\.1 m²/i,
    )
    await expect(page.getByTestId('chapter-problema-notes')).toContainText(
      /p\.2 — Vehicle Model/i,
    )
    await expect(page.getByTestId('chapter-problema-notes')).toContainText(
      /p\.3 — Table 1/i,
    )
    await expect(page.getByTestId('nav-problema')).toContainText(/Modelare/i)

    const fundamente = page.getByTestId('chapter-fundamente')
    await fundamente.scrollIntoViewIfNeeded()
    await expect(fundamente).toBeVisible()
    await expect(fundamente).toContainText(
      /Sistemul de Control prin Stări \(DRS, Aerobrake, MaxP\)/i,
    )
    await expect(fundamente).toContainText(/State Machine/i)
    await expect(page.getByTestId('chapter-fundamente-modes')).toContainText(
      /AOA = 0°/,
    )
    await expect(page.getByTestId('chapter-fundamente-modes')).toContainText(
      /AOA = 4\.5°/,
    )
    await expect(page.getByTestId('chapter-fundamente-notes')).toContainText(
      /pp\.4–6/i,
    )

    const mec = page.getByTestId('chapter-mecanisme')
    await mec.scrollIntoViewIfNeeded()
    await expect(mec).toBeVisible()
    await expect(mec).toContainText(
      /Optimizarea Traiectoriei & Performanța pe Tur/i,
    )
    await expect(mec).toContainText(/−2\.55s Nürburgring GP/)
    await expect(mec).toContainText(/VI-Grade DIL/)
    await expect(page.getByTestId('chapter-mecanisme-notes')).toContainText(
      /SAE 2020-36-0079 Table 6/i,
    )
    await expect(page.getByTestId('chapter-mecanisme-notes')).toContainText(
      /131\.61s/,
    )
    await expect(page.getByTestId('chapter-mecanisme-notes')).toContainText(
      /129\.06s/,
    )
    await expect(page.getByTestId('chapter-mecanisme-notes')).toContainText(
      /Trajectory Optimization — Pieter de Buck \(URL\)/,
    )
    await expect(page.getByTestId('chapter-mecanisme-notes')).toContainText(
      /OpenMDAO, Dymos, IPOPT/,
    )

    const control = page.getByTestId('chapter-control')
    await control.scrollIntoViewIfNeeded()
    await expect(control).toBeVisible()
    await expect(control).toContainText(
      /Modelul de Predicție AI în Timp Real \(PI-ROM\)/i,
    )
    await expect(control).toContainText(/sub 1 ms/i)
    await expect(page.getByTestId('chapter-control-notes')).toContainText(
      /subramanian_activeaeroROM_preprint\.pdf/i,
    )
    await expect(page.getByTestId('chapter-control-notes')).toContainText(
      /0\.0906 ms/i,
    )
    await expect(page.getByTestId('chapter-control-notes')).toContainText(
      /26\.58/i,
    )
    await expect(
      control.locator('img[src*="/images/am-official/am-ch05-control"]'),
    ).toBeVisible()

    const cap06 = page.getByTestId('chapter-regimuri')
    await cap06.scrollIntoViewIfNeeded()
    await expect(cap06).toBeVisible()
    await expect(cap06).toContainText(
      /Cadrul Teoretic General \(Frecare & Saturație Anvelope\)/i,
    )
    await expect(cap06).toContainText(/cercului de frecare Kamm/i)
    await expect(cap06).toContainText(/Fy,max = μ FZ/)
    await expect(page.getByTestId('chapter-regimuri-notes')).toContainText(
      /Wei Gao et al\., 2021/i,
    )
    await expect(page.getByTestId('chapter-regimuri-notes')).toContainText(
      /1fbd01b59b71746ed236baedf6ea44c4\.pdf/,
    )
    await expect(page.getByTestId('chapter-regimuri-notes')).toContainText(
      /aerodynamic downforce \(FL\)/i,
    )

    const caseStudy = page.getByTestId('chapter-studiu-de-caz')
    await caseStudy.scrollIntoViewIfNeeded()
    await expect(caseStudy).toBeVisible()
    await expect(caseStudy).toContainText(
      /Active Aero — Aston Martin Valhalla/i,
    )
    await expect(caseStudy).not.toContainText(/placeholder/i)
    await expect(
      page.getByTestId('chapter-studiu-de-caz-surfaces'),
    ).toBeVisible()
    await expect(page.getByTestId('surface-front-wing')).toContainText(
      /Active front wing/i,
    )
    await expect(page.getByTestId('surface-rear-wing')).toContainText(
      /T-wing/i,
    )
    await expect(page.getByTestId('surface-front-splitter')).toContainText(
      /front splitter/i,
    )
    await expect(page.getByTestId('surface-air-dam')).toContainText(
      /air-dam/i,
    )
    await expect(page.getByTestId('surface-underbody')).toContainText(
      /venturi/i,
    )
    await expect(page.getByTestId('surface-rear-diffuser')).toContainText(
      /diffuser/i,
    )
    await expect(page.getByTestId('surface-door-ducts')).toContainText(
      /Dihedral door/i,
    )
    await expect(page.getByTestId('chapter-studiu-de-caz-notes')).toContainText(
      /Aston Martin official/i,
    )

    const authored = new Set([
      'introducere',
      'problema',
      'fundamente',
      'mecanisme',
      'control',
      'regimuri',
      'studiu-de-caz',
    ])
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
