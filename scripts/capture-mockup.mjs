import { chromium } from 'playwright'
import { createServer } from 'vite'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const out = '/cursor/stores/bc-50e67902-295f-4cc0-b0a2-15f7522fce5d/media/mockup'
const artifacts = '/opt/cursor/artifacts'

await mkdir(out, { recursive: true })
await mkdir(artifacts, { recursive: true })

const shots = [
  { name: 'hero', scroll: null, wait: 900 },
  { name: 'chapter-nav', scroll: 'chapter-control', wait: 700, clipNav: true },
  { name: 'mid-chapter', scroll: 'chapter-control', wait: 700 },
]

const server = await createServer({
  root,
  server: { port: 5198, strictPort: true, host: '127.0.0.1' },
})
await server.listen()

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5198/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)

for (const shot of shots) {
  if (shot.scroll) {
    await page.getByTestId(shot.scroll).scrollIntoViewIfNeeded()
    await page.waitForTimeout(shot.wait)
  } else {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(shot.wait)
  }

  const destStore = path.join(out, `${shot.name}.png`)
  const destArt = path.join(artifacts, `mockup-${shot.name}.png`)

  if (shot.clipNav) {
    const nav = page.getByTestId('chapter-nav')
    await nav.screenshot({ path: destStore })
    await nav.screenshot({ path: destArt })
  } else {
    await page.screenshot({ path: destStore, fullPage: false })
    await page.screenshot({ path: destArt, fullPage: false })
  }
  console.log('shot', shot.name)
}

await browser.close()
await server.close()
console.log('done', out)
