-- Run manually in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.developments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text not null,
  region text not null,
  type text not null,
  status text not null,
  price_label text not null,
  bedrooms_range text,
  area_range text,
  featured boolean default false,
  published boolean default false,
  hero_image text,
  gallery jsonb default '[]'::jsonb,
  summary text,
  overview text,
  amenities jsonb default '[]'::jsonb,
  sustainability jsonb default '[]'::jsonb,
  official_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  development_slug text references public.developments(slug),
  message text not null,
  viewing_requested boolean default false,
  source text default 'website',
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.developments enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_content enable row level security;

create policy "Public read published developments"
  on public.developments for select
  using (published = true);

create policy "Public insert inquiries"
  on public.inquiries for insert
  with check (true);

create policy "Public read site content"
  on public.site_content for select
  using (true);

-- Admin policies: attach authenticated role with service role in dashboard
-- Example (adjust role claims):
-- create policy "Admin all developments" on public.developments for all
--   using (auth.jwt() ->> 'role' = 'admin');
