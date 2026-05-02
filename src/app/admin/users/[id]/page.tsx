import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Mail, Building2, Calendar, Clock, FileText, MessageSquare } from "lucide-react";

function statusBadgeClass(status: string) {
  switch (status) {
    case "Paid": return "b-paid";
    case "Unpaid": return "b-unpaid";
    case "Overdue": return "b-overdue";
    default: return "b-draft";
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      company: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLogin: true,
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, num: true, status: true, issued: true, due: true },
      },
      chatConversations: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, email: true, name: true, status: true, createdAt: true },
      },
      _count: { select: { invoices: true, chatConversations: true } },
    },
  });

  if (!user) notFound();

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const isAdmin = user.role === "ADMIN";

  async function toggleStatus() {
    "use server";
    await prisma.user.update({
      where: { id },
      data: { isActive: !user!.isActive },
    });
    revalidatePath(`/admin/users/${id}`);
  }

  return (
    <div className="adm-content" style={{ maxWidth: 900 }}>
      {/* Back */}
      <Link
        href="/admin/users"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.82rem",
          color: "var(--color-muted)",
          marginBottom: "1.25rem",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
        className="adm-back-link"
      >
        <ArrowLeft size={14} /> All Users
      </Link>

      {/* Profile card */}
      <div className="table-card" style={{ marginBottom: "1.25rem" }}>
        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: isAdmin
                ? "rgba(255,92,53,0.15)"
                : "rgba(100,150,255,0.15)",
              color: isAdmin ? "var(--color-brand)" : "#6496ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "1.5rem",
              flexShrink: 0,
              border: `2px solid ${isAdmin ? "rgba(255,92,53,0.3)" : "rgba(100,150,255,0.3)"}`,
            }}
          >
            {initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                flexWrap: "wrap",
                marginBottom: "0.75rem",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-syne)",
                }}
              >
                {fullName}
              </h2>
              <span
                className={`inv-badge ${isAdmin ? "b-paid" : "b-unpaid"}`}
                style={{ fontSize: "0.65rem" }}
              >
                {user.role}
              </span>
              <span
                className={`inv-badge ${user.isActive ? "b-paid" : "b-overdue"}`}
                style={{ fontSize: "0.65rem" }}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.45rem 1.5rem",
                fontSize: "0.82rem",
                color: "var(--color-muted)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={13} />
                <span style={{ color: "var(--color-text)" }}>{user.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Building2 size={13} />
                <span style={{ color: "var(--color-text)" }}>
                  {user.company || "—"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={13} />
                Joined{" "}
                <span style={{ color: "var(--color-text)" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={13} />
                Last login{" "}
                <span style={{ color: "var(--color-text)" }}>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle action */}
          <form action={toggleStatus}>
            <button
              type="submit"
              className={user.isActive ? "btn-danger" : "btn-success"}
              style={{ fontSize: "0.8rem" }}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
          </form>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderRight: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <FileText size={20} style={{ color: "var(--color-muted)" }} />
            <div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-syne)",
                  lineHeight: 1,
                }}
              >
                {user._count.invoices}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--color-muted)" }}>
                Invoices
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <MessageSquare size={20} style={{ color: "var(--color-muted)" }} />
            <div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-syne)",
                  lineHeight: 1,
                }}
              >
                {user._count.chatConversations}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--color-muted)" }}>
                Conversations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="table-card" style={{ marginBottom: "1.25rem" }}>
        <div className="table-header">
          <h3>Recent Invoices</h3>
          <Link
            href="/admin/invoices"
            style={{
              fontSize: "0.78rem",
              color: "var(--color-brand)",
              textDecoration: "none",
            }}
          >
            View all
          </Link>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Status</th>
              <th>Issued</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {user.invoices.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={4}>No invoices yet.</td>
              </tr>
            ) : (
              user.invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600, fontFamily: "var(--font-syne)" }}>
                    {inv.num}
                  </td>
                  <td>
                    <span
                      className={`inv-badge ${statusBadgeClass(inv.status)}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>{new Date(inv.issued).toLocaleDateString()}</td>
                  <td>{new Date(inv.due).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Conversations */}
      <div className="table-card">
        <div className="table-header">
          <h3>Recent Chat Conversations</h3>
          <Link
            href="/admin/chat"
            style={{
              fontSize: "0.78rem",
              color: "var(--color-brand)",
              textDecoration: "none",
            }}
          >
            Go to chat
          </Link>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Name / Email</th>
              <th>Status</th>
              <th>Started</th>
            </tr>
          </thead>
          <tbody>
            {user.chatConversations.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={3}>No conversations yet.</td>
              </tr>
            ) : (
              user.chatConversations.map((convo) => (
                <tr key={convo.id}>
                  <td>{convo.name || convo.email}</td>
                  <td>
                    <span
                      className={`inv-badge ${convo.status === "open" ? "b-paid" : "b-draft"}`}
                    >
                      {convo.status}
                    </span>
                  </td>
                  <td>{new Date(convo.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
