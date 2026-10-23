import React, { useEffect, useRef, useState, useCallback } from 'react';
import { HERO_ASSET_MANIFEST, HeroFrameConfig } from '../data/heroManifest';

interface ArchitecturalSeparationCanvasProps {
  progress: number; // 0.0 to 1.0 normalized scroll progress
  reducedMotion?: boolean;
  onFramesLoadedChange?: (loadedCount: number, total: number) => void;
}

export const ArchitecturalSeparationCanvas: React.FC<ArchitecturalSeparationCanvasProps> = ({
  progress,
  reducedMotion = false,
  onFramesLoadedChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Loaded images storage: index -> HTMLImageElement
  const loadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [loadedCount, setLoadedCount] = useState(0);

  // Animation frame and dirty state tracking
  const animFrameIdRef = useRef<number | null>(null);
  const isDirtyRef = useRef(true);
  const lastDrawnProgressRef = useRef<number>(-1);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // 1. Progressive Image Preloader with Decoded Guarantee & Candidate Fallbacks
  useEffect(() => {
    let isCancelled = false;
    const manifest = HERO_ASSET_MANIFEST;
    const totalFrames = manifest.length;

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
              // Ensure image is fully decoded into memory before drawing
              if ('decode' in img) {
                await img.decode();
              }
              resolve(img);
            } catch {
              // Decode failed, attempt next candidate
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

    const preloadAllSequentially = async () => {
      // Prioritize Frame 0 (Poster / Intact Building)
      const frame0 = await tryLoadImage(manifest[0]);
      if (frame0 && !isCancelled) {
        loadedImagesRef.current.set(0, frame0);
        setLoadedCount(loadedImagesRef.current.size);
        isDirtyRef.current = true;
      }

      // Prioritize Frame 1 (First separation step)
      if (manifest.length > 1) {
        const frame1 = await tryLoadImage(manifest[1]);
        if (frame1 && !isCancelled) {
          loadedImagesRef.current.set(1, frame1);
          setLoadedCount(loadedImagesRef.current.size);
          isDirtyRef.current = true;
        }
      }

      // Load remaining frames progressively
      for (let i = 2; i < totalFrames; i++) {
        if (isCancelled) break;
        const img = await tryLoadImage(manifest[i]);
        if (img && !isCancelled) {
          loadedImagesRef.current.set(i, img);
          setLoadedCount(loadedImagesRef.current.size);
          isDirtyRef.current = true;
        }
      }
    };

    preloadAllSequentially();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Notify parent of loading progress
  useEffect(() => {
    onFramesLoadedChange?.(loadedCount, HERO_ASSET_MANIFEST.length);
  }, [loadedCount, onFramesLoadedChange]);

  // Flag dirty whenever scroll progress changes
  useEffect(() => {
    if (Math.abs(progress - lastDrawnProgressRef.current) > 0.001) {
      isDirtyRef.current = true;
    }
  }, [progress]);

  // Handle Resize and Viewport Setup
  const updateDimensions = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 to conserve memory

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

  // Find the nearest loaded frame if an intermediate asset is pending
  const getNearestLoadedFrame = (targetIndex: number, total: number): HTMLImageElement | null => {
    const images = loadedImagesRef.current;
    if (images.has(targetIndex)) return images.get(targetIndex)!;

    // Search outwards from target
    for (let offset = 1; offset < total; offset++) {
      const lower = targetIndex - offset;
      if (lower >= 0 && images.has(lower)) return images.get(lower)!;
      const upper = targetIndex + offset;
      if (upper < total && images.has(upper)) return images.get(upper)!;
    }

    return null;
  };

  // Fallback high-fidelity procedural drawing if image assets are not placed on disk yet
  const drawProceduralSunsetTower = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    separationNorm: number
  ) => {
    // 1. Sunset Sky Gradient (Peach, Warm Gold, Soft Cyan)
    const skyGrad = ctx.createLinearGradient(0, 0, width, height);
    skyGrad.addColorStop(0, '#5A758E');
    skyGrad.addColorStop(0.35, '#C99372');
    skyGrad.addColorStop(0.55, '#E5A66B');
    skyGrad.addColorStop(0.75, '#D68453');
    skyGrad.addColorStop(1, '#2B332E');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Setting Sun on Left Horizon
    const sunX = width * 0.12;
    const sunY = height * 0.62;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, width * 0.35);
    sunGlow.addColorStop(0, 'rgba(255, 250, 230, 0.95)');
    sunGlow.addColorStop(0.2, 'rgba(255, 190, 110, 0.6)');
    sunGlow.addColorStop(0.5, 'rgba(220, 120, 70, 0.25)');
    sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, width * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // 3. Distant Lake & Mountain Silhouettes
    const waterY = height * 0.67;
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, height);
    waterGrad.addColorStop(0, '#667B88');
    waterGrad.addColorStop(0.3, '#3D4944');
    waterGrad.addColorStop(1, '#1A211D');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, width, height - waterY);

    // Lake Sun Reflection streak
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

    // 4. Foreground Landscaping Terrace and Reflecting Pool
    const poolX = width * 0.42;
    const poolY = height * 0.82;
    const poolW = width * 0.22;
    const poolH = height * 0.08;

    ctx.fillStyle = '#222924';
    ctx.beginPath();
    ctx.ellipse(poolX, poolY, poolW, poolH, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#39463F';
    ctx.beginPath();
    ctx.ellipse(poolX, poolY, poolW * 0.95, poolH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Stacked Cantilevered Glass Building Modules
    // Building Base at pool edge
    const towerCenterX = width * 0.53;
    const baseY = height * 0.82;
    const blockWidth = Math.min(width * 0.18, 220);
    const blockHeight = height * 0.085;
    const sepOffset = separationNorm * (height * 0.038); // Vertical separation gap

    const modules = [
      { shiftX: 0, extraShift: 0, label: 'Lobby & Arrival', floors: 'G + 1' },
      { shiftX: -12, extraShift: -25 * separationNorm, label: 'Garden Residences', floors: 'Fl 02-05' },
      { shiftX: 18, extraShift: 35 * separationNorm, label: 'Terrace Suites', floors: 'Fl 06-09' },
      { shiftX: -22, extraShift: -45 * separationNorm, label: 'Sky Villas', floors: 'Fl 10-13' },
      { shiftX: 28, extraShift: 50 * separationNorm, label: 'Panoramic Level', floors: 'Fl 14-17' },
      { shiftX: -8, extraShift: -15 * separationNorm, label: 'Crown Penthouse', floors: 'Fl 18-21' },
    ];

    // Draw structural core column passing through modules
    const totalTowerTop = baseY - (modules.length * (blockHeight + sepOffset)) - 20;
    ctx.fillStyle = 'rgba(210, 225, 235, 0.4)';
    ctx.fillRect(towerCenterX - 18, totalTowerTop, 36, baseY - totalTowerTop);

    // Draw each floor module from bottom to top
    modules.forEach((mod, idx) => {
      const moduleY = baseY - (idx + 1) * (blockHeight + sepOffset);
      const moduleX = towerCenterX - blockWidth / 2 + mod.shiftX + mod.extraShift;

      // Module ambient glow
      ctx.shadowColor = 'rgba(255, 220, 160, 0.35)';
      ctx.shadowBlur = 15;

      // Glass module body
      const glassGrad = ctx.createLinearGradient(moduleX, moduleY, moduleX + blockWidth, moduleY + blockHeight);
      glassGrad.addColorStop(0, 'rgba(235, 245, 255, 0.82)');
      glassGrad.addColorStop(0.3, 'rgba(190, 220, 240, 0.7)');
      glassGrad.addColorStop(0.7, 'rgba(240, 200, 160, 0.65)');
      glassGrad.addColorStop(1, 'rgba(140, 175, 195, 0.8)');

      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      // Rounded box
      const r = 8;
      ctx.roundRect(moduleX, moduleY, blockWidth, blockHeight, r);
      ctx.fill();

      // Mullion & floor horizontal accents
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Interior illuminated slabs
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

    // Subtitle annotation
    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(222, 218, 210, 0.7)';
    ctx.fillText('ARCHITECTURAL STRATA · SEPARATION STUDY', width * 0.05, height * 0.95);
  };

  // Main Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    if (width <= 0 || height <= 0) return;

    // Reset transform and clear
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const effectiveProgress = reducedMotion ? 0 : Math.max(0, Math.min(1, progress));
    lastDrawnProgressRef.current = effectiveProgress;
    isDirtyRef.current = false;

    const manifest = HERO_ASSET_MANIFEST;
    const totalFrames = manifest.length;

    // Normalized timeline mapping:
    // 0.0 - 0.10: Hold intact building (frame 0)
    // 0.10 - 0.85: Interpolate across frames 0 to (totalFrames - 1)
    // 0.85 - 1.00: Hold final separated view (frame totalFrames - 1)
    let separationNorm = 0;
    if (effectiveProgress <= 0.10) {
      separationNorm = 0;
    } else if (effectiveProgress >= 0.85) {
      separationNorm = 1.0;
    } else {
      separationNorm = (effectiveProgress - 0.10) / (0.85 - 0.10);
    }

    // Check if we have loaded images
    const hasAnyImage = loadedImagesRef.current.size > 0;

    if (!hasAnyImage) {
      // Draw pristine procedural architecture fallback
      drawProceduralSunsetTower(ctx, width, height, separationNorm);
      return;
    }

    // Calculate source and target frames for blending
    const continuousFrame = separationNorm * (totalFrames - 1);
    const frameIndexA = Math.floor(continuousFrame);
    const frameIndexB = Math.min(totalFrames - 1, frameIndexA + 1);
    const frac = continuousFrame - frameIndexA;

    const imgA = getNearestLoadedFrame(frameIndexA, totalFrames);
    const imgB = getNearestLoadedFrame(frameIndexB, totalFrames);

    // Calculate aspect ratio containment preserving landscape baseline & tower peak
    // Target base resolution: 1920x1080 (16:9)
    const targetAspect = 1920 / 1080;
    const screenAspect = width / height;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (screenAspect > targetAspect) {
      // Screen is wider than 16:9
      drawW = width;
      drawH = width / targetAspect;
      drawX = 0;
      // Align bottom landscape so ground baseline stays fixed
      drawY = height - drawH;
    } else {
      // Screen is taller than 16:9 (e.g. mobile or tablet portrait)
      // Ensure the complete tower height and separated floorplates stay in view
      drawH = height;
      drawW = height * targetAspect;
      // Shift slightly right on mobile so building stays in clear view beside left gradient
      drawX = (width - drawW) * 0.55;
      drawY = 0;
    }

    // Draw primary frame A
    if (imgA) {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(imgA, drawX, drawY, drawW, drawH);
    }

    // Blend frame B on top with fractional alpha (restrained crossfade)
    if (imgB && imgB !== imgA && frac > 0.001) {
      ctx.globalAlpha = frac;
      ctx.drawImage(imgB, drawX, drawY, drawW, drawH);
      ctx.globalAlpha = 1.0;
    }
  }, [progress, reducedMotion]);

  // RequestAnimationFrame Driver (Tick only when dirty)
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;
      if (isDirtyRef.current) {
        render();
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
  }, [render]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-[#141715]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
