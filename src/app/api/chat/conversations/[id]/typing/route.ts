import { NextRequest, NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { sender, action } = await req.json();

  const event = action === "stop" ? "user-stop-typing" : "user-typing";
  await pusher.trigger(`chat-${id}`, event, { sender });

  return NextResponse.json({ ok: true });
}
