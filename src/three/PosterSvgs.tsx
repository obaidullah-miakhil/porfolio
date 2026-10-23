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
        className="w-[240px] h-[240px] md:w-[320px] md:h-[320px]"
        aria-hidden="true"
      >
        {/* Left & Right Hemisphere Cortical Lobes Silhouette */}
        <path
          d="M175,65 C130,65 90,95 85,150 C80,195 105,245 140,275 C160,290 175,295 175,295 C175,295 175,65 175,65 Z"
          fill="var(--accent)"
          fillOpacity="0.06"
          stroke="var(--accent)"
          strokeOpacity="0.3"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <path
          d="M185,65 C230,65 270,95 275,150 C280,195 255,245 220,275 C200,290 185,295 185,295 C185,295 185,65 185,65 Z"
          fill="var(--accent)"
          fillOpacity="0.06"
          stroke="var(--accent)"
          strokeOpacity="0.3"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        {/* Multilingual Attention Rings (Q, K, V) */}
        <ellipse
          cx="180"
          cy="180"
          rx="155"
          ry="55"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          transform="rotate(-20 180 180)"
        />
        <ellipse
          cx="180"
          cy="180"
          rx="145"
          ry="65"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.22"
          strokeWidth="1.2"
          transform="rotate(40 180 180)"
        />

        {/* Synaptic Pathway Network */}
        <g stroke="var(--accent)" strokeOpacity="0.32" strokeWidth="1">
          {/* Corpus Callosum Cross-Hemisphere Bridge */}
          <line x1="140" y1="160" x2="220" y2="160" strokeWidth="1.8" strokeOpacity="0.5" />
          <line x1="145" y1="190" x2="215" y2="190" strokeWidth="1.8" strokeOpacity="0.5" />

          {/* Left Hemisphere Synapses */}
          <line x1="175" y1="110" x2="130" y2="115" />
          <line x1="130" y1="115" x2="105" y2="155" />
          <line x1="105" y1="155" x2="120" y2="210" />
          <line x1="120" y1="210" x2="155" y2="255" />
          <line x1="130" y1="115" x2="140" y2="160" />
          <line x1="105" y1="155" x2="145" y2="190" />
          <line x1="140" y1="160" x2="120" y2="210" />

          {/* Right Hemisphere Synapses */}
          <line x1="185" y1="110" x2="230" y2="115" />
          <line x1="230" y1="115" x2="255" y2="155" />
          <line x1="255" y1="155" x2="240" y2="210" />
          <line x1="240" y1="210" x2="205" y2="255" />
          <line x1="230" y1="115" x2="220" y2="160" />
          <line x1="255" y1="155" x2="215" y2="190" />
          <line x1="220" y1="160" x2="240" y2="210" />
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
        </g>

        {/* Cortical Neural Nodes & Focal ICH cluster */}
        <g fill="var(--accent)">
          <circle cx="175" cy="110" r="4.5" />
          <circle cx="185" cy="110" r="4.5" />
          <circle cx="130" cy="115" r="4.5" />
          <circle cx="230" cy="115" r="4.5" />
          <circle cx="105" cy="155" r="4.5" />
          <circle cx="120" cy="210" r="4.5" />
          <circle cx="155" cy="255" r="4.5" />
          <circle cx="205" cy="255" r="4.5" />

          {/* Focal ICH area (luminous cyan) */}
          <circle cx="255" cy="155" r="6" fill="#38BDF8" />
          <circle cx="240" cy="210" r="5" fill="#38BDF8" fillOpacity="0.8" />
          <circle cx="248" cy="180" r="4" fill="#38BDF8" fillOpacity="0.6" />

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
