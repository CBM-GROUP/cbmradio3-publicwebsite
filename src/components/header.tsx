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
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import CBMlogo from "../../public/cbmradio.png";
import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

const navMeta: Record<string, { icon: LucideIcon; detail: string }> = {
  "/": { icon: Home, detail: "Back to the start" },
  "/charts": { icon: BarChart3, detail: "What's trending now" },
  "/programs": { icon: Radio, detail: "Lineup & schedules" },
  "/episodes": { icon: Headphones, detail: "Listen on demand" },
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

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

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
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <div
          className={`relative flex items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-300 sm:px-5 sm:py-2.5 ${
            isScrolled
              ? "border-white/15 bg-[#070e0c]/90 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              : "border-white/10 bg-[#091210]/75 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-lg"
          }`}
        >
          {/* Left: Hamburger Button & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="main-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[#04b093] transition-all hover:border-[#04b093] hover:bg-[#04b093]/10 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#04b093] sm:h-10 sm:w-10"
            >
              {isMenuOpen ? <X size={19} strokeWidth={2.5} /> : <Menu size={19} strokeWidth={2.5} />}
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

        {/* Modal Full Navigation Drawer via Portal for Responsive Viewports */}
        {mounted &&
          isMenuOpen &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 pt-16">
              {/* Backdrop */}
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-40 h-full w-full cursor-default bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
              />

              {/* Responsive Drawer Dialog */}
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Site Navigation"
                className="relative z-50 flex max-h-[calc(100dvh-5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-black bg-[#091210]/95 text-white shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-6.5rem)]"
              >
                {/* Drawer Top Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-3.5 sm:p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1.5 border border-[#04b093]/40 bg-[#04b093]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#04b093]">
                      <span className="size-1.5 animate-pulse rounded-full bg-[#04b093]" />
                      <span>EXPLORE CBM RADIO</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="grid size-8 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-[#04b093] hover:text-black"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Drawer Scrollable Content Area: Responsive 2-Col on Mobile, 4-Col on Desktop */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 no-scrollbar">
                  <nav
                    id="main-navigation"
                    aria-label="Main navigation"
                    className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:grid-cols-4 sm:gap-3.5"
                  >
                    {primaryNavigation.map((item, index) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href + "/"));
                      const Icon = navMeta[item.href]?.icon ?? Home;
                      const detail = navMeta[item.href]?.detail ?? "";
                      const isTeal = index % 2 === 0;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setIsMenuOpen(false)}
                          className={`group flex min-h-[92px] sm:min-h-[110px] flex-col justify-between rounded-xl border-2 border-black p-3.5 text-[#07100f] shadow-[3px_3px_0px_0px_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#000] sm:p-4 ${
                            isTeal
                              ? "bg-[#04b093] hover:bg-white"
                              : "bg-white hover:bg-[#04b093]"
                          } ${isActive ? "ring-4 ring-black/80" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
                            <ArrowUpRight
                              size={15}
                              strokeWidth={2.2}
                              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <span className="block text-xs sm:text-sm md:text-base font-black uppercase tracking-tight leading-tight">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[10px] sm:text-[11px] font-bold text-black/75 line-clamp-1">
                              {detail}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Drawer Bottom Info Footer */}
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 p-3 sm:p-4 text-xs">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <Radio size={13} className="text-[#04b093]" />
                    <span>CBM Radio &bull; Gospel &amp; Culture</span>
                  </div>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs font-black uppercase tracking-wider text-[#04b093] hover:underline"
                  >
                    Contact Newsroom &rarr;
                  </Link>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    </header>
  );
}
