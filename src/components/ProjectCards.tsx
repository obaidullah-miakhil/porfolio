import React from 'react';
import { useTranslations } from 'next-intl';
import type { EnrichedGitHubRepo } from '@/lib/github';
import type { WebsiteProjectItem } from '@/content/profile';
import { GitHubIcon } from './BrandIcons';
import { ExternalLink, Star } from 'lucide-react';

export function RepoCard({ repo }: { repo: EnrichedGitHubRepo }) {
  const t = useTranslations('projectsPage');

  return (
    <article className="p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-step-22 font-bold text-[var(--text)]">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] hover:underline transition-colors"
            >
              {repo.title}
            </a>
          </h3>
          <GitHubIcon
            size={18}
            className="text-[var(--muted)] shrink-0 mt-1"
          />
        </div>

        <p className="text-step-13 text-[var(--muted)] m-0">
          <span>{repo.repoName}</span>
          {repo.date ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>{repo.date}</span>
            </>
          ) : null}
        </p>

        <p className="text-step-15 text-[var(--text)] m-0 pt-1">
          {repo.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)] text-step-13 text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <span className="font-medium text-[var(--text)]">
            {repo.language}
          </span>
          {repo.stars > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {repo.stars} {t('starsLabel')}
              </span>
            </span>
          ) : null}
        </div>

        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[var(--accent)] hover:underline whitespace-nowrap"
        >
          <span>{t('viewRepository')}</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function WebsiteCard({ site }: { site: WebsiteProjectItem }) {
  const t = useTranslations('projectsPage');

  return (
    <article className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col justify-between">
      {/* 16:10 aspect ratio preview box */}
      <div className="w-full aspect-[16/10] border-b border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between p-5 select-none">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <span className="text-step-13 font-medium text-[var(--text)] truncate">
            {site.displayDomain}
          </span>
          <span className="text-step-13 text-[var(--muted)]">HTTPS</span>
        </div>

        <div className="my-auto py-4 flex flex-col gap-2">
          <span className="text-step-22 font-bold text-[var(--text)]">
            {site.name}
          </span>
          <div className="w-24 h-1 bg-[var(--accent)]" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="h-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]" />
          <div className="h-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]" />
          <div className="h-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]" />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-step-22 font-bold text-[var(--text)]">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] hover:underline transition-colors"
              >
                {site.name}
              </a>
            </h3>
            <span className="text-step-13 text-[var(--muted)]">
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
            className="inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline whitespace-nowrap"
          >
            <span>{t('visitSite')}</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
