import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF4F00',
          color: '#141413',
          fontSize: 82,
          fontWeight: 700,
          fontFamily: 'Vazirmatn',
          border: '8px solid #141413',
          borderRadius: 24,
        }}
      >
        OM
      </div>
    ),
    {
      ...size,
      fonts: [
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
