'use client';

import React, { useMemo, useState } from 'react';
import { profile } from '@/content/profile';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import { ExternalLink, Search } from 'lucide-react';

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
      className="page-section"
    >
      <div className="section-head">
        <span className="section-index">{sectionNumber}</span>
        <h2 id="supervised-projects-heading" className="section-title">
          Supervised student projects
        </h2>
      </div>
      <p className="section-intro body-text">
        Each semester at PAF-IAST, student teams design, build and deploy
        full-stack software under my lab supervision. Across courses I have
        supervised <strong>150+ student projects</strong>. Below is a curated
        cohort from the Object-Oriented Programming &amp; Software Design lab,
        with live deployed web applications listed first.
      </p>

      <dl className="panel stat-panel stat-panel-wide">
        <div>
          <dt className="chapter-stat-caption">Supervised in total</dt>
          <dd className="stat-panel-value">150+</dd>
        </div>
        <div>
          <dt className="chapter-stat-caption">Live deployed sites</dt>
          <dd className="stat-panel-value">{publishedCount}</dd>
        </div>
        <div>
          <dt className="chapter-stat-caption">Groups in this cohort</dt>
          <dd className="stat-panel-value">{projects.length}</dd>
        </div>
        <div>
          <dt className="chapter-stat-caption">Lab · PAF-IAST</dt>
          <dd className="stat-panel-value stat-panel-text">OOP &amp; C++</dd>
        </div>
      </dl>

      <div className="panel filter-bar">
        <div className="segmented" role="group" aria-label="Filter projects">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
          >
            All ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('published')}
            aria-pressed={activeFilter === 'published'}
          >
            Live only ({publishedCount})
          </button>
        </div>
        <label className="search-field">
          <Search className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project, student, ID…"
            aria-label="Search supervised student projects"
          />
        </label>
      </div>

      <ul className="panel row-list student-list">
        {filteredProjects.length === 0 ? (
          <li className="justify-center text-[var(--muted)]">
            No projects found matching &ldquo;{searchQuery}&rdquo;.
          </li>
        ) : (
          filteredProjects.map((proj) => (
            <li key={proj.id}>
              <div className="student-main">
                <div className="pill-row">
                  <span className="pill">{proj.groupLabel}</span>
                  {proj.isPublished ? <span className="pill pill-accent">Live</span> : null}
                  <span className="chapter-stat-caption">
                    {proj.course} · {proj.semester}
                  </span>
                </div>
                <h3 className="row-title">
                  {proj.liveUrl ? (
                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="card-link">
                      {proj.projectName}
                    </a>
                  ) : (
                    proj.projectName
                  )}
                </h3>
                <p className="meta-line">{proj.description}</p>
                <div className="team">
                  {proj.members.map((member) => (
                    <span key={member.studentId || member.name} className="team-member">
                      {member.name}
                      {member.studentId ? <em>{member.studentId}</em> : null}
                      {member.githubUrl ? (
                        <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on GitHub`}>
                          <GitHubIcon size={12} />
                        </a>
                      ) : null}
                      {member.linkedinUrl ? (
                        <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`}>
                          <LinkedInIcon size={12} />
                        </a>
                      ) : null}
                    </span>
                  ))}
                </div>
              </div>
              <div className="student-actions">
                {proj.liveUrl ? (
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-small">
                    Visit site <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ) : null}
                {proj.githubUrl ? (
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-quiet btn-small">
                    <GitHubIcon size={13} /> Code
                  </a>
                ) : null}
                {proj.linkedinUrl ? (
                  <a href={proj.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-quiet btn-small">
                    <LinkedInIcon size={12} /> Demo
                  </a>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
