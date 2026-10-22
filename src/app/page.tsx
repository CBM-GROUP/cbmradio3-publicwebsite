import HeroSection from "../components/hero-section";
import ProgramsSection from "../components/programs-section";
import Header from "../components/header";
import NewsSection from "@/components/news-section";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";
import TeamMembers from "@/components/team-members";
import EpisodesSection from "@/components/episodes-section";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProgramsSection />
        <NewsSection />
        <EpisodesSection />
        <TeamMembers limit={6} />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
