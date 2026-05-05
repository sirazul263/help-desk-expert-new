import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ServicesContent from "./_ServicesContent";

export const metadata: Metadata = {
  title: "Customer Support Services",
  description:
    "Explore HelpDeskXpert's full suite of outsourced support services: live chat, email & ticket management, technical support, 24/7 global coverage, team scaling, and QA reporting.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Customer Support Services | HelpDeskXpert",
    description:
      "Live chat, email support, technical agents, 24/7 coverage, and more — fully managed for your SaaS team.",
    url: "/services",
  },
};

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "HelpDeskXpert Support Services",
  description: "Outsourced customer support services for SaaS companies",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Live Chat Support",
      description:
        "Real-time agents handling live chat with fast response times and high CSAT scores.",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Email & Ticket Management",
      description:
        "Structured inbox management with SLA adherence and escalation workflows.",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Technical Support Agents",
      description:
        "SaaS-specialized agents who handle API questions and developer queries.",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "24/7 Global Coverage",
      description:
        "Round-the-clock agents across time zones so your users are never left waiting.",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Team Scaling",
      description:
        "Ramp your support headcount up or down in days — perfect for launches and growth spurts.",
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Quality Assurance & Reporting",
      description:
        "Weekly performance reports, CSAT tracking, and QA reviews to keep your bar high.",
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://helpdeskxpert.com" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://helpdeskxpert.com/services" },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ServicesContent />
    </>
  );
}
