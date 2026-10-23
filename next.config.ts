import fs from 'node:fs';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';
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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
