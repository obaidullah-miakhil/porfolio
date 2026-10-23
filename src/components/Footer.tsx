import React from 'react';
import { useTranslations } from 'next-intl';
import { profile } from '@/content/profile';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg)] py-10 mt-12">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-step-15 text-[var(--text)]">
          <div>
            <span>© {currentYear} Obaidullah Miakhil</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-step-15">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              GitHub
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              LinkedIn
            </a>
            <a
              href={profile.huggingfaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              Hugging Face
            </a>
            {profile.scholarUrl ? (
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline whitespace-nowrap"
              >
                Google Scholar
              </a>
            ) : null}
            {profile.researchgateUrl ? (
              <a
                href={profile.researchgateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline whitespace-nowrap"
              >
                ResearchGate
              </a>
            ) : null}
            <a
              href={`mailto:${profile.emailPrimary}`}
              className="text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              {profile.emailPrimary}
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-step-13 text-[var(--muted)]">
          <p className="m-0">{t('alsoWrittenAs')}</p>
          <p className="m-0" title={t('glyphCheckLabel')}>
            <span className="sr-only">{t('glyphCheckLabel')} </span>
            <span lang="ps">{profile.glyphVerificationString}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
