import Header from "@/components/header";
import Footer from "@/components/footer";
import ProgramsListing from "@/components/programs-listing";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import { Suspense } from "react";

function ProgramsLoadingState() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 text-center text-zinc-400">
      Loading programs...
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950">
        <PageHero
          pageKey="programs"
          fallbackTitle="Programs"
          fallbackDescription="Explore CBM Radio programs, presenters, and broadcast schedules."
        />
        <DynamicPageSections page="programs" position="top" />
        <Suspense fallback={<ProgramsLoadingState />}>
          <ProgramsListing />
        </Suspense>
        <DynamicPageSections page="programs" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
