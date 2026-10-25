import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

type Messages = Record<string, unknown>;

/** Fill keys missing from a translation with the English text. */
function withFallback(messages: Messages, fallback: Messages): Messages {
  const merged: Messages = { ...fallback };
  for (const [key, value] of Object.entries(messages)) {
    const base = fallback[key];
    merged[key] =
      value && base && typeof value === 'object' && typeof base === 'object'
        ? withFallback(value as Messages, base as Messages)
        : value;
  }
  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const english = (await import('../../messages/en.json')).default as Messages;
  const messages =
    locale === routing.defaultLocale
      ? english
      : withFallback((await import(`../../messages/${locale}.json`)).default, english);

  return { locale, messages };
});
