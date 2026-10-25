'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { shouldSkipWebGL } from '@/lib/device';

const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false });

export function ParticleField() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!shouldSkipWebGL()) {
      // Delay mount so it doesn't block LCP
      const timer = setTimeout(() => setShouldRender(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="particle-field-container" aria-hidden="true">
      <ParticleCanvas />
    </div>
  );
}
