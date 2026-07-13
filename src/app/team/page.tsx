import Header from "@/components/header";
import Footer from "@/components/footer";
import TeamSection from "@/components/team-section";

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
