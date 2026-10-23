import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { HERO_VIDEO_CONFIG } from '../data/heroVideoConfig';

interface HeroVideoProps {
  onNavigateToWork: () => void;
  onNavigateToContact: (service?: string) => void;
}

const VIDEO_SOURCES = [
  HERO_VIDEO_CONFIG.videoSrc,
  ...HERO_VIDEO_CONFIG.alternateVideoSrcs,
];

export const HeroVideo: React.FC<HeroVideoProps> = ({
  onNavigateToWork,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Playback state
  const [, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentVideoSrcIndex, setCurrentVideoSrcIndex] = useState(0);

  const currentVideoSrc = VIDEO_SOURCES[currentVideoSrcIndex] || HERO_VIDEO_CONFIG.videoSrc;

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
    }
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);
    return () => motionQuery.removeEventListener('change', motionHandler);
  }, []);

  // 2. Playback attempts with resilient muted autoplay
  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.defaultMuted = true;
      video.muted = true;
      video.playbackRate = 1.0;
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  // 3. Initialize video playback once source is mounted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce HTML media properties directly on DOM node
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    if (reducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const handleCanPlay = () => {
      attemptPlay();
    };

    const handlePlaying = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      if (currentVideoSrcIndex < VIDEO_SOURCES.length - 1) {
        setCurrentVideoSrcIndex((prev) => prev + 1);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Initial attempt immediately
    attemptPlay();

    // User interaction unlocker for strict mobile / browser autoplay policies
    const unlockPlay = () => {
      if (videoRef.current && videoRef.current.paused && !reducedMotion) {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', unlockPlay, { once: true });
    window.addEventListener('touchstart', unlockPlay, { once: true });
    window.addEventListener('scroll', unlockPlay, { once: true, passive: true });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      window.removeEventListener('pointerdown', unlockPlay);
      window.removeEventListener('touchstart', unlockPlay);
      window.removeEventListener('scroll', unlockPlay);
    };
  }, [attemptPlay, reducedMotion, currentVideoSrcIndex]);

  // 4. Performance: Pause when hero is scrolled offscreen or browser tab is hidden
  useEffect(() => {
    const heroEl = heroRef.current;
    const video = videoRef.current;
    if (!heroEl || !video) return;

    let wasPlayingBeforeHidden = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current || reducedMotion) return;

          if (entry.isIntersecting) {
            if (wasPlayingBeforeHidden || !videoRef.current.paused) {
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          } else {
            if (!videoRef.current.paused) {
              wasPlayingBeforeHidden = true;
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(heroEl);

    const handleVisibilityChange = () => {
      if (!videoRef.current || reducedMotion) return;
      if (document.hidden) {
        if (!videoRef.current.paused) {
          wasPlayingBeforeHidden = true;
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } else if (wasPlayingBeforeHidden) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="StudioOrbit hero presentation"
      className="relative w-full min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#F0F5F0]"
    >
      {/* BACKGROUND LAYER: HTML5 Video Element */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={currentVideoSrc}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="w-full h-full object-cover object-[58%_center] md:object-[62%_center]"
        />
      </div>

      {/* GRADIENT OVERLAYS (Light & Subtle for full video visibility) */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-24 bg-gradient-to-t from-[#F0F5F0] to-transparent" />
      <div className="pointer-events-none absolute top-0 inset-x-0 z-10 h-20 bg-gradient-to-b from-[#F0F5F0]/60 to-transparent" />

      {/* HERO CONTENT: Truly Translucent Glassmorphism Panel */}
      <div className="relative z-20 px-6 md:px-12 lg:px-20 py-20 md:py-24 my-auto max-w-2xl lg:max-w-[40rem]">
        <div className="relative backdrop-blur-md bg-[#F0F5F0]/35 border border-white/60 shadow-[0_8px_32px_0_rgba(73,117,107,0.08)] rounded-2xl sm:rounded-3xl p-7 sm:p-9 md:p-10 ring-1 ring-white/40 overflow-hidden">
          {/* Subtle translucent glass sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10" />

          <div className="relative z-10">
            {/* Eyebrow removed per user screenshot request */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-[3.25rem] text-[#49756B] leading-[1.08] font-normal mb-5 tracking-tight">
              Build a brand.<br />
              Shape what comes next.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#49756B]/90 font-light leading-relaxed mb-8 max-w-xl">
              We create brands with a clear identity and help established businesses evolve through strategy, design, and digital experiences.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={onNavigateToWork}
                className="px-6 py-3.5 text-xs sm:text-sm font-medium text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 rounded-md transition-all shadow-sm flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#49756B]"
              >
                <span>View our work</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-[#F0F5F0]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
