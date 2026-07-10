"use client";

import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const news = [
  {
    id: 1,
    title: "CBM Radio Launches Community Health Campaign",
    category: "Community",
    date: "July 10, 2026",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800",
    description:
      "CBM Radio has launched a community health campaign to promote healthy living through informative programs and outreach activities.",
  },
  {
    id: 2,
    title: "Exclusive Interview with Local Entrepreneurs",
    category: "Business",
    date: "July 8, 2026",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    description:
      "This week's interview features successful local entrepreneurs sharing their inspiring business journeys and advice.",
  },
  {
    id: 3,
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
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-emerald-500">
            Latest News
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest stories, announcements, and events
            happening at CBM Radio.
          </p>
        </div>

        {/* News Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {news.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-gray-800/20 hover:shadow-2xl transition duration-300 hover:-translate-y-2"
            >
              <div className="relative h-60">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">

                <span className="inline-block bg-emerald-800 text-black text-xs px-3 py-1 rounded-full mb-3">
                  {item.category}
                </span>

                <h3 className="text-lg font-bold mb-3 text-gray-200">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">

                  <span className="text-sm text-gray-500">
                    {item.date}
                  </span>

                  <Link
                    href="/news"
                    className="text-emerald-600 font-semibold hover:text-emerald-800"
                  >
                    Read More
                    <ArrowRightIcon className="inline-block w-4 h-4 ml-1" />
                  </Link>

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Button */}
        <div className="text-center mt-12">
          <Link
            href="/news"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            View All News
          </Link>
        </div>

      </div>
    </section>
  );
}