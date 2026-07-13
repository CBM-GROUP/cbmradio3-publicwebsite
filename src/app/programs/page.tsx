import Header from "@/components/header";
import Footer from "@/components/footer";
import ProgramsSection from "@/components/programs-section";

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProgramsSection />
      </main>
      <Footer />
    </>
  );
}
