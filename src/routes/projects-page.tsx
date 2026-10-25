import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { getGitHubRepos } from '@/lib/github';
import { RepoCard, WebsiteCard } from '@/components/ProjectCards';
import { profile } from '@/content/profile';
import { buildPageMetadata } from '@/lib/seo';
import { SupervisedProjectsSection } from '@/components/SupervisedProjectsSection';
import { PageHero, PageSection, StatPanel } from '@/components/page/PageParts';

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

  const t = await getTranslations({ locale, namespace: 'projectsPage' });
  const { repos, publicRepoCount } = await getGitHubRepos();

  return (
    <div className="page">
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('heroTitle')}
        lead={t('intro')}
        actions={
          <a className="btn-primary" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            {t('viewGithubProfile')}
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        }
        aside={
          <StatPanel
            stats={[
              { value: String(publicRepoCount), label: t('publicReposLabel') },
              { value: String(profile.websitesBuilt.length), label: t('websitesHeading') },
              { value: profile.supervisedProjectsTotal, label: t('supervisedLabel') },
            ]}
          />
        }
      />

      <PageSection id="repos" index={1} title={t('repositoriesHeading')} intro={<p className="body-text">{t('githubBlockSubtitle')}</p>}>
        <div className="card-grid">
          {repos.map((repo) => (
            <RepoCard key={repo.slug} repo={repo} />
          ))}
        </div>
      </PageSection>

      <PageSection id="websites" index={2} title={t('websitesHeading')}>
        <div className="card-grid">
          {profile.websitesBuilt.map((site) => (
            <WebsiteCard key={site.slug} site={site} />
          ))}
        </div>
      </PageSection>

      <SupervisedProjectsSection sectionNumber="03" />
    </div>
  );
}
