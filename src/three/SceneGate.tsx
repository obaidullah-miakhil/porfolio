'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { shouldSkipWebGL } from '@/lib/device';
import { MoleculePoster } from './PosterSvgs';

const MoleculeVizLazy = dynamic(() => import('./MoleculeViz'), {
  ssr: false,
});

export type SceneType = 'research';

// Global single-canvas coordinator so never more than one WebGL canvas is mounted at a time
let currentActiveScene: SceneType | null = null;
const sceneListeners = new Set<() => void>();
const visibleScenes = new Set<SceneType>();

function updateActiveScene() {
  let nextScene: SceneType | null = null;
  if (visibleScenes.has('research')) {
    nextScene = 'research';
  }

  if (nextScene !== currentActiveScene) {
    currentActiveScene = nextScene;
    sceneListeners.forEach((fn) => fn());
  }
}

export function SceneGate({ scene }: { scene: SceneType }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [idleReady, setIdleReady] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [isActiveScene, setIsActiveScene] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [skippedOrFailed, setSkippedOrFailed] = useState(false);

  // 1. Check capability gate & schedule requestIdleCallback (with 1500ms timeout fallback)
  useEffect(() => {
    if (shouldSkipWebGL()) {
      setSkippedOrFailed(true);
      return;
    }

    let cancelled = false;
    type IdleWindow = Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const win = window as IdleWindow;

    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(
        () => {
          if (!cancelled) setIdleReady(true);
        },
        { timeout: 1500 }
      );
      return () => {
        cancelled = true;
        win.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(() => {
      if (!cancelled) setIdleReady(true);
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  // 2. IntersectionObserver within 200px of viewport + single-canvas coordinator
  useEffect(() => {
    const el = containerRef.current;
    if (!el || skippedOrFailed) return;

    const syncActive = () => {
      setIsActiveScene(currentActiveScene === scene);
    };
    sceneListeners.add(syncActive);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const isNear = entry.isIntersecting;
          setInViewport(isNear);
          if (isNear) {
            visibleScenes.add(scene);
          } else {
            visibleScenes.delete(scene);
          }
          updateActiveScene();
        }
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0.01 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      visibleScenes.delete(scene);
      sceneListeners.delete(syncActive);
      updateActiveScene();
    };
  }, [scene, skippedOrFailed]);

  const shouldMountCanvas =
    !skippedOrFailed && idleReady && inViewport && isActiveScene;

  useEffect(() => {
    if (!shouldMountCanvas) {
      setCanvasReady(false);
    }
  }, [shouldMountCanvas]);

  const heightClasses = 'w-full h-[220px] sm:h-[250px] md:h-[280px]';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-scene-type={scene}
      data-scene-active={shouldMountCanvas ? 'true' : 'false'}
      className={`relative ${heightClasses} rounded-[12px] overflow-hidden select-none`}
    >
      {/* Poster SVG is rendered immediately in SSR HTML */}
      <div
        className={`w-full h-full transition-opacity duration-300 ${
          canvasReady && shouldMountCanvas ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <MoleculePoster />
      </div>

      {/* Lazily loaded 3D WebGL Canvas cross-fades over the poster */}
      {shouldMountCanvas ? (
        <div
          className={`absolute inset-0 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] transition-opacity duration-300 ${
            canvasReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <MoleculeVizLazy
            onReady={() => setCanvasReady(true)}
            onLowFps={() => setSkippedOrFailed(true)}
          />
        </div>
      ) : null}
    </div>
  );
}
