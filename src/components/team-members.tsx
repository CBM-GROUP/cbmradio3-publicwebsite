"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Mic2, Users, X } from "lucide-react";
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
    const request = limit
      ? teamService.getTeamMembers({ page: 1 }).then((response) => ({
          members: response.results.slice(0, limit),
          isPartial: false,
        }))
      : teamService.getTeamDirectory();

    request
      .then((response) => {
        if (!isMounted) return;
        setMembers(
          response.members.map((member) => ({ ...member, profileUrl: member.photo })),
        );
        setPartial(response.isPartial);
        setStatus("ready");
      })
      .catch(() => {
        if (isMounted) setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return (
    <section className="relative border-y border-white/10 bg-[#080d0b] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#00d4a5]/10 text-[#00d4a5]">
                <Users size={16} />
              </span>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                ON-AIR VOICES & TALENT
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Meet The Presenters
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              The passionate professionals, cultural curators, and radio personalities behind CBM Radio.
            </p>
          </div>

          <Link
            href="/team"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 text-sm font-extrabold text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521]"
          >
            All Station Members <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        {status === "loading" && (
          <p
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center text-white/70"
            aria-live="polite"
          >
            Loading presenter profiles...
          </p>
        )}

        {status === "error" && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/75">
            Presenter profiles are temporarily unavailable.
          </p>
        )}

        {status === "ready" && members.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/75">
            Presenter profiles will appear here once published.
          </p>
        )}

        {partial && (
          <p className="mb-6 text-sm text-[#f4cf55]" role="status">
            Some team members could not be loaded. Available profiles are shown.
          </p>
        )}

        {/* Dynamic Layout Based on Member Count */}
        {members.length === 1 ? (
          /* Single member: Beautifully balanced wide showcase card */
          <div className="cbm-card relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-[#0c1613] to-[#070b09] p-6 sm:p-10 shadow-xl">
            <div className="grid items-center gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-2xl border-2 border-[#00d4a5]/40 bg-black/40 shadow-xl">
                <Image
                  src={members[0].profileUrl || Logo}
                  alt={members[0].name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  unoptimized={Boolean(members[0].profileUrl)}
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00d4a5]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#00d4a5]">
                    <Mic2 size={13} /> {members[0].role || "Station Presenter"}
                  </span>
                </div>
                <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  {members[0].name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300 max-w-xl">
                  {members[0].bio && members[0].bio.trim() !== "Station Staff Member."
                    ? members[0].bio
                    : "Bringing authentic perspectives, great music, and vibrant discussions to the airwaves of CBM Radio."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedMember(members[0])}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#48d4c1]"
                  >
                    View Presenter Profile
                  </button>
                  <Link
                    href="/team"
                    className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-white/70 hover:text-[#00d4a5] transition"
                  >
                    Explore Full Team Directory <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : members.length > 1 ? (
          /* Multiple members: Responsive Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <button
                type="button"
                key={member.id}
                className="cbm-card group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0c1411] text-left transition-all hover:border-[#00d4a5]/50 shadow-md"
                onClick={() => setSelectedMember(member)}
                aria-label={`View ${member.name} profile`}
              >
                <Image
                  src={member.profileUrl || Logo}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={Boolean(member.profileUrl)}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 pt-16">
                  {member.role && (
                    <span className="block text-[0.65rem] font-black uppercase tracking-wider text-[#00d4a5]">
                      {member.role}
                    </span>
                  )}
                  <h4 className="mt-1 text-lg font-black text-white group-hover:text-[#00d4a5] transition-colors">
                    {member.name}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {members.length > 1 && (
          <div className="mt-10">
            <Link
              href="/team"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 px-6 text-sm font-bold text-[#00d4a5] transition-colors hover:bg-[#00d4a5] hover:text-[#062521]"
            >
              Meet The Full On-Air Collective <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Modal Profile Dialog */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setSelectedMember(null)}
          >
            <motion.article
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(event) => event.stopPropagation()}
              className="relative grid w-full max-w-3xl gap-6 overflow-hidden rounded-2xl border border-white/15 bg-[#0a1210] p-6 shadow-2xl md:grid-cols-2 md:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-black/70 text-white hover:bg-[#00d4a5] hover:text-[#062521] transition"
                aria-label="Close profile"
              >
                <X size={18} />
              </button>

              <div className="relative min-h-72 overflow-hidden rounded-xl bg-zinc-900 border border-white/10">
                <Image
                  src={selectedMember.profileUrl || Logo}
                  alt={selectedMember.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={Boolean(selectedMember.profileUrl)}
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                  {selectedMember.role}
                </span>
                <h3 className="mt-2 text-3xl font-black text-white">
                  {selectedMember.name}
                </h3>
                {selectedMember.bio &&
                  selectedMember.bio.trim() !== "Station Staff Member." && (
                    <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                      {selectedMember.bio}
                    </p>
                  )}
              </div>
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
