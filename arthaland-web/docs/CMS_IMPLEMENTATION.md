# Supabase CMS implementation

## Owner checklist (before CMS works)

1. **Review** `supabase/migrations/002_full_cms.sql` (extends `001_initial.sql`).
2. **Run** the script in Supabase SQL Editor (not executed by the agent).
3. **Create** Auth user (email/password) in Supabase Authentication.
4. **Enroll** admin (SQL Editor):
   - Run `supabase/migrations/003_cms_enroll_admin.sql` once.
   - Create Auth user under **Authentication → Users**.
   - Run `supabase/scripts/enroll-admin.sql` (edit email), or:
   ```sql
   select * from public.cms_enroll_admin('your-email@example.com', 'Site Admin');
   ```
5. Set **Vercel** (Preview + Production when ready):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CMS_SOURCE=supabase`
6. Sign in at `/admin/login`.

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

With `VITE_CMS_SOURCE=supabase`, `/properties` and `/properties/:slug` load published/coming_soon rows from Postgres. Empty/error → local seed fallback with banner.

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
