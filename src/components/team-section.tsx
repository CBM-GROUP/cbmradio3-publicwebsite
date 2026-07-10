"use client";

import { useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  {
    name: "Innocent Kato",
    role: "Lead Web Developer",
    image: "/https://images.pexels.com/photos/29204802/pexels-photo-29204802.jpeg",
    bio: "Designs and develops the CBM Radio website using Next.js and Tailwind CSS.",
  },
  {
    name: "Brian Mugisha",
    role: "Station Manager",
    image: "/team/brian.svg",
    bio: "Oversees daily radio operations and manages station activities.",
  },
  {
    name: "Innocent Kato",
    role: "Technical Director",
    image: "/team/innocent2.svg",
    bio: "Ensures all broadcasting systems and streaming services run smoothly.",
  },
  {
    name: "Samuel Peter",
    role: "Radio Presenter",
    image: "/team/samuel.svg",
    bio: "Hosts engaging programs and entertains listeners every day.",
  },
  {
    name: "Daniel Moses",
    role: "News Anchor",
    image: "/team/daniel.svg",
    bio: "Presents accurate and timely news updates.",
  },
];

export default function TeamSection() {
  return (
    <section className="bg-black px-6 py-24 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Our Team
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-400">
            Meet the passionate professionals behind CBM Radio who work every
            day to deliver quality entertainment, news and music.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <TeamCard member={member} key={`${member.name}-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: (typeof team)[0] }) {
  // Candidates order: jpg, png, original (svg)
  const base = member.image.replace(/\.(svg|jpg|jpeg|png)$/i, "");
  const candidates = [`${base}.jpg`, `${base}.png`, member.image];
  const [i, setI] = useState(0);

  const onImgError = () => {
    if (i < candidates.length - 1) setI((v) => v + 1);
    else setI(candidates.length); // will trigger initials fallback
  };

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg"
    >
      <div className="relative h-96 bg-zinc-800">
        {i < candidates.length ? (
          <Image
            src={candidates[i]}
            alt={member.name}
            onError={onImgError}
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-emerald-400">
            {initials}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold">{member.name}</h3>
        <p className="mt-2 text-emerald-500">{member.role}</p>
        <p className="mt-4 text-gray-400">{member.bio}</p>

        <div className="mt-6 flex gap-4">
          <button className="h-10 w-10 rounded-full bg-zinc-800 transition hover:bg-emerald-900 cursor-pointer flex items-center justify-center">
            <FaFacebookF className="mx-auto" />
          </button>
          <button className="h-10 w-10 rounded-full bg-zinc-800 transition hover:bg-emerald-900 cursor-pointer flex items-center justify-center">
            <FaInstagram className="mx-auto" />
          </button>
          <button className="h-10 w-10 rounded-full bg-zinc-800 transition hover:bg-emerald-900 cursor-pointer flex items-center justify-center">
            <FaXTwitter className="mx-auto" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
