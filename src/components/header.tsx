"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  Home,
  Images,
  Info,
  Menu,
  Newspaper,
  Radio,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import CBMlogo from "../../public/cbmradio.png";
import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

const navMeta: Record<string, { icon: LucideIcon; detail: string }> = {
  "/": { icon: Home, detail: "Back to the start" },
  "/about": { icon: Info, detail: "Who we are" },
  "/team": { icon: Users, detail: "Meet the voices" },
  "/programs": { icon: Radio, detail: "Find your frequency" },
  "/charts": { icon: BarChart3, detail: "What's trending" },
  "/news": { icon: Newspaper, detail: "Stories and updates" },
  "/gallery": { icon: Images, detail: "Moments from CBM" },
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div
          className={`relative flex items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-6 ${
            isScrolled
              ? "border-white/15 bg-[#070e0c]/90 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              : "border-white/10 bg-[#091210]/75 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-lg"
          }`}
        >
          {/* Left: Brand Logo & Live Beacon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[#00d4a5] transition-colors hover:border-[#00d4a5] hover:bg-[#00d4a5]/10 lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4a5]"
            >
              {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>

            <Link
              href="/"
              aria-label="CBM Radio home"
              className="flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4a5]"
            >
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#00d4a5]/40 p-0.5 shadow-[0_0_12px_rgba(0,212,165,0.25)]">
                <Image
                  src={CBMlogo}
                  alt="CBM Radio logo"
                  fill
                  priority
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="block text-base font-black tracking-tight text-white leading-none">
                  CBM <span className="text-[#00d4a5]">RADIO</span>
                </span>
                <span className="mt-0.5 block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/50">
                  98.5 FM & DIGITAL
                </span>
              </div>
            </Link>

            {/* Live Beacon Pill */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span>LIVE ON AIR</span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="Desktop navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/charts", label: "Charts" },
              { href: "/programs", label: "Shows" },
              { href: "/episodes", label: "Podcasts" },
              { href: "/news", label: "News" },
              { href: "/gallery", label: "Moments" },
              { href: "/team", label: "Presenters" },
            ].map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-[#00d4a5]/15 text-[#00d4a5] border border-[#00d4a5]/30 shadow-[0_0_12px_rgba(0,212,165,0.2)]"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Contact & Quick Links */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open full navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="hidden lg:grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-[#00d4a5] hover:text-[#00d4a5]"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link
              href={contactNavigationItem.href}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#00d4a5] px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#062521] shadow-[0_4px_16px_rgba(0,212,165,0.25)] transition-all hover:bg-[#48d4c1] hover:scale-105"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Modal Backdrop for Full Menu Drawer */}
        {isMenuOpen &&
          createPortal(
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 h-full w-full cursor-default bg-black/75 backdrop-blur-sm animate-in fade-in"
            />,
            document.body,
          )}

        {/* Slide-out / Dropdown Menu Drawer */}
        <div
          inert={!isMenuOpen}
          aria-hidden={!isMenuOpen}
          className={`absolute left-4 right-4 top-full mt-2 rounded-2xl border border-white/15 bg-[#091210]/95 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 sm:left-8 sm:right-8 sm:p-7 ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              Explore CBM Frequency
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <nav
            id="mobile-navigation"
            aria-label="Full navigation"
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {primaryNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href + "/"));
              const Icon = navMeta[item.href]?.icon ?? Home;
              const detail = navMeta[item.href]?.detail ?? "";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex min-h-24 flex-col justify-between rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                    isActive
                      ? "border-[#00d4a5] bg-[#00d4a5]/15 text-white shadow-[0_0_15px_rgba(0,212,165,0.2)]"
                      : "border-white/10 bg-white/[0.03] text-white hover:border-[#00d4a5]/50 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <Icon size={20} className="text-[#00d4a5]" />
                    <ArrowUpRight
                      size={16}
                      className="text-white/40 group-hover:text-[#00d4a5] transition-colors"
                    />
                  </div>
                  <div>
                    <span className="block text-base font-extrabold">{item.label}</span>
                    <span className="block text-xs text-white/50">{detail}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
