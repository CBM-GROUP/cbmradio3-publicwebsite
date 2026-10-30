"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Radio,
  Send,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { siteSettingsService } from "@/services/site-settings.service";
import type { SiteContact } from "@/types/site-settings";

export default function Contact() {
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;
    siteSettingsService
      .getSiteContact()
      .then((result) => {
        if (!isMounted) return;
        setContact(result);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  const whatsappNumber =
    contact?.business_phone?.replace(/[^+\d]/g, "") || "+256700000000";

  return (
    <section id="contact" className="scroll-mt-24 relative border-y border-white/10 bg-[#070b09] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-96 w-full max-w-7xl bg-[radial-gradient(ellipse_at_top,rgba(4,176,147,0.1)_0%,transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#04b093]/40 bg-[#04b093]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">
              <Radio size={14} />
              <span>Studio & Inquiries</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Connect With CBM Radio
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Reach our on-air studio, pitch programs, submit music for chart review, or explore commercial broadcast sponsorships.
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#062521] shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all hover:scale-105 hover:bg-[#2fe671] w-fit"
          >
            <FaWhatsapp size={18} />
            <span>Direct WhatsApp Desk</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* 2-Column Suite: Verified Coordinates + Interactive Listener Portal */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Coordinates & Studio Info (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            {/* Quick Station Stats Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0a120f]/80 p-6 shadow-xl backdrop-blur-md">
              <span className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                STATION HEADQUARTERS
              </span>
              <h3 className="mt-2 text-xl font-black text-white">
                Live Broadcast Center
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Broadcasting round-the-clock across East Africa and streaming globally on digital platforms.
              </p>

              <div className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#04b093]/10 text-[#04b093]">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white/50 uppercase tracking-wider">Physical Studio</span>
                    <span className="font-semibold text-white">
                      {contact?.physical_address || "CBM Media Tower, Kampala, Uganda"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#04b093]/10 text-[#04b093]">
                    <Phone size={17} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white/50 uppercase tracking-wider">Studio Hotline</span>
                    <a
                      href={`tel:${contact?.business_phone?.replace(/[^+\d]/g, "") || "+256700000000"}`}
                      className="font-semibold text-white hover:text-[#04b093] transition-colors"
                    >
                      {contact?.business_phone || "+256 700 000 000"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#04b093]/10 text-[#04b093]">
                    <Mail size={17} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white/50 uppercase tracking-wider">Official Email</span>
                    <a
                      href={`mailto:${contact?.business_email || "studio@cbmradio.com"}`}
                      className="font-semibold text-white hover:text-[#04b093] transition-colors break-all"
                    >
                      {contact?.business_email || "studio@cbmradio.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#04b093]/10 text-[#04b093]">
                    <Clock size={17} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white/50 uppercase tracking-wider">On-Air Hours</span>
                    <span className="font-semibold text-white">
                      24 Hours / 7 Days a Week Live Broadcast
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Direct Inquiries Box */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c1814] to-[#070e0b] p-6 shadow-md">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#04b093]">
                <Sparkles size={14} /> Sponsorships & Collaborations
              </span>
              <p className="mt-2 text-xs text-zinc-300">
                Partner with CBM Radio to amplify your brand across our loyal multi-platform audience.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[0.68rem] font-bold text-white/80">
                  Digital Advertising
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[0.68rem] font-bold text-white/80">
                  Program Underwriting
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Listener Inquiries Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/15 bg-[#09120f]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                    DIRECT MESSAGE DESK
                  </span>
                  <h3 className="mt-1 text-xl font-black text-white">
                    Send a Message to the Station
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Headphones size={14} className="text-[#04b093]" />
                  <span>Listener Support</span>
                </div>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#04b093]/20 text-[#04b093]">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl font-black text-white">
                    Message Received!
                  </h4>
                  <p className="mx-auto max-w-md text-sm text-zinc-400">
                    Thank you for reaching out, <span className="text-white font-bold">{formData.name}</span>. Our studio editorial team will review your inquiry and follow up via email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: "", email: "", topic: "general", message: "" });
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:border-[#04b093] hover:text-[#04b093] transition-all"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="e.g. Alex Mugisha"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#04b093] focus:outline-none focus:ring-1 focus:ring-[#04b093]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#04b093] focus:outline-none focus:ring-1 focus:ring-[#04b093]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                      Inquiry Subject
                    </label>
                    <select
                      id="contact-topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-[#0b1411] px-4 py-3 text-sm text-white focus:border-[#04b093] focus:outline-none focus:ring-1 focus:ring-[#04b093]"
                    >
                      <option value="general">General Listener Feedback</option>
                      <option value="music">Music Submission / Chart Request</option>
                      <option value="sponsorship">Commercial Sponsorship & Ads</option>
                      <option value="interview">Guest Pitch / Program Proposal</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Share your thoughts, music recommendations, or partnership inquiry with our team..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#04b093] focus:outline-none focus:ring-1 focus:ring-[#04b093]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#04b093] px-6 text-xs font-black uppercase tracking-wider text-[#062521] shadow-[0_8px_25px_rgba(4,176,147,0.3)] transition-all hover:bg-[#05c6a5] hover:shadow-[0_12px_32px_rgba(4,176,147,0.4)] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Sending note...</span>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send to CBM Studio</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
