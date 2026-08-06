"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  primaryNavigation,
} from "@/data/site-navigation";
import homeService from "@/services/home.service";
import { siteSettingsService } from "@/services/site-settings.service";
import type { ProgramSummary } from "@/types/program";
import type { SiteContact, SocialLink } from "@/types/site-settings";

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

function getSafeSocialUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

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
    <footer className="bg-zinc-800/20 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-3xl font-bold text-emerald-500">CBM Radio</h2>

          <p className="mt-5 leading-7 text-gray-400">
            CBM Radio is committed to delivering trusted news, quality
            entertainment, educational programs and community-driven content
            that informs, inspires and connects our listeners.
          </p>

          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {socialLinks.map((socialLink) => {
                const SocialIcon = socialIcons[socialLink.platform_key];
                const socialUrl = getSafeSocialUrl(socialLink.url);
                if (!SocialIcon || !socialUrl) return null;

                return (
                  <a
                    key={socialLink.id}
                    href={socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      "Visit CBM Radio on " + socialLink.platform_label
                    }
                    className="rounded-full bg-emerald-600 p-3 transition hover:bg-white hover:text-emerald-600"
                  >
                    <SocialIcon aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold text-white">Quick Links</h3>

          <ul className="space-y-3">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-emerald-500">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={contactNavigationItem.href}
                className="hover:text-emerald-500"
              >
                {contactNavigationItem.label}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold text-white">
            Featured Programs
          </h3>

          {programs.length > 0 ? (
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.id}>
                  <Link href="/programs" className="hover:text-emerald-500">
                    {program.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400" aria-live="polite">
              {loading
                ? "Loading featured programs..."
                : "Featured programs are currently unavailable."}
            </p>
          )}
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold text-white">Contact Us</h3>

          {hasContact ? (
            <div className="space-y-5">
              {contact?.physical_address && (
                <div className="flex gap-3">
                  <FaMapMarkerAlt
                    className="mt-1 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                  <p>{contact.physical_address}</p>
                </div>
              )}

              {contact?.business_phone && (
                <div className="flex gap-3">
                  <FaPhoneAlt
                    className="mt-1 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                  <a
                    href={
                      "tel:" +
                      contact.business_phone.replace(/[^+\d]/g, "")
                    }
                    className="wrap-break-word hover:text-emerald-500"
                  >
                    {contact.business_phone}
                  </a>
                </div>
              )}

              {contact?.business_email && (
                <div className="flex gap-3">
                  <FaEnvelope
                    className="mt-1 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                  <a
                    href={"mailto:" + contact.business_email}
                    className="break-all hover:text-emerald-500"
                  >
                    {contact.business_email}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400" aria-live="polite">
              {loading
                ? "Loading contact information..."
                : "Contact information is currently unavailable."}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-5 text-sm md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} CBM Radio. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
