import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CBM Radio | Your world. Your frequency.",
    template: "%s | CBM Radio",
  },
  description:
    "Stories, music and conversations made for our community. Find your next favorite voice on CBM Radio.",
  icons: {
    icon: "/cbmradio.png",
    shortcut: "/cbmradio.png",
    apple: "/cbmradio.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased bg-[#171717] text-zinc-200`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
