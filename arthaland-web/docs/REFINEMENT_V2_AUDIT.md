# Refinement V2 audit (2026-11-04)

## Hero jitter — root causes found

| Source | Verdict |
|--------|---------|
| Ken Burns `zoompan` in MP4 | **Primary** — integer pixel stepping reads as shake |
| GSAP `scale` + `y` on video wrapper | **Secondary** — compounded motion with encoded pan |
| Lenis + ScrollTrigger | OK when single ticker; route refresh added |

## Fixes applied

- Rebuilt hero as **static holds + crossfades** (`scripts/build-hero-video.ps1`) → `hero-desktop.mp4` v3 cache bust
- Removed transform animation on hero **video**; scroll scrub fades **copy/overlay only**
- Lenis scroll-to-top + `ScrollTrigger.refresh(true)` on route change
- Full **desktop nav** (Home → Contact) + **Facebook** icon; **mobile drawer** (Escape, backdrop, body lock)
- **Homepage inquiry form** → Supabase via shared `InquiryForm`
- **`sectionImages.ts`** — deduplicated section photography assignments
- Sustainability section — fixed desktop/mobile **duplicate/overlap** copy
- Hero spacing — extra bottom padding; scroll hint repositioned

## Higgsfield hero I2V

MCP upload/cost preflight blocked in this environment (network sandbox). **Next step:** upload storyboard stills via `media_upload` + `seedance_2_5` I2V (review each clip); assemble with ffmpeg xfade. Until then, stable crossfade master is production-safe.

## QA checklist (local)

| Check | Status |
|-------|--------|
| `npm run build` | Run after pull |
| Hero stability | Improved (static+crossfade) |
| Nav / mobile menu | Implemented |
| Homepage form | Implemented |
| Facebook links | Footer, mobile menu, contact, desktop nav |
| Overlap fixes | Partial — re-test 375/390 |
| Higgsfield new hero | Blocked — manual MCP run |
