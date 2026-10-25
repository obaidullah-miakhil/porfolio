'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintCvButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print btn-quiet cursor-pointer"
    >
      <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
