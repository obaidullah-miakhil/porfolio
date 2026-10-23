import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import fs from 'node:fs';
import path from 'node:path';
import { routing, isRtlLocale } from '@/i18n/routing';
import { profile } from '@/content/profile';

export const alt = 'Obaidullah Miakhil — AI Engineer & ML Researcher';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const rtl = isRtlLocale(locale);

  const regularFont = fs.readFileSync(
    path.join(process.cwd(), 'src/fonts/Vazirmatn-Regular.ttf')
  );
  const boldFont = fs.readFileSync(
    path.join(process.cwd(), 'src/fonts/Vazirmatn-Bold.ttf')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FAFAF7',
          color: '#141414',
          padding: '72px 84px',
          fontFamily: 'Vazirmatn',
          border: '1px solid #E4E3DE',
        }}
      >
        {/* Solid Lapis Blue Accent Bar */}
        <div
          style={{
            width: '100%',
            height: 12,
            backgroundColor: '#1E4BD2',
            borderRadius: 6,
          }}
        />

        {/* Name & Role */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: rtl ? 'flex-end' : 'flex-start',
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#141414',
              lineHeight: 1.15,
            }}
          >
            {profile.name}
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#1E4BD2',
              lineHeight: 1.25,
            }}
          >
            {tHero('roleLine')}
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: '#5C5C58',
              lineHeight: 1.4,
            }}
          >
            {tHero('subLine')}
          </div>
        </div>

        {/* Footer metadata line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #E4E3DE',
            paddingTop: 24,
            fontSize: 22,
            color: '#5C5C58',
          }}
        >
          <span>{profile.githubHandle}</span>
          <span>Frontiers in Health Services · Scopus Q1</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Vazirmatn',
          data: regularFont,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Vazirmatn',
          data: boldFont,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
