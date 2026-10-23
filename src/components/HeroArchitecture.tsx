import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ChevronRight, SlidersHorizontal, Compass, Film, BarChart3 } from 'lucide-react';
import { HERO_ASSET_MANIFEST, HeroFrameConfig } from '../data/heroManifest';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroArchitectureProps {
  onNavigateToWork: () => void;
  onNavigateToContact: (service?: string) => void;
}

export const HeroArchitecture: React.FC<HeroArchitectureProps> = ({
  onNavigateToWork,
  onNavigateToContact,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Text container refs for GSAP choreography
  const heroTextRef = useRef<HTMLDivElement>(null);
  const stmt1Ref = useRef<HTMLDivElement>(null);
  const stmt2Ref = useRef<HTMLDivElement>(null);
  const stmt3Ref = useRef<HTMLDivElement>(null);

  // State
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  // Canvas image cache: index -> HTMLImageElement
  const loadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const scrollProgressRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const isDirtyRef = useRef(true);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // 1. Check prefers-reduced-motion
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
    }
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);
    return () => motionQuery.removeEventListener('change', motionHandler);
  }, []);

  // 2. Progressive preloader for the 9 architectural layers
  useEffect(() => {
    let isCancelled = false;
    const manifest = HERO_ASSET_MANIFEST;

    const tryLoadImage = (frame: HeroFrameConfig): Promise<HTMLImageElement | null> => {
      const candidates = [frame.src, ...frame.fallbackSrcs];

      return new Promise((resolve) => {
        let candidateIdx = 0;

        const attemptNext = () => {
          if (candidateIdx >= candidates.length || isCancelled) {
            resolve(null);
            return;
          }

          const currentSrc = candidates[candidateIdx];
          candidateIdx++;

          const img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = async () => {
            if (isCancelled) return;
            try {
              if ('decode' in img) {
                await img.decode();
              }
              resolve(img);
            } catch {
              attemptNext();
            }
          };

          img.onerror = () => {
            attemptNext();
          };

          img.src = currentSrc;
        };

        attemptNext();
      });
    };

    const loadAllProgressively = async () => {
      // 1. Immediately load & decode Poster Frame 0 (Intact tower)
      const frame0 = await tryLoadImage(manifest[0]);
      if (frame0 && !isCancelled) {
        loadedImagesRef.current.set(0, frame0);
        isDirtyRef.current = true;
      }

      // 2. Load Frame 1 (First separation step)
      if (manifest.length > 1) {
        const frame1 = await tryLoadImage(manifest[1]);
        if (frame1 && !isCancelled) {
          loadedImagesRef.current.set(1, frame1);
          isDirtyRef.current = true;
        }
      }

      // 3. Load remaining layers in order
      for (let i = 2; i < manifest.length; i++) {
        if (isCancelled) break;
        const img = await tryLoadImage(manifest[i]);
        if (img && !isCancelled) {
          loadedImagesRef.current.set(i, img);
          isDirtyRef.current = true;
        }
      }
    };

    loadAllProgressively();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 3. Resize and Viewport Setup
  const updateDimensions = useCallback(() => {
    if (!stickyRef.current || !canvasRef.current) return;
    const rect = stickyRef.current.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    dimensionsRef.current = { width, height, dpr };

    const canvas = canvasRef.current;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      isDirtyRef.current = true;
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // 4. Nearest Loaded Frame Resolver (No flashes or blank screens)
  const getNearestLoadedFrame = (targetIndex: number, total: number): HTMLImageElement | null => {
    const images = loadedImagesRef.current;
    if (images.has(targetIndex)) return images.get(targetIndex)!;

    for (let offset = 1; offset < total; offset++) {
      const lower = targetIndex - offset;
      if (lower >= 0 && images.has(lower)) return images.get(lower)!;
      const upper = targetIndex + offset;
      if (upper < total && images.has(upper)) return images.get(upper)!;
    }

    return null;
  };

  // 5. Procedural Sunset Architectural Canvas Fallback
  const drawProceduralSunsetTower = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    separationNorm: number
  ) => {
    // Sunset gradient (peach, cyan, dusky gold)
    const skyGrad = ctx.createLinearGradient(0, 0, width, height);
    skyGrad.addColorStop(0, '#536E85');
    skyGrad.addColorStop(0.35, '#C48D6C');
    skyGrad.addColorStop(0.55, '#E09E62');
    skyGrad.addColorStop(0.75, '#CF7D4B');
    skyGrad.addColorStop(1, '#272F2A');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Sunset sun glow on left
    const sunX = width * 0.12;
    const sunY = height * 0.62;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, width * 0.35);
    sunGlow.addColorStop(0, 'rgba(255, 252, 235, 0.95)');
    sunGlow.addColorStop(0.2, 'rgba(255, 190, 110, 0.55)');
    sunGlow.addColorStop(0.5, 'rgba(220, 120, 70, 0.22)');
    sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, width * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Lake & mountain base
    const waterY = height * 0.67;
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, height);
    waterGrad.addColorStop(0, '#5F727E');
    waterGrad.addColorStop(0.3, '#38433E');
    waterGrad.addColorStop(1, '#181E1A');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, width, height - waterY);

    // Water sun reflection
    const waterRefl = ctx.createLinearGradient(sunX - 60, waterY, sunX + 60, height);
    waterRefl.addColorStop(0, 'rgba(255, 230, 180, 0.7)');
    waterRefl.addColorStop(0.5, 'rgba(235, 160, 100, 0.3)');
    waterRefl.addColorStop(1, 'rgba(200, 120, 70, 0)');
    ctx.fillStyle = waterRefl;
    ctx.beginPath();
    ctx.moveTo(sunX - 10, waterY);
    ctx.lineTo(sunX + 10, waterY);
    ctx.lineTo(sunX + 120, height);
    ctx.lineTo(sunX - 120, height);
    ctx.closePath();
    ctx.fill();

    // Reflecting pool & landscaped grounds
    const poolX = width * 0.42;
    const poolY = height * 0.82;
    const poolW = width * 0.22;
    const poolH = height * 0.08;

    ctx.fillStyle = '#202521';
    ctx.beginPath();
    ctx.ellipse(poolX, poolY, poolW, poolH, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#343E38';
    ctx.beginPath();
    ctx.ellipse(poolX, poolY, poolW * 0.95, poolH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stacked Glass Tower
    const towerCenterX = width * 0.53;
    const baseY = height * 0.82;
    const blockWidth = Math.min(width * 0.18, 220);
    const blockHeight = height * 0.085;
    const sepOffset = separationNorm * (height * 0.038);

    const modules = [
      { shiftX: 0, extraShift: 0 },
      { shiftX: -12, extraShift: -25 * separationNorm },
      { shiftX: 18, extraShift: 35 * separationNorm },
      { shiftX: -22, extraShift: -45 * separationNorm },
      { shiftX: 28, extraShift: 50 * separationNorm },
      { shiftX: -8, extraShift: -15 * separationNorm },
    ];

    // Core spine
    const totalTowerTop = baseY - modules.length * (blockHeight + sepOffset) - 20;
    ctx.fillStyle = 'rgba(210, 225, 235, 0.35)';
    ctx.fillRect(towerCenterX - 18, totalTowerTop, 36, baseY - totalTowerTop);

    // Draw floor modules
    modules.forEach((mod, idx) => {
      const moduleY = baseY - (idx + 1) * (blockHeight + sepOffset);
      const moduleX = towerCenterX - blockWidth / 2 + mod.shiftX + mod.extraShift;

      // Glass gradient
      const glassGrad = ctx.createLinearGradient(moduleX, moduleY, moduleX + blockWidth, moduleY + blockHeight);
      glassGrad.addColorStop(0, 'rgba(235, 245, 255, 0.85)');
      glassGrad.addColorStop(0.3, 'rgba(190, 220, 240, 0.7)');
      glassGrad.addColorStop(0.7, 'rgba(240, 200, 160, 0.65)');
      glassGrad.addColorStop(1, 'rgba(140, 175, 195, 0.8)');

      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      ctx.roundRect(moduleX, moduleY, blockWidth, blockHeight, 8);
      ctx.fill();

      // Mullion edges
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Floor slabs
      ctx.strokeStyle = 'rgba(255, 235, 190, 0.55)';
      ctx.lineWidth = 1;
      for (let f = 1; f <= 3; f++) {
        const floorY = moduleY + (blockHeight / 4) * f;
        ctx.beginPath();
        ctx.moveTo(moduleX + 4, floorY);
        ctx.lineTo(moduleX + blockWidth - 4, floorY);
        ctx.stroke();
      }

      // Vertical mullions
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      for (let m = 1; m <= 6; m++) {
        const mullionX = moduleX + (blockWidth / 7) * m;
        ctx.beginPath();
        ctx.moveTo(mullionX, moduleY + 3);
        ctx.lineTo(mullionX, moduleY + blockHeight - 3);
        ctx.stroke();
      }

      // Structural column indicator if separated
      if (sepOffset > 6 && idx > 0) {
        ctx.strokeStyle = 'rgba(142, 156, 132, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(moduleX + blockWidth / 2, moduleY + blockHeight);
        ctx.lineTo(moduleX + blockWidth / 2, moduleY + blockHeight + sepOffset);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(222, 218, 210, 0.7)';
    ctx.fillText('ARCHITECTURAL STRATA · SEPARATION SEQUENCE', width * 0.05, height * 0.95);
  };

  // 6. Canvas Render Frame Function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    if (width <= 0 || height <= 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const p = reducedMotion ? 0 : scrollProgressRef.current;
    isDirtyRef.current = false;

    const manifest = HERO_ASSET_MANIFEST;
    const totalFrames = manifest.length;

    // Timeline mapping:
    // 0.00 - 0.10: Hold intact building (frame 0)
    // 0.10 - 0.85: Interpolate separation
    // 0.85 - 1.00: Hold maximum separation
    let separationNorm = 0;
    if (p <= 0.10) {
      separationNorm = 0;
    } else if (p >= 0.85) {
      separationNorm = 1.0;
    } else {
      separationNorm = (p - 0.10) / (0.85 - 0.10);
    }

    const hasAnyImage = loadedImagesRef.current.size > 0;

    if (!hasAnyImage) {
      drawProceduralSunsetTower(ctx, width, height, separationNorm);
      return;
    }

    const continuousFrame = separationNorm * (totalFrames - 1);
    const frameIndexA = Math.floor(continuousFrame);
    const frameIndexB = Math.min(totalFrames - 1, frameIndexA + 1);
    const frac = continuousFrame - frameIndexA;

    const imgA = getNearestLoadedFrame(frameIndexA, totalFrames);
    const imgB = getNearestLoadedFrame(frameIndexB, totalFrames);

    // Aspect ratio positioning (1920x1080 normalized space)
    const targetAspect = 1920 / 1080;
    const screenAspect = width / height;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (screenAspect > targetAspect) {
      drawW = width;
      drawH = width / targetAspect;
      drawX = 0;
      drawY = height - drawH; // Baseline landscape alignment
    } else {
      drawH = height;
      drawW = height * targetAspect;
      drawX = (width - drawW) * 0.55;
      drawY = 0;
    }

    if (imgA) {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(imgA, drawX, drawY, drawW, drawH);
    }

    if (imgB && imgB !== imgA && frac > 0.001) {
      ctx.globalAlpha = frac;
      ctx.drawImage(imgB, drawX, drawY, drawW, drawH);
      ctx.globalAlpha = 1.0;
    }
  }, [reducedMotion]);

  // RequestAnimationFrame Driver
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;
      if (isDirtyRef.current) {
        renderCanvas();
      }
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderCanvas]);

  // 7. GSAP ScrollTrigger Coordination Across 300vh
  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Primary ScrollTrigger coordinating scroll distance and progress
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;
          isDirtyRef.current = true;

          // Update active frame index for HUD pill
          const fIdx = Math.min(
            HERO_ASSET_MANIFEST.length - 1,
            Math.floor(
              (p <= 0.10 ? 0 : p >= 0.85 ? 1 : (p - 0.10) / 0.75) *
                (HERO_ASSET_MANIFEST.length - 1)
            )
          );
          setActiveFrameIndex(fIdx);

          // Coordinated Text Choreography
          // 1. Hero text: fades from 1 -> 0 between p: 0.10 and 0.18
          if (heroTextRef.current) {
            if (p <= 0.10) {
              gsap.set(heroTextRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
            } else if (p >= 0.18) {
              gsap.set(heroTextRef.current, { opacity: 0, y: -20, pointerEvents: 'none' });
            } else {
              const alpha = (0.18 - p) / 0.08;
              gsap.set(heroTextRef.current, {
                opacity: alpha,
                y: -20 * (1 - alpha),
                pointerEvents: alpha > 0.2 ? 'auto' : 'none',
              });
            }
          }

          // 2. Statement 1: "Make places explorable." (p: 0.20 - 0.44)
          if (stmt1Ref.current) {
            if (p < 0.18 || p > 0.44) {
              gsap.set(stmt1Ref.current, { opacity: 0, y: 20, pointerEvents: 'none' });
            } else if (p <= 0.25) {
              const alpha = (p - 0.18) / 0.07;
              gsap.set(stmt1Ref.current, {
                opacity: alpha,
                y: 20 * (1 - alpha),
                pointerEvents: alpha > 0.2 ? 'auto' : 'none',
              });
            } else if (p >= 0.38) {
              const alpha = (0.44 - p) / 0.06;
              gsap.set(stmt1Ref.current, {
                opacity: alpha,
                y: -20 * (1 - alpha),
                pointerEvents: alpha > 0.2 ? 'auto' : 'none',
              });
            } else {
              gsap.set(stmt1Ref.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
            }
          }

          // 3. Statement 2: "Bring spaces into motion." (p: 0.46 - 0.70)
          if (stmt2Ref.current) {
            if (p < 0.44 || p > 0.70) {
              gsap.set(stmt2Ref.current, { opacity: 0, y: 20, pointerEvents: 'none' });
            } else if (p <= 0.51) {
              const alpha = (p - 0.44) / 0.07;
              gsap.set(stmt2Ref.current, {
                opacity: alpha,
                y: 20 * (1 - alpha),
                pointerEvents: alpha > 0.2 ? 'auto' : 'none',
              });
            } else if (p >= 0.64) {
              const alpha = (0.70 - p) / 0.06;
              gsap.set(stmt2Ref.current, {
                opacity: alpha,
                y: -20 * (1 - alpha),
                pointerEvents: alpha > 0.2 ? 'auto' : 'none',
              });
            } else {
              gsap.set(stmt2Ref.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
            }
          }

          // 4. Statement 3: "Turn information into action." (p: 0.72 - 0.94)
          if (stmt3Ref.current) {
            if (p < 0.70 || p > 0.94) {
              gsap.set(stmt3Ref.current, { opacity: 0, y: 20, pointerEvents: 'none' });
            } else if (p <= 0.77) {
              const alpha = (p - 0.70) / 0.07;
              gsap.set(stmt3Ref.current, {
                opacity: alpha,
                y: 20 * (1 - alpha),
                pointerEvents: alpha > 0.2 ? 'auto' : 'none',
              });
            } else if (p >= 0.88) {
              const alpha = (0.94 - p) / 0.06;
              gsap.set(stmt3Ref.current, {
                opacity: alpha,
                y: -20 * (1 - alpha),
                pointerEvents: alpha > 0.2 ? 'auto' : 'none',
              });
            } else {
              gsap.set(stmt3Ref.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
            }
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  const activeFrame = HERO_ASSET_MANIFEST[activeFrameIndex] || HERO_ASSET_MANIFEST[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#1A1E1B] text-[#F5F2EC]"
      style={{ height: reducedMotion ? '100vh' : '300vh' }}
    >
      {/* Viewport-height sticky stage */}
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Architectural Separation Canvas */}
        <div className="absolute inset-0 z-0">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block pointer-events-none"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Restrained Dark Gradients for Text Legibility without Obstructing Building */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full sm:w-4/5 md:w-3/5 bg-gradient-to-r from-[#1A1E1B]/90 via-[#1A1E1B]/55 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-28 bg-gradient-to-t from-[#1A1E1B] to-transparent" />
        <div className="pointer-events-none absolute top-0 inset-x-0 z-10 h-24 bg-gradient-to-b from-[#1A1E1B]/60 to-transparent" />

        {/* Top Navigation Links & Motion Toggle */}
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

        {/* Top-Left Active Layer Indicator */}
        {!reducedMotion && (
          <div className="absolute top-20 left-6 md:left-12 z-30 hidden lg:flex items-center gap-2 px-3 py-1 bg-[#181C19]/80 border border-white/10 rounded-full text-[11px] font-mono text-[#DEDAD2]/75 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#8E9C84]" />
            <span>{activeFrame.label}</span>
            <span className="text-[#8E9C84]">·</span>
            <span className="text-[#8E9C84]">
              Stage {activeFrameIndex + 1}/{HERO_ASSET_MANIFEST.length}
            </span>
          </div>
        )}

        {/* 1. Main Hero Copy Container */}
        <div
          ref={heroTextRef}
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-2xl"
          style={{
            opacity: reducedMotion ? 1 : 1,
            pointerEvents: 'auto',
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

        {/* 2. Statement 1: "Make places explorable." (p: 0.20 - 0.44) */}
        <div
          ref={stmt1Ref}
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-xl opacity-0 pointer-events-none"
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
              className="px-4 py-2 text-xs font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white rounded transition-colors cursor-pointer"
            >
              See interactive maps
            </button>
            <button
              onClick={() => onNavigateToContact('Interactive Property Experiences')}
              className="px-4 py-2 text-xs font-medium text-[#DEDAD2] hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors cursor-pointer"
            >
              Discuss maps
            </button>
          </div>
        </div>

        {/* 3. Statement 2: "Bring spaces into motion." (p: 0.46 - 0.70) */}
        <div
          ref={stmt2Ref}
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-xl opacity-0 pointer-events-none"
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
              className="px-4 py-2 text-xs font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white rounded transition-colors cursor-pointer"
            >
              See walkthroughs
            </button>
            <button
              onClick={() => onNavigateToContact('Cinematic Walkthroughs')}
              className="px-4 py-2 text-xs font-medium text-[#DEDAD2] hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors cursor-pointer"
            >
              Discuss films
            </button>
          </div>
        </div>

        {/* 4. Statement 3: "Turn information into action." (p: 0.72 - 0.94) */}
        <div
          ref={stmt3Ref}
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-xl opacity-0 pointer-events-none"
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
              className="px-4 py-2 text-xs font-medium text-[#1A1E1B] bg-[#F5F2EC] hover:bg-white rounded transition-colors cursor-pointer"
            >
              Explore work
            </button>
            <button
              onClick={() => onNavigateToContact('Marketing & Sales Dashboards')}
              className="px-4 py-2 text-xs font-medium text-[#DEDAD2] hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors cursor-pointer"
            >
              Discuss dashboards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
