import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import type { EnrichedGitHubRepo } from '@/lib/github';
import type { WebsiteProjectItem } from '@/content/profile';
import { GitHubIcon } from './BrandIcons';

export function RepoCard({ repo }: { repo: EnrichedGitHubRepo }) {
  const t = useTranslations('projectsPage');

  return (
    <article className="panel project-card">
      <div className="flex items-start justify-between gap-3">
        <span className="section-index" dir="ltr">
          {repo.repoName}
        </span>
        <GitHubIcon size={18} className="text-[var(--muted)] shrink-0" />
      </div>
      <h3 className="row-title">
        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="card-link">
          {repo.title}
        </a>
      </h3>
      <p className="body-text">{repo.description}</p>
      <div className="card-foot">
        <span className="pill">{repo.language}</span>
        {repo.date ? <span className="chapter-stat-caption">{repo.date}</span> : null}
        <span className="chapter-stat-caption">
          ★ {repo.stars} {t('starsLabel')}
        </span>
        <a className="text-link ms-auto" href={repo.url} target="_blank" rel="noopener noreferrer">
          {t('viewRepository')}
        </a>
      </div>
    </article>
  );
}

export function WebsiteCard({ site }: { site: WebsiteProjectItem }) {
  const t = useTranslations('projectsPage');

  return (
    <article className="panel site-card">
      <div className="site-frame">
        <div className="site-frame-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <em dir="ltr">{site.displayDomain}</em>
        </div>
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image
            src={site.desktopImage}
            alt={`Home page of ${site.name}, built by Obaidullah Miakhil`}
            fill
            sizes="(max-width: 900px) 100vw, 560px"
            className="object-cover object-top"
            loading="lazy"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="row-title">
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="card-link">
            {site.name}
          </a>
        </h3>
        <p className="body-text">
          <span className="text-[var(--muted)]">{t('roleLabel')} </span>
          {site.role}
        </p>
        <div className="card-foot">
          <a className="text-link" href={site.url} target="_blank" rel="noopener noreferrer">
            {t('visitSite')} <ArrowUpRight className="inline w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
