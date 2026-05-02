import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const record = await prisma.screenSession.create({
    data: {
      agentId: session.user.id!,
      agentName: session.user.name ?? "Agent",
      status: "waiting",
    },
  });

  return NextResponse.json({ id: record.id });
}
