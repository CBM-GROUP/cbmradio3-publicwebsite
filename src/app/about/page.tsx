import Header from "@/components/header";
import Footer from "@/components/footer";

const highlights = [
  {
    title: "Trusted Content",
    description: "We deliver news, music and community stories that listeners can rely on every day.",
  },
  {
    title: "Live Connection",
    description: "Our programs bring people together through conversation, entertainment and local updates.",
  },
  {
    title: "Community Focus",
    description: "CBM Radio is built around the people, voices and stories that shape our communities.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-6 py-24 text-white sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
            About
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            About CBM Radio
          </h1>
          <p className="mt-6 text-lg leading-8 text-bg-zinc-400">
            CBM Radio is committed to serving listeners with clear information,
            uplifting entertainment and meaningful community programming.
            We believe radio should inform, inspire and connect people in
            every moment of the day.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-xl font-semibold text-emerald-400">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
