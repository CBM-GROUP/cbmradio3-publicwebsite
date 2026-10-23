import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import ChartsListing from "@/components/charts-listing";

function ChartsLoadingState() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 text-center text-zinc-400">
      Loading music charts...
    </div>
  );
}

export const metadata = {
  title: "Music Charts | CBM Radio",
  description:
    "Official Gospel Music Charts & Countdowns — discover the biggest praise, worship, and gospel songs across Africa and worldwide.",
};

export default function ChartsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950">
        <PageHero
          pageKey="charts"
          fallbackTitle="Music Charts"
          fallbackSubtitle="Official Gospel Countdown"
          fallbackDescription="Discover the biggest gospel hits, listener requests, and weekly chart toppers across Africa and the world."
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
