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

import { useEffect, useMemo, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { SEO_READY_COUNTRIES } from '../lib/analysedCountries';

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

const READY = new Set(SEO_READY_COUNTRIES.map((c) => c.toUpperCase()));

// Fixed brand burgundy — the World Views hover-card fill (rgba(125,26,46)). Used
// for the current country so it reads the same in light AND dark, instead of the
// theme --cr-accent, which is deliberately a light pink in dark mode.
const REPORT_RED = '#7D1A2E';

export function CountryLocatorMap({
  cca3,
  width = 300,
  height = 160,
  label,
  interactive = false,
  onSelectCountry,
}: {
  cca3: string;
  width?: number;
  height?: number;
  label?: string;
  // Opt-in: drag to spin, and click a report-ready country to jump to it.
  // Off by default — the static locator ("Location of X") is unchanged.
  interactive?: boolean;
  onSelectCountry?: (cca3: string) => void;
}) {
  const code = cca3.toUpperCase();
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [rotation, setRotation] = useState<[number, number] | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    let alive = true;
    loadCountries().then((f) => { if (alive) setFeatures(f); });
    return () => { alive = false; };
  }, []);

  // Country centre (largest landmass) = the initial orientation (Wikipedia-style).
  const center = useMemo<[number, number] | null>(() => {
    if (!features) return null;
    const target = features.find((f) => codeOf(f) === code);
    if (!target) return null;
    const mainland = largestRing(ringsOf(target.geometry));
    return mainland ? centerOf(mainland) : null;
  }, [features, code]);

  // (Re)centre when the target country changes; drag then takes over via setRotation.
  useEffect(() => {
    if (center) setRotation([-center[0], -center[1]]);
  }, [code, center]);

  const rot = rotation ?? (center ? ([-center[0], -center[1]] as [number, number]) : null);

  const svg = useMemo(() => {
    if (!features || !rot) return null;
    const target = features.find((f) => codeOf(f) === code);
    if (!target) return null;

    const radius = Math.min(width, height) / 2 - 3;
    const projection = geoOrthographic()
      .rotate([rot[0], rot[1]])
      .translate([width / 2, height / 2])
      .scale(radius)
      .clipAngle(90);
    const path = geoPath(projection);

    const spherePath = path({ type: 'Sphere' } as any) ?? '';
    const graticulePath = path(geoGraticule10() as any) ?? '';

    const land: { d: string; name: string; code: string }[] = [];
    let targetPath = '';
    for (const f of features) {
      const d = path(f as any);
      if (!d) continue;
      const fc = codeOf(f);
      if (fc === code) { targetPath = d; continue; }
      land.push({ d, name: String(f.properties?.NAME ?? ''), code: fc });
    }

    // Microstate fallback: too small to read at hemisphere scale → ring marker
    // at its location (the Wikipedia convention).
    const marker: [number, number] | null =
      center && path.area(target as any) < 40 ? (projection(center) ?? null) : null;

    return { spherePath, graticulePath, land, targetPath, marker };
  }, [features, code, width, height, center, rot?.[0], rot?.[1]]);

  // ── Drag-to-spin (interactive only) ────────────────────────────────────────
  // Latest rotation kept in a ref so the drag closures never go stale, and the
  // rotation is applied at most once per animation frame (SVG re-path is CPU-bound,
  // unlike the WebGL World Views globe — so no idle auto-spin, only on drag).
  const rotRef = useRef(rot);
  rotRef.current = rot;
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<[number, number] | null>(null);
  useEffect(() => () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); }, []);

  const onSvgPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    const st = { x: e.clientX, y: e.clientY, moved: false };
    dragRef.current = st;
    setGrabbing(true);
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - st.x, dy = ev.clientY - st.y;
      st.x = ev.clientX; st.y = ev.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 3) st.moved = true;
      const cur = pendingRef.current ?? rotRef.current ?? [0, 0];
      let lambda = cur[0] + dx * 0.4;                       // 0.4°/px — tune to taste
      const phi = Math.max(-90, Math.min(90, cur[1] - dy * 0.4));
      lambda = (((lambda + 180) % 360) + 360) % 360 - 180;
      pendingRef.current = [lambda, phi];
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          if (pendingRef.current) setRotation(pendingRef.current);
        });
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      pendingRef.current = null;
      setGrabbing(false);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const canSelect = (fc: string) => interactive && !!onSelectCountry && fc !== code && READY.has(fc);
  const handleSelect = (fc: string) => {
    if (dragRef.current?.moved) return;   // it was a drag, not a click
    onSelectCountry?.(fc);
  };

  if (!svg) return <div style={{ width, height }} aria-hidden="true" />;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="bg-[var(--cr-bg)]"
      style={interactive ? { cursor: grabbing ? 'grabbing' : 'grab', touchAction: 'none' } : undefined}
      onPointerDown={interactive ? onSvgPointerDown : undefined}
    >
      {/* Hemisphere (ocean) */}
      <path d={svg.spherePath} fill="var(--cr-map-ocean)" stroke="var(--cr-border)" strokeWidth={1} />
      {/* Graticule */}
      <path d={svg.graticulePath} fill="none" stroke="var(--cr-map-graticule)" strokeWidth={0.4} />
      {/* Land — report-ready countries (interactive mode) render as clickable accents */}
      {svg.land.map((n, i) => {
        const selectable = canSelect(n.code);
        return (
          <path
            key={i}
            d={n.d}
            fill={selectable ? 'var(--cr-accent)' : 'var(--cr-map-land)'}
            fillOpacity={selectable ? (hovered === n.code ? 0.75 : 0.4) : 1}
            stroke={selectable ? 'var(--cr-accent)' : 'var(--cr-map-land-border)'}
            strokeWidth={selectable ? 0.6 : 0.4}
            fillRule="evenodd"
            style={selectable ? { cursor: 'pointer' } : undefined}
            onClick={selectable ? () => handleSelect(n.code) : undefined}
            onPointerEnter={selectable ? () => setHovered(n.code) : undefined}
            onPointerLeave={selectable ? () => setHovered(null) : undefined}
          >
            {n.name && <title>{n.name}</title>}
          </path>
        );
      })}
      {/* Target country (the report you're on) */}
      {svg.targetPath && (
        <path
          d={svg.targetPath}
          fill={REPORT_RED}
          fillOpacity={1}
          stroke={REPORT_RED}
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
          stroke={REPORT_RED}
          strokeWidth={1.6}
        />
      )}
    </svg>
  );
}
