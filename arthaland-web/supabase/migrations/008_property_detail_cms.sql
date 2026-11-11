-- Property detail CMS expansion — run manually in Supabase SQL Editor AFTER 002_full_cms.sql.
-- Non-destructive: adds columns and tables only. Confirm success before deploying app changes that depend on them.

-- -----------------------------------------------------------------------------
-- developments: hero, specs, location, video source, archived status
-- -----------------------------------------------------------------------------
alter table public.developments
  add column if not exists hero_subtitle text,
  add column if not exists total_stories text,
  add column if not exists total_units text,
  add column if not exists completion_date date,
  add column if not exists developer_name text,
  add column if not exists map_lat numeric(10, 7),
  add column if not exists map_lng numeric(10, 7),
  add column if not exists map_url text,
  add column if not exists directions_url text,
  add column if not exists overview_media_id uuid,
  add column if not exists video_source text default 'upload'
    check (video_source is null or video_source in ('upload', 'external'));

-- Allow archived publication (hide from portfolio, visible in admin)
alter table public.developments drop constraint if exists developments_publication_status_check;
alter table public.developments
  add constraint developments_publication_status_check
  check (
    publication_status is null
    or publication_status in ('published', 'draft', 'coming_soon', 'archived')
  );

-- FK overview image (cms_media row may be added after column exists)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'developments_overview_media_id_fkey'
  ) then
    alter table public.developments
      add constraint developments_overview_media_id_fkey
      foreign key (overview_media_id) references public.cms_media (id) on delete set null;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Gallery collections
-- -----------------------------------------------------------------------------
create table if not exists public.cms_gallery_collections (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references public.developments (id) on delete cascade,
  development_slug text not null references public.developments (slug) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  display_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (development_slug, slug)
);

create index if not exists cms_gallery_collections_slug_idx
  on public.cms_gallery_collections (development_slug, display_order);

alter table public.cms_gallery_collections enable row level security;

create policy "Public read published gallery collections"
  on public.cms_gallery_collections for select
  to anon, authenticated
  using (
    published = true
    and exists (
      select 1 from public.developments d
      where d.slug = cms_gallery_collections.development_slug
        and d.publication_status in ('published', 'coming_soon')
    )
  );

create policy "Admins manage gallery collections"
  on public.cms_gallery_collections for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- Link cms_media to a collection (optional; null = legacy flat gallery)
alter table public.cms_media
  add column if not exists gallery_collection_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'cms_media_gallery_collection_id_fkey'
  ) then
    alter table public.cms_media
      add constraint cms_media_gallery_collection_id_fkey
      foreign key (gallery_collection_id) references public.cms_gallery_collections (id) on delete set null;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Per-property sustainability certifications
-- -----------------------------------------------------------------------------
create table if not exists public.cms_development_certifications (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references public.developments (id) on delete cascade,
  development_slug text not null references public.developments (slug) on delete cascade,
  name text not null,
  status text not null default 'targeted'
    check (status in ('registered', 'on_track', 'targeted', 'certified')),
  logo_media_id uuid references public.cms_media (id) on delete set null,
  display_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_development_certifications_slug_idx
  on public.cms_development_certifications (development_slug, display_order);

alter table public.cms_development_certifications enable row level security;

create policy "Public read published dev certifications"
  on public.cms_development_certifications for select
  to anon, authenticated
  using (
    published = true
    and exists (
      select 1 from public.developments d
      where d.slug = cms_development_certifications.development_slug
        and d.publication_status in ('published', 'coming_soon')
    )
  );

create policy "Admins manage dev certifications"
  on public.cms_development_certifications for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Nearby establishments
-- -----------------------------------------------------------------------------
create table if not exists public.cms_development_nearby_places (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references public.developments (id) on delete cascade,
  development_slug text not null references public.developments (slug) on delete cascade,
  category text not null default 'other'
    check (
      category in (
        'schools',
        'shopping',
        'healthcare',
        'parks',
        'transport',
        'business',
        'dining',
        'other'
      )
    ),
  name text not null,
  distance_label text,
  notes text,
  display_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_development_nearby_slug_idx
  on public.cms_development_nearby_places (development_slug, display_order);

alter table public.cms_development_nearby_places enable row level security;

create policy "Public read published nearby places"
  on public.cms_development_nearby_places for select
  to anon, authenticated
  using (
    published = true
    and exists (
      select 1 from public.developments d
      where d.slug = cms_development_nearby_places.development_slug
        and d.publication_status in ('published', 'coming_soon')
    )
  );

create policy "Admins manage nearby places"
  on public.cms_development_nearby_places for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Unit types: richer layouts
-- -----------------------------------------------------------------------------
alter table public.cms_unit_types
  add column if not exists description text,
  add column if not exists features text[] default '{}',
  add column if not exists tab_group text default 'custom'
    check (
      tab_group is null
      or tab_group in ('studio', 'one_bedroom', 'two_bedroom', 'three_bedroom', 'custom')
    ),
  add column if not exists brochure_url text,
  add column if not exists price_note text;

-- -----------------------------------------------------------------------------
-- Inquiries: optional unit type interest
-- -----------------------------------------------------------------------------
alter table public.inquiries
  add column if not exists unit_type_id uuid,
  add column if not exists unit_type_name text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'inquiries_unit_type_id_fkey'
  ) then
    alter table public.inquiries
      add constraint inquiries_unit_type_id_fkey
      foreign key (unit_type_id) references public.cms_unit_types (id) on delete set null;
  end if;
end $$;

-- Portfolio read policy: exclude archived from public (recreate policy name from 002)
drop policy if exists "Public read portfolio developments" on public.developments;
create policy "Public read portfolio developments"
  on public.developments for select
  to anon, authenticated
  using (
  publication_status in ('published', 'coming_soon')
  or (published = true and publication_status is null)
  );

-- Default gallery collection shells (empty titles for client to fill) — optional uncomment:
-- insert into public.cms_gallery_collections (development_id, development_slug, slug, title, display_order, published)
-- select d.id, d.slug, c.slug, c.title, c.ord, false
-- from public.developments d
-- cross join (
--   values
--     ('facade', 'Facade & exterior', 1),
--     ('amenities', 'Amenities', 2),
--     ('lobby', 'Lobby & common areas', 3),
--     ('units', 'Unit renderings', 4),
--     ('construction', 'Construction updates', 5)
-- ) as c(slug, title, ord)
-- on conflict (development_slug, slug) do nothing;
