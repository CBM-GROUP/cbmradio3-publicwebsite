import Header from "@/components/header";
import Footer from "@/components/footer";
import NewsListing from "@/components/news-listing";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import { Suspense } from "react";

function NewsLoadingState() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-[#04b093] text-sm font-black uppercase tracking-wider text-black">
      Loading news...
    </div>
  );
}

export default function NewsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#04b093] text-black">
        <PageHero
          pageKey="news"
          fallbackTitle="News"
          fallbackDescription="Read CBM Radio news, stories, and community updates."
        />
        <DynamicPageSections page="news" position="top" />
        <Suspense fallback={<NewsLoadingState />}>
          <NewsListing />
        </Suspense>
        <DynamicPageSections page="news" position="middle" />
        <DynamicPageSections page="news" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
