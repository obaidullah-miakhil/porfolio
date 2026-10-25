'use client';

import React, { useMemo, useState } from 'react';
import { profile } from '@/content/profile';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import {
  ExternalLink,
  Search,
  Globe,
  Users,
  Code2,
  Award,
  GraduationCap,
} from 'lucide-react';

export function SupervisedProjectsSection({
  sectionNumber = '03',
}: {
  sectionNumber?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = profile.supervisedStudentProjects || [];

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      if (activeFilter === 'published' && !proj.isPublished) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = proj.projectName.toLowerCase().includes(q);
      const matchDesc = proj.description.toLowerCase().includes(q);
      const matchCourse = proj.course.toLowerCase().includes(q);
      const matchGroup = proj.groupLabel.toLowerCase().includes(q);
      const matchMember = proj.members.some(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.studentId.toLowerCase().includes(q)
      );

      return matchName || matchDesc || matchCourse || matchGroup || matchMember;
    });
  }, [projects, activeFilter, searchQuery]);

  const publishedCount = useMemo(
    () => projects.filter((p) => p.isPublished).length,
    [projects]
  );

  return (
    <section
      id="supervised-projects"
      aria-labelledby="supervised-projects-heading"
      className="space-y-8 pt-10 border-t border-[var(--border)]"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="text-step-13 font-mono text-[var(--muted)] tabular-nums">
          {sectionNumber}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h2
            id="supervised-projects-heading"
            className="text-step-28 font-bold text-[var(--text)]"
          >
            Supervised student projects
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-step-13 text-[var(--accent)] font-medium tabular-nums">
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>150+ projects mentored</span>
          </span>
        </div>

        <p className="text-step-15 text-[var(--muted)] leading-relaxed max-w-[65ch] m-0">
          Each semester at PAF-IAST, student teams design, build, and deploy
          full-stack software systems under my lab supervision. Across courses,
          I have supervised <strong>150+ student projects</strong>. Below is a
          curated cohort from the Object-Oriented Programming &amp; Software
          Design lab, with live deployed web applications listed first.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 tabular-nums">
        <div className="card-interactive p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Award className="w-4 h-4" aria-hidden="true" />
            <span className="text-step-13 text-[var(--muted)]">
              Total supervised
            </span>
          </div>
          <div className="text-step-28 font-bold text-[var(--text)]">150+</div>
          <p className="text-step-13 text-[var(--muted)] m-0">
            Across multiple semesters &amp; courses
          </p>
        </div>

        <div className="card-interactive p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span className="text-step-13 text-[var(--muted)]">
              Live deployed sites
            </span>
          </div>
          <div className="text-step-28 font-bold text-[var(--accent)]">
            {publishedCount}
          </div>
          <p className="text-step-13 text-[var(--muted)] m-0">
            Hosted in production
          </p>
        </div>

        <div className="card-interactive p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="text-step-13 text-[var(--muted)]">
              Featured cohort
            </span>
          </div>
          <div className="text-step-28 font-bold text-[var(--text)]">
            17 groups
          </div>
          <p className="text-step-13 text-[var(--muted)] m-0">
            35+ engineering students
          </p>
        </div>

        <div className="card-interactive p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Code2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-step-13 text-[var(--muted)]">
              Curriculum lab
            </span>
          </div>
          <div className="text-step-22 font-bold text-[var(--text)]">
            OOP &amp; C++
          </div>
          <p className="text-step-13 text-[var(--muted)] m-0">
            Dept. of Computer Science, PAF-IAST
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="p-4 sm:p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex items-center p-1 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] self-start tabular-nums">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
            className={`btn-interactive min-h-[38px] px-3.5 py-1.5 rounded-[4px] text-step-13 font-medium cursor-pointer transition-colors ${
              activeFilter === 'all'
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            All cohort projects ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('published')}
            aria-pressed={activeFilter === 'published'}
            className={`btn-interactive min-h-[38px] px-3.5 py-1.5 rounded-[4px] text-step-13 font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeFilter === 'published'
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <span>Live deployed only ({publishedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project, student, ID..."
            aria-label="Search supervised student projects"
            className="w-full h-11 ps-9 pe-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Hairline-divided Project List */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-step-15 text-[var(--muted)]">
            No projects found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors duration-200 hover:bg-[var(--bg)]"
            >
              {/* Start Column: Project Info & Description */}
              <div className="space-y-2.5 max-w-[620px]">
                <div className="flex flex-wrap items-center gap-2 tabular-nums">
                  <span className="text-step-13 font-mono px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]">
                    {proj.groupLabel}
                  </span>

                  {proj.isPublished ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] border border-[var(--accent)] text-[var(--accent)] text-step-13 font-medium">
                      <span>Live deployed</span>
                    </span>
                  ) : null}

                  <span className="text-step-13 text-[var(--muted)]">
                    {proj.course} · {proj.semester}
                  </span>
                </div>

                <div>
                  <h3 className="text-step-18 font-bold text-[var(--text)] m-0">
                    {proj.liveUrl ? (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link hover:text-[var(--accent)] transition-colors"
                      >
                        {proj.projectName}
                      </a>
                    ) : (
                      proj.projectName
                    )}
                  </h3>
                  <p className="text-step-13 text-[var(--muted)] m-0 pt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Team Members & IDs */}
                <div className="pt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-step-13">
                  <span className="font-medium text-[var(--text)]">Team:</span>
                  {proj.members.map((member) => (
                    <div
                      key={member.studentId || member.name}
                      className="inline-flex items-center gap-1.5 text-[var(--text)] bg-[var(--bg)] px-2.5 py-0.5 rounded-[4px] border border-[var(--border)]"
                    >
                      <span className="font-medium">{member.name}</span>
                      {member.studentId && (
                        <span className="font-mono text-[var(--muted)] tabular-nums">
                          ({member.studentId})
                        </span>
                      )}
                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name} GitHub`}
                          className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors ms-0.5"
                        >
                          <GitHubIcon size={13} />
                        </a>
                      )}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name} LinkedIn`}
                          className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                        >
                          <LinkedInIcon size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* End Column: Action Links */}
              <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
                {proj.liveUrl ? (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive link-arrow inline-flex items-center gap-2 h-10 px-4 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-13 font-medium hover:opacity-95 whitespace-nowrap"
                  >
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Visit live website</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ) : null}

                {proj.githubUrl ? (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-step-13 font-medium transition-colors whitespace-nowrap"
                  >
                    <GitHubIcon size={14} />
                    <span>Repository</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                ) : null}

                {proj.linkedinUrl ? (
                  <a
                    href={proj.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-step-13 font-medium transition-colors whitespace-nowrap"
                  >
                    <LinkedInIcon size={13} />
                    <span>LinkedIn demo</span>
                  </a>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
