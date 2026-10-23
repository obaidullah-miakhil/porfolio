'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';
import { Brain, Zap, RefreshCw, Activity, Sparkles, ShieldCheck } from 'lucide-react';

export type AIMode = 'medical' | 'transformer' | 'synapse';

interface BrainNode {
  base: THREE.Vector3;
  current: THREE.Vector3;
  hemisphere: 'left' | 'right';
  region: string;
  isFocalIch: boolean;
  uncertainty: number; // MC Dropout variance
  activity: number;
  tokenLabel?: string;
}

interface SynapticEdge {
  start: number;
  end: number;
  crossHemisphere: boolean;
  attentionWeight: number;
}

interface SignalImpulse {
  edgeIndex: number;
  progress: number;
  speed: number;
  color: THREE.Color;
}

// Generate anatomically-inspired Dual-Hemisphere Neural Brain Cortex + Multilingual Transformer Lattice
function generateAIBrainNetwork() {
  const nodes: BrainNode[] = [];
  const edges: SynapticEdge[] = [];

  const hemisphereNodes = 36; // 36 per hemisphere = 72 cortical nodes
  const regions = [
    'Frontal Lobe',
    'Temporal Cortex',
    'Parietal Gyrus',
    'Occipital Cortex',
    'Motor Strip',
    'Broca Area',
  ];

  const multilingualTokens = [
    { label: 'ENG: Clinical', lang: 'English' },
    { label: 'PAS: روغتیا', lang: 'Pashto' },
    { label: 'DAR: درمان', lang: 'Dari' },
    { label: 'URD: تشخیص', lang: 'Urdu' },
    { label: 'MED: CT-ICH', lang: 'Medical AI' },
    { label: 'ATTN: W_q', lang: 'Query Head' },
  ];

  // 1. Generate Left & Right Hemispheres
  for (let h = 0; h < 2; h++) {
    const isRight = h === 1;
    const signX = isRight ? 1 : -1;

    for (let i = 0; i < hemisphereNodes; i++) {
      const u = i / (hemisphereNodes - 1);
      const theta = u * Math.PI * 1.8;
      const phi = Math.acos(2 * (i % 6) / 5 - 1);

      // Anatomical brain ellipsoid scaling: elongated Y/Z, separated X
      const radX = 0.85 + Math.sin(theta * 2.5) * 0.18;
      const radY = 1.15 + Math.cos(phi * 2.0) * 0.22;
      const radZ = 1.35 + Math.sin(phi * 3.0) * 0.24;

      const x = signX * (0.35 + Math.abs(Math.sin(theta) * Math.sin(phi)) * radX);
      const y = Math.cos(phi) * radY;
      const z = Math.cos(theta) * Math.sin(phi) * radZ;

      const base = new THREE.Vector3(x, y, z);
      const regionIdx = i % regions.length;
      const region = `${isRight ? 'Right' : 'Left'} ${regions[regionIdx]}`;

      // Simulate MC Dropout focal uncertainty in Right Temporal-Parietal (ICH detection site)
      const isFocalIch = isRight && (regionIdx === 1 || regionIdx === 2);
      const uncertainty = isFocalIch ? 0.068 + Math.random() * 0.035 : 0.012 + Math.random() * 0.015;

      const tokenMeta = multilingualTokens[i % multilingualTokens.length];

      nodes.push({
        base: base.clone(),
        current: base.clone(),
        hemisphere: isRight ? 'right' : 'left',
        region,
        isFocalIch,
        uncertainty,
        activity: isFocalIch ? 0.8 : 0.1,
        tokenLabel: tokenMeta.label,
      });
    }
  }

  // 2. Intra-hemispheric synaptic pathways & corpus callosum cross-connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = nodes[i].base.distanceTo(nodes[j].base);
      const isSameHemisphere = nodes[i].hemisphere === nodes[j].hemisphere;

      if (isSameHemisphere && d > 0.42 && d < 0.95) {
        edges.push({
          start: i,
          end: j,
          crossHemisphere: false,
          attentionWeight: Math.max(0.2, 1 - d / 0.95),
        });
      } else if (!isSameHemisphere && d < 0.98 && Math.abs(nodes[i].base.y) < 0.6) {
        // Corpus callosum cross-lingual bridge
        edges.push({
          start: i,
          end: j,
          crossHemisphere: true,
          attentionWeight: 0.85,
        });
      }
    }
  }

  // 3. Synaptic signal impulses
  const signals: SignalImpulse[] = [];
  const signalCount = Math.min(22, edges.length);
  for (let s = 0; s < signalCount; s++) {
    signals.push({
      edgeIndex: (s * 4) % edges.length,
      progress: Math.random(),
      speed: 0.4 + Math.random() * 0.5,
      color: new THREE.Color('#FFFFFF'),
    });
  }

  return { nodes, edges, signals };
}

interface BrainSceneProps {
  pointerRef: React.MutableRefObject<{ x: number; y: number; isDragging: boolean; clickTrigger: number }>;
  mode: AIMode;
  showUncertainty: boolean;
  onHoverNode?: (node: BrainNode | null) => void;
  onReady?: () => void;
  onLowFps?: () => void;
}

function BrainMeshScene({
  pointerRef,
  mode,
  showUncertainty,
  onHoverNode,
  onReady,
  onLowFps,
}: BrainSceneProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const coreRef = useRef<THREE.Group | null>(null);
  const attentionRingRef = useRef<THREE.Mesh | null>(null);
  const nodesMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const signalsMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const uncertaintyParticlesRef = useRef<THREE.Points | null>(null);

  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  const { nodes, edges, signals } = useMemo(() => generateAIBrainNetwork(), []);

  // Shockwave state
  const shockwaveRef = useRef({ radius: 99, active: false, maxRadius: 3.8 });
  const prevTriggerRef = useRef(0);
  const rotationVelocityRef = useRef({ x: 0, y: 0.003 });

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const edgeLinePositions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges]);

  // Uncertainty cloud geometry (Monte Carlo Dropout sampling distribution)
  const { uncertaintyGeo, uncertaintyMat } = useMemo(() => {
    const count = 48;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Clustered around the focal ICH detection area in Right Hemisphere
      const theta = Math.random() * Math.PI * 2;
      const r = 0.45 + Math.random() * 0.55;
      positions[i * 3] = 0.65 + Math.cos(theta) * r;
      positions[i * 3 + 1] = 0.2 + (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 2] = 0.35 + Math.sin(theta) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.075,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    return { uncertaintyGeo: geo, uncertaintyMat: mat };
  }, []);

  // Materials & Geometries
  const {
    nodeGeometry,
    nodeMaterial,
    lineMaterial,
    crossLineMaterial,
    ringGeometry,
    ringMaterial,
    coreGeometry,
    coreMaterial,
    signalGeometry,
    signalMaterial,
  } = useMemo(() => {
    const colors = readThemeTokenColors();

    const nodeGeo = new THREE.SphereGeometry(0.052, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors.accent),
    });

    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(colors.accent),
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });

    const crossLineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#38bdf8'),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });

    const ringGeo = new THREE.TorusGeometry(1.95, 0.009, 6, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors.accent),
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });

    const coreGeo = new THREE.IcosahedronGeometry(0.42, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.accent),
      metalness: 0.3,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
      flatShading: true,
    });

    const sigGeo = new THREE.SphereGeometry(0.042, 8, 8);
    const sigMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFFFFF'),
    });

    return {
      nodeGeometry: nodeGeo,
      nodeMaterial: nodeMat,
      lineMaterial: lineMat,
      crossLineMaterial: crossLineMat,
      ringGeometry: ringGeo,
      ringMaterial: ringMat,
      coreGeometry: coreGeo,
      coreMaterial: coreMat,
      signalGeometry: sigGeo,
      signalMaterial: sigMat,
    };
  }, []);

  // Sync theme token colors
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      const accent = new THREE.Color(colors.accent);
      nodeMaterial.color.set(accent);
      lineMaterial.color.set(accent);
      ringMaterial.color.set(accent);
      coreMaterial.color.set(accent);
      invalidate();
    };

    syncColors();
    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });

    return () => observer.disconnect();
  }, [nodeMaterial, lineMaterial, ringMaterial, coreMaterial, invalidate]);

  // Disposal
  useEffect(() => {
    return () => {
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      crossLineMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      signalGeometry.dispose();
      signalMaterial.dispose();
      uncertaintyGeo.dispose();
      uncertaintyMat.dispose();
    };
  }, [
    nodeGeometry,
    nodeMaterial,
    lineMaterial,
    crossLineMaterial,
    ringGeometry,
    ringMaterial,
    coreGeometry,
    coreMaterial,
    signalGeometry,
    signalMaterial,
    uncertaintyGeo,
    uncertaintyMat,
  ]);

  // Frame schedule
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

  // Drag listener
  useEffect(() => {
    const onDrag = (e: Event) => {
      const custom = e as CustomEvent<{ dx: number; dy: number }>;
      if (!custom.detail || !groupRef.current) return;
      const { dx, dy } = custom.detail;
      groupRef.current.rotation.y += dx * 0.007;
      groupRef.current.rotation.x += dy * 0.007;
      rotationVelocityRef.current.y = dx * 0.004;
      rotationVelocityRef.current.x = dy * 0.004;
      invalidate();
    };

    const onReset = () => {
      if (groupRef.current) {
        groupRef.current.rotation.set(0, 0, 0);
        rotationVelocityRef.current = { x: 0, y: 0.003 };
        invalidate();
      }
    };

    window.addEventListener('hero-3d-drag', onDrag);
    window.addEventListener('hero-3d-reset', onReset);
    return () => {
      window.removeEventListener('hero-3d-drag', onDrag);
      window.removeEventListener('hero-3d-reset', onReset);
    };
  }, [invalidate]);

  // Frame loop
  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.06);
    const elapsed = state.clock.getElapsedTime();

    // User click trigger -> shockwave ripple
    if (pointerRef.current.clickTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = pointerRef.current.clickTrigger;
      shockwaveRef.current.radius = 0;
      shockwaveRef.current.active = true;
      rotationVelocityRef.current.y += 0.012;
    }

    if (shockwaveRef.current.active) {
      shockwaveRef.current.radius += clampedDelta * 4.5;
      if (shockwaveRef.current.radius > shockwaveRef.current.maxRadius) {
        shockwaveRef.current.active = false;
      }
    }

    // 1. Morph & update cortical nodes based on active AI Mode
    if (nodesMeshRef.current) {
      const shockRad = shockwaveRef.current.radius;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Mode-specific geometric morph
        if (mode === 'transformer') {
          // Flatten into transformer attention cylindrical token projection
          const angle = (i / nodes.length) * Math.PI * 2;
          const targetY = (node.base.y * 0.7);
          const targetX = Math.cos(angle) * 1.45;
          const targetZ = Math.sin(angle) * 1.45;
          node.current.x = THREE.MathUtils.lerp(node.current.x, targetX, clampedDelta * 3.5);
          node.current.y = THREE.MathUtils.lerp(node.current.y, targetY, clampedDelta * 3.5);
          node.current.z = THREE.MathUtils.lerp(node.current.z, targetZ, clampedDelta * 3.5);
        } else if (mode === 'medical') {
          // Dual cerebral hemisphere brain cortex
          const breathe = Math.sin(elapsed * 2.0 + (node.hemisphere === 'right' ? 0.8 : 0)) * 0.04;
          node.current.lerp(node.base, clampedDelta * 4.0).multiplyScalar(1 + breathe);
        } else {
          // Deep Synapse manifold
          const pulse = Math.sin(elapsed * 1.5 + node.base.y * 3) * 0.08;
          node.current.lerp(node.base, clampedDelta * 3.0).multiplyScalar(1 + pulse);
        }

        // Shockwave activation
        const dist = node.current.length();
        if (shockwaveRef.current.active && Math.abs(dist - shockRad) < 0.4) {
          node.activity = 1.0;
        } else {
          node.activity = Math.max(0, node.activity - clampedDelta * 2.5);
        }

        // ICH Focal area heightened glow in Medical AI mode
        const isFocal = node.isFocalIch && mode === 'medical';
        const focalPulse = isFocal ? Math.sin(elapsed * 4.0) * 0.3 + 0.7 : 0;

        const scale = 1 + node.activity * 1.6 + focalPulse * 0.6;
        dummy.position.copy(node.current);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        nodesMeshRef.current.setMatrixAt(i, dummy.matrix);

        // Node Color: Focal ICH = luminous amber/cyan; Shockwave = white; Default = accent
        if (node.activity > 0.1) {
          tempColor.set('#FFFFFF').lerp(nodeMaterial.color, 1 - node.activity);
        } else if (isFocal) {
          tempColor.set('#38BDF8'); // Cyan Medical ICH indicator
        } else {
          tempColor.copy(nodeMaterial.color);
        }
        nodesMeshRef.current.setColorAt(i, tempColor);
      }

      nodesMeshRef.current.instanceMatrix.needsUpdate = true;
      if (nodesMeshRef.current.instanceColor) {
        nodesMeshRef.current.instanceColor.needsUpdate = true;
      }
    }

    // 2. Synaptic Edges
    if (linesGeometryRef.current) {
      let ptr = 0;
      for (let e = 0; e < edges.length; e++) {
        const p1 = nodes[edges[e].start].current;
        const p2 = nodes[edges[e].end].current;
        edgeLinePositions[ptr++] = p1.x;
        edgeLinePositions[ptr++] = p1.y;
        edgeLinePositions[ptr++] = p1.z;
        edgeLinePositions[ptr++] = p2.x;
        edgeLinePositions[ptr++] = p2.y;
        edgeLinePositions[ptr++] = p2.z;
      }
      linesGeometryRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(edgeLinePositions, 3)
      );
    }

    // 3. Synaptic Signal Impulses
    if (signalsMeshRef.current && edges.length > 0) {
      for (let s = 0; s < signals.length; s++) {
        const sig = signals[s];
        sig.progress += clampedDelta * sig.speed;
        if (sig.progress > 1) {
          sig.progress = 0;
          sig.edgeIndex = Math.floor(Math.random() * edges.length);
        }

        const edge = edges[sig.edgeIndex];
        const p1 = nodes[edge.start].current;
        const p2 = nodes[edge.end].current;

        dummy.position.lerpVectors(p1, p2, sig.progress);
        const sigScale = Math.sin(sig.progress * Math.PI) * 1.3;
        dummy.scale.set(sigScale, sigScale, sigScale);
        dummy.updateMatrix();
        signalsMeshRef.current.setMatrixAt(s, dummy.matrix);
      }
      signalsMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 4. Multi-Head Attention Orbital Ring
    if (attentionRingRef.current) {
      attentionRingRef.current.rotation.x = elapsed * 0.18;
      attentionRingRef.current.rotation.y = elapsed * 0.28;
    }

    // 5. Central AI Core
    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.45;
      coreRef.current.rotation.x = Math.sin(elapsed * 0.5) * 0.25;
      const corePulse = 1 + Math.sin(elapsed * 2.4) * 0.08 + (shockwaveRef.current.active ? 0.25 : 0);
      coreRef.current.scale.set(corePulse, corePulse, corePulse);
    }

    // 6. MC Dropout Uncertainty Cloud Rotation
    if (uncertaintyParticlesRef.current) {
      uncertaintyParticlesRef.current.rotation.y = elapsed * 0.35;
      const uMat = uncertaintyParticlesRef.current.material as THREE.PointsMaterial;
      uMat.opacity = showUncertainty && mode === 'medical' ? 0.85 : 0;
    }

    // 7. Group Orbit & Parallax Inertia
    if (groupRef.current) {
      if (!pointerRef.current.isDragging) {
        rotationVelocityRef.current.x *= 0.94;
        rotationVelocityRef.current.y *= 0.94;

        if (Math.abs(rotationVelocityRef.current.y) < 0.002) {
          rotationVelocityRef.current.y = 0.0022;
        }

        groupRef.current.rotation.y += rotationVelocityRef.current.y;
        groupRef.current.rotation.x += rotationVelocityRef.current.x;

        // Pointer parallax
        const targetTiltX = pointerRef.current.y * 0.18;
        const targetTiltZ = -pointerRef.current.x * 0.12;

        groupRef.current.rotation.x = THREE.MathUtils.damp(
          groupRef.current.rotation.x,
          targetTiltX,
          3.2,
          clampedDelta
        );
        groupRef.current.rotation.z = THREE.MathUtils.damp(
          groupRef.current.rotation.z,
          targetTiltZ,
          3.2,
          clampedDelta
        );
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Synaptic Nucleus */}
      <group ref={coreRef}>
        <mesh geometry={coreGeometry} material={coreMaterial} />
      </group>

      {/* Multilingual Attention Orbital Ring */}
      <mesh
        ref={attentionRingRef}
        geometry={ringGeometry}
        material={ringMaterial}
      />

      {/* Synaptic Pathway Lines */}
      <lineSegments material={lineMaterial}>
        <bufferGeometry ref={linesGeometryRef} />
      </lineSegments>

      {/* Cortical Neural Nodes */}
      <instancedMesh
        ref={nodesMeshRef}
        args={[nodeGeometry, nodeMaterial, nodes.length]}
      />

      {/* Synaptic Impulses */}
      <instancedMesh
        ref={signalsMeshRef}
        args={[signalGeometry, signalMaterial, signals.length]}
      />

      {/* Monte Carlo Dropout Uncertainty Cloud */}
      <points
        ref={uncertaintyParticlesRef}
        geometry={uncertaintyGeo}
        material={uncertaintyMat}
      />
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
  const [mode, setMode] = useState<AIMode>('medical');
  const [showUncertainty, setShowUncertainty] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<BrainNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const pointerRef = useRef({ x: 0, y: 0, isDragging: false, clickTrigger: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });

  const antialias = typeof window !== 'undefined' && window.devicePixelRatio === 1;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerRef.current.isDragging = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerRef.current.x = Math.max(-1, Math.min(1, nx));
    pointerRef.current.y = Math.max(-1, Math.min(1, ny));

    if (pointerRef.current.isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      window.dispatchEvent(
        new CustomEvent('hero-3d-drag', { detail: { dx, dy } })
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const totalDist = Math.hypot(
      e.clientX - dragStartRef.current.x,
      e.clientY - dragStartRef.current.y
    );
    if (totalDist < 6) {
      pointerRef.current.clickTrigger += 1;
      setPulseCount((c) => c + 1);
    }

    pointerRef.current.isDragging = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleFirePulse = () => {
    pointerRef.current.clickTrigger += 1;
    setPulseCount((c) => c + 1);
  };

  const handleResetCamera = () => {
    window.dispatchEvent(new CustomEvent('hero-3d-reset'));
  };

  return (
    <div
      aria-hidden="true"
      data-testid="hero-3d-canvas-wrapper"
      className="relative w-full h-full flex flex-col justify-between rounded-[6px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs"
    >
      {/* Top Interactive Mode Tabs Bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 sm:px-3 sm:py-2 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('medical')}
            aria-pressed={mode === 'medical'}
            className={`btn-interactive inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-step-13 font-medium transition-colors cursor-pointer ${
              mode === 'medical'
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Medical AI Cortex</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('transformer')}
            aria-pressed={mode === 'transformer'}
            className={`btn-interactive inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-step-13 font-medium transition-colors cursor-pointer ${
              mode === 'transformer'
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Multilingual Attention</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleFirePulse}
            title="Fire Synaptic Wave"
            className="btn-interactive inline-flex items-center gap-1 px-2 py-1 rounded-[4px] border border-[var(--border)] text-step-13 text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer bg-[var(--bg)]"
          >
            <Sparkles className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
            <span className="hidden sm:inline">Pulse</span>
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset Perspective"
            className="btn-interactive p-1.5 rounded-[4px] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer bg-[var(--bg)]"
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative flex-1 w-full min-h-[220px] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={{ position: [0, 0, 4.8], fov: 42 }}
          gl={{
            antialias,
            powerPreference: 'low-power',
            alpha: true,
          }}
          aria-hidden="true"
          tabIndex={-1}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 5, 4]} intensity={1.2} />
          <BrainMeshScene
            pointerRef={pointerRef}
            mode={mode}
            showUncertainty={showUncertainty}
            onHoverNode={setHoveredNode}
            onReady={onReady}
            onLowFps={onLowFps}
          />
        </Canvas>

        {/* Real-Time AI Telemetry Tooltip */}
        <div className="absolute top-2.5 start-3 pointer-events-none transition-opacity duration-200">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm text-[11px] font-mono text-[var(--text)] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] pulse-dot inline-block" aria-hidden="true" />
            {mode === 'medical' ? (
              <span>Dual Cortex · ICH Detection · MC Dropout (σ²=0.042)</span>
            ) : (
              <span>Multi-Head Attention · Pashto / Dari / Urdu / English</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Interactive Telemetry & Guidance */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 border-t border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <span>Drag 360° to rotate</span>
          <span>·</span>
          <span>Click to fire shockwave</span>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'medical' && (
            <button
              type="button"
              onClick={() => setShowUncertainty(!showUncertainty)}
              className="hover:text-[var(--accent)] transition-colors cursor-pointer underline underline-offset-2"
            >
              {showUncertainty ? 'Uncertainty: On' : 'Uncertainty: Off'}
            </button>
          )}
          <span>72 Nodes · 60 FPS</span>
        </div>
      </div>
    </div>
  );
}
