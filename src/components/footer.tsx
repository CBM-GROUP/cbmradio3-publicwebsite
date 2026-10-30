"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Headphones, Images, Newspaper, Radio } from "lucide-react";
import type { IconType } from "react-icons";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import {
  contactNavigationItem,
  legalNavigation,
  primaryNavigation,
} from "@/data/site-navigation";
import { getSafeSocialUrl } from "@/lib/contact-links";
import homeService from "@/services/home.service";
import { siteSettingsService } from "@/services/site-settings.service";
import type { ProgramSummary } from "@/types/program";
import type { SiteContact, SocialLink } from "@/types/site-settings";
import CBMlogo from "../../public/cbmradio.png";

const MAX_FOOTER_PROGRAMS = 6;

const socialIcons: Partial<Record<string, IconType>> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
};

const footerDestinations = [
  {
    label: "Programs",
    detail: "Original Shows",
    href: "/programs",
    icon: Radio,
    color: "bg-[#04b093]",
    textColor: "text-[#07100f]",
    detailColor: "text-black/70",
  },
  {
    label: "Episodes",
    detail: "Listen to CBM",
    href: "/episodes",
    icon: Headphones,
    color: "bg-white",
    textColor: "text-[#07100f]",
    detailColor: "text-black/70",
  },
  {
    label: "News",
    detail: "Stories and updates",
    href: "/news",
    icon: Newspaper,
    color: "bg-white",
    textColor: "text-[#07100f]",
    detailColor: "text-black/70",
  },
  {
    label: "Gallery",
    detail: "Moments from CBM",
    href: "/gallery",
    icon: Images,
    color: "bg-[#04b093]",
    textColor: "text-[#07100f]",
    detailColor: "text-black/70",
  },
];

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFooterData() {
      const [socialResult, contactResult, programResult] =
        await Promise.allSettled([
          siteSettingsService.getSocialLinks(),
          siteSettingsService.getSiteContact(),
          homeService.getFeaturedPrograms(),
        ]);

      if (!isMounted) return;

      if (socialResult.status === "fulfilled") {
        setSocialLinks(
          socialResult.value.results.filter((link) => link.is_active),
        );
      }

      if (contactResult.status === "fulfilled") {
        setContact(contactResult.value);
      }

      if (programResult.status === "fulfilled") {
        setPrograms(programResult.value.slice(0, MAX_FOOTER_PROGRAMS));
      }

      setLoading(false);
    }

    void loadFooterData();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasContact = Boolean(
    contact?.physical_address ||
      contact?.business_phone ||
      contact?.business_email,
  );

  return (
    <footer className="border-t-4 border-black bg-black text-white">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-5 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-14">
        <section className="lg:col-span-3">
          <Link href="/" aria-label="CBM Radio home" className="inline-flex items-center gap-3">
            <Image src={CBMlogo} alt="" width={96} height={96} className="h-20 w-20 object-cover" />
            <span>
              <span className="block text-2xl font-black">CBM Radio</span>
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-6 text-white/85">
            CBM Radio delivers trusted news, quality entertainment, educational programs and community-driven stories that inform, inspire and connect our listeners.
          </p>

        </section>

        <nav aria-label="Featured pages" className="grid grid-cols-2 gap-3 sm:col-span-1 lg:col-span-5">
          {footerDestinations.map((destination) => {
            const DestinationIcon = destination.icon;
            return (
              <Link
                key={destination.href}
                href={destination.href}
                className={`group flex min-h-32 flex-col justify-between rounded-md p-4 transition-transform hover:-translate-y-1 ${destination.color} ${destination.textColor}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <DestinationIcon size={23} strokeWidth={2.2} aria-hidden="true" />
                  <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
                <span>
                  <span className="block text-lg font-extrabold">{destination.label}</span>
                  <span className={`mt-0.5 block text-xs font-medium ${destination.detailColor}`}>{destination.detail}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <nav aria-label="Site links" className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[#04b093]">Explore</h3>
          <ul className="space-y-2.5">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white/85 transition-colors hover:text-[#04b093]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="md:col-span-2 lg:col-span-2">
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[#04b093]">Featured programs</h3>
          {programs.length > 0 ? (
            <ul className="space-y-2.5">
              {programs.map((program) => (
                <li key={program.id}>
                  <Link href="/programs" className="text-sm text-white/85 transition-colors hover:text-[#04b093]">
                    {program.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-white/75" aria-live="polite">
              {loading ? "Loading featured programs..." : "Featured programs are currently unavailable."}
            </p>
          )}

          <h3 className="mb-3 mt-7 text-sm font-extrabold uppercase tracking-[0.16em] text-[#04b093]">Contact</h3>
          {hasContact ? (
            <address className="space-y-3 text-sm not-italic text-white/85">
              {contact?.physical_address && <p className="flex gap-2"><FaMapMarkerAlt className="mt-1 shrink-0 text-[#04b093]" aria-hidden="true" />{contact.physical_address}</p>}
              {contact?.business_phone && <a href={"tel:" + contact.business_phone.replace(/[^+\d]/g, "")} className="flex gap-2 break-words hover:text-[#04b093]"><FaPhoneAlt className="mt-1 shrink-0 text-[#04b093]" aria-hidden="true" />{contact.business_phone}</a>}
              {contact?.business_email && <a href={"mailto:" + contact.business_email} className="flex gap-2 break-all hover:text-[#04b093]"><FaEnvelope className="mt-1 shrink-0 text-[#04b093]" aria-hidden="true" />{contact.business_email}</a>}
            </address>
          ) : (
            <p className="text-sm leading-6 text-white/75" aria-live="polite">
              {loading ? "Loading contact information..." : "Contact information is currently unavailable."}
            </p>
          )}
          <Link href={contactNavigationItem.href} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#04b093] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#062521] transition-colors hover:bg-[#05c6a5]">
            Contact us <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-6 sm:px-8 sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#04b093]">
            Follow CBM Radio
          </p>
          <div className="flex flex-wrap items-center gap-3" aria-label="Social media">
            {(() => {
              const configuredLinks = socialLinks.flatMap((socialLink) => {
                const SocialIcon = socialIcons[socialLink.platform_key];
                const socialUrl = getSafeSocialUrl(socialLink.url);
                return SocialIcon && socialUrl
                  ? [{ key: socialLink.id, label: socialLink.platform_label, Icon: SocialIcon, url: socialUrl }]
                  : [];
              });

              if (configuredLinks.length > 0) {
                return configuredLinks.map(({ key, label, Icon, url }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={"Visit CBM Radio on " + label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[#04b093]/50 bg-[#04b093]/10 text-[#04b093] transition-colors hover:border-[#04b093] hover:bg-[#04b093] hover:text-[#062521]"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ));
              }

              return Object.entries(socialIcons).map(([platform, Icon]) => {
                if (!Icon) return null;

                return (
                  <span
                    key={platform}
                    title={platform}
                    aria-label={platform}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[#04b093]/40 bg-[#04b093]/10 text-[#04b093]"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                );
              });
            })()}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-5 text-xs text-white/75 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>&copy; {new Date().getFullYear()} CBM Radio. All Rights Reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-[#04b093]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
