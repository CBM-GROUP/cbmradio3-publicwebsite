"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import CBMlogo from "../../public/cbmradio.png";
import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

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

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-transparent transition-transform duration-300 ease-out ${
        isAtTop ? "translate-y-10" : "translate-y-0"
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-0 lg:px-2">
        <div className="relative mt-0 border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between gap-4 px-3 py-4 sm:px-4 lg:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
              <button
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#48d4c1]/50 bg-white text-[#0f766e] transition-colors hover:bg-[#48d4c1] hover:text-[#0a0d0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#48d4c1] xl:hidden"
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
                      className={`whitespace-nowrap rounded-full px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                        isActive
                          ? "bg-[#48d4c1]/15 text-[#0f766e]"
                          : "text-black/75 hover:bg-black/5 hover:text-[#0f766e]"
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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#48d4c1] px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#062521] transition-colors hover:bg-[#6ae3d1]"
              >
                Contact
              </Link>
            </div>
          </div>
          {isMenuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Main navigation"
              className="absolute left-3 right-3 top-[calc(100%+0.5rem)] grid gap-1 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.2)] xl:hidden"
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
                    className={`rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] transition-colors ${
                      isActive
                        ? "bg-[#48d4c1]/15 text-[#0f766e]"
                        : "text-black/80 hover:bg-black/5 hover:text-[#0f766e]"
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
