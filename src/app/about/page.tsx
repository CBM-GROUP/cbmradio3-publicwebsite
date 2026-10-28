"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

import Footer from "@/components/footer";
import Header from "@/components/header";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import { pageSectionService } from "@/services/page-section.service";
import type { PageSection } from "@/types/hero";
import Take3 from "../../../public/cbm_images/take 3.jpeg";

const staticSections = {
  about: {
    title: "Who We Are",
    body: "Bringing together vibrant voices, dedicated creators, and dynamic production to deliver unmatched energy and authentic connection.",
  },
  mission: {
    title: "Our Mission",
    body: "We deliver news, music and community stories that listeners can rely on every day.",
  },
  vision: {
    title: "Our Vision",
    body: "Our programs bring people together through conversation, entertainment and local updates.",
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutPage() {
  const [about, setAbout] = useState<PageSection | null>(null);
  const [mission, setMission] = useState<PageSection | null>(null);
  const [vision, setVision] = useState<PageSection | null>(null);

  useEffect(() => {
    let isMounted = true;
    pageSectionService.getAboutSection().then((value) => {
      if (isMounted) setAbout(value);
    }).catch(() => undefined);
    pageSectionService.getMissionSection().then((value) => {
      if (isMounted) setMission(value);
    }).catch(() => undefined);
    pageSectionService.getVisionSection().then((value) => {
      if (isMounted) setVision(value);
    }).catch(() => undefined);
    return () => { isMounted = false; };
  }, []);

  const sections = [
    { key: "about", value: about, fallback: staticSections.about },
    { key: "mission", value: mission, fallback: staticSections.mission },
    { key: "vision", value: vision, fallback: staticSections.vision },
  ];
  const aboutImage = about?.image || Take3;

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#04b093] pb-24 text-black">
        <PageHero
          pageKey="about"
          fallbackTitle="About Us"
          fallbackSubtitle="Who We Are"
          fallbackDescription="Discover the people, purpose and community behind CBM Radio."
        />

        <DynamicPageSections page="about" position="top" />

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-4/3 overflow-hidden rounded-2xl border-2 border-black bg-black shadow-2xl">
            <Image
              src={aboutImage}
              alt={about?.title || "CBM Radio team"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={typeof aboutImage === "string"}
              className="object-cover"
            />
          </motion.div>
          <div>
            <span className="inline-block rounded-full bg-black px-4 py-1 text-xs font-black uppercase tracking-wider text-[#04b093]">About CBM Radio</span>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-black sm:text-5xl">{about?.title || staticSections.about.title}</h2>
            {about?.subtitle && <p className="mt-2 text-xs font-bold uppercase tracking-wider text-black/80">{about.subtitle}</p>}
            <p className="mt-5 whitespace-pre-line text-base font-bold leading-relaxed text-black/90">{about?.body || staticSections.about.body}</p>
          </div>
        </section>

        <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {sections.map(({ key, value, fallback }) => (
            <motion.article key={key} variants={itemVariants} whileHover={{ y: -5 }} className="rounded-2xl border-2 border-black bg-black p-8 shadow-2xl transition hover:shadow-black">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#04b093]">{value?.title || fallback.title}</h2>
              {value?.subtitle && <p className="mt-2 text-xs font-bold uppercase tracking-wider text-zinc-400">{value.subtitle}</p>}
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-300">{value?.body || fallback.body}</p>
            </motion.article>
          ))}
        </motion.section>
        <DynamicPageSections page="about" position="middle" />
        <DynamicPageSections page="about" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
