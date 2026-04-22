import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const latestUsers = await prisma.user.findMany({
      where: {},
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, firstName: true, lastName: true, createdAt: true },
    });

    const latestInvoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, num: true, status: true, createdAt: true },
    });

    const notifications = [
      ...latestUsers.map((u) => ({
        id: `user-${u.id}`,
        type: "user",
        text: `New user: ${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
        url: `/admin/users`,
        createdAt: u.createdAt,
      })),
      ...latestInvoices.map((i) => ({
        id: `inv-${i.id}`,
        type: "invoice",
        text: `Invoice ${i.num} — ${i.status}`,
        url: `/admin/invoices`,
        createdAt: i.createdAt,
      })),
    ].slice(0, 8);

    return new Response(JSON.stringify({ notifications }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to load notifications" }),
      { status: 500 },
    );
  }
}
