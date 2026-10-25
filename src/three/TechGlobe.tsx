'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';

const TECH_ITEMS = [
  'Python',
  'PyTorch',
  'TensorFlow',
  'OpenCV',
  'Next.js',
  'TypeScript',
  'HuggingFace',
  'CUDA',
  'Scikit-learn',
  'Docker',
  'FastAPI',
  'Git',
];

const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

function GlobeScene({
  pointerRef,
  onReady,
  onLowFps,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const nodesMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  // Compute sphere geometry, wireframe, and satellites
  const { sphereGeo, wireMat, pointGeo, pointMat, satellites } = useMemo(() => {
    const colors = readThemeTokenColors();
    const accent = new THREE.Color(colors.accent);
    const border = new THREE.Color(colors.border);

    // Geodesic / wireframe sphere
    const sGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const wMat = new THREE.MeshBasicMaterial({
      color: border,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    // Satellites for tech items on Fibonacci sphere distribution
    const count = TECH_ITEMS.length;
    const satList: { pos: THREE.Vector3; name: string; phase: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const r = 1.95; // Slightly outside the globe
      const x = Math.cos(theta) * radiusAtY * r;
      const z = Math.sin(theta) * radiusAtY * r;

      satList.push({
        pos: new THREE.Vector3(x, y * r, z),
        name: TECH_ITEMS[i],
        phase: Math.random() * Math.PI * 2,
      });
    }

    const pGeo = new THREE.SphereGeometry(0.08, 10, 10);
    const pMat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.95,
    });

    return {
      sphereGeo: sGeo,
      wireMat: wMat,
      pointGeo: pGeo,
      pointMat: pMat,
      satellites: satList,
    };
  }, []);

  // Sync theme colors
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      wireMat.color.set(colors.border);
      pointMat.color.set(colors.accent);
      invalidate();
    };
    syncColors();
    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });
    return () => observer.disconnect();
  }, [wireMat, pointMat, invalidate]);

  // Clean disposal
  useEffect(() => {
    return () => {
      sphereGeo.dispose();
      pointGeo.dispose();
      wireMat.dispose();
      pointMat.dispose();
    };
  }, [sphereGeo, pointGeo, wireMat, pointMat]);

  // Animation scheduler
  useEffect(() => {
    let active = true;
    let timerId = 0;
    let rafId = 0;

    onReady?.();

    const schedule = () => {
      if (isSoftware) {
        timerId = window.setTimeout(() => {
          if (active && !document.hidden) {
            invalidate();
            schedule();
          }
        }, 80);
      } else {
        rafId = window.requestAnimationFrame(() => {
          if (active && !document.hidden) {
            invalidate();
            schedule();
          }
        });
      }
    };
    schedule();

    const onVis = () => {
      if (!document.hidden && active) schedule();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      active = false;
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [invalidate, isSoftware, onReady]);

  // FPS Probe
  const frameProbeRef = useRef({ count: 0, totalDelta: 0, done: false });

  useFrame((state, delta) => {
    if (!isSoftware && !frameProbeRef.current.done) {
      const probe = frameProbeRef.current;
      if (delta > 0 && delta < 0.5) {
        probe.count += 1;
        probe.totalDelta += delta;
        if (probe.count >= 30) {
          probe.done = true;
          const avgFps = probe.count / probe.totalDelta;
          if (avgFps < 30) {
            onLowFps?.();
            return;
          }
        }
      }
    }

    const clampedDelta = Math.min(delta, 0.06);
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Rotate globe continuously
      groupRef.current.rotation.y += 0.2 * clampedDelta;

      // Mouse tilt
      const targetX = pointerRef.current.y * 0.3;
      const targetZ = -pointerRef.current.x * 0.35;

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetX,
        4,
        clampedDelta
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        targetZ,
        4,
        clampedDelta
      );
    }

    // Update satellite nodes
    const mesh = nodesMeshRef.current;
    if (mesh) {
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        const pulse = 1 + Math.sin(t * 3 + sat.phase) * 0.25;

        _dummy.position.copy(sat.pos);
        _dummy.scale.setScalar(pulse);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i, _dummy.matrix);

        const brightness = 0.8 + Math.sin(t * 2.5 + sat.phase) * 0.2;
        _color.setRGB(brightness, brightness, brightness);
        mesh.setColorAt(i, _color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} />

      {/* Wireframe globe */}
      <mesh geometry={sphereGeo} material={wireMat} />

      {/* Orbiting tech nodes */}
      <instancedMesh
        ref={nodesMeshRef}
        args={[pointGeo, pointMat, satellites.length]}
        frustumCulled={false}
      />
    </group>
  );
}

export default function TechGlobe({
  onReady,
  onLowFps,
}: {
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const pointerRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerRef.current.x = Math.max(-1, Math.min(1, nx));
    pointerRef.current.y = Math.max(-1, Math.min(1, ny));
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  return (
    <div
      aria-hidden="true"
      data-testid="tech-globe-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-[260px] sm:h-[300px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] backdrop-blur-sm overflow-hidden flex items-center justify-center"
    >
      <div className="absolute top-2 start-3 z-10 text-[10px] uppercase font-mono tracking-wider text-[var(--accent)] font-semibold pointer-events-none">
        Interactive Tech Ecosystem · Orbit
      </div>

      {/* Tech pills orbiting indicator */}
      <div className="absolute bottom-2 inset-x-3 z-10 flex flex-wrap gap-1.5 justify-center pointer-events-none opacity-80">
        {TECH_ITEMS.slice(0, 6).map((item) => (
          <span
            key={item}
            className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] font-mono"
          >
            {item}
          </span>
        ))}
      </div>

      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'low-power',
          alpha: true,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <GlobeScene pointerRef={pointerRef} onReady={onReady} onLowFps={onLowFps} />
      </Canvas>
    </div>
  );
}
