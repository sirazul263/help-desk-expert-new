import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <Link href="/" className="dash-logo">
          HelpDesk<span>Expert</span>
        </Link>
        <span className="dash-badge dash-badge-admin">Admin</span>

        <nav className="dash-nav">
          <Link href="/admin" className="dash-nav-link">
            Dashboard
          </Link>
          <Link href="/admin/users" className="dash-nav-link">
            Users
          </Link>
        </nav>

        <div className="dash-sidebar-footer">
          <p className="dash-user-name">{session.user.name}</p>
          <p className="dash-user-email">{session.user.email}</p>
          <form action={async () => { "use server"; const { signOut } = await import("@/lib/auth"); await signOut({ redirect: false }); redirect("/login"); }}>
            <button type="submit" className="dash-logout-btn">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
