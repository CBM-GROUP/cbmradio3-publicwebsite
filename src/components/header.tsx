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
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 24);
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
    <header
      className={`sticky top-0 z-50 w-full bg-transparent transition-transform duration-300 ease-out ${
        isAtTop ? "translate-y-10" : "translate-y-0"
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-0 lg:px-2">
        <div className="relative mt-0 border border-white/60 bg-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur-lg">
          <div className="flex items-center justify-between gap-4 px-3 py-4 sm:px-4 lg:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
              <button
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#48d4c1]/50 bg-white text-[#0f766e] transition-colors hover:bg-[#48d4c1] hover:text-[#0a0d0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#48d4c1]"
              >
                {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
              </button>

              <Link
                href="/"
                aria-label="CBM Radio home"
                className="flex shrink-0 items-center rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#48d4c1]"
              >
                <Image
                  src={CBMlogo}
                  alt="CBM Radio logo"
                  width={90}
                  height={90}
                  priority
                  sizes="56px"
                  className="-my-5 h-20 w-20 object-cover"
                />
              </Link>

            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={contactNavigationItem.href}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#48d4c1] px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#062521] transition-colors hover:bg-[#6ae3d1]"
              >
                Contact
              </Link>
            </div>
          </div>
          {isMenuOpen &&
            createPortal(
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-40 h-full w-full cursor-default bg-black/50 backdrop-blur-[2px]"
              />,
              document.body,
            )}
          <div
            inert={!isMenuOpen}
            aria-hidden={!isMenuOpen}
            className={`absolute -left-px -right-px top-full border-x-4 border-b-4 border-[#48d4c1] bg-[#050505] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isMenuOpen
                ? "[clip-path:inset(0_0_0_0)]"
                : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
            }`}
          >
            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-8">
              <span className="mb-5 block text-sm font-extrabold uppercase tracking-[0.16em] text-[#48d4c1]">
                Explore
              </span>
              <nav
                id="mobile-navigation"
                aria-label="Main navigation"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
              >
                {primaryNavigation.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));
                  const Icon = navMeta[item.href]?.icon ?? Home;
                  const detail = navMeta[item.href]?.detail ?? "";
                  const isTeal = index % 2 === 0;

                  return (
                    <div
                      key={item.href}
                      style={{ transitionDelay: isMenuOpen ? `${150 + index * 50}ms` : "0ms" }}
                      className={`transition-[opacity,translate] duration-500 ease-out ${
                        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                      }`}
                    >
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group flex h-full min-h-32 flex-col justify-between rounded-md p-4 text-[#07100f] transition-transform hover:-translate-y-1 ${
                        isTeal ? "bg-[#48d4c1]" : "bg-white"
                      } ${isActive ? "ring-4 ring-white/40" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Icon size={23} strokeWidth={2.2} aria-hidden="true" />
                        <ArrowUpRight
                          size={18}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                      <span>
                        <span className="block text-lg font-extrabold">{item.label}</span>
                        <span className="mt-0.5 block text-xs font-medium text-black/70">{detail}</span>
                      </span>
                    </Link>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
