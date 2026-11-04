-- Homepage “Scroll the portfolio”: feature Sondris and Liv instead of Una Apartments.
update public.developments
set featured = false
where slug = 'una-apartments';

update public.developments
set featured = true,
    publication_status = 'published'
where slug = 'liv';

update public.developments
set featured = true
where slug = 'sondris';
