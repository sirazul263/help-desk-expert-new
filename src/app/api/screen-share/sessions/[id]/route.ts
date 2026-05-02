import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const record = await prisma.screenSession.findUnique({
    where: { id },
    select: {
      id: true,
      agentName: true,
      status: true,
      offer: true,
      answer: true,
      createdAt: true,
    },
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: record.id,
    agentName: record.agentName,
    status: record.status,
    hasOffer: !!record.offer,
    hasAnswer: !!record.answer,
    createdAt: record.createdAt,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json() as { status: string };

  await prisma.screenSession.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ success: true });
}
