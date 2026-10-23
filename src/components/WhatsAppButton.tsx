'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { profile } from '@/content/profile';
import { WhatsAppIcon } from './BrandIcons';

export function WhatsAppButton() {
  const t = useTranslations('contact');
  const [hiddenByContact, setHiddenByContact] = useState(false);

  useEffect(() => {
    const contactEl = document.getElementById('contact');
    if (!contactEl) {
      setHiddenByContact(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setHiddenByContact(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(contactEl);
    return () => observer.disconnect();
  }, []);

  if (hiddenByContact) {
    return null;
  }

  return (
    <div className="no-print fixed bottom-4 end-4 z-30 group">
      <a
        href={profile.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-[52px] h-[52px] rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center border border-[var(--border)] transition-transform hover:scale-105 focus:scale-105"
      >
        <WhatsAppIcon size={24} />
      </a>
      <span
        role="tooltip"
        className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity absolute bottom-14 end-0 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-step-13 whitespace-nowrap"
      >
        {t('chatOnWhatsapp')}
      </span>
    </div>
  );
}
