'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { shouldSkipStoryAvatar } from '@/lib/device';
import { profile } from '@/content/profile';
import type { StoryChapterMeta } from './storyState';

const StoryAvatar = dynamic(() => import('@/three/StoryAvatar'), { ssr: false });

/** The walking 3D character, or his photo when the device should skip WebGL. */
export function StoryCharacter({ chapters }: { chapters: StoryChapterMeta[] }) {
  const [mode, setMode] = useState<'pending' | '3d' | 'photo'>('pending');

  useEffect(() => {
    setMode(shouldSkipStoryAvatar() ? 'photo' : '3d');
  }, []);

  if (mode === 'pending') return null;
  if (mode === 'photo') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="story-photo" src={profile.profilePhoto} alt="" />;
  }
  return <StoryAvatar poses={chapters.map((c) => c.pose)} onFail={() => setMode('photo')} />;
}
