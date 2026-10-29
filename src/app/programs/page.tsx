import Header from "@/components/header";
import Footer from "@/components/footer";
import ProgramsListing from "@/components/programs-listing";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import { Suspense } from "react";

function ProgramsLoadingState() {
  return (
    <div className="min-h-[50vh] bg-black pt-32 text-center text-sm font-black uppercase tracking-wider text-white">
      Loading programs...
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
        <PageHero
          pageKey="programs"
          fallbackTitle="Find your frequency"
          fallbackSubtitle="CBM Original Shows"
          fallbackDescription="Meet the voices, ideas, and conversations shaping your day on CBM Radio."
          fallbackImage="/cbm_images/on-air-studio.png"
          fallbackCtaLabel="Explore the shows"
          fallbackCtaUrl="#programs-content"
          fallbackOverlayPosition="center"
        />
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
