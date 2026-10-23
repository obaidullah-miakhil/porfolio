'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  varying vec3 vViewPosition;

  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(
      permute(
        permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0)
      )
      + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    float n = snoise(position * 1.15 + vec3(uTime * 0.28, uTime * 0.22, -uTime * 0.19));
    vec3 displaced = position + normal * (n * uAmplitude);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uAccentColor;
  uniform vec3 uBgColor;
  varying vec3 vViewPosition;

  void main() {
    vec3 fdx = dFdx(vViewPosition);
    vec3 fdy = dFdy(vViewPosition);
    vec3 faceNormal = normalize(cross(fdx, fdy));

    vec3 lightDir = normalize(vec3(0.55, 0.75, 0.85));
    float diff = max(dot(faceNormal, lightDir), 0.0);

    // Quantize into discrete flat facet steps so each triangle has a single flat tone
    float stepped = floor(diff * 5.0) / 5.0;
    float shade = 0.32 + stepped * 0.68;

    vec3 finalColor = mix(uBgColor, uAccentColor, shade);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const WIRE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uTextColor;
  void main() {
    gl_FragColor = vec4(uTextColor, 0.15);
  }
`;

interface HeroFormMeshProps {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  onReady?: () => void;
  onLowFps?: () => void;
}

function HeroFormMesh({ pointerRef, onReady, onLowFps }: HeroFormMeshProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  const { geometry, solidMaterial, wireMaterial } = useMemo(() => {
    const colors = readThemeTokenColors();
    const geo = new THREE.IcosahedronGeometry(1.42, 4);

    const solidMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 0.22 },
        uAccentColor: { value: new THREE.Color(colors.accent) },
        uBgColor: { value: new THREE.Color(colors.surface) },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    const wireMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 0.222 },
        uTextColor: { value: new THREE.Color(colors.text) },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: WIRE_FRAGMENT_SHADER,
      wireframe: true,
      transparent: true,
      depthWrite: false,
    });

    return { geometry: geo, solidMaterial: solidMat, wireMaterial: wireMat };
  }, []);

  // Sync CSS theme variables on light/dark toggle
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      solidMaterial.uniforms.uAccentColor.value.set(colors.accent);
      solidMaterial.uniforms.uBgColor.value.set(colors.surface);
      wireMaterial.uniforms.uTextColor.value.set(colors.text);
      invalidate();
    };

    syncColors();

    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });

    return () => observer.disconnect();
  }, [solidMaterial, wireMaterial, invalidate]);

  // Dispose geometries and materials on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      solidMaterial.dispose();
      wireMaterial.dispose();
    };
  }, [geometry, solidMaterial, wireMaterial]);

  // Demand-based loop + FPS probe + visibility pause
  useEffect(() => {
    let active = true;
    let timerId = 0;
    let rafId = 0;

    onReady?.();

    const scheduleNext = () => {
      if (!active) return;
      if (document.hidden) return;
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
    const clampedDelta = Math.min(delta, 0.1);

    // Quick first-frames FPS probe on hardware GPUs
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

    const elapsed = state.clock.getElapsedTime();
    solidMaterial.uniforms.uTime.value = elapsed;
    wireMaterial.uniforms.uTime.value = elapsed;

    // Ease noise amplitude down as user scrolls past hero
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollFactor = Math.max(0.25, 1 - Math.min(1, scrollY / 500) * 0.75);
    const targetAmp = 0.22 * scrollFactor;
    solidMaterial.uniforms.uAmplitude.value = THREE.MathUtils.damp(
      solidMaterial.uniforms.uAmplitude.value,
      targetAmp,
      4,
      clampedDelta
    );
    wireMaterial.uniforms.uAmplitude.value =
      solidMaterial.uniforms.uAmplitude.value + 0.002;

    if (groupRef.current) {
      // Slow rotation (~0.05 rad/s) + pointer parallax tilt (max 8 deg = 0.14 rad)
      const maxTilt = 0.14;
      const targetRotX = pointerRef.current.y * maxTilt;
      const targetRotZ = -pointerRef.current.x * maxTilt * 0.5;

      groupRef.current.rotation.y += clampedDelta * 0.05;
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        5,
        clampedDelta
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        targetRotZ,
        5,
        clampedDelta
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={solidMaterial} />
      <mesh geometry={geometry} material={wireMaterial} />
    </group>
  );
}

export default function HeroForm({
  onReady,
  onLowFps,
}: {
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const antialias =
    typeof window !== 'undefined' && window.devicePixelRatio === 1;

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
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
      data-testid="hero-3d-canvas-wrapper"
      className="w-full h-full"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 0, 4.65], fov: 40 }}
        gl={{
          antialias,
          powerPreference: 'low-power',
          alpha: true,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <HeroFormMesh
          pointerRef={pointerRef}
          onReady={onReady}
          onLowFps={onLowFps}
        />
      </Canvas>
    </div>
  );
}
