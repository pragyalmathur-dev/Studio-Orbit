/**
 * Hero Architectural Sequence Asset Manifest
 *
 * Sequence order:
 * 1. Intact Building (Original baseline / compact glass tower)
 * 2 - 7. Progressive architectural floor group separation
 * 8. Maximum Separation (Most widely separated suitable view)
 *
 * Technical note:
 * These assets are photographic / CGI rendered keyframes rather than a segmented
 * 3D polygonal model. Scroll transitions blend adjacent keyframes using fractional
 * opacity on a normalized 1920x1080 canvas without geometric warping.
 */

export interface HeroFrameConfig {
  id: string;
  order: number;
  // Multiple candidate paths for flexible developer placement
  src: string;
  fallbackSrcs: string[];
  separationLevel: number; // 0.0 (compact) to 1.0 (fully separated)
  label: string;
  description: string;
}

export const HERO_ASSET_MANIFEST: HeroFrameConfig[] = [
  {
    id: 'tower-01',
    order: 0,
    src: '/assets/hero/1.png',
    fallbackSrcs: [
      '/assets/hero/tower-01.png',
      '/1.png',
      '/assets/hero/intact.png',
    ],
    separationLevel: 0.0,
    label: 'Intact Structure',
    description: 'Complete glass tower with integrated landscaping, reflecting pool and compact floorplate tiers.',
  },
  {
    id: 'tower-02',
    order: 1,
    src: '/assets/hero/2.png',
    fallbackSrcs: [
      '/assets/hero/tower-02.png',
      '/2.png',
    ],
    separationLevel: 0.14,
    label: 'Upper Tier Offset',
    description: 'Top architectural modules begin vertical displacement and lateral cantilever shifts.',
  },
  {
    id: 'tower-03',
    order: 2,
    src: '/assets/hero/3.png',
    fallbackSrcs: [
      '/assets/hero/tower-03.png',
      '/3.png',
    ],
    separationLevel: 0.28,
    label: 'Core Disconnection',
    description: 'Mid-rise modules separate along structural column axes, exposing vertical interstitial space.',
  },
  {
    id: 'tower-04',
    order: 3,
    src: '/assets/hero/4.png',
    fallbackSrcs: [
      '/assets/hero/tower-04.png',
      '/4.png',
    ],
    separationLevel: 0.42,
    label: 'Expanding Spacing',
    description: 'Intermediate floor groups lift into distinct architectural strata across tiers 3, 4, and 5.',
  },
  {
    id: 'tower-05',
    order: 4,
    src: '/assets/hero/5.png',
    fallbackSrcs: [
      '/assets/hero/tower-05.png',
      '/5.png',
    ],
    separationLevel: 0.57,
    label: 'Alternating Cantilevers',
    description: 'Dramatic opposing cantilever projections with illuminated soffits and open sky passes.',
  },
  {
    id: 'tower-06',
    order: 5,
    src: '/assets/hero/6.png',
    fallbackSrcs: [
      '/assets/hero/tower-06.png',
      '/6.png',
    ],
    separationLevel: 0.71,
    label: 'Distinct Modules',
    description: 'Each floor volume hovers as an independent architectural pavilion with full perimeter daylight.',
  },
  {
    id: 'tower-07',
    order: 6,
    src: '/assets/hero/7.png',
    fallbackSrcs: [
      '/assets/hero/tower-07.png',
      '/7.png',
    ],
    separationLevel: 0.75,
    label: 'High Separation',
    description: 'Deep structural separation between lower residential tiers and elevated penthouses.',
  },
  {
    id: 'tower-08',
    order: 7,
    src: '/assets/hero/8.png',
    fallbackSrcs: [
      '/assets/hero/tower-08.png',
      '/8.png',
    ],
    separationLevel: 0.88,
    label: 'Deep Architectural Stratification',
    description: 'Extensive vertical expansion with illuminated structural columns and floating terraces.',
  },
  {
    id: 'tower-09',
    order: 8,
    src: '/assets/hero/9.png',
    fallbackSrcs: [
      '/assets/hero/tower-09.png',
      '/assets/hero/8.png',
      '/9.png',
      '/assets/hero/separated.png',
    ],
    separationLevel: 1.0,
    label: 'Exploded Master Architecture',
    description: 'Maximum separation state revealing the complete spatial taxonomy of internal spaces.',
  },
];

/**
 * Text choreography timeline configuration
 */
export interface NarrativeStatement {
  id: string;
  headline: string;
  supporting: string;
  startProgress: number; // 0 to 1
  peakProgress: number;
  endProgress: number;
}

export const HERO_NARRATIVE_STATEMENTS: NarrativeStatement[] = [
  {
    id: 'explorable',
    headline: 'Make places explorable.',
    supporting: 'Interactive maps and property experiences.',
    startProgress: 0.18,
    peakProgress: 0.35,
    endProgress: 0.48,
  },
  {
    id: 'motion',
    headline: 'Bring spaces into motion.',
    supporting: 'Cinematic walkthroughs and visual storytelling.',
    startProgress: 0.46,
    peakProgress: 0.60,
    endProgress: 0.73,
  },
  {
    id: 'action',
    headline: 'Turn information into action.',
    supporting: 'Dashboards, research tools and automation.',
    startProgress: 0.71,
    peakProgress: 0.84,
    endProgress: 0.96,
  },
];
