import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArchitecturalSeparationCanvas } from './ArchitecturalSeparationCanvas';
import { ArrowDown, ChevronRight, SlidersHorizontal, Compass, Film, BarChart3 } from 'lucide-react';
import { HERO_ASSET_MANIFEST } from '../data/heroManifest';

interface ScrollStageProps {
  onNavigateToWork: () => void;
  onNavigateToContact: (service?: string) => void;
}

export const ScrollStage: React.FC<ScrollStageProps> = ({
  onNavigateToWork,
  onNavigateToContact,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedFramesCount, setLoadedFramesCount] = useState(0);

  // Check prefers-reduced-motion & mobile viewport
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
    }
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Native scroll progress calculation (0.0 to 1.0)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const containerHeight = containerRef.current.offsetHeight;
          const windowHeight = window.innerHeight;
          const scrollDistance = containerHeight - windowHeight;

          if (scrollDistance <= 0) {
            setScrollProgress(0);
          } else {
            const current = -rect.top;
            const p = Math.max(0, Math.min(1, current / scrollDistance));
            setScrollProgress(p);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Text choreography calculations (Smooth, exclusive transitions)
  // 1. Main Hero: 0.00 - 0.18 (Fade begins at 0.10, gone by 0.18)
  const heroOpacity = useMemo(() => {
    if (reducedMotion) return 1;
    if (scrollProgress <= 0.10) return 1;
    if (scrollProgress >= 0.18) return 0;
    return (0.18 - scrollProgress) / (0.18 - 0.10);
  }, [scrollProgress, reducedMotion]);

  // 2. Statement 1: "Make places explorable" (0.20 - 0.44)
  const stmt1Opacity = useMemo(() => {
    if (reducedMotion) return 0;
    if (scrollProgress < 0.18 || scrollProgress > 0.44) return 0;
    if (scrollProgress <= 0.25) return (scrollProgress - 0.18) / 0.07;
    if (scrollProgress >= 0.38) return (0.44 - scrollProgress) / 0.06;
    return 1;
  }, [scrollProgress, reducedMotion]);

  // 3. Statement 2: "Bring spaces into motion" (0.46 - 0.70)
  const stmt2Opacity = useMemo(() => {
    if (reducedMotion) return 0;
    if (scrollProgress < 0.44 || scrollProgress > 0.70) return 0;
    if (scrollProgress <= 0.51) return (scrollProgress - 0.44) / 0.07;
    if (scrollProgress >= 0.64) return (0.70 - scrollProgress) / 0.06;
    return 1;
  }, [scrollProgress, reducedMotion]);

  // 4. Statement 3: "Turn information into action" (0.72 - 0.94)
  const stmt3Opacity = useMemo(() => {
    if (reducedMotion) return 0;
    if (scrollProgress < 0.70 || scrollProgress > 0.94) return 0;
    if (scrollProgress <= 0.77) return (scrollProgress - 0.70) / 0.07;
    if (scrollProgress >= 0.88) return (0.94 - scrollProgress) / 0.06;
    return 1;
  }, [scrollProgress, reducedMotion]);

  // Track active frame metadata for technical inspection
  const activeFrameIndex = Math.min(
    HERO_ASSET_MANIFEST.length - 1,
    Math.floor(
      (scrollProgress <= 0.10
        ? 0
        : scrollProgress >= 0.85
        ? 1
        : (scrollProgress - 0.10) / 0.75) *
        (HERO_ASSET_MANIFEST.length - 1)
    )
  );
  const activeFrame = HERO_ASSET_MANIFEST[activeFrameIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#1A1E1B] text-[#F5F2EC]"
      style={{ height: reducedMotion ? '100vh' : isMobile ? '230vh' : '300vh' }}
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background Canvas Visual: Architectural Separation Stage */}
        <div className="absolute inset-0 z-0">
          <ArchitecturalSeparationCanvas
            progress={scrollProgress}
            reducedMotion={reducedMotion}
            onFramesLoadedChange={(loaded) => setLoadedFramesCount(loaded)}
          />
        </div>

        {/* Restrained Gradient Overlays for Typographic Contrast */}
        {/* Left sky gradient for crisp copy readability without obstructing the building */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full sm:w-4/5 md:w-3/5 bg-gradient-to-r from-[#1A1E1B]/90 via-[#1A1E1B]/55 to-transparent" />
        {/* Bottom ground blend into next section */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-28 bg-gradient-to-t from-[#1A1E1B] to-transparent" />
        {/* Subtle top shade for top controls */}
        <div className="pointer-events-none absolute top-0 inset-x-0 z-10 h-24 bg-gradient-to-b from-[#1A1E1B]/60 to-transparent" />

        {/* Top-Right Stage Controls: Motion Toggle & Visible Skip Link */}
        <div className="absolute top-20 right-6 md:right-12 z-30 flex items-center gap-3">
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#DEDAD2]/80 hover:text-[#F5F2EC] bg-[#222724]/80 hover:bg-[#222724] border border-white/10 rounded-md transition-colors backdrop-blur-md cursor-pointer"
            title="Toggle between scroll architectural transformation and static view"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8E9C84]" />
            <span>{reducedMotion ? 'Enable Scroll Separation' : 'Static View'}</span>
          </button>

          <button
            onClick={onNavigateToWork}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white border border-white/20 rounded-md transition-all shadow-md backdrop-blur-md cursor-pointer"
          >
            <span>Skip to our work</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Left Sequence Status Pill */}
        {!reducedMotion && (
          <div className="absolute top-20 left-6 md:left-12 z-30 hidden lg:flex items-center gap-2 px-3 py-1 bg-[#181C19]/80 border border-white/10 rounded-full text-[11px] font-mono text-[#DEDAD2]/75 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#8E9C84]" />
            <span>{activeFrame.label}</span>
            <span className="text-[#8E9C84]">·</span>
            <span className="text-[#8E9C84]">Stage {activeFrameIndex + 1}/{HERO_ASSET_MANIFEST.length}</span>
          </div>
        )}

        {/* SECTION 2 & 5: Text Choreography Containers */}
        
        {/* 1. Main Hero Copy (Visible at scroll 0 - 0.18) */}
        <div
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-2xl transition-opacity duration-150"
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.2 ? 'auto' : 'none',
          }}
        >
          <div className="pt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8E9C84] mb-3.5 font-mono font-medium">
              Creative Technology Studio
            </p>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-[3.25rem] text-[#F5F2EC] leading-[1.08] font-normal mb-5 tracking-tight">
              We turn ideas into immersive experiences and intelligent tools.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#DEDAD2]/85 font-light leading-relaxed mb-7 max-w-xl">
              We combine marketing, design and AI to create interactive property experiences, cinematic content and custom tools.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={onNavigateToWork}
                className="px-5 py-3 text-xs sm:text-sm font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white rounded-md transition-colors shadow-sm flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore our work</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => onNavigateToContact()}
                className="px-5 py-3 text-xs sm:text-sm font-medium text-[#F5F2EC] bg-[#262B28]/85 hover:bg-[#262B28] border border-white/20 rounded-md transition-colors cursor-pointer"
              >
                Discuss a project
              </button>
            </div>
          </div>

          {/* Subtle "Scroll to explore" indicator */}
          <div className="absolute bottom-8 left-6 md:left-14 lg:left-20 flex items-center gap-2.5 text-xs text-[#DEDAD2]/70 font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#8E9C84] animate-pulse" />
            <span>Scroll to explore</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#8E9C84] animate-bounce" />
          </div>
        </div>

        {/* 2. Statement 1: "Make places explorable." (Visible 0.20 - 0.44) */}
        <div
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-xl transition-opacity duration-150"
          style={{
            opacity: stmt1Opacity,
            pointerEvents: stmt1Opacity > 0.2 ? 'auto' : 'none',
          }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8E9C84] mb-3 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#8E9C84]" />
            <span>Spatial Interaction</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#F5F2EC] leading-[1.1] font-normal mb-3">
            Make places explorable.
          </h2>

          <p className="text-base sm:text-lg text-[#DEDAD2]/85 font-light leading-relaxed mb-6">
            Interactive maps and property experiences.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToWork}
              className="px-4 py-2 text-xs font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white rounded transition-colors"
            >
              See interactive maps
            </button>
            <button
              onClick={() => onNavigateToContact('Interactive Property Experiences')}
              className="px-4 py-2 text-xs font-medium text-[#DEDAD2] hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors"
            >
              Discuss maps
            </button>
          </div>
        </div>

        {/* 3. Statement 2: "Bring spaces into motion." (Visible 0.46 - 0.70) */}
        <div
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-xl transition-opacity duration-150"
          style={{
            opacity: stmt2Opacity,
            pointerEvents: stmt2Opacity > 0.2 ? 'auto' : 'none',
          }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8E9C84] mb-3 uppercase tracking-wider">
            <Film className="w-4 h-4 text-[#8E9C84]" />
            <span>Cinematic Walkthroughs</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#F5F2EC] leading-[1.1] font-normal mb-3">
            Bring spaces into motion.
          </h2>

          <p className="text-base sm:text-lg text-[#DEDAD2]/85 font-light leading-relaxed mb-6">
            Cinematic walkthroughs and visual storytelling.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToWork}
              className="px-4 py-2 text-xs font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white rounded transition-colors"
            >
              See walkthroughs
            </button>
            <button
              onClick={() => onNavigateToContact('Cinematic Walkthroughs')}
              className="px-4 py-2 text-xs font-medium text-[#DEDAD2] hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors"
            >
              Discuss films
            </button>
          </div>
        </div>

        {/* 4. Statement 3: "Turn information into action." (Visible 0.72 - 0.94) */}
        <div
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-xl transition-opacity duration-150"
          style={{
            opacity: stmt3Opacity,
            pointerEvents: stmt3Opacity > 0.2 ? 'auto' : 'none',
          }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8E9C84] mb-3 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-[#8E9C84]" />
            <span>Intelligence & Consoles</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#F5F2EC] leading-[1.1] font-normal mb-3">
            Turn information into action.
          </h2>

          <p className="text-base sm:text-lg text-[#DEDAD2]/85 font-light leading-relaxed mb-6">
            Dashboards, research tools and automation.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToWork}
              className="px-4 py-2 text-xs font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white rounded transition-colors"
            >
              Explore work
            </button>
            <button
              onClick={() => onNavigateToContact('Marketing & Sales Dashboards')}
              className="px-4 py-2 text-xs font-medium text-[#DEDAD2] hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors"
            >
              Discuss dashboards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
