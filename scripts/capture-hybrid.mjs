import { chromium } from 'playwright'
import { createServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const out = '/cursor/stores/bc-f3fc556d-f6f6-45e8-a01a-5547f2be7077/media/hybrid-am'
const shots = [
  ['title', 'title.png'],
  ['cl-cd-compromise', 'intro.png'],
  ['ch02-drs', 'mechatronics.png'],
  ['dil-nurburgring', 'simulation.png'],
  ['lap-grip-algorithms', 'results.png'],
  ['ch05-firewall', 'valhalla.png'],
  ['g1-table3-forces', 'graphs.png'],
  ['g4-grip-balance', 'graphs-gallery.png'],
]

const server = await createServer({
  root,
  server: { port: 5199, strictPort: true, host: '127.0.0.1' },
})
await server.listen()

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

for (const [id, file] of shots) {
  const el = page.getByTestId(`beat-${id}`)
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(550)
  await page.screenshot({ path: `${out}/${file}`, fullPage: false })
  await page.screenshot({ path: `/opt/cursor/artifacts/${file}`, fullPage: false })
  console.log('shot', file)
}

await browser.close()
await server.close()
console.log('done')
