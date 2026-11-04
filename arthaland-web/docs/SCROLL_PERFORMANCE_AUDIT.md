# Scroll performance audit & remediation

**Site:** ARTHALAND (`arthaland-web`)  
**Date:** 2026-11-04

## 1. Root causes identified (before)

| Cause | Impact |
|-------|--------|
| Lenis `duration: ~1s` smoothing | Wheel input felt delayed / “resisting” user |
| No `ScrollTrigger.scrollerProxy` | ScrollTrigger read native scroll while Lenis moved virtual scroll → desync & extra work |
| GSAP ticker `lenis.raf(time * 1000)` | Non–RAF clock; switched to `performance.now()` |
| Services `pin: true` + `scrub` + `setState` every frame | Main-thread + React re-renders during scroll |
| Sustainability scrub on **width/height** | Layout thrashing every frame |
| Gallery/lifestyle/CTA long **scrub** parallax | Animations “chasing” scroll (0.65–1s smoothing) |
| Featured horizontal **ScrollTrigger pin** | Black viewport + pin spacer cost (removed earlier) |
| Duplicate `ScrollTrigger.refresh(true)` on route change | Layout thrash (`ScrollToTop` + provider) |
| `html { scroll-behavior: smooth }` + Lenis | Competing smooth-scroll semantics |
| Property hero **scale** scrub on full-bleed image | Expensive compositing |
| Hero video always decoding | CPU/GPU while offscreen |

**Not in use:** Framer Motion scroll (only `useReducedMotion` on hero). Single Lenis instance in `ScrollMotionProvider` only.

## 2. Files changed (this pass)

- `src/animation/lenisScrollTrigger.ts` — **new** official-style Lenis ↔ ScrollTrigger bridge
- `src/components/motion/ScrollMotionProvider.tsx` — lerp-only Lenis, single ticker, debounced refresh
- `src/animation/gsapSetup.ts` — `ScrollTrigger.config({ limitCallbacks, ignoreMobileResize })`
- `src/animation/motionTokens.ts` — shorter default scrub (0.3 / 0.45)
- `src/components/layout/ScrollToTop.tsx` — removed duplicate refresh
- `src/index.css` — `scroll-behavior: auto`
- `src/components/motion/ParallaxImage.tsx` — shorter scrub, no blanket `will-change`
- `src/components/property/PropertyDetailHero.tsx` — translate only, no scale scrub
- `src/components/hero/CinematicHero.tsx` — shorter hero scrub; pause video offscreen
- `src/components/motion/ImageMaskReveal.tsx` — removed permanent `will-change`
- Prior: `ServicesPinnedSection`, `SustainabilityExpandSection`, `FeaturedHorizontalShowcase`, gallery/lifestyle/CTA simplifications

## 3. Lenis adjustments

| Setting | Value |
|---------|--------|
| Desktop | `lerp: 0.15`, `smoothWheel: true`, `wheelMultiplier: 1`, `autoRaf: false` |
| Mobile / `<1024px` | **Native scroll** (Lenis disabled) |
| Integration | One `gsap.ticker` → `lenis.raf(performance.now())` + `scrollerProxy` |

## 4. GSAP adjustments

- Remaining scrub tweens use **0.25–0.3** (hero, parallax, property hero)
- One-shot reveals unchanged (intro, gallery, split text) — `toggleActions`, no scrub
- **No `pin: true`** left on homepage
- Context cleanup via `useGsapScope` → `gsap.context().revert()`

## 5. Pinned sections

| Section | Action |
|---------|--------|
| Featured showcase | Native horizontal scroll-snap + `data-lenis-prevent` |
| Services | Static layout + tab buttons |
| Sustainability | Static full-bleed (no expand scrub) |

## 6. Profiling

Run after preview/build:

```powershell
npm run build; npm run preview
$env:PREVIEW_URL="http://127.0.0.1:4174"
node scripts/profile-scroll.mjs
node scripts/verify-repair.mjs
```

Output: `arthaland-repair-verify/scroll-profile-after.json`

Compare `avgFrameMs`, `droppedFramesOver20ms`, and `longTaskCount` before/after on the same machine. **Not a guaranteed 60 FPS claim** — lab sampling during programmatic scroll.

## 7. Remaining limitations

- Eluria property card still uses brochure still (asset constraint)
- Lenis still adds slight inertia vs native wheel (by design on desktop ≥1024px)
- `ImageMaskReveal` uses one-time `clip-path` (acceptable; not scrubbed)
- Production Lighthouse on live URL should be re-run after preview merge

## 8. Deploy

Changes on branch `fix/audit-repair`. Merge → Vercel preview → validate scroll on trackpad + mouse before promoting to production.
