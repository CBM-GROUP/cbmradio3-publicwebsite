import Header from "@/components/header";
import Footer from "@/components/footer";
import ProgramsListing from "@/components/programs-listing";
import { Suspense } from "react";

function ProgramsLoadingState() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 text-center text-zinc-400">
      Loading programs...
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<ProgramsLoadingState />}>
          <ProgramsListing />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
