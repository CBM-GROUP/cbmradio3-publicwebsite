"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Take3 from "../../../public/cbm_images/take 3.jpeg";
import { motion, Variants } from "framer-motion";

const highlights = [
  {
    title: "Trusted Content",
    description:
      "We deliver news, music and community stories that listeners can rely on every day.",
  },
  {
    title: "Live Connection",
    description:
      "Our programs bring people together through conversation, entertainment and local updates.",
  },
  {
    title: "Community Focus",
    description:
      "CBM Radio is built around the people, voices and stories that shape our communities.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen mt-28 pb-24 overflow-hidden">
        <section className="relative bg-linear-to-r from-zinc-900/40 via-zinc-800/30 to-zinc-900/40 w-full py-20 px-6 sm:px-12 lg:px-20 backdrop-blur-md border-y border-zinc-700/30">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group w-full max-w-md lg:max-w-lg shrink-0"
            >
              <div className="relative overflow-hidden rounded-2xl border border-zinc-700/50 shadow-2xl bg-zinc-900 z-10">
                <Image
                  src={Take3.src}
                  alt="CBM Radio Team"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                  width={2000}
                  height={2000}
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-xs uppercase tracking-widest text-teal-400 font-semibold">
                  Who We Are
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                About Us
              </h1>
              <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
                Bringing together vibrant voices, dedicated creators, and
                dynamic production to deliver unmatched energy and authentic
                connection.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {highlights.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg hover:border-zinc-700 transition"
              >
                <h2 className="text-xl font-semibold text-teal-400">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}