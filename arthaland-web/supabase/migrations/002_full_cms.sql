-- ARTHALAND CMS — run manually in Supabase SQL Editor AFTER reviewing.
-- Preserves: public.developments, public.inquiries, public.site_content from 001_initial.sql
-- Does NOT drop existing data. Adds columns/tables, RLS, storage policies, seed slugs.

-- =============================================================================
-- REVIEW BEFORE RUNNING
-- 1) Backup project (Supabase Dashboard → Database → Backups).
-- 2) Confirm 001_initial.sql already applied (developments, inquiries, site_content exist).
-- 3) Create Supabase Auth user(s) AFTER this script; enroll each in cms_admin_users.
-- 4) Buckets arthaland-images / arthaland-videos are created here as PUBLIC read —
--    draft URLs are guessable; use private buckets + signed URLs before confidential assets.
-- 5) Service role key must NEVER ship in Vite; browser uses anon key only.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Admin membership (authoritative; no client can self-promote)
-- -----------------------------------------------------------------------------
create table if not exists public.cms_admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.cms_admin_users enable row level security;

create or replace function public.cms_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cms_admin_users a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.cms_is_admin() from public;
grant execute on function public.cms_is_admin() to authenticated, anon;

create policy "Admins read admin roster"
  on public.cms_admin_users for select
  to authenticated
  using (public.cms_is_admin());

create policy "No client insert admin roster"
  on public.cms_admin_users for insert
  to authenticated
  with check (false);

-- Enroll first admin (replace UUID after creating Auth user):
-- insert into public.cms_admin_users (user_id, email, display_name)
-- values ('YOUR-AUTH-USER-UUID', 'you@company.com', 'Site Admin');

-- -----------------------------------------------------------------------------
-- Extend developments (keep legacy columns for inquiry FK + backward compat)
-- -----------------------------------------------------------------------------
alter table public.developments
  add column if not exists category text,
  add column if not exists property_type text,
  add column if not exists publication_status text default 'draft',
  add column if not exists availability_status text,
  add column if not exists short_description text,
  add column if not exists full_description text,
  add column if not exists cover_image text,
  add column if not exists card_image text,
  add column if not exists display_order int default 0,
  add column if not exists uses_illustrative_imagery boolean default false,
  add column if not exists video_url text,
  add column if not exists video_poster text,
  add column if not exists seo jsonb default '{}'::jsonb,
  add column if not exists source_note text,
  add column if not exists cover_media_id uuid,
  add column if not exists hero_media_id uuid;

-- Sync legacy published flag → publication_status where unset
update public.developments
set publication_status = case when published = true then 'published' else 'draft' end
where publication_status is null or publication_status = 'draft' and published = true;

update public.developments
set short_description = coalesce(short_description, summary),
    full_description = coalesce(full_description, overview),
    availability_status = coalesce(availability_status, status),
    property_type = coalesce(property_type, type),
    card_image = coalesce(card_image, hero_image),
    cover_image = coalesce(cover_image, hero_image)
where true;

-- Drop old public policy; replace with publication_status aware policy
drop policy if exists "Public read published developments" on public.developments;

create policy "Public read portfolio developments"
  on public.developments for select
  to anon, authenticated
  using (
    publication_status in ('published', 'coming_soon')
    or (published = true and publication_status is null)
  );

create policy "Admins manage developments"
  on public.developments for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- Admin read all inquiries; public insert unchanged
drop policy if exists "Public insert inquiries" on public.inquiries;
create policy "Public insert inquiries"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create policy "Admins read inquiries"
  on public.inquiries for select
  to authenticated
  using (public.cms_is_admin());

create policy "Admins update inquiries"
  on public.inquiries for update
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- site_content: public read; admin write
drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "Admins manage site content"
  on public.site_content for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- CMS media metadata (Storage objects live in buckets; this is the source of truth)
-- -----------------------------------------------------------------------------
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null check (bucket_id in ('arthaland-images', 'arthaland-videos')),
  storage_path text not null unique,
  media_kind text not null check (media_kind in ('image', 'video')),
  mime_type text,
  byte_size bigint,
  width int,
  height int,
  alt_text text default '',
  caption text,
  focal_x numeric(5,4),
  focal_y numeric(5,4),
  published boolean not null default false,
  display_order int not null default 0,
  development_id uuid references public.developments (id) on delete set null,
  development_slug text references public.developments (slug) on delete set null,
  unit_type_id uuid,
  page_id uuid,
  page_section_id uuid,
  placement text,
  is_cover boolean not null default false,
  is_illustrative boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_media_development_slug_idx on public.cms_media (development_slug);
create index if not exists cms_media_page_section_idx on public.cms_media (page_section_id);

alter table public.cms_media enable row level security;

create policy "Public read published cms_media"
  on public.cms_media for select
  to anon, authenticated
  using (published = true);

create policy "Admins manage cms_media"
  on public.cms_media for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Property sections (structured JSONB per section_key)
-- -----------------------------------------------------------------------------
create table if not exists public.cms_development_sections (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references public.developments (id) on delete cascade,
  development_slug text not null references public.developments (slug) on delete cascade,
  section_key text not null,
  section_type text not null,
  content jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  display_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (development_slug, section_key)
);

alter table public.cms_development_sections enable row level security;

create policy "Public read published dev sections"
  on public.cms_development_sections for select
  to anon, authenticated
  using (
    published = true
    and exists (
      select 1 from public.developments d
      where d.slug = cms_development_sections.development_slug
        and d.publication_status in ('published', 'coming_soon')
    )
  );

create policy "Admins manage dev sections"
  on public.cms_development_sections for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Unit types
-- -----------------------------------------------------------------------------
create table if not exists public.cms_unit_types (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references public.developments (id) on delete cascade,
  development_slug text not null references public.developments (slug) on delete cascade,
  name text not null,
  area_min numeric,
  area_max numeric,
  bedrooms text,
  bathrooms text,
  publication_status text not null default 'draft'
    check (publication_status in ('published', 'draft', 'coming_soon')),
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_unit_types enable row level security;

create policy "Public read published unit types"
  on public.cms_unit_types for select
  to anon, authenticated
  using (
    publication_status = 'published'
    and exists (
      select 1 from public.developments d
      where d.slug = cms_unit_types.development_slug
        and d.publication_status in ('published', 'coming_soon')
    )
  );

create policy "Admins manage unit types"
  on public.cms_unit_types for all
  to authenticated
  using (public.cms_is_admin())
  with check (public.cms_is_admin());

alter table public.cms_media
  add constraint cms_media_unit_type_fkey
  foreign key (unit_type_id) references public.cms_unit_types (id) on delete set null;

-- -----------------------------------------------------------------------------
-- Amenities
-- -----------------------------------------------------------------------------
create table if not exists public.cms_amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  media_id uuid references public.cms_media (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_development_amenities (
  development_id uuid not null references public.developments (id) on delete cascade,
  amenity_id uuid not null references public.cms_amenities (id) on delete cascade,
  description text,
  display_order int not null default 0,
  primary key (development_id, amenity_id)
);

alter table public.cms_amenities enable row level security;
alter table public.cms_development_amenities enable row level security;

create policy "Public read amenities"
  on public.cms_amenities for select to anon, authenticated using (true);

create policy "Admins manage amenities"
  on public.cms_amenities for all to authenticated
  using (public.cms_is_admin()) with check (public.cms_is_admin());

create policy "Public read dev amenities join"
  on public.cms_development_amenities for select to anon, authenticated using (true);

create policy "Admins manage dev amenities"
  on public.cms_development_amenities for all to authenticated
  using (public.cms_is_admin()) with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Website pages & sections
-- -----------------------------------------------------------------------------
create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  published boolean not null default false,
  seo jsonb default '{}'::jsonb,
  display_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages (id) on delete cascade,
  page_slug text not null,
  section_key text not null,
  section_type text not null,
  content jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  display_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

alter table public.cms_media
  add constraint cms_media_page_fkey foreign key (page_id) references public.cms_pages (id) on delete set null;

alter table public.cms_media
  add constraint cms_media_page_section_fkey foreign key (page_section_id) references public.cms_page_sections (id) on delete set null;

alter table public.cms_pages enable row level security;
alter table public.cms_page_sections enable row level security;

create policy "Public read published pages"
  on public.cms_pages for select to anon, authenticated using (published = true);

create policy "Admins manage pages"
  on public.cms_pages for all to authenticated
  using (public.cms_is_admin()) with check (public.cms_is_admin());

create policy "Public read published page sections"
  on public.cms_page_sections for select to anon, authenticated
  using (
    published = true
    and exists (select 1 from public.cms_pages p where p.id = page_id and p.published = true)
  );

create policy "Admins manage page sections"
  on public.cms_page_sections for all to authenticated
  using (public.cms_is_admin()) with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Team + non-secret settings
-- -----------------------------------------------------------------------------
create table if not exists public.cms_team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_media_id uuid references public.cms_media (id) on delete set null,
  display_order int not null default 0,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cms_team_members enable row level security;
alter table public.cms_site_settings enable row level security;

create policy "Public read published team"
  on public.cms_team_members for select to anon, authenticated using (published = true);

create policy "Admins manage team"
  on public.cms_team_members for all to authenticated
  using (public.cms_is_admin()) with check (public.cms_is_admin());

create policy "Public read site settings"
  on public.cms_site_settings for select to anon, authenticated using (true);

create policy "Admins manage site settings"
  on public.cms_site_settings for all to authenticated
  using (public.cms_is_admin()) with check (public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Storage buckets (15 MB images, 100 MB videos — also enforce in app)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'arthaland-images',
    'arthaland-images',
    true,
    15728640,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
  ),
  (
    'arthaland-videos',
    'arthaland-videos',
    true,
    104857600,
    array['video/mp4', 'video/webm', 'video/quicktime']
  )
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read arthaland-images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'arthaland-images');

create policy "Admins upload arthaland-images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'arthaland-images' and public.cms_is_admin());

create policy "Admins update arthaland-images"
  on storage.objects for update to authenticated
  using (bucket_id = 'arthaland-images' and public.cms_is_admin());

create policy "Admins delete arthaland-images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'arthaland-images' and public.cms_is_admin());

create policy "Public read arthaland-videos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'arthaland-videos');

create policy "Admins upload arthaland-videos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'arthaland-videos' and public.cms_is_admin());

create policy "Admins update arthaland-videos"
  on storage.objects for update to authenticated
  using (bucket_id = 'arthaland-videos' and public.cms_is_admin());

create policy "Admins delete arthaland-videos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'arthaland-videos' and public.cms_is_admin());

-- -----------------------------------------------------------------------------
-- Default 10 developments (slug-stable; do not duplicate)
-- -----------------------------------------------------------------------------
insert into public.developments (slug, name, location, region, type, status, price_label, published, publication_status, display_order)
values
  ('eluria', 'Eluria', 'Legazpi Village, Makati City', 'Metro Manila', 'Residential Condominium', 'Pre-Selling', 'Price Upon Request', true, 'published', 1),
  ('una-apartments', 'Una Apartments', 'Sevina Park, Biñan, Laguna', 'Laguna', 'Apartment', 'Under Construction', 'From ₱5.8M (per official site)', true, 'published', 2),
  ('liv', 'Liv', 'Katipunan, Quezon City', 'Metro Manila', 'Residential Condominium', 'Pre-Selling', 'Price Upon Request', false, 'coming_soon', 3),
  ('lucima', 'Lucima', 'Muntinlupa', 'Metro Manila', 'Residential Condominium', 'Completed', 'Price Upon Request', true, 'published', 4),
  ('savya-financial-center', 'Savya Financial Center', 'Taguig', 'Metro Manila', 'Commercial Office', 'Inquire for Availability', 'Price Upon Request', false, 'draft', 5),
  ('sevina-park', 'Sevina Park', 'Biñan, Laguna', 'Laguna', 'Mixed-Use', 'Under Construction', 'Price Upon Request', false, 'coming_soon', 6),
  ('sondris', 'Sondris', 'Muntinlupa', 'Metro Manila', 'Residential Condominium', 'Completed', 'Price Upon Request', true, 'published', 7),
  ('cebu-exchange', 'Cebu Exchange', 'Cebu Business Park, Cebu City', 'Cebu', 'Commercial Office', 'Completed', 'Price Upon Request', false, 'draft', 8),
  ('century-pacific-tower', 'Arthaland Century Pacific Tower', 'Taguig', 'Metro Manila', 'Commercial Office', 'Completed', 'Price Upon Request', false, 'draft', 9),
  ('arya-residences', 'Arya Residences', 'Bonifacio Global City, Taguig', 'Metro Manila', 'Residential Condominium', 'Completed', 'Price Upon Request', false, 'draft', 10)
on conflict (slug) do nothing;

-- Default website pages
insert into public.cms_pages (slug, title, published, display_order)
values
  ('home', 'Home', true, 1),
  ('about', 'About Us', true, 2),
  ('services', 'Services', true, 3),
  ('contact', 'Contact', true, 4),
  ('team', 'Our Team', true, 5)
on conflict (slug) do nothing;

-- Property section shells for each development slug
insert into public.cms_development_sections (development_id, development_slug, section_key, section_type, display_order, published)
select d.id, d.slug, s.section_key, s.section_type, s.display_order, false
from public.developments d
cross join (
  values
    ('hero', 'hero', 1),
    ('overview', 'richtext', 2),
    ('highlights', 'list', 3),
    ('residences', 'richtext', 4),
    ('gallery', 'gallery', 5),
    ('amenities', 'amenities', 6),
    ('sustainability', 'list', 7),
    ('location', 'location', 8),
    ('video', 'video', 9),
    ('inquiry-cta', 'cta', 10)
) as s(section_key, section_type, display_order)
on conflict (development_slug, section_key) do nothing;
