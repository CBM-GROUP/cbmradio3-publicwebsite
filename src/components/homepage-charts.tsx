"use client";

import { ArrowUpRight, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { chartService } from "@/services/chart.service";
import type { Chart, ChartEntry } from "@/types/chart";
import RadioShowArtwork from "../../public/cbm_images/radio 2.jpeg";
import CBMTeamArtwork from "../../public/cbm_images/take 3.jpeg";

type LoadState = "loading" | "ready" | "error";

const chartArtwork = [RadioShowArtwork, CBMTeamArtwork];

export default function HomepageCharts() {
  const [chart, setChart] = useState<Chart | null>(null);
  const [status, setStatus] = useState<LoadState>("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadChart() {
      try {
        const charts = await chartService.getCharts();
        const featured = charts.find((item) => item.is_active) ?? charts[0];
        const details = featured
          ? await chartService.getChartBySlug(featured.slug)
          : null;

        if (!isMounted) return;
        setChart(details ?? featured ?? null);
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load homepage chart:", error);
        if (isMounted) setStatus("error");
      }
    }

    void loadChart();
    return () => {
      isMounted = false;
    };
  }, []);

  const entries = chart?.entries
    ?.filter((entry) => entry.rank > 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3) ?? [];
  const artwork = chart?.cover_image_url || chart?.cover_image || RadioShowArtwork;
  const chartCategories = ["Top charts", "Gospel", "Afrobeats", "Local sounds"];

  return (
    <section id="charts" className="border-y border-white/10 bg-[#101311] text-white">
      <div className="border-b border-white/10 bg-white px-5 text-[#090d0c] sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5">
          <Link href="/charts" className="text-2xl font-black tracking-[-0.08em] sm:text-3xl">
            CBM<span className="text-[#00d4a5]">CHARTS</span>
          </Link>
          <nav aria-label="Chart links" className="flex items-center gap-5 text-xs font-extrabold sm:gap-9 sm:text-sm">
            <Link href="/charts" className="hover:text-[#00d4a5]">Charts</Link>
            <Link href="/programs" className="hover:text-[#00d4a5]">Music</Link>
            <Link href="/episodes" className="hover:text-[#00d4a5]">Shows</Link>
            <Link href="/news" className="hidden hover:text-[#00d4a5] sm:inline">News</Link>
          </nav>
          <Link href="/charts" className="hidden text-[0.65rem] font-black uppercase tracking-[0.15em] text-[#111] sm:inline">
            Explore <ArrowUpRight className="ml-1 inline" size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="border-b border-white/10 bg-black px-5 sm:px-8 lg:px-12">
        <nav aria-label="Music chart categories" className="mx-auto flex max-w-7xl gap-7 overflow-x-auto whitespace-nowrap py-4 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/75 sm:gap-12">
          {chartCategories.map((category, index) => (
            <Link key={category} href="/charts" className={index === 0 ? "text-[#00d4a5]" : "transition hover:text-[#00d4a5]"}>
              {category}
            </Link>
          ))}
          {chart?.chart_type && <Link href="/charts" className="transition hover:text-[#00d4a5]">{chart.chart_type}</Link>}
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-14">
        <aside className="cbm-card rounded-lg border border-white/10 bg-black p-5">
          <p className="mb-4 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#00d4a5]">Explore charts</p>
          <div className="space-y-1">
            {chartCategories.map((category, index) => (
              <Link key={category} href="/charts" className={"flex min-h-11 items-center justify-between border-b border-white/10 text-sm font-bold transition hover:text-[#00d4a5] " + (index === 0 ? "text-white" : "text-white/65")}>
                {category}<span aria-hidden="true" className="text-white/35">›</span>
              </Link>
            ))}
          </div>
          <Link href="/charts" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#00d4a5]/60 text-xs font-extrabold text-[#00d4a5] transition hover:bg-[#00d4a5] hover:text-black">
            Browse all charts
          </Link>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#00d4a5]">Your soundtrack, ranked</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">The CBM Countdown</h2>
            </div>
            {chart?.edition_date && <p className="text-xs font-bold uppercase tracking-wider text-white/50">{chart.edition_date}</p>}
          </div>

          <div className="cbm-card relative isolate overflow-hidden border-[5px] border-[#00d4a5] bg-[#00d4a5] p-1.5 sm:border-[9px] sm:p-2">
            <div className="relative min-h-[18rem] overflow-hidden rounded-xl sm:min-h-[25rem]">
              <Image
                src={CBMTeamArtwork}
                alt="The CBM Radio team together"
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover object-[center_30%] transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/25" />
              <div className="absolute left-4 top-4 max-w-[15rem] sm:left-8 sm:top-8 sm:max-w-sm">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#78f2d5] sm:text-xs">
                  Your world. Your frequency.
                </p>
                <h3 className="mt-2 text-2xl font-black leading-tight text-white drop-shadow-lg sm:text-4xl">
                  The voices moving the culture.
                </h3>
              </div>
              <div className="absolute bottom-4 right-4 h-28 w-24 overflow-hidden border-4 border-white shadow-2xl sm:bottom-7 sm:right-7 sm:h-48 sm:w-40 sm:border-[6px]">
                <Image
                  src={artwork}
                  alt={chart?.title ? `${chart.title} chart artwork` : "My Life My Purpose show with CBM presenters"}
                  fill
                  sizes="160px"
                  unoptimized={typeof artwork === "string"}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg bg-[#00d4a5] px-3 py-2 text-lg font-black tracking-[-0.07em] text-black shadow-lg sm:bottom-7 sm:left-7 sm:px-5 sm:py-3 sm:text-4xl">
                CBM <span className="font-light tracking-tight text-white">MUSIC</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5" aria-label="Explore CBM music">
            {[
              { title: "The voices", detail: "Meet our presenters", image: CBMTeamArtwork },
              { title: "On the air", detail: "Discover the shows", image: RadioShowArtwork },
              { title: "In the mix", detail: "Find your next sound", image: CBMTeamArtwork },
            ].map((tile, index) => (
              <Link
                key={tile.title}
                href={index === 0 ? "/team" : index === 1 ? "/programs" : "/charts"}
                className="cbm-card group relative min-h-32 overflow-hidden border border-white/10 bg-black sm:min-h-44"
              >
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 30vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-center sm:p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-white sm:text-base">{tile.title}</p>
                  <p className="mt-1 hidden text-[0.65rem] text-white/70 sm:block">{tile.detail}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="cbm-card rounded-lg border border-white/10 bg-[#171b19] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-[#00d4a5]">
                    <Music2 size={14} aria-hidden="true" /> This week
                  </p>
                  <h3 className="mt-2 text-xl font-black">{chart?.title || "Top tracks"}</h3>
                </div>
                {chart && <span className="text-xs font-bold text-white/50">{chart.chart_type}</span>}
              </div>
              {status === "loading" && <p className="py-6 text-sm text-white/65" aria-live="polite">Loading the latest chart...</p>}
              {status === "error" && <p className="py-6 text-sm text-white/65">The latest chart is temporarily unavailable.</p>}
              {status === "ready" && entries.length > 0 && (
                <ol className="divide-y divide-white/10">
                  {entries.map((entry, index) => <ChartSpotlightEntry key={entry.id} entry={entry} index={index} />)}
                </ol>
              )}
              {status === "ready" && entries.length === 0 && (
                <p className="py-6 text-sm text-white/65">{chart ? "Track details are coming soon." : "New chart picks are on the way."}</p>
              )}
              <Link href="/charts" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#00d4a5] transition-colors hover:text-white">
                See the full countdown <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <Link href="/charts" className="cbm-card group relative min-h-64 overflow-hidden rounded-lg border border-white/10 bg-black">
              <Image src={RadioShowArtwork} alt="My Life My Purpose show with CBM Radio presenters" fill sizes="(max-width: 1024px) 100vw, 250px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00d4a5]">Discover your next favorite</p>
                <p className="mt-2 text-xl font-black">New voices. Fresh sounds.</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold">Explore charts <ArrowUpRight size={16} aria-hidden="true" /></span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartSpotlightEntry({ entry, index }: { entry: ChartEntry; index: number }) {
  const image = entry.cover_image_url || entry.cover_image;

  return (
    <li className="flex items-center gap-4 py-4 first:pt-5 last:pb-0">
      <span className="w-8 shrink-0 text-2xl font-black tabular-nums text-[#48d4c1]">
        {String(entry.rank).padStart(2, "0")}
      </span>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-black/30">
        <Image
          src={image || chartArtwork[index % chartArtwork.length]}
          alt={image ? `${entry.title} cover` : "CBM Radio chart presenter"}
          fill
          sizes="64px"
          unoptimized={Boolean(image)}
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h4 className="truncate font-bold text-white">{entry.title}</h4>
        <p className="mt-1 truncate text-sm text-white/65">
          {entry.artist}
          {entry.featured_artists ? ` feat. ${entry.featured_artists}` : ""}
        </p>
      </div>
    </li>
  );
}
