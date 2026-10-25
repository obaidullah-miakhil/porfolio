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
      className="py-12 sm:py-16 md:py-24 border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Numbered Section Header */}
        <div className="space-y-2">
          <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
            {sectionNumber}
          </div>
          <h2
            id="contact-heading"
            className="text-step-28 sm:text-step-32 font-bold text-[var(--text)]"
          >
            {t('heading')}
          </h2>
          <p className="text-step-17 text-[var(--muted)] m-0 max-w-[65ch]">
            {t('lead')}
          </p>
        </div>

        {/* Large Primary Email Line (~32px) with Copy Button + Academic Email */}
        <div className="p-6 sm:p-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-6">
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
        </div>

        {/* Plain Hairline-Divided Channel Rows */}
        <div className="border-t border-b border-[var(--border)] divide-y divide-[var(--border)]">
          {/* WhatsApp */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-step-15 font-medium text-[var(--text)]">
              <WhatsAppIcon size={18} className="text-[var(--accent)]" />
              <span>{t('whatsappLabel')}</span>
            </div>
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('chatOnWhatsapp')}
              className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 font-medium text-[var(--accent)]"
            >
              <span>{t('chatOnWhatsapp')}</span>
              <ExternalLink className="w-4 h-4 rtl-flip" aria-hidden="true" />
            </a>
          </div>

          {/* GitHub */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-step-15 font-medium text-[var(--text)]">
              <GitHubIcon size={18} className="text-[var(--text)]" />
              <span>{t('githubLabel')}</span>
            </div>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 font-medium text-[var(--accent)]"
            >
              <span>{profile.githubHandle}</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Google Scholar */}
          {profile.scholarUrl ? (
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-step-15 font-medium text-[var(--text)]">
                <ScholarIcon size={18} className="text-[var(--text)]" />
                <span>{t('scholarLabel')}</span>
              </div>
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 text-[var(--text)] hover:text-[var(--accent)]"
              >
                <span>scholar.google.com/citations?user=JVFkpVgAAAAJ</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          ) : null}

          {/* ResearchGate */}
          {profile.researchgateUrl ? (
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-step-15 font-medium text-[var(--text)]">
                <ResearchGateIcon size={18} className="text-[var(--text)]" />
                <span>ResearchGate</span>
              </div>
              <a
                href={profile.researchgateUrl}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 text-[var(--text)] hover:text-[var(--accent)]"
              >
                <span>researchgate.net/profile/Obaidullah-Miakhil</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          ) : null}

          {/* LinkedIn */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-step-15 font-medium text-[var(--text)]">
              <LinkedInIcon size={18} className="text-[var(--text)]" />
              <span>{t('linkedinLabel')}</span>
            </div>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 text-[var(--text)] hover:text-[var(--accent)]"
            >
              <span>linkedin.com/in/obaidullah-miakhil-b28a16248</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Hugging Face */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-step-15 font-medium text-[var(--text)]">
              <HuggingFaceIcon size={18} className="text-[var(--text)]" />
              <span>{t('huggingfaceLabel')}</span>
            </div>
            <a
              href={profile.huggingfaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 text-[var(--text)] hover:text-[var(--accent)]"
            >
              <span>huggingface.co/Obaidullahmiakhil</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
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
