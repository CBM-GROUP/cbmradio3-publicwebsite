import Link from "next/link";

import Footer from "@/components/footer";
import Header from "@/components/header";
import type { LegalDocument } from "@/types/legal";

export default function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-4 pb-20 pt-32 text-zinc-300 sm:px-6">
        <article className="mx-auto max-w-3xl">
          <header className="border-b border-zinc-800 pb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-500">Legal</p>
            <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">{document.title}</h1>
            <p className="mt-5 text-lg leading-8">{document.introduction}</p>
            <p className="mt-5 text-sm text-zinc-400"><span className="font-semibold text-zinc-200">Effective date:</span> {document.effectiveDate}</p>
          </header>
          <nav aria-label={document.title + " sections"} className="my-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-bold text-white">On this page</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {document.sections.map((section) => <li key={section.id}><a href={"#" + section.id} className="rounded text-teal-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">{section.title}</a></li>)}
            </ul>
          </nav>
          <div className="space-y-12">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">{section.title}</h2>
                {section.paragraphs && <div className="mt-5 space-y-5 leading-8">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
                {section.items && <ul className="mt-5 ml-6 list-disc space-y-3 leading-8 marker:text-teal-500">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.contactReference && <p className="mt-5 leading-8">{section.contactReference}{" "}<Link href="/contact" className="rounded font-semibold text-teal-400 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">Contact page</Link>.</p>}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
