-- Run in Supabase SQL Editor after 002_full_cms.sql
-- Creates a helper to grant CMS admin by Auth email (SQL Editor / service role only).

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

revoke all on function public.cms_enroll_admin(text, text) from public;
revoke all on function public.cms_enroll_admin(text, text) from anon;
revoke all on function public.cms_enroll_admin(text, text) from authenticated;

grant execute on function public.cms_enroll_admin(text, text) to postgres;
grant execute on function public.cms_enroll_admin(text, text) to service_role;

-- SQL Editor runs as postgres and can still execute this function.

comment on function public.cms_enroll_admin is
  'Grant CMS admin by Auth email. Run only in SQL Editor (not from the browser anon key).';
