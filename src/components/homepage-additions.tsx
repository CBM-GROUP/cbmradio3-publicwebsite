"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Handshake,
  Mail,
  MessageCircle,
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

import { getEmailHref, getSafeSocialUrl } from "@/lib/contact-links";
import homeService from "@/services/home.service";
import { siteSettingsService } from "@/services/site-settings.service";
import type { PageSection } from "@/types/hero";
import type { SiteContact, SocialLink } from "@/types/site-settings";
import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

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
  const [sponsor, setSponsor] = useState<PageSection | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contact, setContact] = useState<SiteContact | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCommunityData() {
      const [sponsorResult, socialResult, contactResult] =
        await Promise.allSettled([
          homeService.getSponsors(),
          siteSettingsService.getSocialLinks(),
          siteSettingsService.getSiteContact(),
        ]);

      if (!isMounted) return;

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

    void loadCommunityData();
    return () => {
      isMounted = false;
    };
  }, []);

  const rawNewsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL?.trim();
  const newsletterUrl = safeWebUrl(rawNewsletterUrl);
  const emailHref = getEmailHref(contact?.business_email ?? "");
  const whatsappUrl = socialLinks.find((link) => link.platform_key === "whatsapp");
  const safeWhatsappUrl = whatsappUrl ? getSafeSocialUrl(whatsappUrl.url) : null;
  const sponsorImage = sponsor?.image || sponsor?.external_image_url || StudioImage;

  return (
    <section
      id="community"
      className="relative scroll-mt-20 border-b border-white/10 bg-[#060a08] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              <Users size={14} />
              <span>Connect & Partner</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Join the CBM Community
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Get notified of new podcast releases, connect with our creators, or explore creative brand partnerships.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 text-xs font-black uppercase tracking-wider text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521] w-fit"
          >
            <span>Contact Studio</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {/* 2-Column High-Impact Clean Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Card 1: Community Network & Channels */}
          <div className="cbm-card relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0c1613] to-[#070b09] p-7 sm:p-10 shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#62e6d4]">
                  <MessageCircle size={13} /> COMMUNITY CHANNEL
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#00d4a5]">
                  <span className="size-2 rounded-full bg-[#00d4a5]" />
                  ALWAYS ACTIVE
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-black sm:text-3xl text-white">
                Connect Directly on WhatsApp
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Join our listener community on WhatsApp to receive new episode notifications, share your thoughts on recent topics, and connect with other listeners.
              </p>

              {/* WhatsApp Action Button */}
              <div className="mt-8">
                {safeWhatsappUrl ? (
                  <a
                    href={safeWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 text-sm font-black text-black shadow-[0_6px_20px_rgba(37,211,102,0.25)] transition-all hover:bg-[#20ba5a] hover:scale-[1.01]"
                  >
                    <FaWhatsapp size={20} aria-hidden="true" />
                    <span>Join CBM Community on WhatsApp</span>
                  </a>
                ) : (
                  <a
                    href="https://wa.me/?text=Hello%20CBM%20Radio!"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 text-sm font-black text-black shadow-[0_6px_20px_rgba(37,211,102,0.25)] transition-all hover:bg-[#20ba5a] hover:scale-[1.01]"
                  >
                    <FaWhatsapp size={20} aria-hidden="true" />
                    <span>Join CBM Community on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Social Media Links & Newsletter */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Follow CBM Channels
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
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
                          className="grid size-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#00d4a5] hover:bg-[#00d4a5]/10 hover:text-[#00d4a5]"
                        >
                          <Icon size={15} aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {newsletterUrl ? (
                  <a
                    href={newsletterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-black uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                  >
                    <Mail size={14} />
                    <span>Newsletter</span>
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-black uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                  >
                    <Mail size={14} />
                    <span>Get In Touch</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Commercial & Sponsorship Partnerships */}
          <div className="cbm-card relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0c1613] to-[#070b09] p-7 sm:p-10 shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#62e6d4]">
                  <Handshake size={13} /> PARTNERSHIPS & MEDIA
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  SPONSORSHIPS
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-black sm:text-3xl text-white">
                {sponsor?.title || "Partner With CBM Radio"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {sponsor?.body ||
                  "Amplify your organization or brand across our podcast episodes, video series, and digital platforms with targeted cultural reach."}
              </p>

              {/* Partner Highlight Image */}
              {sponsorImage && (
                <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <Image
                    src={sponsorImage}
                    alt="CBM Radio partnership showcase"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={typeof sponsorImage === "string"}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              )}
            </div>

            {/* Partner Action Row */}
            <div className="mt-8 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]"
              >
                <span>{sponsor?.cta_label || "Explore Partnerships"}</span>
                <ArrowUpRight size={15} />
              </Link>

              {emailHref && (
                <a
                  href={emailHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition"
                >
                  <Mail size={13} className="text-[#00d4a5]" />
                  <span>Email Studio Team</span>
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
