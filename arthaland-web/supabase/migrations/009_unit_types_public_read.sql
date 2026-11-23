-- Align public unit-type RLS with admin "Coming soon" + fix legacy rows without publication_status.
-- Run once in Supabase SQL Editor after 002 / 008.

drop policy if exists "Public read published unit types" on public.cms_unit_types;

create policy "Public read published unit types"
  on public.cms_unit_types for select
  to anon, authenticated
  using (
  (
    publication_status in ('published', 'coming_soon')
    or publication_status is null
  )
  and exists (
    select 1 from public.developments d
    where d.slug = cms_unit_types.development_slug
      and d.publication_status in ('published', 'coming_soon')
  )
);

-- Backfill: units created before publication_status was set should show when floor plans exist.
update public.cms_unit_types
set publication_status = 'published'
where publication_status is null;