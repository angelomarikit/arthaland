-- Align availability with RFO on property detail pages (turnover copy is in app config).
update public.developments
set availability_status = 'Completed',
    updated_at = now()
where slug in ('eluria', 'sevina-park');
