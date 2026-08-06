import Header from "@/components/header";
import Footer from "@/components/footer";
import NewsListing from "@/components/news-listing";
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
          <NewsListing />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
