import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import ChartsListing from "@/components/charts-listing";

function ChartsLoadingState() {
  return (
    <div className="min-h-[70vh] bg-[#04b093] pt-32 text-center text-black font-bold">
      Loading music charts...
    </div>
  );
}

export const metadata = {
  title: "Music Charts | CBM Radio",
  description:
    "Official Music Charts & Countdowns — discover trending tracks, weekly countdowns, and listener favorites across Africa and worldwide.",
};

export default function ChartsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#04b093] text-black">
        <PageHero
          pageKey="charts"
          fallbackTitle="Music Charts"
          fallbackDescription="Official Music Charts & Countdowns — discover trending tracks, weekly countdowns, and listener favorites across Africa and worldwide."
        />
        <DynamicPageSections page="charts" position="top" />
        <Suspense fallback={<ChartsLoadingState />}>
          <ChartsListing />
        </Suspense>
        <DynamicPageSections page="charts" position="middle" />
        <DynamicPageSections page="charts" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
