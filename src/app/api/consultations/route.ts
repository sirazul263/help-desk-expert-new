import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  role: z.string().min(1),
  website: z.string().default(""),
  agents: z.string().min(1),
  channels: z.array(z.string()).default([]),
  volume: z.string().min(1),
  tool: z.string().default(""),
  notes: z.string().default(""),
  date: z.string().min(1),
  time: z.string().min(1),
  timezone: z.string().min(1),
  source: z.string().default(""),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { channels, ...rest } = parsed.data;

  const consultation = await prisma.consultation.create({
    data: { ...rest, channels: channels.join(", ") },
  });

  return NextResponse.json(consultation, { status: 201 });
}
