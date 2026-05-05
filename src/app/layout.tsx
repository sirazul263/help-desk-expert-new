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
import "../styles/chat.css";
import "../styles/invoice.css";
import "../styles/screen.css";
import NextTopLoader from "nextjs-toploader";
import ScrollToTop from "../components/ScrollToTop";
import Analytics from "../components/Analytics";

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

const BASE_URL = "https://helpdeskxpert.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "HelpDeskXpert — Outsourced Support Agents for SaaS",
    template: "%s | HelpDeskXpert",
  },
  description:
    "World-class outsourced customer support agents for SaaS companies. Fast onboarding, 24/7 coverage, and a CSAT guarantee. Trusted by 200+ SaaS brands.",
  keywords: [
    "outsourced customer support",
    "SaaS support agents",
    "customer support outsourcing",
    "24/7 support",
    "live chat support",
    "help desk outsourcing",
    "CSAT improvement",
    "SaaS customer success",
  ],
  authors: [{ name: "HelpDeskXpert", url: BASE_URL }],
  creator: "HelpDeskXpert",
  publisher: "HelpDeskXpert",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "HelpDeskXpert",
    title: "HelpDeskXpert — Outsourced Support Agents for SaaS",
    description:
      "World-class outsourced customer support agents for SaaS companies. Fast onboarding, 24/7 coverage, and a CSAT guarantee.",
    images: [
      {
        url: "/img/og-default.png",
        width: 1200,
        height: 630,
        alt: "HelpDeskXpert — Outsourced Support Agents for SaaS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@helpdeskxpert",
    creator: "@helpdeskxpert",
    title: "HelpDeskXpert — Outsourced Support Agents for SaaS",
    description:
      "World-class outsourced customer support agents for SaaS companies. Fast onboarding, 24/7 coverage, and a CSAT guarantee.",
    images: ["/img/og-default.png"],
  },
  icons: {
    icon: [
      { url: "/img/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/img/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/img/favicon-16x16.png",
    apple: "/img/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: BASE_URL,
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
        <Analytics />
        <NextTopLoader color="#ff5c35" height={2} showSpinner={false} />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
