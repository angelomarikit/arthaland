export type AssetRecord = {
  filename: string
  category: string
  source: string
  license: string
  resolution: string
  type: 'image' | 'video'
  usage: string
  origin: 'ai-generated' | 'stock' | 'official' | 'placeholder'
  approval: 'approved' | 'provisional' | 'pending'
}

/** Central asset registry — update when replacing provisional media. */
export const assetRegistry: AssetRecord[] = [
  {
    filename: 'public/assets/hero/source/higgsfield-hero-still-8461d1fa.png',
    category: 'hero',
    source: 'Higgsfield gpt_image_2_5 job 8461d1fa-bc6a-44ba-ad9c-a8aeb0843aff',
    license: 'Higgsfield user generation terms — project use only',
    resolution: '1536×864 approx (16:9)',
    type: 'image',
    usage: 'Hero poster / video reference still',
    origin: 'ai-generated',
    approval: 'provisional',
  },
  {
    filename: 'public/assets/videos/pexels-aerial-city-7101178-fallback.mp4',
    category: 'videos',
    source: 'https://www.pexels.com/video/aerial-video-of-buildings-in-a-city-7101178/ (Gustavo Fring)',
    license: 'Pexels License — free for commercial use',
    resolution: '1920×1080',
    type: 'video',
    usage: 'Hero fallback if AI video unavailable',
    origin: 'stock',
    approval: 'approved',
  },
  {
    filename: 'public/assets/hero/arthaland-hero-desktop.mp4',
    category: 'hero',
    source:
      'Higgsfield seedance_2_5 job 0c015658-2b25-49c7-8198-6f988f567dd0 · Lucima facade reference',
    license: 'Higgsfield user generation terms — project use only',
    resolution: '1920×1080, 16:9, ~8.25s (loop-bridge)',
    type: 'video',
    usage: 'Primary homepage hero background (desktop)',
    origin: 'official',
    approval: 'approved',
  },
  {
    filename: 'public/assets/hero/arthaland-hero-mobile.mp4',
    category: 'hero',
    source: 'Center crop from arthaland-hero-desktop.mp4',
    license: 'Same as desktop hero',
    resolution: '1080×1920 portrait crop',
    type: 'video',
    usage: 'Homepage hero mobile',
    origin: 'official',
    approval: 'approved',
  },
  {
    filename: 'public/assets/hero/source/higgsfield-eluria-hero-raw.mp4',
    category: 'hero',
    source: 'Raw Seedance 2.5 output before loop bridge',
    license: 'Higgsfield user generation terms',
    resolution: '1920×1080, 8s',
    type: 'video',
    usage: 'Backup / re-edit',
    origin: 'official',
    approval: 'approved',
  },
  {
    filename: 'public/assets/videos/hero-cinematic.mp4',
    category: 'hero',
    source: 'Higgsfield seedance_2_5 job 9386dcda-f22a-4a48-8b61-bd4658c97e2a',
    license: 'Higgsfield user generation terms — project use only',
    resolution: '1080p, 16:9, 8s',
    type: 'video',
    usage: 'Primary homepage hero background video',
    origin: 'ai-generated',
    approval: 'provisional',
  },
  {
    filename: 'public/assets/hero/source/unsplash-glass-facade-stock.jpg',
    category: 'hero',
    source: 'Unsplash (modern building glass facade)',
    license: 'Unsplash License',
    resolution: '2400px wide',
    type: 'image',
    usage: 'Backup poster / reference',
    origin: 'stock',
    approval: 'approved',
  },
]

/** Bump `v` when replacing hero media so browsers pick up new encodes. */
const heroMediaVersion = 6

export const heroAssets = {
  poster: `/assets/hero/arthaland-hero-poster.webp?v=${heroMediaVersion}`,
  videoDesktop: `/assets/hero/arthaland-hero-desktop.mp4?v=${heroMediaVersion}`,
  videoMobile: `/assets/hero/arthaland-hero-mobile.mp4?v=${heroMediaVersion}`,
  /** Legacy Ken Burns / crossfade masters — not used in production hero */
  legacyDesktop: `/assets/hero/hero-desktop.mp4`,
} as const
