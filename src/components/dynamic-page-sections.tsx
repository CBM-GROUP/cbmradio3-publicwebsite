"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { pageSectionService } from "@/services/page-section.service";
import type { PageSection } from "@/types/hero";

interface Props {
  page: "home" | "about" | "programs" | "episodes" | "news" | "gallery" | "contact";
  position?: "hero" | "top" | "middle" | "bottom";
  className?: string;
}

export default function DynamicPageSections({ page, position, className = "" }: Props) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    pageSectionService
      .getSectionsForPage(page, position)
      .then((data) => {
        if (isMounted) {
          // Sort by order ascending
          const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setSections(sorted);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, position]);

  if (loading || sections.length === 0) return null;

  return (
    <div className={`space-y-16 ${className}`}>
      {sections.map((section, index) => {
        const image = section.image || section.external_image_url;
        const isExternalCta = section.cta_url?.startsWith("http");
        const isEven = index % 2 === 0;

        if (section.position === "hero") {
          return (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800/80 p-8 md:p-16 my-8 max-w-7xl mx-auto shadow-2xl"
            >
              {image && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={image}
                    alt={section.title}
                    fill
                    unoptimized
                    className="object-cover opacity-25"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/60" />
                </div>
              )}
              <div className="relative z-10 max-w-2xl space-y-4">
                {section.subtitle && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" />
                    <span>{section.subtitle}</span>
                  </div>
                )}
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  {section.title}
                </h2>
                {section.body && (
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {section.body}
                  </p>
                )}
                {section.cta_label && section.cta_url && (
                  <div className="pt-2">
                    {isExternalCta ? (
                      <a
                        href={section.cta_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm transition-all hover:bg-emerald-400 hover:scale-105 shadow-lg shadow-emerald-500/20"
                      >
                        <span>{section.cta_label}</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        href={section.cta_url}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm transition-all hover:bg-emerald-400 hover:scale-105 shadow-lg shadow-emerald-500/20"
                      >
                        <span>{section.cta_label}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          );
        }

        // Standard Block Section (Top, Middle, Bottom)
        return (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-6 py-12"
          >
            <div
              className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-14 ${
                !image ? "max-w-3xl mx-auto text-center" : ""
              }`}
            >
              {/* Content Column */}
              <div
                className={`${
                  image
                    ? isEven
                      ? "lg:col-span-7 lg:order-1"
                      : "lg:col-span-7 lg:order-2"
                    : "lg:col-span-12"
                } space-y-4`}
              >
                {section.subtitle && (
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400">
                    {section.subtitle}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  {section.title}
                </h2>
                {section.body && (
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>
                )}
                {section.cta_label && section.cta_url && (
                  <div className="pt-2">
                    {isExternalCta ? (
                      <a
                        href={section.cta_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs sm:text-sm hover:bg-emerald-500 hover:text-slate-950 transition-all"
                      >
                        <span>{section.cta_label}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <Link
                        href={section.cta_url}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs sm:text-sm hover:bg-emerald-500 hover:text-slate-950 transition-all"
                      >
                        <span>{section.cta_label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Artwork / Media Column */}
              {image && (
                <div
                  className={`${
                    isEven
                      ? "lg:col-span-5 lg:order-2"
                      : "lg:col-span-5 lg:order-1"
                  }`}
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl group">
                    <Image
                      src={image}
                      alt={section.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
