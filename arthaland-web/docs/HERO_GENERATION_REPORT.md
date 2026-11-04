# ARTHALAND hero generation report

**Date:** 2026-11-04

## Source photograph

| Field | Value |
|-------|--------|
| File | `public/assets/properties/eluria/exterior-hero.png` |
| Development | Eluria (Legazpi Village, Makati) — official ARTHALAND imagery |
| Resolution | 2000×1943 |
| Higgsfield media_id | `31d95619-bf51-4f39-80b5-b5750e87a1dd` |

## Higgsfield generation

| Field | Value |
|-------|--------|
| Model | **Seedance 2.5** (`seedance_2_5`, `omni_reference`, `start_image`) |
| Job ID | `6cf95371-d1e5-4fe9-b0fb-1e80197c3bff` |
| Duration requested | 8s |
| Aspect | 16:9 |
| Resolution | 1080p |
| Audio | Off |
| Credits (preflight) | **128** |

Raw output: `public/assets/hero/source/higgsfield-eluria-hero-raw.mp4` (1920×1080, ~8.04s, 24fps)

## Loop method

Tail (~0.6s) crossfaded into head (~1.2s) appended after main body (~6.8s) → **~8.25s** master with softer loop handoff. Browser `loop` replays this file; review 3+ cycles in browser for acceptance.

## Delivered assets

| Asset | Path |
|-------|------|
| Desktop hero | `public/assets/hero/arthaland-hero-desktop.mp4` |
| Mobile hero | `public/assets/hero/arthaland-hero-mobile.mp4` (1080×1920 center crop) |
| Poster | `public/assets/hero/arthaland-hero-poster.webp` |
| Legacy (unused) | `public/assets/hero/hero-desktop.mp4` |

## Site integration

- `src/config/assets.ts` → `heroAssets` v=**5**
- `CinematicHero.tsx` — dual `<video>` (desktop/mobile), **no remount on scroll**, no transform on video; scroll animates copy/overlay only

## Tests

| Check | Result |
|-------|--------|
| `npm run build` | Run after pull |
| Old hero URL in `heroAssets` | Removed |
| Manual loop / shake QA | Required in browser |

## Deployment

Vercel deploy not run from this session — run `npm run build` locally, then deploy existing project when ready.
