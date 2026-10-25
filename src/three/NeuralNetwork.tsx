'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';

interface NodeData {
  pos: THREE.Vector3;
  layer: number;
  baseRadius: number;
  pulsePhase: number;
  activity: number;
}

interface EdgeData {
  from: number;
  to: number;
  source: THREE.Vector3;
  target: THREE.Vector3;
  weight: number;
}

interface PulseData {
  edgeIndex: number;
  progress: number;
  speed: number;
  size: number;
}

const _dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _vec3A = new THREE.Vector3();

function NeuralScene({
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
  const nodesMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const pulsesMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  // 1. Generate Network Structure: 5 layers (Input, 3 Hidden, Output)
  const { nodes, edges, pulses, lineGeometry, nodeGeo, pulseGeo, nodeMat, pulseMat, lineMat } =
    useMemo(() => {
      const colors = readThemeTokenColors();
      const accentCol = new THREE.Color(colors.accent);
      const layerCounts = [4, 6, 8, 6, 3];
      const nodeList: NodeData[] = [];
      const edgeList: EdgeData[] = [];

      const layerSpacingX = 1.05;
      const totalWidth = (layerCounts.length - 1) * layerSpacingX;
      const startX = -totalWidth / 2;

      let nodeOffset = 0;
      const layerIndices: number[][] = [];

      layerCounts.forEach((count, lIdx) => {
        const x = startX + lIdx * layerSpacingX;
        const currentLayer: number[] = [];
        const radiusY = count * 0.28;

        for (let i = 0; i < count; i++) {
          const normY = count > 1 ? (i / (count - 1) - 0.5) * 2 : 0;
          const y = normY * radiusY;
          // Curve in 3D (Z axis) for depth
          const z = Math.sin((i / count) * Math.PI) * 0.45 - (lIdx % 2 === 0 ? 0.2 : -0.2);

          nodeList.push({
            pos: new THREE.Vector3(x, y, z),
            layer: lIdx,
            baseRadius: lIdx === 0 || lIdx === layerCounts.length - 1 ? 0.075 : 0.06,
            pulsePhase: Math.random() * Math.PI * 2,
            activity: 0.5 + Math.random() * 0.5,
          });
          currentLayer.push(nodeOffset + i);
        }
        layerIndices.push(currentLayer);
        nodeOffset += count;
      });

      // Connect adjacent layers with forward synaptic weights
      for (let l = 0; l < layerIndices.length - 1; l++) {
        const current = layerIndices[l];
        const next = layerIndices[l + 1];

        current.forEach((srcIdx) => {
          next.forEach((dstIdx) => {
            // Keep ~65% of connections for an elegant, readable network graph
            if (Math.random() < 0.65) {
              edgeList.push({
                from: srcIdx,
                to: dstIdx,
                source: nodeList[srcIdx].pos,
                target: nodeList[dstIdx].pos,
                weight: 0.2 + Math.random() * 0.8,
              });
            }
          });
        });
      }

      // Add a couple of residual/skip connections for deep learning motif
      if (layerIndices.length >= 4) {
        layerIndices[0].slice(0, 2).forEach((src) => {
          const dst = layerIndices[2][Math.floor(Math.random() * layerIndices[2].length)];
          edgeList.push({
            from: src,
            to: dst,
            source: nodeList[src].pos,
            target: nodeList[dst].pos,
            weight: 0.4,
          });
        });
      }

      // Build LineSegments geometry for all edges
      const linePositions = new Float32Array(edgeList.length * 6);
      edgeList.forEach((edge, i) => {
        linePositions[i * 6 + 0] = edge.source.x;
        linePositions[i * 6 + 1] = edge.source.y;
        linePositions[i * 6 + 2] = edge.source.z;
        linePositions[i * 6 + 3] = edge.target.x;
        linePositions[i * 6 + 4] = edge.target.y;
        linePositions[i * 6 + 5] = edge.target.z;
      });

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        color: accentCol,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      });

      // Prepare active pulses (signal data packets) traveling on edges
      const pulseCount = 36;
      const pulseList: PulseData[] = [];
      for (let p = 0; p < pulseCount; p++) {
        pulseList.push({
          edgeIndex: Math.floor(Math.random() * edgeList.length),
          progress: Math.random(),
          speed: 0.25 + Math.random() * 0.45,
          size: 0.035 + Math.random() * 0.02,
        });
      }

      // Geometries & materials
      const nGeo = new THREE.SphereGeometry(1, 14, 14);
      const nMat = new THREE.MeshBasicMaterial({
        color: accentCol,
        transparent: true,
        opacity: 0.85,
      });

      const pGeo = new THREE.SphereGeometry(1, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: accentCol,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });

      return {
        nodes: nodeList,
        edges: edgeList,
        pulses: pulseList,
        lineGeometry: lineGeo,
        nodeGeo: nGeo,
        pulseGeo: pGeo,
        nodeMat: nMat,
        pulseMat: pMat,
        lineMat: lineMaterial,
      };
    }, []);

  // Theme synchronization
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      const accent = new THREE.Color(colors.accent);
      nodeMat.color.copy(accent);
      pulseMat.color.copy(accent);
      lineMat.color.copy(accent);
      invalidate();
    };

    syncColors();
    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });

    return () => observer.disconnect();
  }, [nodeMat, pulseMat, lineMat, invalidate]);

  // Clean disposal
  useEffect(() => {
    return () => {
      lineGeometry.dispose();
      nodeGeo.dispose();
      pulseGeo.dispose();
      nodeMat.dispose();
      pulseMat.dispose();
      lineMat.dispose();
    };
  }, [lineGeometry, nodeGeo, pulseGeo, nodeMat, pulseMat, lineMat]);

  // Continuous animation loop with frame budgeting
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

    // Rotate group with mouse parallax and gentle auto-spin
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.08 * clampedDelta;

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

    // Update Nodes (Spheres with pulsing size)
    const nodeMesh = nodesMeshRef.current;
    if (nodeMesh) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = Math.sin(t * 2.5 + n.pulsePhase) * 0.015;
        const currentScale = n.baseRadius + pulse;

        _dummy.position.copy(n.pos);
        _dummy.scale.setScalar(currentScale);
        _dummy.updateMatrix();
        nodeMesh.setMatrixAt(i, _dummy.matrix);

        // Highlight input/output nodes slightly
        const brightness = 0.7 + Math.sin(t * 3 + n.pulsePhase) * 0.3;
        _color.setRGB(brightness, brightness, brightness);
        nodeMesh.setColorAt(i, _color);
      }
      nodeMesh.instanceMatrix.needsUpdate = true;
      if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;
    }

    // Update Pulses (Data traveling along edges)
    const pulseMesh = pulsesMeshRef.current;
    if (pulseMesh) {
      for (let p = 0; p < pulses.length; p++) {
        const item = pulses[p];
        item.progress += item.speed * clampedDelta;
        if (item.progress >= 1) {
          item.progress = 0;
          // Re-assign to a new edge to simulate continuous random signal flow
          item.edgeIndex = Math.floor(Math.random() * edges.length);
        }

        const edge = edges[item.edgeIndex];
        if (edge) {
          _vec3A.lerpVectors(edge.source, edge.target, item.progress);
          _dummy.position.copy(_vec3A);
          _dummy.scale.setScalar(item.size);
          _dummy.updateMatrix();
          pulseMesh.setMatrixAt(p, _dummy.matrix);
        }
      }
      pulseMesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} />

      {/* Synapse Lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMat} />

      {/* Neural Nodes */}
      <instancedMesh
        ref={nodesMeshRef}
        args={[nodeGeo, nodeMat, nodes.length]}
        frustumCulled={false}
      />

      {/* Data Signal Pulses */}
      <instancedMesh
        ref={pulsesMeshRef}
        args={[pulseGeo, pulseMat, pulses.length]}
        frustumCulled={false}
      />
    </group>
  );
}

export default function NeuralNetwork({
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

  return (
    <div
      aria-hidden="true"
      data-testid="neural-network-canvas-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] backdrop-blur-sm shadow-[var(--glow-accent)] overflow-hidden transition-all duration-300"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{
          antialias: true,
          powerPreference: 'low-power',
          alpha: true,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <NeuralScene
          pointerRef={pointerRef}
          scrollRef={scrollRef}
          onReady={onReady}
          onLowFps={onLowFps}
        />
      </Canvas>
    </div>
  );
}
