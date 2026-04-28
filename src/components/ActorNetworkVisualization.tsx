/*
 * Actor Network Visualization Component
 * Interactive force-directed graph showing relationships and influence flows
 * between domestic and external actors
 * Design: Editorial Horizon — clean visualization with burgundy accents
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { ActorEntry } from '@/data/france';

interface ActorNode {
  id: string;
  name: string;
  type: 'domestic' | 'external';
  interests: string;
  dealability: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface ActorLink {
  source: string;
  target: string;
  influence: 'high' | 'medium' | 'low';
  direction: 'bidirectional' | 'one-way';
  label: string;
}

interface ActorNetworkProps {
  domesticActors: ActorEntry[];
  externalActors: ActorEntry[];
  countryCode: string;
  language: 'en' | 'fr';
}

// Define relationships between actors (influence flows)
const getActorRelationships = (countryCode: string): ActorLink[] => {
  // Ireland-specific relationships
  if (countryCode === 'IRL') {
    return [
      // Domestic relationships
      { source: 'Micheál Martin (Fianna Fáil, Taoiseach)', target: 'Simon Harris (Fine Gael, Minister for Finance, future Taoiseach)', influence: 'high', direction: 'bidirectional', label: 'Coalition partners' },
      { source: 'Micheál Martin (Fianna Fáil, Taoiseach)', target: 'Mary Lou McDonald (Sinn Féin, Opposition Leader)', influence: 'medium', direction: 'one-way', label: 'Political opposition' },
      { source: 'Simon Harris (Fine Gael, Minister for Finance, future Taoiseach)', target: 'Tech Sector & Multinationals (Apple, Google, Meta, Microsoft)', influence: 'high', direction: 'bidirectional', label: 'Policy influence' },
      { source: 'Mary Lou McDonald (Sinn Féin, Opposition Leader)', target: 'Trade Unions & Labor Movement', influence: 'high', direction: 'bidirectional', label: 'Electoral base' },
      { source: 'Tech Sector & Multinationals (Apple, Google, Meta, Microsoft)', target: 'Trade Unions & Labor Movement', influence: 'medium', direction: 'one-way', label: 'Employment tension' },

      // External relationships
      { source: 'Micheál Martin (Fianna Fáil, Taoiseach)', target: 'European Union', influence: 'high', direction: 'bidirectional', label: 'EU Presidency' },
      { source: 'Simon Harris (Fine Gael, Minister for Finance, future Taoiseach)', target: 'United States', influence: 'high', direction: 'bidirectional', label: 'Tech investment' },
      { source: 'Tech Sector & Multinationals (Apple, Google, Meta, Microsoft)', target: 'United States', influence: 'high', direction: 'bidirectional', label: 'Ownership/HQ' },
      { source: 'Tech Sector & Multinationals (Apple, Google, Meta, Microsoft)', target: 'European Union', influence: 'high', direction: 'bidirectional', label: 'Regulation' },
      { source: 'European Union', target: 'United Kingdom', influence: 'medium', direction: 'bidirectional', label: 'Trade/Brexit' },
      { source: 'Micheál Martin (Fianna Fáil, Taoiseach)', target: 'United Kingdom', influence: 'medium', direction: 'bidirectional', label: 'Northern Ireland' },
      { source: 'European Union', target: 'Russia', influence: 'low', direction: 'one-way', label: 'Sanctions/Ukraine' },
    ];
  }
  return [];
};

export function ActorNetworkVisualization({
  domesticActors,
  externalActors,
  countryCode,
  language,
}: ActorNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);

  // Build node and link data
  const { nodes, links } = useMemo<{ nodes: ActorNode[]; links: ActorLink[] }>(() => {
    const allActors = [...domesticActors, ...externalActors];
    const nodeList: ActorNode[] = allActors.map((actor, idx) => ({
      id: actor.name,
      name: actor.name,
      type: idx < domesticActors.length ? 'domestic' : 'external',
      interests: actor.interests,
      dealability: actor.dealability,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      vx: 0,
      vy: 0,
    }));

    const relationships = getActorRelationships(countryCode);
    const linkList: ActorLink[] = relationships.filter(
      (link) =>
        nodeList.some((n) => n.id === link.source) &&
        nodeList.some((n) => n.id === link.target)
    );

    return { nodes: nodeList, links: linkList };
  }, [domesticActors, externalActors, countryCode]);

  // Force simulation
  useEffect(() => {
    if (!isExpanded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Initialize positions if needed
    nodes.forEach((node) => {
      if (!node.x) node.x = Math.random() * width - width / 2;
      if (!node.y) node.y = Math.random() * height - height / 2;
      if (!node.vx) node.vx = 0;
      if (!node.vy) node.vy = 0;
    });

    const simulate = () => {
      // Apply forces
      const strength = 0.1;
      const distance = 150;

      // Repulsive forces (nodes push apart)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x! - nodes[i].x!;
          const dy = nodes[j].y! - nodes[i].y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (strength * 100) / (dist * dist);

          nodes[i].vx! -= (force * dx) / dist;
          nodes[i].vy! -= (force * dy) / dist;
          nodes[j].vx! += (force * dx) / dist;
          nodes[j].vy! += (force * dy) / dist;
        }
      }

      // Attractive forces (linked nodes pull together)
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (!source || !target) return;

        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (strength * (dist - distance)) / dist;

        source.vx! += (force * dx) / dist;
        source.vy! += (force * dy) / dist;
        target.vx! -= (force * dx) / dist;
        target.vy! -= (force * dy) / dist;
      });

      // Apply velocity and damping
      nodes.forEach((node) => {
        node.vx! *= 0.95;
        node.vy! *= 0.95;
        node.x! += node.vx!;
        node.y! += node.vy!;

        // Boundary conditions
        const padding = 50;
        if (node.x! < -width / 2 + padding) node.x = -width / 2 + padding;
        if (node.x! > width / 2 - padding) node.x = width / 2 - padding;
        if (node.y! < -height / 2 + padding) node.y = -height / 2 + padding;
        if (node.y! > height / 2 - padding) node.y = height / 2 - padding;
      });

      // Render
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Draw links
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (!source || !target || source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) return;

        const isHovered = hoveredLink === `${link.source}-${link.target}`;
        const isSelected =
          selectedActor === link.source || selectedActor === link.target;

        ctx.strokeStyle = isHovered || isSelected ? '#7D1A2E' : '#D4C5B9';
        ctx.lineWidth = isHovered || isSelected ? 2.5 : 1.5;
        ctx.globalAlpha = isHovered || isSelected ? 1 : 0.5;

        ctx.beginPath();
        ctx.moveTo(source.x!, source.y!);
        ctx.lineTo(target.x!, target.y!);
        ctx.stroke();

        // Draw arrowhead for one-way links
        if (link.direction === 'one-way') {
          const dx = target.x! - source.x!;
          const dy = target.y! - source.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          const arrowSize = 8;
          const arrowX = target.x! - (arrowSize * dx) / dist;
          const arrowY = target.y! - (arrowSize * dy) / dist;

          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
            arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
            arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      });

      // Draw nodes
      nodes.forEach((node) => {
        if (node.x === undefined || node.y === undefined) return;
        const isSelected = selectedActor === node.id;
        const radius = isSelected ? 12 : 8;

        // Node circle
        ctx.fillStyle =
          node.type === 'domestic' ? '#7D1A2E' : '#D4A574';
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Selection ring
        if (isSelected) {
          ctx.strokeStyle = '#7D1A2E';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      ctx.restore();

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [isExpanded, nodes, links, selectedActor, hoveredLink]);

  const labels = {
    en: {
      title: 'Actor Network Visualization',
      subtitle: 'Interactive map showing relationships and influence flows',
      legend: 'Legend',
      domestic: 'Domestic Actors',
      external: 'External Actors',
      bidirectional: 'Bidirectional influence',
      oneway: 'One-way influence',
      high: 'High influence',
      medium: 'Medium influence',
      low: 'Low influence',
      click: 'Click an actor to highlight connections',
    },
    fr: {
      title: 'Visualisation du réseau d\'acteurs',
      subtitle: 'Carte interactive montrant les relations et les flux d\'influence',
      legend: 'Légende',
      domestic: 'Acteurs nationaux',
      external: 'Acteurs externes',
      bidirectional: 'Influence bidirectionnelle',
      oneway: 'Influence unidirectionnelle',
      high: 'Influence élevée',
      medium: 'Influence moyenne',
      low: 'Influence faible',
      click: 'Cliquez sur un acteur pour mettre en évidence les connexions',
    },
  };

  const t = labels[language];

  return (
    <div
      ref={containerRef}
      className="border border-[#E8E4DC] rounded-sm bg-white overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E4DC]"
      >
        <div className="text-left">
          <h4 className="font-body text-sm font-medium text-[#4A4A4A]">
            {t.title}
          </h4>
          <p className="font-body text-xs text-[#8A8A8A] mt-0.5">{t.subtitle}</p>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-[#7D1A2E]" />
        ) : (
          <ChevronDown size={16} className="text-[#7D1A2E]" />
        )}
      </button>

      {/* Canvas and Legend */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full border border-[#E8E4DC] rounded-sm bg-[#FAFAF8] cursor-pointer"
            onMouseMove={(e) => {
              if (!canvasRef.current) return;
              const rect = canvasRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;

              // Check hover over links
              let hoveredLinkId: string | null = null;
              links.forEach((link) => {
                const source = nodes.find((n) => n.id === link.source);
                const target = nodes.find((n) => n.id === link.target);
                if (!source || !target) return;

                const dx = target.x! - source.x!;
                const dy = target.y! - source.y!;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const t = Math.max(
                  0,
                  Math.min(
                    1,
                    ((x - source.x!) * dx + (y - source.y!) * dy) / (dist * dist)
                  )
                );

                const closestX = source.x! + t * dx;
                const closestY = source.y! + t * dy;
                const distance = Math.sqrt(
                  (x - closestX) ** 2 + (y - closestY) ** 2
                );

                if (distance < 10) {
                  hoveredLinkId = `${link.source}-${link.target}`;
                }
              });

              setHoveredLink(hoveredLinkId);
            }}
            onClick={(e) => {
              if (!canvasRef.current) return;
              const rect = canvasRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;

              // Check click on nodes
              for (const node of nodes) {
                const dist = Math.sqrt(
                  (x - node.x!) ** 2 + (y - node.y!) ** 2
                );
                if (dist < 15) {
                  setSelectedActor(
                    selectedActor === node.id ? null : node.id
                  );
                  return;
                }
              }

              setSelectedActor(null);
            }}
          />

          {/* Info text */}
          <div className="flex items-start gap-2 p-3 bg-[#FAFAF8] rounded-sm border border-[#E8E4DC]">
            <Info size={14} className="text-[#7D1A2E] flex-shrink-0 mt-0.5" />
            <p className="font-body text-xs text-[#4A4A4A]">{t.click}</p>
          </div>

          {/* Legend */}
          <div className="border-t border-[#E8E4DC] pt-4">
            <h5 className="font-body text-xs text-[#7D1A2E] uppercase tracking-widest mb-3">
              {t.legend}
            </h5>
            <div className="grid grid-cols-2 gap-4 text-xs font-body text-[#4A4A4A]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7D1A2E]" />
                <span>{t.domestic}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D4A574]" />
                <span>{t.external}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-[#7D1A2E]" />
                <span>{t.bidirectional}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-[#7D1A2E] opacity-60" />
                <span>{t.oneway}</span>
              </div>
            </div>
          </div>

          {/* Selected actor details */}
          {selectedActor && (
            <div className="border-t border-[#E8E4DC] pt-4">
              {(() => {
                const actor = [...domesticActors, ...externalActors].find(
                  (a) => a.name === selectedActor
                );
                if (!actor) return null;

                const relatedLinks = links.filter(
                  (l) => l.source === selectedActor || l.target === selectedActor
                );

                return (
                  <div className="space-y-3">
                    <h5 className="font-body text-sm font-medium text-[#4A4A4A]">
                      {selectedActor}
                    </h5>
                    <div className="space-y-2 text-xs font-body text-[#4A4A4A]">
                      <div>
                        <span className="text-[#7D1A2E] font-medium">
                          {language === 'fr' ? 'Négociabilité: ' : 'Dealability: '}
                        </span>
                        {actor.dealability}
                      </div>
                      {relatedLinks.length > 0 && (
                        <div>
                          <span className="text-[#7D1A2E] font-medium">
                            {language === 'fr'
                              ? 'Connexions: '
                              : 'Connections: '}
                          </span>
                          <div className="mt-1 space-y-1">
                            {relatedLinks.map((link) => (
                              <div key={`${link.source}-${link.target}`}>
                                <span className="text-[#8A8A8A]">
                                  {link.source === selectedActor
                                    ? '→'
                                    : '←'}{' '}
                                  {link.source === selectedActor
                                    ? link.target
                                    : link.source}
                                </span>
                                <span className="text-[#8A8A8A] ml-2">
                                  ({link.label})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
