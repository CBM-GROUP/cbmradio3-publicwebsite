"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f')",
      title: "Home of Great Music & Entertainment",
      subtitle: "Welcome to CBM Radio",
      description: "Listen to live radio, discover your favorite shows, catch the latest news, and enjoy quality entertainment anytime, anywhere."
    },
    {
      image: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819')",
      title: "Live Shows Every Day",
      subtitle: "Your Favorite Programs",
      description: "Enjoy exclusive programs from your favorite presenters and discover new music daily."
    },
    {
      image: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745')",
      title: "Stay Connected",
      subtitle: "Latest News & Updates",
      description: "Get the latest news updates and stay informed with CBM Radio's news service."
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <main>
      {/* Hero Section with Carousel */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: slides[currentSlide].image,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Content with Animations */}
        <div className="relative z-10 flex h-[80vh] items-center px-30">
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

              <div className="mt-4 flex gap-4">
                <button className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-700 text-black cursor-pointer transition duration-300">
                  Listen Live
                </button>
                <button className="rounded-lg border border-white hover:border-none px-6 py-3 font-semibold hover:bg-black/20 hover:text-emerald-500 cursor-pointer transition duration-300">
                  Explore Shows
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:text-emerald-600 text-emerald-700 p-4 rounded-full transition duration-300 cursor-pointer border border-emerald-800/30 hover:bg-black/80"
        >
          <FaArrowLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-emerald-700 hover:text-emerald-600 p-4 rounded-full transition duration-300 cursor-pointer border border-emerald-800/30 hover:bg-black/80"
        >
          <FaArrowRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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