import type { Metadata } from 'next';
import { profile, getFeaturedPublication } from '@/content/profile';
import { locales, type Locale } from '@/i18n/routing';

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    profile.domain ||
    'https://obaidullah.online';
  const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, '');
}

export function isProductionEnv(): boolean {
  return process.env.VERCEL_ENV === 'production';
}

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: 'en_US',
  ps: 'ps_AF',
  fa: 'fa_AF',
  ur: 'ur_PK',
};

export const SEO_KEYWORDS: string[] = [
  'Obaidullah Miakhil',
  'AI engineer',
  'machine learning engineer',
  'deep learning researcher',
  'medical AI',
  'intracranial hemorrhage detection',
  'NLP',
  'large language models',
  'low-resource NLP',
  'Pashto NLP',
  'explainable AI',
  'uncertainty quantification',
  'claim denial prediction',
  'PhD applicant artificial intelligence',
  'prospective PhD candidate',
  'Islamabad',
  'Pakistan',
  'PAF-IAST',
  ...profile.nameVariants,
];

export function getLocalizedUrl(locale: string, pathname = ''): string {
  const baseUrl = getSiteUrl();
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const normalizedPath = cleanPath === '/' ? '' : cleanPath;

  if (locale === 'en') {
    return `${baseUrl}${normalizedPath || '/'}`;
  }
  return `${baseUrl}/${locale}${normalizedPath}`;
}

export function buildLanguageAlternates(pathname = ''): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = getLocalizedUrl(loc, pathname);
  }
  languages['x-default'] = getLocalizedUrl('en', pathname);
  return languages;
}

export function buildPageMetadata({
  locale,
  pathname = '',
  title,
  description,
  isHome = false,
}: {
  locale: string;
  pathname?: string;
  title: string;
  description: string;
  isHome?: boolean;
}): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = getLocalizedUrl(locale, pathname);
  const languages = buildLanguageAlternates(pathname);
  const ogLocale = OG_LOCALE_MAP[(locale as Locale) || 'en'] ?? 'en_US';
  const isProd = isProductionEnv();
  const gscVerification =
    process.env.NEXT_PUBLIC_GSC_VERIFICATION || profile.gscToken;

  const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: isHome
      ? {
          absolute: title,
        }
      : title,
    description,
    keywords: SEO_KEYWORDS,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    robots: isProd
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'profile',
      firstName: profile.givenName,
      lastName: profile.familyName,
      username: profile.githubOwner,
      locale: ogLocale,
      url: canonical,
      siteName: profile.name,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };

  if (gscVerification) {
    metadata.verification = {
      google: gscVerification,
    };
  }

  return metadata;
}

export function buildHomeJsonLd(locale: string) {
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const profilePageId = `${getLocalizedUrl(locale, '')}#profilepage`;

  const sameAs = [
    profile.githubUrl,
    profile.linkedinUrl,
    profile.huggingfaceUrl,
  ];
  if (profile.scholarUrl) sameAs.push(profile.scholarUrl);
  if (profile.researchgateUrl) sameAs.push(profile.researchgateUrl);
  if (profile.orcidUrl) sameAs.push(profile.orcidUrl);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': profilePageId,
        url: getLocalizedUrl(locale, ''),
        name: `${profile.name} — ${profile.roleLine}`,
        inLanguage: locale,
        isPartOf: { '@id': websiteId },
        mainEntity: {
          '@type': 'Person',
          '@id': personId,
          name: profile.name,
          alternateName: profile.nameVariants,
          givenName: profile.givenName,
          familyName: profile.familyName,
          jobTitle: profile.roleLine,
          description:
            'Obaidullah Miakhil is an AI engineer and machine learning researcher working on medical AI, deep learning and NLP. Prospective PhD candidate in Computer Science & Medical AI.',
          image: `${siteUrl}${profile.profilePhoto}`,
          url: siteUrl,
          email: profile.emailPrimary,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Islamabad',
            addressCountry: 'PK',
          },
          alumniOf: [
            {
              '@type': 'CollegeOrUniversity',
              name: 'Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology (PAF-IAST)',
              url: 'https://paf-iast.edu.pk/',
            },
            {
              '@type': 'HighSchool',
              name: 'Taayef Private High School',
            },
          ],
          affiliation: [
            {
              '@type': 'ResearchOrganization',
              name: 'Sino-Park Centre of Artificial Intelligence (SPCAI)',
            },
            {
              '@type': 'CollegeOrUniversity',
              name: 'Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology (PAF-IAST)',
            },
          ],
          knowsLanguage: ['ps', 'fa', 'en', 'ur'],
          knowsAbout: [
            'machine learning',
            'deep learning',
            'medical imaging',
            'natural language processing',
            'large language models',
            'explainable AI',
            'uncertainty quantification',
          ],
          award: profile.awards.map(
            (a) => `${a.year} — ${a.title} (${a.organisation})`
          ),
          sameAs,
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: profile.name,
        alternateName: profile.nameVariants,
        url: siteUrl,
        inLanguage: locale,
        publisher: { '@id': personId },
      },
    ],
  };
}

export function buildResearchJsonLd() {
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;
  const featured = getFeaturedPublication();

  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': `${siteUrl}/research#frontiers-2026-claim-denial`,
    headline: featured.title,
    name: featured.title,
    author: [
      { '@type': 'Person', name: 'Muhammad Mohsin Jadoon' },
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Obaidullah Miakhil',
        url: siteUrl,
      },
      { '@type': 'Person', name: 'Noor Rahman Chakari' },
      { '@type': 'Person', name: 'Muhammad Bilal Qureshi' },
      { '@type': 'Person', name: 'Ihsan Ullah' },
      { '@type': 'Person', name: 'Sami Ahmed Haider' },
      { '@type': 'Person', name: 'Masood Ur Rehman' },
    ],
    datePublished: '2026-10-14',
    dateReceived: '2026-07-03',
    dateAccepted: '2026-09-28',
    isPartOf: {
      '@type': 'Periodical',
      name: 'Frontiers in Health Services',
      volumeNumber: '6',
    },
    pageStart: '1927175',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'DOI',
      value: '10.3389/frhs.2026.1927175',
    },
    sameAs: 'https://doi.org/10.3389/frhs.2026.1927175',
    url: 'https://www.frontiersin.org/articles/10.3389/frhs.2026.1927175',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    keywords: featured.keywords,
    description: featured.summary,
  };
}
