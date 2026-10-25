'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { profile } from '@/content/profile';
import { WhatsAppIcon } from './BrandIcons';

export function WhatsAppButton() {
  const t = useTranslations('contact');
  const [hiddenByContact, setHiddenByContact] = useState(false);
  const [hiddenByMobileMenu, setHiddenByMobileMenu] = useState(false);

  useEffect(() => {
    const contactEl = document.getElementById('contact');
    let contactObserver: IntersectionObserver | null = null;

    if (contactEl) {
      contactObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setHiddenByContact(entry.isIntersecting);
          }
        },
        { threshold: 0.1 }
      );
      contactObserver.observe(contactEl);
    } else {
      setHiddenByContact(false);
    }

    const syncMenuAttr = () => {
      setHiddenByMobileMenu(
        document.documentElement.getAttribute('data-mobile-menu-open') === 'true'
      );
    };
    syncMenuAttr();

    const attrObserver = new MutationObserver(syncMenuAttr);
    attrObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mobile-menu-open'],
    });

    return () => {
      contactObserver?.disconnect();
      attrObserver.disconnect();
    };
  }, []);

  if (hiddenByContact || hiddenByMobileMenu) {
    return null;
  }

  return (
    <div className="no-print fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-[max(1rem,env(safe-area-inset-right))] z-30 group">
      <a
        href={profile.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-[52px] h-[52px] rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center border border-[var(--border)] transition-opacity hover:opacity-95 focus:opacity-95"
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
