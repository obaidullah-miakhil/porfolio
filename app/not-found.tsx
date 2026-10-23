import React from 'react';
import Link from 'next/link';
import '@/styles/globals.css';

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] p-6">
        <div className="max-w-md w-full p-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col items-start gap-4">
          <h1 className="text-step-32 font-bold text-[var(--text)]">
            404 — Page not found
          </h1>
          <p className="text-step-17 text-[var(--muted)] m-0">
            The page you requested does not exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center h-11 px-5 rounded-[6px] bg-[var(--accent)] text-[var(--accent-contrast)] text-step-15 font-medium"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
