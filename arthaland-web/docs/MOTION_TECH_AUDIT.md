# Motion tech audit (pre-overhaul)

**Stack:** React 19, Vite 8, Tailwind v4, React Router 7, Motion 14, Supabase client.

**Working (preserve):**
- Routes + lazy pages, `developments.ts` catalog, property filters, inquiry form + Supabase fallback
- Hero MP4 from official photography (`hero-desktop.mp4`), property images under `public/assets/`
- Avenlo tokens in `index.css`, layout components, admin shells + SQL migration

**Gaps (addressed in overhaul):**
- Only lightweight Motion fade-ups on hero; no scroll-linked storytelling
- Homepage reads as stacked static sections (accordion services, generic grid)
- No smooth scroll / ScrollTrigger; no shared motion tokens or cleanup on route change
- Header does not react to scroll; cards lack signature interactions
- About / property detail lack brochure-style composition

**Libraries added:** `gsap`, `@gsap/react`, `lenis` (GSAP Standard license + Lenis MIT — no Club SplitText).

**Strategy:** Lenis on desktop only; GSAP ScrollTrigger primary; Motion retained for micro UI; `matchMedia` + `prefers-reduced-motion` for mobile/reduced paths.
