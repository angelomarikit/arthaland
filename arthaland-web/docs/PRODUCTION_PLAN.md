# ARTHALAND production plan (execution status)

## Completed

1. **MCP verified** — Framer (Avenlo remix audit), Higgsfield (balance, import, video; hero pivoted to ffmpeg for photo fidelity).
2. **Real assets** — Official photos under `public/assets/properties/*` and hero storyboard sources; ~15s hero at `public/assets/hero/hero-desktop.mp4`.
3. **App shell** — Avenlo tokens, layout, cinematic hero, lazy routes, verified `developments.ts` catalog.
4. **Public pages** — Home (discovery bar, featured devs, sustainability stats, FAQ, inquiry CTA), About, Properties (+ filters), Property detail, Services, Team, Contact (Supabase-ready), Privacy stub, 404.
5. **Admin** — Login + dashboard shells; SQL in `supabase/migrations/001_initial.sql`.
6. **Build** — `npm run build` succeeds with code splitting.

## Next (priority order)

1. Run Supabase migration; set `VITE_SUPABASE_*`; implement auth + admin CRUD.
2. Avenlo visual QA at 390 / 768 / 1440 — adjust spacing, mobile nav, hero crop.
3. `hero-mobile.mp4`, WebM, poster WebP; lazy image optimization pipeline.
4. Optional Higgsfield I2V for About/Properties banners (review against source photos; ~500 cr cap).
5. Authorized Sevina assets + team photos + sales email.
6. Lighthouse + accessibility pass; per-page SEO (react-helmet or similar).

See `docs/ISSUE_REPORT.md` for blockers.
