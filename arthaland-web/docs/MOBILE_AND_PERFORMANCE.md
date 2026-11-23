# Mobile & performance

## Mobile (already in the build)

| Area | Behavior |
|------|----------|
| Viewport | `width=device-width`, `viewport-fit=cover` (notched phones) |
| Layout | Tailwind breakpoints (`sm` / `md` / `lg`); fluid type via `clamp()` |
| Navigation | Full primary nav from `lg`; hamburger + slide-in menu below |
| Hero | Separate **mobile** and **desktop** video sources; poster fallback |
| Touch | 44px+ tap targets on menu/CTA; horizontal scroll with snap on amenity cards |
| Overflow | `overflow-x: clip` on `html` / `body` to prevent sideways scroll |
| Safe areas | Section padding + Help widget respect `env(safe-area-inset-*)` |

### Quick mobile QA (after deploy)

1. iPhone/Android — home, property page, featured unit, contact form.
2. Open/close mobile menu; scroll gallery and amenities carousel.
3. Help widget — open FAQ/contact; confirm it does not cover the main CTA.
4. Rotate to landscape on property gallery lightbox.

## Performance (already in the build)

| Technique | Where |
|-----------|--------|
| Route code-splitting | `React.lazy` for all `/admin/*` and secondary marketing pages |
| Vendor chunks | React, Supabase, GSAP/Motion, Lucide split in `vite.config.ts` |
| Hero | Poster preload in `index.html`; video `preload="metadata"`; pause when off-screen |
| Images | `loading="lazy"` on below-fold CMS/gallery images; WebP on admin upload |
| Fonts | Fontshare `display=swap` + `preconnect` |
| CDN caching | Vercel `Cache-Control` for `/assets/*` (1y) and static images (7d) |

### What affects live speed most

1. **CMS images** — large originals from Supabase; keep uploads under ~2MB when possible (admin converts to WebP).
2. **Hero video** — use the dedicated **mobile** file in Homepage admin (smaller bitrate/shorter).
3. **Vercel region** — deploy close to PH audience when possible.
4. **Meta Pixel** — small extra script on every page (required for ads).

### Measuring after deploy

- [PageSpeed Insights](https://pagespeed.web.dev/) — test `https://your-domain/` and a property URL on **Mobile**.
- Chrome DevTools → Network → throttle **Fast 3G** for a reality check.
- Target: LCP &lt; 2.5s on mobile where hero poster/video are optimized.

### Not automatic (your hosting)

- Supabase Storage does not resize images; use reasonably sized source files before upload.
- Third-party embeds (Google Maps) load only on property Location sections.