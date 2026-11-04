# Asset report (2026-11-04)

## Successfully on disk

| File | Origin | License / notes |
|------|--------|-----------------|
| `public/assets/hero/source/higgsfield-hero-still-8461d1fa.png` | Higgsfield `gpt_image_2_5` | AI provisional — job `8461d1fa-bc6a-44ba-ad9c-a8aeb0843aff` |
| `public/assets/hero/hero-poster.jpg` | Copy of hero still | Same as above — LCP poster |
| `public/assets/videos/pexels-aerial-city-7101178-fallback.mp4` | Pexels #7101178 | Pexels License (Gustavo Fring), 1920×1080 |
| `public/assets/hero/source/unsplash-glass-facade-stock.jpg` | Unsplash | Unsplash License, backup still |

## Higgsfield video (completed)

| File | Job | Cost |
|------|-----|------|
| `public/assets/videos/hero-cinematic.mp4` | `9386dcda-f22a-4a48-8b61-bd4658c97e2a` (seedance_2_5, 8s 1080p) | 56 credits |

## Unavailable / not yet generated
- WebP/AVIF derivatives — not converted yet (poster is JPG)
- About / sustainability / interior / contact AI visuals — deferred (see `docs/ASSET_PLAN.md`)

## Runtime behavior

- Hero tries `hero-cinematic.mp4` first → on error switches to Pexels fallback.
- `prefers-reduced-motion`: poster only, no autoplay video.

## Credits

- Balance: **3183** (plan: max)
- Spent this session: **0.25** (hero still) + **56** (video, when job completes)
