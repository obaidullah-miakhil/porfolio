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
import { Mail, Copy, Check, Download } from 'lucide-react';

export function ContactSection() {
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
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2
            id="contact-heading"
            className="text-step-32 font-bold text-[var(--text)]"
          >
            {t('heading')}
          </h2>
          <p className="text-step-17 text-[var(--muted)] m-0">{t('lead')}</p>
        </div>

        <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
          {/* Primary email */}
          <div className="p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
            <div className="flex items-center gap-3 min-w-0">
              <Mail
                className="w-4 h-4 text-[var(--muted)] shrink-0"
                aria-hidden="true"
              />
              <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
                {t('primaryEmailLabel')}
              </span>
              <a
                href={`mailto:${profile.emailPrimary}`}
                dir="ltr"
                className="text-step-15 font-medium text-[var(--accent)] hover:underline truncate"
              >
                {profile.emailPrimary}
              </a>
            </div>
            <button
              type="button"
              onClick={() => copyText('primary', profile.emailPrimary)}
              aria-label={`${t('copyEmail')} (${profile.emailPrimary})`}
              className="btn-interactive inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[var(--border)] text-step-13 text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer shrink-0"
            >
              {copiedKey === 'primary' ? (
                <>
                  <Check
                    className="w-3.5 h-3.5 text-[var(--accent)] animate-in zoom-in-75 duration-150"
                    aria-hidden="true"
                  />
                  <span>{t('copiedEmail')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('copyEmail')}</span>
                </>
              )}
            </button>
          </div>

          {/* Academic email */}
          <div className="p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
            <div className="flex items-center gap-3 min-w-0">
              <Mail
                className="w-4 h-4 text-[var(--muted)] shrink-0"
                aria-hidden="true"
              />
              <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
                {t('academicEmailLabel')}
              </span>
              <a
                href={`mailto:${profile.emailAcademic}`}
                dir="ltr"
                className="text-step-15 font-medium text-[var(--accent)] hover:underline truncate"
              >
                {profile.emailAcademic}
              </a>
            </div>
            <button
              type="button"
              onClick={() => copyText('academic', profile.emailAcademic)}
              aria-label={`${t('copyEmail')} (${profile.emailAcademic})`}
              className="btn-interactive inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[var(--border)] text-step-13 text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer shrink-0"
            >
              {copiedKey === 'academic' ? (
                <>
                  <Check
                    className="w-3.5 h-3.5 text-[var(--accent)] animate-in zoom-in-75 duration-150"
                    aria-hidden="true"
                  />
                  <span>{t('copiedEmail')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('copyEmail')}</span>
                </>
              )}
            </button>
          </div>

          {/* WhatsApp */}
          <div className="p-4 sm:px-6 flex flex-wrap items-center gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
            <WhatsAppIcon size={16} className="text-[var(--muted)] shrink-0" />
            <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
              {t('whatsappLabel')}
            </span>
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-step-15 font-medium text-[var(--accent)] hover:underline"
            >
              {profile.phoneDisplay}
            </a>
          </div>

          {/* GitHub */}
          <div className="p-4 sm:px-6 flex flex-wrap items-center gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
            <GitHubIcon size={16} className="text-[var(--accent)] shrink-0" />
            <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
              {t('githubLabel')}
            </span>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-step-15 font-bold text-[var(--accent)] hover:underline"
            >
              {profile.githubHandle}
            </a>
          </div>

          {/* LinkedIn */}
          <div className="p-4 sm:px-6 flex flex-wrap items-center gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
            <LinkedInIcon size={16} className="text-[var(--muted)] shrink-0" />
            <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
              {t('linkedinLabel')}
            </span>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-step-15 font-medium text-[var(--accent)] hover:underline"
            >
              linkedin.com/in/obaidullah-miakhil-b28a16248
            </a>
          </div>

          {/* Hugging Face */}
          <div className="p-4 sm:px-6 flex flex-wrap items-center gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
            <HuggingFaceIcon
              size={16}
              className="text-[var(--muted)] shrink-0"
            />
            <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
              {t('huggingfaceLabel')}
            </span>
            <a
              href={profile.huggingfaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-step-15 font-medium text-[var(--accent)] hover:underline"
            >
              huggingface.co/Obaidullahmiakhil
            </a>
          </div>

          {/* Google Scholar */}
          {profile.scholarUrl ? (
            <div className="p-4 sm:px-6 flex flex-wrap items-center gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
              <ScholarIcon size={16} className="text-[var(--muted)] shrink-0" />
              <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
                {t('scholarLabel')}
              </span>
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="text-step-15 font-medium text-[var(--accent)] hover:underline truncate"
              >
                scholar.google.com/citations?user=JVFkpVgAAAAJ
              </a>
            </div>
          ) : null}

          {/* ResearchGate */}
          {profile.researchgateUrl ? (
            <div className="p-4 sm:px-6 flex flex-wrap items-center gap-3 hover:bg-[var(--bg)]/60 transition-colors duration-200">
              <ResearchGateIcon size={16} className="text-[var(--muted)] shrink-0" />
              <span className="text-step-15 text-[var(--muted)] w-32 shrink-0">
                ResearchGate
              </span>
              <a
                href={profile.researchgateUrl}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="text-step-15 font-medium text-[var(--accent)] hover:underline truncate"
              >
                researchgate.net/profile/Obaidullah-Miakhil
              </a>
            </div>
          ) : null}
        </div>

        {/* Download CV & Résumé Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={profile.academicCvPath}
            download
            className="btn-interactive group inline-flex items-center gap-2 h-11 px-5 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-step-15 hover:opacity-95 whitespace-nowrap"
          >
            <Download className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
            <span>{tHero('downloadAcademicCv')}</span>
          </a>

          <a
            href={profile.resumePath}
            download
            className="btn-interactive group inline-flex items-center gap-2 h-11 px-5 rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-step-15 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
            <span>{tHero('downloadResume')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
