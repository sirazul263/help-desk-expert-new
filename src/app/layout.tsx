import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "../styles/globals.css";
import "../styles/auth.css";
import "../styles/dashboard.css";
import "../styles/services.css";
import "../styles/pricing.css";
import "../styles/how-it-works.css";
import "../styles/faq.css";
import "../styles/contact.css";
import "../styles/about.css";
import "../styles/legal.css";
import "../styles/admin.css";
import NextTopLoader from "nextjs-toploader";
import ScrollToTop from "../components/ScrollToTop";

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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${dmSans.variable}`}
    >
      <body>
        <NextTopLoader color="#ff5c35" height={2} showSpinner={false} />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
