import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import HomeContent from "./_HomeContent";

export const metadata: Metadata = {
  title: "HelpDeskXpert — Outsourced Support Agents for SaaS",
  description:
    "World-class outsourced customer support agents for SaaS companies. Fast onboarding, 24/7 coverage, and a CSAT guarantee. Trusted by 200+ SaaS brands.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HelpDeskXpert — Outsourced Support Agents for SaaS",
    description:
      "We place expert customer support agents into your SaaS team — fully trained, managed, and ready to delight your users from day one.",
    url: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HelpDeskXpert",
  url: "https://helpdeskxpert.com",
  description:
    "World-class outsourced customer support agents for SaaS companies.",
  foundingDate: "2019",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-555-0199",
    contactType: "sales",
    email: "contact@helpdeskexpert.com",
  },
  sameAs: [
    "https://web.facebook.com/HelpDeskXpert",
    "https://www.linkedin.com/company/help-desk-xpert",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HelpDeskXpert",
  url: "https://helpdeskxpert.com",
};

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [reviews, existingReview] = await Promise.all([
    prisma.review.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        quote: true,
        role: true,
        createdAt: true,
        user: { select: { firstName: true, lastName: true, image: true } },
      },
    }),
    userId
      ? prisma.review.findFirst({ where: { userId }, select: { id: true } })
      : null,
  ]);

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <HomeContent
        reviews={reviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
        isLoggedIn={!!userId}
        hasReviewed={!!existingReview}
      />
    </>
  );
}
