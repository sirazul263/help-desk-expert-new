import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserNavLinks from "@/components/Dashboard/UserNavLinks";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");

  const name = session.user.name ?? "User";
  const email = session.user.email ?? "";
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">

        {/* ── Brand ── */}
        <div className="dash-sidebar-brand">
          <Link href="/" className="dash-logo">
            HelpDesk<span>Xpert</span>
          </Link>
          <span className="dash-plan-badge">Client Portal</span>
        </div>

        {/* ── Nav section label ── */}
        <div className="dash-nav-section">
          <p className="dash-nav-label">Navigation</p>
          <UserNavLinks />
        </div>

        {/* ── Footer / user card ── */}
        <div className="dash-sidebar-footer">
          <div className="dash-user-card">
            <div className="dash-user-avatar">{initials}</div>
            <div className="dash-user-info">
              <p className="dash-user-name">{name}</p>
              <p className="dash-user-email">{email}</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut({ redirect: false });
              redirect("/login");
            }}
          >
            <button type="submit" className="dash-logout-btn">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </form>
        </div>

      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
