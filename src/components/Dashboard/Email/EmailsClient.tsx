"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { getSentEmails } from "@/actions/emailCampaign";
import { initials, avatarColors, avatarTextColors } from "@/types/admin";

type SentEmail = {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string | Date;
  status: string;
  error: string | null;
  admin: { firstName: string; lastName: string; email: string };
};

export default function EmailsClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const perPage = 10;

  const { data: sentEmails = [], isLoading } = useQuery<SentEmail[]>({
    queryKey: ["sent-emails"],
    queryFn: () => getSentEmails(),
  });

  const filtered = (sentEmails as SentEmail[]).filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.to.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      `${e.admin.firstName} ${e.admin.lastName}`.toLowerCase().includes(q);
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);

  const fmtDateTime = (d: string | Date) =>
    new Date(d).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-header-left">
          <h3>Sent Emails</h3>
          <input
            className="table-search"
            type="text"
            placeholder="Search recipient, subject…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          >
            <option value="">All statuses</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
          {(search || statusFilter) && (
            <button
              className="filter-clear-btn"
              onClick={() => { setSearch(""); setStatusFilter(""); setPage(0); }}
            >
              Clear
            </button>
          )}
        </div>
        <Link href="/admin/emails/compose" className="btn-primary" style={{ display: "inline-flex", alignItems: "center" }}>
          + Send Email
        </Link>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Subject</th>
            <th>Sent By</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="empty-row">
              <td colSpan={6}>Loading…</td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={6}>No emails found.</td>
            </tr>
          ) : (
            paginated.map((email, idx) => {
              const ci = idx % avatarColors.length;
              const adminName = `${email.admin.firstName} ${email.admin.lastName}`;
              const isExpanded = expandedId === email.id;
              return (
                <Fragment key={email.id}>
                  <tr>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                        <span
                          className="cl-avatar"
                          style={{ background: avatarColors[ci], color: avatarTextColors[ci] }}
                        >
                          {initials(email.to.split("@")[0])}
                        </span>
                        <span style={{ fontSize: ".84rem", fontWeight: 500 }}>{email.to}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: ".84rem" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                        {email.subject}
                      </div>
                    </td>
                    <td style={{ fontSize: ".8rem", color: "var(--color-muted)" }}>{adminName}</td>
                    <td style={{ fontSize: ".8rem" }}>{fmtDateTime(email.sentAt)}</td>
                    <td>
                      <span className={`inv-badge ${email.status === "sent" ? "b-paid" : "b-overdue"}`}>
                        {email.status === "sent" ? "Sent" : "Failed"}
                      </span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button
                          className="btn-ghost"
                          onClick={() => setExpandedId(isExpanded ? null : email.id)}
                        >
                          {isExpanded ? "Hide" : "Preview"}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ background: "var(--color-bg-alt, #f8fafc)" }}>
                      <td colSpan={6} style={{ padding: ".75rem 1.25rem 1rem" }}>
                        {email.status === "failed" && email.error && (
                          <div style={{
                            marginBottom: ".5rem",
                            padding: ".4rem .75rem",
                            background: "rgba(239,68,68,.08)",
                            borderRadius: "6px",
                            fontSize: ".78rem",
                            color: "var(--color-error, #ef4444)",
                          }}>
                            Error: {email.error}
                          </div>
                        )}
                        <div style={{
                          whiteSpace: "pre-wrap",
                          fontSize: ".83rem",
                          lineHeight: "1.65",
                          color: "var(--color-text, #334155)",
                          background: "#fff",
                          border: "1px solid var(--color-border, #e2e8f0)",
                          borderRadius: "6px",
                          padding: ".75rem 1rem",
                          maxHeight: 240,
                          overflowY: "auto",
                        }}>
                          {email.body}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".75rem 1rem" }}>
        <ReactPaginate
          pageCount={pageCount}
          forcePage={page}
          onPageChange={({ selected }) => setPage(selected)}
          containerClassName="pagination"
          pageLinkClassName="btn-secondary"
          activeClassName="active"
          previousLabel="Prev"
          nextLabel="Next"
          previousLinkClassName="btn-secondary"
          nextLinkClassName="btn-secondary"
          disabledClassName="disabled"
          breakLabel="..."
          breakLinkClassName="btn-secondary"
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
        />
        <div style={{ color: "var(--color-muted)", fontSize: ".82rem" }}>
          {filtered.length} email{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
