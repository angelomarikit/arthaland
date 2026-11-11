# LIV — publish via CMS (manual checklist)

Run `supabase/migrations/008_property_detail_cms.sql` in Supabase **before** using the new admin screens.

## 1. Migration

- Confirm new columns on `developments` and tables (`cms_gallery_collections`, `cms_development_certifications`, `cms_development_nearby_places`) exist.

## 2. Admin — LIV (`slug: liv`)

Use copy from `src/data/seed/developments.seed.ts` as a **reference only** (paste into admin; do not rely on seed on production when Supabase is enabled).

| Screen | Action |
|--------|--------|
| Overview | Hero image, `hero_subtitle`, descriptions, `publication_status: published` |
| Specifications | Stories, units, completion, developer, overview image |
| Certifications | Add rows + logo uploads, publish each |
| Location | Lat/lng, map image or URL, directions link |
| Nearby | CRUD + publish |
| Gallery collections | Create collections, assign media from Media library |
| Units | Tab groups, descriptions, floor plans, renders |
| Video | Upload MP4 or external URL |
| SEO | JSON title/description if needed |

## 3. Public verification

- Open `/properties/liv` with `VITE_SUPABASE_*` set (no `VITE_CMS_SOURCE=local`).
- Section order: hero → overview → certifications → location → nearby → amenities → gallery → units → **video** → inquiry → related.
- Submit on-page inquiry; confirm row in Admin → Inquiries with `development_slug=liv` and optional unit type.
- No bundled seed images when CMS is enabled (empty sections show “Content will be published when available”).

## 4. Build

```powershell
cd arthaland-web
npm run build
npm run lint
```
