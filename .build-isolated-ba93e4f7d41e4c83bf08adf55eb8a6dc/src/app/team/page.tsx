import Header from "@/components/header";
import Footer from "@/components/footer";
import TeamMembers from "@/components/team-members";

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <TeamMembers />
      </main>
      <Footer />
    </>
  );
}
