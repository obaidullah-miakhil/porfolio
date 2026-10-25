'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';

const THEME_ORDER = ['system', 'light', 'dark'] as const;
type ThemeMode = (typeof THEME_ORDER)[number];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme: ThemeMode =
    mounted && (theme === 'light' || theme === 'dark' || theme === 'system')
      ? theme
      : 'system';

  const nextTheme = (): ThemeMode => {
    const idx = THEME_ORDER.indexOf(currentTheme);
    return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  };

  const labelMap: Record<ThemeMode, string> = {
    system: t('themeSystem'),
    light: t('themeLight'),
    dark: t('themeDark'),
  };

  const handleToggle = () => {
    const target = nextTheme();
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => {
        setTheme(target);
      });
    } else {
      setTheme(target);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`${t('theme')}: ${labelMap[currentTheme]}`}
      title={`${t('theme')}: ${labelMap[currentTheme]}`}
      className="inline-flex items-center justify-center gap-1.5 h-11 min-w-[44px] px-3 rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] transition-colors text-step-13 whitespace-nowrap shrink-0 cursor-pointer"
    >
      {currentTheme === 'light' ? (
        <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
      ) : currentTheme === 'dark' ? (
        <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
      ) : (
        <Monitor className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{labelMap[currentTheme]}</span>
    </button>
  );
}
