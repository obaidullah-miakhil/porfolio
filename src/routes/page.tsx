import type { Metadata } from 'next';
import React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { profile, getFeaturedPublication } from '@/content/profile';
import { buildPageMetadata, buildHomeJsonLd } from '@/lib/seo';
import { StoryStage } from '@/components/story/StoryStage';
import { Words } from '@/components/story/Words';
import { CountUp } from '@/components/story/CountUp';
import type { StoryChapterMeta } from '@/components/story/storyState';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildPageMetadata({
    locale,
    pathname: '',
    title: t('homeTitle'),
    description: t('homeDescription'),
    isHome: true,
  });
}

// The order of the walk; see docs/STORY.md
const CHAPTERS = [
  { id: 'intro', pose: 'wave' },
  { id: 'roots', pose: 'think' },
  { id: 'border', pose: 'proud' },
  { id: 'paper', pose: 'point' },
  { id: 'question', pose: 'present' },
  { id: 'teaching', pose: 'explain' },
  { id: 'building', pose: 'type' },
  { id: 'next', pose: 'wave' },
] as const satisfies readonly Omit<StoryChapterMeta, 'label'>[];

type ChapterId = (typeof CHAPTERS)[number]['id'];

function Chapter({
  id,
  index,
  marker,
  place,
  children,
}: {
  id: ChapterId;
  index: number;
  marker: string;
  place: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-chapter={index} className="chapter" aria-labelledby={`${id}-title`}>
      <div className="chapter-marker" aria-hidden="true">
        <strong>{marker}</strong>
        <span>{place}</span>
      </div>
      <div className="chapter-body">{children}</div>
    </section>
  );
}

function Rise({ order, children }: { order: number; children: React.ReactNode }) {
  return (
    <div className="rise" style={{ '--d': order } as React.CSSProperties}>
      {children}
    </div>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'story' });
  const paper = getFeaturedPublication();
  const jsonLd = buildHomeJsonLd(locale);
  const internships = profile.experience.filter((e) => /intern/i.test(e.role)).length;
  const index = (id: ChapterId) => CHAPTERS.findIndex((c) => c.id === id);

  const chapters: StoryChapterMeta[] = CHAPTERS.map((c) => ({
    ...c,
    label: t(`${c.id}.label`),
  }));

  const head = (id: ChapterId) => (
    <>
      <p className="chapter-eyebrow" dir="auto">{t(`${id}.eyebrow`)}</p>
      <h2 id={`${id}-title`} className="chapter-title" dir="auto">
        <Words text={t(`${id}.title`)} />
      </h2>
    </>
  );

  const builds = [
    { key: 'chatbot', href: null },
    { key: 'emotion', href: profile.githubProjects[0].url },
    { key: 'federated', href: profile.huggingfaceUrl },
    { key: 'websites', href: profile.websitesBuilt[0].url },
  ] as const satisfies readonly { key: string; href: string | null }[];

  return (
    <>
      <script
        id="home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">
        {profile.name} — {profile.roleLine}
      </h1>

      <StoryStage chapters={chapters} railLabel={t('railLabel')}>
        <Chapter id="intro" index={0} marker={t('intro.marker')} place={t('intro.place')}>
          {head('intro')}
          <Rise order={0}>
            <p className="chapter-text" dir="auto">{t('intro.text')}</p>
          </Rise>
          <Rise order={1}>
            <p className="story-hint" dir="auto">
              <i aria-hidden="true" />
              {t('scrollHint')}
            </p>
          </Rise>
        </Chapter>

        <Chapter id="roots" index={index('roots')} marker={t('roots.marker')} place={t('roots.place')}>
          {head('roots')}
          <Rise order={0}>
            <p className="chapter-text" dir="auto">{t('roots.text')}</p>
          </Rise>
          <Rise order={1}>
            <div className="chapter-stat">
              <CountUp value={profile.education[2].gpa ?? ''} chapter={index('roots')} />
              <span className="chapter-stat-caption" dir="auto">{t('roots.statCaption')}</span>
            </div>
          </Rise>
        </Chapter>

        <Chapter id="border" index={index('border')} marker={t('border.marker')} place={t('border.place')}>
          {head('border')}
          <Rise order={0}>
            <p className="chapter-text" dir="auto">{t('border.text')}</p>
          </Rise>
          <Rise order={1}>
            <p className="chapter-text chapter-text-extra" dir="auto">{t('border.extra')}</p>
          </Rise>
          <Rise order={2}>
            <div className="chapter-stat">
              <CountUp value={String(internships)} chapter={index('border')} duration={900} />
              <span className="chapter-stat-caption" dir="auto">{t('border.statCaption')}</span>
            </div>
          </Rise>
        </Chapter>

        <Chapter id="paper" index={index('paper')} marker={t('paper.marker')} place={t('paper.place')}>
          {head('paper')}
          <Rise order={0}>
            <p className="chapter-text" dir="auto">{t('paper.text')}</p>
          </Rise>
          <Rise order={1}>
            <div className="chapter-stat">
              <CountUp value="0.777" chapter={index('paper')} />
              <span className="chapter-stat-caption" dir="auto">{t('paper.statCaption')}</span>
            </div>
          </Rise>
          <Rise order={2}>
            <div className="chapter-links">
              <a className="btn-primary" href={paper.url} target="_blank" rel="noopener noreferrer">
                {t('paper.cta')}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <span className="chapter-stat-caption hide-mobile">doi:{paper.doi}</span>
            </div>
          </Rise>
        </Chapter>

        <Chapter id="question" index={index('question')} marker={t('question.marker')} place={t('question.place')}>
          {head('question')}
          <Rise order={0}>
            <p className="chapter-text" dir="auto">{t('question.text')}</p>
          </Rise>
          <Rise order={1}>
            <div className="chapter-stat">
              <CountUp value="21" from={38} chapter={index('question')} duration={1800} />
              <span className="chapter-stat-caption" dir="auto">{t('question.statCaption')}</span>
            </div>
          </Rise>
          <Rise order={2}>
            <div className="chapter-links">
              <Link className="text-link link-arrow" href="/research">
                {t('question.cta')} <ArrowRight className="inline w-4 h-4 rtl-flip" aria-hidden="true" />
              </Link>
            </div>
          </Rise>
        </Chapter>

        <Chapter id="teaching" index={index('teaching')} marker={t('teaching.marker')} place={t('teaching.place')}>
          {head('teaching')}
          <Rise order={0}>
            <p className="chapter-text" dir="auto">{t('teaching.text')}</p>
          </Rise>
          <Rise order={1}>
            <p className="chapter-text chapter-text-extra" dir="auto">{t('teaching.extra')}</p>
          </Rise>
          <Rise order={2}>
            <div className="chapter-stat">
              <CountUp value={profile.supervisedProjectsTotal} chapter={index('teaching')} />
              <span className="chapter-stat-caption" dir="auto">{t('teaching.statCaption')}</span>
            </div>
          </Rise>
          <Rise order={3}>
            <div className="chapter-links">
              <Link className="text-link link-arrow" href="/projects">
                {t('teaching.cta')} <ArrowRight className="inline w-4 h-4 rtl-flip" aria-hidden="true" />
              </Link>
            </div>
          </Rise>
        </Chapter>

        <Chapter id="building" index={index('building')} marker={t('building.marker')} place={t('building.place')}>
          {head('building')}
          <Rise order={0}>
            <ul className="build-list">
              {builds.map((item, i) => (
                <li key={item.key}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <h3 dir="auto">{t(`building.items.${item.key}.title`)}</h3>
                  <p dir="auto">{t(`building.items.${item.key}.text`)}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={t(`building.items.${item.key}.title`)}>
                      ↗
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </Rise>
          <Rise order={1}>
            <div className="chapter-links">
              <Link className="text-link link-arrow" href="/projects">
                {t('building.cta')} <ArrowRight className="inline w-4 h-4 rtl-flip" aria-hidden="true" />
              </Link>
              <a className="text-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </Rise>
        </Chapter>

        <Chapter id="next" index={index('next')} marker={t('next.marker')} place={t('next.place')}>
          <span id="contact" aria-hidden="true" />
          {head('next')}
          <Rise order={0}>
            <p className="chapter-text" dir="auto">{t('next.text')}</p>
          </Rise>
          <Rise order={1}>
            <a className="contact-email" href={`mailto:${profile.emailPrimary}`}>
              {profile.emailPrimary}
            </a>
          </Rise>
          <Rise order={2}>
            <div className="chapter-links">
              <a className="btn-primary" href={profile.academicCvPath} download>
                <Download className="w-4 h-4" aria-hidden="true" />
                {t('next.academicCv')}
              </a>
              <a className="btn-quiet" href={profile.resumePath} download>
                {t('next.resume')}
              </a>
            </div>
          </Rise>
          <Rise order={3}>
            <div className="chapter-links">
              <a className="text-link" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="text-link" href={profile.scholarUrl} target="_blank" rel="noopener noreferrer">Scholar</a>
              <a className="text-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="text-link" href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </Rise>
          <Rise order={4}>
            <p className="chapter-stat-caption hide-mobile" dir="auto">{t('next.thanks')}</p>
          </Rise>
        </Chapter>
      </StoryStage>
    </>
  );
}
