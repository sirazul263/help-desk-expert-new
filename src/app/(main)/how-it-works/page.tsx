import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HowItWorksContent from "./_HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how HelpDeskXpert gets you from sign-up to live customer support in under 48 hours — discovery call, agent matching, onboarding, and ongoing management.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How It Works | HelpDeskXpert",
    description:
      "From discovery call to live support in 48 hours. See our streamlined 4-step process for placing and managing your dedicated support agents.",
    url: "/how-it-works",
  },
};

const howItWorksSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Get Started with HelpDeskXpert",
  description:
    "Get expert customer support agents handling your tickets in under 48 hours.",
  totalTime: "PT48H",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Book a Discovery Call",
      text: "A 30-minute call to understand your product, users, support stack, and pain points.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "We Match Your Agent",
      text: "We hand-select the best-fit agent from our trained pool based on your requirements.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Agent Onboarding & Training",
      text: "Your agent completes structured onboarding including product walkthrough and knowledge base training.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Go Live & Ongoing Management",
      text: "Your agent starts handling tickets with weekly performance reports and continuous coaching.",
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://helpdeskxpert.com" },
    { "@type": "ListItem", position: 2, name: "How It Works", item: "https://helpdeskxpert.com/how-it-works" },
  ],
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={howItWorksSchema} />
      <JsonLd data={breadcrumbSchema} />
      <HowItWorksContent />
    </>
  );
}
