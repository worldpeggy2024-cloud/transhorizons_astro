/*
 * TransHorizons — Interactive Map Component (SVG-based)
 * Design: World map with custom markers for gallery locations
 * Features: Click markers to highlight gallery items, responsive
 */

import { useEffect, useRef } from 'react';

interface MapLocation {
  id: number;
  title: string;
  x: number; // percentage position on map
  y: number;
  location: string;
}

const mapLocations: MapLocation[] = [
  {
    id: 1,
    title: 'Sydney',
    x: 78,
    y: 72,
    location: 'Sydney, Australia',
  },
  {
    id: 2,
    title: 'Andean Dawn',
    x: 25,
    y: 55,
    location: 'Andes, South America',
  },
  {
    id: 3,
    title: 'The Archive',
    x: 52,
    y: 35,
    location: 'Grand Library, Paris',
  },
  {
    id: 4,
    title: 'Fluid Horizons',
    x: 20,
    y: 48,
    location: 'Pacific Coast, USA',
  },
  {
    id: 5,
    title: 'BancArbre',
    x: 28,
    y: 32,
    location: 'Montréal, Canada',
  },
  {
    id: 6,
    title: 'Montréal',
    x: 28,
    y: 32,
    location: 'Montréal, Québec',
  },
];

interface InteractiveMapProps {
  onMarkerClick?: (id: number) => void;
  activeMarker?: number | null;
}

export default function InteractiveMap({ onMarkerClick, activeMarker }: InteractiveMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Add hover effects to markers
    if (!svgRef.current) return;

    const markers = svgRef.current.querySelectorAll('[data-marker-id]');
    markers.forEach((marker) => {
      const id = parseInt(marker.getAttribute('data-marker-id') || '0');
      if (id === activeMarker) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });
  }, [activeMarker]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#E8E6E3] to-[#F5F3F0] rounded-lg overflow-hidden border border-[#C8C8C8] relative">
      {/* SVG World Map Background */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Simplified world map background */}
        <defs>
          <pattern id="mapPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#EFEFEF" />
            <path d="M 0 0 L 100 100 M 100 0 L 0 100" stroke="#C8C8C8" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="1000" height="600" fill="url(#mapPattern)" />

        {/* Continents (simplified shapes) */}
        <g fill="#F5F3F0" stroke="#C8C8C8" strokeWidth="1" opacity="0.6">
          {/* North America */}
          <ellipse cx="150" cy="180" rx="80" ry="100" />
          {/* South America */}
          <ellipse cx="200" cy="380" rx="50" ry="100" />
          {/* Europe */}
          <ellipse cx="520" cy="150" rx="60" ry="50" />
          {/* Africa */}
          <ellipse cx="550" cy="350" rx="70" ry="100" />
          {/* Asia */}
          <ellipse cx="700" cy="250" rx="120" ry="100" />
          {/* Australia */}
          <ellipse cx="800" cy="420" rx="50" ry="60" />
        </g>

        {/* Grid lines */}
        <g stroke="#C8C8C8" strokeWidth="0.5" opacity="0.2">
          {/* Latitude lines */}
          {[100, 200, 300, 400, 500].map((y) => (
            <line key={`lat-${y}`} x1="0" y1={y} x2="1000" y2={y} />
          ))}
          {/* Longitude lines */}
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
            <line key={`lon-${x}`} x1={x} y1="0" x2={x} y2="600" />
          ))}
        </g>

        {/* Markers */}
        {mapLocations.map((location) => (
          <g
            key={location.id}
            data-marker-id={location.id}
            className="cursor-pointer transition-all duration-300 group"
            onClick={() => onMarkerClick?.(location.id)}
          >
            {/* Outer circle (glow effect) */}
            <circle
              cx={`${location.x}%`}
              cy={`${location.y}%`}
              r="18"
              fill="#7D1A2E"
              opacity="0"
              className="group-hover:opacity-20 transition-opacity duration-300"
            />
            {/* Main marker */}
            <circle
              cx={`${location.x}%`}
              cy={`${location.y}%`}
              r="10"
              fill="#7D1A2E"
              stroke="#1A1A1A"
              strokeWidth="2"
              className="group-hover:r-[14] transition-all duration-300"
            />
            {/* Marker label on hover */}
            <text
              x={`${location.x}%`}
              y={`${location.y - 4}%`}
              textAnchor="middle"
              className="text-[8px] font-body fill-[#1A1A1A] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ fontSize: '10px' }}
            >
              {location.title}
            </text>
          </g>
        ))}
      </svg>

      {/* Info box */}
      {activeMarker && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/40 p-4 text-white animate-fade-in-up">
          {mapLocations.find((l) => l.id === activeMarker) && (
            <>
              <p className="text-[#7D1A2E] text-xs tracking-widest uppercase font-body mb-1">
                {mapLocations.find((l) => l.id === activeMarker)?.location}
              </p>
              <p className="font-display text-lg">
                {mapLocations.find((l) => l.id === activeMarker)?.title}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
