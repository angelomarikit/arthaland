/**
 * Supplemental audit: SPA client-side navigation (Vercel lacks rewrites).
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../../arthaland-audit')
const BASE = 'https://arthaland-xi.vercel.app'

const NAV = [
  { id: 'home', link: 'Home', path: '/' },
  { id: 'properties', link: 'Properties', path: '/properties' },
  { id: 'about', link: 'About Us', path: '/about' },
  { id: 'services', link: 'Services', path: '/services' },
  { id: 'team', link: 'Our Team', path: '/team' },
  { id: 'contact', link: 'Contact', path: '/contact' },
]

const VIEWPORTS = [
  { w: 1440, h: 900, tag: '1440x900', folder: 'desktop-spa', mobile: false },
  { w: 390, h: 844, tag: '390x844', folder: 'mobile-spa', mobile: true },
]

async function gotoViaNav(page, linkText, isMobile) {
  if (isMobile) {
    const menu = page.getByRole('button', { name: /menu|open|navigation/i }).first()
    if (await menu.isVisible().catch(() => false)) {
      await menu.click()
      await page.waitForTimeout(400)
    }
  }
  const link = page.getByRole('link', { name: linkText, exact: true }).first()
  await link.click()
  await page.waitForURL((url) => url.pathname !== '' || linkText === 'Home', {
    timeout: 15000,
  })
  await page.waitForTimeout(1200)
}

async function main() {
  for (const sub of ['desktop-spa', 'mobile-spa', 'animation']) {
    fs.mkdirSync(path.join(OUT, sub), { recursive: true })
  }

  const scrollFindings = []
  const browser = await chromium.launch({ headless: true })

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: vp.mobile ? 2 : 1,
    })
    const page = await context.newPage()
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })

    for (const item of NAV) {
      if (item.id !== 'home') await gotoViaNav(page, item.link, vp.mobile)
      const url = page.url()
      if (!url.includes(item.path) && item.path !== '/') {
        scrollFindings.push({
          viewport: vp.tag,
          page: item.id,
          issue: 'URL mismatch after nav',
          url,
        })
      }
      await page.screenshot({
        path: path.join(OUT, vp.folder, `${item.id}-${vp.tag}.png`),
        fullPage: true,
      })
    }

    // Property detail via properties list
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await gotoViaNav(page, 'Properties', vp.mobile)
    const eluria = page.getByRole('link', { name: /eluria/i }).first()
    if (await eluria.isVisible().catch(() => false)) {
      await eluria.click()
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: path.join(OUT, vp.folder, `property-eluria-${vp.tag}.png`),
        fullPage: true,
      })
    }

    if (vp.tag === '1440x900') {
      await page.goto(BASE, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      for (const y of [1600, 2000, 2400, 2800, 3200]) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
        await page.waitForTimeout(900)
        const darkRatio = await page.evaluate(() => {
          const canvas = document.createElement('canvas')
          canvas.width = 80
          canvas.height = 80
          const ctx = canvas.getContext('2d')
          // sample center viewport via elementFromPoint grid
          let dark = 0
          let total = 0
          const cx = window.innerWidth / 2
          const cy = window.innerHeight / 2
          for (let dx = -200; dx <= 200; dx += 100) {
            for (let dy = -200; dy <= 200; dy += 100) {
              const el = document.elementFromPoint(cx + dx, cy + dy)
              if (!el) continue
              const bg = getComputedStyle(el).backgroundColor
              const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
              if (m) {
                const lum = 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]
                if (lum < 30) dark++
                total++
              }
            }
          }
          return { y: window.scrollY, dark, total, ratio: total ? dark / total : 0 }
        })
        await page.screenshot({
          path: path.join(OUT, 'animation', `home-scroll-${y}-${vp.tag}.png`),
          fullPage: false,
        })
        if (darkRatio.ratio > 0.85 && darkRatio.total > 3) {
          scrollFindings.push({
            viewport: vp.tag,
            scrollY: y,
            issue: 'Viewport mostly dark (possible pin blackout)',
            ...darkRatio,
          })
        }
      }
    }

    await context.close()
  }

  fs.writeFileSync(
    path.join(OUT, 'animation', 'scroll-findings.json'),
    JSON.stringify(scrollFindings, null, 2),
  )
  await browser.close()
  console.log('Client-nav audit done', scrollFindings.length, 'scroll findings')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
