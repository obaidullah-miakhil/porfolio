import React from 'react';
import { Words } from '@/components/story/Words';

/**
 * Shared building blocks for the inner pages, matching the home story:
 * a mono eyebrow with the orange dot, a large headline whose words rise in
 * on load (wrap a phrase in *asterisks* for the accent colour), and glass
 * panels for content.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <header className="page-hero">
      <div>
        <p className="chapter-eyebrow" dir="auto">
          {eyebrow}
        </p>
        <h1 className="page-title" dir="auto">
          <Words text={title} />
        </h1>
        {lead ? (
          <p className="page-lead" dir="auto">
            {lead}
          </p>
        ) : null}
        {actions ? <div className="chapter-links page-actions">{actions}</div> : null}
      </div>
      {aside ? <div className="page-hero-aside">{aside}</div> : null}
    </header>
  );
}

export function PageSection({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: number;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="page-section">
      <div className="section-head">
        <span className="section-index">{String(index).padStart(2, '0')}</span>
        <h2 id={`${id}-heading`} className="section-title" dir="auto">
          {title}
        </h2>
      </div>
      {intro ? <div className="section-intro">{intro}</div> : null}
      {children}
    </section>
  );
}

/** A grid of headline numbers in a glass panel. */
export function StatPanel({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="panel stat-panel">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="chapter-stat-caption" dir="auto">
            {stat.label}
          </dt>
          <dd className="stat-panel-value">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
