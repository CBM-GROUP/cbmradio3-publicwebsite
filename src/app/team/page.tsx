import Header from "@/components/header";
import Footer from "@/components/footer";
import TeamMembers from "@/components/team-members";

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#04b093] pt-20 text-black">
        <TeamMembers />
      </main>
      <Footer />
    </>
  );
}
