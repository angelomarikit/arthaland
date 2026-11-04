# Property discovery & CMS preparation — report

**Date:** 2026-11-04

## Summary

Implemented CMS-ready domain types, local seed repository (10 developments), redesigned portfolio filters, enhanced property detail sections, properties mega-menu, and admin preview screens (no DB writes).

## Default property records (10)

| # | Name | Slug | Publication |
|---|------|------|-------------|
| 1 | Eluria | `eluria` | published |
| 2 | Una Apartments | `una-apartments` | published |
| 3 | Liv | `liv` | coming_soon |
| 4 | Lucima | `lucima` | published |
| 5 | Savya Financial Center | `savya-financial-center` | draft |
| 6 | Sevina Park | `sevina-park` | coming_soon |
| 7 | Sondris | `sondris` | published |
| 8 | Cebu Exchange | `cebu-exchange` | draft |
| 9 | Arthaland Century Pacific Tower | `century-pacific-tower` | draft |
| 10 | Arya Residences | `arya-residences` | draft |

Public site lists **published + coming_soon** (6 visible). Drafts admin-only / 404 on public URLs.

## Components changed / added

- `src/domain/development/types.ts`
- `src/config/developmentAssets.ts`
- `src/data/seed/developments.seed.ts`
- `src/data/repositories/developmentRepository.ts`
- `src/data/developments.ts` (re-exports)
- `src/pages/PropertiesPage.tsx`
- `src/pages/PropertyDetailPage.tsx`
- `src/components/property/PropertyFilters.tsx` (category filters)
- `src/components/property/PropertyCard.tsx`
- `src/components/property/PropertyUnitTypesSection.tsx`
- `src/components/property/PropertyFloorPlansSection.tsx`
- `src/components/property/PropertyVideoSection.tsx`
- `src/components/layout/PropertiesNavMenu.tsx`
- `src/pages/admin/AdminDevelopmentsPage.tsx`
- `src/pages/admin/AdminDevelopmentEditPage.tsx`
- `src/pages/admin/AdminDashboardPage.tsx`

## Missing verified assets

- Savya, Cebu Exchange, Century Pacific Tower, Arya — illustrative placeholders flagged
- Liv — campaign graphic only
- Sevina — interim Una-context imagery
- Floor plans — none seeded (sections hidden)

## Verification

| Check | Result |
|-------|--------|
| `npm run build` | Pass |
| `npm run lint` | Pass (existing oxlint warnings only) |
| Seed records | 10 unique slugs |
| Playwright | `docs/screenshots/secondary-pages/` — properties, featured (#featured), eluria/lucima/liv detail, admin list + edit |

```powershell
cd arthaland-web
npm run build
npm run lint
npm run preview
node scripts/screenshot-secondary-pages.mjs
```

## Performance

No Lenis, no scroll-linked GSAP added. Native scrolling preserved.

## Deploy

Push branch → Vercel Preview (not production).
