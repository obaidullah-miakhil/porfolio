import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { FeaturedPublication } from '@/components/FeaturedPublication';
import { RepoCard, WebsiteCard } from '@/components/ProjectCards';
import { ContactSection } from '@/components/ContactSection';
import { Reveal } from '@/components/Reveal';
import { Link } from '@/i18n/routing';
import { getGitHubRepos } from '@/lib/github';
import { profile, getRecentExperience } from '@/content/profile';
import { buildPageMetadata, buildHomeJsonLd } from '@/lib/seo';
import { GitHubIcon } from '@/components/BrandIcons';
import { SceneGate } from '@/three/SceneGate';
import { ArrowRight, ExternalLink } from 'lucide-react';

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
  const tProjects = await getTranslations({ locale, namespace: 'projectsPage' });
  const { repos, publicRepoCount } = await getGitHubRepos();
  const recentExperience = getRecentExperience(5);
  const jsonLd = buildHomeJsonLd(locale);
  const selectedMlRepo = repos[0];

  const primaryResearchProject = profile.researchProjects[0];
  const secondaryResearchProjects = profile.researchProjects.slice(1);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16" suppressHydrationWarning>
      <script
        id="home-jsonld"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero + Audience Switcher + 3D Faceted Icosahedron */}
      <Hero />

      {/* Featured Publication */}
      <FeaturedPublication />

      {/* 01 About — square profile photo (6px radius) + two short paragraphs + facts list */}
      <section className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="space-y-1">
              <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
                01
              </div>
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tAbout('title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 flex flex-col sm:flex-row items-start gap-6">
                <div className="card-interactive relative w-36 h-36 sm:w-44 sm:h-44 aspect-square shrink-0 rounded-[6px] border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
                  <Image
                    src={profile.profilePhoto}
                    alt={profile.profilePhotoAlt}
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-cover object-top"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-step-15 text-[var(--text)] leading-relaxed max-w-[65ch] m-0">
                    {tAbout('paragraph1')}
                  </p>
                  <p className="text-step-15 text-[var(--text)] leading-relaxed max-w-[65ch] m-0">
                    {tAbout('paragraph2')}
                  </p>
                </div>
              </div>

              <div
                className="card-interactive lg:col-span-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3.5 self-start tabular-nums"
                suppressHydrationWarning
              >
                <div suppressHydrationWarning>
                  <div className="text-step-13 text-[var(--muted)]">
                    {tAbout('factLocationLabel')}
                  </div>
                  <div className="text-step-15 font-medium text-[var(--text)]">
                    {tAbout('factLocationValue')}
                  </div>
                </div>
                <div
                  className="border-t border-[var(--border)] pt-3"
                  suppressHydrationWarning
                >
                  <div className="text-step-13 text-[var(--muted)]">
                    {tAbout('factLanguagesLabel')}
                  </div>
                  <div className="text-step-15 font-medium text-[var(--text)]">
                    {tAbout('factLanguagesValue')}
                  </div>
                </div>
                <div
                  className="border-t border-[var(--border)] pt-3"
                  suppressHydrationWarning
                >
                  <div className="text-step-13 text-[var(--muted)]">
                    {tAbout('factCredentialsLabel')}
                  </div>
                  <div className="text-step-15 font-medium text-[var(--text)]">
                    {tAbout('factCredentialsValue')}
                  </div>
                </div>
                <div
                  className="border-t border-[var(--border)] pt-3"
                  suppressHydrationWarning
                >
                  <div className="text-step-13 text-[var(--muted)]">
                    {tAbout('factMentorshipLabel')}
                  </div>
                  <div className="text-step-15 font-medium text-[var(--text)]">
                    {tAbout('factMentorshipValue')}
                  </div>
                </div>
                <div
                  className="border-t border-[var(--border)] pt-3"
                  suppressHydrationWarning
                >
                  <div className="text-step-13 text-[var(--muted)]">
                    {tAbout('factOpenToLabel')}
                  </div>
                  <div className="text-step-15 font-semibold text-[var(--accent)]">
                    {tAbout('factOpenToValue')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 02 Research Projects (Asymmetric 2-column layout + 3D AttentionGrid) */}
      <section
        id="research"
        className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8"
      >
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
                  02
                </div>
                <h2 className="text-step-28 font-bold text-[var(--text)]">
                  {tSections('research')}
                </h2>
              </div>
              <Link
                href="/research"
                className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 font-medium text-[var(--accent)]"
              >
                <span>{tSections('allResearch')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </Link>
            </div>

            {/* Asymmetric 2-column grid: MS Thesis ICH card on start column + 3D AttentionGrid, stacked research cards on end column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {primaryResearchProject && (
                <div className="lg:col-span-6 flex flex-col gap-5">
                  <article className="card-interactive group p-6 sm:p-7 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex-1 flex flex-col justify-between gap-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 tabular-nums">
                        <span className="px-2.5 py-0.5 rounded-[4px] border border-[var(--accent)] text-step-13 font-medium text-[var(--accent)]">
                          MS Thesis · Medical AI
                        </span>
                        <span className="text-step-13 text-[var(--muted)]">
                          <bdi>{primaryResearchProject.period}</bdi>
                        </span>
                      </div>
                      <h3 className="text-step-22 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
                        <bdi>{primaryResearchProject.title}</bdi>
                      </h3>
                      {primaryResearchProject.supervisor && (
                        <p className="text-step-13 text-[var(--muted)] m-0">
                          Supervisor: <bdi>{primaryResearchProject.supervisor}</bdi>
                        </p>
                      )}
                      <p className="text-step-15 text-[var(--text)] leading-relaxed m-0">
                        <bdi>{primaryResearchProject.description}</bdi>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)] tabular-nums">
                      {primaryResearchProject.metricsOrMethods
                        .slice(0, 3)
                        .map((m) => (
                          <span
                            key={m}
                            className="text-step-13 px-2.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]"
                          >
                            <bdi>{m}</bdi>
                          </span>
                        ))}
                    </div>
                  </article>

                  {/* Scene B — Attention weight grid */}
                  <SceneGate scene="research" />
                </div>
              )}

              <div className="lg:col-span-6 flex flex-col gap-5">
                {secondaryResearchProjects.map((proj) => (
                  <article
                    key={proj.id}
                    className="card-interactive group p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex-1 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-2 tabular-nums">
                        <h3 className="text-step-22 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
                          <bdi>{proj.title}</bdi>
                        </h3>
                        <span className="text-step-13 text-[var(--muted)] shrink-0">
                          <bdi>{proj.period}</bdi>
                        </span>
                      </div>
                      <p className="text-step-15 text-[var(--text)] leading-relaxed m-0">
                        <bdi>{proj.description}</bdi>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)] tabular-nums">
                      {proj.metricsOrMethods.slice(0, 3).map((m) => (
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
          </div>
        </Reveal>
      </section>

      {/* 03 Recent Experience (2-column hairline rows, no cards) + Teaching & Mentorship */}
      <section className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
                    03
                  </div>
                  <h2 className="text-step-28 font-bold text-[var(--text)]">
                    {tSections('experience')}
                  </h2>
                </div>
                <Link
                  href="/cv"
                  className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 font-medium text-[var(--accent)]"
                >
                  <span>{tSections('fullCv')}</span>
                  <ArrowRight className="w-4 h-4 rtl-flip" />
                </Link>
              </div>

              {/* 2-column hairline rows */}
              <div className="border-t border-b border-[var(--border)] divide-y divide-[var(--border)]">
                {recentExperience.map((exp) => (
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
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-1">
                <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
                  &nbsp;
                </div>
                <h2 className="text-step-28 font-bold text-[var(--text)]">
                  {tSections('teaching')}
                </h2>
              </div>

              <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-5">
                <ul className="space-y-3 text-step-15 text-[var(--text)] list-disc ps-5">
                  {profile.teachingAndService.map((item) => (
                    <li key={item}>
                      <bdi>{item}</bdi>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[var(--border)] tabular-nums">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-step-13 text-[var(--muted)]">
                      Supervised projects:
                    </span>
                    <span className="text-step-13 font-bold text-[var(--accent)]">
                      150+ projects
                    </span>
                  </div>
                  <Link
                    href="/projects#supervised-projects"
                    className="editorial-link link-arrow mt-2 inline-flex items-center gap-1.5 min-h-[44px] text-step-13 font-medium text-[var(--accent)]"
                  >
                    <span>View supervised student cohort</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 04 Selected Projects — GitHub highlight block + 2 websites with screenshots + 1 ML repo + 150+ Supervised Student Projects */}
      <section
        id="projects"
        className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8"
      >
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
                  04
                </div>
                <h2 className="text-step-28 font-bold text-[var(--text)]">
                  {tSections('projects')}
                </h2>
              </div>
              <Link
                href="/projects"
                className="editorial-link link-arrow inline-flex items-center gap-1.5 min-h-[44px] text-step-15 font-medium text-[var(--accent)]"
              >
                <span>{tSections('allProjects')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </Link>
            </div>

            {/* Item 1: Bordered GitHub highlight block */}
            <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5 tabular-nums">
                  <GitHubIcon size={20} className="text-[var(--text)]" />
                  <h3 className="text-step-22 font-bold text-[var(--text)]">
                    {tProjects('githubBlockTitle')}
                  </h3>
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

            {/* Items 2, 3, 4: 2 websites with screenshots + 1 ML repo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {profile.websitesBuilt.map((site) => (
                <WebsiteCard key={site.slug} site={site} />
              ))}
              {selectedMlRepo && <RepoCard repo={selectedMlRepo} />}
            </div>

            {/* 150+ Supervised Student Projects Highlight */}
            <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-[650px]">
                <div className="flex flex-wrap items-center gap-2 tabular-nums">
                  <h3 className="text-step-18 font-bold text-[var(--text)] m-0">
                    150+ supervised student projects
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-[4px] border border-[var(--accent)] text-[var(--accent)] text-step-13 font-medium">
                    Live deployed websites
                  </span>
                </div>
                <p className="text-step-13 text-[var(--muted)] m-0 leading-relaxed">
                  Every semester, student engineering teams build and deploy
                  full-stack websites, GUI tools, and software platforms under
                  my supervision at PAF-IAST.
                </p>
              </div>

              <Link
                href="/projects#supervised-projects"
                className="btn-interactive link-arrow inline-flex items-center gap-1.5 h-11 px-4 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] font-medium text-step-13 hover:border-[var(--accent)] whitespace-nowrap"
              >
                <span>Explore student projects</span>
                <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 05 Education */}
      <section className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="space-y-1">
              <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
                05
              </div>
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tSections('education')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 tabular-nums">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="card-interactive group p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-step-13 text-[var(--accent)] font-semibold">
                      <bdi>{edu.dates}</bdi>
                    </span>
                    <h3 className="text-step-18 font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
                      <bdi>{edu.degree}</bdi>
                    </h3>
                    <p className="text-step-13 text-[var(--muted)] m-0">
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

      {/* 06 Contact */}
      <ContactSection sectionNumber="06" />
    </div>
  );
}
