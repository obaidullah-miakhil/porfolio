'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { profile, type AudienceMode } from '@/content/profile';
import {
  GitHubIcon,
  LinkedInIcon,
  HuggingFaceIcon,
  ScholarIcon,
  ResearchGateIcon,
} from './BrandIcons';
import { SceneGate } from '@/three/SceneGate';
import { Download, Mail } from 'lucide-react';

const STORAGE_KEY = 'obaidullah_audience_mode';

export function Hero() {
  const t = useTranslations('hero');
  const [audience, setAudience] = useState<AudienceMode>('research');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get('for');
      if (fromUrl === 'research' || fromUrl === 'industry') {
        setAudience(fromUrl);
        try {
          window.localStorage.setItem(STORAGE_KEY, fromUrl);
        } catch {
          // Ignore storage error
        }
        return;
      }

      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'research' || saved === 'industry') {
        setAudience(saved);
      }
    } catch {
      // Default remains research
    }
  }, []);

  const handleSelectAudience = (mode: AudienceMode) => {
    setAudience(mode);
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage error
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('for', mode);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history error
    }
  };

  const activeAudienceData = profile.audienceContent[audience];

  return (
    <section
      className="py-8 sm:py-10 md:py-14 border-b border-[var(--border)]"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Start side: Typography, Audience Switch, CTAs, Links */}
          <div className="md:col-span-7 flex flex-col gap-4 text-start">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-step-h1 font-bold tracking-tight text-[var(--text)]">
              {profile.name}
            </h1>
            <p className="text-step-22 font-medium text-[var(--text)] m-0">
              {t('roleLine')}
            </p>
            <p className="text-step-15 text-[var(--muted)] m-0">
              {t('subLine')}
            </p>
          </div>

          {/* Audience Switcher */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-step-13 text-[var(--muted)] font-medium">
              {t('viewingAs')}
            </span>
            <div
              role="group"
              aria-label={t('viewingAs')}
              className="inline-flex items-center p-0.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]"
            >
              <button
                type="button"
                onClick={() => handleSelectAudience('research')}
                aria-pressed={audience === 'research'}
                className={`px-3 py-1.5 rounded-[6px] text-step-13 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  audience === 'research'
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                    : 'text-[var(--text)] hover:text-[var(--accent)]'
                }`}
              >
                {t('audienceResearch')}
              </button>
              <button
                type="button"
                onClick={() => handleSelectAudience('industry')}
                aria-pressed={audience === 'industry'}
                className={`px-3 py-1.5 rounded-[6px] text-step-13 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  audience === 'industry'
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                    : 'text-[var(--text)] hover:text-[var(--accent)]'
                }`}
              >
                {t('audienceIndustry')}
              </button>
            </div>
          </div>

          {/* Both summaries present in SSR HTML so search engines index both */}
          <div suppressHydrationWarning>
            <p
              hidden={audience !== 'research'}
              data-testid="summary-research"
              className="text-step-17 text-[var(--text)] m-0"
              suppressHydrationWarning
            >
              {t('researchSummary')}
            </p>
            <p
              hidden={audience !== 'industry'}
              data-testid="summary-industry"
              className="text-step-17 text-[var(--text)] m-0"
              suppressHydrationWarning
            >
              {t('industrySummary')}
            </p>
          </div>

          {/* Highlight points (ordered by selected audience) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-step-13 text-[var(--muted)]">
            {activeAudienceData.highlights.map((item, idx) => (
              <React.Fragment key={item}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={activeAudienceData.primaryCtaHref}
              download
              className="inline-flex items-center gap-2 h-11 px-5 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-step-15 hover:opacity-95 transition-opacity whitespace-nowrap"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {audience === 'research'
                  ? t('downloadAcademicCv')
                  : t('downloadResume')}
              </span>
            </a>

            <a
              href={`mailto:${profile.emailPrimary}`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-step-15 transition-colors whitespace-nowrap"
            >
              <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('emailMe')}</span>
            </a>
          </div>

          {/* Profile Link Row — GitHub visually emphasised first */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-step-15">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              <GitHubIcon size={18} />
              <span dir="ltr">{profile.githubHandle}</span>
            </a>

            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--text)] hover:text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              <LinkedInIcon size={17} />
              <span>LinkedIn</span>
            </a>

            {profile.scholarUrl ? (
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text)] hover:text-[var(--accent)] hover:underline whitespace-nowrap"
              >
                <ScholarIcon size={17} />
                <span>Google Scholar</span>
              </a>
            ) : null}

            {profile.researchgateUrl ? (
              <a
                href={profile.researchgateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text)] hover:text-[var(--accent)] hover:underline whitespace-nowrap"
              >
                <ResearchGateIcon size={17} />
                <span>ResearchGate</span>
              </a>
            ) : null}

            <a
              href={profile.huggingfaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--text)] hover:text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              <HuggingFaceIcon size={17} />
              <span>Hugging Face</span>
            </a>
          </div>
        </div>

          {/* End side: 3D Hero Object / Poster */}
          <div className="md:col-span-5 w-full flex items-center justify-center">
            <SceneGate scene="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
