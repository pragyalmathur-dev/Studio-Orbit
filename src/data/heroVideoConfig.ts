/**
 * Configuration for the Cinematic Building Hero Video
 *
 * The video file is located in: /public/assets/homepage/video/hero/herovideo.mp4
 * The component checks this source and falls back smoothly to alternative candidates
 * or the intact-building poster if the video is loading, blocked by autoplay policies,
 * or awaiting upload.
 */

export const HERO_VIDEO_CONFIG = {
  // Primary public URL as uploaded by user
  videoSrc: '/assets/homepage/video/hero/herovideo.mp4',

  // Alternate candidate paths for flexible developer placement
  alternateVideoSrcs: [
    '/assets/homepage/video/hero/herovideo.mp4',
    '/public/assets/homepage/video/hero/herovideo.mp4',
    '/assets/video/hero/herovideo.mp4',
    '/public/assets/video/hero/herovideo.mp4',
    '/assets/video/hero/hero.mp4',
  ],

  // Intact-building poster paths
  posterSrc: '/assets/hero/1.png',
  fallbackPosterSrcs: [
    '/public/assets/hero/1.png',
    '/assets/hero/tower-01.png',
    '/1.png',
  ],

  // Hero Copy
  eyebrow: 'Branding & Brand Transformation',
  headline: 'Build a brand.\nShape what comes next.',
  supportingText:
    'We create brands with a clear identity and help established businesses evolve through strategy, design, and digital experiences.',
  primaryCta: 'Let’s talk',
  secondaryCta: 'View our work',
};
