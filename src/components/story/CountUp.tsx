'use client';

import React, { useEffect, useRef } from 'react';
import { onActiveChapter, storyState } from './storyState';

/**
 * Counts from `from` to the number in `value` when its chapter becomes active.
 * Keeps the source formatting (separators, decimals, suffix such as "+" or "%").
 * The final value is server-rendered, so the number is right without JS.
 */
export function CountUp({
  value,
  from = 0,
  chapter,
  duration = 1400,
}: {
  value: string;
  from?: number;
  chapter: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains('story-js')) return;

    const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!match) return;
    const [, prefix, numeric, suffix] = match;
    const target = parseFloat(numeric.replace(/,/g, ''));
    const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0;
    const grouped = numeric.includes(',');
    const format = (n: number) =>
      prefix +
      n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouped,
      }) +
      suffix;

    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = format(from + (target - from) * eased);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    el.textContent = format(from);
    if (storyState.active === chapter) run();
    const off = onActiveChapter((active) => {
      if (active === chapter) run();
    });
    return () => {
      off();
      cancelAnimationFrame(frame);
    };
  }, [value, from, chapter, duration]);

  return (
    <span ref={ref} className="chapter-stat-value">
      {value}
    </span>
  );
}
