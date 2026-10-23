import React from 'react';

export function FacetedFormPoster() {
  return (
    <div
      aria-hidden="true"
      data-testid="hero-faceted-poster"
      className="w-full h-full flex items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--surface)] select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 360 360"
        className="w-[220px] h-[220px] md:w-[320px] md:h-[320px]"
        aria-hidden="true"
      >
        {/* Discrete flat-shaded icosahedral facets in solid --accent opacities + thin wireframe in --text */}
        <g stroke="var(--text)" strokeOpacity="0.18" strokeWidth="1">
          {/* Top cap facets */}
          <polygon
            points="180,38 106,92 146,126"
            fill="var(--accent)"
            fillOpacity="0.92"
          />
          <polygon
            points="180,38 146,126 214,126"
            fill="var(--accent)"
            fillOpacity="0.78"
          />
          <polygon
            points="180,38 214,126 254,92"
            fill="var(--accent)"
            fillOpacity="0.64"
          />
          <polygon
            points="180,38 68,128 106,92"
            fill="var(--accent)"
            fillOpacity="0.85"
          />
          <polygon
            points="180,38 254,92 292,128"
            fill="var(--accent)"
            fillOpacity="0.52"
          />

          {/* Upper mid ring facets */}
          <polygon
            points="68,128 106,92 146,126"
            fill="var(--accent)"
            fillOpacity="0.74"
          />
          <polygon
            points="68,128 146,126 112,196"
            fill="var(--accent)"
            fillOpacity="0.88"
          />
          <polygon
            points="146,126 214,126 180,192"
            fill="var(--accent)"
            fillOpacity="0.96"
          />
          <polygon
            points="146,126 180,192 112,196"
            fill="var(--accent)"
            fillOpacity="0.82"
          />
          <polygon
            points="214,126 254,92 248,196"
            fill="var(--accent)"
            fillOpacity="0.58"
          />
          <polygon
            points="214,126 248,196 180,192"
            fill="var(--accent)"
            fillOpacity="0.68"
          />
          <polygon
            points="254,92 292,128 248,196"
            fill="var(--accent)"
            fillOpacity="0.46"
          />

          {/* Lower mid ring facets */}
          <polygon
            points="68,128 112,196 76,232"
            fill="var(--accent)"
            fillOpacity="0.66"
          />
          <polygon
            points="112,196 180,192 144,264"
            fill="var(--accent)"
            fillOpacity="0.76"
          />
          <polygon
            points="180,192 248,196 216,264"
            fill="var(--accent)"
            fillOpacity="0.56"
          />
          <polygon
            points="180,192 216,264 144,264"
            fill="var(--accent)"
            fillOpacity="0.64"
          />
          <polygon
            points="292,128 284,232 248,196"
            fill="var(--accent)"
            fillOpacity="0.38"
          />
          <polygon
            points="76,232 112,196 144,264"
            fill="var(--accent)"
            fillOpacity="0.58"
          />
          <polygon
            points="248,196 284,232 216,264"
            fill="var(--accent)"
            fillOpacity="0.44"
          />

          {/* Bottom cap facets */}
          <polygon
            points="76,232 144,264 180,322"
            fill="var(--accent)"
            fillOpacity="0.48"
          />
          <polygon
            points="144,264 216,264 180,322"
            fill="var(--accent)"
            fillOpacity="0.52"
          />
          <polygon
            points="216,264 284,232 180,322"
            fill="var(--accent)"
            fillOpacity="0.34"
          />
        </g>
      </svg>
    </div>
  );
}

export function AttentionGridPoster() {
  const rows = [
    [0.18, 0.22, 0.3, 0.25, 0.18, 0.15],
    [0.22, 0.45, 0.72, 0.64, 0.32, 0.18],
    [0.28, 0.68, 0.96, 0.88, 0.48, 0.22],
    [0.24, 0.54, 0.82, 0.76, 0.42, 0.2],
    [0.18, 0.32, 0.46, 0.38, 0.24, 0.16],
    [0.14, 0.18, 0.22, 0.2, 0.16, 0.14],
  ];

  return (
    <div
      aria-hidden="true"
      data-testid="research-attention-poster"
      className="w-full h-full flex items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--surface)] select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 420 240"
        className="w-full max-w-[380px] h-[200px]"
        aria-hidden="true"
      >
        {/* Isometric base plane in --border */}
        <polygon
          points="210,36 378,120 210,204 42,120"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        {rows.map((row, rIdx) =>
          row.map((weight, cIdx) => {
            const isoX = 210 + (cIdx - rIdx) * 24;
            const isoY = 72 + (cIdx + rIdx) * 12;
            const barH = Math.round(8 + weight * 44);
            return (
              <g key={`${rIdx}-${cIdx}`}>
                {/* Isometric column top face */}
                <polygon
                  points={`${isoX},${isoY - barH - 7} ${isoX + 14},${isoY - barH} ${isoX},${isoY - barH + 7} ${isoX - 14},${isoY - barH}`}
                  fill="var(--accent)"
                  fillOpacity={Math.min(1, weight + 0.18)}
                  stroke="var(--bg)"
                  strokeWidth="0.75"
                />
                {/* Isometric left face */}
                <polygon
                  points={`${isoX - 14},${isoY - barH} ${isoX},${isoY - barH + 7} ${isoX},${isoY + 7} ${isoX - 14},${isoY}`}
                  fill="var(--accent)"
                  fillOpacity={Math.max(0.22, weight * 0.78)}
                  stroke="var(--bg)"
                  strokeWidth="0.75"
                />
                {/* Isometric right face */}
                <polygon
                  points={`${isoX + 14},${isoY - barH} ${isoX},${isoY - barH + 7} ${isoX},${isoY + 7} ${isoX + 14},${isoY}`}
                  fill="var(--accent)"
                  fillOpacity={Math.max(0.16, weight * 0.56)}
                  stroke="var(--bg)"
                  strokeWidth="0.75"
                />
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
