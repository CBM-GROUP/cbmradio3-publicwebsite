"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Handshake,
  Headphones,
  Mail,
  Music2,
  Radio,
  Users,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { getEmailHref, getPhoneHref, getSafeSocialUrl } from "@/lib/contact-links";
import homeService from "@/services/home.service";
import { programService } from "@/services/program.service";
import { siteSettingsService } from "@/services/site-settings.service";
import { teamService } from "@/services/team.service";
import type { PageSection } from "@/types/hero";
import type { ProgramSummary } from "@/types/program";
import type { SiteContact, SocialLink } from "@/types/site-settings";
import type { TeamMember } from "@/types/team";
import Logo from "../../public/cbmradio.png";
import DanielPortrait from "../../public/cbm_images/daniel.svg";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";
import InnocentPortrait from "../../public/cbm_images/innocent1.svg";

type LoadState = "loading" | "ready" | "error";

const socialIcons: Record<string, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
  youtube: FaYoutube,
  x: FaXTwitter,
};

const scheduleArtwork = [
  DanielPortrait,
  BrianPortrait,
  SamuelPortrait,
  InnocentPortrait,
];

function safeWebUrl(value: string | undefined) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{description}</p>
    </div>
  );
}

export default function HomepageAdditions() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [programsStatus, setProgramsStatus] = useState<LoadState>("loading");
  const [programsPartial, setProgramsPartial] = useState(false);
  const [hosts, setHosts] = useState<TeamMember[]>([]);
  const [hostsStatus, setHostsStatus] = useState<LoadState>("loading");
  const [hostsPartial, setHostsPartial] = useState(false);
  const [sponsor, setSponsor] = useState<PageSection | null>(null);
  const [sponsorStatus, setSponsorStatus] = useState<LoadState>("loading");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialStatus, setSocialStatus] = useState<LoadState>("loading");
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [contactStatus, setContactStatus] = useState<LoadState>("loading");
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadHomepageData() {
      const [programResult, hostResult, sponsorResult, socialResult, contactResult] =
        await Promise.allSettled([
          programService.getActiveProgramsForFilters(),
          teamService.getTeamDirectory(),
          homeService.getSponsors(),
          siteSettingsService.getSocialLinks(),
          siteSettingsService.getSiteContact(),
        ]);

      if (!isMounted) return;

      if (programResult.status === "fulfilled") {
        setPrograms(
          programResult.value.programs
            .filter((program) => program.is_active)
            .sort((a, b) => a.display_order - b.display_order),
        );
        setProgramsPartial(programResult.value.isPartial);
        setProgramsStatus("ready");
      } else {
        setProgramsStatus("error");
      }

      if (hostResult.status === "fulfilled") {
        setHosts(
          hostResult.value.members
            .filter((member) => member.is_active && /(presenter|host|dj|anchor)/i.test(member.role))
            .sort((a, b) => a.order - b.order)
            .slice(0, 3),
        );
        setHostsPartial(hostResult.value.isPartial);
        setHostsStatus("ready");
      } else {
        setHostsStatus("error");
      }

      if (sponsorResult.status === "fulfilled") {
        setSponsor(sponsorResult.value.is_active ? sponsorResult.value : null);
        setSponsorStatus("ready");
      } else {
        setSponsorStatus("error");
      }

      if (socialResult.status === "fulfilled") {
        setSocialLinks(socialResult.value.results.filter((link) => link.is_active));
        setSocialStatus("ready");
      } else {
        setSocialStatus("error");
      }

      if (contactResult.status === "fulfilled") {
        setContact(contactResult.value);
        setContactStatus("ready");
      } else {
        setContactStatus("error");
      }
    }

    void loadHomepageData();
    return () => {
      isMounted = false;
    };
  }, []);

  const rawStreamUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL?.trim();
  const streamUrl = safeWebUrl(rawStreamUrl);
  const rawNewsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL?.trim();
  const newsletterUrl = safeWebUrl(rawNewsletterUrl);
  const emailHref = getEmailHref(contact?.business_email ?? "");
  const phoneHref = getPhoneHref(contact?.business_phone ?? "");
  const whatsappUrl = socialLinks.find((link) => link.platform_key === "whatsapp");
  const safeWhatsappUrl = whatsappUrl ? getSafeSocialUrl(whatsappUrl.url) : null;
  const scheduledPrograms = programs.filter((program) => program.schedule?.trim()).slice(0, 5);
  const sponsorImage = sponsor?.image || sponsor?.external_image_url;
  const sponsorHref = sponsor?.cta_url.startsWith("/")
    ? sponsor.cta_url
    : safeWebUrl(sponsor?.cta_url);

  return (
    <section className="border-y border-white/10 bg-[#090d0c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div id="live-radio" className="grid overflow-hidden rounded-2xl border border-[#48d4c1]/25 bg-[#111816] lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 text-[#48d4c1]">
                <span className="grid size-11 place-items-center rounded-full bg-[#48d4c1]/10">
                  <Radio size={21} aria-hidden="true" />
                </span>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em]">CBM Radio live</p>
              </div>
              <h2 className="mt-5 text-2xl font-black sm:text-3xl">Listen wherever you are.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                Tune in for music, conversations, and stories from your community.
              </p>
              {streamUrl ? (
                <>
                  <audio
                    className="mt-6 w-full"
                    controls
                    preload="none"
                    src={streamUrl}
                    aria-label="CBM Radio live stream"
                    onError={() => setStreamError(true)}
                    onPlaying={() => setStreamError(false)}
                  >
                    Your browser does not support audio playback.
                  </audio>
                  {streamError && (
                    <p className="mt-3 text-sm text-amber-200" role="status">
                      The live stream could not be loaded. Please try again later.
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-6 rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
                  {rawStreamUrl
                    ? "The configured stream URL must be a valid HTTP or HTTPS address."
                    : "Live listening will be available once the station stream URL is configured."}
                </p>
              )}
            </div>
            <div className="relative min-h-56 overflow-hidden lg:min-h-full">
              <Image
                src={DanielPortrait}
                alt="CBM Radio presenter Daniel Moses"
                fill
                sizes="(max-width: 1024px) 100vw, 240px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent lg:bg-gradient-to-r" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white">
                Voices from the community
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#111816] p-6 sm:p-8">
            <SectionHeading
              eyebrow="This week on CBM"
              title="Show schedule"
              description="Find a show time and tune in for the voices you love."
            />
            {programsStatus === "loading" && <p className="text-sm text-white/65" aria-live="polite">Loading show schedule...</p>}
            {programsStatus === "error" && <p className="text-sm text-white/65">The show schedule is temporarily unavailable.</p>}
            {programsPartial && <p className="mb-3 text-sm text-amber-200" role="status">Some show times could not be loaded.</p>}
            {programsStatus === "ready" && scheduledPrograms.length === 0 && (
              <p className="text-sm text-white/65">Show times have not been published yet. Browse all programs for the latest lineup.</p>
            )}
            {scheduledPrograms.length > 0 && (
              <ul className="divide-y divide-white/10">
                {scheduledPrograms.map((program, index) => (
                  <li key={program.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-black/30">
                      <Image
                        src={program.cover_image || scheduleArtwork[index % scheduleArtwork.length]}
                        alt={program.cover_image ? `${program.title} show artwork` : "CBM Radio presenter artwork"}
                        fill
                        sizes="56px"
                        unoptimized={Boolean(program.cover_image)}
                        className="object-cover"
                      />
                    </div>
                    <CalendarDays className="mt-0.5 shrink-0 text-[#48d4c1]" size={17} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-bold">{program.title}</p>
                      <p className="mt-1 text-sm text-white/65">{program.schedule}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/programs" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#48d4c1] hover:text-white">
              See all programs <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionHeading
              eyebrow="On air"
              title="Meet the voices behind the shows"
              description="Get to know the presenters bringing your favorite programs to life."
            />
            {hostsStatus === "loading" && <p className="text-sm text-white/65" aria-live="polite">Loading presenters...</p>}
            {hostsStatus === "error" && <p className="text-sm text-white/65">Presenter profiles are temporarily unavailable.</p>}
            {hostsPartial && <p className="mb-3 text-sm text-amber-200" role="status">Some presenter profiles could not be loaded.</p>}
            {hostsStatus === "ready" && hosts.length === 0 && (
              <p className="text-sm text-white/65">Presenter profiles will appear here when they are published.</p>
            )}
            {hosts.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-3">
                {hosts.map((host) => {
                  const image = host.photo || host.external_photo_url;
                  return (
                    <article key={host.id} className="overflow-hidden rounded-lg border border-white/10 bg-[#111816]">
                      <div className="relative aspect-[4/3] bg-black/30">
                        <Image
                          src={image || Logo}
                          alt={image ? host.name : ""}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 300px"
                          unoptimized={Boolean(image)}
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold">{host.name}</h3>
                        <p className="mt-1 text-sm text-[#48d4c1]">{host.role}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            <Link href="/team" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#48d4c1] hover:text-white">
              Meet the full team <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#111816] p-6 sm:p-8">
            <SectionHeading
              eyebrow="Your voice matters"
              title="Join the conversation"
              description="Send a song request or message the station using one of our published channels."
            />
            <div className="flex flex-wrap gap-3">
              {safeWhatsappUrl && whatsappUrl && (
                <a
                  href={safeWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#48d4c1] px-5 text-sm font-extrabold text-[#062521] transition-colors hover:bg-[#6ae3d1]"
                >
                  <FaWhatsapp size={17} aria-hidden="true" /> Message on WhatsApp
                </a>
              )}
              {emailHref && (
                <a
                  href={`${emailHref}?subject=${encodeURIComponent("Message for CBM Radio")}&body=${encodeURIComponent("Hi CBM Radio,\n\n")}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition-colors hover:border-[#48d4c1] hover:text-[#48d4c1]"
                >
                  <Mail size={16} aria-hidden="true" /> Send an email
                </a>
              )}
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition-colors hover:border-[#48d4c1] hover:text-[#48d4c1]"
                >
                  <Headphones size={16} aria-hidden="true" /> Call the station
                </a>
              )}
              {!safeWhatsappUrl && !emailHref && !phoneHref && (
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#48d4c1] px-5 text-sm font-extrabold text-[#062521] transition-colors hover:bg-[#6ae3d1]"
                >
                  Contact CBM Radio <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
            {contactStatus === "error" && !safeWhatsappUrl && !emailHref && !phoneHref && (
              <p className="mt-4 text-sm text-white/55">Contact channels could not be loaded. The contact page may have the latest details.</p>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-[#111816] p-6 sm:p-8">
            <div className="flex items-center gap-3 text-[#48d4c1]">
              <Handshake size={20} aria-hidden="true" />
              <p className="text-xs font-extrabold uppercase tracking-[0.2em]">Partner with CBM</p>
            </div>
            {sponsorStatus === "loading" && <p className="mt-4 text-sm text-white/65" aria-live="polite">Loading partner information...</p>}
            {sponsorStatus === "error" && <p className="mt-4 text-sm text-white/65">Partner information is temporarily unavailable.</p>}
            <h2 className="mt-4 text-2xl font-black">{sponsor?.title || "Let’s create something together."}</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {sponsor?.body || "Connect with CBM Radio to explore sponsorships, partnerships, and ways to reach our community."}
            </p>
            {sponsorImage && (
              <div className="relative mt-5 aspect-[16/7] overflow-hidden rounded-md bg-black/30">
                <Image src={sponsorImage} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized className="object-cover" />
              </div>
            )}
            <Link
              href={sponsorHref || "/contact"}
              target={sponsorHref?.startsWith("http") ? "_blank" : undefined}
              rel={sponsorHref?.startsWith("http") ? "noreferrer" : undefined}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#48d4c1] hover:text-white"
            >
              {sponsor?.cta_label || "Explore partnerships"} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-8 rounded-lg border border-white/10 bg-[#111816] p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-3 text-[#48d4c1]">
                <Music2 size={20} aria-hidden="true" />
                <p className="text-xs font-extrabold uppercase tracking-[0.2em]">Stay in the loop</p>
              </div>
              <h2 className="mt-4 text-2xl font-black">Get CBM updates</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Keep up with new programs, stories, and station announcements.
              </p>
              {newsletterUrl ? (
                <a href={newsletterUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#48d4c1] px-5 text-sm font-extrabold text-[#062521] transition-colors hover:bg-[#6ae3d1]">
                  Sign up for updates <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : emailHref ? (
                <a href={`${emailHref}?subject=${encodeURIComponent("Join the CBM Radio newsletter")}`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#48d4c1] px-5 text-sm font-extrabold text-[#062521] transition-colors hover:bg-[#6ae3d1]">
                  Ask to join the newsletter <Mail size={16} aria-hidden="true" />
                </a>
              ) : (
                <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#48d4c1] px-5 text-sm font-extrabold text-[#062521] transition-colors hover:bg-[#6ae3d1]">
                  Ask about updates <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              )}
              {rawNewsletterUrl && !newsletterUrl && (
                <p className="mt-3 text-sm text-amber-200" role="status">
                  The configured newsletter URL is invalid; please use the contact option instead.
                </p>
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 text-[#48d4c1]">
                <Users size={20} aria-hidden="true" />
                <p className="text-xs font-extrabold uppercase tracking-[0.2em]">Follow CBM</p>
              </div>
              {socialStatus === "loading" && <p className="mt-4 text-sm text-white/65" aria-live="polite">Loading social channels...</p>}
              {socialStatus === "error" && <p className="mt-4 text-sm text-white/65">Social channels are temporarily unavailable.</p>}
              {socialStatus === "ready" && socialLinks.length === 0 && <p className="mt-4 text-sm text-white/65">Social accounts have not been added yet.</p>}
              {socialLinks.some((link) => getSafeSocialUrl(link.url)) && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((link) => {
                    const url = getSafeSocialUrl(link.url);
                    const Icon = socialIcons[link.platform_key];
                    if (!url || !Icon) return null;
                    return (
                      <a
                        key={link.id}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.platform_label}
                        title={link.platform_label}
                        className="grid size-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#48d4c1] hover:text-[#48d4c1]"
                      >
                        <Icon size={17} aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
