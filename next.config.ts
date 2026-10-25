import fs from 'node:fs';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

// Ensure app/[locale] routes are always populated from src/routes and no URL-encoded %5Blocale%5D duplicate exists
function ensureLocaleRoutesSynced() {
  try {
    const root = process.cwd();
    const encodedDir = path.join(root, 'app', '%5Blocale%5D');
    if (fs.existsSync(encodedDir)) {
      fs.rmSync(encodedDir, { recursive: true, force: true });
    }

    const localeDir = path.join(root, 'app', '[locale]');
    const copies: Array<[string, string]> = [
      ['src/routes/layout.tsx', path.join(localeDir, 'layout.tsx')],
      ['src/routes/page.tsx', path.join(localeDir, 'page.tsx')],
      [
        'src/routes/opengraph-image.tsx',
        path.join(localeDir, 'opengraph-image.tsx'),
      ],
      [
        'src/routes/research-page.tsx',
        path.join(localeDir, 'research', 'page.tsx'),
      ],
      [
        'src/routes/projects-page.tsx',
        path.join(localeDir, 'projects', 'page.tsx'),
      ],
      ['src/routes/cv-page.tsx', path.join(localeDir, 'cv', 'page.tsx')],
    ];

    for (const [srcRel, destAbs] of copies) {
      const srcAbs = path.join(root, srcRel);
      if (fs.existsSync(srcAbs)) {
        fs.mkdirSync(path.dirname(destAbs), { recursive: true });
        const srcContent = fs.readFileSync(srcAbs, 'utf8');
        const existing = fs.existsSync(destAbs)
          ? fs.readFileSync(destAbs, 'utf8')
          : '';
        if (srcContent !== existing) {
          fs.writeFileSync(destAbs, srcContent, 'utf8');
        }
      }
    }
  } catch {
    // Ignore fs errors in read-only environments
  }
}

ensureLocaleRoutesSynced();

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' blob: data: https://va.vercel-scripts.com https://vitals.vercel-insights.com https://api.github.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.obaidullah.online',
          },
        ],
        destination: 'https://obaidullah.online/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/projects/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(withNextIntl(nextConfig));
