import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Get all ICE candidates for a given role (agent fetches client's, client fetches agent's)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = req.nextUrl.searchParams.get("role") ?? "agent";

  const candidates = await prisma.screenIceCandidate.findMany({
    where: { sessionId: id, role },
    select: { id: true, candidate: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ candidates });
}

// Store a new ICE candidate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { role, candidate } = await req.json() as { role: string; candidate: string };

  await prisma.screenIceCandidate.create({
    data: { sessionId: id, role, candidate },
  });

  return NextResponse.json({ success: true });
}
