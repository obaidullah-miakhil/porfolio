'use client';

import React, { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  locales,
  localeLabels,
  usePathname,
  useRouter,
  type Locale,
} from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    try {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore cookie write errors
    }
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative inline-flex items-center shrink-0">
      <select
        aria-label={t('language')}
        value={locale}
        disabled={isPending}
        onChange={handleLocaleChange}
        className="h-11 ps-0 pe-5 bg-transparent text-[var(--text)] font-mono text-[12px] uppercase tracking-[0.06em] appearance-none cursor-pointer"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-0 text-[var(--muted)] text-[11px]"
      >
        ▾
      </span>
    </div>
  );
}
