"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

let globalSocket: Socket | null = null;

export function getSocket(): Socket {
  if (!globalSocket) {
    const url =
      typeof window !== "undefined" && process.env.NEXT_PUBLIC_SOCKET_URL
        ? process.env.NEXT_PUBLIC_SOCKET_URL
        : undefined;

    const opts: any = {
      path: "/api/socketio",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
    };

    // If a remote URL is provided, use it (Render deployment)
    globalSocket = url ? io(url, opts) : io(opts);
  }
  return globalSocket;
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
