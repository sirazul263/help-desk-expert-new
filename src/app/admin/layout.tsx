import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import QueryProvider from "@/lib/query-provider";
import AdminSidebar from "@/components/Dashboard/AdminSidebar";
import AdminTopbar from "@/components/Dashboard/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  return (
    <QueryProvider>
      <div className="adm-shell">
        <AdminSidebar />
        <main className="adm-main">
          <AdminTopbar title="Admin" />
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
