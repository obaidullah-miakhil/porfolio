import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { EnrichedGitHubRepo } from '@/lib/github';
import type { WebsiteProjectItem } from '@/content/profile';
import { GitHubIcon } from './BrandIcons';
import { ExternalLink, Star } from 'lucide-react';
import { TiltCard } from './TiltCard';

export function RepoCard({ repo }: { repo: EnrichedGitHubRepo }) {
  const t = useTranslations('projectsPage');

  return (
    <TiltCard
      maxTilt={6}
      scale={1.01}
      className="card-interactive group p-6 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] flex flex-col justify-between gap-4 transition-all duration-300"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-step-22 font-bold text-[var(--text)]">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link hover:text-[var(--accent)] transition-colors duration-200"
            >
              {repo.title}
            </a>
          </h3>
          <GitHubIcon
            size={18}
            className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 mt-1 transition-colors duration-200"
          />
        </div>

        <p className="text-step-13 text-[var(--muted)] m-0 tabular-nums">
          <span>{repo.repoName}</span>
          {repo.date ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>{repo.date}</span>
            </>
          ) : null}
        </p>

        <p className="text-step-15 text-[var(--text)] m-0 pt-1 leading-relaxed">
          {repo.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)] text-step-13 text-[var(--muted)] tabular-nums">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text)]">
            <span
              className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] inline-block shadow-[0_0_6px_var(--accent)]"
              aria-hidden="true"
            />
            <span>{repo.language}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Star
              className="w-3.5 h-3.5 text-[var(--accent)]"
              aria-hidden="true"
            />
            <span>
              {repo.stars} {t('starsLabel')}
            </span>
          </span>
        </div>

        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="editorial-link link-arrow inline-flex items-center gap-1 font-medium text-[var(--accent)] whitespace-nowrap"
        >
          <span>{t('viewRepository')}</span>
          <ExternalLink className="w-3.5 h-3.5 rtl-flip" aria-hidden="true" />
        </a>
      </div>
    </TiltCard>
  );
}

export function WebsiteCard({ site }: { site: WebsiteProjectItem }) {
  const t = useTranslations('projectsPage');

  return (
    <TiltCard
      maxTilt={6}
      scale={1.01}
      className="card-interactive group rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm hover:shadow-[var(--glow-accent)] hover:border-[var(--accent)] overflow-hidden flex flex-col justify-between transition-all duration-300"
    >
      {/* 28px Browser chrome header bar drawn with 1px border and three 6px dots in --border */}
      <div className="h-[28px] flex items-center justify-between px-3 bg-[var(--bg)] border-b border-[var(--border)] select-none">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-[6px] h-[6px] rounded-full bg-red-400/80 inline-block" />
          <span className="w-[6px] h-[6px] rounded-full bg-amber-400/80 inline-block" />
          <span className="w-[6px] h-[6px] rounded-full bg-emerald-400/80 inline-block" />
        </div>
        <span
          className="text-step-13 text-[var(--muted)] font-mono truncate max-w-[200px]"
          dir="ltr"
        >
          {site.displayDomain}
        </span>
        <div className="w-6" aria-hidden="true" />
      </div>

      {/* 16:10 aspect ratio screenshot container */}
      <div className="relative w-full aspect-[16/10] border-b border-[var(--border)] bg-[var(--bg)] overflow-hidden group-hover:brightness-105 transition-all duration-300">
        <Image
          src={site.desktopImage}
          alt={`Home page of ${site.name}, built by Obaidullah Miakhil`}
          fill
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-step-22 font-bold text-[var(--text)]">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link hover:text-[var(--accent)] transition-colors duration-200"
              >
                {site.name}
              </a>
            </h3>
            <span className="text-step-13 text-[var(--muted)]" dir="ltr">
              {site.displayDomain}
            </span>
          </div>

          <p className="text-step-15 text-[var(--text)] m-0">
            <strong className="font-medium text-[var(--muted)]">
              {t('roleLabel')}{' '}
            </strong>
            {site.role}
          </p>
        </div>

        <div className="pt-2">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-link link-arrow inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] whitespace-nowrap"
          >
            <span>{t('visitSite')}</span>
            <ExternalLink className="w-4 h-4 rtl-flip" aria-hidden="true" />
          </a>
        </div>
      </div>
    </TiltCard>
  );
}
