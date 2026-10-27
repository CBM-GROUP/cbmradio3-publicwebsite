import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import HomepageCharts from "@/components/homepage-charts";
import ProgramsSection from "@/components/programs-section";
import NewsSection from "@/components/news-section";
import EpisodesSection from "@/components/episodes-section";
import Gallery from "@/components/gallery";
import TeamMembers from "@/components/team-members";
import HomepageAdditions from "@/components/homepage-additions";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import DynamicPageSections from "@/components/dynamic-page-sections";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[#060a08]">
        <DynamicPageSections page="home" position="hero" />
        
        {/* 1. Cinematic Keynote Hero with Live Frequency Marquee */}
        <HeroSection />

        {/* 2. Official Music Countdown & Ranked Leaderboard */}
        <HomepageCharts />

        {/* 3. Broadcast Lineup & Interactive Schedule */}
        <ProgramsSection />

        {/* 4. Newsroom Dispatches & Community Stories */}
        <NewsSection />

        {/* 5. On-Demand Podcast Episodes & Audio Series */}
        <EpisodesSection />

        {/* 6. Studio Moments & Behind-the-Scenes Gallery */}
        <Gallery />

        {/* Dynamic Top Sections */}
        <DynamicPageSections page="home" position="top" />

        {/* 7. On-Air Talent & Station Voices */}
        <TeamMembers limit={6} />

        <DynamicPageSections page="home" position="middle" />

        {/* 8. Community Hub, WhatsApp Hotline & Station Partners */}
        <HomepageAdditions />
        
        <DynamicPageSections page="home" position="bottom" />
        
        {/* 9. Broadcast Headquarters & Studio Inquiries */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
