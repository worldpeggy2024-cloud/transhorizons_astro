/*
 * TransHorizons — Home Page (Clean Version)
 * Design: Editorial Horizon — Single-page scrollable layout
 * Sections: Hero → Portfolio → About → Blog → Contact → Footer
 * 
 * REMOVED: Life in Motion / Worlds Observed module (travel map, stats, photos)
 */

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import GlobeTeaser from '../components/GlobeTeaser';
import PortfolioSection from '../components/PortfolioSection';
import FeaturedAnalysisSection from '../components/FeaturedAnalysisSection';
import ResearchApproachSection from '../components/ResearchApproachSection';
import AboutSection from '../components/AboutSection';
import NotesSection from '../components/NotesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <Navbar />
      <main>
        <HeroSection />
        <GlobeTeaser />
        <FeaturedAnalysisSection />
        <PortfolioSection />
        <ResearchApproachSection />
        <AboutSection />
        <NotesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
