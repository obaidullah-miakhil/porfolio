'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/research', label: t('research') },
    { href: '/projects', label: t('projects') },
    { href: '/cv', label: t('cv') },
    { href: '/#contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg)]/85 border-b border-[var(--border)] transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-[6px] focus:bg-[var(--accent)] focus:text-[var(--accent-contrast)] text-step-13 font-medium"
      >
        {t('skipToContent')}
      </a>

      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Start side: wordmark */}
        <Link
          href="/"
          className="text-step-17 font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap shrink-0"
        >
          Obaidullah Miakhil
        </Link>

        {/* End side: nav + language switcher + theme toggle */}
        <div className="flex items-center gap-3 sm:gap-5">
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-step-15"
          >
            {navItems.map((item) => {
              const isActive =
                item.href !== '/#contact' && pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[var(--accent)] ${
                    isActive
                      ? 'text-[var(--accent)] font-semibold'
                      : 'text-[var(--text)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="absolute -bottom-1 start-0 end-0 h-[2px] rounded-full bg-[var(--accent)]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <LocaleSwitcher />
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-sheet"
              aria-label={mobileMenuOpen ? t('closeMenu') : t('menu')}
              className="md:hidden btn-interactive inline-flex items-center justify-center w-9 h-9 rounded-[6px] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-width sheet */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-sheet"
          aria-label="Mobile navigation"
          className="md:hidden w-full bg-[var(--bg)] border-b border-[var(--border)] px-4 py-4 animate-in fade-in duration-150"
        >
          <ul className="flex flex-col gap-3 m-0 p-0 list-none">
            {navItems.map((item) => {
              const isActive =
                item.href !== '/#contact' && pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-step-17 transition-colors ${
                      isActive
                        ? 'text-[var(--accent)] font-semibold underline'
                        : 'text-[var(--text)] hover:text-[var(--accent)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
