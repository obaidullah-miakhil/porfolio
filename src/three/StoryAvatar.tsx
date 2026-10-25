'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AvatarRig, type AvatarPose } from './avatarRig';
import { storyState } from '@/components/story/storyState';

const AVATAR_MODEL_URL = '/models/avatar.glb';
const FLOOR_Y = -1.08;
const AVATAR_HEIGHT = 2.1;
// Camera framing: the floor sits at 84% of the canvas height (matches the CSS ground line)
const CAMERA_Z = 5;
const CAMERA_FOV = 34;
const VIEW_HEIGHT = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));
const CAMERA_Y = FLOOR_Y + VIEW_HEIGHT * 0.34;
/** Standing yaw: turned slightly toward the chapter text. */
const STAND_YAW = 0.32;
/** Walking yaw: side-on, facing the direction of travel. */
const WALK_YAW = 1.4;

function createShadowTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.min(1, Math.hypot((x / (size - 1)) * 2 - 1, (y / (size - 1)) * 2 - 1));
      const i = (y * size + x) * 4;
      data[i] = 20;
      data[i + 1] = 20;
      data[i + 2] = 19;
      data[i + 3] = Math.round(Math.pow(1 - d, 2.2) * 120);
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

function Character({
  poses,
  onLoaded,
  onFail,
}: {
  poses: AvatarPose[];
  onLoaded: () => void;
  onFail: () => void;
}) {
  const { gl, scene } = useThree();
  const groupRef = useRef<THREE.Group | null>(null);
  const rigRef = useRef<AvatarRig | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const heading = useRef(1);
  const callbacks = useRef({ onLoaded, onFail });
  callbacks.current = { onLoaded, onFail };
  const [model, setModel] = useState<THREE.Group | null>(null);
  const shadow = useMemo(() => {
    const map = createShadowTexture();
    return {
      map,
      geometry: new THREE.PlaneGeometry(1.5, 0.6),
      material: new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false }),
    };
  }, []);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    pmrem.dispose();
    return () => {
      scene.environment = null;
      env.dispose();
      shadow.map.dispose();
      shadow.geometry.dispose();
      shadow.material.dispose();
    };
  }, [gl, scene, shadow]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      AVATAR_MODEL_URL,
      (gltf) => {
        if (cancelled) return;
        const root = gltf.scene;
        const rig = new AvatarRig(root);
        if (!rig.isSupported) {
          callbacks.current.onFail();
          return;
        }
        rigRef.current = rig;

        root.updateMatrixWorld(true);
        const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
        root.scale.setScalar(AVATAR_HEIGHT / Math.max(size.y, 0.001));
        root.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        root.position.set(-center.x, FLOOR_Y - box.min.y, -center.z);
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) child.frustumCulled = false;
        });

        setModel(root);
        callbacks.current.onLoaded();
      },
      undefined,
      () => {
        if (!cancelled) callbacks.current.onFail();
      }
    );
    return () => {
      cancelled = true;
      rigRef.current = null;
    };
  }, []);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    const group = groupRef.current;
    if (!rig || !group) return;
    const dt = Math.min(delta, 0.1);
    const { position, speed, direction } = storyState;

    const nearest = Math.min(poses.length - 1, Math.max(0, Math.round(position)));
    rig.update({
      time: state.clock.elapsedTime,
      delta: dt,
      pointer: pointer.current,
      pose: poses[nearest] ?? 'idle',
      speed,
    });

    // Turn side-on to walk, then back toward the visitor and the chapter text
    const { phase, weight } = rig.stride;
    if (Math.abs(speed) > 0.03) heading.current = Math.sign(speed);
    const yaw = THREE.MathUtils.lerp(STAND_YAW, WALK_YAW * heading.current, weight) * direction;
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, yaw, 7, dt);
    group.position.y = Math.abs(Math.cos(phase)) * 0.03 * weight;
    // Mirror the whole character in right-to-left layouts
    group.scale.x = direction;
  });

  return (
    <>
      <hemisphereLight args={['#FFFFFF', '#D9D2C3', 0.9]} />
      <directionalLight position={[2.5, 4, 3.5]} intensity={1.6} color="#FFF6EA" />
      <directionalLight position={[-3, 2, 1.5]} intensity={0.45} color="#FFE2D1" />
      <mesh
        geometry={shadow.geometry}
        material={shadow.material}
        position={[0, FLOOR_Y + 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <group ref={groupRef}>{model ? <primitive object={model} /> : null}</group>
    </>
  );
}

export default function StoryAvatar({
  poses,
  onFail,
}: {
  poses: AvatarPose[];
  onFail: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', opacity: loaded ? 1 : 0, transition: 'opacity 600ms ease' }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, CAMERA_Y, CAMERA_Z], fov: CAMERA_FOV }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => camera.lookAt(0, CAMERA_Y, 0)}
      >
        <Character poses={poses} onLoaded={() => setLoaded(true)} onFail={onFail} />
      </Canvas>
    </div>
  );
}
