import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getGitHubRepos } from '@/lib/github';
import { RepoCard, WebsiteCard } from '@/components/ProjectCards';
import { Reveal } from '@/components/Reveal';
import { profile } from '@/content/profile';
import { buildPageMetadata } from '@/lib/seo';
import { GitHubIcon } from '@/components/BrandIcons';
import { SupervisedProjectsSection } from '@/components/SupervisedProjectsSection';
import { ExternalLink } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildPageMetadata({
    locale,
    pathname: '/projects',
    title: t('projectsTitle'),
    description: t('projectsDescription'),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tProjects = await getTranslations({ locale, namespace: 'projectsPage' });
  const { repos, publicRepoCount } = await getGitHubRepos();

  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-16">
      {/* Page Header */}
      <Reveal>
        <div className="space-y-3 border-b border-[var(--border)] pb-8">
          <h1 className="text-step-36 font-bold text-[var(--text)]">
            {tProjects('heading')}
          </h1>
          <p className="text-step-15 text-[var(--muted)] max-w-[65ch] m-0">
            {tProjects('intro')}
          </p>
        </div>
      </Reveal>

      {/* GitHub Profile Banner */}
      <Reveal>
        <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5 tabular-nums">
              <GitHubIcon size={20} className="text-[var(--text)]" />
              <h2 className="text-step-22 font-bold text-[var(--text)]">
                {tProjects('githubBlockTitle')}
              </h2>
              <span className="text-step-13 px-2.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]">
                {publicRepoCount} {tProjects('publicReposLabel')}
              </span>
            </div>
            <p className="text-step-15 text-[var(--muted)] m-0">
              {tProjects('githubBlockSubtitle')}
            </p>
          </div>

          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive link-arrow inline-flex items-center gap-2 h-11 px-4 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-15 font-medium hover:opacity-95"
          >
            <span>{tProjects('viewGithubProfile')}</span>
            <ExternalLink className="w-4 h-4 rtl-flip" />
          </a>
        </div>
      </Reveal>

      {/* 01 Repositories Grid */}
      <Reveal>
        <section aria-labelledby="repos-heading" className="space-y-6">
          <div className="space-y-1">
            <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
              01
            </div>
            <h2
              id="repos-heading"
              className="text-step-28 font-bold text-[var(--text)]"
            >
              {tProjects('repositoriesHeading')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {repos.map((repo) => (
              <RepoCard key={repo.slug} repo={repo} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* 02 Websites Built */}
      <Reveal>
        <section
          aria-labelledby="websites-heading"
          className="space-y-6 pt-10 border-t border-[var(--border)]"
        >
          <div className="space-y-1">
            <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
              02
            </div>
            <h2
              id="websites-heading"
              className="text-step-28 font-bold text-[var(--text)]"
            >
              {tProjects('websitesHeading')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profile.websitesBuilt.map((site) => (
              <WebsiteCard key={site.slug} site={site} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* 03 Supervised Student Projects (150+ Projects) */}
      <Reveal>
        <SupervisedProjectsSection sectionNumber="03" />
      </Reveal>
    </div>
  );
}
