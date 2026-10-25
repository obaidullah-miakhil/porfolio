'use client';

import React, { useEffect, useRef } from 'react';

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only run on desktop with fine pointer and no reduced-motion preference
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const el = glowRef.current;
    if (!el) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;
    let isVisible = false;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        el.style.opacity = '1';
      }
    };

    const handlePointerLeave = () => {
      isVisible = false;
      el.style.opacity = '0';
    };

    const animate = () => {
      // Lerp smoothing
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      el.style.transform = `translate3d(${currentX - 160}px, ${currentY - 160}px, 0)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="pointer-events-none fixed top-0 left-0 w-80 h-80 rounded-full bg-[var(--accent)] opacity-0 blur-[100px] z-[1] mix-blend-screen transition-opacity duration-500 ease-out"
    />
  );
}
