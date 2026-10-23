import React from 'react';

export function FacetedFormPoster() {
  return (
    <div
      aria-hidden="true"
      data-testid="hero-faceted-poster"
      className="w-full h-full flex items-center justify-center rounded-[6px] bg-transparent select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 360 360"
        className="w-[220px] h-[220px] md:w-[320px] md:h-[320px]"
        aria-hidden="true"
      >
        {/* Attention Gimbal Rings (Q, K, V) */}
        <ellipse
          cx="180"
          cy="180"
          rx="140"
          ry="55"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.32"
          strokeWidth="1.5"
          transform="rotate(-25 180 180)"
        />
        <ellipse
          cx="180"
          cy="180"
          rx="150"
          ry="60"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.25"
          strokeWidth="1.2"
          transform="rotate(45 180 180)"
        />
        <ellipse
          cx="180"
          cy="180"
          rx="130"
          ry="80"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.2"
          strokeWidth="1"
          transform="rotate(85 180 180)"
        />

        {/* Synaptic connection network lines */}
        <g stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="1">
          <line x1="180" y1="180" x2="110" y2="130" />
          <line x1="180" y1="180" x2="250" y2="130" />
          <line x1="180" y1="180" x2="140" y2="240" />
          <line x1="180" y1="180" x2="220" y2="240" />
          <line x1="180" y1="180" x2="90" y2="190" />
          <line x1="180" y1="180" x2="270" y2="190" />
          <line x1="180" y1="180" x2="180" y2="90" />
          <line x1="180" y1="180" x2="180" y2="270" />

          <line x1="110" y1="130" x2="180" y2="90" />
          <line x1="250" y1="130" x2="180" y2="90" />
          <line x1="110" y1="130" x2="90" y2="190" />
          <line x1="250" y1="130" x2="270" y2="190" />
          <line x1="90" y1="190" x2="140" y2="240" />
          <line x1="270" y1="190" x2="220" y2="240" />
          <line x1="140" y1="240" x2="180" y2="270" />
          <line x1="220" y1="240" x2="180" y2="270" />

          <line x1="70" y1="110" x2="110" y2="130" />
          <line x1="290" y1="110" x2="250" y2="130" />
          <line x1="55" y1="170" x2="90" y2="190" />
          <line x1="305" y1="170" x2="270" y2="190" />
          <line x1="100" y1="285" x2="140" y2="240" />
          <line x1="260" y1="285" x2="220" y2="240" />
          <line x1="180" y1="50" x2="180" y2="90" />
          <line x1="180" y1="310" x2="180" y2="270" />
        </g>

        {/* Central Latent Core */}
        <g>
          <polygon
            points="180,148 208,164 208,196 180,212 152,196 152,164"
            fill="var(--accent)"
            fillOpacity="0.85"
            stroke="var(--text)"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <polygon
            points="180,158 198,170 198,190 180,202 162,190 162,170"
            fill="var(--accent-contrast)"
            fillOpacity="0.3"
          />
        </g>

        {/* Neural Nodes / Token Embeddings */}
        <g fill="var(--accent)">
          <circle cx="180" cy="90" r="4.5" />
          <circle cx="110" cy="130" r="4.5" />
          <circle cx="250" cy="130" r="4.5" />
          <circle cx="90" cy="190" r="4.5" />
          <circle cx="270" cy="190" r="4.5" />
          <circle cx="140" cy="240" r="4.5" />
          <circle cx="220" cy="240" r="4.5" />
          <circle cx="180" cy="270" r="4.5" />

          {/* Outer constellation nodes */}
          <circle cx="70" cy="110" r="3.5" fillOpacity="0.75" />
          <circle cx="290" cy="110" r="3.5" fillOpacity="0.75" />
          <circle cx="55" cy="170" r="3.5" fillOpacity="0.75" />
          <circle cx="305" cy="170" r="3.5" fillOpacity="0.75" />
          <circle cx="100" cy="285" r="3.5" fillOpacity="0.75" />
          <circle cx="260" cy="285" r="3.5" fillOpacity="0.75" />
          <circle cx="180" cy="50" r="3.5" fillOpacity="0.75" />
          <circle cx="180" cy="310" r="3.5" fillOpacity="0.75" />

          {/* Active Synaptic data packet */}
          <circle cx="145" cy="155" r="2.8" fill="#FFFFFF" />
          <circle cx="215" cy="155" r="2.8" fill="#FFFFFF" />
          <circle cx="160" cy="210" r="2.8" fill="#FFFFFF" />
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
