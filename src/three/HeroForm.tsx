'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  varying vec3 vViewPosition;

  // Ashima 3D Simplex Noise
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 dir = normalize(position);
    float n = snoise(dir * 1.65 + vec3(uTime * 0.22));
    vec3 displaced = position + dir * (n * uAmplitude);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uBg;
  varying vec3 vViewPosition;

  void main() {
    vec3 fdx = dFdx(vViewPosition);
    vec3 fdy = dFdy(vViewPosition);
    vec3 faceNormal = normalize(cross(fdx, fdy));

    vec3 lightDir = normalize(vec3(0.55, 0.75, 0.65));
    float diff = max(dot(faceNormal, lightDir), 0.0);
    float ambient = 0.38;
    float lighting = clamp(ambient + diff * 0.68, 0.25, 1.08);

    vec3 color = mix(uBg, uAccent, lighting);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const WIREFRAME_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uWireColor;
  uniform float uOpacity;

  void main() {
    gl_FragColor = vec4(uWireColor, uOpacity);
  }
`;

const MAX_TILT_RAD = (8 * Math.PI) / 180; // Max 8 degrees per spec

function FacetedIcosahedronScene({
  pointerRef,
  scrollRef,
  onReady,
  onLowFps,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  const { geometry, solidMaterial, wireMaterial } = useMemo(() => {
    const colors = readThemeTokenColors();
    // Faceted icosahedron (detail 4) with non-indexed vertices for crisp flat facets
    const baseGeo = new THREE.IcosahedronGeometry(1.38, 4);
    const geo = baseGeo.toNonIndexed();
    baseGeo.dispose();

    const uTime = { value: 0 };
    const uAmplitude = { value: 0.16 };

    const solidMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime,
        uAmplitude,
        uAccent: { value: new THREE.Color(colors.accent) },
        uBg: { value: new THREE.Color(colors.bg) },
      },
    });

    const wireMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: WIREFRAME_FRAGMENT_SHADER,
      uniforms: {
        uTime,
        uAmplitude,
        uWireColor: { value: new THREE.Color(colors.text) },
        uOpacity: { value: 0.15 },
      },
      wireframe: true,
      transparent: true,
      depthWrite: false,
    });

    return {
      geometry: geo,
      solidMaterial: solidMat,
      wireMaterial: wireMat,
    };
  }, []);

  // Sync theme tokens on mount and when theme toggles
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      solidMaterial.uniforms.uAccent.value.set(colors.accent);
      solidMaterial.uniforms.uBg.value.set(colors.bg);
      wireMaterial.uniforms.uWireColor.value.set(colors.text);
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

  // Demand-driven frame scheduler + visibility listener
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
        }, 80);
      } else {
        rafId = window.requestAnimationFrame(() => {
          if (active && !document.hidden) {
            invalidate();
            scheduleNext();
          }
        });
      }
    };

    scheduleNext();

    const onVisibility = () => {
      if (!document.hidden && active) scheduleNext();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      active = false;
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [invalidate, isSoftware, onReady]);

  // FPS probe over first 30 frames (unmounts to poster if < 30 FPS on hardware WebGL)
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

    solidMaterial.uniforms.uTime.value = elapsed;
    wireMaterial.uniforms.uTime.value = elapsed;

    // Scroll progress eases noise amplitude
    const targetAmp = 0.16 - Math.min(1, scrollRef.current) * 0.08;
    const nextAmp = THREE.MathUtils.damp(
      solidMaterial.uniforms.uAmplitude.value,
      targetAmp,
      4,
      clampedDelta
    );
    solidMaterial.uniforms.uAmplitude.value = nextAmp;
    wireMaterial.uniforms.uAmplitude.value = nextAmp;

    if (groupRef.current) {
      // Slow rotation (~0.05 rad/s)
      groupRef.current.rotation.y += 0.05 * clampedDelta;

      // Damped pointer parallax (max 8 deg tilt)
      const targetX = pointerRef.current.y * MAX_TILT_RAD;
      const targetZ = -pointerRef.current.x * MAX_TILT_RAD;

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetX,
        3.5,
        clampedDelta
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        targetZ,
        3.5,
        clampedDelta
      );
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={1.0} />
      <mesh geometry={geometry} material={solidMaterial} />
      <mesh geometry={geometry} material={wireMaterial} scale={1.002} />
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
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 800;
      scrollRef.current = Math.max(0, Math.min(1, window.scrollY / vh));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const antialias =
    typeof window !== 'undefined' && window.devicePixelRatio === 1;

  return (
    <div
      aria-hidden="true"
      data-testid="hero-3d-canvas-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        gl={{
          antialias,
          powerPreference: 'low-power',
          alpha: true,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <FacetedIcosahedronScene
          pointerRef={pointerRef}
          scrollRef={scrollRef}
          onReady={onReady}
          onLowFps={onLowFps}
        />
      </Canvas>
    </div>
  );
}
