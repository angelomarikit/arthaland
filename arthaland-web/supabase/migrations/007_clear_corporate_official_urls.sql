-- Remove links to the corporate arthaland.com site from development records.
update public.developments
set official_url = null,
    updated_at = now()
where official_url ilike 'https://arthaland.com%'
   or official_url ilike 'http://arthaland.com%'
   or official_url ilike 'https://www.arthaland.com%';
