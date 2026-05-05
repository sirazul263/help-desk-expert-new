import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import AboutContent from "./_AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story behind HelpDeskXpert — founded by SaaS operators who couldn't find reliable outsourced support. Today we serve 200+ SaaS companies with 2,000+ agents placed.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About HelpDeskXpert",
    description:
      "Founded by SaaS operators, built for SaaS teams. Meet the team behind HelpDeskXpert and our mission to make great support accessible.",
    url: "/about",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HelpDeskXpert",
  url: "https://helpdeskxpert.com",
  description:
    "World-class outsourced customer support agents for SaaS companies. Fast onboarding, 24/7 coverage, and a CSAT guarantee.",
  foundingDate: "2019",
  numberOfEmployees: { "@type": "QuantitativeValue", value: "2000" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-555-0199",
    contactType: "sales",
    email: "contact@helpdeskexpert.com",
    availableLanguage: "English",
  },
  sameAs: [
    "https://web.facebook.com/HelpDeskXpert",
    "https://www.linkedin.com/company/help-desk-xpert",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://helpdeskxpert.com" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://helpdeskxpert.com/about" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <AboutContent />
    </>
  );
}
