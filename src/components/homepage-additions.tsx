"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Handshake,
  Mail,
  MessageSquare,
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

    Promise.allSettled([
      homeService.getSponsors(),
      siteSettingsService.getSocialLinks(),
      siteSettingsService.getSiteContact(),
    ]).then(([sponsorResult, socialResult, contactResult]) => {
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
    });

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
      className="relative scroll-mt-20 border-b border-white/10 bg-[#08090a] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Header Strip */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#00d4a5]">
              <span>INDEX 06</span>
              <span className="text-white/20">/</span>
              <span>CONNECT & COLLABORATE</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              The CBM Listener & Partner Hub
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Connect directly with our community on WhatsApp, receive episode dispatch alerts, or discuss brand collaborations.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5] w-fit"
          >
            <span>Contact Studio</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* 2-Column Broadsheet Panels */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Panel 1: Community Network & Channels */}
          <div className="border border-white/10 bg-[#0e1013] p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00d4a5]">
                  <MessageSquare size={14} />
                  <span>COMMUNITY DISPATCH</span>
                </span>
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-zinc-500">
                  WHATSAPP CHANNEL
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-white sm:text-3xl">
                Join the CBM WhatsApp Channel
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Receive instant notifications when new episodes and interviews drop, participate in community discussions, and share episode reactions directly with our hosts.
              </p>

              {/* WhatsApp Action */}
              <div className="mt-8">
                {safeWhatsappUrl ? (
                  <a
                    href={safeWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 w-full items-center justify-center gap-2.5 bg-[#25D366] px-6 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#20ba5a]"
                  >
                    <FaWhatsapp size={18} />
                    <span>Join CBM on WhatsApp</span>
                  </a>
                ) : (
                  <a
                    href="https://wa.me/?text=Hello%20CBM%20Radio!"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 w-full items-center justify-center gap-2.5 bg-[#25D366] px-6 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#20ba5a]"
                  >
                    <FaWhatsapp size={18} />
                    <span>Join CBM on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Social Channels Row */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[0.68rem] font-black uppercase tracking-wider text-zinc-500">
                    OFFICIAL STATION CHANNELS
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
                          className="grid size-9 place-items-center border border-white/15 bg-white/5 text-zinc-300 transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                        >
                          <Icon size={14} />
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
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 border border-white/20 bg-transparent px-4 text-xs font-bold uppercase tracking-wider text-white hover:border-[#00d4a5] hover:text-[#00d4a5] transition"
                  >
                    <Mail size={13} />
                    <span>Subscribe</span>
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 border border-white/20 bg-transparent px-4 text-xs font-bold uppercase tracking-wider text-white hover:border-[#00d4a5] hover:text-[#00d4a5] transition"
                  >
                    <Mail size={13} />
                    <span>Contact Us</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Panel 2: Studio Partnerships & Media Collaborations */}
          <div className="border border-white/10 bg-[#0e1013] p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00d4a5]">
                  <Handshake size={14} />
                  <span>COMMERCIAL & SPONSORSHIPS</span>
                </span>
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-zinc-500">
                  BRAND PARTNERS
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-white sm:text-3xl">
                {sponsor?.title || "Sponsor an Original CBM Series"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {sponsor?.body ||
                  "Connect your brand or organization with engaged listeners across our on-demand podcasts, video episodes, and regional cultural media."}
              </p>

              {sponsorImage && (
                <div className="relative mt-6 aspect-[16/8] w-full overflow-hidden bg-black/60 border border-white/10">
                  <Image
                    src={sponsorImage}
                    alt="Sponsorship showcase"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={typeof sponsorImage === "string"}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] hover:bg-[#34e2b8] transition"
              >
                <span>{sponsor?.cta_label || "Explore Partnerships"}</span>
                <ArrowUpRight size={14} />
              </Link>

              {emailHref && (
                <a
                  href={emailHref}
                  className="inline-flex items-center gap-1.5 font-bold text-zinc-400 hover:text-white transition"
                >
                  <Mail size={13} className="text-[#00d4a5]" />
                  <span>Email Production Desk</span>
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
