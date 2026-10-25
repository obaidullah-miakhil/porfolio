'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { profile } from '@/content/profile';
import {
  GitHubIcon,
  LinkedInIcon,
  HuggingFaceIcon,
  ScholarIcon,
  ResearchGateIcon,
  WhatsAppIcon,
} from './BrandIcons';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';
import { TiltCard } from './TiltCard';

export function ContactSection({
  sectionNumber = '06',
}: {
  sectionNumber?: string;
}) {
  const t = useTranslations('contact');
  const tHero = useTranslations('hero');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-12 sm:py-16 md:py-24 border-t border-[var(--border)] relative"
    >
      {/* Background glow orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 end-12 w-96 h-96 rounded-full bg-[var(--accent)] opacity-10 blur-3xl"
      />

      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 flex flex-col gap-10 relative">
        {/* Numbered Section Header */}
        <div className="space-y-2">
          <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
            {sectionNumber}
          </div>
          <h2
            id="contact-heading"
            className="text-step-28 sm:text-step-32 font-bold text-[var(--text)] tracking-tight"
          >
            {t('heading')}
          </h2>
          <p className="text-step-17 text-[var(--muted)] m-0 max-w-[65ch]">
            {t('lead')}
          </p>
        </div>

        {/* 3D Holographic Card for Primary & Academic Email */}
        <TiltCard
          maxTilt={5}
          scale={1.01}
          className="p-6 sm:p-8 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-lg hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] space-y-6 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
            <div className="space-y-1">
              <div className="text-step-13 text-[var(--muted)]">
                {t('primaryEmailLabel')}
              </div>
              <a
                href={`mailto:${profile.emailPrimary}`}
                dir="ltr"
                className="editorial-link text-step-22 sm:text-step-28 md:text-step-32 font-bold text-[var(--accent)] break-all inline-block"
              >
                {profile.emailPrimary}
              </a>
            </div>

            <button
              type="button"
              onClick={() => copyText('primary', profile.emailPrimary)}
              aria-label={`${t('copyEmail')} (${profile.emailPrimary})`}
              className="btn-interactive self-start md:self-center inline-flex items-center justify-center gap-2 h-11 px-4 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer shrink-0"
            >
              {copiedKey === 'primary' ? (
                <>
                  <Check
                    className="w-4 h-4 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <span>{t('copiedEmail')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>{t('copyEmail')}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-step-13 text-[var(--muted)]">
                {t('academicEmailLabel')}
              </div>
              <a
                href={`mailto:${profile.emailAcademic}`}
                dir="ltr"
                className="editorial-link text-step-17 font-medium text-[var(--text)] hover:text-[var(--accent)] break-all inline-block"
              >
                {profile.emailAcademic}
              </a>
            </div>

            <button
              type="button"
              onClick={() => copyText('academic', profile.emailAcademic)}
              aria-label={`${t('copyEmail')} (${profile.emailAcademic})`}
              className="btn-interactive self-start sm:self-center inline-flex items-center justify-center gap-2 h-11 px-4 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer shrink-0"
            >
              {copiedKey === 'academic' ? (
                <>
                  <Check
                    className="w-4 h-4 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <span>{t('copiedEmail')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>{t('copyEmail')}</span>
                </>
              )}
            </button>
          </div>
        </TiltCard>

        {/* Interactive 3D Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <TiltCard
            maxTilt={5}
            scale={1.01}
            className="card-interactive group p-4 sm:p-5 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] flex items-center justify-between gap-3 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_8px_var(--accent)] transition-all">
                <WhatsAppIcon size={20} className="text-[var(--accent)]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {t('whatsappLabel')}
                </span>
                <span className="text-step-13 text-[var(--muted)] truncate">
                  {t('chatOnWhatsapp')}
                </span>
              </div>
            </div>
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('chatOnWhatsapp')}
              className="editorial-link link-arrow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-all shrink-0"
            >
              <span>{t('chatOnWhatsapp')}</span>
              <ExternalLink className="w-3.5 h-3.5 rtl-flip" aria-hidden="true" />
            </a>
          </TiltCard>

          {/* GitHub */}
          <TiltCard
            maxTilt={5}
            scale={1.01}
            className="card-interactive group p-4 sm:p-5 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] flex items-center justify-between gap-3 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_8px_var(--accent)] transition-all">
                <GitHubIcon size={20} className="text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {t('githubLabel')}
                </span>
                <span className="text-step-13 text-[var(--muted)] truncate" dir="ltr">
                  {profile.githubHandle}
                </span>
              </div>
            </div>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link link-arrow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-all shrink-0"
            >
              <span dir="ltr">{profile.githubHandle}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </TiltCard>

          {/* Google Scholar */}
          {profile.scholarUrl ? (
            <TiltCard
              maxTilt={5}
              scale={1.01}
              className="card-interactive group p-4 sm:p-5 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] flex items-center justify-between gap-3 transition-all duration-300"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_8px_var(--accent)] transition-all">
                  <ScholarIcon size={20} className="text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {t('scholarLabel')}
                  </span>
                  <span className="text-step-13 text-[var(--muted)] truncate" dir="ltr">
                    Google Scholar Profile
                  </span>
                </div>
              </div>
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link link-arrow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-all shrink-0"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </TiltCard>
          ) : null}

          {/* ResearchGate */}
          {profile.researchgateUrl ? (
            <TiltCard
              maxTilt={5}
              scale={1.01}
              className="card-interactive group p-4 sm:p-5 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] flex items-center justify-between gap-3 transition-all duration-300"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_8px_var(--accent)] transition-all">
                  <ResearchGateIcon size={20} className="text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    ResearchGate
                  </span>
                  <span className="text-step-13 text-[var(--muted)] truncate" dir="ltr">
                    Obaidullah-Miakhil
                  </span>
                </div>
              </div>
              <a
                href={profile.researchgateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link link-arrow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-all shrink-0"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </TiltCard>
          ) : null}

          {/* LinkedIn */}
          <TiltCard
            maxTilt={5}
            scale={1.01}
            className="card-interactive group p-4 sm:p-5 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] flex items-center justify-between gap-3 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_8px_var(--accent)] transition-all">
                <LinkedInIcon size={20} className="text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {t('linkedinLabel')}
                </span>
                <span className="text-step-13 text-[var(--muted)] truncate" dir="ltr">
                  obaidullah-miakhil
                </span>
              </div>
            </div>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link link-arrow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-all shrink-0"
            >
              <span>Connect</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </TiltCard>

          {/* Hugging Face */}
          <TiltCard
            maxTilt={5}
            scale={1.01}
            className="card-interactive group p-4 sm:p-5 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] flex items-center justify-between gap-3 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_8px_var(--accent)] transition-all">
                <HuggingFaceIcon size={20} className="text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {t('huggingfaceLabel')}
                </span>
                <span className="text-step-13 text-[var(--muted)] truncate" dir="ltr">
                  Obaidullahmiakhil
                </span>
              </div>
            </div>
            <a
              href={profile.huggingfaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link link-arrow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-all shrink-0"
            >
              <span>Models</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </TiltCard>
        </div>

        {/* Two CV Download Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={profile.academicCvPath}
            download
            className="btn-interactive inline-flex items-center gap-2.5 h-11 px-5 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-step-15 hover:opacity-95 whitespace-nowrap"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{tHero('downloadAcademicCv')}</span>
          </a>

          <a
            href={profile.resumePath}
            download
            className="btn-interactive inline-flex items-center gap-2.5 h-11 px-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-step-15 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{tHero('downloadResume')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
