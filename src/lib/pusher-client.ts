"use client";

import { useEffect, useState } from "react";
import PusherClient from "pusher-js";

let globalPusher: PusherClient | null = null;

export function getPusher(): PusherClient {
  if (!globalPusher && typeof window !== "undefined") {
    globalPusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return globalPusher!;
}

export function usePusherConnection() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const pusher = getPusher();

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);

    pusher.connection.bind("connected", onConnected);
    pusher.connection.bind("disconnected", onDisconnected);

    if (pusher.connection.state === "connected") {
      setIsConnected(true);
    }

    return () => {
      pusher.connection.unbind("connected", onConnected);
      pusher.connection.unbind("disconnected", onDisconnected);
    };
  }, []);

  return isConnected;
}
