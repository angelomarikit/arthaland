-- =============================================================================
-- ARTHALAND — Create CMS admin in Supabase SQL Editor
-- Run this ENTIRE file (or run Part 1 then Part 2 separately).
-- Requires: 002_full_cms.sql already applied + Auth user created in Dashboard.
-- =============================================================================

-- Part 1 — Create helper (skip if you already ran 003_cms_enroll_admin.sql)
create or replace function public.cms_enroll_admin(
  p_email text,
  p_display_name text default null
)
returns table (user_id uuid, email text, display_name text)
language plpgsql
security definer
set search_path = public, auth
as $$
#variable_conflict use_column
declare
  v_uid uuid;
  v_email text := lower(trim(p_email));
  v_name text := nullif(trim(p_display_name), '');
begin
  if v_email is null or v_email = '' then
    raise exception 'Email is required';
  end if;

  select u.id into v_uid
  from auth.users u
  where lower(u.email) = v_email
  limit 1;

  if v_uid is null then
    raise exception 'No Supabase Auth user for %. Create the user under Authentication → Users first.', v_email;
  end if;

  insert into public.cms_admin_users as a (user_id, email, display_name)
  values (v_uid, v_email, coalesce(v_name, split_part(v_email, '@', 1)))
  on conflict (user_id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, a.display_name);

  return query
  select a.user_id, a.email, a.display_name
  from public.cms_admin_users a
  where a.user_id = v_uid;
end;
$$;

-- Part 2 — Enroll (edit email if needed; explicit ::text avoids "unknown" errors)
select * from public.cms_enroll_admin(
  'admin@arthaland.com'::text,
  'Site Admin'::text
);

-- Part 3 — Verify
select * from public.cms_admin_users;

-- =============================================================================
-- If Part 1 fails (table missing), run supabase/migrations/002_full_cms.sql first.
--
-- If you prefer NO function, use this single statement instead of Part 2:
--
-- insert into public.cms_admin_users (user_id, email, display_name)
-- select u.id, lower(u.email), 'Site Admin'
-- from auth.users u
-- where lower(u.email) = lower('admin@arthaland.com')
-- on conflict (user_id) do update
--   set email = excluded.email,
--       display_name = excluded.display_name;
-- =============================================================================
