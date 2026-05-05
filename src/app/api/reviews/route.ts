import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(10, "Review must be at least 10 characters").max(500),
  role: z.string().max(100),
});

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      quote: true,
      role: true,
      createdAt: true,
      user: {
        select: { firstName: true, lastName: true, image: true },
      },
    },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const existing = await prisma.review.findFirst({
    where: { userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You have already submitted a review." },
      { status: 409 },
    );
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      rating: parsed.data.rating,
      quote: parsed.data.quote,
      role: parsed.data.role,
    },
    select: {
      id: true,
      rating: true,
      quote: true,
      role: true,
      createdAt: true,
      user: { select: { firstName: true, lastName: true, image: true } },
    },
  });

  return NextResponse.json(review, { status: 201 });
}
