"use client";

import HeroSection from "../components/hero-section";
import ProgramsSection from "../components/programs-section";
import Header from "../components/header";
import NewsSection from "@/components/news-section";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";
import TeamMembers from "@/components/team-members";
import EpisodesSection from "@/components/episodes-section";
import { motion } from "framer-motion";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section: Smooth Fade & Zoom Scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen"
      >
        <HeroSection />
      </motion.div>

      {/* Team Members Section: Staggered Fade Up */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
      <TeamMembers limit={6} />
      </motion.section>

      {/* Programs Section: Slide In From Left */}
      <motion.section
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <ProgramsSection />
      </motion.section>

      {/* News Section: Slide In From Right */}
      <motion.section
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Suspense fallback={<div className="min-h-screen" />}>
          <NewsSection />
        </Suspense>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <EpisodesSection />
      </motion.section>

      {/* Gallery Section: Blur & Fade In */}
      <motion.section
        initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <Gallery />
      </motion.section>

      {/* Contact Section: Smooth Upward Reveal */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Contact />
      </motion.section>

      <Footer />
    </>
  );
}
