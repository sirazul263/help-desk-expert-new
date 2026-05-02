import { auth } from "@/lib/auth";
import AdminChatClient from "./AdminChatClient";

export default async function AdminChatPage() {
  const session = await auth();
  return <AdminChatClient currentAdminId={session?.user?.id ?? null} />;
}
