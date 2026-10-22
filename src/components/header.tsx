"use client";

import { useRef, useState, type KeyboardEvent } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape") return;

    setIsOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#101110]/95 text-white shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              onKeyDown={handleMenuKeyDown}
              className="inline-flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="site-navigation"
            >
              <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
                <span
                  className={`h-0.5 w-6 bg-teal-300 transition-transform duration-200 ${
                    isOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-6 bg-teal-300 transition-opacity duration-200 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-6 bg-teal-300 transition-transform duration-200 ${
                    isOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
              <span className="hidden sm:inline">{isOpen ? "Close" : "Menu"}</span>
            </button>

            <Link
              href="/"
              aria-label="CBM Radio home"
              className="flex items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              <Image
                src={CBMlogo}
                alt=""
                width={80}
                height={80}
                priority
                sizes="64px"
                className="h-14 w-14 object-cover"
              />
            </Link>
          </div>

          <Link
            href={contactNavigationItem.href}
            className="inline-flex min-h-10 items-center rounded-full bg-teal-400 px-5 text-sm font-bold text-zinc-950 transition-colors hover:bg-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
          >
            Contact Us
          </Link>
        </div>
      </header>

      <div
        id="site-navigation"
        inert={!isOpen}
        onKeyDown={handleMenuKeyDown}
        className={`fixed inset-0 z-40 min-h-dvh overflow-y-auto bg-[#101110] px-6 pb-10 pt-24 text-white transition-[transform,visibility] duration-300 ease-out sm:px-10 sm:pt-28 lg:px-16 ${
          isOpen
            ? "visible translate-y-0"
            : "invisible -translate-y-3"
        }`}
      >
        <div className="mx-auto grid max-w-7xl gap-12 pb-8 pt-8 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.55fr)] md:gap-16 md:pt-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
              Find your frequency
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Music, stories and voices from our community.
            </h2>

            <nav aria-label="Main navigation" className="mt-9">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {primaryNavigation.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex min-h-16 items-center gap-5 py-3 transition-colors sm:min-h-[4.5rem] ${
                          isActive
                            ? "text-teal-300"
                            : "text-white hover:text-teal-300"
                        }`}
                      >
                        <span className="w-8 text-xs font-semibold tabular-nums text-zinc-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                          {item.label}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          size={20}
                          className="ml-auto mr-2 text-teal-300 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <aside className="flex flex-col justify-between border-t border-white/10 pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
                CBM Radio
              </p>
              <h3 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                For the voices, the music and the moments that bring us
                together.
              </h3>
              <p className="mt-4 max-w-md leading-7 text-zinc-400">
                Catch up on the latest stories and discover a show that sounds
                like you.
              </p>
            </div>

            <Link
              href="/episodes"
              onClick={() => setIsOpen(false)}
              className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full border border-white/20 px-6 font-semibold text-white transition hover:border-teal-300 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
            >
              Hear the latest
              <ArrowUpRight aria-hidden="true" size={18} className="ml-3" />
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
