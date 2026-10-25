import React from 'react';

export function FacetedFormPoster() {
  // Pre-computed 2D projection of a faceted icosahedron (detail 2) with flat-shaded facets in --accent and 15% --text wireframe
  const facets = [
    { pts: '180,38 118,86 180,108', op: 0.92 },
    { pts: '180,38 180,108 242,86', op: 0.74 },
    { pts: '118,86 64,138 124,158', op: 0.84 },
    { pts: '118,86 124,158 180,108', op: 0.96 },
    { pts: '180,108 124,158 180,180', op: 0.88 },
    { pts: '180,108 180,180 236,158', op: 0.78 },
    { pts: '180,108 236,158 242,86', op: 0.66 },
    { pts: '242,86 236,158 296,138', op: 0.58 },
    { pts: '64,138 72,216 124,158', op: 0.72 },
    { pts: '124,158 72,216 132,234', op: 0.82 },
    { pts: '124,158 132,234 180,180', op: 0.9 },
    { pts: '180,180 132,234 180,256', op: 0.76 },
    { pts: '180,180 180,256 228,234', op: 0.68 },
    { pts: '180,180 228,234 236,158', op: 0.8 },
    { pts: '236,158 228,234 288,216', op: 0.62 },
    { pts: '236,158 288,216 296,138', op: 0.52 },
    { pts: '72,216 122,282 132,234', op: 0.64 },
    { pts: '132,234 122,282 180,256', op: 0.74 },
    { pts: '180,256 122,282 180,322', op: 0.68 },
    { pts: '180,256 180,322 238,282', op: 0.56 },
    { pts: '180,256 238,282 228,234', op: 0.64 },
    { pts: '228,234 238,282 288,216', op: 0.48 },
  ];

  return (
    <div
      aria-hidden="true"
      data-testid="hero-faceted-poster"
      className="w-full h-full flex items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--surface)] select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 360 360"
        className="w-[240px] h-[240px] md:w-[300px] md:h-[300px]"
        aria-hidden="true"
      >
        <g>
          {facets.map((f, idx) => (
            <polygon
              key={idx}
              points={f.pts}
              fill="var(--accent)"
              fillOpacity={f.op}
              stroke="var(--text)"
              strokeOpacity="0.15"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function NeuralNetworkPoster() {
  const layers = [
    [60, 110, 160, 210],
    [40, 80, 120, 160, 200, 240],
    [30, 65, 100, 135, 170, 205, 240, 275],
    [40, 80, 120, 160, 200, 240],
    [80, 140, 200],
  ];
  const layerX = [40, 110, 180, 250, 320];

  return (
    <div
      aria-hidden="true"
      data-testid="hero-neural-poster"
      className="w-full h-full flex items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface)] select-none overflow-hidden p-4"
    >
      <svg
        viewBox="0 0 360 300"
        className="w-full h-full max-h-[280px]"
        aria-hidden="true"
      >
        {/* Draw subtle connections */}
        <g stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="0.8">
          {layers.slice(0, -1).map((currentLayer, lIdx) =>
            currentLayer.map((y1, i1) =>
              layers[lIdx + 1].map((y2, i2) =>
                (i1 + i2) % 2 === 0 ? (
                  <line
                    key={`line-${lIdx}-${i1}-${i2}`}
                    x1={layerX[lIdx]}
                    y1={y1}
                    x2={layerX[lIdx + 1]}
                    y2={y2}
                  />
                ) : null
              )
            )
          )}
        </g>
        {/* Draw nodes */}
        {layers.map((layer, lIdx) =>
          layer.map((y, nIdx) => (
            <g key={`node-${lIdx}-${nIdx}`}>
              <circle
                cx={layerX[lIdx]}
                cy={y}
                r="7"
                fill="var(--accent)"
                fillOpacity="0.15"
              />
              <circle
                cx={layerX[lIdx]}
                cy={y}
                r="3.5"
                fill="var(--accent)"
                fillOpacity="0.85"
              />
            </g>
          ))
        )}
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

export function MoleculePoster() {
  const steps = 18;
  return (
    <div
      aria-hidden="true"
      data-testid="research-molecule-poster"
      className="w-full h-full flex items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface)] select-none overflow-hidden p-3"
    >
      <svg viewBox="0 0 340 180" className="w-full h-full max-h-[170px]" aria-hidden="true">
        {Array.from({ length: steps }).map((_, i) => {
          const t = i / (steps - 1);
          const x = 30 + t * 280;
          const y1 = 90 + Math.sin(t * Math.PI * 2.5) * 45;
          const y2 = 90 - Math.sin(t * Math.PI * 2.5) * 45;
          return (
            <g key={i}>
              <line x1={x} y1={y1} x2={x} y2={y2} stroke="var(--border)" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx={x} cy={y1} r="4" fill="var(--accent)" fillOpacity="0.9" />
              <circle cx={x} cy={y2} r="4" fill="var(--text)" fillOpacity="0.6" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function TechGlobePoster() {
  return (
    <div
      aria-hidden="true"
      data-testid="tech-globe-poster"
      className="w-full h-full flex items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface)] select-none overflow-hidden p-4"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full max-h-[180px]" aria-hidden="true">
        <circle cx="100" cy="100" r="70" fill="none" stroke="var(--border)" strokeWidth="1.5" />
        <ellipse cx="100" cy="100" rx="70" ry="25" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
        <ellipse cx="100" cy="100" rx="25" ry="70" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="30" r="4" fill="var(--accent)" />
        <circle cx="170" cy="100" r="4" fill="var(--accent)" />
        <circle cx="100" cy="170" r="4" fill="var(--accent)" />
        <circle cx="30" cy="100" r="4" fill="var(--accent)" />
      </svg>
    </div>
  );
}
