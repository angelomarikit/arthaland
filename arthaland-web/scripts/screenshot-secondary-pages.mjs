import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outRoot = path.join(__dirname, '..', 'docs', 'screenshots', 'secondary-pages')
const base = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173'

const routes = [
  { name: 'properties', path: '/properties' },
  { name: 'property-lucima', path: '/properties/lucima' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'team', path: '/team' },
  { name: 'contact', path: '/contact' },
]

const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile', width: 390, height: 844 },
]

await mkdir(outRoot, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage()

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height })
  for (const route of routes) {
    await page.goto(`${base}${route.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const file = path.join(outRoot, `${route.name}-${vp.label}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log('Saved', file)
  }
}

await browser.close()
console.log('Done.')
