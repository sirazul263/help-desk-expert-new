import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PricingContent from "./_PricingContent";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for outsourced SaaS support. Starter from $799/mo, Growth from $1,899/mo, and custom Enterprise plans. No setup fees, cancel any time.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | HelpDeskXpert",
    description:
      "Month-to-month support agent plans from $799/mo. No setup fees, no lock-in. Growth plans include CSAT guarantee.",
    url: "/pricing",
  },
};

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "HelpDeskXpert Pricing Plans",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Offer",
        name: "Starter Plan",
        description: "1 dedicated support agent with live chat and email support",
        price: "799",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "799",
          priceCurrency: "USD",
          unitCode: "MON",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Offer",
        name: "Growth Plan",
        description: "Up to 3 agents with 24/7 coverage and CSAT guarantee",
        price: "1899",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1899",
          priceCurrency: "USD",
          unitCode: "MON",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Offer",
        name: "Enterprise Plan",
        description: "Unlimited agents with custom SLAs and dedicated team lead — custom pricing, contact sales",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://helpdeskxpert.com" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://helpdeskxpert.com/pricing" },
  ],
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={pricingSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PricingContent />
    </>
  );
}
