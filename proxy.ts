import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(ps|fa|ur)/:path*',
    '/((?!api|_next|_vercel|icon|apple-icon|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|.*\\..*).*)',
  ],
};
