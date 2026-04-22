import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const perPage = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("perPage") || "10")),
    );
    const q = url.searchParams.get("q") || undefined;
    const role = url.searchParams.get("role") || undefined;
    const isActiveParam = url.searchParams.get("isActive");
    const isActive =
      isActiveParam == null ? undefined : isActiveParam === "true";

    const where: any = {};
    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;
    if (typeof isActive !== "undefined") where.isActive = isActive;

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        company: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return new Response(JSON.stringify({ users, total, page, perPage }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
    });
  }
}
