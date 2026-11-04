# Avenlo Reference Audit (ARTHALAND)

Source: Framer MCP project **Avenlo (copy)** (`u17dHONq3CoHZh18Jvcu-9RMym`) + live site https://avenlo.framer.website/

## Framer MCP verification

| Capability | Tool | Status |
|------------|------|--------|
| Open remixed project | `open_project` | OK — session on `u17dHONq3CoHZh18Jvcu` |
| Page inventory | `exec` + `tree.getNodesOfTypes('WebPageNode')` | OK — 14 pages |
| Section structure | `tree.serialize`, desktop breakpoint children | OK |
| Color / text tokens | `ColorStyleTokenNode`, `TextStylePresetNode` | OK — 14 colors, 41 text presets |
| CMS schema | `CollectionNode` variables | OK — Properties, Agents, (+ truncated Services/Journal) |
| Components | `api.components.list()` | OK — Navigation, Button, etc. |
| Screenshots | `tree.screenshot` | Available (not run in Phase 1–2) |
| Published URL fetch | `api.screenshot(url)` | Available |

Layout template: **Main Layout** (`RBB1JPCIB`).

## Breakpoints (Framer)

| Name | Media query | Canvas width |
|------|-------------|--------------|
| Desktop | `(min-width: 1200px)` | 1200px |
| Tablet | `(min-width: 810px) and (max-width: 1199.98px)` | 810px |
| Phone | `(max-width: 809.98px)` | 390px |

## Typography

- **Font families (project):** Switzer (primary), Inter (secondary)
- **Display scale (light weight):** XL 121px / L 94px / M 64px — weight 300, tight negative tracking
- **Headings:** 64–20px, weight 500
- **Body:** 20px L, 16px M (default), 14px S — weight 400
- **UI:** Nav 14px/500, Eyebrow 14px/400, Button 14px/500

## Color tokens

| Token | RGB |
|-------|-----|
| Ink | rgb(18, 18, 18) |
| Ink Soft | rgb(30, 30, 30) |
| Surface | rgb(255, 255, 255) |
| Surface Alt | rgb(245, 245, 245) |
| Surface Soft | rgb(247, 247, 247) |
| Surface Muted | rgb(240, 240, 240) |
| Muted | rgb(167, 167, 167) |
| Title Muted | rgb(139, 139, 139) |
| Border | rgb(236, 236, 236) |
| Border Strong | rgb(207, 207, 207) |
| Border On Dark | rgb(51, 51, 51) |
| Accent | rgb(81, 254, 192) |
| Accent Deep | rgb(98, 197, 132) |

## Site map (public pages)

1. Home `/`
2. Properties `/properties`
3. Property detail `/properties/:slug`
4. Agents `/agents`
5. Agent detail `/agents/:slug`
6. Contact `/contact`
7. About `/about`
8. Services `/services`
9. Service detail `/services/:slug`
10. Mortgage Calculator `/mortgage-calculator`
11. Journal `/journal`
12. Journal post `/journal/:slug`
13. Privacy `/privacy`
14. 404 `/404`

## Home — section order (Desktop)

1. **Hero** — surface bg, top padding 56px, stack gap 240px; Nav backdrop 82px; banner ~782px; headline + CTA
2. **Glass Panel** — frosted white 86%, padding 160px 80px; About intro + stats
3. **Services** — ink background; accordion service rows + support cards
4. **Why Choose Us** — surface, padding 104px 80px
5. **Stages of a Sale** — `#f1f1f1`, top padding 120px, gap 72px; awards timeline
6. **Track Record Figures** — ink, padding 130px 80px; stat grid
7. **Properties** — listing grid (CMS-driven in Framer)
8. **Testimonials** — surface soft, padding 120px 0, gap 56px
9. **FAQ** — surface soft, padding 0 80px 130px; accordion + CTA band + newsletter + footer (layout)

## Key components (Framer canvas)

- Navigation (`eOd5I0KfA`) — bar padding 20px 32px, logo + links + Book a Call
- Button (`WmKe5_pVZ`) — default fill Surface Alt, hover Ink; padding 25px 43px; corner bracket decorations
- Pill Button, Service Row, Testimonial, Submit/Subscribe buttons

## CMS — Properties collection fields

Title, Slug, Location, Price, Bedrooms, Bathrooms, Area, Status (enum), Type (enum), Cover + gallery images, Summary, Description (richtext), Agent (ref)

## Animation notes (Hero sample)

- `appearEffect.trigger: onInView`, threshold 0.15, no replay on eyebrow/headline blocks
- Page load: branded preloader with progress bar (live site)
- Service rows: expand/collapse accordion
- FAQ: accordion

## Implementation plan (next phases)

| Phase | Work |
|-------|------|
| 4 | Vite + Tailwind v4 tokens, router shell, content config |
| 5 | Navigation + Home through FAQ (this sprint) |
| 6 | About, Properties, Contact, remaining public routes |
| 7 | Motion scroll reveals, accordion, preloader |
| 8 | Tablet/phone parity vs Framer replicas |
| 9 | Screenshot diff vs avenlo.framer.website |
| 10 | Supabase schema, RLS, `/admin` CMS (separate UI) |

## ARTHALAND content

Placeholder Avenlo copy until client assets arrive. Config-driven via `src/config/site.ts`.
