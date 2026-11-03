import React, { useEffect, useRef } from 'react';

export const FootballCustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const clickRippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. COMPLETELY DISABLE ON MOBILE & TOUCH SCREENS
    const isMobileOrTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768;

    if (isMobileOrTouch) {
      return;
    }

    document.body.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId = 0;

    // Direct High-Performance Transform Update (NO REACT RE-RENDERS)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        dotRef.current.style.opacity = '1';
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = '1';
      }
    };

    // Snappy, Event-Driven Hover Detection (Zero scanning on mousemove)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a, [role="button"], input, textarea, select, .cursor-pointer')) {
        if (ringRef.current) {
          ringRef.current.classList.add('cursor-hovered');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a, [role="button"], input, textarea, select, .cursor-pointer')) {
        if (ringRef.current) {
          ringRef.current.classList.remove('cursor-hovered');
        }
      }
    };

    const handleMouseDown = () => {
      if (ringRef.current) {
        ringRef.current.classList.add('cursor-clicked');
      }
      if (clickRippleRef.current) {
        clickRippleRef.current.classList.remove('cursor-ripple-active');
        // Trigger reflow to restart css animation exactly on the mouse cursor
        void clickRippleRef.current.offsetWidth;
        clickRippleRef.current.classList.add('cursor-ripple-active');
      }
    };

    const handleMouseUp = () => {
      if (ringRef.current) {
        ringRef.current.classList.remove('cursor-clicked');
      }
    };

    const handleMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    // Pure 120 FPS RAF loop with crisp 0.38 lerp (Zero lag)
    const tick = () => {
      const ease = 0.38; // Snappy & instant response
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed inset-0 pointer-events-none z-[999999] overflow-hidden select-none"
    >
      {/* 1. TACTICAL RING (POSITIONED PRECISELY VIA TRANSLATE3D) */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 pointer-events-none opacity-0 will-change-transform"
      >
        <div className="cursor-inner relative flex items-center justify-center">
          {/* Subtle tactical crosshair pips */}
          <span className="absolute -top-1 w-1 h-[1.5px] bg-purple-500 dark:bg-purple-300 rounded-full" />
          <span className="absolute -bottom-1 w-1 h-[1.5px] bg-purple-500 dark:bg-purple-300 rounded-full" />
          <span className="absolute -left-1 h-1 w-[1.5px] bg-purple-500 dark:bg-purple-300 rounded-full" />
          <span className="absolute -right-1 h-1 w-[1.5px] bg-purple-500 dark:bg-purple-300 rounded-full" />

          {/* Click Ripple: Nested directly inside the cursor so it NEVER jumps to (0,0) */}
          <span
            ref={clickRippleRef}
            className="absolute -inset-1 rounded-full border-2 border-purple-500 dark:border-purple-300 opacity-0 pointer-events-none"
          />
        </div>
      </div>

      {/* 2. PINPOINT CENTER DOT (ULTRA PRECISE) */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-purple-600 dark:bg-purple-400 shadow-[0_0_6px_#a855f7] opacity-0 pointer-events-none will-change-transform"
      />
    </div>
  );
};
