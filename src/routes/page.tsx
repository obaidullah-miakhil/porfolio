import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { FeaturedPublication } from '@/components/FeaturedPublication';
import { RepoCard } from '@/components/ProjectCards';
import { ContactSection } from '@/components/ContactSection';
import { Reveal } from '@/components/Reveal';
import { Link } from '@/i18n/routing';
import { getGitHubRepos } from '@/lib/github';
import { profile, getRecentExperience } from '@/content/profile';
import { buildPageMetadata, buildHomeJsonLd } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tAbout = await getTranslations({ locale, namespace: 'about' });
  const tSections = await getTranslations({ locale, namespace: 'sections' });
  const { repos } = await getGitHubRepos();
  const recentExperience = getRecentExperience(5);
  const jsonLd = buildHomeJsonLd(locale);

  return (
    <div className="space-y-16 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero + Audience Switcher + Phase 4 3D HeroForm */}
      <Hero />

      {/* 2. Featured Publication */}
      <FeaturedPublication />

      {/* 3. About + Key Facts */}
      <section className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-[var(--border)]">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tAbout('title')}
              </h2>
              <p className="text-step-15 text-[var(--text)] leading-relaxed max-w-[65ch]">
                {tAbout('paragraph1')}
              </p>
              <p className="text-step-15 text-[var(--text)] leading-relaxed max-w-[65ch]">
                {tAbout('paragraph2')}
              </p>
            </div>

            <div className="lg:col-span-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 self-start">
              <div>
                <div className="text-step-13 text-[var(--muted)]">
                  {tAbout('factLocationLabel')}
                </div>
                <div className="text-step-15 font-medium text-[var(--text)]">
                  {tAbout('factLocationValue')}
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <div className="text-step-13 text-[var(--muted)]">
                  {tAbout('factLanguagesLabel')}
                </div>
                <div className="text-step-15 font-medium text-[var(--text)]">
                  {tAbout('factLanguagesValue')}
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <div className="text-step-13 text-[var(--muted)]">
                  {tAbout('factOpenToLabel')}
                </div>
                <div className="text-step-15 font-medium text-[var(--accent)]">
                  {tAbout('factOpenToValue')}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. Research Projects (4 cards) */}
      <section className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tSections('research')}
              </h2>
              <Link
                href="/research"
                className="inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline"
              >
                <span>{tSections('allResearch')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {profile.researchProjects.map((proj) => (
                <article
                  key={proj.id}
                  className="p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-step-22 font-bold text-[var(--text)]">
                        <bdi>{proj.title}</bdi>
                      </h3>
                      <span className="text-step-13 text-[var(--muted)] shrink-0">
                        <bdi>{proj.period}</bdi>
                      </span>
                    </div>
                    <p className="text-step-15 text-[var(--text)]">
                      <bdi>{proj.description}</bdi>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
                    {proj.metricsOrMethods.map((m) => (
                      <span
                        key={m}
                        className="text-step-13 px-2.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]"
                      >
                        <bdi>{m}</bdi>
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. Recent Experience (5 entries) + Teaching */}
      <section className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-step-28 font-bold text-[var(--text)]">
                  {tSections('experience')}
                </h2>
                <Link
                  href="/cv"
                  className="inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline"
                >
                  <span>{tSections('fullCv')}</span>
                  <ArrowRight className="w-4 h-4 rtl-flip" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentExperience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-step-18 font-bold text-[var(--text)]">
                        <bdi>{exp.role}</bdi>
                      </h3>
                      <span className="text-step-13 text-[var(--muted)]">
                        <bdi>{exp.dates}</bdi>
                      </span>
                    </div>
                    <p className="text-step-13 font-medium text-[var(--accent)] mt-0.5">
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
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tSections('teaching')}
              </h2>
              <div className="p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]">
                <ul className="space-y-3 text-step-15 text-[var(--text)] list-disc ps-5">
                  {profile.teachingAndService.map((item) => (
                    <li key={item}>
                      <bdi>{item}</bdi>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6. Selected Projects (4 GitHub repos) */}
      <section className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tSections('projects')}
              </h2>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline"
              >
                <span>{tSections('allProjects')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {repos.map((repo) => (
                <RepoCard key={repo.slug} repo={repo} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7. Education */}
      <section className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <h2 className="text-step-28 font-bold text-[var(--text)]">
              {tSections('education')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-step-13 text-[var(--accent)] font-medium">
                      <bdi>{edu.dates}</bdi>
                    </span>
                    <h3 className="text-step-18 font-bold text-[var(--text)]">
                      <bdi>{edu.degree}</bdi>
                    </h3>
                    <p className="text-step-13 text-[var(--muted)]">
                      <bdi>
                        {edu.institution} · {edu.location}
                      </bdi>
                    </p>
                  </div>
                  {edu.gpa && (
                    <div className="pt-3 border-t border-[var(--border)] text-step-13 font-medium text-[var(--text)]">
                      <bdi>{edu.gpa}</bdi>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 8. Contact */}
      <ContactSection />
    </div>
  );
}
