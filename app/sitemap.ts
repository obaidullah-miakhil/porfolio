import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { buildLanguageAlternates, getLocalizedUrl } from '@/lib/seo';

const ROUTES = ['', '/research', '/projects', '/cv'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  for (const route of ROUTES) {
    const languages = buildLanguageAlternates(route);

    for (const locale of locales) {
      entries.push({
        url: getLocalizedUrl(locale, route),
        lastModified,
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
