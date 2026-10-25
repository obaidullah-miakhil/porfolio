import test from 'node:test';
import assert from 'node:assert/strict';
import {
  profile,
  getFeaturedPublication,
  getRecentExperience,
} from '../content/profile';
import { isRtlLocale, locales } from '../i18n/routing';
import {
  buildLanguageAlternates,
  buildHomeJsonLd,
  buildResearchJsonLd,
  buildPageMetadata,
} from './seo';
import { readThemeTokenColors } from './device';

test('profile single source of truth contains canonical identity and featured paper', () => {
  assert.equal(profile.name, 'Obaidullah Miakhil');
  assert.equal(profile.emailPrimary, 'obaidullah.miakhil.khan@gmail.com');
  assert.equal(profile.emailAcademic, 'obaidullah.miakhil@paf-iast.edu.pk');

  const featured = getFeaturedPublication();
  assert.equal(featured.isPublished, true);
  assert.equal(featured.doi, '10.3389/frhs.2026.1927175');
  assert.ok(featured.badges?.includes('Scopus Q1'));
  assert.ok(featured.bibtex?.includes('@article{jadoon2026claimdenial'));
});

test('only item 1 is labelled Published among publications', () => {
  const publishedItems = profile.publications.filter(
    (p) => p.isPublished || p.status.toLowerCase() === 'published'
  );
  assert.equal(publishedItems.length, 1);
  assert.equal(publishedItems[0].id, 'frontiers-2026-claim-denial');
});

test('recent experience returns top 5 roles in reverse chronological order', () => {
  const recent = getRecentExperience(5);
  assert.equal(recent.length, 5);
  assert.equal(recent[0].role, 'Research Engineer');
  assert.equal(profile.experience.length, 10);
});

test('locale routing defines en as LTR and ps, fa, ur as RTL', () => {
  assert.deepEqual(locales, ['en', 'ps', 'fa', 'ur']);
  assert.equal(isRtlLocale('en'), false);
  assert.equal(isRtlLocale('ps'), true);
  assert.equal(isRtlLocale('fa'), true);
  assert.equal(isRtlLocale('ur'), true);
});

test('SEO language alternates include en, ps, fa, ur, and x-default', () => {
  const alts = buildLanguageAlternates('/research');
  assert.ok(alts.en.endsWith('/research'));
  assert.ok(alts.ps.endsWith('/ps/research'));
  assert.ok(alts.fa.endsWith('/fa/research'));
  assert.ok(alts.ur.endsWith('/ur/research'));
  assert.equal(alts['x-default'], alts.en);
});

test('SEO metadata builder generates canonical, alternates, and profile OpenGraph', () => {
  const meta = buildPageMetadata({
    locale: 'ps',
    pathname: '/cv',
    title: 'CV',
    description:
      'Curriculum vitae of Obaidullah Miakhil, prospective PhD candidate in NLP and LLMs.',
  });
  assert.ok(String(meta.alternates?.canonical).endsWith('/ps/cv'));
  assert.equal((meta.openGraph as { type?: string })?.type, 'profile');
  assert.equal(
    (meta.twitter as { card?: string })?.card,
    'summary_large_image'
  );
});

test('JSON-LD builders generate valid ProfilePage, Person, WebSite, and ScholarlyArticle nodes', () => {
  const homeLd = buildHomeJsonLd('en');
  assert.equal(homeLd['@context'], 'https://schema.org');
  assert.equal(homeLd['@graph'].length, 2);

  const profilePage = homeLd['@graph'][0];
  assert.equal(profilePage['@type'], 'ProfilePage');
  assert.ok('mainEntity' in profilePage && profilePage.mainEntity);
  assert.equal(profilePage.mainEntity['@type'], 'Person');
  assert.equal(profilePage.mainEntity.name, 'Obaidullah Miakhil');
  assert.equal(profilePage.mainEntity.alternateName.length, 15);
  assert.equal(
    'nationality' in profilePage.mainEntity,
    false,
    'nationality must be omitted per Section 10.3'
  );

  const researchLd = buildResearchJsonLd();
  assert.equal(researchLd['@type'], 'ScholarlyArticle');
  assert.equal(researchLd.datePublished, '2026-10-14');
  assert.equal(researchLd.identifier.value, '10.3389/frhs.2026.1927175');
  assert.equal(researchLd.author.length, 7);
});

test('readThemeTokenColors returns the default paper and signal-orange palette in SSR/Node', () => {
  const colors = readThemeTokenColors();
  assert.equal(colors.bg, '#F4F1EA');
  assert.equal(colors.accent, '#FF4F00');
});
