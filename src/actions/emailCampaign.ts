"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendMail, buildAdminEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getEmailRecipients() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "USER" },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: { id: true, firstName: true, lastName: true, email: true, company: true },
  });
}

export async function getSentEmails() {
  await requireAdmin();
  return prisma.sentEmail.findMany({
    orderBy: { sentAt: "desc" },
    include: {
      admin: { select: { firstName: true, lastName: true, email: true } },
    },
  });
}

export async function sendAdminEmail(to: string, subject: string, body: string) {
  const session = await requireAdmin();
  const html = buildAdminEmail(subject, body);

  let status = "sent";
  let errorMsg: string | undefined;

  try {
    await sendMail({ to, subject, html });
  } catch (e) {
    status = "failed";
    errorMsg = (e as Error).message;
  }

  await prisma.sentEmail.create({
    data: {
      to,
      subject,
      body,
      sentBy: session.user.id,
      status,
      ...(errorMsg ? { error: errorMsg } : {}),
    },
  });

  if (status === "failed") return { error: errorMsg };
  return { success: true };
}
