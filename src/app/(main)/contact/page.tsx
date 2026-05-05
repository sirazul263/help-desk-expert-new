import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ContactContent from "./_ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Book a free 30-minute consultation with HelpDeskXpert. Tell us your support needs and we'll have dedicated agents ready for your SaaS team within 48 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact HelpDeskXpert",
    description:
      "Book a free 30-minute consultation — no sales pressure, just honest advice about your support needs.",
    url: "/contact",
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact HelpDeskXpert",
  description: "Book a free consultation to get expert support agents for your SaaS team.",
  url: "https://helpdeskxpert.com/contact",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://helpdeskxpert.com" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://helpdeskxpert.com/contact" },
  ],
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ContactContent />
    </>
  );
}
