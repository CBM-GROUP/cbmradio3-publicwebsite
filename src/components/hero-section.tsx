"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const images = [
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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Slightly longer interval (5s) to appreciate the new animations

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (index: number) => {
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  return (
    <main>
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative min-h-screen pt-24 overflow-hidden bg-black"
      >
        {/* Smooth Background Crossfade with subtle zoom */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: images[currentSlide].image }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        <div className="relative z-10 flex h-[80vh] items-center px-6 md:px-30">
          <div className="max-w-2xl text-white">
            
            {/* Animated Text Content */}
            <div className="relative overflow-hidden min-h-55 md:min-h-45">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  <p className="text-teal-500 text-xl font-semibold capitalize tracking-wider">
                    {images[currentSlide].subtitle}
                  </p>

                  <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                    {images[currentSlide].title}
                  </h1>

                  <p className="mt-4 text-lg text-gray-300">
                    {images[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-lg bg-emerald-400 px-6 py-3 font-semibold text-black transition duration-300 hover:bg-emerald-500 cursor-pointer active:scale-95 border-none">
                Listen Live
              </button>
              <button className="rounded-lg border border-white px-6 py-3 font-semibold transition duration-300 hover:bg-white hover:text-black cursor-pointer active:scale-95">
                Explore Shows
              </button>
            </div>

          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full border border-emerald-800/30 bg-black/60 p-4 text-emerald-400 transition duration-300 hover:bg-black/80 hover:text-emerald-500 cursor-pointer"
        >
          <FaArrowLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full border border-emerald-800/30 bg-black/60 p-4 text-emerald-400 transition duration-300 hover:bg-black/80 hover:text-emerald-600 cursor-pointer"
        >
          <FaArrowRight size={20} />
        </button>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              animate={{
                width: index === currentSlide ? 40 : 8,
                backgroundColor: index === currentSlide ? "#10b981" : "rgba(255, 255, 255, 0.5)",
              }}
              whileHover={{
                backgroundColor: index === currentSlide ? "#10b981" : "rgba(255, 255, 255, 0.8)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-2 rounded-full cursor-pointer border-none p-0"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}