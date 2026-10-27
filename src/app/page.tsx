import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import EpisodesSection from "@/components/episodes-section";
import ProgramsSection from "@/components/programs-section";
import NewsSection from "@/components/news-section";
import Gallery from "@/components/gallery";
import HomepageAdditions from "@/components/homepage-additions";
import Footer from "@/components/footer";
import DynamicPageSections from "@/components/dynamic-page-sections";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[#060a08]">
        {/* Dynamic Hero Placement */}
        <DynamicPageSections page="home" position="hero" />

        {/* 1. Cinematic On-Demand Media Hero with Spotlight Episode Preview */}
        <HeroSection />

        {/* Dynamic Top Sections */}
        <DynamicPageSections page="home" position="top" />

        {/* 2. On-Demand Podcast Episodes & Audio Series (Dashboard Releases) */}
        <EpisodesSection />

        {/* 3. Original Shows & Series Lineup */}
        <ProgramsSection />

        {/* 4. Newsroom Dispatches & Community Stories */}
        <NewsSection />

        {/* 5. Studio Moments & Behind-the-Scenes Gallery */}
        <Gallery />

        {/* Dynamic Middle Sections */}
        <DynamicPageSections page="home" position="middle" />

        {/* 6. Community Hub, WhatsApp Network & Brand Partnerships */}
        <HomepageAdditions />

        {/* Dynamic Bottom Sections */}
        <DynamicPageSections page="home" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
