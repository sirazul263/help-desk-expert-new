"use client";

import { Fragment, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import {
  getPromoRecipients,
  getPromoCampaigns,
  sendPromotionalEmails,
} from "@/actions/promotionalEmail";
import { showToast } from "../AdminToast";
import { avatarColors, avatarTextColors, initials } from "@/types/admin";

const DEFAULT_SUBJECT = "World-Class Support, On Demand — HelpDesk Expert";

type Recipient = { email: string; firstName: string; lastName: string };

type CampaignRecipient = {
  id: string;
  email: string;
  status: string;
  error: string | null;
};

type Campaign = {
  id: string;
  subject: string;
  sentAt: string | Date;
  total: number;
  succeeded: number;
  failed: number;
  admin: { firstName: string; lastName: string };
  recipients: CampaignRecipient[];
};

export default function PromoClient() {
  const qc = useQueryClient();

  /* ── Modal state ── */
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [emailInput, setEmailInput] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    succeeded: number;
    failed: number;
  } | null>(null);

  /* ── Table state ── */
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recipientFilter, setRecipientFilter] = useState("");
  const perPage = 10;

  const { data: registeredUsers = [] } = useQuery<Recipient[]>({
    queryKey: ["promo-recipients"],
    queryFn: () => getPromoRecipients(),
  });

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["promo-campaigns"],
    queryFn: () => getPromoCampaigns(),
  });

  /* ── Email parsing ── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const parsedEmails = [
    ...new Set(
      emailInput
        .split(/[\n,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => EMAIL_RE.test(e)),
    ),
  ];

  const canSend = subject.trim().length > 0 && parsedEmails.length > 0 && !sending;

  const openModal = () => {
    setResult(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (sending) return;
    setShowModal(false);
  };

  const handleLoadUsers = () => {
    const emails = registeredUsers.map((u) => u.email).join("\n");
    setEmailInput(emails);
    showToast(`Loaded ${registeredUsers.length} registered users`, "success");
  };

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setResult(null);
    const res = await sendPromotionalEmails(parsedEmails, subject.trim());
    setSending(false);

    if ("error" in res && res.error) {
      showToast(res.error, "error");
      return;
    }

    const r = res as { total: number; succeeded: number; failed: number };
    setResult(r);
    qc.invalidateQueries({ queryKey: ["promo-campaigns"] });
    showToast(
      `Sent ${r.succeeded}/${r.total}${r.failed > 0 ? ` — ${r.failed} failed` : ""}`,
      r.failed === 0 ? "success" : "error",
    );

    if (r.failed === 0) {
      setEmailInput("");
      setSubject(DEFAULT_SUBJECT);
      setShowModal(false);
    }
  };

  /* ── Table helpers ── */
  const fmtDateTime = (d: string | Date) =>
    new Date(d).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredCampaigns = (campaigns as Campaign[]).filter((c) => {
    if (!recipientFilter) return true;
    return c.recipients.some((r) =>
      r.email.toLowerCase().includes(recipientFilter.toLowerCase()),
    );
  });

  const pageCount = Math.max(1, Math.ceil(filteredCampaigns.length / perPage));
  const paginated = filteredCampaigns.slice(page * perPage, (page + 1) * perPage);

  return (
    <>
      {/* ── Campaign history table ── */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-header-left">
            <h3>Campaign History</h3>
            <input
              className="table-search"
              type="text"
              placeholder="Filter by recipient email…"
              value={recipientFilter}
              onChange={(e) => { setRecipientFilter(e.target.value); setPage(0); }}
            />
            {recipientFilter && (
              <button
                className="filter-clear-btn"
                onClick={() => { setRecipientFilter(""); setPage(0); }}
              >
                Clear
              </button>
            )}
          </div>
          <button
            className="btn-primary"
            onClick={openModal}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Send Promotional Email
          </button>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Sent By</th>
              <th>Date</th>
              <th>Total</th>
              <th>Sent</th>
              <th>Failed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="empty-row"><td colSpan={7}>Loading…</td></tr>
            ) : filteredCampaigns.length === 0 ? (
              <tr className="empty-row"><td colSpan={7}>No campaigns yet.</td></tr>
            ) : (
              paginated.map((campaign) => {
                const isExpanded = expandedId === campaign.id;
                const adminName = `${campaign.admin.firstName} ${campaign.admin.lastName}`;
                return (
                  <Fragment key={campaign.id}>
                    <tr>
                      <td style={{ maxWidth: 220 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220, fontSize: ".84rem", fontWeight: 500 }}>
                          {campaign.subject}
                        </div>
                      </td>
                      <td style={{ fontSize: ".8rem", color: "var(--color-muted)" }}>{adminName}</td>
                      <td style={{ fontSize: ".8rem" }}>{fmtDateTime(campaign.sentAt)}</td>
                      <td style={{ fontSize: ".84rem", fontWeight: 600 }}>{campaign.total}</td>
                      <td><span className="inv-badge b-paid">{campaign.succeeded}</span></td>
                      <td>
                        {campaign.failed > 0
                          ? <span className="inv-badge b-overdue">{campaign.failed}</span>
                          : <span style={{ color: "var(--color-muted)", fontSize: ".8rem" }}>—</span>}
                      </td>
                      <td>
                        <div className="td-actions">
                          <button
                            className="btn-ghost"
                            onClick={() => setExpandedId(isExpanded ? null : campaign.id)}
                          >
                            {isExpanded ? "Hide" : `Recipients (${campaign.total})`}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr style={{ background: "var(--color-bg-alt,#1e2130)" }}>
                        <td colSpan={7} style={{ padding: ".75rem 1.25rem 1rem" }}>
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: ".45rem",
                            maxHeight: 280,
                            overflowY: "auto",
                          }}>
                            {campaign.recipients.map((r, i) => {
                              const ci = i % avatarColors.length;
                              return (
                                <div key={r.id} style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".5rem",
                                  padding: ".4rem .6rem",
                                  borderRadius: "6px",
                                  background: r.status === "failed" ? "rgba(255,79,79,.07)" : "rgba(46,204,138,.05)",
                                  border: `1px solid ${r.status === "failed" ? "rgba(255,79,79,.18)" : "rgba(46,204,138,.15)"}`,
                                }}>
                                  <span className="cl-avatar" style={{ background: avatarColors[ci], color: avatarTextColors[ci], width: 26, height: 26, fontSize: ".62rem" }}>
                                    {initials(r.email.split("@")[0])}
                                  </span>
                                  <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ fontSize: ".78rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {r.email}
                                    </div>
                                    {r.status === "failed" && r.error && (
                                      <div style={{ fontSize: ".7rem", color: "var(--color-error)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {r.error}
                                      </div>
                                    )}
                                  </div>
                                  <span className={`inv-badge ${r.status === "sent" ? "b-paid" : "b-overdue"}`} style={{ fontSize: ".62rem", padding: ".15rem .5rem", flexShrink: 0 }}>
                                    {r.status}
                                  </span>
                                </div>
                              );
                            })}
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
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* ── Compose modal ── */}
      {showModal && (
        <div
          className="adm-overlay open"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="adm-modal" style={{ maxWidth: 620 }}>
            <div className="adm-modal-hdr">
              <h3>Send Promotional Email</h3>
              <button className="adm-modal-close" onClick={closeModal} aria-label="Close" disabled={sending}>✕</button>
            </div>

            <div className="adm-modal-body">
              {/* Subject */}
              <div className="adm-field">
                <label>Email Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line…"
                />
              </div>

              {/* Recipients */}
              <div className="adm-field">
                <label>
                  Recipients
                  <span className="hint" style={{ display: "inline", marginLeft: ".4rem" }}>
                    (one per line, or comma / semicolon separated)
                  </span>
                </label>
                <textarea
                  rows={6}
                  placeholder={"user@example.com\nanother@example.com"}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ".35rem" }}>
                  <span className="hint">
                    {emailInput.trim()
                      ? `${parsedEmails.length} valid address${parsedEmails.length !== 1 ? "es" : ""} detected`
                      : "Enter email addresses above"}
                  </span>
                  <button
                    className="btn-secondary"
                    onClick={handleLoadUsers}
                    style={{ fontSize: ".75rem", padding: "4px 10px" }}
                  >
                    Load all users ({registeredUsers.length})
                  </button>
                </div>
              </div>

              {/* Result banner */}
              {result && (
                <div style={{
                  padding: ".6rem .9rem",
                  borderRadius: "8px",
                  fontSize: ".82rem",
                  background: result.failed === 0 ? "rgba(46,204,138,.1)" : "rgba(255,176,32,.1)",
                  border: `1px solid ${result.failed === 0 ? "rgba(46,204,138,.3)" : "rgba(255,176,32,.35)"}`,
                  color: result.failed === 0 ? "var(--color-success)" : "var(--color-warning,#ffb020)",
                }}>
                  {result.succeeded}/{result.total} sent successfully
                  {result.failed > 0 && ` · ${result.failed} failed (logged in history)`}
                </div>
              )}
            </div>

            <div className="adm-modal-ftr">
              <button className="btn-secondary" onClick={closeModal} disabled={sending}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={!canSend}
                onClick={handleSend}
                style={{ minWidth: 160, opacity: !canSend ? .55 : 1 }}
              >
                {sending
                  ? `Sending… (${parsedEmails.length})`
                  : `Send to ${parsedEmails.length || "—"} recipients`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
