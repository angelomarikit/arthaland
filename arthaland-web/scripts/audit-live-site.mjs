/**
 * Live site audit — https://arthaland-xi.vercel.app/
 * Output: ../arthaland-audit/
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../../arthaland-audit')
const BASE = 'https://arthaland-xi.vercel.app'

/** From src/App.tsx — public MainLayout routes */
const PAGES = [
  { id: 'home', path: '/', name: 'Home' },
  { id: 'properties', path: '/properties', name: 'Properties' },
  {
    id: 'property-eluria',
    path: '/properties/eluria',
    name: 'Property Detail (Eluria)',
  },
  { id: 'about', path: '/about', name: 'About Us' },
  { id: 'services', path: '/services', name: 'Services' },
  { id: 'team', path: '/team', name: 'Our Team' },
  { id: 'contact', path: '/contact', name: 'Contact' },
]

const DESKTOP = [
  { w: 1440, h: 900, tag: '1440x900' },
  { w: 1920, h: 1080, tag: '1920x1080' },
]
const MOBILE = [
  { w: 390, h: 844, tag: '390x844' },
  { w: 375, h: 812, tag: '375x812' },
  { w: 320, h: 720, tag: '320x720' },
]

const findings = []
const consoleLogs = []
const networkFails = []
const pageMetrics = []

function addFinding(severity, page, issue, evidence = '') {
  findings.push({ severity, page, issue, evidence })
}

function ensureDirs() {
  for (const sub of [
    'desktop',
    'mobile',
    'hero',
    'logs',
    'performance',
    'animation',
  ]) {
    fs.mkdirSync(path.join(OUT, sub), { recursive: true })
  }
}

async function checkPageHealth(page, pageName) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      hasHorizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
    }
  })

  if (overflow.hasHorizontalOverflow) {
    addFinding(
      'P1',
      pageName,
      'Horizontal overflow detected',
      `scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`,
    )
  }

  const brokenImages = await page.evaluate(() => {
    return [...document.querySelectorAll('img')]
      .filter((img) => {
        if (!img.complete || img.naturalWidth === 0) return true
        return false
      })
      .map((img) => img.src || img.getAttribute('src') || '(empty)')
  })

  for (const src of brokenImages) {
    addFinding('P1', pageName, 'Broken or incomplete image', src)
  }

  const overlapHints = await page.evaluate(() => {
    const issues = []
    const texts = [...document.querySelectorAll('h1,h2,h3,p,a,button')]
      .slice(0, 80)
    for (let i = 0; i < texts.length; i++) {
      const a = texts[i].getBoundingClientRect()
      if (a.width === 0 || a.height === 0) continue
      for (let j = i + 1; j < texts.length; j++) {
        const b = texts[j].getBoundingClientRect()
        if (b.width === 0 || b.height === 0) continue
        const overlap =
          a.left < b.right &&
          a.right > b.left &&
          a.top < b.bottom &&
          a.bottom > b.top
        if (overlap) {
          const area =
            Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
            Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
          if (area > 400) {
            issues.push(
              `${texts[i].tagName}:${(texts[i].textContent || '').slice(0, 40)} ∩ ${texts[j].tagName}:${(texts[j].textContent || '').slice(0, 40)}`,
            )
          }
        }
      }
    }
    return issues.slice(0, 5)
  })

  for (const hint of overlapHints) {
    addFinding('P2', pageName, 'Possible text overlap (heuristic)', hint)
  }

  return { overflow, brokenImages }
}

async function auditViewport(browser, viewport, folder, isMobile) {
  const context = await browser.newContext({
    viewport: { width: viewport.w, height: viewport.h },
    deviceScaleFactor: isMobile ? 2 : 1,
    userAgent: isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
      : undefined,
  })

  const page = await context.newPage()
  const pageConsole = []
  const pageNetwork = []

  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      pageConsole.push({ type: msg.type(), text: msg.text() })
    }
  })
  page.on('pageerror', (err) => {
    pageConsole.push({ type: 'pageerror', text: err.message })
  })
  page.on('response', (res) => {
    const status = res.status()
    const url = res.url()
    if (status >= 400 && !url.includes('favicon')) {
      pageNetwork.push({ status, url })
    }
  })

  for (const p of PAGES) {
    const url = `${BASE}${p.path}`
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(1500)
      const shot = path.join(OUT, folder, `${p.id}-${viewport.tag}.png`)
      await page.screenshot({ path: shot, fullPage: true })
      await checkPageHealth(page, `${p.name} @ ${viewport.tag}`)

      if (p.id === 'home' && viewport.tag === '1440x900') {
        await page.evaluate(() => window.scrollTo(0, 800))
        await page.waitForTimeout(800)
        await page.screenshot({
          path: path.join(OUT, 'animation', `home-scroll-800-${viewport.tag}.png`),
          fullPage: false,
        })
        await page.evaluate(() => window.scrollTo(0, 2400))
        await page.waitForTimeout(800)
        await page.screenshot({
          path: path.join(
            OUT,
            'animation',
            `home-scroll-2400-${viewport.tag}.png`,
          ),
          fullPage: false,
        })
      }
    } catch (e) {
      addFinding('P0', p.name, 'Navigation or load failure', String(e))
    }
  }

  consoleLogs.push({ viewport: viewport.tag, folder, entries: pageConsole })
  networkFails.push({ viewport: viewport.tag, folder, entries: pageNetwork })

  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    const paints = performance.getEntriesByType('paint')
    const fcp = paints.find((p) => p.name === 'first-contentful-paint')
    return {
      domContentLoaded: nav?.domContentLoadedEventEnd,
      loadEventEnd: nav?.loadEventEnd,
      fcp: fcp?.startTime,
    }
  })
  pageMetrics.push({ viewport: viewport.tag, folder, home: perf })

  await context.close()
}

async function auditHeroVideo(browser) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: path.join(OUT, 'hero'),
      size: { width: 1920, height: 1080 },
    },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)

  const videoState = await page.evaluate(() => {
    const v = document.querySelector('video')
    if (!v) return { found: false }
    return {
      found: true,
      paused: v.paused,
      currentSrc: v.currentSrc,
      readyState: v.readyState,
      loop: v.loop,
      muted: v.muted,
    }
  })

  fs.writeFileSync(
    path.join(OUT, 'hero', 'video-element-state.json'),
    JSON.stringify(videoState, null, 2),
  )

  if (!videoState.found) {
    addFinding('P0', 'Home Hero', 'No HTML video element found on homepage')
  }

  await page.waitForTimeout(500)
  for (let t = 0; t <= 20; t += 2) {
    await page.screenshot({
      path: path.join(OUT, 'hero', `hero-frame-${String(t).padStart(2, '0')}s.png`),
    })
    if (t < 20) await page.waitForTimeout(2000)
  }

  const beforeScroll = await page.evaluate(() => {
    const v = document.querySelector('video')
    return v ? { time: v.currentTime, paused: v.paused } : null
  })
  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(1000)
  const afterScroll = await page.evaluate(() => {
    const v = document.querySelector('video')
    return v ? { time: v.currentTime, paused: v.paused } : null
  })

  fs.writeFileSync(
    path.join(OUT, 'hero', 'scroll-playback-check.json'),
    JSON.stringify({ beforeScroll, afterScroll }, null, 2),
  )

  if (beforeScroll && afterScroll && afterScroll.time < beforeScroll.time - 0.5) {
    addFinding(
      'P1',
      'Home Hero',
      'Video currentTime jumped backward after scroll (possible restart)',
      JSON.stringify({ beforeScroll, afterScroll }),
    )
  }

  await context.close()
}

async function runLighthouse() {
  const { execSync } = await import('child_process')
  const outPath = path.join(OUT, 'performance', 'lighthouse-home-mobile.json')
  try {
    execSync(
      `npx lighthouse ${BASE} --output=json --output-path="${outPath}" --chrome-flags="--headless" --form-factor=mobile --screenEmulation.mobile=true --quiet --only-categories=performance,accessibility,best-practices,seo`,
      { stdio: 'pipe', timeout: 180000, cwd: path.dirname(__dirname) },
    )
  } catch (e) {
    fs.writeFileSync(
      path.join(OUT, 'performance', 'lighthouse-error.txt'),
      String(e.stdout || e.message || e),
    )
    addFinding(
      'P2',
      'Performance',
      'Lighthouse CLI did not complete',
      'See performance/lighthouse-error.txt',
    )
  }
}

function writeReport() {
  const p0 = findings.filter((f) => f.severity === 'P0')
  const p1 = findings.filter((f) => f.severity === 'P1')
  const p2 = findings.filter((f) => f.severity === 'P2')

  let lhSummary = ''
  const lhPath = path.join(OUT, 'performance', 'lighthouse-home-mobile.json')
  if (fs.existsSync(lhPath)) {
    try {
      const lh = JSON.parse(fs.readFileSync(lhPath, 'utf8'))
      const c = lh.categories || {}
      lhSummary = `
## Lighthouse (homepage, mobile form-factor)

| Category | Score |
|----------|-------|
| Performance | ${Math.round((c.performance?.score ?? 0) * 100)} |
| Accessibility | ${Math.round((c.accessibility?.score ?? 0) * 100)} |
| Best Practices | ${Math.round((c['best-practices']?.score ?? 0) * 100)} |
| SEO | ${Math.round((c.seo?.score ?? 0) * 100)} |

Audits (LCP/CLS/INP): see \`performance/lighthouse-home-mobile.json\`
`
    } catch {
      lhSummary = '\n(Lighthouse JSON present but could not parse summary)\n'
    }
  }

  const md = `# ARTHALAND Live Site Audit

**URL:** ${BASE}  
**Date:** ${new Date().toISOString()}  
**Local project:** \`arthaland-web\`  
**Method:** Playwright Chromium automated pass + Lighthouse (attempt)

## Routes audited (from React Router)

| Page | Path |
|------|------|
${PAGES.map((p) => `| ${p.name} | \`${p.path}\` |`).join('\n')}

## Viewports

- Desktop: ${DESKTOP.map((v) => v.tag).join(', ')}
- Mobile: ${MOBILE.map((v) => v.tag).join(', ')}

## Artifacts

- \`desktop/\` — full-page screenshots per page × viewport
- \`mobile/\` — full-page screenshots per page × viewport
- \`hero/\` — 20s frame captures, screen recording (webm), video state JSON
- \`animation/\` — homepage scroll snapshots (1440×900)
- \`logs/console-errors.json\` — console warnings/errors by viewport session
- \`logs/network-failures.json\` — HTTP ≥400 responses
- \`performance/\` — Lighthouse output when successful

${lhSummary}

## Summary counts

| Severity | Count |
|----------|-------|
| P0 Critical | ${p0.length} |
| P1 Major | ${p1.length} |
| P2 Minor | ${p2.length} |

## P0 — Critical

${p0.length ? p0.map((f) => `- **${f.page}:** ${f.issue}${f.evidence ? `\n  - Evidence: ${f.evidence}` : ''}`).join('\n') : '_None detected in automated pass._'}

## P1 — Major

${p1.length ? p1.map((f) => `- **${f.page}:** ${f.issue}${f.evidence ? `\n  - Evidence: ${f.evidence}` : ''}`).join('\n') : '_None detected in automated pass._'}

## P2 — Minor

${p2.length ? p2.map((f) => `- **${f.page}:** ${f.issue}${f.evidence ? `\n  - Evidence: ${f.evidence}` : ''}`).join('\n') : '_None detected in automated pass._'}

## Animation / scroll notes (manual review required)

Review \`animation/home-scroll-*.png\` and \`hero/hero-frame-*.png\` for:
- Featured developments pin blackout
- Hero loop seam / shake
- Gradient overlays on hero

## Recommended code fixes (audit only — not applied)

1. Re-test Featured horizontal pin section after scroll on live build; adjust ScrollTrigger pin target height if blackout persists.
2. Verify hero \`currentSrc\` matches \`arthaland-hero-desktop.mp4\` on Vercel deploy (cache bust query).
3. Address any network 404s listed in \`logs/network-failures.json\`.
4. Fix console errors before next release.
5. Reduce LCP if Lighthouse performance < 90 (hero poster WebP, video preload strategy).

---

_Automated audit. Human review of screenshots and hero webm recommended._
`

  fs.writeFileSync(path.join(OUT, 'REPORT.md'), md)
}

async function main() {
  ensureDirs()
  fs.writeFileSync(
    path.join(OUT, 'logs', 'routes.json'),
    JSON.stringify({ base: BASE, pages: PAGES }, null, 2),
  )

  const browser = await chromium.launch({ headless: true })

  for (const vp of DESKTOP) {
    await auditViewport(browser, vp, 'desktop', false)
  }
  for (const vp of MOBILE) {
    await auditViewport(browser, vp, 'mobile', true)
  }

  await auditHeroVideo(browser)
  await browser.close()

  await runLighthouse()

  fs.writeFileSync(
    path.join(OUT, 'logs', 'console-errors.json'),
    JSON.stringify(consoleLogs, null, 2),
  )
  fs.writeFileSync(
    path.join(OUT, 'logs', 'network-failures.json'),
    JSON.stringify(networkFails, null, 2),
  )
  fs.writeFileSync(
    path.join(OUT, 'logs', 'navigation-timing.json'),
    JSON.stringify(pageMetrics, null, 2),
  )
  fs.writeFileSync(
    path.join(OUT, 'animation', 'findings-raw.json'),
    JSON.stringify(findings, null, 2),
  )

  writeReport()
  console.log('Audit complete:', OUT)
  console.log('Findings:', findings.length)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
