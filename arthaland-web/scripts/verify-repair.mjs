/**
 * Post-repair verification — run against PREVIEW_URL env or production.
 * Usage: PREVIEW_URL=https://... node scripts/verify-repair.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = process.env.PREVIEW_URL || 'https://arthaland-xi.vercel.app'
const OUT = path.resolve(__dirname, '../../arthaland-repair-verify')

const ROUTES = [
  '/',
  '/properties',
  '/properties/eluria',
  '/about',
  '/services',
  '/team',
  '/contact',
]

const WIDTHS = [320, 375, 390, 768, 1024, 1440, 1920]

const results = []

function log(r) {
  results.push(r)
  console.log(r.pass ? 'PASS' : 'FAIL', r.name, r.detail || '')
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({ headless: true })

  for (const route of ROUTES) {
    const res = await fetch(`${BASE}${route}`, { redirect: 'follow' })
    log({
      name: `Direct load ${route}`,
      pass: res.status === 200,
      detail: `status=${res.status}`,
    })
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })

  for (const y of [0, 800, 1600, 2000, 2400, 2800, 3200, 3600]) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(700)
    const sample = await page.evaluate(() => {
      let dark = 0
      let total = 0
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      for (let dx = -150; dx <= 150; dx += 75) {
        for (let dy = -150; dy <= 150; dy += 75) {
          const el = document.elementFromPoint(cx + dx, cy + dy)
          if (!el) continue
          const bg = getComputedStyle(el).backgroundColor
          const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (m) {
            const lum = 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]
            if (lum < 25) dark++
            total++
          }
        }
      }
      return { dark, total, ratio: total ? dark / total : 0 }
    })
    const pass = sample.ratio < 0.85
    log({
      name: `Home scroll blackout y=${y}`,
      pass,
      detail: JSON.stringify(sample),
    })
    if (y === 2400) {
      await page.screenshot({
        path: path.join(OUT, 'home-scroll-2400-after.png'),
      })
    }
  }

  let loops = 0
  let lastTime = 0
  for (let i = 0; i < 90; i++) {
    await page.waitForTimeout(500)
    const t = await page.evaluate(() => {
      const v = document.querySelector('video')
      return v ? v.currentTime : -1
    })
    if (t < lastTime - 0.3) loops++
    lastTime = t
    if (loops >= 3) break
  }
  log({
    name: 'Hero video 3 loop discontinuities',
    pass: loops >= 2,
    detail: `detected_loops=${loops}`,
  })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /menu/i }).click().catch(() => {})
  await page.waitForTimeout(400)
  const navVisible = await page.getByRole('link', { name: 'Properties' }).isVisible()
  log({ name: 'Mobile hamburger nav', pass: navVisible })

  for (const w of WIDTHS) {
    const h = w < 768 ? 844 : 900
    await page.setViewportSize({ width: w, height: h })
    await page.goto(`${BASE}/properties`, { waitUntil: 'networkidle' })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    )
    log({
      name: `Horizontal overflow /properties @${w}`,
      pass: !overflow,
    })
  }

  await browser.close()
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2))
  const failed = results.filter((r) => !r.pass)
  console.log('\nFailed:', failed.length, '/', results.length)
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
