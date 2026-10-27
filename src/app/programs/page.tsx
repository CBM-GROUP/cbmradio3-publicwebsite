import Header from "@/components/header";
import Footer from "@/components/footer";
import ProgramsListing from "@/components/programs-listing";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
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
      <main className="min-h-screen bg-[#04b093] text-black">
        <PageHero
          pageKey="programs"
          fallbackTitle="Programs"
          fallbackDescription="Explore CBM Radio programs, presenters, and broadcast schedules."
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
