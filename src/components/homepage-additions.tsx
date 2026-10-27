"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Handshake,
  Headphones,
  Mail,
  MessageSquare,
  Music2,
  Phone,
  Radio,
  Sparkles,
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
import { siteSettingsService } from "@/services/site-settings.service";
import { teamService } from "@/services/team.service";
import type { PageSection } from "@/types/hero";
import type { SiteContact, SocialLink } from "@/types/site-settings";
import type { TeamMember } from "@/types/team";
import Logo from "../../public/cbmradio.png";
import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

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

function safeWebUrl(value: string | undefined) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export default function HomepageAdditions() {
  const [hosts, setHosts] = useState<TeamMember[]>([]);
  const [hostsStatus, setHostsStatus] = useState<LoadState>("loading");
  const [sponsor, setSponsor] = useState<PageSection | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contact, setContact] = useState<SiteContact | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomepageData() {
      const [hostResult, sponsorResult, socialResult, contactResult] =
        await Promise.allSettled([
          teamService.getTeamDirectory(),
          homeService.getSponsors(),
          siteSettingsService.getSocialLinks(),
          siteSettingsService.getSiteContact(),
        ]);

      if (!isMounted) return;

      if (hostResult.status === "fulfilled") {
        setHosts(
          hostResult.value.members
            .filter((member) => member.is_active && /(presenter|host|dj|anchor)/i.test(member.role))
            .sort((a, b) => a.order - b.order),
        );
        setHostsStatus("ready");
      } else {
        setHostsStatus("error");
      }

      if (sponsorResult.status === "fulfilled") {
        setSponsor(sponsorResult.value.is_active ? sponsorResult.value : null);
      }

      if (socialResult.status === "fulfilled") {
        setSocialLinks(socialResult.value.results.filter((link) => link.is_active));
      }

      if (contactResult.status === "fulfilled") {
        setContact(contactResult.value);
      }
    }

    void loadHomepageData();
    return () => {
      isMounted = false;
    };
  }, []);

  const rawNewsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL?.trim();
  const newsletterUrl = safeWebUrl(rawNewsletterUrl);
  const emailHref = getEmailHref(contact?.business_email ?? "");
  const phoneHref = getPhoneHref(contact?.business_phone ?? "");
  const whatsappUrl = socialLinks.find((link) => link.platform_key === "whatsapp");
  const safeWhatsappUrl = whatsappUrl ? getSafeSocialUrl(whatsappUrl.url) : null;
  const sponsorImage = sponsor?.image || sponsor?.external_image_url || StudioImage;
  const sponsorHref = sponsor?.cta_url.startsWith("/")
    ? sponsor.cta_url
    : safeWebUrl(sponsor?.cta_url);

  // Take the primary featured host or first host
  const featuredHost = hosts[0];

  return (
    <section className="relative border-y border-white/10 bg-[#060a08] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#00d4a5]/10 text-[#00d4a5]">
                <Radio size={16} />
              </span>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                COMMUNITY & BROADCAST HUB
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Connect With CBM Radio
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Send an on-air shoutout, pitch a partnership, or follow our broadcast frequencies across every channel.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 text-sm font-extrabold text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521]"
          >
            Contact Station Desk <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        {/* Primary Row: On-Air Requests & Featured Presenter Spotlight */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Left: Studio Hotline & On-Air Requests */}
          <div className="cbm-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0c1613] to-[#070b09] p-6 sm:p-9 shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#62e6d4]">
                  <MessageSquare size={13} /> STUDIO HOTLINE
                </span>
                <span className="text-xs font-bold text-[#00d4a5] flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#00d4a5]" />
                  STUDIO REQUESTS
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-black sm:text-3xl text-white">
                Make a Song Request or Send a Shoutout
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Want to hear your favorite tune or shout out someone special? Reach directly into the studio booth to connect with our team.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {safeWhatsappUrl ? (
                <a
                  href={`${safeWhatsappUrl}?text=${encodeURIComponent("Hello CBM Radio! I'd like to request a song and shout out:")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 text-sm font-black text-black shadow-[0_6px_20px_rgba(37,211,102,0.25)] transition-all hover:bg-[#20ba5a] hover:scale-[1.01]"
                >
                  <FaWhatsapp size={19} aria-hidden="true" />
                  <span>WhatsApp The Studio Desk</span>
                </a>
              ) : (
                <a
                  href="https://wa.me/?text=Hello%20CBM%20Radio!"
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 text-sm font-black text-black shadow-[0_6px_20px_rgba(37,211,102,0.25)] transition-all hover:bg-[#20ba5a] hover:scale-[1.01]"
                >
                  <FaWhatsapp size={19} aria-hidden="true" />
                  <span>WhatsApp The Studio Desk</span>
                </a>
              )}

              <div className="grid grid-cols-2 gap-3">
                {phoneHref ? (
                  <a
                    href={phoneHref}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-extrabold text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                  >
                    <Phone size={15} />
                    <span>Call Booth</span>
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-extrabold text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                  >
                    <Headphones size={15} />
                    <span>Call Booth</span>
                  </Link>
                )}

                {emailHref ? (
                  <a
                    href={`${emailHref}?subject=${encodeURIComponent("Live Show Request / Message")}`}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-extrabold text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                  >
                    <Mail size={15} />
                    <span>Send Email</span>
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-extrabold text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                  >
                    <Mail size={15} />
                    <span>Send Email</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right: Featured Presenter Spotlight (Symmetrical, high-impact card) */}
          <div className="cbm-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0c1613] to-[#070b09] p-6 sm:p-9 shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#62e6d4]">
                  <Sparkles size={13} /> PRESENTER SPOTLIGHT
                </span>
                <Link
                  href="/team"
                  className="text-xs font-bold text-[#00d4a5] hover:underline flex items-center gap-1"
                >
                  Meet Full Team <ArrowUpRight size={14} />
                </Link>
              </div>

              {hostsStatus === "loading" && (
                <p className="mt-8 text-sm text-white/60">Loading featured presenter...</p>
              )}

              {featuredHost ? (
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative size-32 shrink-0 overflow-hidden rounded-2xl border-2 border-[#00d4a5]/50 bg-black/40 shadow-lg">
                    <Image
                      src={featuredHost.photo || featuredHost.external_photo_url || Logo}
                      alt={featuredHost.name}
                      fill
                      sizes="128px"
                      unoptimized={Boolean(featuredHost.photo || featuredHost.external_photo_url)}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00d4a5]">
                      {featuredHost.role || "Station Presenter"}
                    </p>
                    <h4 className="mt-1 text-2xl font-black text-white">
                      {featuredHost.name}
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-zinc-300 line-clamp-3">
                      {featuredHost.bio ||
                        "Bringing high-energy music mixes, deep cultural insights, and community stories live on air."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex items-center gap-5">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-black/40">
                    <Image src={Logo} alt="CBM Radio" fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">The CBM Presenter Team</h4>
                    <p className="mt-1 text-xs text-zinc-300">
                      Passionate journalists, cultural curators, and radio voices shaping East African media.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                Want to connect with our on-air talent?
              </span>
              <Link
                href="/team"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#00d4a5] px-4 py-2 text-xs font-black text-[#062521] hover:bg-[#48d4c1] transition"
              >
                <span>View All Hosts</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* Secondary Row: Brand Partnerships & Stay In The Loop */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          
          {/* Card: Partner with CBM */}
          <div className="cbm-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0c1412]/80 p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-[#00d4a5]">
                <Handshake size={18} />
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  COMMERCIAL & SPONSORSHIPS
                </p>
              </div>

              <h3 className="mt-4 text-2xl font-black text-white">
                {sponsor?.title || "Partner With CBM Radio"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {sponsor?.body ||
                  "Amplify your brand across our 24/7 broadcast reach, digital streams, podcasts, and community events."}
              </p>

              {sponsorImage && (
                <div className="relative mt-5 aspect-[16/7] overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <Image
                    src={sponsorImage}
                    alt="CBM Radio partnership showcase"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={typeof sponsorImage === "string"}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <Link
                href={sponsorHref || "/contact"}
                className="inline-flex items-center gap-2 text-sm font-extrabold text-[#00d4a5] hover:text-white transition-colors"
              >
                <span>{sponsor?.cta_label || "Explore Partnership Opportunities"}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Card: Follow Frequency & Newsletter Updates */}
          <div className="cbm-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0c1412]/80 p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-[#00d4a5]">
                <Music2 size={18} />
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  STATION DISPATCHES & SOCIALS
                </p>
              </div>

              <h3 className="mt-4 text-2xl font-black text-white">
                Join the CBM Community Network
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Get notified of new podcast drops, breaking news, exclusive interviews, and live event broadcasts.
              </p>

              {/* Newsletter Action */}
              <div className="mt-6">
                {newsletterUrl ? (
                  <a
                    href={newsletterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-sm font-extrabold text-[#062521] transition hover:bg-[#48d4c1]"
                  >
                    Subscribe To Newsletter <ArrowUpRight size={16} />
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-sm font-extrabold text-[#062521] transition hover:bg-[#48d4c1]"
                  >
                    Subscribe To Newsletter <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>
            </div>

            {/* Social Frequency Buttons */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Users size={14} className="text-[#00d4a5]" /> Follow Station Channels
              </p>
              <div className="flex flex-wrap gap-2.5">
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
                      className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#00d4a5] hover:bg-[#00d4a5]/10 hover:text-[#00d4a5]"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
