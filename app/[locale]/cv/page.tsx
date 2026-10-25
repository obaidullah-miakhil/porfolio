import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { profile } from '@/content/profile';
import { PrintCvButton } from '@/components/PrintCvButton';
import { Reveal } from '@/components/Reveal';
import { buildPageMetadata } from '@/lib/seo';
import { Download, ExternalLink } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildPageMetadata({
    locale,
    pathname: '/cv',
    title: t('cvTitle'),
    description: t('cvDescription'),
  });
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tSections = await getTranslations({ locale, namespace: 'sections' });
  const tCv = await getTranslations({ locale, namespace: 'cvPage' });

  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-12">
      {/* Header & Download Bar */}
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
          <div className="space-y-2">
            <h1 className="text-step-36 font-bold text-[var(--text)]">
              {tCv('heading')}
            </h1>
            <p className="text-step-15 text-[var(--muted)] m-0">
              {tCv('subtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-step-13 text-[var(--muted)] pt-1">
              <span>
                <bdi>{profile.emailPrimary}</bdi>
              </span>
              <span>·</span>
              <span>
                <bdi>{profile.emailAcademic}</bdi>
              </span>
              <span>·</span>
              <span>
                <bdi>{profile.location}</bdi>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 no-print">
            <a
              href={profile.academicCvPath}
              download
              className="btn-interactive inline-flex items-center gap-2 h-11 px-4 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-15 font-medium hover:opacity-95"
            >
              <Download className="w-4 h-4" />
              <span>{tHero('downloadAcademicCv')}</span>
            </a>

            <a
              href={profile.resumePath}
              download
              className="btn-interactive inline-flex items-center gap-2 h-11 px-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-step-15 font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{tHero('downloadResume')}</span>
            </a>

            <PrintCvButton label={tCv('printCv')} />
          </div>
        </div>
      </Reveal>

      {/* 01 Education */}
      <Reveal>
        <section aria-labelledby="cv-education" className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2 space-y-1">
            <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
              01
            </div>
            <h2
              id="cv-education"
              className="text-step-22 font-bold text-[var(--text)]"
            >
              {tSections('education')}
            </h2>
          </div>

          <div className="space-y-4 tabular-nums">
            {profile.education.map((edu) => (
              <div
                key={edu.id}
                className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-2"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-step-18 font-bold text-[var(--text)]">
                    <bdi>{edu.degree}</bdi>
                  </h3>
                  <span className="text-step-13 font-medium text-[var(--accent)]">
                    <bdi>{edu.dates}</bdi>
                  </span>
                </div>
                <p className="text-step-15 text-[var(--muted)] m-0">
                  <bdi>
                    {edu.institution} — {edu.location}
                  </bdi>
                </p>
                {edu.gpa && (
                  <p className="text-step-13 font-medium text-[var(--text)] m-0">
                    <bdi>
                      {edu.gpa}
                      {edu.credits ? ` (${edu.credits})` : ''}
                    </bdi>
                  </p>
                )}
                {edu.thesis && (
                  <p className="text-step-15 text-[var(--text)] m-0">
                    <strong>{tCv('thesisLabel')} </strong>
                    <bdi>{edu.thesis}</bdi>
                  </p>
                )}
                {edu.coursework && (
                  <p className="text-step-13 text-[var(--muted)] m-0">
                    <strong>{tCv('courseworkLabel')} </strong>
                    <bdi>{edu.coursework}</bdi>
                  </p>
                )}
                {edu.notes && (
                  <p className="text-step-13 text-[var(--muted)] m-0">
                    <bdi>{edu.notes}</bdi>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 02 Publications */}
      <Reveal>
        <section aria-labelledby="cv-publications" className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2 space-y-1">
            <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
              02
            </div>
            <h2
              id="cv-publications"
              className="text-step-22 font-bold text-[var(--text)]"
            >
              {tSections('publications')}
            </h2>
          </div>

          <div className="space-y-4 tabular-nums">
            {profile.publications.map((pub) => (
              <div
                key={pub.id}
                className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-2"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-step-18 font-bold text-[var(--text)]">
                    <bdi>{pub.title}</bdi>
                  </h3>
                  <span className="text-step-13 font-medium text-[var(--accent)]">
                    <bdi>
                      {pub.status} · {pub.year}
                    </bdi>
                  </span>
                </div>
                <p className="text-step-13 text-[var(--muted)] m-0">
                  <bdi>{pub.authors.join(', ')}</bdi>
                </p>
                <p className="text-step-13 text-[var(--muted)] m-0">
                  <bdi>{pub.venue}</bdi>
                </p>
                {pub.doi && (
                  <p className="text-step-13 m-0">
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link text-[var(--accent)]"
                    >
                      <bdi>https://doi.org/{pub.doi}</bdi>
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 03 Experience (all 10 roles in 2-column hairline rows) */}
      <Reveal>
        <section aria-labelledby="cv-experience" className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2 space-y-1">
            <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
              03
            </div>
            <h2
              id="cv-experience"
              className="text-step-22 font-bold text-[var(--text)]"
            >
              {tSections('experience')}
            </h2>
          </div>

          <div className="border-b border-[var(--border)] divide-y divide-[var(--border)]">
            {profile.experience.map((exp) => (
              <div
                key={exp.id}
                className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
              >
                <div className="sm:col-span-4 text-step-13 text-[var(--muted)] tabular-nums">
                  <bdi>{exp.dates}</bdi>
                </div>
                <div className="sm:col-span-8 space-y-1.5">
                  <h3 className="text-step-18 font-bold text-[var(--text)] m-0">
                    <bdi>{exp.role}</bdi>
                  </h3>
                  <p className="text-step-13 font-medium text-[var(--accent)] m-0">
                    <bdi>
                      {exp.organisation} · {exp.location}
                    </bdi>
                  </p>
                  <ul className="mt-2 space-y-1 text-step-15 text-[var(--text)] list-disc ps-5">
                    {exp.points.map((pt) => (
                      <li key={pt}>
                        <bdi>{pt}</bdi>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 04 Skills */}
      <Reveal>
        <section aria-labelledby="cv-skills" className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2 space-y-1">
            <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
              04
            </div>
            <h2
              id="cv-skills"
              className="text-step-22 font-bold text-[var(--text)]"
            >
              {tSections('skills')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.skills.map((group) => (
              <div
                key={group.categoryKey}
                className="card-interactive p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-3"
              >
                <h3 className="text-step-15 font-bold text-[var(--text)]">
                  <bdi>{group.categoryLabel}</bdi>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-step-13 px-2.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]"
                    >
                      <bdi>{item}</bdi>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 05 Awards, Talks & Certifications */}
      <Reveal>
        <div className="space-y-4">
          <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
            05
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 tabular-nums">
            {/* Awards */}
            <section className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h2 className="text-step-18 font-bold text-[var(--text)] border-b border-[var(--border)] pb-2">
                {tSections('awards')}
              </h2>
              <ul className="space-y-3">
                {profile.awards.map((award) => (
                  <li key={award.title} className="space-y-0.5">
                    <div className="text-step-15 font-bold text-[var(--text)]">
                      <bdi>{award.title}</bdi>{' '}
                      <span className="text-step-13 font-normal text-[var(--accent)]">
                        ({award.year})
                      </span>
                    </div>
                    <div className="text-step-13 text-[var(--muted)]">
                      <bdi>
                        {award.organisation} — {award.description}
                      </bdi>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Conferences & Workshops */}
            <section className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h2 className="text-step-18 font-bold text-[var(--text)] border-b border-[var(--border)] pb-2">
                {tSections('talks')}
              </h2>
              <ul className="space-y-3">
                {profile.talksAndConferences.map((talk) => (
                  <li key={talk.id} className="space-y-0.5">
                    <div className="text-step-15 font-medium text-[var(--text)]">
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

            {/* Certifications */}
            <section className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h2 className="text-step-18 font-bold text-[var(--text)] border-b border-[var(--border)] pb-2">
                {tSections('certifications')}
              </h2>
              <ul className="space-y-3">
                {profile.certifications.map((cert) => (
                  <li key={cert.title} className="space-y-0.5">
                    <div className="text-step-15 font-medium text-[var(--text)]">
                      <bdi>{cert.title}</bdi>
                    </div>
                    <div className="text-step-13 text-[var(--muted)] flex items-center gap-2">
                      <span>
                        <bdi>
                          {cert.issuer} · {cert.year}
                        </bdi>
                      </span>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="editorial-link inline-flex items-center gap-1 text-[var(--accent)] no-print"
                        >
                          <span>{tCv('verifyCertificate')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
