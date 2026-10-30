import Header from "@/components/header";
import Footer from "@/components/footer";
import ProgramsListing from "@/components/programs-listing";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import TrendingCircularCarousel from "@/components/trending-circular-carousel";
import { Suspense } from "react";

function ProgramsLoadingState() {
  return (
    <div className="min-h-[50vh] bg-[#04b093] pt-32 text-center text-sm font-black uppercase tracking-wider text-black">
      Loading programs...
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#04b093] pb-24 text-black">
        {/* Top Hero Card with the Evening Drive background image */}
        <PageHero
          pageKey="programs"
          fallbackTitle="Original Programs & Shows"
          fallbackSubtitle="CBM Broadcast Schedule"
          fallbackDescription="Meet the voices, ideas, and conversations shaping your day on CBM Radio."
          fallbackImage="/cbm_images/evening-drive.jpg"
          fallbackCtaLabel="Explore the shows"
          fallbackCtaUrl="#programs-content"
          fallbackOverlayPosition="center"
        />

        {/* 3D Circular Revolving Carousel: Sports, Music & News with Auto-Rotation */}
        <TrendingCircularCarousel />

        <DynamicPageSections page="programs" position="top" />
        <Suspense fallback={<ProgramsLoadingState />}>
          <ProgramsListing />
        </Suspense>
        <DynamicPageSections page="programs" position="middle" />
        <DynamicPageSections page="programs" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
