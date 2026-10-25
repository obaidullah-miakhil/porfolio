'use client';

import React, { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, current)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="scroll-progress fixed top-0 inset-x-0 h-[3px] z-50 pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-[var(--accent)] transition-all duration-75 ease-out shadow-[0_0_12px_var(--accent)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
