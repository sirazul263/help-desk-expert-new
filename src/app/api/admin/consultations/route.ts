import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const consultations = await prisma.consultation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(consultations);
}
