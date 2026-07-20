"use client";

import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const news = [
  {
    id: 1,
    slug: "community-health-campaign",
    title: "CBM Radio Launches Community Health Campaign",
    category: "Community",
    date: "July 10, 2026",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800",
    description:
      "CBM Radio has launched a community health campaign to promote healthy living through informative programs and outreach activities.",
  },
  {
    id: 2,
    slug: "exclusive-interview-local-entrepreneurs",
    title: "Exclusive Interview with Local Entrepreneurs",
    category: "Business",
    date: "July 8, 2026",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    description:
      "This week's interview features successful local entrepreneurs sharing their inspiring business journeys and advice.",
  },
  {
    id: 3,
    slug: "new-digital-studio-operational",
    title: "New Digital Studio Now Operational",
    category: "Technology",
    date: "July 5, 2026",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    description:
      "Our newly upgraded digital broadcasting studio is now fully operational, delivering clearer sound and better production quality.",
  },
];

export default function NewsSection() {
  return (
    <section className="min-h-screen bg-zinc-900 pb-24">
      {/* Heading */}
      <div className="mb-16 mt-24 bg-black/20 flex flex-col items-center text-center py-24 px-6">
        <h2 className="text-5xl font-medium text-teal-500">Where Culture Meets Commentary</h2>
        <p className="text-xl font-light mt-4 text-zinc-300 max-w-2xl">
          Stay plugged into the latest buzz, trending moments, and conversations
          lighting up youth culture. From music drops to viral stories, this is
          your go-to spot for what’s hot, what’s next, and what everyone’s
          talking about.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* News Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-gray-900/50 hover:shadow-xl transition duration-300 hover:-translate-y-2 border border-zinc-700/50"
            >
              <div className="relative h-60 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 flex flex-col h-[calc(100%-15rem)]">
                <div className="mb-auto">
                  <span className="inline-block bg-teal-500/20 text-teal-400 font-semibold text-xs px-3 py-1 rounded-full mb-4">
                    {item.category}
                  </span>

                  <h3 className="text-xl font-bold mb-1 text-gray-100">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 text-sm mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-700">
                  <span className="text-sm font-medium text-zinc-500">
                    {item.date}
                  </span>

                  <Link
                    href={`/news/${item.slug}`}
                    className="text-teal-500 font-semibold hover:text-teal-400 flex items-center group transition-colors"
                  >
                    Read More
                    <ArrowRightIcon className="inline-block w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-16">
          <Link
            href="/news"
            className="inline-block bg-teal-600 hover:bg-teal-500 text-black px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-emerald-600/30"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}