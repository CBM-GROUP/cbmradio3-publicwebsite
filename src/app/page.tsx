import HeroSection from "../components/hero-section";
import TeamSection from "../components/team-section";
import ProgramsSection from "../components/programs-section";
import Header from "../components/header";
import NewsSection from "@/components/news-section";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <HeroSection />
      </div>
      <TeamSection />
      <ProgramsSection />
      <NewsSection />
      <Gallery />
      <Contact/>
      <Footer />
    </>
  );
}