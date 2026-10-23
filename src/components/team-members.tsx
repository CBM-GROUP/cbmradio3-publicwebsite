"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { teamService } from "@/services/team.service";
import type { TeamMember } from "@/types/team";
import Logo from "../../public/cbmradio.png";

type HomepageTeamMember = TeamMember & { profileUrl: string };

export default function TeamMembers({ limit }: { limit?: number }) {
  const [members, setMembers] = useState<HomepageTeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<HomepageTeamMember | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [partial, setPartial] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const request = limit ? teamService.getTeamMembers({ page: 1 }).then((response) => ({ members: response.results.slice(0, limit), isPartial: false })) : teamService.getTeamDirectory();
    request.then((response) => {
      if (!isMounted) return;
      setMembers(response.members.map((member) => ({ ...member, profileUrl: member.photo })));
      setPartial(response.isPartial);
      setStatus("ready");
    }).catch(() => {
      if (isMounted) setStatus("error");
    });
    return () => { isMounted = false; };
  }, [limit]);

  return (
    <section className="border-y border-white/10 bg-[#090d0c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">Our team</p>
          <h2 className="text-3xl font-black sm:text-4xl">Meet the people behind the voices</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">Meet the passionate professionals behind CBM Radio.</p>
        </div>
        {status === "loading" && <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-8 text-white/70" aria-live="polite">Loading team members...</p>}
        {status === "error" && <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-8 text-white/75">Team information is temporarily unavailable.</p>}
        {status === "ready" && members.length === 0 && <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-8 text-white/75">No team members are available right now.</p>}
        {partial && <p className="mb-6 text-sm text-[#f4cf55]" role="status">Some team members could not be loaded. Available profiles are shown.</p>}
        {members.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => (
              <button type="button" key={member.id} className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-[#111816] text-left" onClick={() => setSelectedMember(member)} aria-label={"View " + member.name + " profile"}>
                <Image src={member.profileUrl || Logo} alt={member.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={Boolean(member.profileUrl)} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-12 text-base font-bold">{member.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="mt-8"><Link href="/team" className="inline-flex min-h-11 items-center rounded-full border border-[#48d4c1]/50 px-5 text-sm font-bold text-[#48d4c1] transition-colors hover:bg-[#48d4c1] hover:text-[#062521]">Meet the full team</Link></div>
      </div>
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
            <motion.article initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(event) => event.stopPropagation()} className="relative grid w-full max-w-3xl gap-6 rounded-lg border border-white/10 bg-[#111816] p-6 md:grid-cols-2">
              <button type="button" onClick={() => setSelectedMember(null)} className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2" aria-label="Close team member profile"><FaTimes /></button>
              <div className="relative min-h-72 overflow-hidden rounded-xl bg-zinc-800"><Image src={selectedMember.profileUrl || Logo} alt={selectedMember.name} fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized={Boolean(selectedMember.profileUrl)} className="object-cover" /></div>
              <div className="flex flex-col justify-center"><h3 className="text-3xl font-bold">{selectedMember.name}</h3><p className="mt-2 text-emerald-400">{selectedMember.role}</p>{selectedMember.bio && selectedMember.bio.trim() !== "Station Staff Member." && <p className="mt-5 leading-relaxed text-zinc-300">{selectedMember.bio}</p>}</div>
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
