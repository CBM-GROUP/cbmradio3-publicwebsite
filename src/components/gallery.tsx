"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const galleryImages = [
  {
    id: 1,
    title: "Morning Show Live",
    category: "Studio",
    date: "12 July 2026",
    image: "https://picsum.photos/seed/studio1/800/600",
    description: "Live broadcast from the CBM Radio studio.",
  },
  {
    id: 2,
    title: "Community Outreach",
    category: "Community",
    date: "10 July 2026",
    image: "https://picsum.photos/seed/community1/800/600",
    description: "Supporting the local community.",
  },
  {
    id: 3,
    title: "Sports Talk",
    category: "Shows",
    date: "8 July 2026",
    image: "https://picsum.photos/seed/show1/800/600",
    description: "Weekly sports discussion.",
  },
  {
    id: 4,
    title: "Music Festival",
    category: "Events",
    date: "5 July 2026",
    image: "https://picsum.photos/seed/event1/800/600",
    description: "Annual music celebration.",
  },
  {
    id: 5,
    title: "Studio Interview",
    category: "Studio",
    date: "2 July 2026",
    image: "https://picsum.photos/seed/interview1/800/600",
    description: "Exclusive guest interview.",
  },
  {
    id: 6,
    title: "Presenter Team",
    category: "Team",
    date: "1 July 2026",
    image: "https://picsum.photos/seed/team1/800/600",
    description: "Meet our talented presenters.",
  },
  {
    id: 7,
    title: "Behind The Scenes",
    category: "Behind",
    date: "30 June 2026",
    image: "https://picsum.photos/seed/behind1/800/600",
    description: "Production preparation.",
  },
  {
    id: 8,
    title: "Evening News",
    category: "Shows",
    date: "29 June 2026",
    image: "https://picsum.photos/seed/news1/800/600",
    description: "Daily evening news bulletin.",
  },
];

const categories = [
  "All",
  "Studio",
  "Events",
  "Shows",
  "Community",
  "Team",
  "Behind",
];

export default function GalleryPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visible, setVisible] = useState(6);

  const filtered = useMemo(() => {
    return galleryImages.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;

      const searchMatch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  return (
    <main className="bg-zinc-950 min-h-screen text-white">
      {/* Hero */}

      <section className="bg-linear-to-r from-emerald-700 to-black text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">CBM Radio Gallery</h1>

          <p className="mt-5 text-lg text-bg-zinc-800">
            Explore our broadcasts, events, presenters and memorable moments.
          </p>

          <input
            type="text"
            placeholder="Search gallery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-8 w-full md:w-2/3 lg:w-1/2 rounded-full px-6 py-4 outline-none border-2 border-zinc-400/40 text-zinc-300"
          />
        </div>
      </section>

      {/* Categories */}

      <section className="bg-zinc-950 py-10">
        <div className="flex flex-wrap justify-center gap-4 px-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-full transition font-medium cursor-pointer ${
                category === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-black/50 hover:bg-emerald-500/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery */}

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, visible).map((photo) => (
            <div
              key={photo.id}
              className="bg-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-gray-400/20 hover:shadow-xl transition duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedImage(photo.image)}
            >
              <div className="relative h-100">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  unoptimized
                  className="object-cover brightness-95 contrast-105 saturate-110"
                />

                <div className="p-6 absolute bottom-0 bg-black/30 w-full backdrop-blur-xs rounded-t-xl">
                  <span className="inline-block bg-emerald-400 text-black text-xs px-3 py-1 rounded-full mb-3">
                    {photo.category}
                  </span>

                  <h2 className="text-lg font-bold mb-3 text-gray-200">
                    {photo.title}
                  </h2>

                  <p className="text-gray-400 text-sm mb-4">
                    {photo.description}
                  </p>

                  <p className="text-sm text-bg-zinc-500">{photo.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visible < filtered.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => v + 3)}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* Statistics */}

      <section className="bg-zinc-900 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-emerald-600">1,200+</h2>
            <p>Photos</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-emerald-600">250+</h2>
            <p>Events</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-emerald-600">40+</h2>
            <p>Presenters</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-emerald-600">20+</h2>
            <p>Programs</p>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-emerald-700 text-white py-20 text-center">
        <h2 className="text-4xl font-bold">Become Part of Our Story</h2>

        <p className="mt-5 max-w-2xl mx-auto">
          Join CBM Radio events, participate in community programs and create
          unforgettable memories with us.
        </p>

        <button className="mt-8 bg-white text-emerald-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
          Contact Us
        </button>
      </section>

      {/* Lightbox */}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-5"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-0 -top-14 text-white text-4xl"
            >
              ✕
            </button>

            <Image
              src={selectedImage}
              alt=""
              width={1200}
              height={800}
              unoptimized
              className="rounded-xl max-h-[90vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
