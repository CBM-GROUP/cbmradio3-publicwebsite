"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CBMlogo from "../../public/cbmradio.png";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "about", path: "/about" },
    { name: "team members", path: "/team" },
    { name: "programs", path: "/programs" },
    { name: "news", path: "/news" },
    { name: "gallery", path: "/gallery" },
  ];

  return (
    <header className="bg-black/80 md:bg-black/40 text-white shadow-sm backdrop-blur fixed w-full top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src={CBMlogo.src} 
            alt="cbm radio" 
            width={80} 
            height={80} 
            priority
            sizes="80px"
            className="object-cover w-16 h-16 md:w-20 md:h-20"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`py-1 text-sm lg:text-base transition-all duration-300 capitalize border-b-2 ${
                pathname === link.path
                  ? "text-teal-500 border-teal-500"
                  : "border-transparent hover:text-teal-400 hover:border-teal-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/#contact"
            className="bg-teal-500 hover:bg-teal-600 text-black py-2 px-5 rounded-md text-sm lg:text-base font-medium transition-colors duration-300 capitalize"
          >
            contact us
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-50 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      <div
        className={`fixed inset-0 top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 text-xl transition-transform duration-300 ease-in-out md:hidden z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`transition-colors duration-300 capitalize font-medium ${
                pathname === link.path ? "text-teal-400" : "text-white hover:text-teal-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="mt-4 bg-teal-500 hover:bg-teal-600 text-black py-2.5 px-8 rounded-md text-lg font-semibold transition-colors duration-300 capitalize"
          >
            contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}