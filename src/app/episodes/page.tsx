import { Suspense } from "react";

import EpisodeBrowser from "@/components/episodes/episode-browser";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";

export default function EpisodesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950">
        <PageHero
          pageKey="episodes"
          fallbackTitle="Episodes"
          fallbackDescription="Explore the latest conversations, teachings, interviews, and programmes from CBM Radio."
        />
        <DynamicPageSections page="episodes" position="top" />
        <Suspense fallback={<p className="min-h-96 bg-zinc-950 pt-16 text-center text-zinc-400">Loading episodes...</p>}>
          <EpisodeBrowser />
        </Suspense>
        <DynamicPageSections page="episodes" position="middle" />
        <DynamicPageSections page="episodes" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
