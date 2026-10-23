'use client';

import React, { useMemo, useState } from 'react';
import {
  profile,
  type SupervisedStudentProject,
} from '@/content/profile';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import {
  ExternalLink,
  Search,
  Globe,
  Users,
  Code2,
  Award,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';

export function SupervisedProjectsSection() {
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
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono text-[var(--accent)] shadow-xs">
          <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Mentorship &amp; Academic Supervision · 150+ Projects</span>
        </div>

        <h2
          id="supervised-projects-heading"
          className="text-step-28 font-bold text-[var(--text)] tracking-tight"
        >
          Supervised Student Projects
        </h2>

        <p className="text-step-15 text-[var(--muted)] leading-relaxed max-w-[75ch] m-0">
          In my teaching experience, I push my students to build and deploy at least one professional, production-ready website or system each semester. Through this hands-on pedagogy, I have supervised <strong>150+ student projects</strong> across diverse subjects and solving different problems. Below is a curated cohort of student projects from the Object-Oriented Programming (OOP) &amp; Software Design lab at PAF-IAST, featuring deployed online applications at the top followed by complete team repositories and professional LinkedIn demonstrations.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-interactive p-4 sm:p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Award className="w-4 h-4" aria-hidden="true" />
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
              Total Supervised
            </span>
          </div>
          <div className="text-step-28 font-bold text-[var(--text)]">
            150+
          </div>
          <p className="text-[12px] text-[var(--muted)] m-0">
            Across multiple semesters &amp; courses
          </p>
        </div>

        <div className="card-interactive p-4 sm:p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-emerald-600">
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
              Live Deployed Sites
            </span>
          </div>
          <div className="text-step-28 font-bold text-emerald-600">
            {publishedCount}
          </div>
          <p className="text-[12px] text-[var(--muted)] m-0">
            Production hosted at top of list
          </p>
        </div>

        <div className="card-interactive p-4 sm:p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
              Student Teams
            </span>
          </div>
          <div className="text-step-28 font-bold text-[var(--text)]">
            17 Groups
          </div>
          <p className="text-[12px] text-[var(--muted)] m-0">
            35+ Supervised engineering students
          </p>
        </div>

        <div className="card-interactive p-4 sm:p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Code2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
              Curriculum Lab
            </span>
          </div>
          <div className="text-step-22 font-bold text-[var(--text)]">
            OOP &amp; C++
          </div>
          <p className="text-[12px] text-[var(--muted)] m-0">
            Dept. of Computer Science, PAF-IAST
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="p-4 sm:p-5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="inline-flex items-center p-1 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] self-start">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`btn-interactive px-3 py-1.5 rounded-[4px] text-step-13 font-medium cursor-pointer transition-colors ${
              activeFilter === 'all'
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            All Cohort Projects ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('published')}
            className={`btn-interactive px-3 py-1.5 rounded-[4px] text-step-13 font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeFilter === 'published'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot inline-block" aria-hidden="true" />
            <span>Live Deployed Only ({publishedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project, student, ID..."
            className="w-full h-10 ps-9 pe-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-step-13 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Table / Project Grid */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-step-15 text-[var(--muted)]">
            No projects found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className={`p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors duration-200 hover:bg-[var(--bg)]/50 ${
                proj.isPublished
                  ? 'border-s-4 border-s-emerald-500'
                  : 'border-s-4 border-s-transparent'
              }`}
            >
              {/* Left Column: Project Info & Description */}
              <div className="space-y-2.5 max-w-[620px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]">
                    {proj.groupLabel}
                  </span>

                  {proj.isPublished ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot inline-block" aria-hidden="true" />
                      <span>Live Deployed</span>
                    </span>
                  ) : null}

                  <span className="text-[12px] text-[var(--muted)]">
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
                        className="hover:text-[var(--accent)] hover:underline transition-colors"
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
                <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-step-13">
                  <span className="font-medium text-[var(--text)] text-[12px]">
                    Team Members:
                  </span>
                  {proj.members.map((member, idx) => (
                    <div
                      key={member.studentId || member.name}
                      className="inline-flex items-center gap-1.5 text-[var(--text)] text-[12px] bg-[var(--bg)] px-2 py-0.5 rounded-[4px] border border-[var(--border)]"
                    >
                      <span className="font-medium">{member.name}</span>
                      {member.studentId && (
                        <span className="font-mono text-[11px] text-[var(--muted)]">
                          ({member.studentId})
                        </span>
                      )}
                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${member.name}'s GitHub`}
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
                          title={`${member.name}'s LinkedIn`}
                          className="text-[var(--muted)] hover:text-[#0077b5] transition-colors"
                        >
                          <LinkedInIcon size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Action CTAs */}
              <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
                {proj.liveUrl ? (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive inline-flex items-center gap-2 h-9 px-4 rounded-[6px] bg-emerald-600 text-white text-step-13 font-semibold hover:bg-emerald-700 shadow-xs whitespace-nowrap"
                  >
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ) : null}

                {proj.githubUrl ? (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[12px] font-medium transition-colors whitespace-nowrap"
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
                    className="btn-interactive inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[#0077b5] hover:text-[#0077b5] text-[12px] font-medium transition-colors whitespace-nowrap"
                  >
                    <LinkedInIcon size={13} />
                    <span>LinkedIn Post</span>
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
