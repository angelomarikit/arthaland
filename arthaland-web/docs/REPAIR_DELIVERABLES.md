# Audit repair deliverables

**Branch:** `fix/audit-repair` (pushed to GitHub — **preview only**, not merged to production)  
**PR:** https://github.com/angelomarikit/arthaland/pull/new/fix/audit-repair  
**Local preview verification:** `http://127.0.0.1:4174` (after `npm run build && npm run preview`)

## 1. Fixed code (high level)

| Area | Change |
|------|--------|
| Routing | `vercel.json` SPA rewrite to `index.html` |
| Scroll blackout | Removed GSAP pin; native horizontal scroll-snap gallery in `FeaturedHorizontalShowcase.tsx` |
| Media | Unpublished `liv`, `sevina-park`; Sondris WebP; unique `sectionImages.ts` |
| Sustainability mobile | Lucima photo + eager load |
| Hero | Lucima facade I2V, v6 assets, scroll cue polish |
| Perf | Poster preload in `index.html`, lighter Sondris asset |

## 2. New hero video

- Raw: `public/assets/hero/source/higgsfield-lucima-hero-raw.mp4`
- Desktop/mobile: `arthaland-hero-desktop.mp4`, `arthaland-hero-mobile.mp4`
- Poster: `arthaland-hero-poster.webp`
- Log: `docs/HERO_GENERATION_LOG.md` (**56 credits**)

## 3. Asset inventory

`docs/REPAIR_ASSET_INVENTORY.md`

## 4. Before / after evidence

| Defect | Before | After |
|--------|--------|-------|
| Route 404 | `arthaland-audit/desktop/properties-1440x900.png` | Playwright: all routes `status=200`, no Vercel 404 text |
| Scroll blackout | `arthaland-audit/animation/home-scroll-2400-1440x900.png` | `arthaland-repair-verify/home-scroll-2400-after.png` |
| Featured gallery | Black viewport | Cards visible (Eluria / Una / Lucima) |

## 5. Playwright results

```
PREVIEW_URL=http://127.0.0.1:4174 node scripts/verify-repair.mjs
→ 24/24 PASS (see arthaland-repair-verify/results.json)
```

Re-run against **Vercel preview URL** after opening the PR:

```powershell
$env:PREVIEW_URL="https://your-preview.vercel.app"
node scripts/verify-repair.mjs
```

## 6. Lighthouse

- **Before (production):** Performance 82, LCP ~3.1s — `arthaland-audit/performance/summary.md`
- **After (local preview):** Not comparable to production (localhost throttling). Re-run on Vercel preview:

```powershell
npx lighthouse $env:PREVIEW_URL --form-factor=mobile --only-categories=performance,accessibility
```

## 7. Remaining issues

1. **Eluria listing/detail** still uses hospitality brochure PNG (no authorized exterior in repo).
2. **Liv** and **Sevina Park** unpublished until real photography is supplied.
3. **Hero MP4** desktop encode ~6.8 MB — monitor LCP on preview; consider further CRF/size tuning if Lighthouse regresses.
4. **GitHub CLI** not authenticated here — create PR manually for Vercel preview deployment.

## 8. Do not merge to production

Review preview screenshots, hero loop in browser, and Playwright/Lighthouse on the preview URL before merging `fix/audit-repair` → `main`.
