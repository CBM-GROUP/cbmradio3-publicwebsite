"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d4a54a]/20 bg-[#090807] text-[#f7f2ea]">
      <div className="mx-auto max-w-[1800px] px-2 sm:px-3 lg:px-5">
        <div className="relative mt-2 flex items-center gap-3 bg-[#090807] px-2 py-2 shadow-[0_0_0_1px_rgba(212,165,74,0.18)] sm:px-3">
          <div className="flex flex-1 items-center justify-between gap-2 rounded-none bg-[#d4a54a] px-3 py-2 sm:px-4 lg:px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center bg-[#0f0d0c] text-[0.7rem] font-black leading-none text-[#d4a54a] sm:h-10 sm:w-10 sm:text-xs">
                CBM
              </span>
              <span className="text-[1.5rem] font-black uppercase leading-none tracking-[-0.08em] text-[#0b0908] sm:text-[2.5rem] lg:text-[4rem]">
                CBM
              </span>
            </div>

            <div className="hidden items-center gap-3 text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#0b0908]/80 sm:flex">
              <span>Radio</span>
              <span className="h-4 w-px bg-[#0b0908]/40" />
              <span>Community</span>
            </div>
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            {primaryNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href + "/"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-[#d4a54a]" : "text-[#f7f2ea]/80 hover:text-[#e8bc69]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href={contactNavigationItem.href}
            className="inline-flex items-center gap-2 border border-[#d4a54a]/30 bg-[#090807] px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#f7f2ea] transition hover:border-[#e8bc69] hover:text-[#e8bc69] sm:px-4"
          >
            Contact
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
