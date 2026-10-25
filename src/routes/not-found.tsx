import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function LocaleNotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-start gap-4">
      <h1 className="text-step-32 font-bold text-[var(--text)] tabular-nums">
        404 — {t('heading')}
      </h1>
      <p className="text-step-17 text-[var(--muted)] m-0">{t('body')}</p>
      <Link
        href="/"
        className="btn-interactive inline-flex items-center h-11 px-5 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-15 font-medium hover:opacity-95 transition-opacity"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
