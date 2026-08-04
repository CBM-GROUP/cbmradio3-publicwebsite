import Header from "@/components/header";
import Footer from "@/components/footer";
import NewsSection from "@/components/news-section";
import { Suspense } from "react";

function NewsLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center text-zinc-400">
      Loading news...
    </div>
  );
}

export default function NewsPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<NewsLoadingState />}>
          <NewsSection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}