/*
 * TransHorizons — Country locator map
 * Small SVG minimap for the country-report header: the country highlighted
 * against its neighbours, with 3-letter code labels on the neighbours.
 * Rendered from the repo's own Natural Earth 110m geodata
 * (/ne_110m_countries.geojson — the same file the globe uses), NOT from
 * generated imagery: geographic accuracy is non-negotiable.
 *
 * Framing: centred on the country's LARGEST landmass (so France frames on
 * metropolitan France, not on a bbox stretched to French Guiana; the USA on
 * the lower 48). Projection: local equirectangular with per-point longitude
 * deltas normalised to [-180°, 180°], so antimeridian countries (Russia,
 * Fiji, the Aleutians) don't smear. Good enough for a locator; not for
 * measurement.
 */

import React, { useEffect, useMemo, useState } from 'react';

type Ring = [number, number][];
interface Feature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown };
}
interface Extent { lon0: number; lat0: number; w: number; h: number }

let geoPromise: Promise<Feature[]> | null = null;
function loadCountries(): Promise<Feature[]> {
  if (!geoPromise) {
    geoPromise = fetch('/ne_110m_countries.geojson')
      .then((r) => r.json())
      .then((fc) => (fc?.features ?? []) as Feature[]);
  }
  return geoPromise;
}

const normLon = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

function ringsOf(geometry: Feature['geometry']): Ring[] {
  if (geometry.type === 'Polygon') return geometry.coordinates as Ring[];
  if (geometry.type === 'MultiPolygon') return (geometry.coordinates as Ring[][]).flat();
  return [];
}

function codeOf(f: Feature): string {
  const p = f.properties ?? {};
  const iso = String(p.ISO_A3 ?? '');
  // Natural Earth quirk: ISO_A3 is "-99" for e.g. France and Norway — fall back.
  return iso && iso !== '-99' ? iso : String(p.ADM0_A3 ?? '');
}

/** Largest ring by absolute shoelace area (in antimeridian-safe delta space). */
function largestRing(rings: Ring[]): Ring | null {
  let best: Ring | null = null;
  let bestArea = -1;
  for (const ring of rings) {
    if (ring.length < 4) continue;
    const seed = ring[0][0];
    let area = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const x1 = normLon(ring[i][0] - seed), y1 = ring[i][1];
      const x2 = normLon(ring[i + 1][0] - seed), y2 = ring[i + 1][1];
      area += x1 * y2 - x2 * y1;
    }
    area = Math.abs(area / 2);
    if (area > bestArea) { bestArea = area; best = ring; }
  }
  return best;
}

function extentOf(ring: Ring): Extent {
  const seed = ring[0][0];
  let dxMin = Infinity, dxMax = -Infinity, latMin = Infinity, latMax = -Infinity;
  for (const [lon, lat] of ring) {
    const dx = normLon(lon - seed);
    if (dx < dxMin) dxMin = dx;
    if (dx > dxMax) dxMax = dx;
    if (lat < latMin) latMin = lat;
    if (lat > latMax) latMax = lat;
  }
  return {
    lon0: normLon(seed + (dxMin + dxMax) / 2),
    lat0: (latMin + latMax) / 2,
    w: dxMax - dxMin,
    h: latMax - latMin,
  };
}

export function CountryLocatorMap({
  cca3,
  width = 300,
  height = 160,
  label,
}: { cca3: string; width?: number; height?: number; label?: string }) {
  const [features, setFeatures] = useState<Feature[] | null>(null);

  useEffect(() => {
    let alive = true;
    loadCountries().then((f) => { if (alive) setFeatures(f); });
    return () => { alive = false; };
  }, []);

  const svg = useMemo(() => {
    if (!features) return null;
    const code = cca3.toUpperCase();
    const target = features.find((f) => codeOf(f) === code);
    if (!target) return null;

    // Frame on the target's largest landmass (mainland), not its full bbox.
    const mainland = largestRing(ringsOf(target.geometry));
    if (!mainland) return null;
    const ext = extentOf(mainland);
    const cosF = Math.max(0.25, Math.cos((ext.lat0 * Math.PI) / 180));
    const aspect = width / height;

    // Zoom out enough to show neighbours; keep tiny countries in context.
    const PAD = 2.4;
    const spanY = Math.min(120, Math.max(9,
      Math.max((ext.w * cosF * PAD) / aspect, ext.h * PAD)));
    const spanX = spanY * aspect;

    const px = (lon: number, lat: number): [number, number] => [
      ((normLon(lon - ext.lon0) * cosF + spanX / 2) / spanX) * width,
      ((ext.lat0 - lat + spanY / 2) / spanY) * height,
    ];

    const pathOf = (f: Feature): string => {
      let d = '';
      for (const ring of ringsOf(f.geometry)) {
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = px(ring[i][0], ring[i][1]);
          d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        d += 'Z';
      }
      return d;
    };

    const neighbours: { d: string; name: string }[] = [];
    const labels: { x: number; y: number; code: string; area: number }[] = [];
    let targetPath = '';

    for (const f of features) {
      const d = pathOf(f);
      if (!d) continue;
      const fCode = codeOf(f);
      if (fCode === code) { targetPath = d; continue; }
      neighbours.push({ d, name: String(f.properties?.NAME ?? '') });

      // Label anchor: centre of the neighbour's largest landmass, if visibly on-map.
      const ring = largestRing(ringsOf(f.geometry));
      if (!ring || !fCode || fCode === '-99') continue;
      const ne = extentOf(ring);
      const [lx, ly] = px(ne.lon0, ne.lat0);
      const pxW = (ne.w * cosF / spanX) * width;
      const pxH = (ne.h / spanY) * height;
      const margin = 10;
      if (
        lx > margin && lx < width - margin &&
        ly > margin && ly < height - margin &&
        pxW * pxH > 450 // skip countries too small at this zoom to carry a label
      ) {
        labels.push({ x: lx, y: ly, code: fCode, area: pxW * pxH });
      }
    }
    // Cap label count, keeping the most prominent neighbours.
    labels.sort((a, b) => b.area - a.area);
    return { neighbours, targetPath, labels: labels.slice(0, 12) };
  }, [features, cca3, width, height]);

  if (!svg) return <div style={{ width, height }} aria-hidden="true" />;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="border border-[var(--cr-border)] bg-[var(--cr-surface)]"
    >
      <g>
        {svg.neighbours.map((n, i) => (
          <path
            key={i}
            d={n.d}
            fill="var(--cr-hover)"
            stroke="var(--cr-border)"
            strokeWidth={0.6}
            fillRule="evenodd"
          >
            {n.name && <title>{n.name}</title>}
          </path>
        ))}
        <path
          d={svg.targetPath}
          fill="var(--cr-accent)"
          fillOpacity={0.85}
          stroke="var(--cr-accent)"
          strokeWidth={0.8}
          fillRule="evenodd"
        />
        {svg.labels.map((l) => (
          <text
            key={l.code}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            letterSpacing={0.5}
            fill="var(--cr-muted)"
            style={{ pointerEvents: 'none', fontFamily: 'var(--font-body)' }}
          >
            {l.code}
          </text>
        ))}
      </g>
    </svg>
  );
}
