import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only activate for devices with a fine pointer (mouse, trackpad on laptops/PCs)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasPointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setHasPointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Detect clickable elements for subtle interactive feedback
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer')
      );
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // High performance RAF loop with subtle inertia
    const animate = () => {
      // Smooth interpolation for elegant tracking
      const ease = 0.25;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      if (cursorRef.current) {
        // Positioned just above/at the cursor tip (offset by -10px on Y)
        const targetX = currentPos.current.x;
        const targetY = currentPos.current.y - 10;
        cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!hasPointer) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* 
        Small brand circle:
        Diameter: ~8px, Warm Stone core with signature Pale Lilac ring and soft shadow 
        Ensures high visibility across Porcelain, Oat Milk, Lilac sections, and dark images
      */}
      <div
        className={`relative rounded-full transition-transform duration-150 ease-out flex items-center justify-center ${
          isClicking
            ? 'scale-75'
            : isHovering
            ? 'scale-125'
            : 'scale-100'
        }`}
      >
        {/* Subtle brand glow / halo */}
        <span className="absolute -inset-1 rounded-full bg-[#49756B]/25 blur-[2px]" />

        {/* Outer brand circle */}
        <div className="relative w-2.5 h-2.5 rounded-full bg-[#F0F5F0] border border-[#49756B] shadow-[0_1px_4px_rgba(73,117,107,0.35)] flex items-center justify-center">
          {/* Inner green center dot */}
          <span className="w-1 h-1 rounded-full bg-[#49756B]" />
        </div>
      </div>
    </div>
  );
};
