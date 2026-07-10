"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "about", path: "/about" },
    { name: "team members", path: "/team" },
    { name: "programs", path: "/programs" },
    { name: "news", path: "/news" },
    { name: "gallery", path: "/gallery" },
  ];

  return (
    <header className="bg-black text-white shadow-sm bg-zinc-800/30 backdrop-blur fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-5">
        <h1 className="text-3xl font-bold text-emerald-600">CBM</h1>

        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          <MenuIcon className="w-8 h-8 text-emerald-600" />
        </button>

        <nav className={`${open ? "block" : "hidden"} md:flex gap-8`}>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`${
                pathname === link.path
                  ? "text-emerald-500 border-b-2 border-emerald-500 capitalize transition-all duration-300"
                  : "hover:text-emerald-400 hover:border-b-2 hover:border-emerald-400 transition-all duration-300 capitalize"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button className="bg-emerald-500 hover:bg-emerald-600 text-black py-2 px-4 rounded-md transition-colors duration-300 capitalize cursor-pointer">
          contact us
        </button>
      </div>
    </header>
  );
}
