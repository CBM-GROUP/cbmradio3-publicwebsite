import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden bg-[#090807]"
    >
      <div className="absolute inset-0">
        <Image
          src={FeaturedShow}
          alt="CBM Radio presenters and audience"
          fill
          priority
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.92)_0%,rgba(9,8,7,0.8)_28%,rgba(9,8,7,0.35)_60%,rgba(9,8,7,0.62)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[72vh] max-w-[1800px] items-center px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-[720px]">
          <p className="mb-6 inline-flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.32em] text-[#e8bc69] sm:text-xs lg:text-sm">
            <span aria-hidden="true" className="h-px w-10 bg-[#d4a54a] sm:w-12" />
            The sound of our community
          </p>

          <h1
            id="home-heading"
            className="text-[3rem] font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-[4.5rem] md:text-[6rem] lg:text-[7.2rem]"
          >
            Stories made to stay with you.
          </h1>

          <p className="mt-7 max-w-[640px] text-base leading-7 text-[#f0e9df] sm:text-xl lg:text-[1.7rem] lg:leading-[1.5]">
            Films, documentaries and conversations shaped for the people who make
            our community what it is.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/episodes"
              className="inline-flex min-h-[3.4rem] items-center gap-3 rounded-full bg-[#d4a54a] px-7 text-base font-bold text-[#090807] transition hover:bg-[#e8bc69] sm:min-h-[3.8rem] sm:text-lg"
            >
              <Play size={18} fill="currentColor" aria-hidden="true" />
              Hear the latest
            </Link>
            <Link
              href="/programs"
              className="inline-flex min-h-[3.4rem] items-center gap-2 rounded-full border border-[#f7f2ea]/35 bg-transparent px-7 text-base font-semibold text-white transition hover:border-[#e8bc69] hover:text-[#e8bc69] sm:min-h-[3.8rem] sm:text-lg"
            >
              Explore our shows
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
