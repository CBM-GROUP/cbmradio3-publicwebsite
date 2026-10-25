"use client";

import { ArrowUpRight, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { chartService } from "@/services/chart.service";
import type { Chart, ChartEntry } from "@/types/chart";
import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";
import Logo from "../../public/cbmradio.png";

type LoadState = "loading" | "ready" | "error";

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
  const artwork = chart?.cover_image_url || chart?.cover_image || FeaturedShow;

  return (
    <section id="charts" className="border-y border-white/10 bg-[#090d0c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">
            CBM music charts
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            The songs setting the pace.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Find the sounds listeners are loving, discover new artists, and
            follow the latest chart countdown.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/charts"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#48d4c1] px-6 text-sm font-extrabold text-[#062521] transition-colors hover:bg-[#6ae3d1]"
            >
              Explore the charts <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link
              href="#live-radio"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-bold text-white transition-colors hover:border-[#48d4c1] hover:text-[#48d4c1]"
            >
              Tune in live
            </Link>
          </div>

          <div className="relative mt-9 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-[#111816]">
            <Image
              src={artwork}
              alt={chart?.title ? `${chart.title} cover artwork` : "CBM Radio show artwork"}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              unoptimized={typeof artwork === "string"}
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-5 pt-16">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#48d4c1]">
                <Music2 size={15} aria-hidden="true" />
                {chart?.title || "Music, stories, and community"}
              </p>
              {chart?.edition_date && (
                <p className="mt-2 text-sm text-white/75">{chart.edition_date}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111816] p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                The latest
              </p>
              <h3 className="mt-2 text-2xl font-black">Chart spotlight</h3>
            </div>
            {chart && (
              <span className="rounded-full border border-[#48d4c1]/25 bg-[#48d4c1]/10 px-3 py-1 text-xs font-bold text-[#48d4c1]">
                {chart.chart_type}
              </span>
            )}
          </div>

          {status === "loading" && (
            <p className="py-8 text-sm text-white/65" aria-live="polite">
              Loading the latest chart...
            </p>
          )}
          {status === "error" && (
            <p className="py-8 text-sm text-white/65">
              The latest chart is temporarily unavailable.
            </p>
          )}
          {status === "ready" && !chart && (
            <p className="py-8 text-sm text-white/65">
              New chart picks are on the way. Explore all CBM charts for more.
            </p>
          )}
          {status === "ready" && chart && entries.length === 0 && (
            <p className="py-8 text-sm text-white/65">
              Track details are coming soon. Visit the charts page to see the latest.
            </p>
          )}
          {entries.length > 0 && (
            <ol className="divide-y divide-white/10">
              {entries.map((entry) => (
                <ChartSpotlightEntry key={entry.id} entry={entry} />
              ))}
            </ol>
          )}
          <Link
            href="/charts"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#48d4c1] transition-colors hover:text-white"
          >
            See the full countdown <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ChartSpotlightEntry({ entry }: { entry: ChartEntry }) {
  const image = entry.cover_image_url || entry.cover_image;

  return (
    <li className="flex items-center gap-4 py-4 first:pt-5 last:pb-0">
      <span className="w-8 shrink-0 text-2xl font-black tabular-nums text-[#48d4c1]">
        {String(entry.rank).padStart(2, "0")}
      </span>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-black/30">
        <Image
          src={image || Logo}
          alt={image ? `${entry.title} cover` : "CBM Radio"}
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
