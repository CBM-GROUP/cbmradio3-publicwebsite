"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Flame,
  Headphones,
  Newspaper,
  Radio,
} from "lucide-react";

import homeService from "@/services/home.service";
import { programService } from "@/services/program.service";
import { chartService } from "@/services/chart.service";
import type { ArticleSummary } from "@/types/news";
import type { EpisodeSummary, ProgramSummary } from "@/types/program";
import type { Chart } from "@/types/chart";

interface WireItem {
  id: string;
  kind: "article" | "program" | "episode" | "chart" | "station";
  label?: string;
  text: string;
  href: string;
  highlight?: boolean;
}

const FALLBACK_WIRE_ITEMS: WireItem[] = [
  {
    id: "fallback-drops",
    kind: "episode",
    text: "HOT PODCAST DROPS",
    href: "/episodes",
    highlight: true,
  },
  {
    id: "fallback-series",
    kind: "program",
    text: "ORIGINAL EAST AFRICAN TALK & AUDIO SERIES",
    href: "/programs",
    highlight: false,
  },
  {
    id: "fallback-stream",
    kind: "station",
    text: "STREAM ON DEMAND",
    href: "/episodes",
    highlight: true,
  },
  {
    id: "fallback-network",
    kind: "station",
    text: "CBM RADIO MEDIA NETWORK",
    href: "/about",
    highlight: false,
  },
  {
    id: "fallback-pillars",
    kind: "station",
    text: "FAITH · CULTURE · CONVERSATIONS · VOICES",
    href: "/programs",
    highlight: false,
  },
];

let cachedWireData: {
  articles: ArticleSummary[];
  programs: ProgramSummary[];
  episodes: EpisodeSummary[];
  charts: Chart[];
} | null = null;

let pendingWirePromise: Promise<{
  articles: ArticleSummary[];
  programs: ProgramSummary[];
  episodes: EpisodeSummary[];
  charts: Chart[];
}> | null = null;

function fetchLiveWireData() {
  if (cachedWireData) {
    return Promise.resolve(cachedWireData);
  }
  if (pendingWirePromise) {
    return pendingWirePromise;
  }

  pendingWirePromise = Promise.allSettled([
    homeService.getLatestArticles(),
    homeService.getFeaturedArticles(),
    homeService.getFeaturedPrograms(),
    programService.getPrograms({ page: 1 }),
    homeService.getLatestEpisodes(),
    homeService.getFeaturedEpisodes(),
    chartService.getCharts(),
  ]).then(
    ([
      latestArticlesRes,
      featuredArticlesRes,
      featuredProgramsRes,
      allProgramsRes,
      latestEpisodesRes,
      featuredEpisodesRes,
      chartsRes,
    ]) => {
      const latestArticles =
        latestArticlesRes.status === "fulfilled" && Array.isArray(latestArticlesRes.value)
          ? latestArticlesRes.value
          : [];
      const featuredArticles =
        featuredArticlesRes.status === "fulfilled" && Array.isArray(featuredArticlesRes.value)
          ? featuredArticlesRes.value
          : [];
      const articles = [
        ...featuredArticles,
        ...latestArticles.filter((a) => !featuredArticles.some((f) => f.id === a.id)),
      ].slice(0, 5);

      const featuredPrograms =
        featuredProgramsRes.status === "fulfilled" && Array.isArray(featuredProgramsRes.value)
          ? featuredProgramsRes.value
          : [];
      const allPrograms =
        allProgramsRes.status === "fulfilled" && Array.isArray(allProgramsRes.value?.results)
          ? allProgramsRes.value.results
          : [];
      const programs = [
        ...featuredPrograms,
        ...allPrograms.filter((p) => !featuredPrograms.some((f) => f.id === p.id)),
      ]
        .filter((p) => p.is_active !== false)
        .slice(0, 5);

      const latestEpisodes =
        latestEpisodesRes.status === "fulfilled" && Array.isArray(latestEpisodesRes.value)
          ? latestEpisodesRes.value
          : [];
      const featuredEpisodes =
        featuredEpisodesRes.status === "fulfilled" && Array.isArray(featuredEpisodesRes.value)
          ? featuredEpisodesRes.value
          : [];
      const episodes = [
        ...featuredEpisodes,
        ...latestEpisodes.filter((e) => !featuredEpisodes.some((f) => f.id === e.id)),
      ]
        .filter((e) => e.is_active !== false)
        .slice(0, 5);

      const charts =
        chartsRes.status === "fulfilled" && Array.isArray(chartsRes.value)
          ? chartsRes.value.filter((c) => c.is_active !== false).slice(0, 4)
          : [];

      const result = { articles, programs, episodes, charts };
      cachedWireData = result;
      pendingWirePromise = null;
      return result;
    },
  );

  return pendingWirePromise;
}

export default function LiveWireMarquee({ className = "" }: { className?: string }) {
  const [data, setData] = useState(cachedWireData);

  useEffect(() => {
    let isMounted = true;
    fetchLiveWireData().then((res) => {
      if (isMounted) setData(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const wireItems: WireItem[] = useMemo(() => {
    if (!data) return FALLBACK_WIRE_ITEMS;

    const articleItems: WireItem[] = data.articles.map((article) => ({
      id: `article-${article.id}`,
      kind: "article",
      label: article.category?.name || "NEWS",
      text: article.title,
      href: `/news/${article.slug}`,
      highlight: false,
    }));

    const programItems: WireItem[] = data.programs.map((program) => ({
      id: `program-${program.id}`,
      kind: "program",
      label: "SHOW",
      text: program.presenter ? `${program.title} • ${program.presenter}` : program.title,
      href: "/programs",
      highlight: true,
    }));

    const episodeItems: WireItem[] = data.episodes.map((episode) => ({
      id: `episode-${episode.id}`,
      kind: "episode",
      label: "EPISODE",
      text: episode.program_title
        ? `${episode.title} (${episode.program_title})`
        : episode.title,
      href: `/episodes/${episode.slug}`,
      highlight: false,
    }));

    const chartItems: WireItem[] = data.charts.map((chart) => ({
      id: `chart-${chart.id}`,
      kind: "chart",
      label: "CHART",
      text: chart.title,
      href: "/charts",
      highlight: true,
    }));

    const maxLen = Math.max(
      articleItems.length,
      programItems.length,
      episodeItems.length,
      chartItems.length,
    );

    if (maxLen === 0) {
      return FALLBACK_WIRE_ITEMS;
    }

    const interleaved: WireItem[] = [];
    for (let i = 0; i < maxLen; i++) {
      if (episodeItems[i]) interleaved.push(episodeItems[i]);
      if (articleItems[i]) interleaved.push(articleItems[i]);
      if (programItems[i]) interleaved.push(programItems[i]);
      if (chartItems[i]) interleaved.push(chartItems[i]);
    }

    // Ensure at least 6 items so the marquee fills ultrawide screens smoothly
    if (interleaved.length < 5) {
      return [...interleaved, ...FALLBACK_WIRE_ITEMS];
    }

    return interleaved;
  }, [data]);

  const durationSeconds = Math.max(30, wireItems.length * 5);

  const renderIcon = (item: WireItem) => {
    switch (item.kind) {
      case "episode":
        return <Flame size={13} className="fill-[#04b093] text-[#04b093] shrink-0" />;
      case "article":
        return <Newspaper size={13} className="text-[#04b093] shrink-0" />;
      case "program":
        return <Radio size={13} className="text-[#04b093] shrink-0" />;
      case "chart":
        return <BarChart3 size={13} className="text-[#04b093] shrink-0" />;
      default:
        return item.highlight ? (
          <Headphones size={13} className="text-[#04b093] shrink-0" />
        ) : null;
    }
  };

  return (
    <div
      className={`relative z-20 w-full border-b-2 border-[#04b093] bg-black py-2.5 overflow-hidden text-white ${className}`}
      aria-label="CBM Live Content Wire"
    >
      <div
        className="animate-marquee flex items-center gap-8 whitespace-nowrap text-[0.68rem] font-black uppercase tracking-[0.25em]"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[0, 1].map((pass) =>
          wireItems.map((item, idx) => {
            const isHighlighted = item.highlight ?? idx % 2 === 0;
            return (
              <div
                key={`${pass}-${item.id}-${idx}`}
                className="inline-flex items-center gap-8"
              >
                <Link
                  href={item.href}
                  className={`group inline-flex items-center gap-2 transition-colors hover:text-[#04b093] ${
                    isHighlighted ? "text-[#04b093]" : "text-white"
                  }`}
                >
                  {renderIcon(item)}
                  {item.label && (
                    <span className="text-[#04b093] font-black">
                      {item.label}:
                    </span>
                  )}
                  <span className="group-hover:underline underline-offset-4">
                    {item.text}
                  </span>
                </Link>
                <span className="text-white/30 select-none" aria-hidden="true">
                  •
                </span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

