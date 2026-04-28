/*
 * TransHorizons — Interactive Earth Globe Section
 * Design: Editorial Horizon — dark space background, gold country highlights
 * Features:
 *   - Real 23.5° axial tilt
 *   - Slow auto-rotation (pausable on drag)
 *   - Country borders from TopoJSON (110m resolution)
 *   - Hover: country outline highlight
 *   - Click: popup with flag, capital, population, region + link to analysis page
 *   - Small/micro states shown as dot markers
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';
import { ArrowRight, Globe, Users, MapPin, BarChart2 } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CountryData {
  cca3: string;
  cca2: string;
  ccn3: string;
  nameEn: string;
  nameFr: string;
  capital: string;
  population: number;
  flag: string;
  region: string;
  subregion: string;
  area: number;
  latlng: [number, number];
  independent: boolean;
  unMember: boolean;
}

interface CountryPopup {
  country: CountryData;
  x: number;
  y: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AXIAL_TILT = 23.5 * (Math.PI / 180); // radians
const AUTO_ROTATE_SPEED = 0.0015; // radians per frame
const GLOBE_RADIUS = 1;
const EARTH_TEXTURE = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg';
const EARTH_BUMP = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_4k.jpg';
const EARTH_SPECULAR = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/water_4k.png';

// Micro-states / very small countries that need dot markers (area < 1000 km²)
const MICRO_STATES = new Set(['MCO', 'SMR', 'VAT', 'LIE', 'AND', 'MLT', 'MDV', 'SGP', 'BHR',
  'KWT', 'QAT', 'TON', 'NRU', 'PLW', 'MHL', 'FSM', 'KIR', 'TUV', 'WSM', 'VCT', 'GRD',
  'ATG', 'DMA', 'KNA', 'LCA', 'BRB', 'TTO', 'CPV', 'COM', 'STP', 'SYC']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPopulation(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function latLngToVector3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// ─── Country Popup ────────────────────────────────────────────────────────────

function CountryPopupCard({ popup, onClose, language }: {
  popup: CountryPopup;
  onClose: () => void;
  language: string;
}) {
  const { country, x, y } = popup;
  const name = language === 'fr' ? country.nameFr : country.nameEn;
  const slug = country.cca3.toLowerCase();

  // Keep popup inside viewport
  const left = Math.min(x + 16, window.innerWidth - 280);
  const top = Math.min(y - 20, window.innerHeight - 220);

  return (
    <div
      className="fixed z-40 w-64 bg-[#0D0D0D]/95 border border-[#7D1A2E]/30 backdrop-blur-sm shadow-2xl"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FlagIcon
            cca2={country.cca2}
            emoji={country.flag}
            label={name}
            size="2rem"
            className="leading-none"
          />
          <span className="text-white font-display text-sm font-medium leading-tight">{name}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Stats — icon-based, no translation needed */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 text-white/70">
          <MapPin size={12} className="text-[#7D1A2E] shrink-0" />
          <span className="font-body text-xs">{country.capital || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Users size={12} className="text-[#7D1A2E] shrink-0" />
          <span className="font-body text-xs">{formatPopulation(country.population)}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Globe size={12} className="text-[#7D1A2E] shrink-0" />
          <span className="font-body text-xs">{country.subregion || country.region || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <BarChart2 size={12} className="text-[#7D1A2E] shrink-0" />
          <span className="font-body text-xs">
            {country.area > 0 ? country.area.toLocaleString() + ' km²' : '—'}
          </span>
        </div>
      </div>

      {/* Link to analysis page */}
      <div className="px-4 pb-3">
        <Link
          href={`/country/${slug}`}
          className="flex items-center justify-between w-full px-3 py-2 bg-[#7D1A2E]/10 hover:bg-[#7D1A2E]/20 border border-[#7D1A2E]/30 transition-colors group"
          onClick={onClose}
        >
          <span className="text-[#7D1A2E] font-body text-xs tracking-wide">
            {language === 'fr' ? 'Analyse du pays' : 'Country analysis'}
          </span>
          <ArrowRight size={12} className="text-[#7D1A2E] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Globe Component ─────────────────────────────────────────────────────

export default function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null); // tilted group
  const spinGroupRef = useRef<THREE.Group | null>(null);  // spins inside tilted group
  const frameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const countriesDataRef = useRef<CountryData[]>([]);
  const countryMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const hoveredRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [popup, setPopup] = useState<CountryPopup | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { language } = useLanguage();

  // ── Init Three.js ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 2.8;
    cameraRef.current = camera;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5e0, 1.2);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // Stars background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    // Tilted group (represents Earth's axial tilt)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = AXIAL_TILT;
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Spin group (rotates inside the tilted group)
    const spinGroup = new THREE.Group();
    globeGroup.add(spinGroup);
    spinGroupRef.current = spinGroup;

    // Earth sphere
    const loader = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_TEXTURE),
      bumpMap: loader.load(EARTH_BUMP),
      bumpScale: 0.05,
      specularMap: loader.load(EARTH_SPECULAR),
      specular: new THREE.Color(0x333333),
      shininess: 15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    spinGroup.add(earthMesh);

    // Atmosphere glow
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.02, 64, 64);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.FrontSide,
    });
    spinGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Load country borders + data
    Promise.all([
      fetch('/countries-110m.json').then(r => r.json()),
      fetch('/countries-data.json').then(r => r.json()),
    ]).then(([topo, countriesData]: [Topology, CountryData[]]) => {
      countriesDataRef.current = countriesData;

      // Build ccn3 → CountryData lookup
      const byNumeric = new Map<string, CountryData>();
      countriesData.forEach(c => { if (c.ccn3) byNumeric.set(c.ccn3, c); });

      // Draw country meshes (for raycasting + highlight)
      const countries = feature(topo as Topology<{ countries: GeometryCollection }>, (topo as any).objects.countries);

      (countries as any).features.forEach((f: any) => {
        const numericId = String(f.id).padStart(3, '0');
        const countryData = byNumeric.get(numericId);
        if (!countryData) return;

        // Create invisible mesh for raycasting using canvas-drawn texture
        const meshGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.001, 64, 64);
        const meshMat = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(meshGeo, meshMat);
        mesh.userData = { countryData };
        spinGroup.add(mesh);
        countryMeshesRef.current.set(countryData.cca3, mesh);
      });

      // Draw country borders as lines on the sphere
      const borderMat = new THREE.LineBasicMaterial({
        color: 0xc9a96e,
        transparent: true,
        opacity: 0.35,
        linewidth: 1,
      });

      (countries as any).features.forEach((f: any) => {
        const coords = f.geometry?.coordinates;
        if (!coords) return;

        const drawRing = (ring: [number, number][]) => {
          const points: THREE.Vector3[] = [];
          ring.forEach(([lng, lat]) => {
            points.push(latLngToVector3(lat, lng, GLOBE_RADIUS + 0.002));
          });
          if (points.length < 2) return;
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          spinGroup.add(new THREE.Line(geo, borderMat));
        };

        if (f.geometry.type === 'Polygon') {
          f.geometry.coordinates.forEach((ring: [number, number][]) => drawRing(ring));
        } else if (f.geometry.type === 'MultiPolygon') {
          f.geometry.coordinates.forEach((poly: [number, number][][]) =>
            poly.forEach((ring) => drawRing(ring))
          );
        }
      });

      // Dot markers for micro-states
      countriesData.forEach(c => {
        if (!MICRO_STATES.has(c.cca3)) return;
        const [lat, lng] = c.latlng;
        if (!lat && !lng) return;
        const pos = latLngToVector3(lat, lng, GLOBE_RADIUS + 0.015);
        const dotGeo = new THREE.SphereGeometry(0.012, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xc9a96e });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pos);
        dot.userData = { countryData: c };
        spinGroup.add(dot);
      });

      setLoaded(true);
    });

    // Resize handler
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (autoRotateRef.current && spinGroupRef.current) {
        spinGroupRef.current.rotation.y += AUTO_ROTATE_SPEED;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // ── Mouse interaction ──────────────────────────────────────────────────────
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    autoRotateRef.current = false;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current && spinGroupRef.current) {
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      spinGroupRef.current.rotation.y += dx * 0.005;
      spinGroupRef.current.rotation.x += dy * 0.005;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    // Resume auto-rotate after 3 seconds of inactivity
    setTimeout(() => { autoRotateRef.current = true; }, 3000);
  }, []);

  const onCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current || !cameraRef.current || !spinGroupRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1,
      -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Check all children of spinGroup for intersection
    const objects: THREE.Object3D[] = [];
    spinGroupRef.current.traverse(obj => {
      if (obj.userData?.countryData) objects.push(obj);
    });
    const hits = raycaster.intersectObjects(objects, false);
    if (hits.length > 0) {
      const countryData = hits[0].object.userData.countryData as CountryData;
      setPopup({ country: countryData, x: e.clientX, y: e.clientY });
    } else {
      setPopup(null);
    }
  }, []);

  return (
    <section id="globe" className="relative bg-[#080810] overflow-hidden" style={{ height: '100vh', minHeight: '600px' }}>
      {/* Section label */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={12} className="text-[#7D1A2E]" />
          <span className="text-[#7D1A2E] text-[10px] tracking-[0.35em] uppercase font-body">
            {language === 'fr' ? 'Analyse mondiale' : 'World Analysis'}
          </span>
        </div>
        <h2 className="text-white font-display text-2xl font-light leading-tight">
          {language === 'fr' ? (
            <>Le monde<br /><span className="italic">observé</span></>
          ) : (
            <>The world<br /><span className="italic">observed</span></>
          )}
        </h2>
        <p className="text-white/40 font-body text-xs mt-2 max-w-[180px] leading-relaxed">
          {language === 'fr'
            ? 'Cliquez sur un pays pour explorer son analyse'
            : 'Click any country to explore its analysis'}
        </p>
      </div>

      {/* Axial tilt indicator */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <p className="text-white/25 font-body text-[10px] tracking-wider">
          {language === 'fr' ? 'Inclinaison axiale réelle : 23,5°' : 'Real axial tilt: 23.5°'}
        </p>
      </div>

      {/* Drag hint */}
      {loaded && (
        <div className="absolute bottom-8 right-8 z-10 pointer-events-none">
          <p className="text-white/25 font-body text-[10px] tracking-wider">
            {language === 'fr' ? '↔ Faites glisser pour tourner' : '↔ Drag to rotate'}
          </p>
        </div>
      )}

      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center">
            <div className="w-8 h-8 border border-[#7D1A2E]/30 border-t-[#7D1A2E] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/40 font-body text-xs tracking-widest">
              {language === 'fr' ? 'Chargement du globe…' : 'Loading globe…'}
            </p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={onCanvasClick}
        />
      </div>

      {/* Country popup */}
      {popup && (
        <CountryPopupCard
          popup={popup}
          onClose={() => setPopup(null)}
          language={language}
        />
      )}
    </section>
  );
}
