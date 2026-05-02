import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Get current offer/answer for this session
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
    select: { offer: true, answer: true, status: true },
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    offer: record.offer,
    answer: record.answer,
    status: record.status,
  });
}

// Post offer (agent) or answer (client)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { type, sdp } = await req.json() as { type: "offer" | "answer"; sdp: string };

  if (type === "offer") {
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.screenSession.update({
      where: { id },
      data: { offer: sdp, status: "live" },
    });
  } else {
    await prisma.screenSession.update({
      where: { id },
      data: { answer: sdp },
    });
  }

  return NextResponse.json({ success: true });
}
