"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const slides = [
  {
    image: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f')",
    title: "Home of Great Music & Entertainment",
    subtitle: "Welcome to CBM Radio",
    description:
      "Listen to live radio, discover your favorite shows, catch the latest news, and enjoy quality entertainment anytime, anywhere.",
  },
  {
    image: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819')",
    title: "Live Shows Every Day",
    subtitle: "Your Favorite Programs",
    description:
      "Enjoy exclusive programs from your favorite presenters and discover new music daily.",
  },
  {
    image: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745')",
    title: "Stay Connected",
    subtitle: "Latest News & Updates",
    description:
      "Get the latest news updates and stay informed with CBM Radio's news service.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <main>
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative min-h-screen bg-cover bg-center pt-24"
        style={{
          backgroundImage: slides[currentSlide].image,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex h-[80vh] items-center px-6 md:px-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-white"
            >
              <p className="text-emerald-500 text-lg font-semibold uppercase">
                {slides[currentSlide].subtitle}
              </p>

              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                {slides[currentSlide].title}
              </h1>

              <p className="mt-4 text-lg text-gray-300">
                {slides[currentSlide].description}
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                <button className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-black transition duration-300 hover:bg-emerald-700">
                  Listen Live
                </button>
                <button className="rounded-lg border border-white px-6 py-3 font-semibold transition duration-300 hover:border-none hover:bg-black/20 hover:text-emerald-500">
                  Explore Shows
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full border border-emerald-800/30 bg-black/60 p-4 text-emerald-700 transition duration-300 hover:bg-black/80 hover:text-emerald-600"
        >
          <FaArrowLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full border border-emerald-800/30 bg-black/60 p-4 text-emerald-700 transition duration-300 hover:bg-black/80 hover:text-emerald-600"
        >
          <FaArrowRight size={20} />
        </button>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition duration-300 ${
                index === currentSlide
                  ? "w-8 bg-emerald-500"
                  : "w-3 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}