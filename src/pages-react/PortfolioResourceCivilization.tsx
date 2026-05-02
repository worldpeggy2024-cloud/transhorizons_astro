/*
 * TransHorizons — Portfolio: Canada as a Resource Civilization
 * Content loaded from bilingual YAML — edit at /keystatic
 */

import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import data from '../../content/articles/resource-civilization.yaml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = data as Record<string, any>;

export default function PortfolioResourceCivilization() {
  const { language } = useLanguage();
  const L = language === 'fr' ? 'fr' : 'en';
  const surfaceBeige = '#EFE6D8';
  const visualHeadingStyle: React.CSSProperties = {
    color: '#999999',
    fontSize: '1.05rem',
    letterSpacing: '0.02em',
    lineHeight: 1.2,
  };

  const mapLabel = L === 'fr' ? 'Aperçu du système' : 'System overview';
  const diagramLabel = L === 'fr' ? 'Le système peut être abstrait comme suit :' : 'The system can be abstracted as follows:';
  const historicalPhasesLabel = L === 'fr' ? 'Phases historiques' : 'Historical Phases';
  const mapCaption = L === 'fr'
    ? "Le système de ressources du Canada : extraction, transport et exportation organisés autour de la demande externe."
    : "Canada's resource system: extraction, transport, and export organized around external demand.";

  const timelinePhases = [
    {
      cls: 'phase-1',
      nodeColor: '#5c7864',
      iconColor: '#5c7864',
      titleColor: '#1a1a1a',
      textColor: '#4f5560',
      exportColor: '#5e6673',
      title: L === 'fr' ? 'Systèmes autochtones' : 'Indigenous Resource Systems',
      desc: L === 'fr' ? 'Intendance localisée' : 'Localized stewardship & use',
      export: '',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 26, height: 26, strokeWidth: 1.2 }}>
          <circle cx="12" cy="12" r="7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 8c1.4-1.2 4.6-1.2 6 0M15 16c-1.4 1.2-4.6 1.2-6 0" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 19h14" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      cls: 'phase-2',
      nodeColor: '#4b5563',
      iconColor: '#6b7280',
      titleColor: '#1a1a1a',
      textColor: '#4f5560',
      exportColor: '#5e6673',
      title: L === 'fr' ? 'Fourrures & pêcheries' : 'Fur & Fisheries',
      desc: L === 'fr' ? 'Commerce colonial' : 'Colonial trade systems',
      export: '→ Europe',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 26, height: 26, strokeWidth: 1.2 }}>
          <path d="M4 9h12" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 6l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 15H8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 12l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      cls: 'phase-3',
      nodeColor: '#4b5563',
      iconColor: '#4b5563',
      titleColor: '#1a1a1a',
      textColor: '#4f5560',
      exportColor: '#5e6673',
      title: L === 'fr' ? 'Bois & agriculture' : 'Timber & Agriculture',
      desc: L === 'fr' ? 'Expansion territoriale' : 'Territorial expansion',
      export: L === 'fr' ? '→ Bretagne / Europe' : '→ Britain / Europe',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 26, height: 26, strokeWidth: 1.2 }}>
          <rect x="4" y="5" width="6" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="14" y="13" width="6" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 8h2M12 7v2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 16h-2M12 15v2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 10l4 4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      cls: 'phase-4',
      nodeColor: '#4b5563',
      iconColor: '#374151',
      titleColor: '#1a1a1a',
      textColor: '#4f5560',
      exportColor: '#5e6673',
      title: L === 'fr' ? 'Minerais industriels' : 'Industrial Minerals',
      desc: L === 'fr' ? 'Intrants industriels' : 'Industrial inputs',
      export: L === 'fr' ? '→ États-Unis / Europe' : '→ United States / Europe',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 26, height: 26, strokeWidth: 1.2 }}>
          <rect x="5" y="4" width="14" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="5" y="10" width="14" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="5" y="16" width="14" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8v8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      cls: 'phase-5',
      nodeColor: '#4b5563',
      iconColor: '#1f2937',
      titleColor: '#1a1a1a',
      textColor: '#4f5560',
      exportColor: '#5e6673',
      title: L === 'fr' ? 'Pétrole & gaz' : 'Oil & Gas',
      desc: L === 'fr' ? 'Intégration énergétique' : 'Energy system integration',
      export: L === 'fr' ? '→ États-Unis (dominant)' : '→ United States (dominant)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 26, height: 26, strokeWidth: 1.2 }}>
          <path d="M3 8h8v8H3z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 12h7" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="19" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 8v8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      cls: 'phase-6',
      nodeColor: '#4b5563',
      iconColor: '#111827',
      titleColor: '#1a1a1a',
      textColor: '#4f5560',
      exportColor: '#5e6673',
      title: L === 'fr' ? 'Minéraux critiques' : 'Critical Minerals',
      desc: L === 'fr' ? 'Systèmes de transition' : 'Energy transition systems',
      export: L === 'fr' ? '→ É.-U. / alliés' : '→ U.S. / allies',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 26, height: 26, strokeWidth: 1.2 }}>
          <circle cx="6" cy="7" r="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="18" cy="7" r="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 8.5l2.8 6.2M16 8.5l-2.8 6.2M8 7h8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  const historicalTimeline = (
    <section className="mt-10 mb-2">
      <h3 className="font-body font-medium mb-4" style={visualHeadingStyle}>{historicalPhasesLabel}</h3>
      <div className="overflow-x-auto rounded-lg" style={{ backgroundColor: surfaceBeige }}>
      <div style={{ minWidth: 680, position: 'relative', paddingTop: 80, paddingBottom: 56 }}>
        {/* connector line — spans phases 2–6 */}
        <div style={{
          position: 'absolute',
          top: 80,
          left: `calc(${(1/6)*100}% + 3px)`,
          right: `calc(${(1/6)*100}% - 3px)`,
          height: 1,
          backgroundColor: '#9ca3af',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {timelinePhases.map((p, i) => (
            <div key={i} style={{ width: `${100/6}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
              {/* icon */}
              <div style={{ position: 'absolute', top: -52, color: p.iconColor }}>
                {p.icon}
              </div>
              {/* node */}
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: p.nodeColor, marginBottom: 20, flexShrink: 0 }} />
              {/* content */}
              <div style={{ paddingLeft: 4, paddingRight: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 5, color: p.titleColor, lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ fontSize: 10, color: p.textColor, marginBottom: 3, lineHeight: 1.4 }}>{p.desc}</div>
                <div style={{ fontSize: 10, color: p.exportColor, fontWeight: 500 }}>{p.export}</div>
              </div>
            </div>
          ))}
        </div>

        {/* bottom label */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: `${(1/6)*100}%`,
          right: 0,
          textAlign: 'center',
          fontSize: 11,
          letterSpacing: '0.2em',
          color: '#4b5563',
          fontWeight: 700,
          textTransform: 'uppercase',
          paddingTop: 18,
          borderTop: '1px solid #b8bfc8',
        }}>
          {L === 'fr' ? 'Extraction\u2003→\u2003Transport\u2003→\u2003Exportation' : 'Extraction\u2003→\u2003Transport\u2003→\u2003Export'}
        </div>
      </div>
      </div>
    </section>
  );

  const beforeSectionsContent = (
    <>
      {/* Map: System Overview */}
      <section className="mb-10">
        <p className="font-body font-medium mb-4" style={visualHeadingStyle}>{mapLabel}</p>
        <div
          style={{
            width: '100vw',
            marginLeft: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: surfaceBeige,
          }}
        >
          <figure style={{ backgroundColor: surfaceBeige }}>
            <img
              src="/images/canada_resource_civilization_map.png"
              alt={mapCaption}
              className="w-full"
            />
            <figcaption className="text-sm text-[#666] font-body mt-3 italic px-6 md:px-10 pb-4">
              {mapCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Diagram: full-bleed */}
      <div className="mb-20">
        <p className="font-body font-medium mb-4" style={visualHeadingStyle}>{diagramLabel}</p>
        <div
          style={{
            width: '100vw',
            marginLeft: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: surfaceBeige,
          }}
        >
          <div style={{ width: '90vw', margin: '0 auto' }}>
            <img
              src="/images/canada_resource_civilization_diagram.png"
              alt="Canada as a Resource Civilization — Export-oriented resource system model"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );

  const sections = (d.sections ?? []).map((s: Record<string, string>) => ({
    title: s[`title_${L}`] ?? s.title_en ?? '',
    content: s[`content_${L}`] ?? s.content_en ?? '',
    image: s.image,
    imagePosition: s.imagePosition,
  }));

  const keyTakeaways = (d.keyTakeaways ?? []).map((k: Record<string, string>) => ({
    title: k[`title_${L}`] ?? k.title_en ?? '',
    description: k[`description_${L}`] ?? k.description_en ?? '',
  }));

  const relatedProjects = (d.relatedProjects ?? []).map((r: Record<string, string>) => ({
    id: r.id,
    title: r[`title_${L}`] ?? r.title_en ?? '',
    category: r[`category_${L}`] ?? r.category_en ?? '',
  }));

  return (
    <ProjectDetailLayout
      title={d[`title_${L}`] ?? ''}
      subtitle={d[`subtitle_${L}`] ?? ''}
      heroImage={d.heroImage ?? ''}
      category={d[`category_${L}`] ?? ''}
      date={d.date ?? ''}
      readTime={d.readTime ?? ''}
      articleType={d[`articleType_${L}`]}
      introductionTitle={d[`introductionTitle_${L}`]}
      introduction={d[`introduction_${L}`] ?? ''}
      sections={sections}
      keyTakeaways={keyTakeaways}
      relatedProjects={relatedProjects}
      beforeSectionsContent={beforeSectionsContent}
      sectionExtras={{ 0: historicalTimeline }}
    />
  );
}
