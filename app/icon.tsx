import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 16,
          fontWeight: 700,
          fontFamily: 'Vazirmatn',
          border: '2px solid #FF4F00',
          borderRadius: 6,
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
