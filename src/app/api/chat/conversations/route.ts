import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

// Create or retrieve an existing open conversation
export async function POST(req: NextRequest) {
  const session = await auth();
  const { email, name } = await req.json();

  const userEmail = session?.user?.email ?? email;
  if (!userEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Find existing open conversation for this email
  let conversation = await prisma.chatConversation.findFirst({
    where: { email: userEmail, status: "open" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  let isNew = false;
  if (!conversation) {
    conversation = await prisma.chatConversation.create({
      data: {
        email: userEmail,
        name: name || "",
        userId: session?.user?.id ?? null,
      },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    isNew = true;
  }

  if (isNew) {
    await pusher.trigger("admin", "new-conversation", {
      conversationId: conversation.id,
      email: userEmail,
      name: name || "",
    });
  }

  return NextResponse.json(conversation);
}
