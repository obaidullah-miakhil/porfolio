import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ps', 'fa', 'ur'] as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: readonly Locale[] = ['ps', 'fa', 'ur'];

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ps: 'پښتو',
  fa: 'دری / فارسی',
  ur: 'اردو',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
