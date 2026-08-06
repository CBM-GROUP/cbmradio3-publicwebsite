"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { teamService } from "@/services/team.service";
import type { TeamMember } from "@/types/team";
import Logo from "../../public/cbmradio.png";

const HOMEPAGE_TEAM_LIMIT = 6;
type HomepageTeamMember = TeamMember & { profileUrl: string };

export default function TeamMembers() {
  const [members, setMembers] = useState<HomepageTeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<HomepageTeamMember | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isMounted = true;
    teamService.getTeamMembers({ page: 1 }).then((response) => {
      if (!isMounted) return;
      setMembers(response.results.slice(0, HOMEPAGE_TEAM_LIMIT).map((member) => ({ ...member, profileUrl: member.photo })));
      setStatus("ready");
    }).catch(() => {
      if (isMounted) setStatus("error");
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="bg-black px-6 py-24 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Our Team</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-400">Meet the passionate professionals behind CBM Radio.</p>
        </div>
        {status === "loading" && <p className="min-h-48 text-center text-zinc-400" aria-live="polite">Loading team members...</p>}
        {status === "error" && <p className="min-h-48 text-center text-zinc-400">Team information is temporarily unavailable.</p>}
        {status === "ready" && members.length === 0 && <p className="min-h-48 text-center text-zinc-400">No team members are available right now.</p>}
        {members.length > 0 && (
          <div className="flex flex-row items-center justify-center -space-x-8">
            {members.map((member, index) => (
              <button type="button" key={member.id} className={"relative inline-block h-28 w-20 cursor-pointer overflow-hidden rounded-2xl bg-zinc-800 shadow-lg transition-transform duration-300 hover:z-40 hover:scale-105 sm:h-36 sm:w-28 md:h-48 md:w-36 lg:h-64 lg:w-48 xl:h-70 xl:w-60 " + (index % 3 === 1 ? "rotate-3" : index % 3 === 2 ? "-rotate-3" : "")} onClick={() => setSelectedMember(member)} aria-label={"View " + member.name + " profile"}>
                <Image src={member.profileUrl || Logo} alt={member.name} fill sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, (max-width: 1024px) 144px, 240px" unoptimized={Boolean(member.profileUrl)} className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-3 text-sm font-semibold">{member.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="mt-10 text-center"><Link href="/team" className="font-semibold text-emerald-500 hover:text-emerald-400">Meet the full team</Link></div>
      </div>
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
            <motion.article initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(event) => event.stopPropagation()} className="relative grid w-full max-w-3xl gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2">
              <button type="button" onClick={() => setSelectedMember(null)} className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2" aria-label="Close team member profile"><FaTimes /></button>
              <div className="relative min-h-72 overflow-hidden rounded-xl bg-zinc-800"><Image src={selectedMember.profileUrl || Logo} alt={selectedMember.name} fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized={Boolean(selectedMember.profileUrl)} className="object-cover" /></div>
              <div className="flex flex-col justify-center"><h3 className="text-3xl font-bold">{selectedMember.name}</h3><p className="mt-2 text-emerald-400">{selectedMember.role}</p>{selectedMember.bio && <p className="mt-5 leading-relaxed text-zinc-300">{selectedMember.bio}</p>}</div>
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
