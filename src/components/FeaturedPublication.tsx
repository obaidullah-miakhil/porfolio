'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getFeaturedPublication } from '@/content/profile';
import { ExternalLink, Copy, Check } from 'lucide-react';

export function FeaturedPublication() {
  const t = useTranslations('featuredPublication');
  const pub = getFeaturedPublication();
  const [copied, setCopied] = useState(false);

  const handleCopyBibtex = async () => {
    if (!pub.bibtex) return;
    try {
      await navigator.clipboard.writeText(pub.bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback textarea copy
      const textarea = document.createElement('textarea');
      textarea.value = pub.bibtex;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      aria-labelledby="featured-publication-heading"
      className="py-10 sm:py-12 md:py-16 border-b border-[var(--border)]"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <div className="card-interactive group p-5 sm:p-7 md:p-8 rounded-[6px] border border-[var(--border)] border-s-4 border-s-[var(--accent)] bg-[var(--surface)] flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-step-13 font-semibold text-[var(--accent)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] pulse-dot inline-block" aria-hidden="true" />
              <span>{t('eyebrow')}</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {pub.badges?.map((badge) => (
                <span
                  key={badge}
                  className="tag-pill px-2.5 py-0.5 rounded-[6px] border border-[var(--border)] text-step-13 text-[var(--text)] font-medium whitespace-nowrap bg-[var(--bg)]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <h2
            id="featured-publication-heading"
            className="text-step-22 font-bold text-[var(--text)]"
          >
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] hover:underline transition-colors duration-200"
            >
              {pub.title}
            </a>
          </h2>

          <p className="text-step-15 text-[var(--muted)] m-0">
            Jadoon, M. M.,{' '}
            <strong className="font-bold text-[var(--text)]">
              Obaidullah Miakhil
            </strong>
            , Chakari, N. R., Qureshi, M. B., Ullah, I., Ahmed Haider, S., &amp;
            Ur Rehman, M.
          </p>

          <p className="text-step-15 text-[var(--muted)] italic m-0">
            {t('journalLine')}
          </p>

          <p className="text-step-17 text-[var(--text)] m-0 pt-1">
            {t('resultLine')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive group/btn inline-flex items-center gap-2 h-10 px-4 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-15 font-medium hover:opacity-95 whitespace-nowrap"
            >
              <span>{t('readPaper')}</span>
              <ExternalLink className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl-flip" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={handleCopyBibtex}
              className="btn-interactive inline-flex items-center gap-2 h-10 px-4 rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-step-15 font-medium whitespace-nowrap cursor-pointer"
            >
              {copied ? (
                <>
                  <Check
                    className="w-4 h-4 text-[var(--accent)] shrink-0 animate-in zoom-in-75 duration-150"
                    aria-hidden="true"
                  />
                  <span>{t('copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t('copyCitation')}</span>
                </>
              )}
            </button>
          </div>
        </div>
    </div>
  </section>
  );
}
