import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

const articles = {
  "community-health-campaign": {
    title: "CBM Radio Launches Community Health Campaign",
    category: "Community",
    date: "July 10, 2026",
    content:
      "CBM Radio has launched a community health campaign to promote healthy living through informative programs and outreach activities. The initiative is designed to equip listeners with practical health guidance, encourage regular checkups, and connect local health workers with the communities they serve.",
  },
  "exclusive-interview-local-entrepreneurs": {
    title: "Exclusive Interview with Local Entrepreneurs",
    category: "Business",
    date: "July 8, 2026",
    content:
      "This week's interview features successful local entrepreneurs sharing their inspiring business journeys and advice. Listeners will hear how these founders overcame challenges, built strong networks, and created opportunities for growth in their communities.",
  },
  "new-digital-studio-operational": {
    title: "New Digital Studio Now Operational",
    category: "Technology",
    date: "July 5, 2026",
    content:
      "Our newly upgraded digital broadcasting studio is now fully operational, delivering clearer sound and better production quality. This upgrade improves the station's ability to serve listeners with smoother live programming, stronger audio quality, and more polished broadcasts.",
  },
};

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug as keyof typeof articles];

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-950 px-6 py-24 text-white">
          <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <h1 className="text-3xl font-bold">Article not found</h1>
            <p className="mt-4 text-gray-400">The requested news article could not be found.</p>
            <Link href="/news" className="mt-6 inline-block text-emerald-500 hover:text-emerald-400">
              Back to news
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-6 py-24 text-white sm:px-8 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
            {article.category}
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{article.title}</h1>
          <p className="mt-4 text-sm text-gray-400">Published on {article.date}</p>
          <p className="mt-8 text-lg leading-8 text-gray-300">{article.content}</p>
          <Link href="/news" className="mt-8 inline-block text-emerald-500 hover:text-emerald-400">
            ← Back to all news
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
