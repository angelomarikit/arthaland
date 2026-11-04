# Supabase CMS migration proposal (not executed)

## Goal

Replace `localDevelopmentRepository` with Supabase queries without changing page components.

## Proposed tables

- `developments` — extend existing migration with:
  - `category text`
  - `publication_status text` (`published` | `draft` | `coming_soon`)
  - `availability_status text`
  - `cover_image`, `card_image`
  - `display_order int`
  - `uses_illustrative_imagery boolean`
  - `video_url`, `video_poster`
  - `seo jsonb`

- `development_media` — matches `DevelopmentMedia` interface
- `unit_types` — matches `UnitType` interface
- `amenities` + `development_amenities` — optional normalization

## Repository swap

Implement `supabaseDevelopmentRepository.ts` with the same exports as:

`src/data/repositories/developmentRepository.ts`

Switch default export in `developments.ts` via env flag `VITE_CMS_SOURCE=supabase`.

## RLS

- Public `select` where `publication_status in ('published','coming_soon')`
- Admin `all` for authenticated admin role (existing pattern in `001_initial.sql`)

## Seed migration

Insert 10 default rows from `src/data/seed/developments.seed.ts` on first deploy.

Do **not** run SQL until product approves schema review.
