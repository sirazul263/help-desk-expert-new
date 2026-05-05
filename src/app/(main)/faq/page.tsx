import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FaqContent from "./_FaqContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about HelpDeskXpert — getting started, our agents, onboarding, pricing, quality guarantees, tools, and how to scale your support team.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | HelpDeskXpert",
    description:
      "Everything you need to know about outsourcing your customer support with HelpDeskXpert — from onboarding to billing.",
    url: "/faq",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I get started with HelpDeskXpert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply book a free 30-minute discovery call through our Contact page. We'll learn about your product, your support needs, and your current setup — then recommend the right plan and match you with a suitable agent profile within 24 hours.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to go live?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In most cases, your agent will be trained and handling live tickets within 48 hours of signing up. Enterprise accounts with more complex requirements typically take 3–5 business days for full setup.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a minimum contract length?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All our plans are month-to-month with 30 days notice to cancel. Enterprise clients can request annual contracts for discounted rates, but it's never required.",
      },
    },
    {
      "@type": "Question",
      name: "Can I try before I commit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — we offer a 2-week trial period. If you're not fully satisfied with your agent's performance during the trial, you can cancel without charge or request a replacement agent.",
      },
    },
    {
      "@type": "Question",
      name: "What is the CSAT guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your average CSAT score drops below 90% in any given calendar month, we will replace your agent within 5 business days at no extra cost. This guarantee applies to Growth and Enterprise plans.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in the monthly price?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Everything. Agent pay, HR, benefits, payroll taxes, training, quality monitoring, account management, and weekly reporting are all included. There are no hidden fees or per-ticket charges.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a discount for annual billing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — annual billing saves you 20% compared to month-to-month pricing.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can I add more agents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Additional agents can typically be onboarded within 48–72 hours, since they train alongside your existing setup.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://helpdeskxpert.com" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://helpdeskxpert.com/faq" },
  ],
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <FaqContent />
    </>
  );
}
