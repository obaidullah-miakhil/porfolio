import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { profile } from '@/content/profile';
import { Reveal } from '@/components/Reveal';
import { buildPageMetadata, buildResearchJsonLd } from '@/lib/seo';
import { SceneGate } from '@/three/SceneGate';
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
    pathname: '/research',
    title: t('researchTitle'),
    description: t('researchDescription'),
  });
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tRes = await getTranslations({ locale, namespace: 'researchPage' });
  const tPub = await getTranslations({ locale, namespace: 'featuredPublication' });
  const jsonLd = buildResearchJsonLd();

  return (
    <div
      className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-16"
      suppressHydrationWarning
    >
      <script
        id="research-jsonld"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header + Phase 4 AttentionGrid 3D Scene */}
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[var(--border)] pb-10">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-step-36 font-bold text-[var(--text)]">
              {tRes('heading')}
            </h1>
            <p className="text-step-15 text-[var(--text)] leading-relaxed max-w-[65ch]">
              {tRes('intro')}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <SceneGate scene="research" />
          </div>
        </div>
      </Reveal>

      {/* Publications & Manuscripts (all 4 items) */}
      <Reveal>
        <section aria-labelledby="publications-heading" className="space-y-6">
          <h2
            id="publications-heading"
            className="text-step-28 font-bold text-[var(--text)]"
          >
            {tRes('publicationsHeading')}
          </h2>

          <div className="space-y-5">
            {profile.publications.map((pub, idx) => (
              <article
                key={pub.id}
                className={`card-interactive group p-6 sm:p-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-4 ${
                  idx === 0
                    ? 'border-s-4 border-s-[var(--accent)]'
                    : 'border-s-2 border-s-[var(--border)]'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-step-13 font-medium border border-[var(--accent)] text-[var(--accent)]">
                    {idx === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] pulse-dot inline-block" aria-hidden="true" />
                    )}
                    <bdi>{pub.status}</bdi>
                  </span>
                  {pub.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="tag-pill px-2.5 py-0.5 rounded-[4px] text-step-13 border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]"
                    >
                      <bdi>{badge}</bdi>
                    </span>
                  ))}
                  <span className="text-step-13 text-[var(--muted)]">
                    <bdi>{pub.year}</bdi>
                  </span>
                </div>

                <h3 className="text-step-22 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      <bdi>{pub.title}</bdi>
                    </a>
                  ) : (
                    <bdi>{pub.title}</bdi>
                  )}
                </h3>

                <p className="text-step-15 text-[var(--muted)]">
                  <bdi>
                    {pub.authors.map((author, authorIdx) => {
                      const isMe = author.includes('Miakhil');
                      return (
                        <span key={author}>
                          {isMe ? (
                            <strong className="font-bold text-[var(--text)] underline decoration-[var(--accent)] underline-offset-4">
                              {author}
                            </strong>
                          ) : (
                            author
                          )}
                          {authorIdx < pub.authors.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </bdi>
                </p>

                <p className="text-step-13 text-[var(--muted)]">
                  <bdi>
                    {pub.venue}
                    {pub.volume ? `, vol. ${pub.volume}` : ''}
                    {pub.articleNumber ? `, article ${pub.articleNumber}` : ''}
                    {pub.publishedDate ? ` · Published ${pub.publishedDate}` : ''}
                    {pub.receivedDate
                      ? ` (Received ${pub.receivedDate}, Accepted ${pub.acceptedDate})`
                      : ''}
                    {pub.funding ? ` · ${pub.funding}` : ''}
                  </bdi>
                </p>

                {pub.summary && (
                  <p className="text-step-15 text-[var(--text)] max-w-[65ch] leading-relaxed">
                    <bdi>{pub.summary}</bdi>
                  </p>
                )}

                {pub.keywords && pub.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-step-13 font-medium text-[var(--muted)]">
                      {tRes('keywordsLabel')}
                    </span>
                    {pub.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="tag-pill text-step-13 px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]"
                      >
                        <bdi>{kw}</bdi>
                      </span>
                    ))}
                  </div>
                )}

                {pub.url && (
                  <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-4">
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline"
                    >
                      <span>{tPub('readPaper')}</span>
                      <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl-flip" />
                    </a>
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-step-13 text-[var(--muted)] hover:text-[var(--accent)] hover:underline transition-colors duration-150"
                      >
                        <bdi>DOI: {pub.doi}</bdi>
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Research Projects */}
      <Reveal>
        <section aria-labelledby="research-projects-heading" className="space-y-6">
          <h2
            id="research-projects-heading"
            className="text-step-28 font-bold text-[var(--text)]"
          >
            {tRes('projectsHeading')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profile.researchProjects.map((proj) => (
              <article
                key={proj.id}
                className="card-interactive group p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-step-22 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
                      <bdi>{proj.title}</bdi>
                    </h3>
                    <span className="text-step-13 text-[var(--muted)] shrink-0">
                      <bdi>{proj.period}</bdi>
                    </span>
                  </div>
                  {proj.supervisor && (
                    <p className="text-step-13 text-[var(--accent)]">
                      {tRes('supervisorLabel')} <bdi>{proj.supervisor}</bdi>
                    </p>
                  )}
                  <p className="text-step-15 text-[var(--text)] leading-relaxed">
                    <bdi>{proj.description}</bdi>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
                  {proj.metricsOrMethods.map((m) => (
                    <span
                      key={m}
                      className="tag-pill text-step-13 px-2.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]"
                    >
                      <bdi>{m}</bdi>
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Talks & Teaching */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-step-22 font-bold text-[var(--text)]">
              {tRes('talksHeading')}
            </h2>
            <ul className="space-y-3">
              {profile.talksAndConferences.map((talk) => (
                <li key={talk.id} className="text-step-15">
                  <div className="font-medium text-[var(--text)]">
                    <bdi>{talk.title}</bdi>
                  </div>
                  <div className="text-step-13 text-[var(--muted)]">
                    <bdi>
                      {talk.venue} · {talk.date}
                    </bdi>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-step-22 font-bold text-[var(--text)]">
              {tRes('teachingHeading')}
            </h2>
            <ul className="space-y-2.5 text-step-15 text-[var(--text)] list-disc ps-5">
              {profile.teachingAndService.map((item) => (
                <li key={item}>
                  <bdi>{item}</bdi>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
