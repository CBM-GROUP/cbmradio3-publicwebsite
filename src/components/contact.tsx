"use client";

import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="bg-gray-50">

      {/* Hero */}
      <section className="bg-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
        
        
          
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">

        {/* Contact Info */}
        <div>

          <h2 className="text-3xl emerald-700 mb-8">
            Get In Touch
          </h2>

          <div className="space-y-8">

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt
                className="text-emerald-600 mt-1"
                size={25}
              />
              <div>
                <h3 className="font-semibold text-xl">
                  Address
                </h3>
                <p className="text-gray-600">
                  Kampala, Uganda
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhone
                className="text-emerald-600 mt-1"
                size={25}
              />
              <div>
                <h3 className="font-semibold text-xl">
                  Phone
                </h3>
                <p className="text-gray-600">
                  +256 700 000000
                </p>

                <p className="text-gray-600">
                  +256 750 000000
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaEnvelope
                className="text-emerald-600 mt-1"
                size={25}
              />
              <div>
                <h3 className="font-semibold text-xl">
                  Email
                </h3>

                <p className="text-gray-600">
                  info@cbmradio.ug
                </p>

                <p className="text-gray-600">
                  support@cbmradio.ug
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-emerald-700 text-xl mb-2">
                Working Hours
              </h3>

              <p className="text-gray-600">
                Monday - Friday
              </p>

              <p className="text-gray-600">
                8:00 AM - 6:00 PM
              </p>
            </div>

            {/* Social Media */}

            <div>
              <h3 className="font-semibold text-xl mb-4">
                Follow Us
              </h3>

              <div className="flex gap-4">

                <a
                  href="#"
                  className="bg-emerald-600 text-zinc p-3 rounded-full hover:bg-black transition"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="#"
                  className="bg-emerald-600 text-zinc p-3 rounded-full hover:bg-black transition"
                >
                  <FaTwitter />
                </a>

                <a
                  href="#"
                  className="bg-emerald-600 text-zinc p-3 rounded-full hover:bg-black transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  className="bg-emerald-600 text-zinc p-3 rounded-full hover:bg-black transition"
                >
                  <FaYoutube />
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* Contact Form */}

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-3xl emerald-600 mb-8">
            Send Us A Message
          </h2>

          <form className="space-y-6">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            <textarea
              rows={6}
              placeholder="Your Message"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            ></textarea>

            <button
              className="bg-emerald-700 hover:bg-black text-white px-8 py-3 rounded-lg transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </section>

      {/* Google Map */}

      <section className="pb-20 px-6">

        <div className="max-w-7xl mx-auto">

          <iframe
            src="https://maps.google.com/maps?q=kampala&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="450"
            loading="lazy"
            className="rounded-xl shadow-lg"
          ></iframe>

        </div>

      </section>

    </main>
  );
}