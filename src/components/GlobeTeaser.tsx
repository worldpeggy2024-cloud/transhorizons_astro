/*
 * TransHorizons — Globe Banner (Homepage)
 * Design: Editorial Horizon — framed dark section with burgundy border accent,
 *         auto-rotating globe, prominent CTA.
 * Mobile: globe + button on same row, description sentence below to save vertical space.
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { ANALYSED_COUNT } from '../lib/analysedCountries';

const AXIAL_TILT = 23.5 * (Math.PI / 180);
const AUTO_ROTATE_SPEED = 0.004;
const EARTH_TEXTURE  = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg';
const EARTH_BUMP     = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_4k.jpg';
const EARTH_SPECULAR = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/water_4k.png';

export default function GlobeTeaser() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef     = useRef<number>(0);
  const spinRef      = useRef<THREE.Group | null>(null);
  const [loaded, setLoaded]   = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const S = container.clientWidth;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(S, S);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 2.5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sun = new THREE.DirectionalLight(0xfff5e0, 1.3);
    sun.position.set(4, 2, 5);
    scene.add(sun);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = AXIAL_TILT;
    scene.add(tiltGroup);

    const spinGroup = new THREE.Group();
    tiltGroup.add(spinGroup);
    spinRef.current = spinGroup;

    const loader = new THREE.TextureLoader();
    const mat = new THREE.MeshPhongMaterial({
      map:         loader.load(EARTH_TEXTURE, () => setLoaded(true)),
      bumpMap:     loader.load(EARTH_BUMP),
      bumpScale:   0.04,
      specularMap: loader.load(EARTH_SPECULAR),
      specular:    new THREE.Color(0x222222),
      shininess:   12,
    });
    spinGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), mat));

    spinGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.015, 48, 48),
      new THREE.MeshPhongMaterial({ color: 0x4488ff, transparent: true, opacity: 0.06, side: THREE.FrontSide }),
    ));

    const onResize = () => {
      const s = container.clientWidth;
      renderer.setSize(s, s);
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (spinRef.current) spinRef.current.rotation.y += AUTO_ROTATE_SPEED;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  const fr = language === 'fr';

  return (
    <section
      id="globe-teaser"
      ref={sectionRef}
      className="bg-[#050508] py-6 md:py-8"
    >
      {/* Outer frame: full-width burgundy border top + bottom */}
      <div className="border-t border-b border-[#7D1A2E]/40">
        <Link href="/world-analysis" className="block group">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

            <div
              className={`
                relative py-6 md:py-10
                transition-all duration-700
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              {/* Left accent bar (desktop only) */}
              <div className="absolute left-0 top-6 bottom-6 w-px bg-[#7D1A2E]/30 hidden lg:block" />

              {/* ── Top row: Globe + Text block + CTA ── */}
              <div className="flex items-center gap-6 md:gap-10 lg:ml-6 lg:mr-6">

                {/* Globe */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-blue-900/20 blur-xl pointer-events-none scale-150" />
                  {/* Burgundy ring frame around globe */}
                  <div className="absolute -inset-1.5 rounded-full border border-[#7D1A2E]/30 pointer-events-none" />
                  <div ref={containerRef} className="relative w-16 h-16 md:w-28 md:h-28">
                    {!loaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border border-[#7D1A2E]/30 border-t-[#7D1A2E] rounded-full animate-spin" />
                      </div>
                    )}
                    <canvas ref={canvasRef} className="w-full h-full rounded-full" />
                  </div>
                </div>

                {/* Text block (headline + badge) */}
                <div className="flex-1 min-w-0">
                  {/* Label */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-4 h-px bg-[#7D1A2E]" />
                    <span className="text-[#7D1A2E] text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-body font-bold">
                      {fr ? 'Analyse mondiale' : 'World Analysis'}
                    </span>
                  </div>
                  {/* Headline */}
                  <h3 className="text-white font-display text-lg md:text-2xl lg:text-3xl font-light leading-snug mb-2">
                    {fr
                      ? 'Rapports de situation mondiale'
                      : 'Global Situation Reports'}
                  </h3>
                  {/* Subtitle */}
                  <p className="hidden md:block text-white/60 font-body text-xs md:text-sm leading-relaxed mt-1 mb-3 max-w-lg">
                    {fr
                      ? 'Cartes analytiques interactives explorant les dynamiques géopolitiques, de ressources et technologiques façonnant les trajectoires nationales.'
                      : 'Interactive analytical maps exploring geopolitical, resource, and technological dynamics shaping national trajectories.'}
                  </p>
                  {/* Country count badge — hidden on mobile, shown on md+ */}
                  <div className="hidden md:flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 border border-[#7D1A2E]/50 bg-[#7D1A2E]/8 px-3 py-1">
                      <span className="text-[#7D1A2E] font-display text-base font-bold leading-none">{ANALYSED_COUNT}</span>
                      <span className="text-[#7D1A2E]/80 font-body text-[10px] font-bold tracking-[0.2em] uppercase">
                        {fr ? 'pays' : 'countries'}
                      </span>
                    </span>
                    <span className="text-white/25 font-body text-xs">
                      {fr ? 'analyses disponibles' : 'analyses available'}
                    </span>
                  </div>
                </div>

                {/* CTA button */}
                <div className="shrink-0 flex flex-col items-center gap-2 text-[#7D1A2E]">
                  <div className="border border-[#7D1A2E]/50 px-4 md:px-5 py-2 md:py-2.5 flex items-center gap-2 group-hover:bg-[#7D1A2E]/10 transition-colors">
                    <span className="font-body text-xs md:text-sm tracking-widest uppercase text-[#7D1A2E] font-bold">
                      {fr ? 'Explorer' : 'Explore'}
                    </span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 text-[#7D1A2E]" />
                  </div>
                </div>

              </div>

              {/* ── Bottom row: Description sentence (full width, below globe row) ── */}
              <div className="mt-3 md:mt-0 lg:ml-6 lg:mr-6">
                {/* Description — shown on mobile below the row; hidden on md+ (already inline above) */}
                <p className="md:hidden text-white/45 font-body text-xs leading-relaxed">
                  {fr
                    ? 'Cartes analytiques interactives explorant les dynamiques géopolitiques, de ressources et technologiques façonnant les trajectoires nationales.'
                    : 'Interactive analytical maps exploring geopolitical, resource, and technological dynamics shaping national trajectories.'}
                </p>
                {/* Country count badge — mobile only, below description */}
                <div className="flex md:hidden items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 border border-[#7D1A2E]/50 bg-[#7D1A2E]/8 px-2.5 py-0.5">
                    <span className="text-[#7D1A2E] font-display text-sm font-bold leading-none">{ANALYSED_COUNT}</span>
                    <span className="text-[#7D1A2E]/80 font-body text-[9px] font-bold tracking-[0.2em] uppercase">
                      {fr ? 'pays' : 'countries'}
                    </span>
                  </span>
                  <span className="text-white/25 font-body text-[10px]">
                    {fr ? 'analyses disponibles' : 'analyses available'}
                  </span>
                </div>
              </div>

              {/* Right accent bar (desktop only) */}
              <div className="absolute right-0 top-6 bottom-6 w-px bg-[#7D1A2E]/30 hidden lg:block" />
            </div>

          </div>
        </Link>
      </div>
    </section>
  );
}
