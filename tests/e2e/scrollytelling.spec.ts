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
  'cadru',
  'kamm',
  'modelare-14dof',
  'pachet-aero',
  'state-machine',
  'nurburgring',
  'valhalla-serie',
  'pi-rom',
  'simulator',
  'discutii',
  'concluzii',
] as const

async function dismissBootSplash(page: Page) {
  const start = page.getByTestId('boot-splash-start')
  await expect(start).toBeVisible({ timeout: 15_000 })
  await start.click()
}

async function gotoApp(page: Page) {
  // Splash still requires Start; reduced motion skips the logo hold.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  await dismissBootSplash(page)
  await expect(page.getByTestId('mockup-talk')).toBeVisible({
    timeout: 30_000,
  })
  await page.waitForTimeout(500)
}

test.describe('Boot splash', () => {
  test('Start → logo → presentation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('boot-splash')).toBeVisible()
    await expect(page.getByTestId('boot-splash-start')).toBeVisible()
    await expect(page.getByTestId('app-shell')).toHaveCSS('opacity', '0')

    await page.getByTestId('boot-splash-start').click()
    await expect(page.getByTestId('boot-splash-logo')).toBeVisible({
      timeout: 5_000,
    })
    await expect(page.getByTestId('app-shell')).toHaveCSS('opacity', '1', {
      timeout: 8_000,
    })
    await expect(page.getByTestId('boot-splash')).toHaveCount(0, {
      timeout: 3_000,
    })
    await expect(page.getByTestId('mockup-hero')).toBeVisible()
  })
})

test.describe('Mockup 11 capitole E2E (ghid)', () => {
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

  test('renders all 11 guide chapters with required visuals', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    const cadru = page.getByTestId('chapter-cadru')
    await cadru.scrollIntoViewIfNeeded()
    await expect(cadru).toBeVisible()
    await expect(cadru).toContainText(
      /Sisteme Integrate de Aerodinamică Activă/i,
    )
    await expect(cadru).toContainText(
      /Optimizing Hypercar Performance via Active Aerodynamics/i,
    )
    await expect(page.getByTestId('chapter-cadru-subtitle')).toContainText(
      /De la simulări multicorp \(14 DOF\).*PI-ROM.*1,079 PS/i,
    )
    await expect(page.getByTestId('chapter-cadru-bullets')).toContainText(
      /PI-ROM/i,
    )

    const kamm = page.getByTestId('chapter-kamm')
    await kamm.scrollIntoViewIfNeeded()
    await expect(kamm).toBeVisible()
    await expect(kamm).toContainText(/Fy,max = μ \* Fz/)
    await expect(page.getByTestId('chapter-kamm-equations')).toContainText(
      /FD = 0\.5/,
    )
    await expect(page.getByTestId('diagram-kamm')).toBeVisible()

    const dof = page.getByTestId('chapter-modelare-14dof')
    await dof.scrollIntoViewIfNeeded()
    await expect(dof).toBeVisible()
    await expect(page.getByTestId('chapter-modelare-14dof-dof')).toContainText(
      /6 DOF/i,
    )
    await expect(page.getByTestId('chapter-modelare-14dof-specs')).toContainText(
      /2050 kg/i,
    )
    await expect(page.getByTestId('chapter-modelare-14dof-specs')).toContainText(
      /1257 kW/i,
    )
    await expect(page.getByTestId('chapter-modelare-14dof-specs')).toContainText(
      /2691 mm/i,
    )
    await expect(page.getByTestId('chapter-modelare-14dof-specs')).toContainText(
      /43% Față/i,
    )
    await expect(page.getByTestId('diagram-dof14')).toBeVisible()

    const pachet = page.getByTestId('chapter-pachet-aero')
    await pachet.scrollIntoViewIfNeeded()
    await expect(pachet).toBeVisible()
    await expect(pachet).toContainText(/788 N/)
    await expect(page.getByTestId('chapter-pachet-aero-figure')).toContainText(
      /Figura 4\.1/i,
    )
    await expect(
      page.getByTestId('chapter-pachet-aero-figure').locator('svg'),
    ).toBeVisible()
    await expect(page.getByTestId('chapter-pachet-aero-figure')).toHaveAttribute(
      'data-chart-id',
      'fig-4-1-fl-fd-aoa',
    )

    const states = page.getByTestId('chapter-state-machine')
    await states.scrollIntoViewIfNeeded()
    await expect(states).toBeVisible()
    await expect(page.getByTestId('chapter-state-machine-modes')).toContainText(
      /AOA = 0°/,
    )
    await expect(page.getByTestId('chapter-state-machine-modes')).toContainText(
      /10\.650s/,
    )
    await expect(page.getByTestId('diagram-state-machine')).toBeVisible()

    const dil = page.getByTestId('chapter-nurburgring')
    await dil.scrollIntoViewIfNeeded()
    await expect(dil).toBeVisible()
    await expect(dil).toContainText(/-2\.55/)
    await expect(page.getByTestId('chapter-nurburgring-figure')).toContainText(
      /Figura 6\.1/i,
    )
    await expect(
      page.getByTestId('chapter-nurburgring-figure').locator('svg'),
    ).toBeVisible()
    await expect(page.getByTestId('chapter-nurburgring-figure')).toContainText(
      /129\.06/,
    )

    const valhalla = page.getByTestId('chapter-valhalla-serie')
    await valhalla.scrollIntoViewIfNeeded()
    await expect(valhalla).toBeVisible()
    await expect(valhalla).toContainText(/1,079 PS|1079 PS/)
    await expect(
      page.getByTestId('chapter-valhalla-serie-figure'),
    ).toContainText(/Figura 7\.1/i)
    await expect(
      page.getByTestId('chapter-valhalla-serie-figure').locator('svg'),
    ).toBeVisible()
    await expect(
      page.getByTestId('chapter-valhalla-serie-figure'),
    ).toContainText(/600 kg @ 240/)

    const pirom = page.getByTestId('chapter-pi-rom')
    await pirom.scrollIntoViewIfNeeded()
    await expect(pirom).toBeVisible()
    await expect(pirom).toContainText(/0\.0906 ms/)
    await expect(page.getByTestId('chapter-pi-rom-figure')).toContainText(
      /Figura 8\.1/i,
    )
    await expect(
      page.getByTestId('chapter-pi-rom-figure').locator('svg'),
    ).toBeVisible()
    await expect(page.getByTestId('chapter-pi-rom-figure')).toContainText(
      /0\.0906/,
    )
    await expect(page.getByTestId('chapter-pi-rom-figure')).toContainText(
      /2\.4081/,
    )

    const sim = page.getByTestId('chapter-simulator')
    await sim.scrollIntoViewIfNeeded()
    await expect(sim).toBeVisible()
    await expect(page.getByTestId('active-aero-simulator')).toBeVisible()

    const disc = page.getByTestId('chapter-discutii')
    await disc.scrollIntoViewIfNeeded()
    await expect(disc).toBeVisible()
    await expect(disc).toContainText(/Concurrent Engineering/i)
    await expect(page.getByTestId('diagram-synergy')).toBeVisible()

    const concl = page.getByTestId('chapter-concluzii')
    await concl.scrollIntoViewIfNeeded()
    await expect(concl).toBeVisible()
    await expect(page.getByTestId('chapter-concluzii-kpi')).toContainText(
      /−2\.55|−2.55|-2\.55/,
    )
    await expect(page.getByTestId('chapter-concluzii-references')).toContainText(
      /SAE 2020-36-0079/i,
    )
    await expect(page.getByTestId('chapter-concluzii-references')).toContainText(
      /Subramanian/i,
    )

    for (const id of CHAPTER_IDS) {
      const section = page.getByTestId(`chapter-${id}`)
      await section.scrollIntoViewIfNeeded()
      await expect(section).toBeVisible()
      await expect(section).not.toContainText(/placeholder/i)
    }

    expect(CHAPTER_IDS).toHaveLength(11)
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('Cap 09 Active Aero simulator responds to mode and speed', async ({
    page,
  }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('nav-simulator').click()
    await page.waitForTimeout(700)
    const chapter = page.getByTestId('chapter-simulator')
    await expect(chapter).toBeVisible()
    await expect(chapter).toContainText(/Simulator Active Aero/i)
    await expect(page.getByTestId('nav-simulator')).toContainText(/Simulator/i)

    const sim = page.getByTestId('active-aero-simulator')
    await expect(sim).toBeVisible()
    await expect(page.getByTestId('sim-visual')).toBeVisible()
    await expect(page.getByTestId('sim-chart')).toBeVisible()

    await page.getByTestId('sim-mode-DRS').click()
    await expect(page.getByTestId('sim-metric-mode')).toHaveText(/DRS|STANDARD/)
    await expect(page.getByTestId('sim-throttle')).toBeVisible()

    await page.getByTestId('sim-mode-AEROBRAKE').click()
    await expect(page.getByTestId('sim-metric-mode')).toHaveText(/AEROBRAKE/)
    await expect(page.getByTestId('sim-brake')).toBeVisible()
    await expect(page.getByTestId('sim-metric-aoa')).toContainText(/19/)

    await page.getByTestId('sim-mode-MAXP').click()
    await page.getByTestId('sim-speed').fill('160')
    await expect(page.getByTestId('sim-table3-anchor')).toBeVisible()
    await expect(page.getByTestId('sim-table3-anchor')).toContainText(/788/)

    await expect(page.getByTestId('sim-surface-rear-wing')).toBeVisible()
    await expect(page.getByTestId('sim-surface-front-wing')).toBeVisible()
    await expect(page.getByTestId('sim-surface-splitter')).toBeVisible()
    await expect(page.getByTestId('sim-surface-airdam')).toBeVisible()
    await expect(page.getByTestId('sim-surface-diffuser')).toBeVisible()
    await expect(page.getByTestId('sim-wheel-rear')).toBeVisible()
    await expect(page.getByTestId('sim-surface-legend')).toContainText(/T-wing/i)
    await expect(page.getByTestId('sim-visual')).toContainText(/Valhalla 3D/i)

    await page.getByTestId('sim-mode-DRS').click()
    await expect(page.getByTestId('sim-visual')).toHaveAttribute(
      'data-splitter',
      'OPEN',
    )

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('chapter nav jumps to mid chapter', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('nav-state-machine').click()
    await page.waitForTimeout(600)
    await expect(page.getByTestId('chapter-state-machine')).toBeInViewport()

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('guide figures and Cap 05 modes visible after nav', async ({ page }) => {
    const errors = await attachErrorTrap(page)
    await gotoApp(page)

    await page.getByTestId('nav-pachet-aero').click()
    await page.waitForTimeout(700)
    await page.getByTestId('chapter-pachet-aero-figure').scrollIntoViewIfNeeded()
    await expect(page.getByTestId('chapter-pachet-aero-figure')).toBeVisible()

    await page.getByTestId('nav-state-machine').click()
    await page.waitForTimeout(700)
    await expect(page.getByTestId('chapter-state-machine-modes')).toBeVisible()
    await expect(page.getByTestId('diagram-state-machine')).toBeVisible()

    expect(errors, errors.join('\n')).toEqual([])
  })
})
