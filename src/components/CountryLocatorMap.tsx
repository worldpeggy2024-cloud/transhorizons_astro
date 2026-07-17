/*
 * TransHorizons — Country locator globe
 * Wikipedia-style orthographic locator ("Location of X"): a hemisphere globe
 * centred on the country, 10° graticule, all land in neutral grey, the target
 * country in the report accent. Rendered with d3-geo from the repo's own
 * Natural Earth 110m geodata (/ne_110m_countries.geojson — the same file the
 * globe uses), NOT from generated imagery: geographic accuracy is
 * non-negotiable.
 *
 * Centring: on the country's LARGEST landmass (so France frames on
 * metropolitan France, not a bbox stretched to French Guiana; the USA on the
 * lower 48). Countries too small to read at hemisphere scale get a ring
 * marker at their location (the Wikipedia convention for microstates).
 * Colors come from the --cr-map-* variables in global.css (light + dark).
 */

import { useEffect, useMemo, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';

type Ring = [number, number][];
interface Feature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown };
}

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

/** Centre of the ring's antimeridian-safe bounding box. */
function centerOf(ring: Ring): [number, number] {
  const seed = ring[0][0];
  let dxMin = Infinity, dxMax = -Infinity, latMin = Infinity, latMax = -Infinity;
  for (const [lon, lat] of ring) {
    const dx = normLon(lon - seed);
    if (dx < dxMin) dxMin = dx;
    if (dx > dxMax) dxMax = dx;
    if (lat < latMin) latMin = lat;
    if (lat > latMax) latMax = lat;
  }
  return [normLon(seed + (dxMin + dxMax) / 2), (latMin + latMax) / 2];
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

    const mainland = largestRing(ringsOf(target.geometry));
    if (!mainland) return null;
    const [lon0, lat0] = centerOf(mainland);

    const radius = Math.min(width, height) / 2 - 3;
    const projection = geoOrthographic()
      .rotate([-lon0, -lat0])
      .translate([width / 2, height / 2])
      .scale(radius)
      .clipAngle(90);
    const path = geoPath(projection);

    const spherePath = path({ type: 'Sphere' } as any) ?? '';
    const graticulePath = path(geoGraticule10() as any) ?? '';

    const land: { d: string; name: string }[] = [];
    let targetPath = '';
    for (const f of features) {
      const d = path(f as any);
      if (!d) continue;
      if (codeOf(f) === code) { targetPath = d; continue; }
      land.push({ d, name: String(f.properties?.NAME ?? '') });
    }

    // Microstate fallback: too small to read at hemisphere scale → ring marker
    // at its location (the Wikipedia convention).
    let marker: [number, number] | null = null;
    if (path.area(target as any) < 40) {
      marker = projection([lon0, lat0]) ?? null;
    }

    return { spherePath, graticulePath, land, targetPath, marker };
  }, [features, cca3, width, height]);

  if (!svg) return <div style={{ width, height }} aria-hidden="true" />;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="bg-[var(--cr-bg)]"
    >
      {/* Hemisphere (ocean) */}
      <path d={svg.spherePath} fill="var(--cr-map-ocean)" stroke="var(--cr-border)" strokeWidth={1} />
      {/* Graticule */}
      <path d={svg.graticulePath} fill="none" stroke="var(--cr-map-graticule)" strokeWidth={0.4} />
      {/* Land */}
      {svg.land.map((n, i) => (
        <path
          key={i}
          d={n.d}
          fill="var(--cr-map-land)"
          stroke="var(--cr-map-land-border)"
          strokeWidth={0.4}
          fillRule="evenodd"
        >
          {n.name && <title>{n.name}</title>}
        </path>
      ))}
      {/* Target country */}
      {svg.targetPath && (
        <path
          d={svg.targetPath}
          fill="var(--cr-accent)"
          fillOpacity={0.9}
          stroke="var(--cr-accent)"
          strokeWidth={0.6}
          fillRule="evenodd"
        />
      )}
      {/* Microstate ring marker */}
      {svg.marker && (
        <circle
          cx={svg.marker[0]}
          cy={svg.marker[1]}
          r={6}
          fill="none"
          stroke="var(--cr-accent)"
          strokeWidth={1.6}
        />
      )}
    </svg>
  );
}
