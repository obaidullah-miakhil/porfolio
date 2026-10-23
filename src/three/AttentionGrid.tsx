'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';

const GRID_SIZE = 14;
const INSTANCE_COUNT = GRID_SIZE * GRID_SIZE;
const SPACING = 0.28;

const _dummy = new THREE.Object3D();
const _instanceColor = new THREE.Color();
const _accentColor = new THREE.Color();
const _borderColor = new THREE.Color();

function AttentionGridScene({
  onReady,
  onLowFps,
}: {
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  const { cubeGeometry, cubeMaterial, planeGeometry, planeMaterial } =
    useMemo(() => {
      const colors = readThemeTokenColors();
      _accentColor.set(colors.accent);
      _borderColor.set(colors.border);

      const cGeo = new THREE.BoxGeometry(0.22, 1, 0.22);
      const cMat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        flatShading: true,
      });

      const totalSpan = GRID_SIZE * SPACING + 0.35;
      const pGeo = new THREE.PlaneGeometry(totalSpan, totalSpan);
      const pMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colors.border),
        side: THREE.DoubleSide,
      });

      return {
        cubeGeometry: cGeo,
        cubeMaterial: cMat,
        planeGeometry: pGeo,
        planeMaterial: pMat,
      };
    }, []);

  // Sync theme tokens when Light/Dark changes
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      _accentColor.set(colors.accent);
      _borderColor.set(colors.border);
      planeMaterial.color.set(colors.border);
      invalidate();
    };

    syncColors();

    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });

    return () => observer.disconnect();
  }, [planeMaterial, invalidate]);

  // Dispose geometries and materials on unmount
  useEffect(() => {
    return () => {
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
    };
  }, [cubeGeometry, cubeMaterial, planeGeometry, planeMaterial]);

  // Demand loop + visibility handler
  useEffect(() => {
    let active = true;
    let timerId = 0;
    let rafId = 0;

    onReady?.();

    const scheduleNext = () => {
      if (!active || document.hidden) return;
      if (isSoftware) {
        timerId = window.setTimeout(() => {
          if (active && !document.hidden) {
            invalidate();
            scheduleNext();
          }
        }, 90);
      } else {
        rafId = window.requestAnimationFrame(() => {
          if (active && !document.hidden) {
            invalidate();
            scheduleNext();
          }
        });
      }
    };

    const onVisibility = () => {
      if (!document.hidden && active) {
        scheduleNext();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    scheduleNext();

    return () => {
      active = false;
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [invalidate, isSoftware, onReady]);

  const frameSampleRef = useRef({ count: 0, totalDelta: 0, checked: false });

  useFrame((state, delta) => {
    const instanced = meshRef.current;
    if (!instanced) return;

    if (!isSoftware && !frameSampleRef.current.checked) {
      const sample = frameSampleRef.current;
      if (delta > 0 && delta < 0.5) {
        sample.count += 1;
        sample.totalDelta += delta;
        if (sample.count >= 24) {
          sample.checked = true;
          const avgFps = sample.count / sample.totalDelta;
          if (avgFps < 30) {
            onLowFps?.();
            return;
          }
        }
      }
    }

    const t = state.clock.getElapsedTime() * 0.85;
    const half = (GRID_SIZE - 1) / 2;

    // Two moving attention focal centers (like Grad-CAM activation regions)
    const cx1 = Math.sin(t * 0.7) * 2.8;
    const cz1 = Math.cos(t * 0.55) * 2.8;
    const cx2 = Math.cos(t * 0.45 + 1.4) * 3.1;
    const cz2 = Math.sin(t * 0.65 + 0.8) * 2.6;

    let idx = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const gx = c - half;
        const gz = r - half;

        const d1 = (gx - cx1) * (gx - cx1) + (gz - cz1) * (gz - cz1);
        const d2 = (gx - cx2) * (gx - cx2) + (gz - cz2) * (gz - cz2);

        const w1 = Math.exp(-d1 / 6.5);
        const w2 = Math.exp(-d2 / 8.0) * 0.75;
        const weight = Math.min(1, w1 + w2);

        // Quantize height & color steps for crisp discrete aesthetic
        const steppedWeight = Math.floor(weight * 6) / 6;
        const height = 0.08 + steppedWeight * 1.15;

        _dummy.position.set(gx * SPACING, height / 2 + 0.01, gz * SPACING);
        _dummy.scale.set(1, height, 1);
        _dummy.updateMatrix();
        instanced.setMatrixAt(idx, _dummy.matrix);

        _instanceColor.lerpColors(
          _borderColor,
          _accentColor,
          0.25 + steppedWeight * 0.75
        );
        instanced.setColorAt(idx, _instanceColor);

        idx += 1;
      }
    }

    instanced.instanceMatrix.needsUpdate = true;
    if (instanced.instanceColor) {
      instanced.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group rotation={[0, Math.PI / 4, 0]} position={[0, -0.35, 0]}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 5]} intensity={0.95} />

      {/* Base plane in --border */}
      <mesh
        geometry={planeGeometry}
        material={planeMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      />

      {/* 14x14 InstancedMesh of attention cubes in --accent */}
      <instancedMesh
        ref={meshRef}
        args={[cubeGeometry, cubeMaterial, INSTANCE_COUNT]}
        frustumCulled={false}
      />
    </group>
  );
}

export default function AttentionGrid({
  onReady,
  onLowFps,
}: {
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const antialias =
    typeof window !== 'undefined' && window.devicePixelRatio === 1;

  return (
    <div
      aria-hidden="true"
      data-testid="research-3d-canvas-wrapper"
      className="w-full h-full"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 3.8, 5.2], fov: 36 }}
        gl={{
          antialias,
          powerPreference: 'low-power',
          alpha: true,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <AttentionGridScene onReady={onReady} onLowFps={onLowFps} />
      </Canvas>
    </div>
  );
}
