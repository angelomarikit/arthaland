-- Featured unit marketplace (admin-managed listings)
-- Run after 002_full_cms.sql

create table if not exists public.featured_units (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  development_name text not null,
  location text not null default '',
  unit_label text not null default '',
  price_label text not null default 'Price upon request',
  area_sqm numeric,
  bedrooms text,
  bathrooms text,
  floor text,
  description text not null default '',
  highlights text[] not null default '{}',
  hero_image text,
  gallery text[] not null default '{}',
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold')),
  published boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.featured_units enable row level security;

create policy "Public read published featured units"
  on public.featured_units for select to anon, authenticated
  using (published = true and status <> 'sold');

create policy "Admins manage featured units"
  on public.featured_units for all to authenticated
  using (public.cms_is_admin()) with check (public.cms_is_admin());

insert into public.cms_pages (slug, title, published, display_order)
values ('featured-units', 'Featured Units', true, 6)
on conflict (slug) do nothing;
