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
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="mx-auto max-w-[1800px] px-0 lg:px-2">
        <div className="mt-0 flex items-center gap-3 bg-[#050505] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:px-5 lg:gap-4 lg:px-6">
          <div className="flex flex-1 items-center justify-between gap-4 bg-[#050505]">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="flex items-center gap-3 rounded-none bg-[#f3d32b] px-3 py-2 sm:px-4">
                <span className="grid h-8 w-8 place-items-center bg-[#060606] text-[0.68rem] font-black leading-none text-[#f3d32b] sm:h-10 sm:w-10 sm:text-[0.72rem]">
                  CBM
                </span>
                <span className="text-[1.6rem] font-black uppercase leading-none tracking-[-0.08em] text-black sm:text-[2.3rem] lg:text-[3.2rem]">
                  CBM
                </span>
              </div>

              <nav aria-label="Main navigation" className="hidden items-center gap-6 xl:flex">
                {primaryNavigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors ${
                        isActive ? "text-[#f3d32b]" : "text-white/80 hover:text-[#f3d32b]"
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
                className="inline-flex items-center justify-center gap-2 border border-white/10 bg-[#050505] px-3 py-2 text-[0.7rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#f3d32b] hover:text-[#f3d32b] sm:px-4"
              >
                Contact
              </Link>

              <Link
                href="/"
                aria-label="CBM Radio home"
                className="flex items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3d32b]"
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
        </div>
      </div>
    </header>
  );
}
