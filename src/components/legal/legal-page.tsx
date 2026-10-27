import Link from "next/link";

import Footer from "@/components/footer";
import Header from "@/components/header";
import type { LegalDocument } from "@/types/legal";

export default function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#04b093] px-4 pb-20 pt-32 text-black sm:px-6">
        <article className="mx-auto max-w-4xl rounded-2xl border-2 border-black bg-black p-6 sm:p-10 text-white shadow-2xl">
          <header className="border-b border-zinc-800 pb-8">
            <span className="inline-block rounded-full bg-[#04b093] px-4 py-1 text-xs font-black uppercase tracking-wider text-black">
              Legal
            </span>
            <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">{document.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-300 font-medium">{document.introduction}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-400"><span className="text-[#04b093]">Effective date:</span> {document.effectiveDate}</p>
          </header>
          <nav aria-label={document.title + " sections"} className="my-10 rounded-xl border-2 border-zinc-800 bg-zinc-900/80 p-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#04b093]">On this page</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {document.sections.map((section) => <li key={section.id}><a href={"#" + section.id} className="text-xs font-bold uppercase tracking-wider text-zinc-300 underline-offset-4 hover:text-[#04b093] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04b093]">{section.title}</a></li>)}
            </ul>
          </nav>
          <div className="space-y-12">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">{section.title}</h2>
                {section.paragraphs && <div className="mt-4 space-y-4 leading-relaxed text-zinc-300">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
                {section.items && <ul className="mt-4 ml-6 list-disc space-y-2 leading-relaxed text-zinc-300 marker:text-[#04b093]">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.contactReference && <p className="mt-4 leading-relaxed text-zinc-300">{section.contactReference}{" "}<Link href="/contact" className="font-bold text-[#04b093] underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04b093]">Contact page</Link>.</p>}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
