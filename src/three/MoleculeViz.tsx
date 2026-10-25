'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';

const NUM_PAIRS = 28;
const RADIUS = 0.85;
const HEIGHT = 4.2;
const TWIST = Math.PI * 3.2;

const _dummy = new THREE.Object3D();
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();

function HelixScene({
  pointerRef,
  onReady,
  onLowFps,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const atomsMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const rungsMeshRef = useRef<THREE.LineSegments | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  // Compute helix atoms and rungs
  const { rungGeometry, atomGeometry, atomMaterial, rungMaterial } = useMemo(() => {
    const colors = readThemeTokenColors();
    const accent = new THREE.Color(colors.accent);
    const border = new THREE.Color(colors.border);

    const aGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const aMat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.9,
    });

    // Build rungs between strand 1 and strand 2
    const rungPositions = new Float32Array(NUM_PAIRS * 6);
    for (let i = 0; i < NUM_PAIRS; i++) {
      const t = i / (NUM_PAIRS - 1);
      const angle = t * TWIST;
      const y = (t - 0.5) * HEIGHT;

      const x1 = Math.cos(angle) * RADIUS;
      const z1 = Math.sin(angle) * RADIUS;

      const x2 = Math.cos(angle + Math.PI) * RADIUS;
      const z2 = Math.sin(angle + Math.PI) * RADIUS;

      rungPositions[i * 6 + 0] = x1;
      rungPositions[i * 6 + 1] = y;
      rungPositions[i * 6 + 2] = z1;

      rungPositions[i * 6 + 3] = x2;
      rungPositions[i * 6 + 4] = y;
      rungPositions[i * 6 + 5] = z2;
    }

    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute('position', new THREE.BufferAttribute(rungPositions, 3));

    const rMat = new THREE.LineBasicMaterial({
      color: border,
      transparent: true,
      opacity: 0.45,
    });

    return {
      rungGeometry: rGeo,
      atomGeometry: aGeo,
      atomMaterial: aMat,
      rungMaterial: rMat,
    };
  }, []);

  // Sync theme colors
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      atomMaterial.color.set(colors.accent);
      rungMaterial.color.set(colors.border);
      invalidate();
    };
    syncColors();
    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });
    return () => observer.disconnect();
  }, [atomMaterial, rungMaterial, invalidate]);

  // Clean disposal
  useEffect(() => {
    return () => {
      rungGeometry.dispose();
      atomGeometry.dispose();
      atomMaterial.dispose();
      rungMaterial.dispose();
    };
  }, [rungGeometry, atomGeometry, atomMaterial, rungMaterial]);

  // Frame scheduler
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
    const elapsed = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Rotation around helical axis
      groupRef.current.rotation.y += 0.35 * clampedDelta;

      // Pointer tilt
      const targetX = pointerRef.current.y * 0.25;
      const targetZ = -pointerRef.current.x * 0.3;

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

    // Update nucleotide atom positions
    const mesh = atomsMeshRef.current;
    if (mesh) {
      const colors = readThemeTokenColors();
      _colorA.set(colors.accent);
      _colorB.set(colors.text);

      for (let i = 0; i < NUM_PAIRS; i++) {
        const t = i / (NUM_PAIRS - 1);
        const angle = t * TWIST;
        const y = (t - 0.5) * HEIGHT;

        // Atom Strand 1
        const x1 = Math.cos(angle) * RADIUS;
        const z1 = Math.sin(angle) * RADIUS;
        _dummy.position.set(x1, y, z1);
        const scale1 = 1 + Math.sin(elapsed * 2 + i * 0.2) * 0.15;
        _dummy.scale.setScalar(scale1);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i * 2, _dummy.matrix);
        mesh.setColorAt(i * 2, _colorA);

        // Atom Strand 2
        const x2 = Math.cos(angle + Math.PI) * RADIUS;
        const z2 = Math.sin(angle + Math.PI) * RADIUS;
        _dummy.position.set(x2, y, z2);
        const scale2 = 1 + Math.cos(elapsed * 2 + i * 0.2) * 0.15;
        _dummy.scale.setScalar(scale2);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i * 2 + 1, _dummy.matrix);
        mesh.setColorAt(i * 2 + 1, _colorB);
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0.4]}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} />

      <lineSegments ref={rungsMeshRef} geometry={rungGeometry} material={rungMaterial} />

      <instancedMesh
        ref={atomsMeshRef}
        args={[atomGeometry, atomMaterial, NUM_PAIRS * 2]}
        frustumCulled={false}
      />
    </group>
  );
}

export default function MoleculeViz({
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
      data-testid="molecule-viz-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute top-2 start-3 z-10 text-[10px] uppercase font-mono tracking-wider text-[var(--accent)] font-semibold pointer-events-none">
        Medical AI · Bio-Molecular Helix
      </div>
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'low-power',
          alpha: true,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <HelixScene pointerRef={pointerRef} onReady={onReady} onLowFps={onLowFps} />
      </Canvas>
    </div>
  );
}
