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
import {
  Mail,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Send,
  FileText,
} from 'lucide-react';

export function ContactSection() {
  const t = useTranslations('contact');
  const tHero = useTranslations('hero');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<'phd' | 'research' | 'industry' | 'general'>('phd');

  const topics = [
    {
      id: 'phd' as const,
      label: 'PhD Opportunity',
      subject: '[PhD Position] Inquiry for Obaidullah Miakhil',
      body: 'Hi Obaidullah,%0D%0A%0D%0AI came across your research profile and would like to discuss potential PhD opportunities...',
    },
    {
      id: 'research' as const,
      label: 'Research Collaboration',
      subject: '[Research Collaboration] Deep Learning & NLP',
      body: 'Hi Obaidullah,%0D%0A%0D%0AI am interested in collaborating on research related to your work in Medical AI / NLP...',
    },
    {
      id: 'industry' as const,
      label: 'Industry / Engineering',
      subject: '[AI Engineering] Opportunity Discussion',
      body: 'Hi Obaidullah,%0D%0A%0D%0AWe are interested in discussing an engineering / consulting opportunity with you...',
    },
    {
      id: 'general' as const,
      label: 'General Discussion',
      subject: '[Inquiry] Connecting from your portfolio',
      body: 'Hi Obaidullah,%0D%0A%0D%0AI would like to connect with you regarding...',
    },
  ];

  const currentTopic = topics.find((tp) => tp.id === selectedTopic) || topics[0];

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-12 sm:py-16 md:py-24 border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-10">
        {/* Section Header */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono text-[var(--accent)] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] pulse-dot inline-block" aria-hidden="true" />
            <span>Open for PhD (Fall 2025/2026) & AI Engineering</span>
          </div>

          <h2
            id="contact-heading"
            className="text-step-32 font-bold text-[var(--text)] tracking-tight"
          >
            {t('heading')}
          </h2>
          <p className="text-step-17 text-[var(--muted)] m-0 max-w-[65ch]">
            {t('lead')}
          </p>
        </div>

        {/* Interactive Topic Selector */}
        <div className="p-4 sm:p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-step-13 font-medium text-[var(--text)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
              <span>Select Inquiring Topic (pre-formats email template):</span>
            </span>
            <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">
              Instant Mailto Formatter
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {topics.map((tp) => (
              <button
                key={tp.id}
                type="button"
                onClick={() => setSelectedTopic(tp.id)}
                className={`btn-interactive px-3 py-1.5 rounded-[4px] text-step-13 font-medium cursor-pointer transition-colors ${
                  selectedTopic === tp.id
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
                    : 'border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--card-border-hover)]'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Channels Matrix (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Primary Email Card */}
          <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-[var(--accent)]">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[11px] font-mono text-[var(--muted)]">
                  ⚡ &lt; 24h reply
                </span>
              </div>

              <div>
                <h3 className="text-step-18 font-bold text-[var(--text)]">
                  {t('primaryEmailLabel')}
                </h3>
                <p className="text-step-13 text-[var(--muted)] m-0">
                  Direct personal inbox for research & positions
                </p>
              </div>

              <a
                href={`mailto:${profile.emailPrimary}?subject=${encodeURIComponent(currentTopic.subject)}&body=${currentTopic.body}`}
                dir="ltr"
                className="text-step-15 font-semibold text-[var(--accent)] hover:underline break-all block"
              >
                {profile.emailPrimary}
              </a>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
              <a
                href={`mailto:${profile.emailPrimary}?subject=${encodeURIComponent(currentTopic.subject)}&body=${currentTopic.body}`}
                className="btn-interactive flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-13 font-medium hover:opacity-95"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Send email</span>
              </a>

              <button
                type="button"
                onClick={() => copyText('primary', profile.emailPrimary)}
                aria-label={`${t('copyEmail')} (${profile.emailPrimary})`}
                className="btn-interactive inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer shrink-0"
              >
                {copiedKey === 'primary' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--accent)] animate-in zoom-in-75 duration-150" aria-hidden="true" />
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
          </div>

          {/* 2. Academic Email Card */}
          <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-[var(--accent)]">
                  <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[11px] font-mono text-[var(--muted)]">
                  🏛️ PAF-IAST
                </span>
              </div>

              <div>
                <h3 className="text-step-18 font-bold text-[var(--text)]">
                  {t('academicEmailLabel')}
                </h3>
                <p className="text-step-13 text-[var(--muted)] m-0">
                  University & Sino-Pak AI Centre institutional inbox
                </p>
              </div>

              <a
                href={`mailto:${profile.emailAcademic}?subject=${encodeURIComponent(currentTopic.subject)}&body=${currentTopic.body}`}
                dir="ltr"
                className="text-step-15 font-semibold text-[var(--accent)] hover:underline break-all block"
              >
                {profile.emailAcademic}
              </a>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
              <a
                href={`mailto:${profile.emailAcademic}?subject=${encodeURIComponent(currentTopic.subject)}&body=${currentTopic.body}`}
                className="btn-interactive flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-13 font-medium hover:opacity-95"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Send email</span>
              </a>

              <button
                type="button"
                onClick={() => copyText('academic', profile.emailAcademic)}
                aria-label={`${t('copyEmail')} (${profile.emailAcademic})`}
                className="btn-interactive inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer shrink-0"
              >
                {copiedKey === 'academic' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--accent)] animate-in zoom-in-75 duration-150" aria-hidden="true" />
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
          </div>

          {/* 3. WhatsApp Direct Chat Card */}
          <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-emerald-600">
                  <WhatsAppIcon size={22} className="text-emerald-600" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[11px] font-mono text-emerald-600">
                  ● Instant Chat
                </span>
              </div>

              <div>
                <h3 className="text-step-18 font-bold text-[var(--text)]">
                  {t('whatsappLabel')}
                </h3>
                <p className="text-step-13 text-[var(--muted)] m-0">
                  Fast messaging for direct coordination
                </p>
              </div>

              <a
                href={profile.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="text-step-15 font-semibold text-[var(--accent)] hover:underline block"
              >
                {profile.phoneDisplay}
              </a>
            </div>

            <div className="pt-3 border-t border-[var(--border)]">
              <a
                href={profile.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="btn-interactive w-full inline-flex items-center justify-center gap-2 h-9 px-4 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-emerald-500 hover:text-emerald-600 text-step-13 font-medium transition-colors"
              >
                <WhatsAppIcon size={16} className="text-emerald-600" />
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Scholarly & Professional Profiles Grid (5 Cards) */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between gap-2 border-b border-[var(--border)] pb-2">
            <h3 className="text-step-22 font-bold text-[var(--text)]">
              Research & Developer Profiles
            </h3>
            <span className="text-[11px] font-mono text-[var(--muted)]">
              Verified Profiles & Citations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* GitHub */}
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive group p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <GitHubIcon size={18} className="text-[var(--text)]" />
                  <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {t('githubLabel')}
                  </span>
                </div>
                <div dir="ltr" className="text-step-13 text-[var(--muted)] font-mono">
                  github.com/obaidullah-miakhil
                </div>
                <p className="text-step-13 text-[var(--muted)] m-0 pt-1">
                  Open-source ML models, medical CT code, and web systems
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>

            {/* Google Scholar */}
            {profile.scholarUrl && (
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-interactive group p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ScholarIcon size={18} className="text-[var(--text)]" />
                    <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {t('scholarLabel')}
                    </span>
                  </div>
                  <div dir="ltr" className="text-step-13 text-[var(--muted)] font-mono truncate max-w-[220px]">
                    scholar.google.com/citations?user=JVFkpVgAAAAJ
                  </div>
                  <p className="text-step-13 text-[var(--muted)] m-0 pt-1">
                    Scopus Q1 first author, citations, and scholarly metrics
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            )}

            {/* ResearchGate */}
            {profile.researchgateUrl && (
              <a
                href={profile.researchgateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-interactive group p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ResearchGateIcon size={18} className="text-[var(--text)]" />
                    <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      ResearchGate
                    </span>
                  </div>
                  <div dir="ltr" className="text-step-13 text-[var(--muted)] font-mono truncate max-w-[220px]">
                    researchgate.net/profile/Obaidullah-Miakhil
                  </div>
                  <p className="text-step-13 text-[var(--muted)] m-0 pt-1">
                    Full-text preprints, research interest score, and reviews
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            )}

            {/* LinkedIn */}
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive group p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <LinkedInIcon size={18} className="text-[var(--text)]" />
                  <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {t('linkedinLabel')}
                  </span>
                </div>
                <div dir="ltr" className="text-step-13 text-[var(--muted)] font-mono truncate max-w-[220px]">
                  linkedin.com/in/obaidullah-miakhil-b28a16248
                </div>
                <p className="text-step-13 text-[var(--muted)] m-0 pt-1">
                  Professional network, recommendations, and updates
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>

            {/* Hugging Face */}
            <a
              href={profile.huggingfaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive group p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <HuggingFaceIcon size={18} className="text-[var(--text)]" />
                  <span className="text-step-15 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {t('huggingfaceLabel')}
                  </span>
                </div>
                <div dir="ltr" className="text-step-13 text-[var(--muted)] font-mono">
                  huggingface.co/Obaidullahmiakhil
                </div>
                <p className="text-step-13 text-[var(--muted)] m-0 pt-1">
                  NLP transformer checkpoints, tokenizers, and datasets
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Interactive CV & Résumé Download Center */}
        <div className="p-6 sm:p-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-start">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[11px] font-mono text-[var(--muted)]">
              <FileText className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
              <span>Curriculum Vitae & Résumé Hub · PDF</span>
            </div>
            <h3 className="text-step-22 font-bold text-[var(--text)] m-0">
              Download Verified Qualifications
            </h3>
            <p className="text-step-15 text-[var(--muted)] m-0 max-w-[55ch]">
              Select academic CV for research, publications, awards, and CGPA (4.00/4.00), or industry résumé for applied machine learning engineering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={profile.academicCvPath}
              download
              className="btn-interactive group inline-flex items-center gap-2.5 h-11 px-5 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-step-15 hover:opacity-95 whitespace-nowrap shadow-xs"
            >
              <Download className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
              <span>{tHero('downloadAcademicCv')}</span>
            </a>

            <a
              href={profile.resumePath}
              download
              className="btn-interactive group inline-flex items-center gap-2.5 h-11 px-5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-step-15 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
              <span>{tHero('downloadResume')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
