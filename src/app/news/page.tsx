import Header from "@/components/header";
import Footer from "@/components/footer";
import NewsSection from "@/components/news-section";

export default function NewsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
