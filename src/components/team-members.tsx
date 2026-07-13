"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import ProfileCard from "./profile-card";

const members = [
  {
    id: 1,
    profileUrl:
      "https://images.pexels.com/photos/29204802/pexels-photo-29204802/free-photo-of-black-and-white-portrait-of-a-young-man-in-denim.jpeg?auto=compress&w=1260&h=750&dpr=1",
    name: "John Doe",
    title: "DJ and presenter",
    bio: "Join John Doe every weekday morning from 6 AM to 10 AM. He brings you the best mix of classic hits, current chart-toppers, and the latest entertainment news to start your day right.",
    facebookLink: "",
    instagramLink: "",
    whatsAppLink: "",
    linkedInLink: "",
    xLink: "",
    style: "z-10",
  },
  {
    id: 2,
    profileUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1260&q=80",
    name: "Sarah Jenkins",
    title: "Drive Time Host",
    bio: "Sarah keeps you company on your commute home from 4 PM to 7 PM. Expect upbeat tracks, interactive trivia, and live traffic updates to get you through the rush hour with a smile.",
    facebookLink: "",
    instagramLink: "",
    whatsAppLink: "",
    linkedInLink: "",
    xLink: "",
    style: "rotate-6 z-10",
  },
  {
    id: 3,
    profileUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1260&q=80",
    name: "Marcus Thorne",
    title: "Night Mix DJ",
    bio: "Marcus takes over the airwaves from 10 PM to 2 AM. Known for his seamless transitions and deep house mixes, he provides the ultimate soundtrack for your late-night drives and study sessions.",
    facebookLink: "",
    instagramLink: "",
    whatsAppLink: "",
    linkedInLink: "",
    xLink: "",
    style: "-rotate-6 z-20",
  },
  {
    id: 4,
    profileUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1260&q=80",
    name: "Emily Chen",
    title: "Head of News",
    bio: "Emily delivers the top local and global stories at the top of every hour. With over a decade of journalism experience, she ensures you stay informed on politics, business, and community events.",
    facebookLink: "",
    instagramLink: "",
    whatsAppLink: "",
    linkedInLink: "",
    xLink: "",
    style: "rotate-6 z-30",
  },
  {
    id: 5,
    profileUrl:
      "https://images.pexels.com/photos/31800239/pexels-photo-31800239.jpeg",
    name: "David Patel",
    title: "Sports Commentator",
    bio: "David is your go-to source for all things sports. Catch his weekend recap every Sunday afternoon, featuring interviews with local athletes, match analyses, and live score updates.",
    facebookLink: "",
    instagramLink: "",
    whatsAppLink: "",
    linkedInLink: "",
    xLink: "",
    style: "-rotate-6 z-20",
  },
  {
    id: 6,
    profileUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1260&q=80",
    name: "Alex Rivera",
    title: "Talk Show Host",
    bio: "Alex hosts 'The Midday Debate' from 11 AM to 2 PM. He dives deep into community issues, pop culture, and takes live calls from listeners, making sure every voice in the city is heard.",
    facebookLink: "",
    instagramLink: "",
    whatsAppLink: "",
    linkedInLink: "",
    xLink: "",
    style: "z-10",
  },
];

export default function TeamMembers() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<
    (typeof members)[0] | null
  >(null);

  const handleSocialLinks = (url?: string)=> {
    console.log("pressed", url)
  }
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
      </div>

      <div className="flex flex-row items-center justify-center -space-x-8">
        {/* -space-x-8 makes them overlap slightly. Remove if you want them separated */}

        {members.map((member) => (
          <div
            key={member.id}
            className={`relative inline-block h-70 w-60 rounded-2xl bg-zinc-500/30 cursor-pointer shadow-lg transition-transform duration-300 hover:scale-105 hover:z-40 ${member.style}`}
            onMouseEnter={() => setHoveredId(member.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedMember(member)}
          >
            <Image
              src={member.profileUrl}
              alt={member.name}
              fill
              className="object-cover rounded-2xl"
            />

            {/* Hover Tooltip (Only shows if THIS card's ID matches the hovered ID) */}
            <AnimatePresence>
              {hoveredId === member.id && !selectedMember && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-black text-sm font-medium rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-50 border border-zinc-800"
                >
                  {member.name}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <ProfileCard
        isOpen={!!selectedMember}
        onClose={()=> setSelectedMember(null)}
        name={selectedMember?.name || ""}
        title={selectedMember?.title || ""}
        bio={selectedMember?.bio || ""}
        profileUrl={selectedMember?.profileUrl || ""}
        onFacebookPress={()=> handleSocialLinks(selectedMember?.facebookLink || "")}
        onInstagramPress={()=> handleSocialLinks(selectedMember?.instagramLink || "")}
        onLinkedInPress={()=> handleSocialLinks(selectedMember?.linkedInLink || "")}
        onWhatsAppPress={()=> handleSocialLinks(selectedMember?.whatsAppLink || "")}
        onXPress={()=> handleSocialLinks(selectedMember?.xLink || "")}
        />
    </section>
  );
}
