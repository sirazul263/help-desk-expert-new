import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

// Mark messages as read
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { sender } = await req.json();

  // Mark all messages from the OTHER sender as read
  const otherSender = sender === "user" ? "admin" : "user";

  await prisma.chatMessage.updateMany({
    where: {
      conversationId: id,
      sender: otherSender,
      isRead: false,
    },
    data: { isRead: true },
  });

  await pusher.trigger(`chat-${id}`, "messages-seen", { reader: sender });

  return NextResponse.json({ ok: true });
}
