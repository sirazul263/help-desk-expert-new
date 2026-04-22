"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/* ── Types for the actions ── */
interface InvoiceInput {
  num: string;
  clientId: string;
  issued: string;
  due: string;
  status: string;
  tax: number;
  bank: string;
  notes: string;
  items: { desc: string; qty: number; price: number }[];
}

/* ── Guard: only ADMIN ── */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

/* ── LIST invoices ── */
export async function getInvoices() {
  await requireAdmin();
  return prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          company: true,
        },
      },
    },
  });
}

/* ── GET single invoice ── */
export async function getInvoice(id: string) {
  await requireAdmin();
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          company: true,
        },
      },
    },
  });
}

/* ── STATS ── */
export async function getInvoiceStats() {
  await requireAdmin();
  const invoices = await prisma.invoice.findMany({
    include: { items: true },
  });

  let totalBilled = 0;
  let collected = 0;
  let outstanding = 0;
  let overdueCount = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  for (const inv of invoices) {
    const sub = inv.items.reduce((s, i) => s + i.qty * i.price, 0);
    const total = sub + (sub * inv.tax) / 100;
    totalBilled += total;
    if (inv.status === "Paid") {
      collected += total;
      paidCount++;
    }
    if (inv.status === "Unpaid" || inv.status === "Overdue") {
      outstanding += total;
    }
    if (inv.status === "Unpaid") unpaidCount++;
    if (inv.status === "Overdue") {
      overdueCount++;
    }
  }

  return {
    totalBilled,
    collected,
    outstanding,
    overdueCount,
    paidCount,
    unpaidCount,
    totalCount: invoices.length,
  };
}

/* ── GET customers (users with USER role) ── */
export async function getCustomers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      company: true,
      isActive: true,
      createdAt: true,
      _count: { select: { invoices: true } },
    },
  });
}

/* ── NEXT invoice number ── */
export async function getNextInvoiceNum() {
  await requireAdmin();
  const last = await prisma.invoice.findFirst({
    orderBy: { num: "desc" },
    select: { num: true },
  });
  const lastNum = last ? parseInt(last.num.replace(/\D/g, "")) || 0 : 0;
  return "INV-" + String(lastNum + 1).padStart(3, "0");
}

/* ── CREATE invoice ── */
export async function createInvoice(input: InvoiceInput) {
  await requireAdmin();

  const existing = await prisma.invoice.findUnique({
    where: { num: input.num },
  });
  if (existing) {
    return { error: "Invoice number already exists" };
  }

  const invoice = await prisma.invoice.create({
    data: {
      num: input.num,
      clientId: input.clientId,
      issued: new Date(input.issued + "T12:00:00Z"),
      due: new Date(input.due + "T12:00:00Z"),
      status: input.status,
      tax: input.tax,
      bank: input.bank,
      notes: input.notes,
      items: {
        create: input.items
          .filter((i) => i.desc.trim())
          .map((i) => ({
            desc: i.desc,
            qty: i.qty,
            price: i.price,
          })),
      },
    },
    include: { items: true },
  });

  return { success: true, invoice };
}

/* ── UPDATE invoice ── */
export async function updateInvoice(id: string, input: InvoiceInput) {
  await requireAdmin();

  // check num uniqueness (excluding self)
  const dup = await prisma.invoice.findFirst({
    where: { num: input.num, NOT: { id } },
  });
  if (dup) {
    return { error: "Invoice number already exists" };
  }

  // delete old items, create new
  await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      num: input.num,
      clientId: input.clientId,
      issued: new Date(input.issued + "T12:00:00Z"),
      due: new Date(input.due + "T12:00:00Z"),
      status: input.status,
      tax: input.tax,
      bank: input.bank,
      notes: input.notes,
      items: {
        create: input.items
          .filter((i) => i.desc.trim())
          .map((i) => ({
            desc: i.desc,
            qty: i.qty,
            price: i.price,
          })),
      },
    },
    include: { items: true },
  });

  return { success: true, invoice };
}

/* ── DELETE invoice ── */
export async function deleteInvoice(id: string) {
  await requireAdmin();
  await prisma.invoice.delete({ where: { id } });
  return { success: true };
}

/* ── MARK status ── */
export async function markInvoiceStatus(
  id: string,
  status: "Paid" | "Unpaid" | "Overdue" | "Draft",
) {
  await requireAdmin();
  await prisma.invoice.update({ where: { id }, data: { status } });
  return { success: true };
}
