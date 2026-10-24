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

  return (
    <div className="space-y-16 pb-16" suppressHydrationWarning>
      <script
        id="home-jsonld"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero + Audience Switcher + Phase 4 3D HeroForm */}
      <Hero />

      {/* 2. Featured Publication */}
      <FeaturedPublication />

      {/* 3. About — profile photo (square, 6px radius) + two short paragraphs + a facts list */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-[var(--border)]">
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-start gap-6">
              <div className="group card-interactive relative w-36 h-36 sm:w-44 sm:h-44 aspect-square shrink-0 rounded-[6px] border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
                <Image
                  src={profile.profilePhoto}
                  alt={profile.profilePhotoAlt}
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>

              <div className="space-y-4">
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
            </div>

            <div
              className="card-interactive lg:col-span-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3.5 self-start"
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
              <div className="border-t border-[var(--border)] pt-3" suppressHydrationWarning>
                <div className="text-step-13 text-[var(--muted)]">
                  {tAbout('factLanguagesLabel')}
                </div>
                <div className="text-step-15 font-medium text-[var(--text)]">
                  {tAbout('factLanguagesValue')}
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-3" suppressHydrationWarning>
                <div className="text-step-13 text-[var(--muted)]">
                  {tAbout('factCredentialsLabel')}
                </div>
                <div className="text-step-15 font-medium text-[var(--text)]">
                  {tAbout('factCredentialsValue')}
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-3" suppressHydrationWarning>
                <div className="text-step-13 text-[var(--muted)]">
                  {tAbout('factMentorshipLabel')}
                </div>
                <div className="text-step-15 font-medium text-[var(--text)]">
                  {tAbout('factMentorshipValue')}
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-3" suppressHydrationWarning>
                <div className="text-step-13 text-[var(--muted)]">
                  {tAbout('factOpenToLabel')}
                </div>
                <div className="text-step-15 font-semibold text-[var(--accent)]">
                  {tAbout('factOpenToValue')}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. Research Projects (4 cards) */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tSections('research')}
              </h2>
              <Link
                href="/research"
                className="group inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline"
              >
                <span>{tSections('allResearch')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

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
          </div>
        </Reveal>
      </section>

      {/* 5. Recent Experience (5 entries) + Teaching */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-step-28 font-bold text-[var(--text)]">
                  {tSections('experience')}
                </h2>
                <Link
                  href="/cv"
                  className="group inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline"
                >
                  <span>{tSections('fullCv')}</span>
                  <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentExperience.map((exp) => (
                  <div
                    key={exp.id}
                    className="card-interactive p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]"
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
              <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
                <ul className="space-y-3 text-step-15 text-[var(--text)] list-disc ps-5">
                  {profile.teachingAndService.map((item) => (
                    <li key={item}>
                      <bdi>{item}</bdi>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-step-13 text-[var(--muted)]">Supervised Projects:</span>
                    <span className="text-step-13 font-bold text-[var(--accent)]">150+ Projects</span>
                  </div>
                  <Link
                    href="/projects#supervised-projects"
                    className="group/link mt-2 inline-flex items-center gap-1.5 text-step-13 font-medium text-[var(--accent)] hover:underline"
                  >
                    <span>View supervised student cohort</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. Selected Projects — 4 items: GitHub highlight block + 2 websites with screenshots + 1 ML repo */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-step-28 font-bold text-[var(--text)]">
                {tSections('projects')}
              </h2>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 text-step-15 font-medium text-[var(--accent)] hover:underline"
              >
                <span>{tSections('allProjects')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Item 1: Bordered GitHub highlight block */}
            <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <GitHubIcon size={20} className="text-[var(--text)]" />
                  <h3 className="text-step-22 font-bold text-[var(--text)]">
                    {tProjects('githubBlockTitle')}
                  </h3>
                  <span className="text-step-13 px-2.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]">
                    {publicRepoCount} {tProjects('publicReposLabel')}
                  </span>
                </div>
                <p className="text-step-15 text-[var(--muted)]">
                  {tProjects('githubBlockSubtitle')}
                </p>
              </div>

              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive group inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-[var(--accent)] text-white text-step-15 font-medium hover:opacity-95"
              >
                <span>{tProjects('viewGithubProfile')}</span>
                <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl-flip" />
              </a>
            </div>

            {/* Items 2, 3, 4: 2 websites with screenshots + 1 ML repo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {profile.websitesBuilt.map((site) => (
                <WebsiteCard key={site.slug} site={site} />
              ))}
              {selectedMlRepo && <RepoCard repo={selectedMlRepo} />}
            </div>

            {/* Supervised Student Projects (150+ Projects) Highlight */}
            <div className="card-interactive p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-[650px]">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-step-18 font-bold text-[var(--text)] m-0">
                    150+ Supervised Student Projects
                  </h3>
                  <span className="px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/30">
                    Live Deployed Websites
                  </span>
                </div>
                <p className="text-step-13 text-[var(--muted)] m-0 leading-relaxed">
                  Every semester, student engineering teams build and deploy full-stack websites, GUI tools, and software platforms under my supervision.
                </p>
              </div>

              <Link
                href="/projects#supervised-projects"
                className="btn-interactive inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] font-medium text-step-13 hover:border-[var(--accent)] whitespace-nowrap"
              >
                <span>Explore Student Projects</span>
                <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7. Education */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <h2 className="text-step-28 font-bold text-[var(--text)]">
              {tSections('education')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
