import HeroSection from "../components/hero-section";
import TeamSection from "../components/team-section";
import ProgramsSection from "../components/programs-section";
import Header from "../components/header";
import NewsSection from "@/components/news-section";

export default function Home() {
  return (
    <>
      
      <Header />
      <HeroSection />
      <TeamSection />
      <ProgramsSection />
      <NewsSection />
    </>
  );
}