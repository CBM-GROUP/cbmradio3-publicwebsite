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
    <section className="bg-[#04b093] px-4 py-16 text-black sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-black px-4 py-1 text-xs font-black uppercase tracking-wider text-[#04b093]">
            Contact CBM Radio
          </span>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-black sm:text-5xl">How to reach us</h2>
        </div>

        {contactState === "loading" && (
          <p className="min-h-48 pt-10 text-center text-xs font-black uppercase tracking-wider text-black/70" aria-live="polite">Loading contact information...</p>
        )}
        {contactState === "error" && (
          <div className="min-h-48 pt-10 text-center font-bold text-black" role="alert">
            <p className="text-lg">Contact information is temporarily unavailable.</p>
            <button type="button" onClick={() => setContactRetry((value) => value + 1)} className="mt-4 rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black">Retry</button>
          </div>
        )}
        {contactState === "ready" && !hasContact && (
          <p className="min-h-48 pt-10 font-bold text-black">Contact information is currently unavailable. Please check back later.</p>
        )}
        {contactState === "ready" && hasContact && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {phone && <ContactItem icon={FaPhoneAlt} label="Phone" value={phone} href={getPhoneHref(phone)} />}
            {email && <ContactItem icon={FaEnvelope} label="Email" value={email} href={getEmailHref(email)} breakWords />}
            {address && <ContactItem icon={FaMapMarkerAlt} label="Address" value={address} preserveLines />}
          </div>
        )}

        {socialLinks.length > 0 && (
          <section className="mt-16 border-t-2 border-black pt-10" aria-labelledby="contact-social-heading">
            <span className="inline-block rounded-full bg-black px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#04b093]">
              Connect With Us
            </span>
            <h2 id="contact-social-heading" className="mt-3 text-2xl font-black uppercase tracking-tight text-black">Follow CBM Radio</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.platform_key];
                const url = getSafeSocialUrl(link.url);
                if (!url) return null;
                return (
                  <a key={link.id} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-full border-2 border-black bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-[#04b093] shadow-md transition-all hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-black" aria-label={"Visit CBM Radio on " + link.platform_label}>
                    <Icon aria-hidden="true" className="text-base" /> {link.platform_label}
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
  const valueClass = "mt-3 text-base font-bold leading-relaxed text-zinc-300 " + (breakWords ? "break-all " : "") + (preserveLines ? "whitespace-pre-line" : "");
  return (
    <article className="cbm-card rounded-2xl border-2 border-black bg-black p-8 text-white shadow-2xl">
      <div className="flex size-12 items-center justify-center rounded-xl bg-[#04b093] text-black text-xl">
        <Icon aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-black uppercase tracking-tight text-white">{label}</h3>
      {href ? <a href={href} className={valueClass + " block outline-none transition-colors hover:text-[#04b093] focus-visible:ring-2 focus-visible:ring-[#04b093]"} aria-label={label + ": " + value}>{value}</a> : <p className={valueClass}>{value}</p>}
    </article>
  );
}

function isUsableSocialLink(link: SocialLink) {
  return link.is_active && isSupportedSocialPlatform(link.platform_key) && Boolean(getSafeSocialUrl(link.url));
}
