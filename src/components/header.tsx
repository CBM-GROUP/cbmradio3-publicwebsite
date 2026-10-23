"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import CBMlogo from "../../public/cbmradio.png";
import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0d0c] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="CBM Radio home" className="flex items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300">
              <Image
                src={CBMlogo}
                alt="CBM Radio logo"
                width={90}
                height={90}
                priority
                sizes="72px"
                className="h-12 w-12 object-cover sm:h-14 sm:w-14"
              />
            </Link>

            <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
              {primaryNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-[0.68rem] font-bold uppercase tracking-[0.18em] transition-colors ${
                      isActive ? "text-[#4fe5d0]" : "text-white/80 hover:text-[#4fe5d0]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={contactNavigationItem.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#4fe5d0] hover:text-[#4fe5d0] sm:px-5"
            >
              Contact
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
