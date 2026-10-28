"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Mic2, X } from "lucide-react";
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
    <section className="relative bg-[#04b093] px-5 py-16 text-black sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b-2 border-black pb-6">
          <div>
            <span className="inline-block rounded-full bg-black px-4 py-1 text-xs font-black uppercase tracking-wider text-[#04b093]">
              On-Air Voices & Talent
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              Meet The Presenters
            </h2>
            <p className="mt-2 max-w-2xl font-bold text-black/80">
              The passionate professionals, cultural curators, and radio personalities behind CBM Radio.
            </p>
          </div>

          <Link
            href="/programs"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-black px-5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black"
          >
            Explore Shows <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        {status === "loading" && (
          <p
            className="rounded-2xl border-2 border-black bg-black px-5 py-12 text-center font-black uppercase tracking-wider text-[#04b093]"
            aria-live="polite"
          >
            Loading presenter profiles...
          </p>
        )}

        {status === "error" && (
          <p className="rounded-2xl border-2 border-black bg-black px-5 py-8 text-center font-bold text-white">
            Presenter profiles are temporarily unavailable.
          </p>
        )}

        {status === "ready" && members.length === 0 && (
          <p className="rounded-2xl border-2 border-black bg-black px-5 py-8 text-center font-bold text-white">
            Presenter profiles will appear here once published.
          </p>
        )}

        {partial && (
          <p className="mb-6 rounded-2xl border-2 border-black bg-black p-4 text-xs font-bold uppercase tracking-wider text-amber-400" role="status">
            Some team members could not be loaded. Available profiles are shown.
          </p>
        )}

        {/* Dynamic Layout Based on Member Count */}
        {members.length === 1 ? (
          /* Single member: Beautifully balanced wide showcase card */
          <div className="cbm-card relative overflow-hidden rounded-2xl border-2 border-black bg-black p-6 sm:p-10 text-white shadow-2xl">
            <div className="grid items-center gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-2xl border-2 border-[#04b093] bg-zinc-900 shadow-xl">
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#04b093] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black">
                    <Mic2 size={13} /> {members[0].role || "Station Presenter"}
                  </span>
                </div>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  {members[0].name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300 max-w-xl">
                  {members[0].bio && members[0].bio.trim() !== "Station Staff Member."
                    ? members[0].bio
                    : "Bringing authentic perspectives, great music, and vibrant discussions to the airwaves of CBM Radio."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedMember(members[0])}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-[#04b093] px-6 text-xs font-black uppercase tracking-wider text-black transition hover:bg-white hover:text-black"
                  >
                    View Presenter Profile
                  </button>
                  <Link
                    href="/programs"
                    className="inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-wider text-[#04b093] hover:underline"
                  >
                    Explore Programs <ArrowUpRight size={15} />
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
                className="cbm-card group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 border-black bg-black text-left shadow-xl"
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
                <div className="absolute inset-x-0 bottom-0 border-t-2 border-black/80 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 pt-16">
                  {member.role && (
                    <span className="block text-[0.65rem] font-black uppercase tracking-wider text-[#04b093]">
                      {member.role}
                    </span>
                  )}
                  <h4 className="mt-1 text-lg font-black uppercase tracking-tight text-white group-hover:text-[#04b093] transition-colors">
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
              href="/programs"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-black px-6 text-xs font-black uppercase tracking-wider text-[#04b093] transition-colors hover:bg-white hover:text-black"
            >
              Explore Our Programs <ArrowUpRight size={16} />
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
              className="relative grid w-full max-w-3xl gap-6 overflow-hidden rounded-2xl border-2 border-black bg-black p-6 text-white shadow-2xl md:grid-cols-2 md:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-zinc-800 text-white hover:bg-[#04b093] hover:text-black transition"
                aria-label="Close profile"
              >
                <X size={18} />
              </button>

              <div className="relative min-h-72 overflow-hidden rounded-xl bg-zinc-900 border-2 border-zinc-800">
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
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">
                  {selectedMember.role}
                </span>
                <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-white">
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
