"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import CBMlogo from "../../public/cbmradio.png";
import {
  contactNavigationItem,
  primaryNavigation,
} from "@/data/site-navigation";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#101110]/90 text-white shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8">
        <Link href="/" prefetch={true} className="flex items-center">
          <Image
            src={CBMlogo}
            alt="CBM Radio"
            width={64}
            height={64}
            priority
            sizes="64px"
            className="h-14 w-14 object-cover"
          />
        </Link>

        <nav
          className="hidden items-center gap-5 md:flex lg:gap-7"
          aria-label="Main navigation"
        >
          {primaryNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                aria-current={isActive ? "page" : undefined}
                className={`border-b-2 py-1 text-sm capitalize transition-all duration-300 lg:text-base ${
                  isActive
                    ? "border-teal-300 text-teal-300"
                    : "border-transparent text-zinc-300 hover:border-teal-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href={contactNavigationItem.href}
            prefetch={true}
            className="rounded-full bg-teal-400 px-5 py-2.5 text-sm font-bold capitalize text-zinc-950 transition-colors duration-300 hover:bg-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300 lg:text-base"
          >
            {contactNavigationItem.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="z-50 flex h-11 w-11 flex-col items-center justify-center space-y-1.5 rounded-full border border-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span
            className={`block h-0.5 w-6 bg-teal-300 transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-teal-300 transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-teal-300 transition-transform duration-300 ease-in-out ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-0 z-40 flex h-screen w-full flex-col items-center justify-center gap-8 bg-[#101110]/98 text-xl backdrop-blur-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav
          className="flex flex-col items-center gap-6"
          aria-label="Mobile navigation"
        >
          {primaryNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`font-medium capitalize transition-colors duration-300 ${
                  isActive
                    ? "text-teal-400"
                    : "text-zinc-200 hover:text-teal-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href={contactNavigationItem.href}
            prefetch={true}
            onClick={() => setIsOpen(false)}
            className="mt-4 rounded-full bg-teal-400 px-8 py-3 text-lg font-bold capitalize text-zinc-950 transition-colors duration-300 hover:bg-teal-300"
          >
            {contactNavigationItem.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
