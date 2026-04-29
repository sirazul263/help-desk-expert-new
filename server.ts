import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join a conversation room
    socket.on("join-conversation", (conversationId: string) => {
      socket.join(`convo:${conversationId}`);
      console.log(`[Socket.IO] ${socket.id} joined convo:${conversationId}`);
    });

    // Leave a conversation room
    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(`convo:${conversationId}`);
    });

    // Join the admin room (for receiving new conversation notifications)
    socket.on("join-admin", () => {
      socket.join("admin");
      console.log(`[Socket.IO] ${socket.id} joined admin room`);
    });

    // New message sent
    socket.on(
      "send-message",
      (data: {
        conversationId: string;
        message: {
          id: string;
          sender: string;
          body: string;
          fileUrl?: string;
          fileName?: string;
          fileType?: string;
          isRead: boolean;
          createdAt: string;
        };
      }) => {
        // Broadcast to all in the conversation room (except sender)
        socket
          .to(`convo:${data.conversationId}`)
          .emit("new-message", data.message);

        // Notify admin room about activity
        io.to("admin").emit("conversation-updated", {
          conversationId: data.conversationId,
        });
      },
    );

    // Typing indicator
    socket.on("typing", (data: { conversationId: string; sender: string }) => {
      socket
        .to(`convo:${data.conversationId}`)
        .emit("user-typing", { sender: data.sender });
    });

    // Stop typing
    socket.on(
      "stop-typing",
      (data: { conversationId: string; sender: string }) => {
        socket
          .to(`convo:${data.conversationId}`)
          .emit("user-stop-typing", { sender: data.sender });
      },
    );

    // Messages read
    socket.on(
      "messages-read",
      (data: { conversationId: string; reader: string }) => {
        socket
          .to(`convo:${data.conversationId}`)
          .emit("messages-seen", { reader: data.reader });
      },
    );

    // New conversation created (notify admins)
    socket.on(
      "new-conversation",
      (data: { conversationId: string; email: string; name: string }) => {
        io.to("admin").emit("new-conversation", data);
      },
    );

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
