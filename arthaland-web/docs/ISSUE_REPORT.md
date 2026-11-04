# ARTHALAND — Issue & blocker report

Last updated: 2026-11-04

## BLOCKED — assets

| Item | Status | Notes |
|------|--------|-------|
| Sevina Park dedicated hero/gallery | BLOCKED | Direct imgix and unsigned paths return 403. Card uses Una-at-Sevina imagery with `sourceNote` in `developments.ts`. Needs client-supplied or browser-session authorized download. |
| Team headshots | BLOCKED | No authorized staff photos supplied. Team page uses placeholders only. |
| Corporate email for sales team | BLOCKED | Only verified corporate phone + ACPT address from arthaland.com. Footer omits email until approved. |

## PASS — verified

| Item | Status |
|------|--------|
| Hero 15s film from real ARTHALAND photos (Ken Burns / ffmpeg) | PASS — `public/assets/hero/hero-desktop.mp4` |
| Published development catalog (no invented buildings) | PASS — `src/data/developments.ts` |
| Property images on disk for Eluria, Una, Lucima, Liv, Sondris | PASS |
| Routes: Home, About, Properties, Detail, Services, Team, Contact, Privacy, 404, Admin shell | PASS |
| Supabase migration SQL stub | PASS — run manually in SQL Editor |
| Production build (`npm run build`) | Re-verify after each major change |

## FAIL / pending QA

| Item | Status | Notes |
|------|--------|-------|
| Visual parity vs Avenlo (all breakpoints) | FAIL | Not fully audited page-by-page |
| Lighthouse 90+ targets | FAIL | Not measured this session |
| Hero WebM + dedicated mobile MP4 | FAIL | Single desktop master reused |
| Full Admin CMS CRUD UI | FAIL | Dashboard shell only |
| Higgsfield ~500 cr secondary motion | PENDING | Budget reserved; hero uses ffmpeg for accuracy |
| Image AVIF/WebP srcsets | FAIL | Originals served from `/public/assets` |
| Privacy policy legal copy | FAIL | Placeholder points to corporate site |

## AI / legacy assets (do not use as property photos)

- `public/assets/videos/hero-cinematic.mp4` — early AI hero (superseded)
- `public/assets/hero/source/` may contain AI still; storyboard uses official photos
