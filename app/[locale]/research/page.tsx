import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { profile, getFeaturedPublication } from '@/content/profile';
import { buildPageMetadata, buildResearchJsonLd } from '@/lib/seo';
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
    pathname: '/research',
    title: t('researchTitle'),
    description: t('researchDescription'),
  });
}

function Authors({ authors }: { authors: string[] }) {
  return (
    <bdi>
      {authors.map((author, i) => (
        <span key={author}>
          {author.includes('Miakhil') ? <strong className="text-[var(--text)]">{author}</strong> : author}
          {i < authors.length - 1 ? ', ' : ''}
        </span>
      ))}
    </bdi>
  );
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'researchPage' });
  const tPub = await getTranslations({ locale, namespace: 'featuredPublication' });
  const jsonLd = buildResearchJsonLd();
  const paper = getFeaturedPublication();
  const manuscripts = profile.publications.filter((p) => !p.isPublished);
  const msCgpa = profile.education[0].gpa?.match(/[\d.]+/)?.[0] ?? '';

  return (
    <div className="page">
      <script
        id="research-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t('heroTitle')}
        lead={t('intro')}
        aside={
          <StatPanel
            stats={[
              { value: '0.777', label: t('stats.prauc') },
              { value: msCgpa, label: t('stats.cgpa') },
              { value: String(profile.publications.length), label: t('stats.papers') },
              { value: String(profile.researchProjects.length), label: t('stats.projects') },
            ]}
          />
        }
      />

      <PageSection id="publications" index={1} title={t('publicationsHeading')}>
        <article className="panel feature-paper">
          <div className="feature-paper-main">
            <div className="pill-row">
              <span className="pill pill-accent">
                <bdi>{paper.status}</bdi>
              </span>
              {paper.badges?.map((badge) => (
                <span key={badge} className="pill">
                  <bdi>{badge}</bdi>
                </span>
              ))}
            </div>
            <h3 className="feature-paper-title">
              <bdi>{paper.title}</bdi>
            </h3>
            <p className="meta-line">
              <Authors authors={paper.authors} />
            </p>
            <p className="meta-line">
              <bdi>
                {paper.venue}, vol. {paper.volume}, article {paper.articleNumber} · {paper.publishedDate}
                {paper.funding ? ` · ${paper.funding}` : ''}
              </bdi>
            </p>
            <p className="body-text">
              <bdi>{paper.summary}</bdi>
            </p>
            <div className="chapter-links">
              <a className="btn-primary" href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                {tPub('readPaper')}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <span className="chapter-stat-caption">doi:{paper.doi}</span>
            </div>
          </div>
          <div className="feature-paper-stat">
            <span className="chapter-stat-value">0.777</span>
            <span className="chapter-stat-caption" dir="auto">
              {t('stats.praucDetail')}
            </span>
          </div>
        </article>

        <ul className="panel row-list">
          {manuscripts.map((pub) => (
            <li key={pub.id}>
              <span className="pill">
                <bdi>{pub.status}</bdi>
              </span>
              <div>
                <h3 className="row-title">
                  <bdi>{pub.title}</bdi>
                </h3>
                <p className="meta-line">
                  <bdi>
                    {pub.venue} · {pub.year}
                  </bdi>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="research-projects" index={2} title={t('projectsHeading')}>
        <div className="card-grid">
          {profile.researchProjects.map((project) => (
            <article key={project.id} className="panel project-card">
              <span className="section-index">
                <bdi>{project.period}</bdi>
              </span>
              <h3 className="row-title">
                <bdi>{project.title}</bdi>
              </h3>
              {project.supervisor ? (
                <p className="meta-line">
                  {t('supervisorLabel')} <bdi>{project.supervisor}</bdi>
                </p>
              ) : null}
              <p className="body-text">
                <bdi>{project.description}</bdi>
              </p>
              <div className="pill-row">
                {project.metricsOrMethods.map((m) => (
                  <span key={m} className="pill">
                    <bdi>{m}</bdi>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection id="talks" index={3} title={t('talksHeading')}>
        <div className="card-grid">
          <ul className="panel row-list row-list-plain">
            {profile.talksAndConferences.map((talk) => (
              <li key={talk.id}>
                <span className="section-index">
                  <bdi>{talk.date}</bdi>
                </span>
                <div>
                  <h3 className="row-title">
                    <bdi>{talk.title}</bdi>
                  </h3>
                  <p className="meta-line">
                    <bdi>{talk.venue}</bdi>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="panel">
            <h3 className="row-title mb-4" dir="auto">
              {t('teachingHeading')}
            </h3>
            <ul className="bullet-list">
              {profile.teachingAndService.map((item) => (
                <li key={item}>
                  <bdi>{item}</bdi>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
