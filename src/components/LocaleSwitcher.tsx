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
import { Globe } from 'lucide-react';

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
      <Globe
        className="w-4 h-4 text-[var(--muted)] pointer-events-none absolute start-3"
        aria-hidden="true"
      />
      <select
        aria-label={t('language')}
        value={locale}
        disabled={isPending}
        onChange={handleLocaleChange}
        className="h-11 min-w-[44px] ps-8 pe-7 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)] transition-colors text-step-13 appearance-none cursor-pointer"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-2.5 text-[var(--muted)] text-step-13"
      >
        ▾
      </span>
    </div>
  );
}
