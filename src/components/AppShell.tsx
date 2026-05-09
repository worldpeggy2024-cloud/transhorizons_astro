/*
 * TransHorizons — App Shell (React island for Astro)
 * Theme: Light (ivory/charcoal/gold palette)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages-react/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages-react/Home";
import PortfolioGeopolitics from '@/pages-react/2026-03_Canada-Multipolar_Essay';
import PortfolioResources from '@/pages-react/2026-02_Critical-Minerals_Essay';
import PortfolioTechnology from '@/pages-react/2026-01_AI-Governance_Essay';
import NotesCareerEvolution from '@/pages-react/2026-03_Career-Evolution_Note';
import NotesTravelObservation from '@/pages-react/2026-04_Travel-Observation_Note';
import CountryPage from '@/pages-react/CountryPage';
import WorldAnalysis from '@/pages-react/WorldAnalysis';
import CriticalMineralsMap from '@/pages-react/CriticalMineralsMap';
import NotesCanadaResources from '@/pages-react/2026-04_Canada-Resource-Wealth_Essay';
import PortfolioResourceCivilization from '@/pages-react/2026-04_Resource-Civilization_Essay';
import PortfolioCanadaForestCarbon from '@/pages-react/2026-04_Canada-Forest-Carbon_Essay';
import PortfolioForestSystemPressure from '@/pages-react/2026-04_Canada-Forest-System_Essay';
import AnalysesIndex from '@/pages-react/AnalysesIndex';
import NotesIndex from '@/pages-react/NotesIndex';
import Publications from '@/pages-react/Publications';
import ResearchApproach from '@/pages-react/ResearchApproach';
import { HistoricalRiskDemo } from '@/pages-react/HistoricalRiskDemo';
import { LayeredMapDemo } from '@/pages-react/LayeredMapDemo';
import GlobalRiskCascadeDemo from '@/pages-react/GlobalRiskCascadeDemo';
import RiskCorrelations from '@/pages-react/RiskCorrelations';

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/portfolio/geopolitics"} component={PortfolioGeopolitics} />
      <Route path={"/portfolio/resources"} component={PortfolioResources} />
      <Route path={"/portfolio/technology"} component={PortfolioTechnology} />
      <Route path={"/notes/career-evolution"} component={NotesCareerEvolution} />
      <Route path={"/notes/travel-observation"} component={NotesTravelObservation} />
      <Route path={"/notes/canada-resources"} component={NotesCanadaResources} />
      <Route path={"/notes"} component={NotesIndex} />
      <Route path="/country/:cca3" component={CountryPage} />
      <Route path="/world-analysis/:cca3" component={CountryPage} />
      <Route path="/world-analysis" component={WorldAnalysis} />
      <Route path="/tools/critical-minerals-map" component={CriticalMineralsMap} />
      <Route path="/portfolio/canada-resources" component={NotesCanadaResources} />
      <Route path="/portfolio/resource-civilization" component={PortfolioResourceCivilization} />
      <Route path="/portfolio/canada-forest-carbon" component={PortfolioCanadaForestCarbon} />
      <Route path="/portfolio/canada-forest-system-climate-industrial-pressure" component={PortfolioForestSystemPressure} />
      <Route path="/analyses" component={AnalysesIndex} />
      <Route path="/publications" component={Publications} />
      <Route path="/research-approach" component={ResearchApproach} />
      <Route path="/historical-risk-demo" component={HistoricalRiskDemo} />
      <Route path="/layered-map-demo" component={LayeredMapDemo} />
      <Route path="/global-risk-cascade" component={GlobalRiskCascadeDemo} />
      <Route path="/risk-correlations" component={RiskCorrelations} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
