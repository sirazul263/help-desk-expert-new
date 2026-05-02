import { auth } from "@/lib/auth";
import ScreenClientViewer from "./ScreenClientViewer";

export default async function ScreenClientPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const userName = session?.user?.name ?? "Client";
  const initialSessionId = params.session ?? null;

  return (
    <ScreenClientViewer
      userName={userName}
      initialSessionId={initialSessionId}
    />
  );
}
