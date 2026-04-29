import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminSidebar() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-logo">
        <Link href="/">
          <div className="adm-brand">
            <span className="adm-brand-main">HelpDesk</span>
            <span className="adm-brand-accent">Expert</span>
          </div>
        </Link>
        <small>Admin Panel</small>
      </div>

      <div className="adm-nav-section">
        <div className="adm-nav-label">User</div>
        <Link href="/admin" className="adm-nav-item">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Dashboard</span>
        </Link>
        <Link href="/admin/invoices" className="adm-nav-item">
          <svg viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>Invoices</span>
        </Link>
        <Link href="/admin/users" className="adm-nav-item">
          <svg viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Users</span>
        </Link>
      </div>

      <div className="adm-nav-section">
        <div className="adm-nav-label">Customers</div>
        <Link href="/admin/customers" className="adm-nav-item">
          <svg viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>Customers</span>
        </Link>
        <Link href="/admin/chat" className="adm-nav-item">
          <svg viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Chat</span>
        </Link>
      </div>

      <div className="adm-sidebar-footer">
        <div className="adm-user-name">{session.user.name}</div>
        <div className="adm-user-email">{session.user.email}</div>
        <form
          action={async () => {
            "use server";
            const { signOut } = await import("@/lib/auth");
            await signOut({ redirect: false });
            redirect("/login");
          }}
        >
          <button type="submit" className="adm-logout-btn">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
