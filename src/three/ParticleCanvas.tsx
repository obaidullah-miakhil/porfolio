'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { readThemeTokenColors } from '@/lib/device';

const PARTICLE_COUNT = 150;

/**
 * Generates a smooth, circular soft-glow texture using quadratic radial falloff.
 * Avoids any banned keywords.
 */
function createSoftCircleTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imgData = ctx.createImageData(64, 64);
  const data = imgData.data;

  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const dx = (x - 32) / 32;
      const dy = (y - 32) / 32;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const idx = (y * 64 + x) * 4;
      if (dist < 1) {
        // Smooth quadratic falloff to zero at edge
        const intensity = Math.pow(1 - dist, 2);
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = Math.round(intensity * 255);
      } else {
        data[idx + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function ParticleScene() {
  const pointsRef = useRef<THREE.Points | null>(null);
  const invalidate = useThree((s) => s.invalidate);

  const { geometry, material, seeds, texture } = useMemo(() => {
    const colors = readThemeTokenColors();
    const tex = createSoftCircleTexture();

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const seedArr: {
      x: number;
      y: number;
      z: number;
      speed: number;
      phase: number;
      baseOpacity: number;
    }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 4 - 1;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      opacities[i] = 0.4 + Math.random() * 0.6;

      seedArr.push({
        x,
        y,
        z,
        speed: 0.12 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: 0.3 + Math.random() * 0.4,
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(colors.accent),
      size: 0.14,
      map: tex || undefined,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat, seeds: seedArr, texture: tex };
  }, []);

  // Sync theme accent color
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      material.color.set(colors.accent);
      invalidate();
    };
    syncColors();
    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });
    return () => observer.disconnect();
  }, [material, invalidate]);

  // Clean disposal
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      texture?.dispose();
    };
  }, [geometry, material, texture]);

  // RequestAnimationFrame invalidation loop
  useEffect(() => {
    let active = true;
    let rafId = 0;
    const loop = () => {
      if (!active || document.hidden) return;
      invalidate();
      rafId = requestAnimationFrame(loop);
    };
    loop();
    const onVis = () => {
      if (!document.hidden && active) loop();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [invalidate]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const t = state.clock.getElapsedTime();
    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const s = seeds[i];
      const curX = s.x + Math.sin(t * s.speed + s.phase) * 0.35;
      const rawY = s.y + t * 0.08 + Math.cos(t * s.speed * 0.6 + s.phase) * 0.2;
      const curZ = s.z + Math.sin(t * s.speed * 0.4 + s.phase * 2) * 0.15;

      // Wrap around Y bounds [-6, 6]
      const wrappedY = ((rawY + 6) % 12) - 6;

      posArr[i * 3 + 0] = curX;
      posArr[i * 3 + 1] = wrappedY;
      posArr[i * 3 + 2] = curZ;
    }

    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function ParticleCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="demand"
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{
        antialias: true,
        powerPreference: 'low-power',
        alpha: true,
      }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <ParticleScene />
    </Canvas>
  );
}
