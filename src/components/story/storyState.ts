import type { AvatarPose } from '@/three/avatarRig';

export interface StoryChapterMeta {
  id: string;
  pose: AvatarPose;
  /** Short label for the chapter rail, e.g. "Hello". */
  label: string;
}

type Listener = (active: number) => void;

/**
 * Shared, mutable scroll state for the story. The stage writes it every frame;
 * the 3D character reads it inside its render loop, so nothing here triggers
 * React renders. Only changes of the active chapter are broadcast.
 */
export const storyState = {
  /** Continuous position along the track, 0 … chapters - 1. */
  position: 0,
  /** Signed travel speed in chapters per second (positive = forward). */
  speed: 0,
  /** Index of the chapter the visitor is stopped at, or -1 while travelling. */
  active: 0,
  /** +1 for left-to-right layouts, -1 for right-to-left. */
  direction: 1,
};

const listeners = new Set<Listener>();

export function setActiveChapter(index: number) {
  if (storyState.active === index) return;
  storyState.active = index;
  listeners.forEach((fn) => fn(index));
}

export function onActiveChapter(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
