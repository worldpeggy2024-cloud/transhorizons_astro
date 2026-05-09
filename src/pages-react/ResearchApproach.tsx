import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Zap, Map, CheckCircle2, AlertCircle, BookOpen, Layers, Target, Settings } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import rawData from "../../content/pages/research-approach.yaml";

const d = rawData as Record<string, any>;

const content = {
  en: {
    pageTitle: d.en.pageTitle,
    backLabel: d.en.backLabel,
    sections: {
      method: d.en.method,
      framework: {
        scope: d.en.scope,
        sources: d.en.sources,
        process: d.en.process,
      },
      mapping: d.en.mapping,
      traceability: d.en.traceability,
      tools: d.en.tools,
      principles: d.en.principles,
      limits: d.en.limits,
      referencing: d.en.referencing,
      position: d.en.position,
    },
  },
  fr: {
    pageTitle: d.fr.pageTitle,
    backLabel: d.fr.backLabel,
    sections: {
      method: d.fr.method,
      framework: {
        scope: d.fr.scope,
        sources: d.fr.sources,
        process: d.fr.process,
      },
      mapping: d.fr.mapping,
      traceability: d.fr.traceability,
      tools: d.fr.tools,
      principles: d.fr.principles,
      limits: d.fr.limits,
      referencing: d.fr.referencing,
      position: d.fr.position,
    },
  },
};

export default function ResearchApproach() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const c = language === 'fr' ? content.fr : content.en;
  const s = c.sections;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-body text-[11px] tracking-widest uppercase transition-colors"
            aria-label={language === 'fr' ? 'Accueil' : 'Home'}
          >
            <ArrowLeft size={12} />
            {language === 'fr' ? 'Accueil' : 'Home'}
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{c.pageTitle}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Section */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-slate-600" />
                {s.method.heading}
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                <span className="font-semibold text-slate-900">{s.method.label}</span>
              </p>
              {s.method.body.split('\n\n').map((p: string, i: number) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4">{p}</p>
              ))}
            </div>
          </section>

          {/* Analytical Scope */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                {s.framework.scope.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.framework.scope.intro}</p>
              <ul className="space-y-4 ml-6">
                {s.framework.scope.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-slate-700 font-bold mt-0.5">•</span>
                    <span>
                      <strong className="text-slate-900">{item.title}</strong>
                      <br />
                      <span className="text-amber-700">{item.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">{s.framework.scope.closing}</p>
            </div>
          </section>

          {/* Sources Monitored */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                {s.framework.sources.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.framework.sources.intro}</p>
              <ul className="space-y-2 ml-6">
                {s.framework.sources.items.split('\n').filter((l: string) => l.trim()).map((item: string, idx: number) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">{s.framework.sources.closing}</p>
            </div>
          </section>

          {/* Analytical Principles */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-600" />
                {s.principles.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.principles.intro}</p>
              <div className="grid gap-4">
                {s.principles.items.map((principle: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-1">{principle.title}</h4>
                    <p className="text-slate-700 text-sm">{principle.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mapping Methodology */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-600" />
                {s.mapping.heading}
              </h2>
              {s.mapping.body.split('\n\n').map((p: string, i: number) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4">{p}</p>
              ))}
              <ul className="space-y-2 ml-6 mb-4">
                {s.mapping.items.split('\n').filter((l: string) => l.trim()).map((item: string, idx: number) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed">{s.mapping.closing}</p>
            </div>
          </section>

          {/* Update Rhythm */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                {s.framework.process.heading}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">{s.framework.process.intro}</p>
              <ul className="space-y-2 ml-6">
                {s.framework.process.items.map((item: any, idx: number) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>
                      {typeof item === 'string' ? item : (<><strong>{item.bold}</strong>{item.rest}</>)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">{s.framework.process.closing}</p>
            </div>
          </section>

          {/* Limits & Uncertainty */}
          <section className="mb-16">
            <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                {s.limits.heading}
              </h2>
              {s.limits.body.split('\n\n').map((p: string, i: number) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4">{p}</p>
              ))}
              <ul className="space-y-2 ml-6 mb-4">
                {s.limits.items.split('\n').filter((l: string) => l.trim()).map((item: string, idx: number) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed font-medium">{s.limits.closing}</p>
            </div>
          </section>

          {/* Use of Analytical Tools */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                {s.tools.heading}
              </h2>
              {s.tools.intro.split('\n\n').map((p: string, i: number) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4">{p}</p>
              ))}
              <ul className="space-y-2 ml-6 mb-6">
                {s.tools.usedItems.split('\n').filter((l: string) => l.trim()).map((item: string, idx: number) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-slate-400 font-bold mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">{s.tools.p3}</p>
              <ul className="space-y-2 ml-6 mb-6">
                {s.tools.howeverItems.split('\n').filter((l: string) => l.trim()).map((item: string, idx: number) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-slate-400 font-bold mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {s.tools.outro.split('\n\n').map((p: string, i: number) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4">{p}</p>
              ))}
            </div>
          </section>

          {/* Position */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-sm p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">{s.position.heading}</h2>
              {s.position.body.split('\n\n').map((p: string, i: number) => (
                <p key={i} className="text-slate-100 leading-relaxed mb-4">{p}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
