'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getFeaturedPublication } from '@/content/profile';
import { ExternalLink, Copy, Check } from 'lucide-react';

export function FeaturedPublication() {
  const t = useTranslations('featuredPublication');
  const pub = getFeaturedPublication();
  const [copied, setCopied] = useState(false);

  const doiUrl = pub.doi ? `https://doi.org/${pub.doi}` : pub.url || '';

  const handleCopyBibtex = async () => {
    if (!pub.bibtex) return;
    try {
      await navigator.clipboard.writeText(pub.bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <div className="card-interactive p-6 sm:p-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-step-13 font-semibold text-[var(--accent)]">
              {t('eyebrow')}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {pub.badges?.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-0.5 rounded-[6px] border border-[var(--border)] text-step-13 text-[var(--text)] font-medium whitespace-nowrap bg-[var(--bg)]"
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
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link hover:text-[var(--accent)] transition-colors duration-200"
            >
              {pub.title}
            </a>
          </h2>

          <p className="text-step-15 text-[var(--muted)] m-0">
            Jadoon MM,{' '}
            <strong className="font-bold text-[var(--text)]">Miakhil O</strong>,
            Chakari NR, Qureshi MB, Ullah I, Ahmed Haider S, Ur Rehman M
          </p>

          <p className="text-step-15 text-[var(--muted)] italic m-0 tabular-nums">
            {t('journalLine')}
          </p>

          <p className="text-step-17 text-[var(--text)] m-0 pt-1 tabular-nums">
            {t('resultLine')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive link-arrow inline-flex items-center gap-2 h-11 px-4 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-15 font-medium hover:opacity-95 whitespace-nowrap"
            >
              <span>{t('readPaper')}</span>
              <ExternalLink
                className="w-4 h-4 shrink-0 rtl-flip"
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              onClick={handleCopyBibtex}
              className="btn-interactive inline-flex items-center gap-2 h-11 px-4 rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-step-15 font-medium whitespace-nowrap cursor-pointer"
            >
              {copied ? (
                <>
                  <Check
                    className="w-4 h-4 text-[var(--accent)] shrink-0"
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
