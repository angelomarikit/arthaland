# ARTHALAND asset generation plan

## Higgsfield balance (checked)

- **Credits:** 3183 | **Plan:** max

## Priority queue

| Priority | Asset | Tool | Est. cost | Count | Status |
|----------|-------|------|-----------|-------|--------|
| P0 | Hero still (16:9 tropical architecture) | `generate_image` / gpt_image_2_5 | 0.25 | 1 | Completed → local PNG |
| P0 | Hero video (8s, 1080p, from still) | `generate_video` / seedance_2_5 omni_reference | 56 | 1 | **Completed** → `hero-cinematic.mp4` |
| P1 | About architectural visual | `generate_image` | ~0.25 | 1 | Pending |
| P1 | Sustainability lifestyle | `generate_image` | ~0.25 | 1 | Pending |
| P1 | Condominium interior | `generate_image` | ~0.25 | 1 | Pending |
| P2 | Properties exploration bg | `generate_image` | ~0.25 | 1 | Pending |
| P2 | Contact CTA background | `generate_image` | ~0.25 | 1 | Pending |

**Budget cap for this sprint:** ~60 credits (hero video + 1 still). Supporting visuals deferred until hero is integrated.

## Stock fallbacks (downloaded)

| File | Source | License |
|------|--------|---------|
| `public/assets/videos/pexels-aerial-city-7101178-fallback.mp4` | Pexels #7101178 | Pexels License |
| `public/assets/hero/source/unsplash-glass-facade-stock.jpg` | Unsplash | Unsplash License |

Registry: `src/config/assets.ts`
