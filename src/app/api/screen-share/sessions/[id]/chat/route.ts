import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fetch messages newer than `after` (ISO string)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const after = req.nextUrl.searchParams.get("after");

  const messages = await prisma.screenChatMsg.findMany({
    where: {
      sessionId: id,
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, name: true, text: true, createdAt: true },
  });

  return NextResponse.json({ messages });
}

// Send a chat message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { role, name, text } = await req.json() as {
    role: string;
    name: string;
    text: string;
  };

  const msg = await prisma.screenChatMsg.create({
    data: { sessionId: id, role, name, text },
    select: { id: true, role: true, name: true, text: true, createdAt: true },
  });

  return NextResponse.json(msg);
}
