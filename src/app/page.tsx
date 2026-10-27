import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import EpisodesSection from "@/components/episodes-section";
import ProgramsSection from "@/components/programs-section";
import NewsSection from "@/components/news-section";
import Gallery from "@/components/gallery";
import HomepageAdditions from "@/components/homepage-additions";
import Footer from "@/components/footer";
import DynamicPageSections from "@/components/dynamic-page-sections";
import FloatingPlayerDock from "@/components/media/floating-player-dock";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[#08090a]">
        {/* Dynamic Hero Placement */}
        <DynamicPageSections page="home" position="hero" />

        {/* 01 // Master Editorial Cover Deck with Live Switcher & Player Stage */}
        <HeroSection />

        {/* Dynamic Top Placement */}
        <DynamicPageSections page="home" position="top" />

        {/* 02 // Episode Archive Crate (On-Demand Filterable Crate) */}
        <EpisodesSection />

        {/* 03 // Original Shows & Series Roster */}
        <ProgramsSection />

        {/* 04 // Newsroom Dispatches & Journal */}
        <NewsSection />

        {/* 05 // Studio Darkroom Visual Archive */}
        <Gallery />

        {/* Dynamic Middle Placement */}
        <DynamicPageSections page="home" position="middle" />

        {/* 06 // Community WhatsApp & Studio Partnerships Hub */}
        <HomepageAdditions />

        {/* Dynamic Bottom Placement */}
        <DynamicPageSections page="home" position="bottom" />
      </main>

      {/* Interactive Global Bottom Player Dock */}
      <FloatingPlayerDock />

      <Footer />
    </>
  );
}
