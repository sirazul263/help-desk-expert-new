"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendMail, buildPromotionalEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getPromoRecipients() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "USER" },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: { email: true, firstName: true, lastName: true },
  });
}

export async function getPromoCampaigns() {
  await requireAdmin();
  return prisma.promotionalCampaign.findMany({
    orderBy: { sentAt: "desc" },
    include: {
      admin: { select: { firstName: true, lastName: true } },
      recipients: {
        orderBy: [{ status: "asc" }, { email: "asc" }],
        select: { id: true, email: true, status: true, error: true },
      },
    },
  });
}

export async function sendPromotionalEmails(emails: string[], subject: string) {
  const session = await requireAdmin();

  // Deduplicate and validate
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const unique = [...new Set(emails.map((e) => e.trim().toLowerCase()))].filter(
    (e) => EMAIL_RE.test(e),
  );

  if (unique.length === 0) return { error: "No valid email addresses provided." };

  const html = buildPromotionalEmail();

  // Create campaign record upfront
  const campaign = await prisma.promotionalCampaign.create({
    data: { subject, sentBy: session.user.id, total: unique.length },
  });

  let succeeded = 0;
  let failed = 0;

  // Send one by one — failure of one never stops the rest
  for (const email of unique) {
    try {
      await sendMail({ to: email, subject, html });
      await prisma.promoCampaignRecipient.create({
        data: { campaignId: campaign.id, email, status: "sent" },
      });
      succeeded++;
    } catch (e) {
      await prisma.promoCampaignRecipient.create({
        data: {
          campaignId: campaign.id,
          email,
          status: "failed",
          error: (e as Error).message,
        },
      });
      failed++;
    }
  }

  await prisma.promotionalCampaign.update({
    where: { id: campaign.id },
    data: { succeeded, failed },
  });

  return { success: true, total: unique.length, succeeded, failed };
}
