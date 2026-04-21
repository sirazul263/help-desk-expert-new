import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "../styles/globals.css";
import "../styles/services.css";
import "../styles/pricing.css";
import "../styles/how-it-works.css";
import "../styles/faq.css";
import "../styles/contact.css";
import "../styles/about.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "HelpDesk Expert — Outsourced Support Agents for SaaS",
  description:
    "World-class outsourced customer support agents for SaaS companies. Fast onboarding, 24/7 coverage, and a CSAT guarantee.",
  icons: {
    icon: "/img/favicon-16x16.png",
    shortcut: "/img/favicon-16x16.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
