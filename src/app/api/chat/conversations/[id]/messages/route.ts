import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

// GET messages for a conversation (with polling support via ?after=lastMessageId)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const after = req.nextUrl.searchParams.get("after");

  const where: Record<string, unknown> = { conversationId: id };
  if (after) {
    const lastMsg = await prisma.chatMessage.findUnique({
      where: { id: after },
    });
    if (lastMsg) {
      where.createdAt = { gt: lastMsg.createdAt };
    }
  }

  const messages = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

// POST a new message to the conversation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { sender, body, fileUrl, fileName, fileType } = await req.json();

  if (!sender || (!body && !fileUrl)) {
    return NextResponse.json(
      { error: "Message body or file required" },
      { status: 400 },
    );
  }

  // Attach admin info when an admin user is sending a message
  const session = await auth();
  const adminId = session?.user?.role === "ADMIN" ? session.user.id : null;
  const adminName =
    session?.user?.role === "ADMIN"
      ? (session.user.name ?? session.user.email)
      : null;

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: id,
      sender,
      body: body || "",
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null,
      adminId: adminId || null,
      adminName: adminName || null,
    },
  });

  // Update conversation updatedAt
  await prisma.chatConversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  await Promise.all([
    pusher.trigger(`chat-${id}`, "new-message", message),
    pusher.trigger("admin", "conversation-updated", { conversationId: id }),
  ]);

  return NextResponse.json(message);
}
