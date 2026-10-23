'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintCvButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 h-11 px-5 rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-step-15 transition-colors whitespace-nowrap cursor-pointer"
    >
      <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
