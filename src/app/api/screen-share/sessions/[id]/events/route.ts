import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const encoder = new TextEncoder();

  // Cursor starts at now — we only push messages created after the SSE connects
  let sinceTime = Date.now();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
            )
          );
        } catch {
          // client disconnected
        }
      };

      // Send a keep-alive comment every 20s so proxies don't time out
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 20_000);

      const poll = setInterval(async () => {
        try {
          const [newMsgs, record] = await Promise.all([
            prisma.screenChatMsg.findMany({
              where: {
                sessionId: id,
                createdAt: { gt: new Date(sinceTime) },
              },
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                role: true,
                name: true,
                text: true,
                createdAt: true,
              },
            }),
            prisma.screenSession.findUnique({
              where: { id },
              select: { status: true },
            }),
          ]);

          for (const msg of newMsgs) {
            send("chat", msg);
            sinceTime = Math.max(sinceTime, msg.createdAt.getTime() + 1);
          }

          if (record?.status === "ended") {
            send("ended", {});
            clearInterval(poll);
            clearInterval(keepAlive);
            controller.close();
          }
        } catch {
          clearInterval(poll);
          clearInterval(keepAlive);
          try {
            controller.close();
          } catch {}
        }
      }, 1_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(poll);
        clearInterval(keepAlive);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
