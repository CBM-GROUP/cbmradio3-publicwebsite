import HeroSection from "../components/hero-section";
import ProgramsSection from "../components/programs-section";
import Header from "../components/header";
import NewsSection from "@/components/news-section";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";
import TeamMembers from "@/components/team-members";
import EpisodesSection from "@/components/episodes-section";
import DynamicPageSections from "@/components/dynamic-page-sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <DynamicPageSections page="home" position="hero" />
        <HeroSection />
        <DynamicPageSections page="home" position="top" />
        <ProgramsSection />
        <NewsSection />
        <EpisodesSection />
        <DynamicPageSections page="home" position="middle" />
        <TeamMembers limit={6} />
        <Gallery />
        <DynamicPageSections page="home" position="bottom" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
