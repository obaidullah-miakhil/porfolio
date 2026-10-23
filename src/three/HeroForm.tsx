'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';

interface NodeData {
  base: THREE.Vector3;
  current: THREE.Vector3;
  phase: number;
  activity: number;
}

interface EdgeData {
  startIndex: number;
  endIndex: number;
}

interface SignalData {
  edgeIndex: number;
  progress: number;
  speed: number;
}

const NODE_COUNT = 52;
const MAX_EDGE_DIST = 1.05;
const MIN_EDGE_DIST = 0.45;
const SPHERE_RADIUS = 1.5;

function generateNeuralLattice() {
  const nodes: NodeData[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;

    // Subtle organic perturbation so it feels like a biological/artificial neural manifold
    const jitter = 0.88 + Math.sin(i * 12.3) * 0.16;
    const r = SPHERE_RADIUS * jitter;

    const x = Math.cos(theta) * radius * r;
    const z = Math.sin(theta) * radius * r;
    const pos = new THREE.Vector3(x, y * r, z);

    nodes.push({
      base: pos.clone(),
      current: pos.clone(),
      phase: (i * 0.35) % (Math.PI * 2),
      activity: 0,
    });
  }

  const edges: EdgeData[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = nodes[i].base.distanceTo(nodes[j].base);
      if (dist >= MIN_EDGE_DIST && dist <= MAX_EDGE_DIST) {
        edges.push({ startIndex: i, endIndex: j });
      }
    }
  }

  const signals: SignalData[] = [];
  const signalCount = Math.min(18, edges.length);
  for (let s = 0; s < signalCount; s++) {
    signals.push({
      edgeIndex: (s * 3) % edges.length,
      progress: Math.random(),
      speed: 0.35 + Math.random() * 0.45,
    });
  }

  return { nodes, edges, signals };
}

interface NeuralAttentionMeshProps {
  pointerRef: React.MutableRefObject<{ x: number; y: number; isDragging: boolean; clickTrigger: number }>;
  onReady?: () => void;
  onLowFps?: () => void;
}

function NeuralAttentionMesh({ pointerRef, onReady, onLowFps }: NeuralAttentionMeshProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const coreRef = useRef<THREE.Group | null>(null);
  const ringQRef = useRef<THREE.Mesh | null>(null);
  const ringKRef = useRef<THREE.Mesh | null>(null);
  const ringVRef = useRef<THREE.Mesh | null>(null);
  const nodesMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const signalsMeshRef = useRef<THREE.InstancedMesh | null>(null);

  const invalidate = useThree((s) => s.invalidate);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  // Neural network data
  const { nodes, edges, signals } = useMemo(() => generateNeuralLattice(), []);

  // Shockwave state
  const shockwaveRef = useRef({ radius: 99, active: false, maxRadius: 3.2 });
  const prevTriggerRef = useRef(0);

  // Rotation inertia
  const rotationVelocityRef = useRef({ x: 0, y: 0.0025 });

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const edgeLinePositions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges]);

  // Materials & Geometries
  const {
    nodeGeometry,
    nodeMaterial,
    lineMaterial,
    ringGeometry,
    ringMaterial,
    coreGeometry,
    coreWireGeometry,
    coreMaterial,
    coreWireMaterial,
    signalGeometry,
    signalMaterial,
  } = useMemo(() => {
    const colors = readThemeTokenColors();

    const nodeGeo = new THREE.SphereGeometry(0.048, 10, 10);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors.accent),
    });

    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(colors.accent),
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });

    const ringGeo = new THREE.TorusGeometry(2.05, 0.008, 6, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors.accent),
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });

    const coreGeo = new THREE.IcosahedronGeometry(0.48, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.accent),
      metalness: 0.2,
      roughness: 0.4,
      transparent: true,
      opacity: 0.85,
      flatShading: true,
    });

    const coreWireGeo = new THREE.IcosahedronGeometry(0.58, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors.text),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    const sigGeo = new THREE.SphereGeometry(0.038, 8, 8);
    const sigMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFFFFF'),
    });

    return {
      nodeGeometry: nodeGeo,
      nodeMaterial: nodeMat,
      lineMaterial: lineMat,
      ringGeometry: ringGeo,
      ringMaterial: ringMat,
      coreGeometry: coreGeo,
      coreWireGeometry: coreWireGeo,
      coreMaterial: coreMat,
      coreWireMaterial: coreWireMat,
      signalGeometry: sigGeo,
      signalMaterial: sigMat,
    };
  }, []);

  // Update theme colors when Light/Dark theme changes
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      const accent = new THREE.Color(colors.accent);
      nodeMaterial.color.set(accent);
      lineMaterial.color.set(accent);
      ringMaterial.color.set(accent);
      coreMaterial.color.set(accent);
      coreWireMaterial.color.set(new THREE.Color(colors.text));
      invalidate();
    };

    syncColors();
    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });

    return () => observer.disconnect();
  }, [nodeMaterial, lineMaterial, ringMaterial, coreMaterial, coreWireMaterial, invalidate]);

  // Clean disposal
  useEffect(() => {
    return () => {
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      coreWireGeometry.dispose();
      coreWireMaterial.dispose();
      signalGeometry.dispose();
      signalMaterial.dispose();
    };
  }, [
    nodeGeometry,
    nodeMaterial,
    lineMaterial,
    ringGeometry,
    ringMaterial,
    coreGeometry,
    coreMaterial,
    coreWireGeometry,
    coreWireMaterial,
    signalGeometry,
    signalMaterial,
  ]);

  // Demand loop & visibility control
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
      if (!document.hidden && active) scheduleNext();
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

  // Connect interactive drag rotation
  useEffect(() => {
    const onDrag = (e: Event) => {
      const custom = e as CustomEvent<{ dx: number; dy: number }>;
      if (!custom.detail) return;
      const { dx, dy } = custom.detail;
      if (groupRef.current) {
        groupRef.current.rotation.y += dx * 0.007;
        groupRef.current.rotation.x += dy * 0.007;
        rotationVelocityRef.current.y = dx * 0.004;
        rotationVelocityRef.current.x = dy * 0.004;
        invalidate();
      }
    };
    window.addEventListener('hero-3d-drag', onDrag);
    return () => window.removeEventListener('hero-3d-drag', onDrag);
  }, [invalidate]);

  // Frame FPS check
  const frameSampleRef = useRef({ count: 0, totalDelta: 0, checked: false });

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.08);

    // FPS probe
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

    // Trigger impulse wave on user click
    if (pointerRef.current.clickTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = pointerRef.current.clickTrigger;
      shockwaveRef.current.radius = 0;
      shockwaveRef.current.active = true;
      // Extra rotation burst
      rotationVelocityRef.current.y += 0.015;
    }

    // Expand shockwave
    if (shockwaveRef.current.active) {
      shockwaveRef.current.radius += clampedDelta * 4.2;
      if (shockwaveRef.current.radius > shockwaveRef.current.maxRadius) {
        shockwaveRef.current.active = false;
      }
    }

    // 1. Update Nodes Positions & Activity
    if (nodesMeshRef.current) {
      const shockRadius = shockwaveRef.current.radius;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Organic respiration (neural breathing)
        const breathe = Math.sin(elapsed * 1.6 + node.phase) * 0.06;
        node.current.copy(node.base).multiplyScalar(1 + breathe);

        // Check if shockwave hit this node
        const distFromCenter = node.base.length();
        if (shockwaveRef.current.active && Math.abs(distFromCenter - shockRadius) < 0.35) {
          node.activity = 1.0;
        } else {
          node.activity = Math.max(0, node.activity - clampedDelta * 2.2);
        }

        const scale = 1 + node.activity * 1.5;
        dummy.position.copy(node.current);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        nodesMeshRef.current.setMatrixAt(i, dummy.matrix);

        // Highlight active nodes
        if (node.activity > 0.05) {
          tempColor.set('#FFFFFF').lerp(nodeMaterial.color, 1 - node.activity);
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

    // 2. Update Synaptic Edge Lines
    if (linesGeometryRef.current) {
      let ptr = 0;
      for (let e = 0; e < edges.length; e++) {
        const p1 = nodes[edges[e].startIndex].current;
        const p2 = nodes[edges[e].endIndex].current;
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

    // 3. Update Synaptic Signals (data packets traveling along edges)
    if (signalsMeshRef.current && edges.length > 0) {
      for (let s = 0; s < signals.length; s++) {
        const sig = signals[s];
        sig.progress += clampedDelta * sig.speed;
        if (sig.progress > 1) {
          sig.progress = 0;
          sig.edgeIndex = Math.floor(Math.random() * edges.length);
        }

        const edge = edges[sig.edgeIndex];
        const p1 = nodes[edge.startIndex].current;
        const p2 = nodes[edge.endIndex].current;

        dummy.position.lerpVectors(p1, p2, sig.progress);
        const sigScale = Math.sin(sig.progress * Math.PI) * 1.1;
        dummy.scale.set(sigScale, sigScale, sigScale);
        dummy.updateMatrix();
        signalsMeshRef.current.setMatrixAt(s, dummy.matrix);
      }
      signalsMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 4. Rotate Multi-Head Attention Rings (Q, K, V)
    if (ringQRef.current) {
      ringQRef.current.rotation.x = 0.8 + elapsed * 0.18;
      ringQRef.current.rotation.y = elapsed * 0.24;
    }
    if (ringKRef.current) {
      ringKRef.current.rotation.y = 1.2 + elapsed * -0.22;
      ringKRef.current.rotation.z = elapsed * 0.16;
    }
    if (ringVRef.current) {
      ringVRef.current.rotation.x = elapsed * -0.15;
      ringVRef.current.rotation.z = 0.5 + elapsed * 0.28;
    }

    // 5. Rotate Central Latent Core
    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.42;
      coreRef.current.rotation.x = Math.sin(elapsed * 0.3) * 0.25;
      const corePulse = 1 + Math.sin(elapsed * 2.2) * 0.05 + (shockwaveRef.current.active ? 0.2 : 0);
      coreRef.current.scale.set(corePulse, corePulse, corePulse);
    }

    // 6. 3D Cluster Rotation & Inertia Handling
    if (groupRef.current) {
      if (!pointerRef.current.isDragging) {
        // Friction decay on drag release
        rotationVelocityRef.current.x *= 0.94;
        rotationVelocityRef.current.y *= 0.94;

        // Default ambient spin
        if (Math.abs(rotationVelocityRef.current.y) < 0.002) {
          rotationVelocityRef.current.y = 0.002;
        }

        groupRef.current.rotation.y += rotationVelocityRef.current.y;
        groupRef.current.rotation.x += rotationVelocityRef.current.x;

        // Parallax tilt towards pointer
        const maxTilt = 0.16;
        const targetTiltX = pointerRef.current.y * maxTilt;
        const targetTiltZ = -pointerRef.current.x * maxTilt * 0.6;

        groupRef.current.rotation.x = THREE.MathUtils.damp(
          groupRef.current.rotation.x,
          targetTiltX,
          3,
          clampedDelta
        );
        groupRef.current.rotation.z = THREE.MathUtils.damp(
          groupRef.current.rotation.z,
          targetTiltZ,
          3,
          clampedDelta
        );
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Latent Core & Wireframe Cage */}
      <group ref={coreRef}>
        <mesh geometry={coreGeometry} material={coreMaterial} />
        <mesh geometry={coreWireGeometry} material={coreWireMaterial} />
      </group>

      {/* Multi-Head Attention Orbital Rings (Q, K, V) */}
      <mesh ref={ringQRef} geometry={ringGeometry} material={ringMaterial} />
      <mesh ref={ringKRef} geometry={ringGeometry} material={ringMaterial} />
      <mesh ref={ringVRef} geometry={ringGeometry} material={ringMaterial} />

      {/* Synaptic Connection Lines */}
      <lineSegments material={lineMaterial}>
        <bufferGeometry ref={linesGeometryRef} />
      </lineSegments>

      {/* Neural Embedding Nodes */}
      <instancedMesh
        ref={nodesMeshRef}
        args={[nodeGeometry, nodeMaterial, nodes.length]}
      />

      {/* Synaptic Data Signals */}
      <instancedMesh
        ref={signalsMeshRef}
        args={[signalGeometry, signalMaterial, signals.length]}
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
  const pointerRef = useRef({ x: 0, y: 0, isDragging: false, clickTrigger: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

    // Handle 360 drag rotation
    if (pointerRef.current.isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      // Apply direct interactive orbit
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
    // If it was a quick click, trigger synaptic pulse
    if (totalDist < 5) {
      pointerRef.current.clickTrigger += 1;
    }

    pointerRef.current.isDragging = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    pointerRef.current.isDragging = false;
    setIsHovered(false);
    setIsDragging(false);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
      data-testid="hero-3d-canvas-wrapper"
      className={`relative w-full h-full select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 0, 5.0], fov: 42 }}
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
        <NeuralAttentionMesh
          pointerRef={pointerRef}
          onReady={onReady}
          onLowFps={onLowFps}
        />
      </Canvas>

      {/* Interactive Micro-badge indicator */}
      <div
        className={`absolute bottom-2.5 end-3 pointer-events-none transition-opacity duration-300 flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono text-[var(--muted)] shadow-xs ${
          isHovered ? 'opacity-100' : 'opacity-65'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] pulse-dot inline-block" aria-hidden="true" />
        <span>3D Neural Attention Lattice · Drag to rotate · Click to pulse</span>
      </div>
    </div>
  );
}
