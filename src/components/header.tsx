"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  Headphones,
  Home,
  Images,
  Info,
  Menu,
  Newspaper,
  Radio,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import CBMlogo from "../../public/cbmradio.png";
import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

const navMeta: Record<string, { icon: LucideIcon; detail: string; tag?: string }> = {
  "/": { icon: Home, detail: "Back to the start" },
  "/charts": { icon: BarChart3, detail: "What's trending now", tag: "Top 10" },
  "/programs": { icon: Radio, detail: "Lineup & schedules", tag: "On Air" },
  "/episodes": { icon: Headphones, detail: "Listen on demand", tag: "Catch Up" },
  "/news": { icon: Newspaper, detail: "Stories and updates" },
  "/gallery": { icon: Images, detail: "Studio snapshots" },
  "/team": { icon: Users, detail: "Meet the voices" },
  "/about": { icon: Info, detail: "Who we are" },
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Automatically close menu when navigating
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

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
      {/* Dimmed Background Backdrop for focus & click-outside close */}
      <div
        aria-hidden="true"
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div className="relative z-50 mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        {/* Main Navbar Capsule */}
        <div
          className={`relative flex items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-300 sm:px-5 sm:py-2.5 ${
            isScrolled || isMenuOpen
              ? "border-white/15 bg-[#070e0c]/95 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              : "border-white/10 bg-[#091210]/75 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-lg"
          }`}
        >
          {/* Left: 3D Hamburger Toggle & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="main-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={`group flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#04b093] sm:px-3 sm:py-2 ${
                isMenuOpen
                  ? "border-[#04b093] bg-[#04b093] text-black shadow-[0_0_18px_rgba(4,176,147,0.35)] scale-105"
                  : "border-white/15 bg-white/5 text-[#04b093] hover:border-[#04b093] hover:bg-[#04b093]/15 hover:scale-105"
              }`}
            >
              <span
                className={`inline-block transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                {isMenuOpen ? (
                  <X size={18} strokeWidth={2.6} />
                ) : (
                  <Menu size={18} strokeWidth={2.6} />
                )}
              </span>
              <span className="hidden text-xs font-black uppercase tracking-wider sm:inline-block">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
            </button>

            <Link
              href="/"
              aria-label="CBM Radio home"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#04b093] sm:gap-3"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#04b093]/40 p-0.5 shadow-[0_0_12px_rgba(4,176,147,0.25)] sm:h-10 sm:w-10">
                <Image
                  src={CBMlogo}
                  alt="CBM Radio logo"
                  fill
                  priority
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block text-sm font-black tracking-tight text-white leading-none sm:text-base">
                  CBM <span className="text-[#04b093]">RADIO</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Contact Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={contactNavigationItem.href}
              className="inline-flex items-center justify-center rounded-full bg-[#04b093] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-black shadow-[0_4px_16px_rgba(4,176,147,0.25)] transition-all hover:bg-white hover:text-black hover:scale-105 sm:px-5 sm:py-2 sm:text-xs"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Hanging 3D Animated Navigation Tray */}
        <div
          className={`absolute left-3 right-3 top-full mt-2.5 sm:left-6 sm:right-6 lg:left-8 lg:right-8 [perspective:1400px] transition-all duration-300 ${
            isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            id="main-navigation"
            role="region"
            aria-label="Site Navigation"
            className={`w-full origin-top transform-gpu overflow-hidden rounded-3xl border-2 border-black bg-gradient-to-b from-[#0e1d19]/98 via-[#091411]/98 to-[#050b09]/98 text-white shadow-[0_30px_70px_-10px_rgba(0,0,0,0.9),0_0_40px_rgba(4,176,147,0.18)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isMenuOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-[0.96] -translate-y-3"
            }`}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              transform: isMenuOpen
                ? "perspective(1400px) rotateX(0deg) translateY(0px) scale(1)"
                : "perspective(1400px) rotateX(-12deg) translateY(-14px) scale(0.96)",
            }}
          >
            {/* Top Accent Light Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#04b093] to-transparent opacity-60" />

            {/* Tray Header Bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-3.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-[#04b093]/40 bg-[#04b093]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#04b093]">
                  <Sparkles size={11} className="text-[#04b093]" />
                  <span>Explore CBM Radio</span>
                </span>
                <span className="hidden text-[11px] font-medium text-white/50 sm:inline">
                  Tune in to Gospel, Culture &amp; Music
                </span>
              </div>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white/70 transition-all hover:border-white/30 hover:bg-white/15 hover:text-white"
              >
                <span>ESC</span>
                <X size={13} />
              </button>
            </div>

            {/* 3D Tactile Grid of Navigation Tiles */}
            <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain p-3.5 sm:p-5 sm:max-h-[calc(100dvh-12rem)]">
              <nav
                aria-label="Main navigation items"
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:grid-cols-4 sm:gap-3.5"
              >
                {primaryNavigation.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));
                  const meta = navMeta[item.href];
                  const Icon = meta?.icon ?? Home;
                  const detail = meta?.detail ?? "";
                  const tag = meta?.tag;
                  const isTeal = index % 2 === 0;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group relative flex min-h-[96px] sm:min-h-[114px] flex-col justify-between rounded-2xl border-2 border-black p-3.5 text-[#07100f] shadow-[3.5px_3.5px_0px_0px_#000] transition-all duration-200 hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-[5.5px_5.5px_0px_0px_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1.5px_1.5px_0px_0px_#000] sm:p-4 ${
                        isTeal
                          ? "bg-[#04b093] hover:bg-white"
                          : "bg-white hover:bg-[#04b093]"
                      } ${
                        isActive
                          ? "ring-4 ring-[#04b093]/40 border-black"
                          : ""
                      }`}
                    >
                      {/* Top icon and micro badge / arrow */}
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-black/10 transition-colors group-hover:bg-black/15">
                          <Icon size={18} strokeWidth={2.4} aria-hidden="true" />
                        </div>
                        <div className="flex items-center gap-1">
                          {tag && (
                            <span className="rounded-full bg-black/85 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#04b093]">
                              {tag}
                            </span>
                          )}
                          <div className="grid size-6 place-items-center rounded-full bg-black/5 transition-transform duration-200 group-hover:bg-black/15 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                            <ArrowUpRight
                              size={13}
                              strokeWidth={2.6}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom title & tagline */}
                      <div className="mt-2">
                        <span className="block text-xs sm:text-sm font-black uppercase tracking-tight leading-tight">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-[10px] sm:text-[11px] font-semibold text-black/75 line-clamp-1">
                          {detail}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Tray Bottom Ticker & Quick Links */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/45 px-4 py-3 sm:px-6 sm:py-3.5 text-xs">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <Radio size={13} className="text-[#04b093]" />
                <span>CBM Radio &bull; Gospel &amp; Culture &bull; 24/7 Digital</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#04b093] hover:text-white transition-colors"
                >
                  <span>Connect with Studio</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
