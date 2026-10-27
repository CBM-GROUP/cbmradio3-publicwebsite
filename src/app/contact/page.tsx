import type { Metadata } from "next";

import ContactPageContent from "@/components/contact/contact-page-content";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";

export const metadata: Metadata = {
  title: "Contact | CBM Radio",
  description: "Contact CBM Radio by phone, email, or through our business address.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#04b093] text-black">
        <PageHero
          pageKey="contact"
          fallbackTitle="Contact Us"
          fallbackDescription="Get in touch with CBM Radio for general enquiries and business communication."
        />
        <DynamicPageSections page="contact" position="top" />
        <ContactPageContent />
        <DynamicPageSections page="contact" position="middle" />
        <DynamicPageSections page="contact" position="bottom" />
      </main>
      <Footer />
    </>
  );
}
