import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - update typing status (store in memory via a simple approach)
// We use a global Map to track typing status since it's ephemeral
const typingMap = new Map<string, { sender: string; timestamp: number }>();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { sender } = await req.json();

  typingMap.set(`${id}:${sender}`, { sender, timestamp: Date.now() });

  return NextResponse.json({ ok: true });
}

// GET - check if someone is typing
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const checkSender = req.nextUrl.searchParams.get("sender"); // who we're checking FOR

  // Check if the OTHER party is typing
  const otherSender = checkSender === "user" ? "admin" : "user";
  const entry = typingMap.get(`${id}:${otherSender}`);

  const isTyping = entry ? Date.now() - entry.timestamp < 3000 : false;

  return NextResponse.json({ isTyping, sender: otherSender });
}
