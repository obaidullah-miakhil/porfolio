'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { detectSoftwareWebGL, readThemeTokenColors } from '@/lib/device';
import { AvatarRig } from './avatarRig';

const FLOOR_Y = -1.08;
const TARGET_AVATAR_HEIGHT = 2.1;
const AVATAR_MODEL_URL = '/models/avatar.glb';
const MAX_BODY_YAW_RAD = (18 * Math.PI) / 180;
const MAX_BODY_PITCH_RAD = (6 * Math.PI) / 180;
const MAX_HEAD_YAW_RAD = (22 * Math.PI) / 180;
const MAX_HEAD_PITCH_RAD = (12 * Math.PI) / 180;

function createContactShadowTexture(): THREE.DataTexture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    const ny = (y / (size - 1)) * 2 - 1;
    for (let x = 0; x < size; x++) {
      const nx = (x / (size - 1)) * 2 - 1;
      const dist = Math.min(1, Math.hypot(nx, ny));
      const falloff = Math.pow(1 - dist, 2.4);
      const alpha = Math.round(falloff * 145);
      const idx = (y * size + x) * 4;
      data[idx] = 15;
      data[idx + 1] = 20;
      data[idx + 2] = 35;
      data[idx + 3] = alpha;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function ProceduralStandingAvatar({
  pointerRef,
  accentColor,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  accentColor: string;
}) {
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const upperBodyRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const rightForearmRef = useRef<THREE.Group | null>(null);
  const orbitRingRef = useRef<THREE.Group | null>(null);

  const materials = useMemo(() => {
    const skin = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E2B49A'),
      roughness: 0.55,
      metalness: 0.05,
    });
    const hair = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1B1C20'),
      roughness: 0.7,
      metalness: 0.1,
    });
    const blazer = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E2430'),
      roughness: 0.6,
      metalness: 0.15,
    });
    const shirt = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F4F5F7'),
      roughness: 0.5,
      metalness: 0.05,
    });
    const trousers = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#151821'),
      roughness: 0.72,
      metalness: 0.08,
    });
    const shoes = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#101216'),
      roughness: 0.35,
      metalness: 0.3,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      roughness: 0.28,
      metalness: 0.65,
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.18,
    });
    const glassesFrame = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#272B33'),
      roughness: 0.22,
      metalness: 0.85,
    });
    const lens = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D8E6FF'),
      roughness: 0.12,
      metalness: 0.1,
      transparent: true,
      opacity: 0.38,
    });

    return {
      skin,
      hair,
      blazer,
      shirt,
      trousers,
      shoes,
      accent,
      glassesFrame,
      lens,
    };
  }, []);

  useEffect(() => {
    materials.accent.color.set(accentColor);
    materials.accent.emissive.set(accentColor);
  }, [accentColor, materials]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [materials]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.06);
    const t = state.clock.getElapsedTime();

    // Subtle idle breathing on upper body
    if (upperBodyRef.current) {
      upperBodyRef.current.position.y = Math.sin(t * 2.1) * 0.012;
      upperBodyRef.current.rotation.z = Math.sin(t * 1.1) * 0.012;
    }

    // Head gaze tracking toward pointer + gentle idle nod
    if (headGroupRef.current) {
      const targetHeadYaw =
        pointerRef.current.x * MAX_HEAD_YAW_RAD + Math.sin(t * 0.8) * 0.04;
      const targetHeadPitch =
        pointerRef.current.y * MAX_HEAD_PITCH_RAD + Math.sin(t * 1.6) * 0.025;

      headGroupRef.current.rotation.y = THREE.MathUtils.damp(
        headGroupRef.current.rotation.y,
        targetHeadYaw,
        5,
        dt
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.damp(
        headGroupRef.current.rotation.x,
        targetHeadPitch,
        5,
        dt
      );
    }

    // Left arm natural breathing sway
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.14 + Math.sin(t * 2.1) * 0.02;
      leftArmRef.current.rotation.x = Math.cos(t * 1.4) * 0.03;
    }

    // Right arm subtle welcoming gesture / idle poise
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.18 - Math.sin(t * 2.1) * 0.025;
      rightArmRef.current.rotation.x = -0.15 + Math.sin(t * 1.8) * 0.04;
    }
    if (rightForearmRef.current) {
      rightForearmRef.current.rotation.x = -0.35 + Math.sin(t * 2.4) * 0.06;
      rightForearmRef.current.rotation.z = Math.cos(t * 2.4) * 0.05;
    }

    // Orbiting AI research nodes
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.y = t * 0.45;
    }
  });

  // Grounded at y = FLOOR_Y (-1.08), total character height ~2.08 units
  return (
    <group ref={characterGroupRef} position={[0, FLOOR_Y, 0]}>
      {/* 1. Shoes (resting flush at y = 0 local, which is FLOOR_Y in world) */}
      <group position={[0, 0, 0]}>
        {/* Left Shoe */}
        <mesh position={[-0.14, 0.05, 0.04]} material={materials.shoes}>
          <boxGeometry args={[0.13, 0.1, 0.26]} />
        </mesh>
        {/* Right Shoe */}
        <mesh position={[0.14, 0.05, 0.04]} material={materials.shoes}>
          <boxGeometry args={[0.13, 0.1, 0.26]} />
        </mesh>
      </group>

      {/* 2. Legs / Tailored Trousers */}
      <group position={[0, 0.1, 0]}>
        {/* Left Leg */}
        <mesh position={[-0.14, 0.38, 0]} material={materials.trousers}>
          <capsuleGeometry args={[0.075, 0.62, 8, 16]} />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.14, 0.38, 0]} material={materials.trousers}>
          <capsuleGeometry args={[0.075, 0.62, 8, 16]} />
        </mesh>
        {/* Pelvis / Hip Bridge */}
        <mesh position={[0, 0.74, 0]} material={materials.trousers}>
          <boxGeometry args={[0.42, 0.14, 0.22]} />
        </mesh>
        {/* Belt & Accent Buckle */}
        <mesh position={[0, 0.81, 0]} material={materials.shoes}>
          <boxGeometry args={[0.43, 0.045, 0.23]} />
        </mesh>
        <mesh position={[0, 0.81, 0.118]} material={materials.accent}>
          <boxGeometry args={[0.07, 0.048, 0.015]} />
        </mesh>
      </group>

      {/* 3. Upper Body (Torso, Blazer, Shirt, Tie, Arms, Neck, Head) */}
      <group ref={upperBodyRef} position={[0, 0.84, 0]}>
        {/* Tailored Blazer Torso */}
        <mesh position={[0, 0.32, 0]} material={materials.blazer}>
          <boxGeometry args={[0.48, 0.6, 0.25]} />
        </mesh>

        {/* Broadened Shoulders */}
        <mesh
          position={[0, 0.56, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.blazer}
        >
          <capsuleGeometry args={[0.1, 0.34, 8, 16]} />
        </mesh>

        {/* Dress Shirt V-Insert */}
        <mesh position={[0, 0.45, 0.126]} material={materials.shirt}>
          <boxGeometry args={[0.16, 0.3, 0.015]} />
        </mesh>

        {/* Accent Tie / Researcher Badge */}
        <mesh position={[0, 0.42, 0.136]} material={materials.accent}>
          <boxGeometry args={[0.048, 0.26, 0.012]} />
        </mesh>

        {/* Blazer Lapels (Left & Right) */}
        <mesh
          position={[-0.09, 0.44, 0.132]}
          rotation={[0, 0, -0.2]}
          material={materials.blazer}
        >
          <boxGeometry args={[0.055, 0.32, 0.018]} />
        </mesh>
        <mesh
          position={[0.09, 0.44, 0.132]}
          rotation={[0, 0, 0.2]}
          material={materials.blazer}
        >
          <boxGeometry args={[0.055, 0.32, 0.018]} />
        </mesh>

        {/* Lapel Research Pin */}
        <mesh position={[-0.14, 0.48, 0.138]} material={materials.accent}>
          <octahedronGeometry args={[0.022, 0]} />
        </mesh>

        {/* Left Arm (Relaxed at side) */}
        <group ref={leftArmRef} position={[-0.29, 0.56, 0]}>
          <mesh position={[0, -0.16, 0]} material={materials.blazer}>
            <capsuleGeometry args={[0.062, 0.24, 8, 16]} />
          </mesh>
          <group position={[0, -0.32, 0]} rotation={[-0.12, 0, 0]}>
            <mesh position={[0, -0.14, 0]} material={materials.blazer}>
              <capsuleGeometry args={[0.054, 0.2, 8, 16]} />
            </mesh>
            {/* Left Hand */}
            <mesh position={[0, -0.29, 0.01]} material={materials.skin}>
              <sphereGeometry args={[0.052, 14, 14]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm (Articulated with subtle friendly gesture) */}
        <group ref={rightArmRef} position={[0.29, 0.56, 0]}>
          <mesh position={[0, -0.16, 0]} material={materials.blazer}>
            <capsuleGeometry args={[0.062, 0.24, 8, 16]} />
          </mesh>
          <group ref={rightForearmRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.14, 0]} material={materials.blazer}>
              <capsuleGeometry args={[0.054, 0.2, 8, 16]} />
            </mesh>
            {/* Right Hand */}
            <mesh position={[0, -0.29, 0.01]} material={materials.skin}>
              <sphereGeometry args={[0.052, 14, 14]} />
            </mesh>
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.67, 0]} material={materials.skin}>
          <cylinderGeometry args={[0.072, 0.082, 0.14, 16]} />
        </mesh>

        {/* 4. Articulated Head, Hair, Beard & Glasses */}
        <group ref={headGroupRef} position={[0, 0.86, 0]}>
          {/* Cranium / Face */}
          <mesh material={materials.skin}>
            <capsuleGeometry args={[0.165, 0.11, 16, 24]} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.17, -0.01, 0]} material={materials.skin}>
            <sphereGeometry args={[0.036, 12, 12]} />
          </mesh>
          <mesh position={[0.17, -0.01, 0]} material={materials.skin}>
            <sphereGeometry args={[0.036, 12, 12]} />
          </mesh>

          {/* Hair Top & Sides */}
          <mesh position={[0, 0.09, -0.01]} material={materials.hair}>
            <sphereGeometry args={[0.176, 20, 18, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          </mesh>
          <mesh position={[0, 0.15, 0.06]} rotation={[0.2, 0, 0]} material={materials.hair}>
            <boxGeometry args={[0.26, 0.065, 0.16]} />
          </mesh>

          {/* Neat Beard / Jawline Contour */}
          <mesh position={[0, -0.085, 0.025]} material={materials.hair}>
            <sphereGeometry args={[0.158, 18, 14, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.5]} />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.062, 0.02, 0.155]} material={materials.hair}>
            <sphereGeometry args={[0.018, 10, 10]} />
          </mesh>
          <mesh position={[0.062, 0.02, 0.155]} material={materials.hair}>
            <sphereGeometry args={[0.018, 10, 10]} />
          </mesh>

          {/* Eyebrows */}
          <mesh position={[-0.062, 0.062, 0.158]} rotation={[0, 0, 0.06]} material={materials.hair}>
            <boxGeometry args={[0.05, 0.012, 0.012]} />
          </mesh>
          <mesh position={[0.062, 0.062, 0.158]} rotation={[0, 0, -0.06]} material={materials.hair}>
            <boxGeometry args={[0.05, 0.012, 0.012]} />
          </mesh>

          {/* Nose Bridge */}
          <mesh position={[0, -0.005, 0.172]} material={materials.skin}>
            <capsuleGeometry args={[0.018, 0.035, 6, 8]} />
          </mesh>

          {/* Signature Eyeglasses (Left Frame, Right Frame, Bridge) */}
          <group position={[0, 0.022, 0.168]}>
            <mesh position={[-0.064, 0, 0]} material={materials.glassesFrame}>
              <boxGeometry args={[0.082, 0.056, 0.012]} />
            </mesh>
            <mesh position={[-0.064, 0, 0.002]} material={materials.lens}>
              <boxGeometry args={[0.068, 0.042, 0.014]} />
            </mesh>
            <mesh position={[0.064, 0, 0]} material={materials.glassesFrame}>
              <boxGeometry args={[0.082, 0.056, 0.012]} />
            </mesh>
            <mesh position={[0.064, 0, 0.002]} material={materials.lens}>
              <boxGeometry args={[0.068, 0.042, 0.014]} />
            </mesh>
            <mesh position={[0, 0.008, 0]} material={materials.accent}>
              <boxGeometry args={[0.048, 0.01, 0.012]} />
            </mesh>
          </group>
        </group>

        {/* 5. Subtle Orbiting AI Research Nodes */}
        <group ref={orbitRingRef} position={[0, 0.48, 0]}>
          <mesh position={[0.62, 0.12, 0]} material={materials.accent}>
            <octahedronGeometry args={[0.038, 0]} />
          </mesh>
          <mesh position={[-0.58, -0.08, 0.22]} material={materials.accent}>
            <icosahedronGeometry args={[0.032, 0]} />
          </mesh>
          <mesh position={[0.1, 0.28, -0.58]} material={materials.accent}>
            <octahedronGeometry args={[0.03, 0]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function AvatarScene({
  pointerRef,
  scrollRef,
  waveRequestRef,
  onReady,
  onLowFps,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
  waveRequestRef: React.MutableRefObject<boolean>;
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const glbContainerRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const rigRef = useRef<AvatarRig | null>(null);

  const [glbLoadedScene, setGlbLoadedScene] = useState<THREE.Group | null>(null);
  const [accentColor, setAccentColor] = useState<string>('#1E4BD2');

  const { gl, scene, invalidate } = useThree();
  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  // Studio environment reflection (RoomEnvironment + PMREMGenerator)
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    const prevEnv = scene.environment;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    return () => {
      scene.environment = prevEnv;
      envTexture.dispose();
    };
  }, [gl, scene]);

  // Floor Contact Shadow & Pedestal Ring
  const { shadowGeo, shadowMat, shadowTex, ringGeo, ringMat } = useMemo(() => {
    const colors = readThemeTokenColors();
    const sTex = createContactShadowTexture();
    const sGeo = new THREE.PlaneGeometry(2.1, 2.1);
    const sMat = new THREE.MeshBasicMaterial({
      map: sTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });

    const rGeo = new THREE.RingGeometry(0.64, 0.67, 64);
    const rMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors.accent),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    return {
      shadowGeo: sGeo,
      shadowMat: sMat,
      shadowTex: sTex,
      ringGeo: rGeo,
      ringMat: rMat,
    };
  }, []);

  useEffect(() => {
    return () => {
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, [shadowGeo, shadowMat, shadowTex, ringGeo, ringMat]);

  // Sync theme tokens on mount and when theme toggles
  useEffect(() => {
    const syncColors = () => {
      const colors = readThemeTokenColors();
      setAccentColor(colors.accent);
      ringMat.color.set(colors.accent);
      invalidate();
    };

    syncColors();
    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });

    return () => observer.disconnect();
  }, [ringMat, invalidate]);

  // Load the character model from /public/models (404 keeps the procedural fallback)
  useEffect(() => {
    let cancelled = false;
    let currentMixer: THREE.AnimationMixer | null = null;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      AVATAR_MODEL_URL,
      (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;

        // Embedded clips win; otherwise drive the skeleton procedurally
        if (gltf.animations.length > 0) {
          currentMixer = new THREE.AnimationMixer(model);
          const preferredClip =
            gltf.animations.find((clip) =>
              /idle|stand|wave|greet|breathe/i.test(clip.name)
            ) || gltf.animations[0];
          currentMixer.clipAction(preferredClip).play();
          mixerRef.current = currentMixer;
        } else {
          const rig = new AvatarRig(model);
          if (rig.isSupported) {
            rigRef.current = rig;
            waveRequestRef.current = true;
          }
        }

        // Scale to TARGET_AVATAR_HEIGHT and stand the character flush on FLOOR_Y
        model.updateMatrixWorld(true);
        const rawSize = new THREE.Box3()
          .setFromObject(model)
          .getSize(new THREE.Vector3());
        model.scale.setScalar(TARGET_AVATAR_HEIGHT / Math.max(rawSize.y, 0.001));

        model.updateMatrixWorld(true);
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        model.position.x = -scaledCenter.x;
        model.position.z = -scaledCenter.z;
        model.position.y = FLOOR_Y - scaledBox.min.y;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = false;
          }
        });

        setGlbLoadedScene(model);
        invalidate();
      },
      undefined,
      () => {
        // Keep procedural 3D character fallback if the model is missing or fails to parse
      }
    );

    return () => {
      cancelled = true;
      if (currentMixer) {
        currentMixer.stopAllAction();
      }
      mixerRef.current = null;
      rigRef.current = null;
    };
  }, [invalidate, waveRequestRef]);

  // Demand-driven frame scheduler + visibility listener
  useEffect(() => {
    let active = true;
    let timerId = 0;
    let rafId = 0;

    onReady?.();

    const schedule = () => {
      if (!active || document.hidden) return;
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

  // FPS Probe over first 30 frames
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

    // 1. Advance embedded GLB skeletal animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(clampedDelta);
    }

    // 2. Drive the procedural rig (pose, breathing, gaze, blinks, wave)
    if (rigRef.current) {
      const t = state.clock.getElapsedTime();
      if (waveRequestRef.current) {
        waveRequestRef.current = false;
        rigRef.current.wave(t + 0.4);
      }
      rigRef.current.update(t, clampedDelta, pointerRef.current);
    }

    // 3. Apply damped mouse parallax tilt to the full-body character group
    if (rootGroupRef.current) {
      const t = state.clock.getElapsedTime();
      // The rig turns head and eyes itself, so the whole body only turns slightly
      const bodyFactor = rigRef.current ? 0.45 : 1;
      const idleSwayY = Math.sin(t * 0.65) * 0.08 * bodyFactor;
      const targetYaw =
        pointerRef.current.x * MAX_BODY_YAW_RAD * bodyFactor + idleSwayY;
      const targetPitch = rigRef.current
        ? 0
        : pointerRef.current.y * MAX_BODY_PITCH_RAD;

      rootGroupRef.current.rotation.y = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.y,
        targetYaw,
        4.2,
        clampedDelta
      );
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.x,
        targetPitch,
        4.2,
        clampedDelta
      );

      // Subtle scroll elevation shift
      const targetPosY = -Math.min(1, scrollRef.current) * 0.06;
      rootGroupRef.current.position.y = THREE.MathUtils.damp(
        rootGroupRef.current.position.y,
        targetPosY,
        4,
        clampedDelta
      );
    }
  });

  return (
    <group>
      {/* Three-Point Studio Lighting Rig */}
      <hemisphereLight args={['#EEF2FF', '#1E2230', 0.85]} position={[0, 4, 0]} />
      <directionalLight position={[2.6, 3.8, 3.4]} intensity={1.35} color="#FFFDF9" />
      <directionalLight position={[-2.8, 2.2, 2.0]} intensity={0.55} color="#C7D8FF" />
      <pointLight position={[0, 1.8, -2.4]} intensity={1.1} color={accentColor} distance={7} />

      <group ref={rootGroupRef}>
        {/* Floor Contact Shadow Plane */}
        <mesh
          geometry={shadowGeo}
          material={shadowMat}
          position={[0, FLOOR_Y, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />

        {/* Subtle Studio Pedestal Ring */}
        <mesh
          geometry={ringGeo}
          material={ringMat}
          position={[0, FLOOR_Y + 0.004, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />

        {/* Render User's Uploaded GLB Character Model or Full-Body 3D Fallback */}
        {glbLoadedScene ? (
          <group ref={glbContainerRef}>
            <primitive object={glbLoadedScene} />
          </group>
        ) : (
          <ProceduralStandingAvatar
            pointerRef={pointerRef}
            accentColor={accentColor}
          />
        )}
      </group>
    </group>
  );
}

export default function Avatar3D({
  onReady,
  onLowFps,
}: {
  onReady?: () => void;
  onLowFps?: () => void;
}) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const waveRequestRef = useRef(false);

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

  const isSoftware = useMemo(() => detectSoftwareWebGL(), []);

  return (
    <div
      aria-hidden="true"
      data-testid="hero-avatar-canvas-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={() => {
        waveRequestRef.current = true;
      }}
      className="relative w-full h-full rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-[var(--glow-accent)] overflow-hidden transition-all duration-300"
    >
      <Canvas
        dpr={isSoftware ? 1 : [1, 1.75]}
        frameloop="demand"
        camera={{ position: [0, 0.02, 3.6], fov: 38 }}
        gl={{
          antialias: !isSoftware,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <AvatarScene
          pointerRef={pointerRef}
          scrollRef={scrollRef}
          waveRequestRef={waveRequestRef}
          onReady={onReady}
          onLowFps={onLowFps}
        />
      </Canvas>
    </div>
  );
}
