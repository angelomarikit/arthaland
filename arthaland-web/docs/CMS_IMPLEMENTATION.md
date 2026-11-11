# Supabase CMS implementation

## Owner checklist (before CMS works)

1. **Review** `supabase/migrations/002_full_cms.sql` (extends `001_initial.sql`).
2. **Run** `supabase/migrations/008_property_detail_cms.sql` after 002 when building the full property detail template (collections, certifications, nearby, specs columns, inquiry unit type). Confirm in SQL Editor before relying on new admin screens.
3. **Run** earlier scripts in Supabase SQL Editor (not executed by the agent).
4. **Create** Auth user (email/password) in Supabase Authentication.
5. **Enroll** admin (SQL Editor):
   - Run `supabase/migrations/003_cms_enroll_admin.sql` once.
   - Create Auth user under **Authentication → Users**.
   - Run `supabase/scripts/enroll-admin.sql` (edit email), or:
   ```sql
   select * from public.cms_enroll_admin('your-email@example.com', 'Site Admin');
   ```
6. Set **Vercel** (Preview + Production when ready):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Optional: `VITE_CMS_SOURCE=local` only if you explicitly want bundled seed data instead of the database.
7. Sign in at `/admin/login`. For LIV rollout steps see `docs/LIV_CMS_PUBLISH.md`.

## Security

- RLS + `cms_is_admin()` gate all writes and admin reads.
- Storage uploads require admin (storage.objects policies).
- No service role in frontend; no secrets in `cms_site_settings`.
- Public buckets: draft media URLs are guessable — use private buckets before confidential assets.

## Admin route map

| Route | Purpose |
|-------|---------|
| `/admin/login` | Supabase Auth |
| `/admin` | Dashboard stats |
| `/admin/pages` | Website pages |
| `/admin/pages/:slug` | Page sections list |
| `/admin/pages/:slug/sections/:sectionKey` | Section editor |
| `/admin/properties` | 10 developments |
| `/admin/properties/:slug` | Property overview + hero upload |
| `/admin/properties/:slug/sections/:sectionKey` | Property section editor |
| `/admin/properties/:slug/units` | Unit types + floor plans |
| `/admin/properties/:slug/media` | Gallery manager |
| `/admin/properties/:slug/amenities` | Amenities lists |
| `/admin/media` | Global media library |
| `/admin/inquiries` | Inquiry inbox |
| `/admin/team` | Team members |
| `/admin/settings` | Header/footer/social/SEO JSON |

## Upload flow

1. Client validates MIME/size.
2. Optional WebP conversion (images).
3. Storage upload to `developments/<uuid>/…/<uuid>.webp`.
4. `cms_media` INSERT — success toast only after DB insert succeeds.
5. Replace: update FKs first, delete old object if unreferenced.

## Public site

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (and `VITE_CMS_SOURCE` is not `local` / `false`), `/properties` and `/properties/:slug` load `published` / `coming_soon` rows from Postgres only — no silent fallback to bundled seed data. If the query fails, the UI shows an error banner. Unit types and floor-plan images come from `cms_unit_types` and `cms_media` (`placement = floor_plan`). Set `VITE_CMS_SOURCE=local` to force the old seed-data behavior for local demos.

### Uploads not showing on the live site

1. **Vercel env** — Same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as local; no `VITE_CMS_SOURCE=local`. Redeploy after changes (env is build-time).
2. **Admin → Dashboard** — “Public site data source” card must show CMS on.
3. **Property → Overview** — “Public site visibility” panel lists blockers (draft status, hero, unpublished media, collection traps).
4. **Hero** — Overview upload (`developments.hero_image`), not Media library alone.
5. **Gallery** — Media library; each row must be **Public** (`cms_media.published = true`).
6. **Collections** — Publish the collection or unassign media if images vanish from the gallery tab.


Inquiries unchanged: `development_slug` FK to `developments.slug`.

## Tests

```powershell
cd arthaland-web
npm run build
npm run lint
npm run preview
node scripts/screenshot-secondary-pages.mjs
```

Add `PREVIEW_URL` for deployed preview screenshots.
