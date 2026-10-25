'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const items = [
    { href: '/research', label: t('research') },
    { href: '/projects', label: t('projects') },
    { href: '/cv', label: t('cv') },
    { href: '/#contact', label: t('contact') },
  ];

  const links = items.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={pathname === item.href ? 'page' : undefined}
      onClick={() => setMenuOpen(false)}
      className="nav-link text-[15px]"
    >
      {item.label}
    </Link>
  ));

  return (
    <header className="site-header">
      <div className="h-full px-[4vw] flex items-center justify-between gap-6">
        <Link href="/" className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--text)] no-underline">
          Obaidullah Miakhil<span className="text-[var(--accent)]">.</span>
        </Link>

        <div className="flex items-center gap-7">
          <nav aria-label="Primary" className="hidden md:flex items-center gap-7">
            {links}
          </nav>
          <LocaleSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="md:hidden font-mono text-[12px] uppercase tracking-[0.06em] h-11 px-1 text-[var(--text)] cursor-pointer"
          >
            {menuOpen ? t('closeMenu') : t('menu')}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="md:hidden absolute inset-x-0 top-[var(--header-h)] h-[calc(100svh-var(--header-h))] bg-[var(--bg)] px-[6vw] py-8 flex flex-col gap-6 text-[28px] font-semibold tracking-[-0.02em] z-50"
        >
          {links}
        </nav>
      ) : null}
    </header>
  );
}
