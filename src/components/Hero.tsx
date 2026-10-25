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
import { TiltCard } from './TiltCard';
import { TypewriterText } from './TypewriterText';
import {
  Download,
  Mail,
  GraduationCap,
  FileText,
  Brain,
  Users,
  ArrowUpRight,
} from 'lucide-react';

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
      className="py-10 sm:py-14 md:py-20 border-b border-[var(--border)]"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Start side: 7 columns */}
          <div className="md:col-span-7 flex flex-col gap-5 text-start">
            <div className="flex flex-col gap-2.5 relative">
              {/* Subtle ambient glow blob behind hero */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -start-16 w-80 h-80 rounded-full bg-[var(--accent)] opacity-10 blur-3xl"
              />

              {/* Availability & Specialization Eyebrow */}
              <div className="flex flex-wrap items-center gap-2 text-step-13 text-[var(--muted)]">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-[var(--glass-border)] bg-[var(--surface)] text-[var(--accent)] font-medium shadow-[var(--glow-accent)]">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block shrink-0 animate-pulse"
                    aria-hidden="true"
                  />
                  <span>{t('availabilityStatus')}</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]">
                  {t('availabilityTarget')}
                </span>
              </div>

              <h1 className="text-step-h1 font-bold text-[var(--text)] tracking-tight">
                {profile.name}
              </h1>
              <p className="text-step-22 font-medium text-[var(--accent)] m-0">
                <TypewriterText text={t('roleLine')} />
              </p>
              <p className="text-step-15 text-[var(--muted)] m-0">
                {t('subLine')}
              </p>
            </div>

            {/* Audience Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-step-13 text-[var(--muted)] font-medium">
                {t('viewingAs')}
              </span>
              <div
                role="group"
                aria-label={t('viewingAs')}
                className="inline-flex items-center p-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => handleSelectAudience('research')}
                  aria-pressed={audience === 'research'}
                  className={`btn-interactive min-h-[36px] px-3.5 py-1.5 rounded-[4px] text-step-13 font-medium whitespace-nowrap cursor-pointer transition-all ${
                    audience === 'research'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[var(--glow-accent)]'
                      : 'text-[var(--text)] hover:text-[var(--accent)]'
                  }`}
                >
                  {t('audienceResearch')}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAudience('industry')}
                  aria-pressed={audience === 'industry'}
                  className={`btn-interactive min-h-[36px] px-3.5 py-1.5 rounded-[4px] text-step-13 font-medium whitespace-nowrap cursor-pointer transition-all ${
                    audience === 'industry'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[var(--glow-accent)]'
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
                className="text-step-17 text-[var(--text)] m-0 leading-relaxed"
                suppressHydrationWarning
              >
                {t('researchSummary')}
              </p>
              <p
                hidden={audience !== 'industry'}
                data-testid="summary-industry"
                className="text-step-17 text-[var(--text)] m-0 leading-relaxed"
                suppressHydrationWarning
              >
                {t('industrySummary')}
              </p>
            </div>

            {/* Key Credentials & Medical AI / Supervision Metrics with 3D Tilt */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 tabular-nums">
              <TiltCard className="card-interactive p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-1 shadow-sm hover:border-[var(--accent)] hover:shadow-[var(--glow-accent)]">
                <div className="flex items-center gap-1.5 text-[var(--accent)]">
                  <GraduationCap
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-step-13 font-bold text-[var(--text)]">
                    {t('metricCgpaLabel')}
                  </span>
                </div>
                <span className="text-step-13 text-[var(--muted)] truncate">
                  {t('metricCgpaDesc')}
                </span>
              </TiltCard>

              <TiltCard className="card-interactive p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-1 shadow-sm hover:border-[var(--accent)] hover:shadow-[var(--glow-accent)]">
                <div className="flex items-center gap-1.5 text-[var(--accent)]">
                  <FileText
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-step-13 font-bold text-[var(--text)]">
                    {t('metricPaperLabel')}
                  </span>
                </div>
                <span className="text-step-13 text-[var(--muted)] truncate">
                  {t('metricPaperDesc')}
                </span>
              </TiltCard>

              <TiltCard className="card-interactive p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-1 shadow-sm hover:border-[var(--accent)] hover:shadow-[var(--glow-accent)]">
                <div className="flex items-center gap-1.5 text-[var(--accent)]">
                  <Brain
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-step-13 font-bold text-[var(--text)]">
                    {t('metricMedicalLabel')}
                  </span>
                </div>
                <span className="text-step-13 text-[var(--muted)] truncate">
                  {t('metricMedicalDesc')}
                </span>
              </TiltCard>

              <TiltCard className="card-interactive p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-1 shadow-sm hover:border-[var(--accent)] hover:shadow-[var(--glow-accent)]">
                <div className="flex items-center gap-1.5 text-[var(--accent)]">
                  <Users
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-step-13 font-bold text-[var(--text)]">
                    {t('metricSupervisionLabel')}
                  </span>
                </div>
                <span className="text-step-13 text-[var(--muted)] truncate">
                  {t('metricSupervisionDesc')}
                </span>
              </TiltCard>
            </div>

            {/* Highlight points (ordered by selected audience) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-step-13 text-[var(--muted)] tabular-nums">
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
                className="btn-interactive inline-flex items-center gap-2 h-11 px-5 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-step-15 hover:opacity-95 whitespace-nowrap"
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
                className="btn-interactive inline-flex items-center gap-2 h-11 px-5 rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-step-15 whitespace-nowrap"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('emailMe')}</span>
              </a>

              <a
                href="#contact"
                className="btn-interactive link-arrow inline-flex items-center gap-1.5 h-11 px-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-step-15 whitespace-nowrap"
              >
                <span>{t('inquireAvailability')}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>

            {/* Profile Link Row — GitHub visually emphasised first */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-step-15">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link inline-flex items-center gap-2 min-h-[44px] font-medium text-[var(--accent)] whitespace-nowrap"
              >
                <GitHubIcon size={18} />
                <span dir="ltr">{profile.githubHandle}</span>
              </a>

              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link inline-flex items-center gap-1.5 min-h-[44px] text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap"
              >
                <LinkedInIcon size={17} />
                <span>LinkedIn</span>
              </a>

              {profile.scholarUrl ? (
                <a
                  href={profile.scholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link inline-flex items-center gap-1.5 min-h-[44px] text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap"
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
                  className="editorial-link inline-flex items-center gap-1.5 min-h-[44px] text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap"
                >
                  <ResearchGateIcon size={17} />
                  <span>ResearchGate</span>
                </a>
              ) : null}

              <a
                href={profile.huggingfaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link inline-flex items-center gap-1.5 min-h-[44px] text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap"
              >
                <HuggingFaceIcon size={17} />
                <span>Hugging Face</span>
              </a>
            </div>
          </div>

          {/* End side: 5 columns 3D Hero Object / Poster */}
          <div className="md:col-span-5 w-full flex items-center justify-center">
            <SceneGate scene="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
