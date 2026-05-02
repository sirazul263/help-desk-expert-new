import { auth } from "@/lib/auth";
import ScreenAgentClient from "./ScreenAgentClient";

export default async function ScreenAgentPage() {
  const session = await auth();
  return (
    <ScreenAgentClient
      agentName={session?.user?.name ?? "Agent"}
      agentId={session?.user?.id ?? ""}
    />
  );
}
