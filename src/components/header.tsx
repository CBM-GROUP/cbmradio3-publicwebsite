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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#040505] text-white">
      <div className="mx-auto max-w-[1800px] px-2 sm:px-3 lg:px-5">
        <div className="relative mt-2 flex items-center gap-3 bg-[#040505] px-2 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] sm:px-3">
          <div className="flex flex-1 items-center justify-between gap-2 rounded-none bg-[#f4d204] px-3 py-2 sm:px-4 lg:px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center bg-[#070808] text-[0.7rem] font-black leading-none text-[#f4d204] sm:h-10 sm:w-10 sm:text-xs">
                CBM
              </span>
              <span className="text-[1.5rem] font-black uppercase leading-none tracking-[-0.08em] text-black sm:text-[2.5rem] lg:text-[4rem]">
                CBM
              </span>
            </div>

            <div className="hidden items-center gap-3 text-[0.6rem] font-black uppercase tracking-[0.18em] text-black/80 sm:flex">
              <span>Radio</span>
              <span className="h-4 w-px bg-black/40" />
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
                    isActive ? "text-[#f4d204]" : "text-white/80 hover:text-[#f4d204]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href={contactNavigationItem.href}
            className="inline-flex items-center gap-2 border border-white/15 bg-[#040505] px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#f4d204] hover:text-[#f4d204] sm:px-4"
          >
            Contact
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
