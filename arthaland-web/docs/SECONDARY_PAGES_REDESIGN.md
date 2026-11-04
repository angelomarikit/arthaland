# Secondary pages redesign — report

**Date:** 2026-11-04  
**Scope:** Properties, Property Detail, About, Services, Team, Contact

## Design approach

- Luxury editorial layout using existing tokens (`text-display-l`, `text-heading-*`, ink/surface palette).
- **No Lenis**, no pinned scroll, no new animation libraries.
- Lightweight **Intersection Observer** fades (`FadeInWhenVisible`) and CSS **fade-up** on heroes only.
- Imagery centralized in `src/config/sectionImages.ts` (authenticated ARTHALAND WebP under `/assets/optimized/` and `/assets/properties/`).

## New shared components

| Component | Purpose |
|-----------|---------|
| `PageEditorialHero.tsx` | Cinematic page hero (optional reuse) |
| `FadeInWhenVisible.tsx` | Subtle scroll reveal, respects reduced motion |
| `PageConsultCta.tsx` | Consistent consultation band |
| `PropertyFilters.tsx` | Luxury filter bar (same filter logic) |
| `FeaturedDevelopmentSpotlight.tsx` | Wide featured development block |
| `PropertyGallery.tsx` | Editorial grid + lightbox (keyboard nav) |
| `formStyles.ts` | Contact form field styling |

## Pages updated

| Page | Highlights |
|------|------------|
| **Properties** | Editorial hero, intro band, featured spotlight (primary featured dev), refined filters, 2-col grid, empty state, CTA |
| **Property detail** | CSS hero, intro + facts panel, gallery/lightbox, amenities/sustainability, location band, related developments |
| **About** | New headline, removed CMS/dev copy, vision band, stat typography, sales team section |
| **Services** | Full editorial hero, 4 image/text bands, 4-step process, CTA |
| **Team** | Hero, Gary Lee monogram + architecture (no stock portrait), approach grid, CTA |
| **Contact** | Hero, two-column layout, styled form (**Supabase `submitInquiry` unchanged**), office + Facebook |

## Other files

- `PropertyCard.tsx` — dominant imagery, optional featured row layout
- `PropertyDetailHero.tsx` — GSAP removed → CSS fade-up
- `developments.ts` — `getPrimaryFeaturedDevelopment()`
- `index.css` — fade-up keyframes, editorial list markers
- `ClosingCtaSection.tsx` — public-facing copy

## Imagery sources

| Asset path | Use | Source |
|------------|-----|--------|
| `/assets/optimized/*.webp` | Heroes, services, about, contact | ARTHALAND project photography (optimized) |
| `/assets/properties/sondris/exterior-hero.webp` | Services viewing band | ARTHALAND Sondris |
| Development `heroImage` / `gallery` | Cards & detail | Per-development verified paths in `developments.ts` |

**Placeholders / notes**

- **Eluria** hero remains hospitality creative (`sourceNote` on detail page).
- **Gary Lee** — monogram `GL` until approved portrait.
- **Liv / Sevina** remain unpublished (not shown in listings).

## Verification

```powershell
cd arthaland-web
npm run build   # pass
npm run lint    # pass (pre-existing warnings)
npm run preview
$env:PREVIEW_URL="http://127.0.0.1:4173"
node scripts/screenshot-secondary-pages.mjs
node scripts/verify-repair.mjs
```

Screenshots: `docs/screenshots/secondary-pages/` (after running script against preview).

## Performance

- Removed GSAP `ScrollTrigger` stagger from Properties listing.
- Property gallery lightbox only mounts listeners when open.
- No scroll-linked transforms on large images.

## Deploy

Commit and push to a feature branch → **Vercel Preview** → QA all routes + inquiry form before production merge.
