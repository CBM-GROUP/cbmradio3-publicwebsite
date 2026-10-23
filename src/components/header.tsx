"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import CBMlogo from "../../public/cbmradio.png";
import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="mx-auto max-w-[1800px] px-0 lg:px-2">
        <div className="relative mt-0 border border-white/10 bg-[#050505] shadow-[0_12px_30px_rgba(0,0,0,0.38)]">
          <div className="flex items-center justify-between gap-4 px-3 py-3 sm:px-4 lg:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
              <button
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#48d4c1]/40 bg-[#0a0d0c] text-[#48d4c1] transition-colors hover:bg-[#48d4c1] hover:text-[#0a0d0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#48d4c1] xl:hidden"
              >
                {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
              </button>

              <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-5 xl:flex">
                {primaryNavigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`whitespace-nowrap rounded-full px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.23em] transition-colors ${
                        isActive
                          ? "bg-white/10 text-[#48d4c1]"
                          : "text-white/80 hover:bg-white/10 hover:text-[#48d4c1]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={contactNavigationItem.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#48d4c1] hover:bg-[#48d4c1] hover:text-[#0a0d0c] sm:px-4"
              >
                Contact
              </Link>

              <Link
                href="/"
                aria-label="CBM Radio home"
                className="flex items-center rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#48d4c1]"
              >
                <Image
                  src={CBMlogo}
                  alt="CBM Radio logo"
                  width={90}
                  height={90}
                  priority
                  sizes="56px"
                  className="h-10 w-10 object-cover sm:h-12 sm:w-12"
                />
              </Link>
            </div>
          </div>
          {isMenuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Main navigation"
              className="absolute left-3 right-3 top-[calc(100%+0.5rem)] grid gap-1 rounded-2xl border border-white/10 bg-[#050505] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.55)] xl:hidden"
            >
              {primaryNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                      isActive
                        ? "bg-[#48d4c1] text-[#0a0d0c]"
                        : "text-white/85 hover:bg-white/10 hover:text-[#48d4c1]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
