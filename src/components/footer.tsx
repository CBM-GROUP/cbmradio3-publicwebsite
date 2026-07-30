"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" className="bg-zinc-800/20 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* Logo & About */}
        <div>
          <h2 className="text-3xl font-bold text-emerald-500">
            CBM Radio
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            CBM Radio is committed to delivering trusted news,
            quality entertainment, educational programs and
            community-driven content that informs, inspires and
            connects our listeners.
          </p>

          <div className="flex gap-4 mt-6">
            <Link
              href="https://www.cbmgroup.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit CBM Group"
              className="bg-emerald-600 p-3 rounded-full hover:bg-white hover:text-emerald-600 transition"
            >
              <FaFacebookF />
            </Link>

            <Link
              href="https://www.cbmgroup.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit CBM Group"
              className="bg-emerald-600 p-3 rounded-full hover:bg-white hover:text-emerald-600 transition"
            >
              <FaInstagram />
            </Link>

            <Link
              href="https://www.cbmgroup.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit CBM Group"
              className="bg-emerald-600 p-3 rounded-full hover:bg-white hover:text-emerald-600 transition"
            >
              <FaTwitter />
            </Link>

            <a
              href="https://www.cbmgroup.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit CBM Group"
              className="bg-emerald-600 p-3 rounded-full hover:bg-white hover:text-emerald-600 transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-6">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:text-emerald-500">
                Home
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-emerald-500">
                About Us
              </Link>
            </li>

            <li>
              <Link href="/programs" className="hover:text-emerald-500">
                Programs
              </Link>
            </li>

            <li>
              <Link href="/team" className="hover:text-emerald-500">
                Team
              </Link>
            </li>

            <li>
              <Link href="/news" className="hover:text-emerald-500">
                News
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-emerald-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Programs */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-6">
            Popular Shows
          </h3>

          <ul className="space-y-3">
            <li>Morning Breeze</li>
            <li>Drive Time Live</li>
            <li>Sports Arena</li>
            <li>Business Focus</li>
            <li>Health Talk</li>
            <li>Weekend Mix</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-6">
            Contact Us
          </h3>

          <div className="space-y-5">

            <div className="flex gap-3">
              <FaMapMarkerAlt className="text-emerald-500 mt-1" />
              <p>Kampala, Uganda</p>
            </div>

            <div className="flex gap-3">
              <FaPhoneAlt className="text-emerald-500 mt-1" />
              <p>+256 700 000000</p>
            </div>

            <div className="flex gap-3">
              <FaEnvelope className="text-emerald-500 mt-1" />
              <p>info@cbmradio.ug</p>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-sm">

          <p>
            © {new Date().getFullYear()} CBM Radio. All Rights Reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-emerald-500">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-emerald-500">
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}