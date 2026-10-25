'use client';

import React, { useEffect, useRef, useState } from 'react';
import { StoryCharacter } from './StoryCharacter';
import { setActiveChapter, storyState, type StoryChapterMeta } from './storyState';

/** Scroll distance per chapter, in viewport heights. */
const SCROLL_PER_CHAPTER = 1.25;
/** Share of each chapter's scroll spent standing still before walking on. */
const DWELL = 0.4;
/** How close to a stop (in chapters) counts as "arrived". */
const ARRIVE = 0.16;

const ENABLE_SCRIPT = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('story-js')}catch(e){}`;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Raw scroll progress → track position: hold at each stop, then travel. */
function toPosition(raw: number, last: number) {
  const i = Math.floor(raw);
  if (i >= last) return last;
  const t = Math.min(1, Math.max(0, (raw - i - DWELL) / (1 - DWELL)));
  return i + easeInOut(t);
}

export function StoryStage({
  chapters,
  railLabel,
  children,
}: {
  chapters: StoryChapterMeta[];
  railLabel: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const gotoRef = useRef<(index: number, smooth?: boolean) => void>(() => {});
  const [enabled, setEnabled] = useState(false);
  const [current, setCurrent] = useState(0);
  const count = chapters.length;

  // Horizontal mode only when motion is welcome; otherwise chapters stack
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('story-js');
    setEnabled(true);
    return () => document.documentElement.classList.remove('story-js');
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!enabled || !root || !track) return;

    const panels = Array.from(track.querySelectorAll<HTMLElement>('[data-chapter]'));
    const last = count - 1;
    let distance = 1;
    let top = 0;
    let position = -1;
    let lastTime = performance.now();
    let frame = 0;
    let shown = -2;

    storyState.direction = document.documentElement.dir === 'rtl' ? -1 : 1;

    const measure = () => {
      const vh = window.innerHeight;
      distance = vh * SCROLL_PER_CHAPTER;
      root.style.setProperty('--story-height', `${vh + last * distance}px`);
      top = root.getBoundingClientRect().top + window.scrollY;
    };

    const markActive = (index: number) => {
      if (index === shown) return;
      shown = index;
      panels.forEach((panel, i) => panel.toggleAttribute('data-active', i === index));
      setActiveChapter(index);
      if (index >= 0) setCurrent(index);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000) || 0.016;
      lastTime = now;
      const raw = Math.min(last, Math.max(0, (window.scrollY - top) / distance));
      const target = toPosition(raw, last);

      // A light follow keeps travel smooth when the wheel moves in steps
      const next = position < 0 ? target : position + (target - position) * (1 - Math.exp(-12 * dt));
      const speed = position < 0 ? 0 : (next - position) / dt;
      position = Math.abs(next - target) < 0.0005 ? target : next;
      storyState.position = position;
      storyState.speed += (speed - storyState.speed) * (1 - Math.exp(-10 * dt));

      track.style.transform = `translate3d(${-position * 100 * storyState.direction}vw,0,0)`;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${last ? position / last : 1})`;

      const nearest = Math.round(position);
      markActive(Math.abs(position - nearest) < ARRIVE ? nearest : -1);
      frame = requestAnimationFrame(tick);
    };

    gotoRef.current = (index, smooth = true) => {
      const clamped = Math.min(last, Math.max(0, index));
      window.scrollTo({
        top: top + clamped * distance + (clamped < last ? distance * 0.02 : 0),
        behavior: smooth ? 'smooth' : 'auto',
      });
    };

    // In-page links (header "Contact", hash URLs) jump to the matching stop
    const indexFromHash = (hash: string) => {
      if (hash.length < 2) return -1;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      const panel = target?.closest<HTMLElement>('[data-chapter]');
      return panel && track.contains(panel) ? Number(panel.dataset.chapter) : -1;
    };

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!anchor || anchor.origin !== window.location.origin) return;
      if (anchor.pathname.replace(/\/$/, '') !== window.location.pathname.replace(/\/$/, '')) return;
      const index = indexFromHash(anchor.hash);
      if (index < 0) return;
      e.preventDefault();
      history.replaceState(null, '', anchor.hash);
      gotoRef.current(index);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const forward = storyState.direction === 1 ? 'ArrowRight' : 'ArrowLeft';
      const back = storyState.direction === 1 ? 'ArrowLeft' : 'ArrowRight';
      const raw = (window.scrollY - top) / distance;
      if (raw < -0.2 || raw > last + 0.6) return;
      if (e.key === forward) {
        e.preventDefault();
        gotoRef.current(Math.floor(raw + 0.05) + 1);
      } else if (e.key === back) {
        e.preventDefault();
        gotoRef.current(Math.ceil(raw - 0.5) - 1);
      }
    };

    measure();
    const initial = indexFromHash(window.location.hash);
    if (initial > 0) gotoRef.current(initial, false);

    frame = requestAnimationFrame(tick);
    window.addEventListener('resize', measure);
    document.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('keydown', onKey);
      root.style.removeProperty('--story-height');
      track.style.transform = '';
      panels.forEach((panel) => panel.removeAttribute('data-active'));
    };
  }, [enabled, count, chapters]);

  return (
    <div
      ref={rootRef}
      className="story"
      style={{ '--chapters': count } as React.CSSProperties}
    >
      <script dangerouslySetInnerHTML={{ __html: ENABLE_SCRIPT }} />
      <div className="story-sticky">
        <div className="story-ground" aria-hidden="true" />
        <div ref={trackRef} className="story-track">
          <div className="story-ticks" aria-hidden="true" />
          {children}
        </div>
        <div className="story-character" aria-hidden="true">
          {enabled ? <StoryCharacter chapters={chapters} /> : null}
        </div>
        <nav className="story-rail" aria-label={railLabel}>
          <div className="story-rail-line" aria-hidden="true">
            <div ref={fillRef} className="story-rail-fill" />
          </div>
          {chapters.map((chapter, i) => (
            <button
              key={chapter.id}
              type="button"
              aria-current={current === i ? 'step' : undefined}
              dir="auto"
              onClick={() => gotoRef.current(i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {chapter.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
