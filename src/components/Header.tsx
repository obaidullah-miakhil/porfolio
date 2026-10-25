'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState<string>('');

  // Shrink header from 72px to 56px after 24px scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveHash('');
  }, [pathname]);

  // Close mobile menu on Escape key and sync document attribute for WhatsAppButton
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.setAttribute('data-mobile-menu-open', 'true');
    } else {
      document.documentElement.removeAttribute('data-mobile-menu-open');
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.documentElement.removeAttribute('data-mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  // Highlight active section on homepage via IntersectionObserver
  useEffect(() => {
    if (pathname !== '/') return;
    const sectionIds = ['research', 'projects', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const navItems = [
    { href: '/research', hash: '#research', label: t('research') },
    { href: '/projects', hash: '#projects', label: t('projects') },
    { href: '/cv', hash: '', label: t('cv') },
    { href: '/#contact', hash: '#contact', label: t('contact') },
  ];

  const isNavItemActive = (item: (typeof navItems)[number]) => {
    if (item.href === '/#contact') {
      return pathname === '/' && activeHash === '#contact';
    }
    if (pathname === item.href) return true;
    if (pathname === '/' && item.hash && activeHash === item.hash) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-200">
      <div
        className={`max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-[height] duration-200 ${
          scrolled ? 'h-[56px]' : 'h-[72px]'
        }`}
      >
        {/* Start side: wordmark */}
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] text-step-17 font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap shrink-0"
        >
          Obaidullah Miakhil
        </Link>

        {/* End side: nav + language switcher + theme toggle */}
        <div className="flex items-center gap-2 sm:gap-5">
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-step-15"
          >
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative inline-flex items-center min-h-[44px] whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[var(--accent)] ${
                    isActive
                      ? 'text-[var(--accent)] font-semibold'
                      : 'text-[var(--text)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="absolute bottom-1.5 start-0 end-0 h-[2px] bg-[var(--accent)]" />
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
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
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

      {/* Mobile full-height sheet */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-sheet"
          aria-label="Mobile navigation"
          className="md:hidden w-full min-h-[calc(100vh-56px)] bg-[var(--bg)] border-b border-[var(--border)] px-4 py-6"
        >
          <ul className="flex flex-col divide-y divide-[var(--border)] m-0 p-0 list-none">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center min-h-[48px] py-3 text-step-18 transition-colors ${
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
