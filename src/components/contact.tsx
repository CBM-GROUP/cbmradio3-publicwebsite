"use client";

import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    // Changed bg-zinc-50 to bg-black
    <div className="bg-black min-h-screen text-zinc-100">
      
      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Contact Info */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
            <p className="text-zinc-400 max-w-md">
              Have questions about our programs or want to get involved? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="space-y-8">
            <ContactDetail icon={<FaMapMarkerAlt size={22} />} title="Address" text="Kampala, Uganda" />
            <ContactDetail 
              icon={<FaPhone size={22} />} 
              title="Phone" 
              text={["+256 700 000000", "+256 750 000000"]} 
            />
            <ContactDetail 
              icon={<FaEnvelope size={22} />} 
              title="Email" 
              text={["info@cbmradio.ug", "support@cbmradio.ug"]} 
            />
            <div>
              <h3 className="font-semibold text-lg text-white mb-1">Working Hours</h3>
              <p className="text-zinc-400">Monday - Friday: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        {/* Darkened card background to contrast with black */}
        <div className="bg-zinc-900/50 rounded-2xl shadow-2xl border border-zinc-800 p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-white mb-8">Send Us A Message</h2>
          <form className="space-y-5">
            <input type="text" placeholder="Full Name" className="w-full bg-black border-zinc-700 border rounded-xl px-5 py-3.5 text-white focus:ring-2 focus:ring-teal-500 outline-none transition" />
            <input type="email" placeholder="Email Address" className="w-full bg-black border-zinc-700 border rounded-xl px-5 py-3.5 text-white focus:ring-2 focus:ring-teal-500 outline-none transition" />
            <textarea rows={5} placeholder="Your Message" className="w-full bg-black border-zinc-700 border rounded-xl px-5 py-3.5 text-white focus:ring-2 focus:ring-teal-500 outline-none transition"></textarea>
            
            <button className="w-full bg-teal-600 hover:bg-teal-500 text-black font-semibold py-4 rounded-xl transition-all duration-300">
              Send Message
            </button>
          </form>
        </div>
      </section>
      
    </div>
  );
}

// Update the Detail sub-component colors
function ContactDetail({ icon, title, text }: { icon: React.ReactNode, title: string, text: string | string[] }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-teal-500 mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        {Array.isArray(text) ? text.map(t => <p key={t} className="text-zinc-400">{t}</p>) : <p className="text-zinc-400">{text}</p>}
      </div>
    </div>
  );
}