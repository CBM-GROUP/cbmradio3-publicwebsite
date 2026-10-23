"use client";

import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { siteSettingsService } from "@/services/site-settings.service";
import type { SiteContact } from "@/types/site-settings";

export default function Contact() {
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    let isMounted = true;
    siteSettingsService.getSiteContact().then((result) => {
      if (!isMounted) return;
      setContact(result);
      setStatus("ready");
    }).catch(() => { if (isMounted) setStatus("error"); });
    return () => { isMounted = false; };
  }, []);
  const hasContact = Boolean(contact?.physical_address || contact?.business_phone || contact?.business_email);

  return (
    <section id="contact" className="scroll-mt-24 border-y border-white/10 bg-[#090d0c] px-5 py-16 text-white sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-10">
          <div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">Talk to CBM</p><h2 className="text-3xl font-black text-white sm:text-4xl">Get in touch</h2><p className="mt-4 max-w-md leading-7 text-white/75">Have questions about our programs or want to get involved? Use the current contact details below.</p></div>
          {status === "loading" && <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-8 text-white/70" aria-live="polite">Loading contact information...</p>}
          {status === "error" && <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-8 text-white/75">Contact information is temporarily unavailable.</p>}
          {status === "ready" && !hasContact && <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-8 text-white/75">Contact information is not available right now.</p>}
          {hasContact && contact && (
            <div className="space-y-8">
              {contact.physical_address && <ContactDetail icon={<FaMapMarkerAlt size={22} />} title="Address"><p>{contact.physical_address}</p></ContactDetail>}
              {contact.business_phone && <ContactDetail icon={<FaPhone size={22} />} title="Phone"><a href={"tel:" + contact.business_phone.replace(/[^+\d]/g, "")} className="hover:text-teal-400">{contact.business_phone}</a></ContactDetail>}
              {contact.business_email && <ContactDetail icon={<FaEnvelope size={22} />} title="Email"><a href={"mailto:" + contact.business_email} className="break-all hover:text-teal-400">{contact.business_email}</a></ContactDetail>}
            </div>
          )}
        </div>
        <div className="rounded-lg border border-white/15 bg-[#111816] p-6 sm:p-8 lg:p-10"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#48d4c1]">Stay connected</p><h2 className="mt-3 text-2xl font-bold text-white">Messaging unavailable</h2><p className="mt-4 leading-7 text-white/75">Online message submission is not available yet. Please contact CBM Radio by phone or email using the published details.</p></div>
      </div>
    </section>
  );
}

function ContactDetail({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <div className="flex items-start gap-4"><div className="mt-1 text-[#48d4c1]" aria-hidden="true">{icon}</div><div className="text-white/80"><h3 className="text-lg font-semibold text-white">{title}</h3>{children}</div></div>;
}
