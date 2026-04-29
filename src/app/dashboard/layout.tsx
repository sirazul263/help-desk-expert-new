import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <Link href="/" className="dash-logo">
          HelpDesk<span>Expert</span>
        </Link>

        <nav className="dash-nav">
          <Link href="/dashboard" className="dash-nav-link">
            Overview
          </Link>
          <Link href="/dashboard/profile" className="dash-nav-link">
            Profile
          </Link>
          <Link href="/dashboard/change-password" className="dash-nav-link">
            Change Password
          </Link>
        </nav>

        <div className="dash-sidebar-footer">
          <p className="dash-user-name">{session.user.name}</p>
          <p className="dash-user-email">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut({ redirect: false });
              redirect("/login");
            }}
          >
            <button type="submit" className="dash-logout-btn">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
