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
    <header className="fixed top-0 z-50 w-full bg-black/80 text-white shadow-sm backdrop-blur transition-all duration-300 md:bg-black/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" prefetch={true} className="flex items-center">
          <Image
            src={CBMlogo}
            alt="CBM Radio"
            width={80}
            height={80}
            priority
            sizes="80px"
            className="h-16 w-16 object-cover md:h-20 md:w-20"
          />
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex lg:gap-8"
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
                className={`border-b-2 py-1 text-sm capitalize transition-all duration-300 lg:text-base ${
                  isActive
                    ? "border-teal-500 text-teal-500"
                    : "border-transparent hover:border-teal-400 hover:text-teal-400"
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
            className="rounded-md bg-teal-500 px-5 py-2 text-sm font-medium capitalize text-black transition-colors duration-300 hover:bg-teal-600 lg:text-base"
          >
            {contactNavigationItem.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="z-50 flex h-8 w-8 flex-col items-center justify-center space-y-1.5 focus:outline-none md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ease-in-out ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 flex h-screen w-full flex-col items-center justify-center gap-8 bg-black/95 text-xl backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${
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
                className={`font-medium capitalize transition-colors duration-300 ${
                  isActive
                    ? "text-teal-400"
                    : "text-white hover:text-teal-400"
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
            className="mt-4 rounded-md bg-teal-500 px-8 py-2.5 text-lg font-semibold capitalize text-black transition-colors duration-300 hover:bg-teal-600"
          >
            {contactNavigationItem.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
