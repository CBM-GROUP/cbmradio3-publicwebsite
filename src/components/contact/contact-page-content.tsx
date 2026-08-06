"use client";

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
import { useEffect, useState } from "react";

import {
  getEmailHref,
  getPhoneHref,
  getSafeSocialUrl,
  isSupportedSocialPlatform,
} from "@/lib/contact-links";
import { siteSettingsService } from "@/services/site-settings.service";
import type { SiteContact, SocialLink, SocialPlatformKey } from "@/types/site-settings";

type RequestState = "loading" | "ready" | "error";

const socialIcons: Record<SocialPlatformKey, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
};

export default function ContactPageContent() {
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [contactState, setContactState] = useState<RequestState>("loading");
  const [contactRetry, setContactRetry] = useState(0);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => { if (mounted) setContactState("loading"); });
    siteSettingsService.getSiteContact().then((result) => {
      if (!mounted) return;
      setContact(result);
      setContactState("ready");
    }).catch(() => { if (mounted) setContactState("error"); });
    return () => { mounted = false; };
  }, [contactRetry]);

  useEffect(() => {
    let mounted = true;
    siteSettingsService.getSocialLinks(1).then((response) => {
      if (!mounted) return;
      setSocialLinks(response.results.filter(isUsableSocialLink));
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const phone = contact?.business_phone.trim() || "";
  const email = contact?.business_email.trim() || "";
  const address = contact?.physical_address.trim() || "";
  const hasContact = Boolean(phone || email || address);

  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-500">Contact CBM Radio</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">How to reach us</h2>
        </div>

        {contactState === "loading" && (
          <p className="min-h-48 pt-10 text-zinc-400" aria-live="polite">Loading contact information...</p>
        )}
        {contactState === "error" && (
          <div className="min-h-48 pt-10 text-zinc-400" role="alert">
            <p>Contact information is temporarily unavailable.</p>
            <button type="button" onClick={() => setContactRetry((value) => value + 1)} className="mt-4 rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-black">Retry</button>
          </div>
        )}
        {contactState === "ready" && !hasContact && (
          <p className="min-h-48 pt-10 text-zinc-400">Contact information is currently unavailable. Please check back later.</p>
        )}
        {contactState === "ready" && hasContact && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {phone && <ContactItem icon={FaPhoneAlt} label="Phone" value={phone} href={getPhoneHref(phone)} />}
            {email && <ContactItem icon={FaEnvelope} label="Email" value={email} href={getEmailHref(email)} breakWords />}
            {address && <ContactItem icon={FaMapMarkerAlt} label="Address" value={address} preserveLines />}
          </div>
        )}

        {socialLinks.length > 0 && (
          <section className="mt-16 border-t border-zinc-800 pt-10" aria-labelledby="contact-social-heading">
            <h2 id="contact-social-heading" className="text-2xl font-bold">Follow CBM Radio</h2>
            <div className="mt-6 flex flex-wrap gap-4">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.platform_key];
                const url = getSafeSocialUrl(link.url);
                if (!url) return null;
                return (
                  <a key={link.id} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-zinc-200 outline-none hover:border-teal-600 hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-300" aria-label={"Visit CBM Radio on " + link.platform_label}>
                    <Icon aria-hidden="true" /> {link.platform_label}
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, label, value, href, breakWords = false, preserveLines = false }: {
  icon: IconType;
  label: string;
  value: string;
  href?: string | null;
  breakWords?: boolean;
  preserveLines?: boolean;
}) {
  const valueClass = "mt-4 text-lg leading-7 text-zinc-300 " + (breakWords ? "break-all " : "") + (preserveLines ? "whitespace-pre-line" : "");
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <Icon className="text-2xl text-teal-500" aria-hidden="true" />
      <h3 className="mt-5 text-xl font-bold">{label}</h3>
      {href ? <a href={href} className={valueClass + " block outline-none hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-300"} aria-label={label + ": " + value}>{value}</a> : <p className={valueClass}>{value}</p>}
    </article>
  );
}

function isUsableSocialLink(link: SocialLink) {
  return link.is_active && isSupportedSocialPlatform(link.platform_key) && Boolean(getSafeSocialUrl(link.url));
}
