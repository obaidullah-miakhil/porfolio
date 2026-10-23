import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { EnrichedGitHubRepo } from '@/lib/github';
import type { WebsiteProjectItem } from '@/content/profile';
import { GitHubIcon } from './BrandIcons';
import { ExternalLink, Star } from 'lucide-react';

export function RepoCard({ repo }: { repo: EnrichedGitHubRepo }) {
  const t = useTranslations('projectsPage');

  return (
    <article className="card-interactive group p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-step-22 font-bold text-[var(--text)]">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] hover:underline transition-colors duration-200"
            >
              {repo.title}
            </a>
          </h3>
          <GitHubIcon
            size={18}
            className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0 mt-1 transition-colors duration-200"
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

        <p className="text-step-15 text-[var(--text)] m-0 pt-1 leading-relaxed">
          {repo.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)] text-step-13 text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text)]">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{
                backgroundColor:
                  repo.language === 'Python'
                    ? '#3572A5'
                    : repo.language === 'TypeScript'
                    ? '#3178C6'
                    : 'var(--accent)',
              }}
              aria-hidden="true"
            />
            <span>{repo.language}</span>
          </span>
          {repo.stars > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
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
          <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl-flip" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function WebsiteCard({ site }: { site: WebsiteProjectItem }) {
  const t = useTranslations('projectsPage');

  return (
    <article className="card-interactive group rounded-[6px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col justify-between">
      {/* Browser chrome header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[var(--bg)] border-b border-[var(--border)] select-none">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)] inline-block" />
        </div>
        <span className="text-step-13 text-[var(--muted)] font-mono text-[11px] truncate max-w-[200px]" dir="ltr">
          {site.displayDomain}
        </span>
        <div className="w-8" aria-hidden="true" />
      </div>

      {/* 16:10 aspect ratio screenshot container */}
      <div className="relative w-full aspect-[16/10] border-b border-[var(--border)] bg-[var(--bg)] overflow-hidden">
        <Image
          src={site.desktopImage}
          alt={`Home page of ${site.name}, built by Obaidullah Miakhil`}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
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
                className="hover:text-[var(--accent)] hover:underline transition-colors duration-200"
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
            className="inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline whitespace-nowrap"
          >
            <span>{t('visitSite')}</span>
            <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl-flip" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
