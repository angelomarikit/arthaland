import sharp from 'sharp'
import { mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = process.argv[2]
if (!src) {
  console.error('Usage: node scripts/process-brand-logo.mjs <source.jpg>')
  process.exit(1)
}

const outDir = path.join(root, 'public', 'assets', 'brand')
await mkdir(outDir, { recursive: true })

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const out = Buffer.from(data)

for (let i = 0; i < width * height; i++) {
  const o = i * channels
  const r = out[o]
  const g = out[o + 1]
  const b = out[o + 2]
  // Dark green matte background → transparent; keep white logo elements opaque.
  const isBg =
    g > r + 8 &&
    g > b + 8 &&
    g > 40 &&
    r < 120 &&
    b < 120
  if (isBg) {
    out[o + 3] = 0
  } else {
    const lum = (r + g + b) / 3
    out[o + 3] = lum > 240 ? 255 : Math.min(255, Math.round((lum / 255) * 255))
    out[o] = 255
    out[o + 1] = 255
    out[o + 2] = 255
  }
}

const fullPng = await sharp(out, { raw: { width, height, channels: 4 } })
  .png()
  .toBuffer()

await sharp(fullPng)
  .trim()
  .png()
  .toFile(path.join(outDir, 'arthaland-logo-lockup.png'))

// Circular mark — centered in upper third
const markSize = Math.round(width * 0.36)
const markLeft = Math.round((width - markSize) / 2)
const markTop = Math.round(height * 0.11)
await sharp(fullPng)
  .extract({ left: markLeft, top: markTop, width: markSize, height: markSize })
  .resize(120, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(outDir, 'arthaland-mark.png'))

await copyFile(src, path.join(outDir, 'arthaland-logo-source.jpg'))
console.log('Wrote brand assets to public/assets/brand/')
