/**
 * Lightweight scroll profiling via Playwright + Performance API.
 * Usage: PREVIEW_URL=http://127.0.0.1:4174 node scripts/profile-scroll.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4174'
const OUT = path.resolve(__dirname, '../../arthaland-repair-verify')

async function profileViewport(page, label, width, height) {
  await page.setViewportSize({ width, height })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })

  const sample = await page.evaluate(async () => {
    const longTasks = []
    const obs = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) longTasks.push(e.duration)
    })
    obs.observe({ type: 'longtask', buffered: true })

    const frames = []
    let last = performance.now()
    const track = (now) => {
      frames.push(now - last)
      last = now
    }

    for (let i = 0; i < 8; i++) {
      window.scrollBy(0, window.innerHeight * 0.55)
      await new Promise((r) => requestAnimationFrame(r))
      track(performance.now())
      await new Promise((r) => setTimeout(r, 80))
    }

    obs.disconnect()
    const frameMs = frames.filter((f) => f > 0)
    const dropped = frameMs.filter((f) => f > 20).length
    const avgFrame = frameMs.length
      ? frameMs.reduce((a, b) => a + b, 0) / frameMs.length
      : 0

    return {
      longTaskCount: longTasks.length,
      longTaskMaxMs: longTasks.length ? Math.max(...longTasks) : 0,
      avgFrameMs: Math.round(avgFrame * 100) / 100,
      droppedFramesOver20ms: dropped,
      lenisActive: document.documentElement.classList.contains('lenis'),
    }
  })

  return { label, width, height, ...sample }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const results = []
  results.push(await profileViewport(page, 'desktop', 1440, 900))
  results.push(await profileViewport(page, 'mobile', 390, 844))

  await browser.close()

  const outPath = path.join(OUT, 'scroll-profile-after.json')
  fs.writeFileSync(outPath, JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2))
  console.log('Wrote', outPath)
  for (const r of results) {
    console.log(
      r.label,
      `avgFrame=${r.avgFrameMs}ms`,
      `dropped>20ms=${r.droppedFramesOver20ms}`,
      `longTasks=${r.longTaskCount}`,
      `lenis=${r.lenisActive}`,
    )
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
