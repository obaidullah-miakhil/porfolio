import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Download } from 'lucide-react';
import { profile } from '@/content/profile';
import { PrintCvButton } from '@/components/PrintCvButton';
import { buildPageMetadata } from '@/lib/seo';
import { PageHero, PageSection } from '@/components/page/PageParts';

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

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tSections = await getTranslations({ locale, namespace: 'sections' });
  const t = await getTranslations({ locale, namespace: 'cvPage' });

  return (
    <div className="page">
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('heroTitle')}
        lead={t('subtitle')}
        actions={
          <>
            <a className="btn-primary no-print" href={profile.academicCvPath} download>
              <Download className="w-4 h-4" aria-hidden="true" />
              {tHero('downloadAcademicCv')}
            </a>
            <a className="btn-quiet no-print" href={profile.resumePath} download>
              {tHero('downloadResume')}
            </a>
            <PrintCvButton label={t('printCv')} />
          </>
        }
        aside={
          <div className="panel contact-panel">
            <a className="text-link" href={`mailto:${profile.emailPrimary}`} dir="ltr">
              {profile.emailPrimary}
            </a>
            <a className="text-link" href={`mailto:${profile.emailAcademic}`} dir="ltr">
              {profile.emailAcademic}
            </a>
            <span className="chapter-stat-caption" dir="auto">
              {profile.location}
            </span>
          </div>
        }
      />

      <PageSection id="cv-education" index={1} title={tSections('education')}>
        <ol className="panel timeline">
          {profile.education.map((edu) => (
            <li key={edu.id}>
              <span className="section-index">
                <bdi>{edu.dates}</bdi>
              </span>
              <div>
                <h3 className="row-title">
                  <bdi>{edu.degree}</bdi>
                </h3>
                <p className="meta-line">
                  <bdi>
                    {edu.institution} · {edu.location}
                  </bdi>
                </p>
                {edu.gpa ? (
                  <p className="meta-line text-[var(--text)]">
                    <bdi>
                      {edu.gpa}
                      {edu.credits ? ` (${edu.credits})` : ''}
                    </bdi>
                  </p>
                ) : null}
                {edu.thesis ? (
                  <p className="body-text">
                    <strong>{t('thesisLabel')} </strong>
                    <bdi>{edu.thesis}</bdi>
                  </p>
                ) : null}
                {edu.coursework ? (
                  <p className="meta-line">
                    <strong>{t('courseworkLabel')} </strong>
                    <bdi>{edu.coursework}</bdi>
                  </p>
                ) : null}
                {edu.notes ? (
                  <p className="meta-line">
                    <bdi>{edu.notes}</bdi>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection id="cv-publications" index={2} title={tSections('publications')}>
        <ul className="panel row-list">
          {profile.publications.map((pub) => (
            <li key={pub.id}>
              <span className={pub.isPublished ? 'pill pill-accent' : 'pill'}>
                <bdi>{pub.status}</bdi>
              </span>
              <div>
                <h3 className="row-title">
                  {pub.doi ? (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link"
                    >
                      <bdi>{pub.title}</bdi>
                    </a>
                  ) : (
                    <bdi>{pub.title}</bdi>
                  )}
                </h3>
                <p className="meta-line">
                  <bdi>
                    {pub.authors.join(', ')} · {pub.venue} · {pub.year}
                  </bdi>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="cv-experience" index={3} title={tSections('experience')}>
        <ol className="panel timeline">
          {profile.experience.map((exp) => (
            <li key={exp.id}>
              <span className="section-index">
                <bdi>{exp.dates}</bdi>
              </span>
              <div>
                <h3 className="row-title">
                  <bdi>{exp.role}</bdi>
                </h3>
                <p className="meta-line">
                  <bdi>
                    {exp.organisation} · {exp.location}
                  </bdi>
                </p>
                <ul className="bullet-list">
                  {exp.points.map((point) => (
                    <li key={point}>
                      <bdi>{point}</bdi>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection id="cv-skills" index={4} title={tSections('skills')}>
        <div className="card-grid card-grid-3">
          {profile.skills.map((group) => (
            <div key={group.categoryKey} className="panel">
              <h3 className="row-title mb-3">
                <bdi>{group.categoryLabel}</bdi>
              </h3>
              <div className="pill-row">
                {group.items.map((item) => (
                  <span key={item} className="pill">
                    <bdi>{item}</bdi>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection id="cv-recognition" index={5} title={t('recognitionHeading')}>
        <div className="card-grid card-grid-3">
          <div className="panel">
            <h3 className="row-title mb-3" dir="auto">
              {tSections('awards')}
            </h3>
            <ul className="row-list row-list-plain row-list-bare">
              {profile.awards.map((award) => (
                <li key={award.title}>
                  <span className="section-index">{award.year}</span>
                  <div>
                    <h3 className="row-title">
                      <bdi>{award.title}</bdi>
                    </h3>
                    <p className="meta-line">
                      <bdi>
                        {award.organisation}. {award.description}
                      </bdi>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <h3 className="row-title mb-3" dir="auto">
              {tSections('talks')}
            </h3>
            <ul className="row-list row-list-plain row-list-bare">
              {profile.talksAndConferences.map((talk) => (
                <li key={talk.id}>
                  <div>
                    <p className="body-text">
                      <bdi>{talk.title}</bdi>
                    </p>
                    <p className="meta-line">
                      <bdi>
                        {talk.venue} · {talk.date}
                      </bdi>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <h3 className="row-title mb-3" dir="auto">
              {tSections('certifications')}
            </h3>
            <ul className="row-list row-list-plain row-list-bare">
              {profile.certifications.map((cert) => (
                <li key={cert.title}>
                  <div>
                    <p className="body-text">
                      <bdi>{cert.title}</bdi>
                    </p>
                    <p className="meta-line">
                      <bdi>
                        {cert.issuer} · {cert.year}
                      </bdi>
                      {cert.url ? (
                        <>
                          {' · '}
                          <a
                            className="text-link text-[13px]"
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t('verifyCertificate')}
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
