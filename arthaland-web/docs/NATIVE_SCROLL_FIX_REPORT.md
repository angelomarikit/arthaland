# Native scroll stability fix — report

**Date:** 2026-11-04  
**Branch:** `fix/native-scroll`  
**Patch ZIP:** `ARTHALAND_native_scroll_stability_patch.zip` was **not found** in the project folder; changes match `README_PATCH.txt` intent from the external review.

## Root causes addressed

| Issue | Fix |
|-------|-----|
| Lenis virtual scroll + inertia | **Removed** Lenis entirely; native wheel/touch scroll |
| Missing `scrollerProxy` sync / duplicate RAF | Deleted `lenisScrollTrigger.ts` and Lenis dependency |
| Hero scroll-scrub on copy/overlay | Removed; **load-only** GSAP reveals kept |
| Parallax scrub on large images | `ParallaxImage` is static (same layout) |
| Property hero image parallax | Removed scrub; **load-only** copy reveal |
| 56 MB / 22 MB JPEGs in `public/` | WebP in `/assets/optimized/`; originals in `asset-archive/` |
| Legacy unused MP4s in `public/` | Moved toward `asset-archive/legacy-videos/` |

## Files changed

- `src/components/motion/ScrollMotionProvider.tsx` — native scroll + route refresh only
- `src/components/hero/CinematicHero.tsx` — no scroll-linked fade
- `src/components/motion/ParallaxImage.tsx` — static image
- `src/components/property/PropertyDetailHero.tsx` — no image parallax
- `src/config/sectionImages.ts` — optimized WebP paths
- `src/data/developments.ts` — optimized card/detail heroes
- `src/index.css` — removed Lenis classes
- `package.json` / `package-lock.json` — **lenis** removed
- **Deleted:** `src/animation/lenisScrollTrigger.ts`
- **Added:** `public/assets/optimized/*.webp`, `asset-archive/`

## GSAP retained (lightweight)

One-shot `ScrollTrigger` reveals (gallery, intro, split text, FAQ) — **no scrub**, no pins.

## Verification (2026-11-04)

| Check | Result |
|-------|--------|
| `npm run build` | Pass |
| `npm run lint` | Pass (2 pre-existing oxlint warnings) |
| `verify-repair.mjs` @ `http://127.0.0.1:4176` | **24 / 24 pass** |
| `profile-scroll.mjs` | `lenis=false`; stepped scroll avg frame ~83–90 ms (desktop/mobile) |

```powershell
cd arthaland-web
npm run build
npm run lint
npm run preview
$env:PREVIEW_URL="http://127.0.0.1:4173"
node scripts/profile-scroll.mjs
node scripts/verify-repair.mjs
```

## Deploy

Push `fix/native-scroll` → Vercel **Preview** → manual scroll QA before merging to production.

## Remaining limitations

- Eluria card still uses hospitality creative (authentic exterior pending).
- Lucima aerial WebP ~798 KB (target band upper end; original was 56 MB JPEG).
- Production `https://arthaland-xi.vercel.app/` unchanged until preview is approved and merged.
